 declare global {
      namespace Cypress {
           interface Chainable {
                fillForm: typeof fillForm;
           }
      }
 }
 
 
 export const fillForm = (selector : string, value : string) => {
      cy.get(`#${selector}`).type(value)
 }
