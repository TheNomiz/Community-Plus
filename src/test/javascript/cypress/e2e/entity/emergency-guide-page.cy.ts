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

describe('EmergencyGuidePage e2e test', () => {
  const emergencyGuidePagePageUrl = '/emergency-guide-page';
  const emergencyGuidePagePageUrlPattern = new RegExp('/emergency-guide-page(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const emergencyGuidePageSample = { emergencyType: 'SDD' };

  let emergencyGuidePage;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/emergency-guide-pages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/emergency-guide-pages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/emergency-guide-pages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (emergencyGuidePage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/emergency-guide-pages/${emergencyGuidePage.id}`,
      }).then(() => {
        emergencyGuidePage = undefined;
      });
    }
  });

  it('EmergencyGuidePages menu should load EmergencyGuidePages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('emergency-guide-page');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('EmergencyGuidePage').should('exist');
    cy.url().should('match', emergencyGuidePagePageUrlPattern);
  });

  describe('EmergencyGuidePage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(emergencyGuidePagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create EmergencyGuidePage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/emergency-guide-page/new$'));
        cy.getEntityCreateUpdateHeading('EmergencyGuidePage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/emergency-guide-pages',
          body: emergencyGuidePageSample,
        }).then(({ body }) => {
          emergencyGuidePage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/emergency-guide-pages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/emergency-guide-pages?page=0&size=20>; rel="last",<http://localhost/api/emergency-guide-pages?page=0&size=20>; rel="first"',
              },
              body: [emergencyGuidePage],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(emergencyGuidePagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details EmergencyGuidePage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('emergencyGuidePage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePagePageUrlPattern);
      });

      it('edit button click should load edit EmergencyGuidePage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmergencyGuidePage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePagePageUrlPattern);
      });

      it('edit button click should load edit EmergencyGuidePage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmergencyGuidePage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePagePageUrlPattern);
      });

      it('last delete button click should delete instance of EmergencyGuidePage', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('emergencyGuidePage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePagePageUrlPattern);

        emergencyGuidePage = undefined;
      });
    });
  });

  describe('new EmergencyGuidePage page', () => {
    beforeEach(() => {
      cy.visit(`${emergencyGuidePagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('EmergencyGuidePage');
    });

    it('should create an instance of EmergencyGuidePage', () => {
      cy.get(`[data-cy="emergencyType"]`).type('matrix').should('have.value', 'matrix');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        emergencyGuidePage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', emergencyGuidePagePageUrlPattern);
    });
  });
});
