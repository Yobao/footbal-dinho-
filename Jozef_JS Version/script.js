"use strict";

const urlTable = "https://www.dinho.eu/api/table";
const urlLogin = "https://www.dinho.eu/api/account/login";

//Mass selectors.
const btnsHeaderModal = document.querySelectorAll(".button_header_modal");
const btnsHeaderBody = document.querySelectorAll(".button_header_body");
const modals = document.querySelectorAll(".modal");
const btnCloseModal = document.querySelectorAll(".button-close");
const bodyModals = document.querySelectorAll(".body-modal");

//The rest.
const btnLoginLogin = document.getElementById("btn-login-login");
const modalLogin = document.getElementById("modal-login");
const overlay = document.querySelector(".overlay");
const btnHomeImage = document.querySelector(".image_home");
const btnRegistration = document.getElementById("btn-registration");
const btnLogin = document.getElementById("btn-login");

const tableBody = document.getElementById("table-body");

//Login
const inputLoginName = document.getElementById("login-name");
const inputLoginPwd = document.getElementById("login-password");
const inputShowPwd = document.getElementById("login-show-pwd");
const btnAccount = document.getElementById("btn-account");
const accountDropdown = document.querySelector(".account-dropdown");
const btnBet = document.getElementById("btn-bet");

//Variables for API
let username = null;
let cfc_username = "";
let password = null;
let password2 = null;
let email = null;
let statuss = 0;
let wrongpass = 0;
let registration = 0;
let wrongreg = 0;
let passchanged = 0;
let showforgotpass = 0;
let wrongemail = 0;
let passreseted = 0;
let resetpasscode = 0;
let wrongresetpass = 0;

// FUNCTION EXPRESSION CONSTANTS/VARIABLES
//----------------------------------------------------------------------------------------------------------------------------

//Loop through modals to detect which is unhidden.
const modalsLoop = function () {
  modals.forEach(modal => {
    if (!modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
    }
  });
};

//Loop through BODY modals to detect which is unhidden.
const bodyModalsLoop = function () {
  bodyModals.forEach(modal => {
    if (!modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
    }
  });
};

//This expression resets all input fields values.
const inputClear = function () {
  inputLoginName.value = "";
  inputLoginPwd.value = "";
};

//Function expression to show modal and "overlay" div.
const openModal = function () {
  document
    .querySelector(
      `.modal-${this.id.slice(this.id.indexOf("-") + 1, this.id.length)}`
    )
    .classList.remove("hidden");
  inputClear();
  overlay.classList.remove("hidden");
};

//Function expression to hide modal and "overlay" div.
const closeModal = function () {
  if (this.className != "overlay") {
    document
      .querySelector(
        `.modal-${this.id.slice(this.id.indexOf("-") + 1, this.id.length)}`
      )
      .classList.add("hidden");
  } else {
    modalsLoop();
  }
  overlay.classList.add("hidden");
};

//Function expression to show modal and "overlay" div.
const openBodyModal = function () {
  bodyModalsLoop();
  document
    .querySelector(
      `.modal-${this.id.slice(this.id.indexOf("-") + 1, this.id.length)}`
    )
    .classList.remove("hidden");
};

// AXIOS CALL SECTION
//----------------------------------------------------------------------------------------------------------------------------

//AXIOS REQUEST. Creates table in HTML with scores.
const getDataTable = async () => {
  try {
    let response = await axios.get(urlTable);
    let data = response.data.data;
    let i = 1;

    data.forEach(row => {
      let td1 = document.createElement("td");
      let td2 = document.createElement("td");
      let td3 = document.createElement("td");
      let td4 = document.createElement("td");
      let td5 = document.createElement("td");
      let tr = document.createElement("tr");
      let position = document.createTextNode(i);
      let name = document.createTextNode(row.username);
      let score = document.createTextNode(row.score);
      let lrTip = document.createTextNode(row.last_round_tip_name);
      let lrScore = document.createTextNode(row.last_round_score);

      tr.appendChild(td1);
      td1.appendChild(position);
      tr.appendChild(td2);
      td2.appendChild(name);
      tr.appendChild(td3);
      td3.appendChild(score);
      tr.appendChild(td4);
      td4.appendChild(lrTip);
      tr.appendChild(td5);
      td5.appendChild(lrScore);

      tableBody.appendChild(tr);

      i++;
    });
  } catch (err) {
    console.error(err);
  }
};

//AXIOS REQUEST. Makes login works. Post "username" & "password" and returns token for saving login.
const logIN = () => {
  axios
    .post(urlLogin, {
      username: inputLoginName.value,
      password: inputLoginPwd.value,
    })
    .then(response => {
      localStorage.dinhotoken = response.data.token;
      console.log(localStorage.dinhotoken);
      statuss = 1;
      wrongpass = 0;

      overlay.classList.add("hidden");
      modalLogin.classList.add("hidden");
      btnLogin.classList.add("hidden");
      btnRegistration.classList.add("hidden");
      btnBet.classList.remove("hidden");
      accountDropdown.classList.remove("hidden");
    })
    .catch(() => {
      alert("Nesprávne Meno alebo Heslo. Skúste prosím ešte raz.");
      wrongpass = 1;
      password = null;
    });
};

//First try - axios GET request.
/////////////////////////////////////////////////////
/* axios
  .get(urlLogin, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
  .then(response => {
    console.log(response);
  }); */

//Second try- axios GET request using IIFE logic.
/////////////////////////////////////////////////////
/* const getData = async () => {
  try {
    const response = await axios.get(urlLogin);
    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  const test = await getData();
  console.log(test);
})(); */

//Third try - axios GET request using .then logic.
/////////////////////////////////////////////////////
/* const getData = async () => {
  try {
    const response = await axios.get(urlLogin);
    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};

getData().then(data =>
  data.forEach(row => {
    console.log(row.username);
  })
); */

//Fourth try - axios GET request using .then logic.
/////////////////////////////////////////////////////
/* const getDataTable = async () => {
  try {
    const response = await axios.get(urlLogin);
    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};

getDataTable().then(data => {
  console.log(data);
  data.forEach(row => {
    console.log(row.username);
  });
}); */

// CALL SECTION
//----------------------------------------------------------------------------------------------------------------------------
getDataTable();

// EVENT SECTION
//----------------------------------------------------------------------------------------------------------------------------

// Header + buttons
//////////////////////////////////////////////////////
//Listener for buttons which controls modals for login and reg..
btnsHeaderModal.forEach(btn => {
  btn.addEventListener("click", openModal);
});

//Listener for hiding "overlay" & active modal window.
overlay.addEventListener("click", closeModal);

//Listener for hiding "overlay" & active modal window.
document.addEventListener("keydown", function (btn) {
  if (btn.key === "Escape") {
    modalsLoop();
    overlay.classList.add("hidden");
  }
});

//Listener for enter to log in.
document
  .getElementById("modal-login")
  .addEventListener("keydown", function (btn) {
    if (btn.keyCode === 13) {
      btn.preventDefault();
      btnLoginLogin.click();
    }
  });

//Listener for hiding "overlay" & active modal window after clicking on "X" button.
btnCloseModal.forEach(btn => {
  btn.addEventListener("click", closeModal);
});

//Listener for buttons which controls body content.
btnsHeaderBody.forEach(btn => {
  btn.addEventListener("click", openBodyModal);
});

//////////////////////////////////////////////////////
btnLoginLogin.addEventListener("click", logIN);

//Listener for checkbox to show password.
//////////////////////////////////////////////////////
inputShowPwd.addEventListener("click", function () {
  if (inputLoginPwd.type === "password") {
    inputLoginPwd.type = "text";
  } else {
    inputLoginPwd.type = "password";
  }
});
