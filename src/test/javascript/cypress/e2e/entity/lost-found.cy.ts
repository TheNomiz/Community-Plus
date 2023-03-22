import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('LostFound e2e test', () => {
  const lostFoundPageUrl = '/lost-found';
  const lostFoundPageUrlPattern = new RegExp('/lost-found(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const lostFoundSample = {
    description: 'deposit',
    date: '2023-03-21',
    location: 'Central Buckinghamshire',
    item: 'Pound Canada systems',
    name: 'card Steel',
    email: 'Hershel98@gmail.com',
    phoneNumber: 'B2B Fish Square',
  };

  let lostFound;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/lost-founds+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/lost-founds').as('postEntityRequest');
    cy.intercept('DELETE', '/api/lost-founds/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (lostFound) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/lost-founds/${lostFound.id}`,
      }).then(() => {
        lostFound = undefined;
      });
    }
  });

  it('LostFounds menu should load LostFounds page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('lost-found');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('LostFound').should('exist');
    cy.url().should('match', lostFoundPageUrlPattern);
  });

  describe('LostFound page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(lostFoundPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create LostFound page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/lost-found/new$'));
        cy.getEntityCreateUpdateHeading('LostFound');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/lost-founds',
          body: lostFoundSample,
        }).then(({ body }) => {
          lostFound = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/lost-founds+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/lost-founds?page=0&size=20>; rel="last",<http://localhost/api/lost-founds?page=0&size=20>; rel="first"',
              },
              body: [lostFound],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(lostFoundPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details LostFound page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('lostFound');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPageUrlPattern);
      });

      it('edit button click should load edit LostFound page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LostFound');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPageUrlPattern);
      });

      it('edit button click should load edit LostFound page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LostFound');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPageUrlPattern);
      });

      it('last delete button click should delete instance of LostFound', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('lostFound').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPageUrlPattern);

        lostFound = undefined;
      });
    });
  });

  describe('new LostFound page', () => {
    beforeEach(() => {
      cy.visit(`${lostFoundPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('LostFound');
    });

    it('should create an instance of LostFound', () => {
      cy.get(`[data-cy="description"]`).type('Accountability Dollar').should('have.value', 'Accountability Dollar');

      cy.get(`[data-cy="date"]`).type('2023-03-22').blur().should('have.value', '2023-03-22');

      cy.get(`[data-cy="location"]`).type('leading-edge').should('have.value', 'leading-edge');

      cy.get(`[data-cy="item"]`).type('Illinois Supervisor lime').should('have.value', 'Illinois Supervisor lime');

      cy.get(`[data-cy="name"]`).type('Electronics').should('have.value', 'Electronics');

      cy.get(`[data-cy="email"]`).type('Russ38@yahoo.com').should('have.value', 'Russ38@yahoo.com');

      cy.get(`[data-cy="phoneNumber"]`).type('ClubXXXXXXX').should('have.value', 'ClubXXXXXXX');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        lostFound = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', lostFoundPageUrlPattern);
    });
  });
});
