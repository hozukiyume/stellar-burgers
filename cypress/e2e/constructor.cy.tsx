describe('Тесты для страницы конструктора бургера', () => {
  const selectors = {
    ingredient: "[data-cy='ingredient']",
    modal: "[data-cy='modal']",
    modalOverlay: "[data-cy='modal-overlay']",
    cross: "[data-cy='cross']",
    burgerConstructor: "[data-cy='burger-constructor']",
    buns: "[data-cy='buns']",
    fillings: "[data-cy='fillings']",
    orderButton: "[data-cy='order-button']",
    orderNumber: "[data-cy='order-number']"
  };

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
    const ingredients = cy.get(selectors.ingredient);
    ingredients.first().click();
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.modal).should('contain', 'Тестовая булка');
    cy.get(selectors.cross).click();
    cy.get(selectors.modal).should('not.exist');
  });

  it('Открытие и закрытие модального окна при клике на оверлей', () => {
    const ingredients = cy.get(selectors.ingredient);
    ingredients.first().click();
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.modalOverlay).click({ force: true });
    cy.get(selectors.modal).should('not.exist');
  });

  it('Создание заказа', () => {
    cy.get(selectors.burgerConstructor).find('button').first().click();
    cy.get(selectors.burgerConstructor).find('button').eq(1).click();

    cy.get(selectors.buns).contains('Тестовая булка');
    cy.get(selectors.fillings).contains('Тестовая начинка');

    cy.get(selectors.orderButton).find('button').click();

    cy.wait('@postOrder');

    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.orderNumber).contains('1');

    cy.get(selectors.modalOverlay).click({ force: true });
    cy.get(selectors.modal).should('not.exist');

    cy.get(selectors.buns).should('not.exist');
    cy.get(selectors.fillings).should('not.contain', 'Тестовая начинка');
  });
});