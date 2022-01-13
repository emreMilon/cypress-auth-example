/// <reference types="Cypress" />

import {
  IUserData,
  ICustomerData,
} from "../../support/interfaces";

describe("My Index Page Test Suite", () => {
  it("Client - Index Page and Customers Component Test", () => {
    cy.log("Customer / Index page test case");
    let zipCode: string;
    let resLogin: IUserData;
    let resCustomer: ICustomerData[];
    cy.loginFrontend("Vertrieber");
    cy.clickElement(".btn");
    cy.dbUserLogin().then((result) => {
      resLogin = result[0];
      return resLogin;
    });
    cy.selectTable("Customer")
      .then((result: ICustomerData[]) => {
        resCustomer = [...result];
        return resCustomer;
      })
      .then(() => {
        cy.get(".customerCard")
          .find(".card")
          .its("length")
          .should("eq", resCustomer?.length);
        cy.get(`:nth-child(${1}) > .list-group > :nth-child(3)`)
          .then((zip) => {
            zipCode = zip.text();
          })
          .then(() => {
            expect(Number(zipCode)).to.equal(resCustomer[0]?.zip);
          });
        const navBarLink = cy.get(
          ".navbarHeader > :nth-child(1) > :nth-child(2) > .nav-link"
        );
        if (resLogin?.position === "Vertrieber") {
          navBarLink.should("have.text", "Forecasts");
        } else if (resLogin?.position === "Leiter") {
          navBarLink.should("have.text", "Users");
        }

        cy.get("li.nav-link").should("have.text", resLogin?.lastName);
      });
    //logout
    cy.clickElement(":nth-child(2) > :nth-child(1) > .nav-link").then(() => {
      cy.get(".navbar-brand").should("have.text", "CRM-Forecast");
      cy.get(":nth-child(1) > .nav-link").should("have.text", "Login");
      cy.get('h2[class*="text"]').then((indexText) => {
        expect(indexText.text().includes("CRM FORECAST")).to.be.true;
      });
    });
  });
});
