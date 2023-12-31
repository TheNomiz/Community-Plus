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

describe('Event e2e test', () => {
  const eventPageUrl = '/event';
  const eventPageUrlPattern = new RegExp('/event(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const eventSample = {
    name: 'Saint Loan',
    description: 'Customer',
    startDate: '2023-03-08',
    endDate: '2023-03-07',
    latitude: 99166,
    category: 'Sport',
    longitude: 20933,
    address: 'parse navigate',
  };

  let event;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/events+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/events').as('postEntityRequest');
    cy.intercept('DELETE', '/api/events/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (event) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/events/${event.id}`,
      }).then(() => {
        event = undefined;
      });
    }
  });

  it('Events menu should load Events page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('event');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Event').should('exist');
    cy.url().should('match', eventPageUrlPattern);
  });

  describe('Event page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(eventPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Event page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/event/new$'));
        cy.getEntityCreateUpdateHeading('Event');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', eventPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/events',
          body: eventSample,
        }).then(({ body }) => {
          event = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/events+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/events?page=0&size=20>; rel="last",<http://localhost/api/events?page=0&size=20>; rel="first"',
              },
              body: [event],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(eventPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Event page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('event');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', eventPageUrlPattern);
      });

      it('edit button click should load edit Event page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Event');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', eventPageUrlPattern);
      });

      it('edit button click should load edit Event page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Event');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', eventPageUrlPattern);
      });

      it('last delete button click should delete instance of Event', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('event').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', eventPageUrlPattern);

        event = undefined;
      });
    });
  });

  describe('new Event page', () => {
    beforeEach(() => {
      cy.visit(`${eventPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Event');
    });

    it('should create an instance of Event', () => {
      cy.get(`[data-cy="name"]`).type('Usability withdrawal').should('have.value', 'Usability withdrawal');

      cy.get(`[data-cy="description"]`).type('Checking Wisconsin').should('have.value', 'Checking Wisconsin');

      cy.get(`[data-cy="startDate"]`).type('2023-03-08').blur().should('have.value', '2023-03-08');

      cy.get(`[data-cy="endDate"]`).type('2023-03-08').blur().should('have.value', '2023-03-08');

      cy.get(`[data-cy="imageUrl"]`).type('Total hacking').should('have.value', 'Total hacking');

      cy.get(`[data-cy="latitude"]`).type('76580').should('have.value', '76580');

      cy.get(`[data-cy="category"]`).select('Meetup');

      cy.get(`[data-cy="longitude"]`).type('52145').should('have.value', '52145');

      cy.get(`[data-cy="address"]`).type('Small').should('have.value', 'Small');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        event = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', eventPageUrlPattern);
    });
  });
});
