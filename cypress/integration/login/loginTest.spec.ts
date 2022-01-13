/// <reference types="Cypress" />

import { IUserData } from "../../support/interfaces";

describe("My Login Test Suite", () => {
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
