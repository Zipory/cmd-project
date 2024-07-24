const port = 1234;
let path = require('path');
let fs = require('fs');
let express = require('express');
let app = express();
app.use(express.json());

app.use(express.static("public"));
const jsonPath = `C:/Users/itamar/Desktop/with-tuvia/clone-cmd2/server/allUsers.JSON`;
const firstPath = path.resolve();

//get the name and open folder or check if it's exsist
app.post('/',(req,res) => {
    console.log(`${req.body.name}, is inside post, password: ,${req.body.password}`);
   
    let allPassword = JSON.parse(fs.readFileSync(jsonPath,'utf-8')) ;
    
    if(allPassword[`${req.body.name}`]){
        if(allPassword[`${req.body.name}`] === req.body.password){
            res.send(JSON.stringify("succses"));
            
        }else{
            res.send(JSON.stringify("we already have that name user"));
            
        }
        return;
    }
    else {
    allPassword[`${req.body.name}`] = req.body.password;
    fs.writeFileSync(jsonPath, JSON.stringify(allPassword));
    }

    const folderName = `${firstPath}/client/${req.body.name}`;
    
    try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);    
    } 
     fs.copyFileSync( `${firstPath}/public/show.html`,
                         `${firstPath}/client/${req.body.name}.html`
        );
    } catch (err) {
    console.error(`line 41: ${err}`);
    }
  

    res.send(JSON.stringify("succses"));
});
app.get('/check/:name',(req,res) => {
    console.log(req.headers.name," in get check ",req.headers.password);
    let allPassword = JSON.parse(fs.readFileSync(jsonPath,'utf-8')) ;

    if(allPassword[`${req.headers.name}`] === req.headers.password){
        res.send(JSON.stringify('succses'));
        return;
    }
    res.send(JSON.stringify("your password or name are wrong"));
});

//get the name and return his page
app.get('/:name',(req,res) => {
    if  (fs.existsSync(`${firstPath}/client/${req.params.name}.html`)) {
        res.sendFile(`${firstPath}/client/${req.params.name}.html`);
        return;  
    }
    res.sendFile(`${firstPath}/public/wrong.html`);
});
class fileForSendClass {
    constructor(name,sumOfFiles){
        this.name = name;
        this.sumOfFiles = sumOfFiles;
    }
}

//return the files
app.get('/files/*',(req,res) => {
    
   let Cpath = (req.params[0]);
   let fileForSend = [];
   
   let allInFolder = [];
   try{
     allInFolder = fs.readdirSync(`${firstPath}/client/${Cpath}`) ;
   }catch{
     allInFolder = "file";
   }
   if(allInFolder === "file"){
     res.sendFile(path.resolve(`client/${Cpath}`));
   }else{
   
        let fillNum = "";

        for (let index = 0; index < allInFolder.length; index++) {
            try{
                if (fs.existsSync(`${firstPath}/client/${Cpath}/${allInFolder[index]}`)) {
                    fillNum = fs.readdirSync(`${firstPath}/client/${Cpath}/${allInFolder[index]}`).length  ;
                }
            }catch (err) {
                fillNum = "file";
                }
                fileForSend.push(new fileForSendClass(allInFolder[index],fillNum));
        }
        
        res.send(JSON.stringify(fileForSend));
    }
});

//post to change your folder
app.post('/change',(req,res) => {
    let send = null;
    switch (req.body.name) {
        case "add":
            send = add(req.body.path,req.body.toAdd);
            break;
        case "delete":
            send = deleteFile(req.body.path,req.body.toDell);
            break;
        case "rename":
            send = renameFile(req.body.path , req.body.nameWas , req.body.nameNow);
            break;
        case "copyFile" :
            copyFile(req.body.path, req.body.toCopy, req.body.whereTo);
            break;
        case 'write' :
            writeFile(req.body.path,req.body.write);
            break;
        default:
            res.send("choose somthing");
            return;
    }
    if(send === null){
                send = "succses";
    }
    res.send(JSON.stringify(send));
})

app.get("/delete-user", (req, res) => {
    
})

function add(path,toAdd) {
    let send = "your path not good";
    if(path && toAdd){
        fs.stat(`${firstPath}/client/${path}`, (err, stats) => {
            if (err) {
              console.error('Error checking file/directory:', err);
              return;
            }
            try{
                if (!stats.isFile()) {
                    if(toAdd.indexOf('.txt') === -1){
                        fs.mkdirSync(`${firstPath}/client/${path}/${toAdd}`);
                    }else{
                        fs.writeFileSync(`${firstPath}/client/${path}/${toAdd}`,"you havw nothing write here");
                    }
                    send = null;
                } else {
                console.log(`${path} is neither a file nor a directory`);
                }
            }catch(err){
                console.log(`159: ${err}`);
            }
          });
    }
    return send;
   
    
}
function deleteFile(path,toDell) {
    let send = "your path not good";
    if(path && toDell){
        
        fs.stat(`${firstPath}/client/${path}/${toDell}`, (err, stats) => {
            if (err) {
              console.error('Error checking file/directory:', err);
              return;
            }
            if (stats.isFile()) {
                fs.unlinkSync(`${firstPath}/client/${path}/${toDell}`);
                send = null;
            } else if (stats.isDirectory()) {
                try{
                    fs.rmdirSync(`${firstPath}/client/${path}/${toDell}`);
                    send = null;
                }catch(err){
                    return  "your folder not empty";
                }
            } else {
              console.log(`${path} is neither a file nor a directory`);
            }
          });
    };
     
    return send;
}

function renameFile(path,nameWas,nameNow) {
    let send = null;
    try{
        fs.renameSync(`${firstPath}/client/${path}/${nameWas}`,
            `${firstPath}/client/${path}/${nameNow}`
        );
        
    }catch{
        send = "your path not good";
    }
    return send;
}

function copyFile(path,toCopy,whereTo) {
    console.log(path+",       ,",toCopy);
    let send = null;
    fs.stat(`${firstPath}/client/${whereTo}`, (err, stats) => {
        if (err) {
          send = "your path not good";
          return;
        }
        if (stats.isFile()) {
           send = "your put path is folder";
        } else if (stats.isDirectory()) {

            fs.stat(`${firstPath}/client/${path}/${toCopy}`, (err, stats) => {
                if (err) {
                  send = "your put path not good";
                  return;
                }
                if (stats.isFile()) {
                    fs.copyFileSync(`${firstPath}/client/${path}/${toCopy}`,
                        `${firstPath}/client/${whereTo}/${toCopy}`);
                    send = null;
                } else if (stats.isDirectory()) {
                    send = "your path is folder"
                } else {
                  console.log(`${path} is neither a file nor a directory`);
                }
              });
        } else {
          console.log(`${path} is neither a file nor a directory`);
        }
      });
}


function writeFile(path,toWrite) {
    console.log(`${toWrite}`);
    let send = "your put path not good";
    fs.stat(`${firstPath}/client/${path}`, (err, stats) => {
        if (err) {
          return "your put path not good";
        }
        if (stats.isFile()) {
            try{
                fs.writeFileSync(`${firstPath}/client/${path}`,`${toWrite}`);
                send = null;

            }catch(err){
                console.log(`255 ${err}`);
            }
        } else {
          console.log(`${path} is neither a file nor a directory`);
        }
      });
      return send;
}
// function makeNewFolder(path,toMake) {
//     try{
//         if(!fs.existsSync(`C:/Users/JBH/Desktop/tryInFolder/client/${path}/${toMake}`)){
//             fs.mkdir(`C:/Users/JBH/Desktop/tryInFolder/client/${path}/${toMake}`)
//             return "";
//         }
//     }catch(err){
//         console.log(err);
//     }
//     return "the path is not corect";
// }
// function makeNewFile(path,toMake,toWrit) {
//     try{
//         if(!fs.existsSync(`C:/Users/JBH/Desktop/tryInFolder/client/${path}/${toMake}`)){
//             fs.writeFileSync(`C:/Users/JBH/Desktop/tryInFolder/client/${path}/${toMake}`,toWrit)
//             return "";
//         }
//     }catch(err){
//         console.log(err);
//     }
//     return "the path is not corect";
// }











app.listen(port, () => {
    console.log(`listening port ${port}...`);
  });


