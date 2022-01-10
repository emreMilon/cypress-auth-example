/// <reference types="Cypress" />

import { IRegisterData, IResponseRegister } from "../../support/interfaces";

describe("My Register Test Suite", () => {
  beforeEach(function () {
    cy.fixture("register.json").then((data: IRegisterData) => {
      this.data = data;
    });
  });

  it("Register post api test case", function () {
    cy.request("POST", Cypress.env("url_Backend") + "register", {
      userId: this.data.userId,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      position: this.data.position,
      email: this.data.email,
      password: this.data.password,
    }).then((response: IResponseRegister) => {
      expect(response.body).to.have.property(
        "message",
        "Please active your account"
      );
      expect(response.body).to.have.property("activeToken");
    });
  });
  it("Register test case in frontend", function () {
    cy.visit(Cypress.env("url_Frontend") + "register");
    cy.get("#userId").type(this.data.userId);
    cy.get("#firstName").type(this.data.firstName);
    cy.get("#lastName").type(this.data.lastName);
    cy.get("#position").type(this.data.position);
    cy.get("#email").type(this.data.email);
    cy.get("#password").type(this.data.password);
    cy.get("#passwordConfirmation").type(this.data.password);
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
