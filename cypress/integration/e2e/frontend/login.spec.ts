/// <reference types="Cypress" />
import { IRegisterData } from "../../../support/interfaces";
import { registerData } from "../../../fixtures/registerData";
const url: string = `http://localhost:3000/api/`;
describe("Login Test Suite", () => {
  registerData.map((data: IRegisterData) => {
    it("Logins to the app", function () {
      cy.visit(Cypress.env("url_Frontend") + "login");
      cy.loginFrontend(data);
      cy.intercept({ method: "POST", url: `${url}/login` }, (req) => {
        expect(req.body.email).to.include(data.email);
        req.continue((res) => {
          let text = res.body.message;
          expect(text).to.include("Successfully");
        });
      }).as(`login${data.userId}`);
      cy.clickElement(".btn");
      cy.wait(`@login${data.userId}`, { timeout: 15000 });
      cy.contains("Logout").click();
    });
  });
});
