describe('tester', () => {
  beforeEach(() => cy.visit('/state'));

  it('should set everything', () => {
    cy.get('#set-everything').click();

    cy.location('search').should('contain', 'name=test');

    cy.location('search').should('contain', 'age=10');
    cy.location('search').should(
      'contain',
      'birthDate=2021-01-01T10%3A00%3A00.000Z',
    );
  });

  it('should react to url change', () => {
    cy.get('#next-link').click();

    cy.location('search').should('contain', 'name=link%2Ftest');
  });
});
