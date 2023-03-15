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

describe('UserProfile e2e test', () => {
  const userProfilePageUrl = '/user-profile';
  const userProfilePageUrlPattern = new RegExp('/user-profile(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userProfileSample = {
    username: 'invoice invoice cyan',
    verified: false,
    privateAccount: false,
    age: 99757,
    accountType: 'action-items Loan',
    firstnames: 'Handcrafted Riel',
    lastname: 'services',
    password: 'concept',
    occupation: 'extensible content',
    postalCode: 'Fresh XSS compress',
    email: 'Deshawn86@yahoo.com',
    language: 'Brand target users',
    gPS: true,
  };

  let userProfile;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-profiles+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-profiles').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-profiles/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userProfile) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-profiles/${userProfile.id}`,
      }).then(() => {
        userProfile = undefined;
      });
    }
  });

  it('UserProfiles menu should load UserProfiles page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-profile');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserProfile').should('exist');
    cy.url().should('match', userProfilePageUrlPattern);
  });

  describe('UserProfile page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userProfilePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserProfile page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-profile/new$'));
        cy.getEntityCreateUpdateHeading('UserProfile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-profiles',
          body: userProfileSample,
        }).then(({ body }) => {
          userProfile = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-profiles+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/user-profiles?page=0&size=20>; rel="last",<http://localhost/api/user-profiles?page=0&size=20>; rel="first"',
              },
              body: [userProfile],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userProfilePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserProfile page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userProfile');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);
      });

      it('edit button click should load edit UserProfile page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserProfile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);
      });

      it('edit button click should load edit UserProfile page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserProfile');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);
      });

      it('last delete button click should delete instance of UserProfile', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userProfile').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);

        userProfile = undefined;
      });
    });
  });

  describe('new UserProfile page', () => {
    beforeEach(() => {
      cy.visit(`${userProfilePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserProfile');
    });

    it('should create an instance of UserProfile', () => {
      cy.get(`[data-cy="username"]`).type('SAS').should('have.value', 'SAS');

      cy.get(`[data-cy="verified"]`).should('not.be.checked');
      cy.get(`[data-cy="verified"]`).click().should('be.checked');

      cy.get(`[data-cy="privateAccount"]`).should('not.be.checked');
      cy.get(`[data-cy="privateAccount"]`).click().should('be.checked');

      cy.get(`[data-cy="age"]`).type('37773').should('have.value', '37773');

      cy.get(`[data-cy="accountType"]`).type('Fish').should('have.value', 'Fish');

      cy.get(`[data-cy="firstnames"]`).type('AGP Cotton Savings').should('have.value', 'AGP Cotton Savings');

      cy.get(`[data-cy="lastname"]`).type('circuit pixel Cambri').should('have.value', 'circuit pixel Cambri');

      cy.get(`[data-cy="password"]`).type('Bedfordshire Peso channels').should('have.value', 'Bedfordshire Peso channels');

      cy.get(`[data-cy="occupation"]`).type('responsive').should('have.value', 'responsive');

      cy.get(`[data-cy="streetAddress"]`).type('mesh stable turquoise').should('have.value', 'mesh stable turquoise');

      cy.get(`[data-cy="city"]`).type('Keelyfurt').should('have.value', 'Keelyfurt');

      cy.get(`[data-cy="postalCode"]`).type('Data Paradigm Small').should('have.value', 'Data Paradigm Small');

      cy.get(`[data-cy="bio"]`).type('global').should('have.value', 'global');

      cy.get(`[data-cy="email"]`).type('Ludie.Davis@yahoo.com').should('have.value', 'Ludie.Davis@yahoo.com');

      cy.get(`[data-cy="communityPoints"]`).type('1702').should('have.value', '1702');

      cy.get(`[data-cy="language"]`).type('Tugrik Garden Granite').should('have.value', 'Tugrik Garden Granite');

      cy.get(`[data-cy="gPS"]`).should('not.be.checked');
      cy.get(`[data-cy="gPS"]`).click().should('be.checked');

      cy.get(`[data-cy="darkmode"]`).should('not.be.checked');
      cy.get(`[data-cy="darkmode"]`).click().should('be.checked');

      cy.get(`[data-cy="fontsize"]`).type('1757').should('have.value', '1757');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userProfile = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userProfilePageUrlPattern);
    });
  });
});
