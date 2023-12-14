import { getH1 } from '../support/app.po';

describe('docs', () => {
  beforeEach(() => cy.visit('/'));

  it('should render top page', () => {
    // Custom command example, see `../support/commands.ts` file
    // cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getH1().contains('Introduction');
  });
});
