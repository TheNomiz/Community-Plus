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

describe('LostFoundPage e2e test', () => {
  const lostFoundPagePageUrl = '/lost-found-page';
  const lostFoundPagePageUrlPattern = new RegExp('/lost-found-page(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const lostFoundPageSample = { description: 'Missouri Concrete encryption' };

  let lostFoundPage;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/lost-found-pages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/lost-found-pages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/lost-found-pages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (lostFoundPage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/lost-found-pages/${lostFoundPage.id}`,
      }).then(() => {
        lostFoundPage = undefined;
      });
    }
  });

  it('LostFoundPages menu should load LostFoundPages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('lost-found-page');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('LostFoundPage').should('exist');
    cy.url().should('match', lostFoundPagePageUrlPattern);
  });

  describe('LostFoundPage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(lostFoundPagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create LostFoundPage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/lost-found-page/new$'));
        cy.getEntityCreateUpdateHeading('LostFoundPage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/lost-found-pages',
          body: lostFoundPageSample,
        }).then(({ body }) => {
          lostFoundPage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/lost-found-pages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/lost-found-pages?page=0&size=20>; rel="last",<http://localhost/api/lost-found-pages?page=0&size=20>; rel="first"',
              },
              body: [lostFoundPage],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(lostFoundPagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details LostFoundPage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('lostFoundPage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPagePageUrlPattern);
      });

      it('edit button click should load edit LostFoundPage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LostFoundPage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPagePageUrlPattern);
      });

      it('edit button click should load edit LostFoundPage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LostFoundPage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPagePageUrlPattern);
      });

      it('last delete button click should delete instance of LostFoundPage', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('lostFoundPage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lostFoundPagePageUrlPattern);

        lostFoundPage = undefined;
      });
    });
  });

  describe('new LostFoundPage page', () => {
    beforeEach(() => {
      cy.visit(`${lostFoundPagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('LostFoundPage');
    });

    it('should create an instance of LostFoundPage', () => {
      cy.get(`[data-cy="description"]`).type('communities').should('have.value', 'communities');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        lostFoundPage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', lostFoundPagePageUrlPattern);
    });
  });
});
