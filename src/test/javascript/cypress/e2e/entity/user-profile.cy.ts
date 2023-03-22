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
    username: 'AGP compressing',
    firstnames: 'bypass Analyst inter',
    lastname: 'Kenya UAE Clothing',
    password: 'global Savings',
    email: 'Judge_Kunde@gmail.com',
    language: 'content Program EXE',
    verified: true,
    privateAccount: true,
    age: 63718,
    accountType: 'Multi-layered Re-engineered IB',
    occupation: 'static channels Bran',
    postalCode: 'Cambridgeshire connect',
    phoneNumber: 'Kids Global',
    gPS: false,
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

      cy.get(`[data-cy="firstnames"]`).type('grey Fish circuit').should('have.value', 'grey Fish circuit');

      cy.get(`[data-cy="lastname"]`).type('Cotton').should('have.value', 'Cotton');

      cy.get(`[data-cy="password"]`).type('green circuit').should('have.value', 'green circuit');

      cy.get(`[data-cy="email"]`).type('Liliana_Hermiston@hotmail.com').should('have.value', 'Liliana_Hermiston@hotmail.com');

      cy.get(`[data-cy="language"]`).type('XML Palau interface').should('have.value', 'XML Palau interface');

      cy.get(`[data-cy="verified"]`).should('not.be.checked');
      cy.get(`[data-cy="verified"]`).click().should('be.checked');

      cy.get(`[data-cy="privateAccount"]`).should('not.be.checked');
      cy.get(`[data-cy="privateAccount"]`).click().should('be.checked');

      cy.get(`[data-cy="age"]`).type('27881').should('have.value', '27881');

      cy.get(`[data-cy="accountType"]`).type('SAS Greenland overriding').should('have.value', 'SAS Greenland overriding');

      cy.get(`[data-cy="occupation"]`).type('incubate invoice').should('have.value', 'incubate invoice');

      cy.get(`[data-cy="streetAddress"]`).type('Unbranded bandwidth Checking').should('have.value', 'Unbranded bandwidth Checking');

      cy.get(`[data-cy="city"]`).type('Port Haven').should('have.value', 'Port Haven');

      cy.get(`[data-cy="postalCode"]`).type('Hat Awesome').should('have.value', 'Hat Awesome');

      cy.get(`[data-cy="bio"]`).type('SMTP').should('have.value', 'SMTP');

      cy.get(`[data-cy="phoneNumber"]`).type('Garden Granite').should('have.value', 'Garden Granite');

      cy.get(`[data-cy="communityPoints"]`).type('6250').should('have.value', '6250');

      cy.get(`[data-cy="gPS"]`).should('not.be.checked');
      cy.get(`[data-cy="gPS"]`).click().should('be.checked');

      cy.get(`[data-cy="darkmode"]`).should('not.be.checked');
      cy.get(`[data-cy="darkmode"]`).click().should('be.checked');

      cy.get(`[data-cy="fontsize"]`).type('70523').should('have.value', '70523');

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
