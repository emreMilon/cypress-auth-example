/// <reference types="cypress" />
declare namespace Cypress {
  export interface Chainable {
    /**
     * Custom command that fill the form
     * @param selector
     * @param value
     */

    fillForm(selector: string, value: string): void;

    /**
     * Custom command that checks post api property of message
     * @param body
     * @param value
     */

    checkPostApiMessage(body: any, value: string): boolean;

    /**
     * Custom command that checks the price of forecast between server and client
     * @param selector
     * @param value
     */

    checkPrice(selector: string, value: number): boolean;

    /**
     * Custom command that clicks the selected element 
     * @param selector
     */

    clickElement(selector:string): void;

  }
}
