import { loginData } from "../../fixtures/loginData";
let localStorage;

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
  }
}

export const loginBackend = (position: string) => {
  let index: number;
  if (position === "Leiter") {
    index = 0;
  } else if (position === "Vertrieber") {
    index = 1;
  }



    return  cy.request("POST", Cypress.env("url_Backend") + "login", {
    email: loginData[index].email,
    password: loginData[index].password,
  });
};

export const loginFrontend = (position: string) => {
    let index: number;
    if (position === "Leiter") {
      index = 0;
    } else if (position === "Vertrieber") {
      index = 1;
    }
    cy.visit(Cypress.env("url_Frontend") + "login");
    cy.fillForm("email", loginData[index].email)
    cy.fillForm("password", loginData[index].password)
}

export const logOutBackend = () => {
  cy.request("GET", Cypress.env("url_Backend")+ "logout").then((response) => {
    cy.checkPostApiMessage(response.body, "Successfully logged out!")
    cy.clearCookie("refreshtoken")
  })

}

export const logOutFrontend = () => {
  
  cy.contains("Logout").click().then(() => {
    cy.clearLocalStorage()
    cy.get(".position-relative").find("h2").then((data) => {
      expect(data.text().includes("Welcome")).to.be.true
    })
  })
}
