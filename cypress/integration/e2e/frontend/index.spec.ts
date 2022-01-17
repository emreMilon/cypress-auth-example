/// <reference types="Cypress" />
/// <reference types="cypress-localstorage-commands" />
import { IRegisterData, ICustomerData, IUserData, IForecastData } from "../../../support/interfaces";
import { registerData } from "../../../fixtures/registerData";


const url: string = `http://localhost:3000/api/`;
describe("After Login Index Page and forecasts page test suite", () => {
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
      //cy.contains("Logout").click();
      

    });

    it("it should come customers", () => {
      let resCustomer: ICustomerData[];
      let zipCode: string;
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
        });
    });

    it("it should be wriiten on navbar users or forcasts according to user.position", function () {
      const navBarLink = cy.get(
        ".navbarHeader > :nth-child(1) > :nth-child(2) > .nav-link"
      );
      if (data?.position === "Vertrieber") {
        navBarLink.should("have.text", "Forecasts");
      } else if (data?.position === "Leiter") {
        navBarLink.should("have.text", "Users");
      }
      
    });

    data.position === "Leiter" ? (
       it("it shoulds logout then login und comes users", () => {
         let localstorage: string ;
         let users : IUserData[];
         let forecasts: IForecastData[];

        cy.contains("Logout").click().then(() => {
          cy.visit(Cypress.env("url_Frontend") + "login");
          cy.loginFrontend(data);
          cy.intercept({ method: "POST", url: `${url}/login` }, (req) => {
            expect(req.body.email).to.include(data.email);
            req.continue((res) => {
              let text = res.body.message;
              expect(text).to.include("Successfully");
            });
          }).as(`login${registerData[0].userId}`);
          cy.clickElement(".btn");
          cy.wait(`@login${registerData[0].userId}`, { timeout: 15000 });
          cy.getLocalStorage("logged").then(x => {
              localstorage = x  
          })
          cy.intercept({method: "GET", url:"http://localhost:3000/api//users"}, req => {
            //req.headers['tokenn']=`${localstorage}`
            req.continue((res) => {
                let text = res.body.message;
                expect(text).to.include("All users found");
            });
        }).as("users")
        cy.contains("Users").click()
        cy.wait("@users")
        cy.task(
            "queryDb",
            `SELECT * FROM User WHERE Position = "Vertrieber"  `
          ).then((result: IUserData[]) => {
            users = [...result];
            return users;
          }).then(() => {
            cy.get(".users")
            .find(".userCard")
            .its("length")
            .should("eq", users?.length);
            cy.get(":nth-child(1) > .card > .card-body > .card-title").then(
                (userId) => {
                  expect(userId.text()).to.equal(users[0].userId);
                }
              );
          })    
        cy.selectTable("Forecast").then((result: IForecastData[]) => {
            forecasts = [...result];
            forecasts = forecasts.filter(
              (forecast) => forecast.userId === users[0].userId
            );
          }).then(() => {
            cy.get(".container > :nth-child(2)").then(() => {
                cy.clickElement(":nth-child(1) > .card > .card-header");
                cy.checkPrice(".card-header", forecasts[0].price);
              });
          })
          
        })
       })
    ) : (
        it("It should come forecasts", () => {
            let forecasts: IForecastData[]
            cy.selectTable("Forecast").then((result: IForecastData[]) => {
                forecasts = [...result];
                forecasts = forecasts.filter(
                  (forecast) => forecast.userId === data.userId
                );
              });
              forecasts ? cy.checkPrice(":nth-child(1) > .card-header", forecasts[0].price) : 
              console.log(`forecasts`, forecasts)
              cy.log("There is no forecast");
        })
    )



  });
});
