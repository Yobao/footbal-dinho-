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
const btnsAccount = document.querySelectorAll(".button_account");
const accountDropdownList = document.getElementById("account-dropdown-list");

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
const tableUserCurrent = document.getElementById("table-user-current");
const tableUserOther = document.getElementById("table-user-other");
const tableBodyPages = document.getElementById("body-table-pages");
const tableBodyInfo = document.getElementById("body-table-info");
const userCurrentName = document.getElementById("body_current_user_name");
const userOtherName = document.getElementById("body_other_user_name");
const bodyTable = document.getElementById("body-table");
const bodyUserOther = document.getElementById("body-user-other");

const betBodyInfo = document.getElementById("body-bet-info");
const betBodyPoints = document.getElementById("body-bet-points");
const betBodyTime = document.getElementById("body-bet-time");
const betBodyBet = document.getElementById("body-bet-bet");

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
const bodyUserOtherBack = document.getElementById("body_other_user_back");

//STATUS VARIABLES
let loginStatus = true;
let userName = null;

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
      document.body.classList.remove("stop-scroll");
      accountDropdownList.style.add()
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
  document.body.classList.add("stop-scroll");
  accountDropdownList.classList.remove("hidden");
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
  document.body.classList.remove("stop-scroll");
  accountDropdownList.classList.remove("hidden");
  clearInputs();
};

//Function expression to show page and "overlay" div.
const openBodyPage = function (self) {
  //Variable for "this" keyword.
  let thisElement;
  bodyPagesLoop();
  typeof this === "undefined" ? (thisElement = self) : (thisElement = this);
  modalCurrent(thisElement).classList.remove("hidden");
};

const pwdChangeLook = function () {
  let pwdToChangeLook = document.querySelectorAll(
    `.input_${this.id.slice(0, this.id.indexOf("_"))}_password`
  );
  pwdToChangeLook.forEach((input) => {
    input.type === "password"
      ? (input.type = "text")
      : (input.type = "password");
  });
};

//Function to delete all childs of specified element (e.g. clear table)
function deleter(elementToClear) {
  while (elementToClear.firstChild)
    elementToClear.removeChild(elementToClear.firstChild);
}

// AXIOS CALL SECTION
//----------------------------------------------------------------------------------------------------------------------------

//Async FUNCTION which creates table in HTML with scores.
async function tableScoreFinal(roundButtonValue, roundInnerText) {
  try {
    let response = await axios.get(`${urlTable}?m=${roundButtonValue}`);
    let tdTable = [];
    let data = response.data.data;
    let matches = response.data.matches;
    let lastMatchInfo = `${response.data.last_round_match}, ${response.data.last_round_start}.`;
    let lastMatchInfoHeader = document.createElement("h1");

    //Deletes all rows in table.
    deleter(tableBody);
    //Deletes title text of round.
    deleter(tableBodyInfo);

    /////////////// MAIN TABLE PART ///////////////
    //Creates title for score table.
    tableBodyInfo.appendChild(lastMatchInfoHeader);
    lastMatchInfoHeader.appendChild(document.createTextNode(lastMatchInfo));
    //For each loop, for each player create row in table & insert values.
    data.forEach((row, index) => {
      let tr = document.createElement("tr");
      let tableColumns = [
        { key: index + 1 },
        { key: row.username },
        { key: row.score },
        { key: row.last_round_tip_name },
        { key: row.last_round_score },
      ];

      //Loop for pasting tds and its values into table.
      tableColumns.forEach((column, i) => {
        tdTable[i] = document.createElement("td");
        tr.appendChild(tdTable[i]);
        if (column.key === row.username) {
          tdTable[i].setAttribute("value", row.id);
          tdTable[i].setAttribute("id", "btn-user-other");
        }
        tdTable[i].appendChild(document.createTextNode(column.key));
      });
      tableBody.appendChild(tr);
    });

    /////////////////////////////// REFACTOR THIS SHIT !!! ///////////////////////////////////////
    /////////////// PAGING TABLE PART ///////////////
    //If buttons already exists, then skip, otherwise create buttons.
    if (tableBodyPages.childElementCount < 1) {
      matches.forEach((match, i) => {
        let btn = document.createElement("button");
        //Loop for pasting tds and its values into table.
        tableBodyPages.appendChild(btn);
        btn.appendChild(document.createTextNode(i + 1));
        btn.setAttribute("value", match.mid);
      });
      //Event listener for each button.
      [...tableBodyPages.children].forEach((btn) => {
        btn.addEventListener("click", function () {
          tableScoreFinal(this.value, this.innerText - 1);
        });
      });
    }

    //Variable for all buttons.
    let tablePageButtons = [...tableBodyPages.children];

    //Event listener, after clicking on the name of user in the table, show specific user tip history.
    for (let i = 0; i < tableBody.childElementCount; i++) {
      tableBody.children[i].children[1].addEventListener("click", function () {
        let userID = this.getAttribute("value");
        let user = this.innerText;
        createUserTable(user, userID, userOtherName, tableUserOther, this);
      });
    }

    //Clear all buttons from Highlightning.
    tablePageButtons.forEach((btn) => {
      btn.classList.remove("btn_table_pages_active");
    });

    //If "Tabuľka" is pressed, show Tabuľka body page and highlight highest number button. If specific round button is pressed, highlight it.
    if (roundButtonValue.id === "btn-table") {
      tablePageButtons[tablePageButtons.length - 1].classList.add(
        "btn_table_pages_active"
      );
      openBodyPage(roundButtonValue);
    } else {
      tablePageButtons[roundInnerText].classList.add("btn_table_pages_active");
    }
  } catch (err) {
    console.error(err);
  }
}

//FUNCTION to show table for each user after clicking on name in the table.
function createUserTable(userName, userID, userNameTitle, userTable, self) {
  //Deletes all rows in table.
  deleter(userTable);
  //Deletes title text of round.
  deleter(userNameTitle);
  //Axios asynchronous request for getting data for user table.
  axios
    .get(
      `${urlUserTips}?u=${userID}&cu=${userName}` /* , {
      headers: { Authorization: "Token " + localStorage.dinhotoken },
    } */
    )
    .then((response) => {
      let data = response.data.data;

      //For each loop, for each match create row in table & insert values.
      data.forEach((row) => {
        let tr = document.createElement("tr");
        let tableRows = [
          { key: row.match },
          { key: row.start },
          { key: row.tip_name },
          { key: row.score },
        ];

        //Loop for pasting tds and its values into table.
        tableRows.forEach((row) => {
          let rowColumn = document.createElement("td");
          rowColumn.appendChild(document.createTextNode(row.key));
          tr.appendChild(rowColumn);
        });
        userTable.appendChild(tr);
      });

      //Inserts name of clicked user in Title.
      userNameTitle.appendChild(document.createTextNode(userName));
      //Run openBodyPage to show correct body page.
      userID !== "-9" ? openBodyPage(self) : null;
    })
    .catch((err) => {
      console.error(err);
    });
}

//IIFE async-await FOR AUTOLOGIN + user bet history table creation.
(async () => {
  try {
    let response = await axios.post(urlAutoLogin, {
      token: localStorage.dinhotoken,
    });
    let userID = "-9";
    userName = response.data.user;
    btnUser.innerText = userName;
    loginStatus = true;
    logHider();
    createUserTable(userName, userID, userCurrentName, tableUserCurrent);
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

(async function betting() {
  try {
    let response = await axios.get(`${urlPlayers}?t=1`, {
      headers: { Authorization: "Token " + localStorage.dinhotoken },
    });
    let match = response.data.match;
    let points = `Hrá sa o ${response.data.pool} bodov.`;
    let players = response.data.players;
    let time = response.data.time;
    let infoElem = document.createElement("h1");
    let pointsElem = document.createElement("h2");
    let timeElem = document.createElement("h3");

    let days = Math.floor(time / 86400);
    let hours = Math.floor((time % 3600) / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = Math.floor(time % 60);

    console.log(days, hours, minutes, seconds);

    players.forEach((player) => {
      let card = document.createElement("div");
      let cardRows = [
        { key: player.name },
        { key: `počet hráčov: ${player.bettors}` },
        { key: `max. možná výhra: ${player.points}` },
      ];

      cardRows.forEach((row) => {
        let innerText = document.createElement("p");
        innerText.appendChild(document.createTextNode(row.key));
        card.appendChild(innerText);
      });

      betBodyBet.appendChild(card);
    });

    infoElem.appendChild(document.createTextNode(match));
    betBodyInfo.appendChild(infoElem);

    pointsElem.appendChild(document.createTextNode(points));
    betBodyPoints.appendChild(pointsElem);

    timeElem.appendChild(
      document.createTextNode(
        `Zápas začína o ${days}d, ${hours}h a ${minutes}m`
      )
    );
    betBodyTime.appendChild(timeElem);
  } catch {}
})();

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

// PREROBIT !!!!!!!!!!!!
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
  btn.addEventListener("click", function () {
    //If btn is "Tabuľka", run tableScoreFinal where openBodyPage is triggered. Otherwise, show other bodyPage.
    this.id === "btn-table" ? tableScoreFinal(this) : openBodyPage(this);
  });
});

//Buttons listeners.
//////////////////////////////////////////////////////
btnLoginLogin.addEventListener("click", logIN);
btnRegReg.addEventListener("click", registration);
btnLogOut.addEventListener("click", logOUT);
btnChangeChange.addEventListener("click", passwordChange);
bodyUserOtherBack.addEventListener("click", function () {
  bodyUserOther.classList.add("hidden");
  bodyTable.classList.remove("hidden");
});

//Listener for checkbox to show password.
//////////////////////////////////////////////////////
inputsShowPassword.forEach((btn) => {
  btn.addEventListener("click", pwdChangeLook);
});
