import { getH1 } from '../support/app.po';

describe('Examples: Basic', () => {
  beforeEach(() => cy.visit('/examples/basic'));

  it('should render example', () => {
    getH1().contains('Basic');
  });

  it('should not change URL', () => {
    cy.location('pathname').should('eq', '/examples/basic');
    cy.location('search').should('be.empty');
  });

  it('should change URL on button click', () => {
    cy.wait(2000); // nextra does a weird url "clearing" in first few seconds
    cy.get('#set-basic-state').click();

    cy.location('pathname').should('eq', '/examples/basic');
    cy.location('search').should('contain', '?search=query&limit=10');

    cy.get('.state-result').should('contain.text', '"search": "query"');
    cy.get('.state-result').should('contain.text', '"limit": 10');
    cy.get('.state-result').should('contain.text', '"from": "20');
  });
});
