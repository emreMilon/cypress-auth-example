declare global {
    namespace Cypress {
        interface Chainable {
            checkPrice: typeof checkPrice;
       }
    }
}


export const checkPrice = (selector : string, value : number) => {
    cy.get(selector).then((string) => {
        let price: string[] = string.text().split("&&");
        expect(price[1].includes(`${value}`)).to.be.true;
      });
}