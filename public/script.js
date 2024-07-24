login();

function post() {
  let name = document.querySelector("#user-name").value;
  let password = document.querySelector("#password");
  let password2 = document.querySelector("#password2");
  if (password.value === password2.value) {
    let toPost = { name: name, password: password.value };
    name1(toPost);
    async function name1(g) {
      let response = await fetch("/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(g),
      });
      let data = await response.json();
      console.log("data", data);
      if (data === "succses") {
        document.querySelector(".flex").innerHTML = "succses:  you logen in";
        localStorage.setItem(`${toPost.name}`, JSON.stringify(toPost));
        setTimeout(() => {
          name2(toPost);
        }, 3000);
      } else {
        document.querySelector(".flex").innerHTML = data;
        setTimeout(() => {
          signup();
        }, 3000);
      }
    }
  } else {
    document.querySelector("small").innerText = "it is not same password";
    // password2.value = "it is not same";
    // password2.id += ' password2err';
  }
}

function get() {
  let name = document.querySelector("#user-name").value;
  let password = document.querySelector("#password");
  let toPost = { name: name, password: password.value };

  name1(toPost);

  async function name1(g) {
    let response = await fetch(`/check/${g.name}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        name: `${g.name}`,
        password: `${g.password}`,
      },
    });
    let data = await response.json();

    if (data === "succses") {
      console.log(65, "here");
      localStorage.setItem(`${name}`, JSON.stringify(toPost));
      name2(toPost);
    } else {
      document.querySelector(".flex").innerHTML = data;
      setTimeout(() => {
        login();
      }, 3000);
    }
  }
}

function signup() {
  const template = document.querySelector(".signup").content.cloneNode(true);
  let pushTemplate = document.querySelector(".pushTemplate");
  pushTemplate.innerHTML = "";
  pushTemplate.appendChild(template);
}
function login() {
  const template = document.querySelector(".login").content.cloneNode(true);
  let pushTemplate = document.querySelector(".pushTemplate");
  pushTemplate.innerHTML = "";
  pushTemplate.appendChild(template);
}

async function name2(g) {
  window.location.href = `/${g.name}`;
  console.log(94, g);
  // window.location.href = await response.json();
  // console.log(data);
}
