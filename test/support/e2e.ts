before(() => {
    cy.exec("npm run test:mox:reinit");
    cy.intercept({ method: "POST", url: "/mox/**" }).as("mox");
});
