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

describe('Comment e2e test', () => {
  const commentPageUrl = '/comment';
  const commentPageUrlPattern = new RegExp('/comment(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const commentSample = {"comment":"Cambridgeshire","date":"2023-04-10T04:56:27.067Z"};

  let comment;
  // let user;
  // let crimeAlert;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"Denmark port","firstName":"Forrest","lastName":"Reinger"},
    }).then(({ body }) => {
      user = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/crime-alerts',
      body: {"title":"invoice District","description":"opticalXXXXXXXXXXXXX","lat":13518,"lon":1846,"date":"2023-02-25T05:34:41.044Z","crimeID":31397,"crimeType":"ANTISOCIALBEHAVIOUR","crimePhoto1":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","crimePhoto1ContentType":"unknown","crimePhoto2":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","crimePhoto2ContentType":"unknown","crimePhoto3":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","crimePhoto3ContentType":"unknown"},
    }).then(({ body }) => {
      crimeAlert = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/comments+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/comments').as('postEntityRequest');
    cy.intercept('DELETE', '/api/comments/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

    cy.intercept('GET', '/api/crime-alerts', {
      statusCode: 200,
      body: [crimeAlert],
    });

  });
   */

  afterEach(() => {
    if (comment) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/comments/${comment.id}`,
      }).then(() => {
        comment = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (user) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${user.id}`,
      }).then(() => {
        user = undefined;
      });
    }
    if (crimeAlert) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/crime-alerts/${crimeAlert.id}`,
      }).then(() => {
        crimeAlert = undefined;
      });
    }
  });
   */

  it('Comments menu should load Comments page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('comment');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Comment').should('exist');
    cy.url().should('match', commentPageUrlPattern);
  });

  describe('Comment page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(commentPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Comment page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/comment/new$'));
        cy.getEntityCreateUpdateHeading('Comment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', commentPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/comments',
          body: {
            ...commentSample,
            user: user,
            crime: crimeAlert,
          },
        }).then(({ body }) => {
          comment = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/comments+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/comments?page=0&size=20>; rel="last",<http://localhost/api/comments?page=0&size=20>; rel="first"',
              },
              body: [comment],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(commentPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(commentPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Comment page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('comment');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', commentPageUrlPattern);
      });

      it('edit button click should load edit Comment page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Comment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', commentPageUrlPattern);
      });

      it.skip('edit button click should load edit Comment page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Comment');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', commentPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Comment', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('comment').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', commentPageUrlPattern);

        comment = undefined;
      });
    });
  });

  describe('new Comment page', () => {
    beforeEach(() => {
      cy.visit(`${commentPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Comment');
    });

    it.skip('should create an instance of Comment', () => {
      cy.get(`[data-cy="comment"]`).type('Shoals eyeballs').should('have.value', 'Shoals eyeballs');

      cy.get(`[data-cy="date"]`).type('2023-04-10T09:38').blur().should('have.value', '2023-04-10T09:38');

      cy.get(`[data-cy="user"]`).select(1);
      cy.get(`[data-cy="crime"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        comment = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', commentPageUrlPattern);
    });
  });
});
