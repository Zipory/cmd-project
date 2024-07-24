let thisLocation = `${window.location.pathname.split("/").pop()}`;
firstCheck();
async function firstCheck() {
  if (await checkPassword()) {
    openFile(thisLocation);
  } else {
    window.location.href = "/";
  }
}

async function checkPassword() {
  let localS = JSON.parse(
    localStorage.getItem(`${window.location.pathname.split("/")[1]}`)
  );
  if (localS) {
    let name = localS.name;
    let password = localS.password;

    let response = await fetch(`/check/${name}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        name: `${name}`,
        password: `${password}`,
      },
    });
    let data = await response.json();
    if (data === "succses") {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

document.querySelector("h1").innerHTML += thisLocation;

async function openFile(fileName) {
  document.querySelector("h2").innerHTML = `You are in : ${fileName}`;
  // console.log(fileName);
  let showFiles = document.querySelector(".showsFiles");
  let response = await fetch(`files/${fileName}`);
  let data = "";
  let dotFile = fileName.indexOf(".txt") !== -1; // true if data is a file.txt.
  if (dotFile) {
    data = await response.text();
  } else {
    data = await response.json();
  }

  showFiles.innerHTML = "";

  if (dotFile) {
    showFiles.innerHTML = data;
    let input = document.createElement("textarea");
    input.setAttribute("id", `setText`);
    let button = document.createElement("button");
    button.innerText = "save this";
    showFiles.appendChild(input);
    showFiles.appendChild(button);
    showFiles.querySelector("button").addEventListener("click", () => {
      let toWrite = document.querySelector("#setText").value;
      post2("write", "", toWrite);
      openFile(thisLocation);
    });
    return;
  }

  for (const iterator of data) {
    let template = "";
    if (iterator.sumOfFiles === "file") {
      template = document
        .querySelector("#fileTemplate")
        .content.cloneNode(true);
      template.querySelector("#name").innerHTML = `${iterator.name}`;
      template.querySelector("#num").innerHTML = iterator.sumOfFiles;
      template
        .querySelector(".openFile")
        .setAttribute("id", `${iterator.name}`);
      template.querySelector(".dell").setAttribute("id", `${iterator.name}`);
      template
        .querySelector(".copyInp")
        .setAttribute("id", `inp${iterator.name}`);
      template.querySelector(".copy").setAttribute("id", `${iterator.name}`);
    } else {
      template = document
        .querySelector("#folderTemplate")
        .content.cloneNode(true);
      template.querySelector("#name").innerHTML = `${iterator.name}`;
      template.querySelector("#num").innerHTML = iterator.sumOfFiles;
      template
        .querySelector(".openFile")
        .setAttribute("id", `${iterator.name}`);
      template.querySelector(".dell").setAttribute("id", `${iterator.name}`);
      template
        .querySelector(".copyInp")
        .setAttribute("id", `inp${iterator.name}`);
      template.querySelector(".copy").setAttribute("id", `${iterator.name}`);
    }

    showFiles.appendChild(template);
  }
}
function open1(event) {
  thisLocation += `/${event}`;
  openFile(thisLocation);
}
function goBack() {
  thisLocation =
    thisLocation.split("/").length === 1
      ? thisLocation
      : thisLocation.substring(0, thisLocation.lastIndexOf("/"));
  openFile(thisLocation);
}

function post2(name, toAdd, write, toDell, nameWas, nameNow, toCopy, whereTo) {
  let toPost2 = {
    name: `${name}`,
    path: `${thisLocation}`,
    toAdd: `${toAdd}`,
    write: `${write}`,
    toDell: `${toDell}`,
    nameWas: `${nameWas}`,
    nameNow: `${nameNow}`,
    toCopy: `${toCopy}`,
    whereTo: `${whereTo}`,
  };

  name1(toPost2);
  async function name1(postData) {
    let response = await fetch("/change", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    let data = await response.json();
    console.log(data);
  }
}

function dell(toDell) {
  console.log(toDell);
  post2("delete", "", "", toDell);
  openFile(thisLocation);
}

function toCopy(buttonElement) {
  let input = buttonElement.parentElement.querySelector(".copyInp");
  if (input.value) {
    post2(
      "copyFile",
      "",
      "",
      "",
      "",
      "",
      buttonElement.id,
      `${window.location.pathname.split("/").pop()}/${input.value}`
    );
  }
  input.value = "";
  openFile(thisLocation);
}

async function makeNew() {
  if (thisLocation.indexOf(".") !== -1) {
    alert("you cant add folder here!!!");
    return;
  }
  let toAdd = prompt("what is the name");
  if (toAdd) {
    post2("add", toAdd);
    thisLocation += `/${toAdd}`;
    openFile(thisLocation);
  }
}

function logOut() {
    location.href = "/";
}

async function delUser() {
    let response = await fetch("/delete-user");
    localStorage.removeItem(`${thisLocation}`);
    let data = await response.json();
    console.log(data);
    location.href = "/";
}