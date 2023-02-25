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

describe('CrimeAlert e2e test', () => {
  const crimeAlertPageUrl = '/crime-alert';
  const crimeAlertPageUrlPattern = new RegExp('/crime-alert(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const crimeAlertSample = { date: '2023-02-24T23:33:46.800Z' };

  let crimeAlert;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/crime-alerts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/crime-alerts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/crime-alerts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (crimeAlert) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/crime-alerts/${crimeAlert.id}`,
      }).then(() => {
        crimeAlert = undefined;
      });
    }
  });

  it('CrimeAlerts menu should load CrimeAlerts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('crime-alert');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CrimeAlert').should('exist');
    cy.url().should('match', crimeAlertPageUrlPattern);
  });

  describe('CrimeAlert page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(crimeAlertPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CrimeAlert page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/crime-alert/new$'));
        cy.getEntityCreateUpdateHeading('CrimeAlert');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', crimeAlertPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/crime-alerts',
          body: crimeAlertSample,
        }).then(({ body }) => {
          crimeAlert = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/crime-alerts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/crime-alerts?page=0&size=20>; rel="last",<http://localhost/api/crime-alerts?page=0&size=20>; rel="first"',
              },
              body: [crimeAlert],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(crimeAlertPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CrimeAlert page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('crimeAlert');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', crimeAlertPageUrlPattern);
      });

      it('edit button click should load edit CrimeAlert page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CrimeAlert');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', crimeAlertPageUrlPattern);
      });

      it.skip('edit button click should load edit CrimeAlert page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CrimeAlert');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', crimeAlertPageUrlPattern);
      });

      it('last delete button click should delete instance of CrimeAlert', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('crimeAlert').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', crimeAlertPageUrlPattern);

        crimeAlert = undefined;
      });
    });
  });

  describe('new CrimeAlert page', () => {
    beforeEach(() => {
      cy.visit(`${crimeAlertPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CrimeAlert');
    });

    it('should create an instance of CrimeAlert', () => {
      cy.get(`[data-cy="title"]`).type('Salad').should('have.value', 'Salad');

      cy.get(`[data-cy="description"]`).type('Handmade Guyana').should('have.value', 'Handmade Guyana');

      cy.get(`[data-cy="date"]`).type('2023-02-25T00:02').blur().should('have.value', '2023-02-25T00:02');

      cy.get(`[data-cy="lat"]`).type('15295').should('have.value', '15295');

      cy.get(`[data-cy="lon"]`).type('14221').should('have.value', '14221');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        crimeAlert = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', crimeAlertPageUrlPattern);
    });
  });
});
