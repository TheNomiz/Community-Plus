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

describe('EmergencyStationsPage e2e test', () => {
  const emergencyStationsPagePageUrl = '/emergency-stations-page';
  const emergencyStationsPagePageUrlPattern = new RegExp('/emergency-stations-page(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const emergencyStationsPageSample = { name: 'Hampshire', stationType: 'Cotton Music heuristic', latitude: 48581, longitude: 29600 };

  let emergencyStationsPage;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/emergency-stations-pages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/emergency-stations-pages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/emergency-stations-pages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (emergencyStationsPage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/emergency-stations-pages/${emergencyStationsPage.id}`,
      }).then(() => {
        emergencyStationsPage = undefined;
      });
    }
  });

  it('EmergencyStationsPages menu should load EmergencyStationsPages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('emergency-stations-page');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('EmergencyStationsPage').should('exist');
    cy.url().should('match', emergencyStationsPagePageUrlPattern);
  });

  describe('EmergencyStationsPage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(emergencyStationsPagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create EmergencyStationsPage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/emergency-stations-page/new$'));
        cy.getEntityCreateUpdateHeading('EmergencyStationsPage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/emergency-stations-pages',
          body: emergencyStationsPageSample,
        }).then(({ body }) => {
          emergencyStationsPage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/emergency-stations-pages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/emergency-stations-pages?page=0&size=20>; rel="last",<http://localhost/api/emergency-stations-pages?page=0&size=20>; rel="first"',
              },
              body: [emergencyStationsPage],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(emergencyStationsPagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details EmergencyStationsPage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('emergencyStationsPage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPagePageUrlPattern);
      });

      it('edit button click should load edit EmergencyStationsPage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmergencyStationsPage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPagePageUrlPattern);
      });

      it('edit button click should load edit EmergencyStationsPage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmergencyStationsPage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPagePageUrlPattern);
      });

      it('last delete button click should delete instance of EmergencyStationsPage', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('emergencyStationsPage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPagePageUrlPattern);

        emergencyStationsPage = undefined;
      });
    });
  });

  describe('new EmergencyStationsPage page', () => {
    beforeEach(() => {
      cy.visit(`${emergencyStationsPagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('EmergencyStationsPage');
    });

    it('should create an instance of EmergencyStationsPage', () => {
      cy.get(`[data-cy="name"]`).type('complexity Tuna Outdoors').should('have.value', 'complexity Tuna Outdoors');

      cy.get(`[data-cy="stationType"]`).type('quantify').should('have.value', 'quantify');

      cy.get(`[data-cy="latitude"]`).type('84753').should('have.value', '84753');

      cy.get(`[data-cy="longitude"]`).type('38223').should('have.value', '38223');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        emergencyStationsPage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', emergencyStationsPagePageUrlPattern);
    });
  });
});
