/// <reference types="Cypress" />

import { IResponseLogin } from "../../support/interfaces";

describe("My Login Test Suite", () => {
  it("login test Backend", function () {
    cy.log("Backend Part");
    cy.loginBackend("Leiter").then(function (response: IResponseLogin) {
      cy.checkPostApiMessage(response.body, "Login Successfully completed");
    });
    cy.logOutBackend();
  });

  it("login test frontend", function () {
    cy.log("Frontend part");
    cy.loginFrontend("Leiter");
    cy.clickElement(".btn");
    cy.get(".container").find(".customerCard");
    cy.logOutFrontend();
  });
});
