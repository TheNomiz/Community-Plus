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

describe('Business e2e test', () => {
  const businessPageUrl = '/business';
  const businessPageUrlPattern = new RegExp('/business(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const businessSample = {
    name: 'Concrete',
    description: 'redundant Director',
    category: 'GroceryStore',
    phoneNumber: 'driverXXXXX',
    email: 'Arch68@yahoo.com',
    latitude: 36751,
    longitude: 83104,
  };

  let business;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/businesses+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/businesses').as('postEntityRequest');
    cy.intercept('DELETE', '/api/businesses/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (business) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/businesses/${business.id}`,
      }).then(() => {
        business = undefined;
      });
    }
  });

  it('Businesses menu should load Businesses page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('business');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Business').should('exist');
    cy.url().should('match', businessPageUrlPattern);
  });

  describe('Business page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(businessPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Business page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/business/new$'));
        cy.getEntityCreateUpdateHeading('Business');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', businessPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/businesses',
          body: businessSample,
        }).then(({ body }) => {
          business = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/businesses+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/businesses?page=0&size=20>; rel="last",<http://localhost/api/businesses?page=0&size=20>; rel="first"',
              },
              body: [business],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(businessPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Business page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('business');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', businessPageUrlPattern);
      });

      it('edit button click should load edit Business page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Business');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', businessPageUrlPattern);
      });

      it('edit button click should load edit Business page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Business');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', businessPageUrlPattern);
      });

      it('last delete button click should delete instance of Business', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('business').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', businessPageUrlPattern);

        business = undefined;
      });
    });
  });

  describe('new Business page', () => {
    beforeEach(() => {
      cy.visit(`${businessPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Business');
    });

    it('should create an instance of Business', () => {
      cy.get(`[data-cy="name"]`).type('Architect Kina').should('have.value', 'Architect Kina');

      cy.get(`[data-cy="description"]`).type('Sports Fundamental').should('have.value', 'Sports Fundamental');

      cy.get(`[data-cy="category"]`).select('Restaurant');

      cy.get(`[data-cy="phoneNumber"]`).type('base engineer Buckinghamshire').should('have.value', 'base engineer Buckinghamshire');

      cy.get(`[data-cy="email"]`).type('Zander.Walsh71@gmail.com').should('have.value', 'Zander.Walsh71@gmail.com');

      cy.get(`[data-cy="websiteUrl"]`).type('open-source array').should('have.value', 'open-source array');

      cy.get(`[data-cy="latitude"]`).type('28554').should('have.value', '28554');

      cy.get(`[data-cy="longitude"]`).type('51045').should('have.value', '51045');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        business = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', businessPageUrlPattern);
    });
  });
});
