"use strict";

//URL Links as constants
const urlTable = "https://www.dinho.eu/api/table";
const urlLogin = "https://www.dinho.eu/api/account/login";
const urlAutoLogin = "https://www.dinho.eu/api/account/autologin";
const urlLogOut = "https://www.dinho.eu/api/account/logout";
const urlRegistration = "https://www.dinho.eu/api/account/register";
const urlChangePassword = "https://www.dinho.eu/api/change-password/";
const urlPlayers = "https://www.dinho.eu/api/players";
const urlUserTips = "https://www.dinho.eu/api/tips";

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
const btnUser = document.getElementById("btn-user");

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
const tableUser = document.getElementById("table-user");
const tableBodyPages = document.getElementById("body-table-pages");

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
const inputsToClear = document.querySelectorAll(".inputs_clear");

//STATUS VARIABLES
let loginStatus = true;
let userName = null;

//Variables for API
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

//Variable for accessing correct modal.
let modalCurrent = function (self) {
  let modal = document.querySelector(
    `.modal-${self.id.slice(self.id.indexOf("-") + 1, self.id.length)}`
  );
  return modal;
};

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

const clearInputs = function () {
  inputsToClear.forEach((input) => {
    input.value = "";
  });
};

//Function expression to show modal and "overlay" div.
const openModal = function () {
  modalCurrent(this).classList.remove("hidden");
  overlay.classList.remove("hidden");
  //Check if device is mobile/pc and set centering of view accordingly.
  navigator.userAgentData.mobile
    ? (modalCurrent(this).style.position = "absolute")
    : (modalCurrent(this).style.position = "fixed");
};

//Function expression to hide modal and "overlay" div.
const closeModal = function () {
  if (this.className != "overlay") {
    modalCurrent(this).classList.add("hidden");
  } else {
    modalsLoop();
  }
  overlay.classList.add("hidden");
  clearInputs();
};

//Function expression to show modal and "overlay" div.
const openBodyPage = function () {
  bodyPagesLoop();
  modalCurrent(this).classList.remove("hidden");
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

//IIFE which creates table in HTML with scores.
(function () {
  let positionCounter = 1;
  let tdTable = [];
  //Axios asynchronous request for getting data for table.
  axios
    .get(urlTable)
    .then((response) => {
      /////////////// MAIN TABLE PART ///////////////
      let data = response.data.data;
      let matches = response.data.matches;
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
        (() => {
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

      /////////////// PAGING TABLE PART ///////////////
      let i = 1;
      matches.forEach((row) => {
        let btn = document.createElement("button");
        //Loop for pasting tds and its values into table.
        tableBodyPages.appendChild(btn);
        btn.innerText = i;
        btn.classList.add("btn_table_pages");
        i += 1;
      });
    })
    .catch((err) => {
      console.error(err);
    });
})();

//IIFE async-await FOR AUTOLOGIN + user bet history table creation.
(async () => {
  try {
    let response = await axios.post(urlAutoLogin, {
      token: localStorage.dinhotoken,
    });
    userName = response.data.user;
    btnUser.innerText = userName;
    loginStatus = true;
    logHider();

    (() => {
      //Axios asynchronous request for getting data for table.
      axios
        .get(`${urlUserTips}?u=-9&cu=${userName}`, {
          headers: { Authorization: "Token " + localStorage.dinhotoken },
        })
        .then((response) => {
          let data = response.data.data;
          let tdTable = [];
          //For each loop, for each match create row in table & insert values.
          data.forEach((row) => {
            let tr = document.createElement("tr");
            let tableRows = [
              { key: row.match },
              { key: row.start },
              { key: row.tip },
              { key: row.score },
            ];

            //IIFE loop for creating variables based on number of columns neccessary to paste into table.
            (() => {
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

            tableUser.appendChild(tr);
          });
          //For each loop, for each player create row in table & insert values.
        })
        .catch((err) => {
          console.error(err);
        });
    })();
  } catch (err) {
    console.error(err);
  }
})();

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

//AXIOS REQUEST. Logout from page.
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

//AXIOS REQUEST. Registration to page. Sends values from inputs and returns token.
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

//AXIOS REQUEST. Changes passwor for logged user.
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

// PREROBIT !!!!!!!!!!!! MAS NA VIAC AKO NA TAKE POSNE KODY :D
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
