/// <reference types="Cypress" />

import {
  ILoginData,
  IUserData,
  IResponseLogin,
  IResponseCustomer,
} from "../../support/interfaces";

describe("My Index Page Test Suite", () => {
  let token: string;
  let user: IUserData;
  let customerDataofLength: number;
  let customerDataofFirstElementZipCode: number;

  beforeEach(function () {
    cy.fixture("login.json").then((data: ILoginData) => {
      this.data = data;
    });
  });

  it("after login customers page test case", function () {
    cy.request("POST", Cypress.env("url_Backend") + "login", {
      email: this.data.email,
      password: this.data.password,
    })
      .then(function (response: IResponseLogin) {
        expect(response.body).to.have.property(
          "message",
          "Login Successfully completed"
        );
        expect(response.body).to.have.property("user");
        token = response.body["access_token"];
        user = response.body["user"];
      })
      .then(() => {
        cy.log("customers get api test");
        const options = {
          method: "GET",
          url: `${Cypress.env("url_Backend")}customers`,
          headers: {
            tokenn: token,
          },
        };
        cy.request(options).then(function (response: IResponseCustomer) {
          expect(response.body).to.have.property(
            "message",
            "All customers found"
          );
          customerDataofFirstElementZipCode = response.body["data"][0].zip;
          customerDataofLength = response.body["data"].length;
        });
      })
      .then(() => {
        cy.log("Customer / Index page test case");
        let zipCode: string;
        cy.visit(Cypress.env("url_Frontend") + "login");
        cy.get("#email").type(this.data.email);
        cy.get("#password").type(this.data.password);
        cy.get(".btn").click();
        cy.get(".customerCard")
          .find(".card")
          .its("length")
          .should("eq", customerDataofLength);
        cy.get(`:nth-child(${1}) > .list-group > :nth-child(3)`)
          .then((zip) => {
            zipCode = zip.text();
          })
          .then(() => {
            expect(Number(zipCode)).to.equal(customerDataofFirstElementZipCode);
          });
        const navBarLink = cy.get(
          ".navbarHeader > :nth-child(1) > :nth-child(2) > .nav-link"
        );
        if (user.position === "Vertrieber") {
          navBarLink.should("have.text", "Forecasts");
        } else if (user.position === "Leiter") {
          navBarLink.should("have.text", "Users");
        }

        cy.get("li.nav-link").should("have.text", user.lastName);
        //logout
        cy.get(":nth-child(2) > :nth-child(1) > .nav-link")
          .click()
          .then(() => {
            cy.get(".navbar-brand").should("have.text", "CRM-Forecast");
            cy.get(":nth-child(1) > .nav-link").should("have.text", "Login");
            cy.get('h2[class*="text"]').then((indexText) => {
              expect(indexText.text().includes("CRM FORECAST")).to.be.true;
            });
          });
      });
  });
});