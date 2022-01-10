/// <reference types="Cypress" />

import {
  IResponseLogin,
  ILoginData,
  IUserData,
  IResponseForecast,
  IForecastData,
  IUserResponse,
} from "../../support/interfaces";

describe("My Forecasts Page Test Suite", function () {
  let token: string;
  let user: IUserData;
  let priceOfFirstForecast: number;
  let forecastDataofLength: number;
  let forecasts: IForecastData[];
  let users: IUserData[];

  beforeEach(function () {
    cy.fixture("login.json").then((data: ILoginData) => {
      this.data = data;
    });
  });
  it("after login forecasts page test case", function () {
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
        cy.log("forecasts get api test");
        const options = {
          method: "GET",
          url: `${Cypress.env("url_Backend")}forecasts`,
          headers: {
            tokenn: token,
          },
        };
        cy.request(options).then((response: IResponseForecast) => {
          expect(response.body).to.have.property(
            "message",
            "All forecasts found"
          );
          forecasts = response.body["data"];
          priceOfFirstForecast = response.body["data"][0].price;
          cy.log(`${priceOfFirstForecast}`);
          forecastDataofLength = response.body["data"].length;
          cy.log("length", forecastDataofLength);
        });
      })
      .then(() => {
        cy.log("Forecast / Users page test case");

        const optionsUsers = {
          method: "GET",
          url: Cypress.env("url_Backend") + "users",
          headers: {
            tokenn: token,
          },
        };

        cy.visit(Cypress.env("url_Frontend") + "login");
        cy.get("#email").type(this.data.email);
        cy.get("#password").type(this.data.password);
        cy.get(".btn").click();
        if (user.position === "Leiter") {
          cy.contains("Users").click();
          cy.log("Get Users Get Api Backend Test");

          cy.request(optionsUsers).then(function (response: IUserResponse) {
            expect(response.body).to.have.property(
              "message",
              "All users found"
            );
            users = response.body["data"].filter(
              (user) => user.position === "Vertrieber"
            );

            cy.get(":nth-child(1) > .card > .card-body > .card-title").then(
              (userId) => {
                expect(userId.text()).to.equal(users[0].userId);
              }
            );

            forecasts = forecasts.filter(
              (forecast) => forecast.userId === users[0].userId
            );

            cy.get(".container > :nth-child(2)").then(() => {
              cy.get(":nth-child(1) > .card > .card-header").click();

              cy.get(".card-header").then((string) => {
                let price: string[] = string.text().split("&&");
                expect(price[1].includes(`${forecasts[0].price}`)).to.be.true;
              });
            });
          });
        } else {
          cy.contains("Forecasts").click();
          forecasts = forecasts.filter(
            (forecast) => forecast.userId === user.userId
          );

          cy.get(":nth-child(1) > .card-header").then((string) => {
            let price = string.text().split("&&");
            expect(price[1].includes(`${forecasts[0].price}`)).to.be.true;
          });
        }
      });
  });
});