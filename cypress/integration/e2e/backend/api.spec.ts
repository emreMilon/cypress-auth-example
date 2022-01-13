/// <reference types="Cypress" />
import { registerData } from "../../../fixtures/registerData";
import { updatedUserData } from "../../../fixtures/updatedUserData";
import { loginData } from "../../../fixtures/loginData";
import {
  ILoginData,
  IRegisterData,
  IResponseRegister,
  IUserData,
  IResponseCustomer,
  IUserResponse,
  IResponseForecast,
  IForecastData,
} from "../../../support/interfaces";
describe("Backend API test suite", function () {
  it("It saves the userData to the database", function () {
    registerData.map((data: IRegisterData) => {
      cy.request("POST", Cypress.env("url_Backend") + "register", {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        position: data.position,
        email: data.email,
        password: data.password,
      }).then((response: IResponseRegister) => {
        cy.checkPostApiMessage(
          response.body,
          "Your email has been successfully registered."
        );
        expect(response.body).to.have.property("activeToken");
      });
    });
  });
  it("It checks if the user is registered to DB", function () {
    registerData.map((data: IRegisterData) => {
      cy.selectUser("User", data.userId).then((result: IUserData[]) => {
        expect(data.userId).to.equal(result[0].userId);
      });
    });
  });
  it("It logins to the app", function () {
    loginData.map((data: ILoginData) => {
      cy.request("POST", Cypress.env("url_Backend") + "login", {
        email: data.email,
        password: data.password,
      }).then((response: IResponseRegister) => {
        cy.checkPostApiMessage(response.body, "Login Successfully completed");
        expect(response.body).to.have.property("access_token");
      });
    });
  });

  for (let i = 0; i < 2; i++) {
    describe("It logins to api and gets the customers, forecasts and users", function () {
      beforeEach("It logins to the api", function () {
        cy.request("POST", Cypress.env("url_Backend") + "login", {
          email: loginData[i].email,
          password: loginData[i].password,
        }).then((response: IResponseRegister) => {
          cy.checkPostApiMessage(response.body, "Login Successfully completed");
          expect(response.body).to.have.property("access_token");
          this.token = response.body["access_token"];
          this.user = response.body["user"];
        });
      });

      it("it gets customers", function () {
        const options = {
          method: "GET",
          url: `${Cypress.env("url_Backend")}customers`,
          headers: {
            tokenn: this.token,
          },
        };
        cy.request(options).then(function (response: IResponseCustomer) {
          cy.checkPostApiMessage(response.body, "All customers found");
          expect(response.body).to.have.property("status", "success");
        });
      });

      it("it gets forecasts", function () {
        const options = {
          method: "GET",
          url: `${Cypress.env("url_Backend")}forecasts`,
          headers: {
            tokenn: this.token,
          },
        };
        cy.request(options).then(function (response: IResponseForecast) {
          let forecasts: IForecastData[] = response.body["data"];
          cy.checkPostApiMessage(response.body, "All forecasts found");
          expect(response.body).to.have.property("status", "success");
          expect(forecasts.length).greaterThan(1);
        });
      });

      it("it gets users", function () {
        const options = {
          method: "GET",
          url: `${Cypress.env("url_Backend")}users`,
          headers: {
            tokenn: this.token,
          },
        };

        cy.request(options).then(function (response: IUserResponse) {
          cy.checkPostApiMessage(response.body, "All users found");
          expect(response.body).to.have.property("status", "success");
          if (i === 0) {
            expect(this.user.position).equal("Leiter");
          } else if (i === 2) {
            expect(this.user.position).equal("Vertrieber");
          }
        });
      });
    });
  }

  for (let i = 0; i < 2; i++) {
    describe("Update User Test Case", function () {
      before("It logins to the api", function () {
        cy.request("POST", Cypress.env("url_Backend") + "login", {
          email: loginData[i].email,
          password: loginData[i].password,
        }).then((response: IResponseRegister) => {
          cy.checkPostApiMessage(response.body, "Login Successfully completed");
          expect(response.body).to.have.property("access_token");
          this.token = response.body["access_token"];
          this.user = response.body["user"];
        });
      });
      it("It updates the userData in the database", function () {
        const options = {
          method: "PUT",
          url: Cypress.env("url_Backend") + `userUpdate/${this.user.userId}`,
          headers: {
            tokenn: this.token,
          },
          body: {
            userId: updatedUserData[i].userId,
            firstName: updatedUserData[i].firstName,
            lastName: updatedUserData[i].lastName,
            position: updatedUserData[i].position,
            email: updatedUserData[i].email,
            password: updatedUserData[i].password,
          },
        };
        cy.request(options).then((response: IResponseRegister) => {
          cy.checkPostApiMessage(response.body, "User updated successfully");
          let updatedUser: IUserData = response.body["data"];
          expect(updatedUser).to.have.property("userId");
        });
      });
      it(`It checks the database, whether the ${updatedUserData[i].userId} is updatet or not `, () => {
        cy.selectUser("User", updatedUserData[i].userId).then(
          (result: IUserData[]) => {
            expect(result[0].userId).to.equal(updatedUserData[i].userId);
          }
        );
      });
    });
  }

  for (let i = 0; i < 2; i++) {
    describe("Delete api test case", function () {
      before("It logins to the api", function () {
        cy.request("POST", Cypress.env("url_Backend") + "login", {
          email: updatedUserData[i].email,
          password: updatedUserData[i].password,
        }).then((response: IResponseRegister) => {
          cy.checkPostApiMessage(response.body, "Login Successfully completed");
          expect(response.body).to.have.property("access_token");
          this.token = response.body["access_token"];
          this.user = response.body["user"];
        });
      });
      it("It deletes the userData from the database", function () {
        const options = {
          method: "DELETE",
          url: Cypress.env("url_Backend") + `userDelete/${this.user.userId}`,
          headers: {
            tokenn: this.token,
          },
        };
        cy.request(options).then((response: any) => {
          cy.checkPostApiMessage(
            response.body,
            `${this.user.userId} deleted successfully`
          );
        });
      });
      it(`It checks the database, whether the ${updatedUserData[i].userId} is deleted or not `, () => {
        cy.selectUser("User", updatedUserData[i].userId).then(
          (result: IUserData[]) => {
            expect(result.length).to.equal(0);
          }
        );
      });
    });
  }

});
