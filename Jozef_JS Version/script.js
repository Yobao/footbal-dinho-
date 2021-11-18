"use strict";

//URL Links as constants
const urlTable = "https://www.dinho.eu/api/table";
const urlLogin = "https://www.dinho.eu/api/account/login";
const urlAutoLogin = "https://www.dinho.eu/api/account/autologin";
const urlLogOut = "https://www.dinho.eu/api/account/logout";
const urlRegistration = "https://www.dinho.eu/api/account/register";
const urlChangePassword = "https://www.dinho.eu/api/change-password/";

//HEADERS
const btnsHeaderModal = document.querySelectorAll(".button_header_modal");
const btnsHeaderBody = document.querySelectorAll(".button_header_body");
const accountDropdown = document.querySelector(".account-dropdown");
const btnAccount = document.getElementById("btn-account");
const btnHomeImage = document.querySelector(".image_home");
const btnRegistration = document.getElementById("btn-registration");
const btnLogin = document.getElementById("btn-login");
const btnBet = document.getElementById("btn-bet");
const btnLogOut = document.getElementById("btn-logout");
const btnChange = document.getElementById("btn-change");

//MODALS
const modals = document.querySelectorAll(".modal");
//modalLogin & modalRegistration may be obsolete, check "test" function
const modalLogin = document.getElementById("modal-login");
const modalRegistration = document.getElementById("modal-registration");
const modalChangePassword = document.getElementById("modal-change-password");
const btnCloseModal = document.querySelectorAll(".button-close");

//BODY PAGES
const bodyPages = document.querySelectorAll(".body-modal");
const tableBody = document.getElementById("table-body");

//REGISTRATION
const inputRegName = document.getElementById("reg-name");
const inputRegPwd = document.getElementById("reg-password");
const inputRegConfirmPwd = document.getElementById("reg-confirm-password");
const inputRegEmail = document.getElementById("reg-email");
const inputRegChelsea = document.getElementById("reg-chelsea-account");
const btnRegReg = document.getElementById("btn-reg-reg");

//LOGIN
const inputLoginName = document.getElementById("login-name");
const inputLoginPwd = document.getElementById("login-password");
const loginShowPwd = document.getElementById("login_show_pwd");
const btnLoginLogin = document.getElementById("btn-login-login");

//CHANGE PASSWORD
const inputChangePassword1 = document.getElementById("change-password1");
const inputChangePassword2 = document.getElementById("change-password2");
const btnChangeChange = document.getElementById("btn-change-change");

//The rest.
const overlay = document.querySelector(".overlay");
const inputsShowPassword = document.querySelectorAll(".input_show_pwd");

//STATUS VARIABLES
let loginStatus = true;

//Variables for API
let username = null;
let cfc_username = "";
let password = null;
let password2 = null;
let email = null;
let statuss = false;
let wrongpass = false;
/* let registration = false; */
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

const logHider = function () {
  if (loginStatus) {
    if (!overlay.classList.contains("hidden")) {
      overlay.classList.add("hidden");
      modalsLoop();
    }
    btnRegistration.classList.add("hidden");
    btnLogin.classList.add("hidden");
    btnBet.classList.remove("hidden");
    accountDropdown.classList.remove("hidden");
  } else {
    if (overlay.classList.contains("hidden")) {
      btnRegistration.classList.remove("hidden");
      btnLogin.classList.remove("hidden");
      btnBet.classList.add("hidden");
      accountDropdown.classList.add("hidden");
    }
  }
};

/* //This expression resets all input fields values.
const inputClear = function () {
  inputLoginName.value = "";
  inputLoginPwd.value = "";
}; */

//Function expression to show modal and "overlay" div.
const openModal = function () {
  let modal = document.querySelector(
    `.modal-${this.id.slice(this.id.indexOf("-") + 1, this.id.length)}`
  );
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  navigator.userAgentData.mobile
    ? (modal.style.position = "absolute")
    : (modal.style.position = "fixed");
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

const pwdChangeLook = function () {
  let pwdToChangeLook = document.querySelectorAll(
    `.input_${this.id.slice(0, this.id.indexOf("_"))}_password`
  );
  pwdToChangeLook.forEach((input) => {
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  });
};

// AXIOS CALL SECTION
//----------------------------------------------------------------------------------------------------------------------------

//AXIOS REQUEST. Creates table in HTML with scores.
const getDataTable = () => {
  let positionCounter = 1;
  let tdTable = [];
  //Axios asynchronous request for getting data for table.
  axios
    .get(urlTable)
    .then((response) => {
      let data = response.data.data;
      //For each loop, for each player create row in table & insert values.
      data.forEach((row) => {
        let tr = document.createElement("tr");
        let tableRows = [
          { key: positionCounter },
          { key: row.username },
          { key: row.score },
          { key: row.last_round_tip_name },
          { key: row.last_round_score },
        ];

        //IIFE loop for creating variables based on number of columns neccessary to paste into table.
        (function createTdVariables() {
          for (let i = 0; i <= tableRows.length - 1; i++) {
            tdTable[i] = document.createElement("td");
          }
          return tdTable;
        })();

        //Loop for pasting tds and its values into table.
        for (let i = 0; i <= tableRows.length - 1; i++) {
          tr.appendChild(tdTable[i]);
          tdTable[i].appendChild(document.createTextNode(tableRows[i].key));
        }

        tableBody.appendChild(tr);
        positionCounter++;
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
      loginStatus = true;
      logHider();
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
      loginStatus = true;
      logHider();
    })
    .catch((err) => {
      console.log(err);
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
      loginStatus = false;
      logHider();
    })
    .catch((err) => {
      console.error(err);
    });
};

const registration = () => {
  axios
    .post(urlRegistration, {
      username: inputRegName.value,
      password: inputRegPwd.value,
      password2: inputRegConfirmPwd.value,
      email: inputRegEmail.value,
      cfc_acc: inputRegChelsea.value,
    })
    .then((response) => {
      localStorage.setItem("dinhotoken", response.data.token);
      loginStatus = true;
      logHider();
    })
    .catch((err) => {
      console.log(err);
    });
};

const passwordChange = () => {
  axios
    .put(
      urlChangePassword,
      {
        old_password: inputChangePassword1.value,
        new_password: inputChangePassword2.value,
      },
      {
        headers: { Authorization: "Token " + localStorage.dinhotoken },
      }
    )
    .then(() => {
      logHider();
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

/* // PREROBIT !!!!!!!!!!!! WHAT IF REGISTRATION IS OPENED ????
//Listener for enter to log in.
document
  .getElementById(`modal-login`)
  .addEventListener("keydown", function (btn) {
    if (btn.keyCode === 13) {
      btn.preventDefault();
      btnLoginLogin.click();
    }
  }); */

// PREROBIT !!!!!!!!!!!! WHAT IF REGISTRATION IS OPENED ????
//Listener for enter to log in.
modals.forEach((modal) => {
  modal.addEventListener("keydown", function (btn) {
    if (btn.keyCode === 13) {
      btn.preventDefault();
      modal.id === "modal-login" ? btnLoginLogin.click() : null;
      modal.id === "modal-change" ? btnChangeChange.click() : null;
      modal.id === "modal-registration" ? btnRegReg.click() : null;
    }
  });
});

//Listener for hiding "overlay" & active modal window after clicking on "X" button.
btnCloseModal.forEach((btn) => {
  btn.addEventListener("click", closeModal);
});

//Listener for buttons which controls body content.
btnsHeaderBody.forEach((btn) => {
  btn.addEventListener("click", openBodyPage);
});

//Buttons listeners
//////////////////////////////////////////////////////
btnLoginLogin.addEventListener("click", logIN);
btnRegReg.addEventListener("click", registration);
btnLogOut.addEventListener("click", logOUT);
btnChangeChange.addEventListener("click", passwordChange);

//Listener for checkbox to show password.
//////////////////////////////////////////////////////
inputsShowPassword.forEach((btn) => {
  btn.addEventListener("click", pwdChangeLook);
});
