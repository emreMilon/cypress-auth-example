/// <reference types="Cypress" />

import { IResponseLogin, IUserData } from "../../support/interfaces";

describe("My Login Test Suite", () => {
  it("login test Backend", function () {
    cy.log("Backend Part");
    cy.loginBackend("Leiter").then(function (response: IResponseLogin) {
      cy.checkPostApiMessage(response.body, "Login Successfully completed");
    });
    cy.logOutBackend();
  });

  it("login test frontend", function () {
    let res: IUserData;
    cy.log("Frontend part");
    cy.loginFrontend("Leiter");
    cy.dbUserLogin().then((result) => {
      res = result[0];
      return res;
    });
    cy.clickElement(".btn");
    cy.get("li.nav-link").then((lastname) => {
      expect(lastname.text()).to.equal(res.lastName);
    });
    cy.get(".container").find(".customerCard");
    cy.logOutFrontend();
  });
});
