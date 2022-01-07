/// <reference types="Cypress" />

describe("My Index Page Test Suite", function () {
    let token;
    let customerDataofFirstElementZipCode;
    let customerDataofLength;
    let user;

    this.beforeEach(function () {
        cy.fixture("login.json").then((data) => {
            this.data = data;
        });
    });

    it("post api login test", function () {
        cy.request("POST", Cypress.env("url_Backend") + "login", {
            email: this.data.email,
            password: this.data.password,
        }).then(function (response) {
            expect(response.body).to.have.property(
                "message",
                "Login Successfully completed"
            );
            expect(response.body).to.have.property(
                "user"
            );
            token = response.body["access_token"];
            user = response.body["user"];
        });
    });

    it("customers get api test", function () {
        const options = {
            method: "GET",
            url: "http://localhost:5000/api/customers",
            headers: {
                tokenn: token,
            },
        };

        cy.request(options).then(function (response) {
            expect(response.body).to.have.property("message", "All customers found");
            customerDataofFirstElementZipCode = response.body["data"][0].zip;
            customerDataofLength = response.body["data"].length
        });
    });

    it("Customer Page Test Case", function () {
        let zipCode;
        cy.visit(Cypress.env("url_Frontend") + "login");
        cy.get("#email").type(this.data.email);
        cy.get("#password").type(this.data.password);
        cy.get(".btn").click()
        cy.get('.customerCard').find(".card").its('length').should('eq', customerDataofLength)
        cy.get(`:nth-child(${1}) > .list-group > :nth-child(3)`).then(
            (zip) => {
                zipCode = zip.text();
            }
        ).then(() => {
            expect(Number(zipCode)).to.equal(customerDataofFirstElementZipCode)
        })
        const navBarLink = cy.get('.navbarHeader > :nth-child(1) > :nth-child(2) > .nav-link')
        if (user.position === "Vertrieber") {
            navBarLink.should("have.text", "Forecasts")
        } else if (user.position === "Leiter") {
            navBarLink.should("have.text", "Users")
        }

        cy.get('li.nav-link').should("have.text", user.lastName)

        //logout
        cy.get(':nth-child(2) > :nth-child(1) > .nav-link').click().then(() => {
            cy.get('.navbar-brand').should("have.text", "CRM-Forecast")
            cy.get(':nth-child(1) > .nav-link').should("have.text", "Login")
            cy.get('h2[class*="text"]').then((indexText) => {

                expect(indexText.text().includes("CRM FORECAST")).to.be.true
            })

        })

    });
});