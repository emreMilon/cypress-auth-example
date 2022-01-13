/// <reference types="Cypress" />

import {
  IUserData,
  IForecastData,
  IUserResponse,
} from "../../support/interfaces";

describe("My Forecasts Page Test Suite", function () {
  let token: string;
  let forecasts: IForecastData[];
  let users: IUserData[];

  it("forecast and users page test", () => {
    let resLogin: IUserData;
    const optionsUsers = {
      method: "GET",
      url: Cypress.env("url_Backend") + "users",
      headers: {
        tokenn: token,
      },
    };

    cy.loginFrontend("Leiter");
    cy.clickElement(".btn");
    cy.dbUserLogin()
      .then((result) => {
        resLogin = result[0];
        return resLogin;
      })
      .then(() => {
        if (resLogin.position === "Leiter") {
          cy.contains("Users").click();
          cy.log("Get Users Get Api Backend Test");

          cy.request(optionsUsers).then(function (response: IUserResponse) {
            cy.checkPostApiMessage(response.body, "All users found");
            cy.task(
              "queryDb",
              `SELECT * FROM User WHERE Position = "Vertrieber"  `
            ).then((result: IUserData[]) => {
              users = [...result];
              return users;
            });
            cy.get(":nth-child(1) > .card > .card-body > .card-title").then(
              (userId) => {
                expect(userId.text()).to.equal(users[0].userId);
              }
            );

            cy.selectTable("Forecast").then((result: IForecastData[]) => {
              forecasts = [...result];
              forecasts = forecasts.filter(
                (forecast) => forecast.userId === users[0].userId
              );
            });
            cy.get(".container > :nth-child(2)").then(() => {
              cy.clickElement(":nth-child(1) > .card > .card-header");
              cy.checkPrice(".card-header", forecasts[0].price);
            });
          });
        } else {
          cy.contains("Forecasts").click();
          forecasts = forecasts.filter(
            (forecast) => forecast.userId === resLogin.userId
          );

          cy.checkPrice(":nth-child(1) > .card-header", forecasts[0].price);
        }
      });
  });
});
