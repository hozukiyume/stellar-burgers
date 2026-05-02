describe('Тесты для страницы конструктора бургера', () => {
  beforeEach('Перехват запроса на эндпоинт "api/ingredients", возвращаются моковые данные', () => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('postOrder');

    cy.setCookie('accessToken', 'testAccessToken');
    localStorage.setItem('refreshToken', 'testRefreshToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach('Очистка localStorage и cookies', () => {
    localStorage.clear();
    cy.clearCookie('accessToken');
  });

  it('Открытие и закрытие модального окна при клике на крестик', () => {
    const ingredients = cy.get("[data-cy='ingredient']");
    ingredients.first().click();
    cy.get("[data-cy='modal']").should('be.visible');
    cy.get("[data-cy='modal']").should('contain', 'Тестовая булка');
    cy.get("[data-cy='cross']").click();
    cy.get("[data-cy='modal']").should('not.exist');
  });

  it('Открытие и закрытие модального окна при клике на оверлей', () => {
    const ingredients = cy.get("[data-cy='ingredient']");
    ingredients.first().click();
    cy.get("[data-cy='modal']").should('be.visible');
    cy.get("[data-cy='modal-overlay']").click({ force: true });
    cy.get("[data-cy='modal']").should('not.exist');
  });

  it('Создание заказа', () => {
    cy.get("[data-cy='burger-constructor'] button").first().click();
    cy.get("[data-cy='burger-constructor'] button").eq(1).click();

    cy.get("[data-cy='buns']").contains('Тестовая булка');
    cy.get("[data-cy='fillings']").contains('Тестовая начинка');

    cy.get("[data-cy='order-button'] button").click();

    cy.wait('@postOrder');

    cy.get("[data-cy='modal']").should('be.visible');
    cy.get("[data-cy='order-number']").contains('1');

    cy.get("[data-cy='modal-overlay']").click({ force: true });
    cy.get("[data-cy='modal']").should('not.exist');

    cy.get("[data-cy='buns']").should('not.exist');
    cy.get("[data-cy='fillings']").should('not.contain', 'Тестовая начинка');
  });
});