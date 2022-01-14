import { loginData } from "../../fixtures/loginData";

declare global {
  namespace Cypress {
    interface Chainable {
      loginBackend: typeof loginBackend;
    }
    interface Chainable {
      loginFrontend: typeof loginFrontend;
    }
    interface Chainable {
      logOutBackend: typeof logOutBackend;
    }
    interface Chainable {
      logOutFrontend: typeof logOutFrontend;
    }

    interface Chainable {
      dbUserLogin: typeof dbUserLogin;
    }
  }
}
let index: number;
export const loginBackend = (position: string) => {
  if (position === "Leiter") {
    index = 0;
  } else if (position === "Vertrieber") {
    index = 1;
  }

  return cy.request("POST", Cypress.env("url_Backend") + "login", {
    email: loginData[index].email,
    password: loginData[index].password,
  });
};

export const loginFrontend = (data: any) => {
  cy.fillForm("email", data.email);
  cy.fillForm("password", data.password);
};

export const logOutBackend = () => {
  cy.request("GET", Cypress.env("url_Backend") + "logout").then((response) => {
    cy.checkPostApiMessage(response.body, "Successfully logged out!");
    cy.clearCookie("refreshtoken");
  });
};

export const logOutFrontend = () => {
  cy.contains("Logout")
    .click()
    .then(() => {
      cy.clearLocalStorage();
      cy.get(".position-relative")
        .find("h2")
        .then((data) => {
          expect(data.text().includes("Welcome")).to.be.true;
        });
    });
};

export const dbUserLogin = () => {
  return cy.task(
    "queryDb",
    `SELECT * FROM User WHERE Email = "${loginData[index].email}" `
  );
};
