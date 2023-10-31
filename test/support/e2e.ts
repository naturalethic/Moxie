before(() => {
    cy.exec("npm run test:mox:restore");
    cy.intercept({ method: "POST", url: "/mox/**" }).as("mox");
});
