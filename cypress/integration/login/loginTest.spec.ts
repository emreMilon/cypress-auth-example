/// <reference types="Cypress" />

import { ILoginData, IUserData } from "../../support/interfaces";

describe("My Login Test Suite", () => {
  let userData: IUserData;

  beforeEach(function () {
    cy.fixture("login.json").then((data: ILoginData) => {
      this.data = data;
    });
  });

  it("login test", function () {
    cy.log("Backend Part");
    cy.request("POST", Cypress.env("url_Backend") + "login", {
      email: this.data.email,
      password: this.data.password,
    })
      .then(function (response) {
        expect(response.body).to.have.property(
          "message",
          "Login Successfully completed"
        );
        cy.checkPostApiMessage(response.body, "Login Successfully completed")
        userData = response.body["user"];
      })
      .then(function () {
        cy.log("Frontend part");

        cy.visit(Cypress.env("url_Frontend") + "login");
        cy.fillForm("email", this.data.email)
        cy.fillForm("password", this.data.password)
        cy.get(".btn").click();
        cy.get("li.nav-link").should("have.text", userData.lastName);
        cy.get(".container").find(".customerCard");
      });
  });
});
