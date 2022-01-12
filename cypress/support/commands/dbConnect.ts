declare global {
  namespace Cypress {
    interface Chainable {
      selectTable: typeof selectTable;
    }
  }
}

export const selectTable = (tableName: string) => {
  return cy.task("queryDb", `SELECT * FROM ${tableName}`);
};
