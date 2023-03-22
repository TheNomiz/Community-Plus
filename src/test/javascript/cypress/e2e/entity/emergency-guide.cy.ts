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

describe('EmergencyGuide e2e test', () => {
  const emergencyGuidePageUrl = '/emergency-guide';
  const emergencyGuidePageUrlPattern = new RegExp('/emergency-guide(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const emergencyGuideSample = { emergencyType: 'British array Road', panicButton: true };

  let emergencyGuide;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/emergency-guides+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/emergency-guides').as('postEntityRequest');
    cy.intercept('DELETE', '/api/emergency-guides/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (emergencyGuide) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/emergency-guides/${emergencyGuide.id}`,
      }).then(() => {
        emergencyGuide = undefined;
      });
    }
  });

  it('EmergencyGuides menu should load EmergencyGuides page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('emergency-guide');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('EmergencyGuide').should('exist');
    cy.url().should('match', emergencyGuidePageUrlPattern);
  });

  describe('EmergencyGuide page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(emergencyGuidePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create EmergencyGuide page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/emergency-guide/new$'));
        cy.getEntityCreateUpdateHeading('EmergencyGuide');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/emergency-guides',
          body: emergencyGuideSample,
        }).then(({ body }) => {
          emergencyGuide = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/emergency-guides+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/emergency-guides?page=0&size=20>; rel="last",<http://localhost/api/emergency-guides?page=0&size=20>; rel="first"',
              },
              body: [emergencyGuide],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(emergencyGuidePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details EmergencyGuide page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('emergencyGuide');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePageUrlPattern);
      });

      it('edit button click should load edit EmergencyGuide page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmergencyGuide');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePageUrlPattern);
      });

      it('edit button click should load edit EmergencyGuide page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmergencyGuide');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePageUrlPattern);
      });

      it('last delete button click should delete instance of EmergencyGuide', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('emergencyGuide').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyGuidePageUrlPattern);

        emergencyGuide = undefined;
      });
    });
  });

  describe('new EmergencyGuide page', () => {
    beforeEach(() => {
      cy.visit(`${emergencyGuidePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('EmergencyGuide');
    });

    it('should create an instance of EmergencyGuide', () => {
      cy.get(`[data-cy="emergencyType"]`).type('Bacon bypass').should('have.value', 'Bacon bypass');

      cy.get(`[data-cy="panicButton"]`).should('not.be.checked');
      cy.get(`[data-cy="panicButton"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        emergencyGuide = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', emergencyGuidePageUrlPattern);
    });
  });
});
