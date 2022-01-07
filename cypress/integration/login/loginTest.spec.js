/// <reference types="Cypress" />

describe("My Login Test Suite", function () {
  let userData;
  let userDataLastName;

  this.beforeEach(function () {
    cy.fixture("login.json").then((data) => {
      this.data = data;
    });
  });

  it("login test", function () {
    cy.log("Backend part");
    cy.request("POST", Cypress.env("url_Backend") + "login", {
      email: this.data.email,
      password: this.data.password,
    }).then(function (response) {
      expect(response.body).to.have.property(
        "message",
        "Login Successfully completed"
      );
      userData = response.body["user"];
      userDataLastName = userData.lastName;
    }).then(function () {
        cy.log("Frontend part");

        cy.visit(Cypress.env("url_Frontend") + "login");
        cy.get("#email").type(this.data.email);
        cy.get("#password").type(this.data.password);
        cy.get(".btn").click();
        cy.get("li.nav-link").should("have.text", userDataLastName);
        cy.get(".container").find(".customerCard");
    })

   
  });
});
