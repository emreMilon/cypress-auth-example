/// <reference types="Cypress" />

import { IRegisterData } from "../../support/interfaces";
import { registerData } from "../../fixtures/registerData";

describe("My Register Test Suite", () => {

  
    it("Register test case in frontend", function () {
      registerData.map((data: IRegisterData) => {
      const url: string = "http://localhost:3000/api//register"
      cy.visit(Cypress.env("url_Frontend") + "register");
      cy.intercept({method: "POST", url: url}).as("register")
      cy.fillForm("userId", data.userId);
      cy.fillForm("firstName", data.firstName);
      cy.fillForm("lastName", data.lastName);
      cy.fillForm("position", data.position);
      cy.fillForm("email", data.email);
      cy.fillForm("password", data.password);
      cy.fillForm("passwordConfirmation", data.password);
      cy.get("button[class*='btn'").click()
      cy.wait('@register', {timeout: 15000})
          cy.get("#success").then((text) => {
            const success = text.text();
            expect(success.includes("active your account")).to.be.true;
        });
    });
  });

  it("Direct to login Page", () => {
    cy.visit(Cypress.env("url_Frontend") + "register");
    cy.get(".col-6")
      .click()
      .then(() => {
        cy.get(".text-uppercase").should("have.text", "Login");
      });
  });
});
