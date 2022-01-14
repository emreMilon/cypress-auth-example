/// <reference types="Cypress" />

import { IRegisterData } from "../../../support/interfaces";
import { registerData } from "../../../fixtures/registerData";
const url: string = `http://localhost:3000/api/`;

describe("My Register Test Suite", () => {
  registerData.map((data: IRegisterData) => {
    it("Sending data from client to database", function () {
      const url: string = "http://localhost:3000/api/register";
      cy.visit(Cypress.env("url_Frontend") + "register");
      cy.intercept({ method: "POST", url: url }, (req) => {
        expect(req.body.userId).to.include(data.userId);
        req.continue((res) => {
          let text = res.body.message;
          expect(text).to.include("successfully");
        });
      }).as(`register${data.userId}`);
      cy.fillForm("userId", data.userId);
      cy.fillForm("firstName", data.firstName);
      cy.fillForm("lastName", data.lastName);
      cy.fillForm("position", data.position);
      cy.fillForm("email", data.email);
      cy.fillForm("password", data.password);
      cy.fillForm("passwordConfirmation", data.password);
      cy.get("button[class*='btn'").click();
      cy.wait(`@register${data.userId}`, { timeout: 15000 });
      cy.get("#success").then((text) => {
        const success = text.text();
        expect(success.includes("successfully registered.")).to.be.true;
      });
    });
  });

  registerData.map((data: IRegisterData) => {
    it("If it is already registered", function () {
      cy.visit(Cypress.env("url_Frontend") + "register");
      cy.intercept({ method: "POST", url: `${url}/register` }, (req) => {
        expect(req.body.userId).to.include(data.userId);
        req.continue((res) => {
          let text = res.body.message;
          expect(text).not.to.include("successfully");
        });
      }).as(`register${data.userId}`);
      cy.fillForm("userId", data.userId);
      cy.fillForm("firstName", data.firstName);
      cy.fillForm("lastName", data.lastName);
      cy.fillForm("position", data.position);
      cy.fillForm("email", data.email);
      cy.fillForm("password", data.password);
      cy.fillForm("passwordConfirmation", data.password);
      cy.get("button[class*='btn'").click();
      cy.wait(`@register${data.userId}`, { timeout: 15000 });
      cy.get("#error").then((text) => {
        const error = text.text();
        expect(error.includes("already registered")).to.be.true;
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
