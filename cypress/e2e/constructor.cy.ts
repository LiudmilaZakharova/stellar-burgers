import * as order from '../fixtures/order.json';

const selectors = {
  bun: '[data-cy=bun]',
  main: '[data-cy=main]',
  sauce: '[data-cy=sauce]',
  constructorElement: 'div.constructor-element',
  modal: '[data-cy=modal]',
  overlay: '[data-cy=modal-overlay]'
};

describe('Интеграционные тесты для страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    //фейковые token и cookies
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'testRefreshToken');
    });
    cy.setCookie('accessToken', 'testAccessToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('проверка доступности ингредиентов, добавляем ингредиенты в конструктор', () => {
    cy.request('/api/ingredients');

    //проверка доступности
    cy.get(selectors.bun).should('have.length.at.least', 1);
    cy.get(selectors.main).should('have.length.at.least', 1);
    cy.get(selectors.sauce).should('have.length.at.least', 1);

    //добавление
    cy.get(selectors.bun).contains('Добавить').click();
    cy.get(selectors.main).contains('Добавить').click();
    cy.get(selectors.sauce).contains('Добавить').click();

    //проверка на наличие в конструкторе
    const constructor = {
      bunTop: cy
        .get(
          '.constructor-element_pos_top > .constructor-element__row > .constructor-element__text'
        )
        .first(),
      main: cy
        .get(
          '.constructor-element > .constructor-element__row > .constructor-element__text'
        )
        .eq(1),
      sauce: cy
        .get(
          '.constructor-element > .constructor-element__row > .constructor-element__text'
        )
        .eq(2),
      bunBottom: cy
        .get(
          '.constructor-element_pos_bottom > .constructor-element__row > .constructor-element__text'
        )
        .last()
    };
    constructor.bunTop.contains('Краторная булка N-200i (верх)');
    constructor.main.contains('Биокотлета из марсианской Магнолии');
    constructor.sauce.contains('Соус Spicy-X');
    constructor.bunBottom.contains('Краторная булка N-200i (низ)');
  });

  it('тестирование закрытия модального окна', () => {
    //открываем модалку
    cy.get(selectors.bun).first().click();

    //проверяем видимость и данные
    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.modal)
      .find('div:first-child > h3')
      .contains('Краторная булка N-200i');

    //закрываем нажатием на крестик
    cy.get(selectors.modal).find('button').click().should('not.exist');
  });

  it('тестирование закрытия модального окна нажатием на оверлей', () => {
    //открываем модалку
    cy.get(selectors.bun).first().click();

    //проверяем видимость и данные
    cy.get(selectors.modal).should('be.visible');

    //закрываем нажатием на оверлей
    cy.get(selectors.overlay).click({ force: true });
    cy.get(selectors.modal).should('not.exist');
  });
});

describe('e2e для оформления заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    //фейковые token и cookies
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'testRefreshToken');
    });
    cy.setCookie('accessToken', 'testAccessToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('оформление заказа', () => {
    //добавление ингредиентов
    cy.get(selectors.bun).contains('Добавить').click();
    cy.get(selectors.main).contains('Добавить').click();
    cy.get(selectors.sauce).contains('Добавить').click();

    //оформление заказа
    cy.contains('Оформить заказ').click();
    cy.get(selectors.modal)
      .find('div:nth-child(2) > h2')
      .contains(order.order.number);
    cy.wait('@createOrder');

    cy.get(selectors.modal).should('be.visible');
    cy.get(selectors.modal).find('button').click().should('not.exist');

    //проверка на очистку конструктора
    const constructor = {
      bunTop: cy.get('div > section:nth-child(2) > div'),
      ingredient: cy.get('div > section:nth-child(2) > ul > div'),
      bunBottom: cy.get('div > section:nth-child(2) > div:nth-child(3)')
    };
    constructor.bunTop.contains('Выберите булки');
    constructor.ingredient.contains('Выберите начинку');
    constructor.bunBottom.contains('Выберите булки');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
