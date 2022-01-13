declare global {
  namespace Cypress {
    interface Chainable {
      selectTable: typeof selectTable;
    }
    interface Chainable {
      selectUser: typeof selectUser;
    }
  }
}

export const selectTable = (tableName: string) => {
  return cy.task("queryDb", `SELECT * FROM ${tableName}`);
};

export const selectUser = (tableName: string, userId: string) => {
  return cy.task("queryDb", `SELECT * FROM ${tableName} WHERE userId = "${userId}"`);
}
