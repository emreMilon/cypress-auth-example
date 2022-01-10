declare global {
    namespace Cypress {
        interface Chainable {
            clickElement: typeof clickElement;
        }
    }
}

export const clickElement = (selector: string) => {
    return cy.get(selector).click();
}