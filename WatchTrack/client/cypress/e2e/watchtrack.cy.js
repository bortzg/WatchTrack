describe("WatchTrack complete user journey", () => {
  const uniqueId = Date.now();
  const user = {
    name: `Cypress User ${uniqueId}`,
    email: `cypress-${uniqueId}@example.com`,
    password: "Cypress123!",
  };
  const movieTitle = `Cypress Movie ${uniqueId}`;
  const updatedMovieTitle = `${movieTitle} Updated`;

  it("completes authentication and movie/review CRUD", () => {
    cy.visit("/");
    cy.contains("h1", "Browse Movies").should("be.visible");

    cy.contains("a", "Sign up").click();
    cy.get('input[name="name"]').type(user.name);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password, { log: false });
    cy.contains("button", "Sign Up").click();
    cy.location("pathname").should("eq", "/signin");

    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password, { log: false });
    cy.contains("button", "Sign In").click();
    cy.location("pathname").should("eq", "/");
    cy.contains(`Hi, ${user.name}`).should("be.visible");

    cy.contains("a", "Add Movie").click();
    cy.get('input[name="title"]').type(movieTitle);
    cy.get('input[name="director"]').type("Cypress Director");
    cy.get('input[name="year"]').type("2026");
    cy.get('input[name="genre"]').type("Testing");
    cy.get('textarea[name="description"]').type("Created by the Cypress E2E test.");
    cy.contains("button", "Add Movie").click();
    cy.contains("h1", movieTitle).should("be.visible");

    cy.contains("a", "Edit Movie").click();
    cy.get('input[name="title"]').clear().type(updatedMovieTitle);
    cy.contains("button", "Save Changes").click();
    cy.contains("h1", updatedMovieTitle).should("be.visible");

    cy.get(".review-form textarea").type("A review created by Cypress.");
    cy.get(".review-form select").select("4");
    cy.contains("button", "Submit Review").click();
    cy.contains("A review created by Cypress.").should("be.visible");

    cy.get(".review-item").within(() => {
      cy.contains("button", "Edit").click();
      cy.get("textarea").clear().type("An updated review from Cypress.");
      cy.get("select").select("5");
      cy.contains("button", "Save").click();
    });
    cy.contains("An updated review from Cypress.").should("be.visible");

    cy.get(".review-item").within(() => {
      cy.contains("button", "Delete").click();
    });
    cy.contains("An updated review from Cypress.").should("not.exist");

    cy.contains("button", "Delete Movie").click();
    cy.location("pathname").should("eq", "/");
    cy.contains(updatedMovieTitle).should("not.exist");

    cy.contains("a", "MyProfile").click();
    cy.contains("h1", "My Profile").should("be.visible");
    cy.screenshot("watchtrack-e2e-passed");
    cy.contains("button", "Delete My Account").click();
    cy.location("pathname").should("eq", "/signin");
    cy.contains("h1", "Sign In").should("be.visible");
  });
});
