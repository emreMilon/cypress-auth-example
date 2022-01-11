/// <reference types="Cypress" />

import { IResponseRegister } from "../../support/interfaces";
import { registerData } from "../../fixtures/registerData";
describe("My Register Test Suite", () => {
  it("Register post api test case", function () {
    cy.request("POST", Cypress.env("url_Backend") + "register", {
      userId: registerData.userId,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      position: registerData.position,
      email: registerData.email,
      password: registerData.password,
    }).then((response: IResponseRegister) => {
      cy.checkPostApiMessage(response.body, "Please active your account");
      expect(response.body).to.have.property("activeToken");
    });
  });
  it("Register test case in frontend", function () {
    cy.visit(Cypress.env("url_Frontend") + "register");
    cy.fillForm("userId", registerData.userId);
    cy.fillForm("firstName", registerData.firstName);
    cy.fillForm("lastName", registerData.lastName);
    cy.fillForm("position", registerData.position);
    cy.fillForm("email", registerData.email);
    cy.fillForm("password", registerData.password);
    cy.fillForm("passwordConfirmation", registerData.password);
    cy.get("button[class*='btn'")
      .click()
      .then(() => {
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
