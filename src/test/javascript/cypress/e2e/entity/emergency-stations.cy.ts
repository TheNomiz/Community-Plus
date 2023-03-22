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

describe('EmergencyStations e2e test', () => {
  const emergencyStationsPageUrl = '/emergency-stations';
  const emergencyStationsPageUrlPattern = new RegExp('/emergency-stations(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const emergencyStationsSample = { name: 'Nebraska auxiliary', stationType: 'FireStation', latitude: 89947, longitude: 54576 };

  let emergencyStations;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/emergency-stations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/emergency-stations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/emergency-stations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (emergencyStations) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/emergency-stations/${emergencyStations.id}`,
      }).then(() => {
        emergencyStations = undefined;
      });
    }
  });

  it('EmergencyStations menu should load EmergencyStations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('emergency-stations');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('EmergencyStations').should('exist');
    cy.url().should('match', emergencyStationsPageUrlPattern);
  });

  describe('EmergencyStations page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(emergencyStationsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create EmergencyStations page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/emergency-stations/new$'));
        cy.getEntityCreateUpdateHeading('EmergencyStations');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/emergency-stations',
          body: emergencyStationsSample,
        }).then(({ body }) => {
          emergencyStations = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/emergency-stations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/emergency-stations?page=0&size=20>; rel="last",<http://localhost/api/emergency-stations?page=0&size=20>; rel="first"',
              },
              body: [emergencyStations],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(emergencyStationsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details EmergencyStations page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('emergencyStations');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPageUrlPattern);
      });

      it('edit button click should load edit EmergencyStations page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmergencyStations');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPageUrlPattern);
      });

      it('edit button click should load edit EmergencyStations page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmergencyStations');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPageUrlPattern);
      });

      it('last delete button click should delete instance of EmergencyStations', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('emergencyStations').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', emergencyStationsPageUrlPattern);

        emergencyStations = undefined;
      });
    });
  });

  describe('new EmergencyStations page', () => {
    beforeEach(() => {
      cy.visit(`${emergencyStationsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('EmergencyStations');
    });

    it('should create an instance of EmergencyStations', () => {
      cy.get(`[data-cy="name"]`)
        .type('directional composite Buckinghamshire')
        .should('have.value', 'directional composite Buckinghamshire');

      cy.get(`[data-cy="stationType"]`).select('Hospital');

      cy.get(`[data-cy="wheelchairAccess"]`).should('not.be.checked');
      cy.get(`[data-cy="wheelchairAccess"]`).click().should('be.checked');

      cy.get(`[data-cy="parking"]`).should('not.be.checked');
      cy.get(`[data-cy="parking"]`).click().should('be.checked');

      cy.get(`[data-cy="latitude"]`).type('48425').should('have.value', '48425');

      cy.get(`[data-cy="longitude"]`).type('5330').should('have.value', '5330');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        emergencyStations = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', emergencyStationsPageUrlPattern);
    });
  });
});
