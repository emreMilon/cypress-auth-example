declare global {
    namespace Cypress {
         interface Chainable {
              checkPostApiMessage: typeof checkPostApiMessage;
         }
    }
}

export const checkPostApiMessage = (body : any, value : string) => {
    expect(body).to.have.property(
        "message",
        value
      );
}
