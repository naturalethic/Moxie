describe("accounts", () => {
    it("adds an account", () => {
        cy.visit("http://localhost:5173/admin/accounts/new");
        cy.get("input[name='username']").should("have.focus");
        cy.get("input[name='username']").type("alef");
        cy.get("form").contains("Add new account").click();
        cy.get("input[name='username']")
            .should("have.value", "")
            .should("have.focus");
        cy.get(".browser-label").should("contain", "alef");
    });
});

describe("domains", () => {
    it("adds a domain", () => {
        cy.visit("http://localhost:5173/admin/domains/new");
        cy.get("input[name='domain']").should("have.focus");
        cy.get("input[name='domain']").type("alpha");
        cy.get("form").contains("Add new domain").click();
        cy.get("input[name='domain']")
            .should("have.value", "")
            .should("have.focus");
        cy.get(".browser-label").should("contain", "alpha");
    });
});
