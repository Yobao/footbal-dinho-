"use strict";

//HEADERS
const btnsHeaderModal = document.querySelectorAll(".button_header_modal");
const btnsHeaderBody = document.querySelectorAll(".button_header_body");
const accountDropdown = document.querySelector(".account-dropdown");
const navbarMenu = document.getElementById("navbar-menu");
const btnRegistration = document.getElementById("btn-registration");
const btnLogin = document.getElementById("btn-login");
const btnBet = document.getElementById("btn-bet");
const btnLogOut = document.getElementById("btn-logout");
const btnChange = document.getElementById("btn-change");
const btnUser = document.getElementById("btn-user");
const btnNavbarBurger = document.getElementById("navbar_burger");
const accountDropdownList = document.getElementById("account-dropdown-list");

//MODALS
const modals = document.querySelectorAll(".modal");
const btnCloseModal = document.querySelectorAll(".button-close");

//BODY PAGES
const bodyPages = document.querySelectorAll(".body-page");
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
const loginHidePwd = document.getElementById("login_hide_pwd");
const btnLoginLogin = document.getElementById("btn-login-login");
const btnLoginForgotSend = document.getElementById("btn-forgot-send");

//CHANGE PASSWORD
const inputChangePassword1 = document.getElementById("change-password1");
const inputChangePassword2 = document.getElementById("change-password2");
const btnChangeChange = document.getElementById("btn-change-change");

//FORGOT PASSWORD
const inputForgotEmail = document.getElementById("forgot-email");
const inputForgotCode = document.getElementById("forgot-code");
const inputForgotNewPassword = document.getElementById("forgot-new-password");
const btnForgotChange = document.getElementById("btn-forgot-change");
const btnForgotSendEmailAndChange = document.getElementById(
  "btn-forgot-send-email-and-change"
);

//The rest.
const modalBack = document.querySelectorAll(".modal-background");
const inputsShowPassword = document.querySelectorAll(".input_show_pwd");
const inputsToClear = document.querySelectorAll(".inputs_clear");
const bodyUserOtherBack = document.getElementById("body_other_user_back");
const htmlElement = document.getElementById("htmlelement");

//STATUS VARIABLES
let loginStatus = true;
let userName = null;

//Array variables for hidding / unhiding navbar contents...
const navbarLoggedIn = [];
const navbarLoggenOut = [];

// FUNCTION EXPRESSION CONSTANTS/VARIABLES
//----------------------------------------------------------------------------------------------------------------------------

//Variable for accessing correct page.
const bodyCurrent = function (self) {
  return document.getElementById(
    `body-${self.id.slice(self.id.indexOf("-") + 1, self.id.length)}`
  );
};

//Variable for accessing correct modal.
const modalCurrent = function (self) {
  return document.getElementById(
    `modal-${self.id.slice(self.id.indexOf("-") + 1, self.id.length)}`
  );
};

//Loop through modals to detect which is unhidden.
const modalsLoop = function () {
  modals.forEach((modal) => {
    if (modal.classList.contains("is-active"))
      modal.classList.remove("is-active");
  });
};

//Loop through BODY pages to detect which is unhidden.
const bodyPagesLoop = function () {
  bodyPages.forEach((page) => {
    if (!page.classList.contains("is-hidden")) page.classList.add("is-hidden");
  });
};

//Function which hides Login, registr.. buttons and shows Tipuj & burger menu.
const logHider = function () {
  modalsLoop();
  btnRegistration.classList.add("is-hidden");
  btnLogin.classList.add("is-hidden");
  btnBet.classList.remove("is-hidden");
  btnUser.classList.remove("is-hidden");
  btnNavbarBurger.classList.remove("is-hidden");
  navbarMenu.classList.remove("is-hidden");
  htmlElement.classList.remove("is-clipped");
};

//For each input field in modals, clear everything what was previoulsy written.
const clearInputs = function () {
  inputsToClear.forEach((input) => {
    input.value = "";
  });
};

//Function expression to show modal and "overlay" div.
const openModal = function () {
  //SHITTY WORKARROUND FOR LOST PASSWORD FUNCTIONALITY...NECCESSARY REFACTOR !!!
  if (this.id === "btn-forgot-send") closeModal();
  if (this.id === "btn-forgot-send-email-and-change") {
    closeModal();
  }

  modalCurrent(this).classList.add("is-active");
  document.body.classList.add("stop-scroll");
  accountDropdownList.classList.remove("is-hidden");
  htmlElement.classList.add("is-clipped");
};

//Function expression to hide modal and "overlay" div.
const closeModal = function () {
  modalsLoop();
  clearInputs();
  document.body.classList.remove("stop-scroll");
  accountDropdownList.classList.remove("is-hidden");
  htmlElement.classList.remove("is-clipped");
};

//Function expression to show page and "overlay" div.
const openBodyPage = function (self) {
  //Variable for "this" keyword.
  let thisElement;
  bodyPagesLoop();
  typeof this === "undefined" ? (thisElement = self) : (thisElement = this);
  bodyCurrent(thisElement).classList.remove("is-hidden");
};

//Function to delete all children of specified element (e.g. clear table)
function deleter(elementToClear) {
  while (elementToClear.firstChild)
    elementToClear.removeChild(elementToClear.firstChild);
}

// AXIOS CALL SECTION
//----------------------------------------------------------------------------------------------------------------------------

//Async FUNCTION which creates table in HTML with scores.
async function tableScoreFinal(roundButtonValue, roundInnerText) {
  try {
    let response = await axios.get(`${url}/api/table?m=${roundButtonValue}`);
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
        tdTable = document.createElement("td");
        tr.appendChild(tdTable);
        //Change formatting of "User name" column.
        if (column.key === row.username) {
          tdTable.setAttribute("value", row.id);
          tdTable.setAttribute("id", "btn-user-other");
          tdTable.setAttribute("class", "is-clickable");
        }
        //Change formatting of "Skóre" column.
        if (i === 2 && column.key === row.score)
          tdTable.setAttribute("class", "has-background-primary-light");
        //Change formatting of "Zmena" column.
        if (column.key === row.last_round_score && row.last_round_score > 0)
          tdTable.setAttribute(
            "class",
            "has-text-success has-text-weight-bold"
          );
        //Change formatting of "Pozícia" column. In addition, it will add priZe for first 8 places.
        if (column.key === index + 1) {
          tdTable.setAttribute("class", "has-text-weight-bold");
          let prize;
          //Switch case NOOB CODE FOR ADDING PRIZES INTO COLUMN "POSITION". CHECK AND REFACTOR !!!!
          ///////////////////////////
          switch (index + 1) {
            case 1:
              prize = ` (25€)`;
              break;
            case 2:
              prize = ` (15€)`;
              break;
            case 3:
              prize = ` (10€)`;
              break;
            case 4:
              prize = ` (5€)`;
              break;
            case 5:
              prize = ` (5€)`;
              break;
            case 6:
              prize = ` (5€)`;
              break;
            case 7:
              prize = ` (5€)`;
              break;
            case 8:
              prize = ` (5€)`;
              break;
            default:
              prize = ``;
          }
          tdTable.appendChild(document.createTextNode(column.key + prize));
        } else {
          tdTable.appendChild(document.createTextNode(column.key));
        }
      });
      tableBody.appendChild(tr);
    });

    /////////////////////////////// REFACTOR THIS SHIT !!! ///////////////////////////////////////
    /////////////// PAGING TABLE PART ///////////////
    //If buttons already exists, then skip, otherwise create buttons.
    if (tableBodyPages.childElementCount < 1) {
      matches.forEach((match, i) => {
        let btn = document.createElement("li");
        let btnText = document.createElement("a");
        //Loop for pasting tds and its values into table.
        btn.appendChild(btnText);
        btnText.appendChild(document.createTextNode(i + 1));
        btnText.setAttribute("value", match.mid);
        btnText.setAttribute("class", "pagination-link m-1 is-clickable");
        tableBodyPages.appendChild(btn);
      });
      //Event listener for each button. Rest operator to convert NodeList into array for looping.
      [...tableBodyPages.children].forEach((btn) => {
        btn.addEventListener("click", function () {
          tableScoreFinal(
            this.children[0].getAttribute("value"),
            this.children[0].innerText - 1
          );
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
      btn.children[0].classList.remove("is-current");
    });

    //If "Tabuľka" is pressed, show Tabuľka body page and highlight highest number button. If specific round button is pressed, highlight it.
    if (roundButtonValue.id === "btn-table") {
      tablePageButtons[tablePageButtons.length - 1].children[0].classList.add(
        "is-current"
      );
      openBodyPage(roundButtonValue);
    } else {
      tablePageButtons[roundInnerText].children[0].classList.add("is-current");
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
      `${url}/api/tips?u=${userID}&cu=${userName}` /* , {
      headers: { Authorization: "Token " + localStorage.dinhotoken },
    } */
    )
    .then((response) => {
      let data = response.data.data;

      //Scrolls to top of page after user name table is clicked.
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      //For each loop, for each match create row in table & insert values.
      data.forEach((row) => {
        let tr = document.createElement("tr");
        let tableColumns = [
          { key: row.match },
          { key: row.start },
          { key: row.tip_name },
          { key: row.score },
        ];

        //Loop for pasting tds and its values into table.
        tableColumns.forEach((column) => {
          let rowColumn = document.createElement("td");
          rowColumn.appendChild(document.createTextNode(column.key));
          //Change formatting of "Dátum" column.
          if (column.key === row.start)
            rowColumn.setAttribute("class", "has-background-primary-light");
          //Change formatting of "Body" column.
          if (column.key === row.score && row.score > 0)
            rowColumn.setAttribute(
              "class",
              "has-text-success has-text-weight-bold"
            );
          //Inserts whole row into table.
          tr.appendChild(rowColumn);
        });
        userTable.appendChild(tr);
      });

      //Inserts name of clicked user in Title.
      userNameTitle.appendChild(document.createTextNode(userName));
      //Run openBodyPage to show correct body page.
      if (userID !== "-9") openBodyPage(self);
    })
    .catch((err) => {
      console.error(err);
    });
}

//IIFE async-await FOR AUTOLOGIN + user bet history table creation.
(async () => {
  try {
    let response = await axios.post(`${url}/api/account/autologin`, {
      token: localStorage.dinhotoken,
    });
    let userID = "-9";
    userName = response.data.user;

    //Deletes user name text in Button for current user. Then inserts user name as new.
    deleter(btnUser);
    btnUser.appendChild(document.createTextNode(userName));

    //Hides and unhides Navbar buttons.
    logHider();
    createUserTable(userName, userID, userCurrentName, tableUserCurrent);

    //Creates cards for betting page.
    betting();
  } catch (err) {
    console.error(err);
  }
})();

//AXIOS REQUEST. Makes login works. Post "username" & "password" and returns token for saving login.
const logIN = () => {
  axios
    .post(`${url}/api/account/login`, {
      username: inputLoginName.value,
      password: inputLoginPwd.value,
    })
    .then((response) => {
      let userID = "-9";
      let userName = inputLoginName.value;
      //Deletes user name text in Button for current user. Then inserts user name as new.
      deleter(btnUser);
      btnUser.appendChild(document.createTextNode(inputLoginName.value));
      localStorage.setItem("dinhotoken", response.data.token);

      //Clears written inputs...
      clearInputs();

      //Hides and unhides Navbar buttons.
      logHider();
      createUserTable(userName, userID, userCurrentName, tableUserCurrent);

      //Creates cards for betting pae.
      betting();
    })
    .catch((err) => {
      alert("Nesprávne Meno alebo Heslo. Skúste prosím ešte raz.");
      console.log(err);
    });
};

//AXIOS REQUEST. Logout from page.
const logOUT = () => {
  axios
    .post(
      `${url}/api/account/logout`,
      { token: localStorage.dinhotoken },
      {
        headers: { Authorization: "Token " + localStorage.dinhotoken },
      }
    )
    .then(() => {
      localStorage.removeItem("dinhotoken");
      bodyPagesLoop();

      //Hides and unhides Navbar buttons.
      btnRegistration.classList.remove("is-hidden");
      btnLogin.classList.remove("is-hidden");
      btnBet.classList.add("is-hidden");
      btnUser.classList.add("is-hidden");
      btnNavbarBurger.classList.add("is-hidden");
      navbarMenu.classList.add("is-hidden");
      document.getElementById("body-home").classList.remove("is-hidden");
    })
    .catch((err) => {
      console.error(err);
    });
};

//AXIOS REQUEST. Registration to page. Sends values from inputs and returns token.
const registration = () => {
  axios
    .post(`${url}/api/account/register`, {
      username: inputRegName.value,
      password: inputRegPwd.value,
      password2: inputRegConfirmPwd.value,
      email: inputRegEmail.value,
      cfc_acc: inputRegChelsea.value,
    })
    .then((response) => {
      //Deletes current user button name and replace with new after registration.
      let userName = inputRegName.value;
      deleter(btnUser);
      btnUser.appendChild(document.createTextNode(userName));
      createUserTable(userName, "-9", userCurrentName, tableUserCurrent);
      //writes token into local storage.
      localStorage.setItem("dinhotoken", response.data.token);
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
      `${url}/api/change-password`,
      {
        old_password: inputChangePassword1.value,
        new_password: inputChangePassword2.value,
      },
      {
        headers: { Authorization: "Token " + localStorage.dinhotoken },
      }
    )
    .then(() => {
      alert("Heslo bolo úspešne zmenené.");
      logHider();
    });
};

async function betting() {
  try {
    let response = await axios.get(`${url}/api/players?t=1`, {
      headers: { Authorization: "Token " + localStorage.dinhotoken },
    });
    let match = response.data.match;
    let points = response.data.pool;
    let players = response.data.players;
    let currentBet = response.data.current;
    let time = response.data.time;
    let infoElem = document.createElement("h1");
    let pointsElem = document.createElement("h2");
    let timeElem = document.createElement("h3");
    let strong = document.createElement("strong");

    //CHECK IT AND FINISH CALC FOR TIME.
    //Creating time variable...
    let days = Math.floor(time / 86400);
    let hours = Math.floor((time % 86400) / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    //let seconds = Math.floor(time % 60);
    let dddd = days === 1 ? "deň" : days >= 2 && days <= 4 ? "dni" : "dní";
    let hhhh =
      hours === 1 ? "hodinu" : hours >= 2 && hours <= 4 ? "hodiny" : "hodín";
    let mmmm =
      minutes === 1
        ? "minútu"
        : minutes >= 2 && minutes <= 4
        ? "minúty"
        : "minút";

    //This functions deletes all current content for "Tipuj" page.
    deleter(betBodyBet);
    deleter(betBodyInfo);
    deleter(betBodyPoints);
    deleter(betBodyTime);

    //Creates card/box for each player on which you can bet.
    players.forEach((player) => {
      let card = document.createElement("div");
      let cardRows = [
        { key: player.name },
        { key: `počet hráčov: ${player.bettors}` },
        { key: `max. možná výhra: ${player.points}` },
      ];

      //For each card append child elements with text - player info, points etc.
      cardRows.forEach((row, i) => {
        let innerText = document.createElement("p");
        //If row is player name, set text to BOLD.
        if (i === 0) innerText.setAttribute("class", "has-text-weight-bold");
        innerText.appendChild(document.createTextNode(row.key));
        card.appendChild(innerText);
        card.setAttribute("class", "column box is-2 my-3 mx-4 is-clickable");
      });

      //Append each card to container + add ID of player.
      betBodyBet.appendChild(card);
      card.setAttribute("value", player.id);
      //Changes background color of current BET.
      if (player.name === currentBet)
        card.setAttribute(
          "class",
          "column box is-2 my-3 mx-4 is-clickable has-background-warning"
        );
    });

    //Append child title and match info text.
    infoElem.appendChild(document.createTextNode(`\u00A0 ${match}`));
    betBodyInfo.appendChild(infoElem);
    infoElem.setAttribute("class", "has-text-weight-bold");
    //Append child title and points info text.
    pointsElem.appendChild(document.createTextNode("\u00A0 Hrá sa o "));
    strong.setAttribute("class", "has-text-weight-bold");
    strong.appendChild(document.createTextNode(points));
    pointsElem.appendChild(strong);
    pointsElem.appendChild(document.createTextNode(" bodov."));
    betBodyPoints.appendChild(pointsElem);
    //Append child title and time info text.
    timeElem.appendChild(
      document.createTextNode(
        `\u00A0 Zápas začína o ${days + " " + dddd}, ${hours + " " + hhhh}, ${
          minutes + " " + mmmm
        }`
      )
    );
    betBodyTime.appendChild(timeElem);
    timeElem.setAttribute("class", "pb-6");

    //Add EventListener for each card, after click send tip and highlight this card.
    [...betBodyBet.children].forEach((card) => {
      //If already bet is placed on player, event listener will not be created.
      if (card.firstChild.innerText !== currentBet) {
        card.addEventListener("click", function () {
          //Axios request to BET API, post token + ID of player from card.
          axios
            .post(
              `${url}/api/bet`,
              { tip: this.getAttribute("value") },
              {
                headers: { Authorization: "Token " + localStorage.dinhotoken },
              }
            )
            .then(() => {
              //Hihlights "card" with current tip.
              [...betBodyBet.children].forEach((child) => {
                if (child.classList.contains("has-background-warning"))
                  child.classList.remove("has-background-warning");
              });
              //Alert with name of player which user tiped.
              alert(`Tipnuté na ${this.firstChild.innerText}.`);
              this.setAttribute(
                "class",
                "column box is-2 my-3 mx-4 is-clickable has-background-warning"
              );
              //After alert shows, calls betting function which firstly deletes, then create new cards.
              betting();
            });
        });
      }
    });
  } catch {}
}

function forgotPassword() {
  //inputForgotEmail.value
  axios
    .post(`${url}/api/password_reset/`, {
      email: inputForgotEmail.value,
    })
    .then(() => {});
}

function resetPassword() {
  axios
    .post(`${url}/api/password_reset/confirm/`, {
      password: inputForgotNewPassword.value,
      token: inputForgotCode.value,
    })
    .then(() => {
      alert(`Vaše heslo bolo úspešne zmenené.`);
      closeModal();
    });
}

// EVENT SECTION
//----------------------------------------------------------------------------------------------------------------------------

//If betting page is active, refresh betting page each minute.
setInterval(function () {
  if (!document.getElementById("body-bet").classList.contains("is-hidden"))
    betting();
}, 60000);

// Header + buttons
//////////////////////////////////////////////////////
//Listener for buttons which controls modals for login and reg..
btnsHeaderModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

//Listener for lost password.
btnLoginForgotSend.addEventListener("click", openModal);
btnForgotSendEmailAndChange.addEventListener("click", forgotPassword());
btnForgotSendEmailAndChange.addEventListener("click", openModal);
btnForgotChange.addEventListener("click", resetPassword());

//Listener for hiding "overlay" & active modal window.
modalBack.forEach((background) =>
  background.addEventListener("click", closeModal)
);

//Listener for hiding "overlay" & active modal window.
document.addEventListener("keydown", function (btn) {
  if (btn.key === "Escape") closeModal();
});

//Listener for enter to log in.
modals.forEach((modal) => {
  modal.addEventListener("keydown", function (btn) {
    if (btn.keyCode === 13) {
      btn.preventDefault();
      if (modal.id === "modal-login") btnLoginLogin.click();
      if (modal.id === "modal-change") btnChangeChange.click();
      if (modal.id === "modal-registration") btnRegReg.click();
      if (modal.id === "modal-forgot-send") btnForgotSendEmailAndChange.click();
      if (modal.id === "modal-forgot-send-email-and-change")
        btnForgotChange.click();
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
    if (this.id === "btn-bet") betting();
  });
});

//Buttons listeners.
//////////////////////////////////////////////////////
btnLoginLogin.addEventListener("click", logIN);
btnRegReg.addEventListener("click", registration);
btnLogOut.addEventListener("click", logOUT);
btnChangeChange.addEventListener("click", passwordChange);
bodyUserOtherBack.addEventListener("click", function () {
  bodyUserOther.classList.add("is-hidden");
  bodyTable.classList.remove("is-hidden");
});

//Listener for EYE checkbox to show password.
loginShowPwd.addEventListener("click", function () {
  inputLoginPwd.type = "text";
  this.classList.add("is-hidden");
  loginHidePwd.classList.remove("is-hidden");
});
loginHidePwd.addEventListener("click", function () {
  inputLoginPwd.type = "password";
  this.classList.add("is-hidden");
  loginShowPwd.classList.remove("is-hidden");
});

//Listener for password reset buttons.

btnNavbarBurger.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
  btnNavbarBurger.classList.toggle("is-active");
});
