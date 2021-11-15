"use strict";

const urlTable = "https://www.dinho.eu/api/table";
const urlLogin = "https://www.dinho.eu/api/account/login";
const urlAutoLogin = "https://www.dinho.eu/api/account/autologin";
const urlLogOut = "https://www.dinho.eu/api/account/logout";

//Mass selectors.
const btnsHeaderModal = document.querySelectorAll(".button_header_modal");
const btnsHeaderBody = document.querySelectorAll(".button_header_body");
const modals = document.querySelectorAll(".modal");
const btnCloseModal = document.querySelectorAll(".button-close");
const bodyPages = document.querySelectorAll(".body-modal");

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

//Logout
const btnLogOut = document.getElementById("btn-logout");

//Variables for API
let username = null;
let cfc_username = "";
let password = null;
let password2 = null;
let email = null;
let statuss = false;
let wrongpass = false;
let registration = false;
let wrongreg = false;
let passchanged = false;
let showforgotpass = false;
let wrongemail = false;
let passreseted = false;
let resetpasscode = false;
let wrongresetpass = false;

// FUNCTION EXPRESSION CONSTANTS/VARIABLES
//----------------------------------------------------------------------------------------------------------------------------

//Loop through modals to detect which is unhidden.
const modalsLoop = function () {
  modals.forEach((modal) => {
    if (!modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
    }
  });
};

//Loop through BODY modals to detect which is unhidden.
const bodyPagesLoop = function () {
  bodyPages.forEach((page) => {
    if (!page.classList.contains("hidden")) {
      page.classList.add("hidden");
    }
  });
};

const test = function () {
  overlay.classList.add("hidden");
  modalLogin.classList.add("hidden");
  btnLogin.classList.add("hidden");
  btnRegistration.classList.add("hidden");
  btnBet.classList.remove("hidden");
  accountDropdown.classList.remove("hidden");
};

/* //This expression resets all input fields values.
const inputClear = function () {
  inputLoginName.value = "";
  inputLoginPwd.value = "";
}; */

//Function expression to show modal and "overlay" div.
const openModal = function () {
  document
    .querySelector(
      `.modal-${this.id.slice(this.id.indexOf("-") + 1, this.id.length)}`
    )
    .classList.remove("hidden");
  /*   inputClear(); */
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
const openBodyPage = function () {
  bodyPagesLoop();
  document
    .querySelector(
      `.modal-${this.id.slice(this.id.indexOf("-") + 1, this.id.length)}`
    )
    .classList.remove("hidden");
};

// AXIOS CALL SECTION
//----------------------------------------------------------------------------------------------------------------------------

//AXIOS REQUEST. Creates table in HTML with scores.
const getDataTable = () => {
  let i = 1;

  axios
    .get(urlTable)
    .then((response) => {
      let data = response.data.data;

      data.forEach((row) => {
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
    })
    .catch((err) => {
      console.error(err);
    });
};

//AXIOS REQUEST. Makes login works. Post "username" & "password" and returns token for saving login.
const logIN = () => {
  axios
    .post(urlLogin, {
      username: inputLoginName.value,
      password: inputLoginPwd.value,
    })
    .then((response) => {
      localStorage.setItem("dinhotoken", response.data.token);
      /*       statuss = true;
      wrongpass = false; */
      test();
    })
    .catch(() => {
      alert("Nesprávne Meno alebo Heslo. Skúste prosím ešte raz.");
    });
};

const autoLogIN = () => {
  axios
    .post(urlAutoLogin, {
      token: localStorage.dinhotoken,
    })
    .then((response) => {
      username = response.data.user;
      test();
    });
};

const logOUT = () => {
  axios
    .post(
      urlLogOut,
      { token: localStorage.dinhotoken },
      {
        headers: { Authorization: "Token " + localStorage.dinhotoken },
      }
    )
    .then(() => {
      localStorage.removeItem("dinhotoken");

      btnLogin.classList.remove("hidden");
      btnRegistration.classList.remove("hidden");
      btnBet.classList.add("hidden");
      accountDropdown.classList.add("hidden");
    })
    .catch((err) => {
      console.error(err);
    });
};

// CALL SECTION
//----------------------------------------------------------------------------------------------------------------------------
getDataTable();
autoLogIN();

// EVENT SECTION
//----------------------------------------------------------------------------------------------------------------------------

// Header + buttons
//////////////////////////////////////////////////////
//Listener for buttons which controls modals for login and reg..
btnsHeaderModal.forEach((btn) => {
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
btnCloseModal.forEach((btn) => {
  btn.addEventListener("click", closeModal);
});

//Listener for buttons which controls body content.
btnsHeaderBody.forEach((btn) => {
  btn.addEventListener("click", openBodyPage);
});

//////////////////////////////////////////////////////
btnLoginLogin.addEventListener("click", logIN);
btnLogOut.addEventListener("click", logOUT);

//Listener for checkbox to show password.
//////////////////////////////////////////////////////
inputShowPwd.addEventListener("click", function () {
  if (inputLoginPwd.type === "password") {
    inputLoginPwd.type = "text";
  } else {
    inputLoginPwd.type = "password";
  }
});
