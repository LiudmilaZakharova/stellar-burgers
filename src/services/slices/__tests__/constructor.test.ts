import reducer, {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  resetBurgerConstructor,
  setIngredients
} from '../constructor';
import constructorReducer, { TBuilderState } from '../constructor';

const mockBun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0
};

const mockIngredientSauce = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  __v: 0
};

const mockConstructor: TBuilderState = {
  bun: {
    id: '123456789',
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  ingredients: [
    {
      id: '234567891',
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    },
    {
      id: '345678912',
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
    }
  ]
};

describe('burgerConstructor slice tests', () => {
  let initialState: TBuilderState;

  beforeEach(() => {
    initialState = {
      bun: null,
      ingredients: []
    };
  });

  it('должен вернуть состояние по умолчанию при передаче пустого действия', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('добавление булки с помощью addIngredient', () => {
    const newState = constructorReducer(initialState, addIngredient(mockBun));

    expect(newState.bun).toMatchObject({
      type: 'bun',
      name: 'Краторная булка N-200i'
    });
    //список ингридиентов не изменился
    expect(newState.ingredients).toHaveLength(0);
  });

  it('добавление ингредиента с помощью addIngredient', () => {
    const newState = reducer(initialState, addIngredient(mockIngredientSauce));

    expect(newState.ingredients).toHaveLength(1);

    expect(newState.ingredients[0].name).toEqual('Соус Spicy-X');
    expect(newState.bun).toBeNull();
  });

  it('удаление ингредиента с помощью deleteIngredient', () => {
    const actionPayload = mockConstructor.ingredients[0];
    const newState = constructorReducer(
      mockConstructor,
      deleteIngredient(actionPayload)
    );
    expect(newState.ingredients.length).toBe(1);
    expect(
      newState.ingredients.find((ing) => ing.id === actionPayload.id)
    ).toBeUndefined();
    expect(newState.bun).toEqual(mockConstructor.bun);
  });

  it('перемещение ингредиента вверх с помощью moveIngredient', () => {
    const idToMoveUp = mockConstructor.ingredients[1].id;
    const newState = constructorReducer(
      mockConstructor,
      moveIngredient({ id: idToMoveUp, direction: 'up' })
    );
    expect(newState.ingredients[0].id).toBe(idToMoveUp);
    expect(newState.ingredients[1].id).toBe(mockConstructor.ingredients[0].id);
  });

  it('перемещение ингредиента вниз с помощью moveIngredient', () => {
    const idToMoveDown = mockConstructor.ingredients[0].id;
    const nextState = constructorReducer(
      mockConstructor,
      moveIngredient({ id: idToMoveDown, direction: 'down' })
    );
    expect(nextState.ingredients[1].id).toBe(idToMoveDown);
    expect(nextState.ingredients[0].id).toBe(mockConstructor.ingredients[1].id);
  });

  it('очистка конструктора', () => {
    const newState = constructorReducer(
      mockConstructor,
      resetBurgerConstructor()
    );
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toEqual([]);
    expect(newState).toEqual(initialState);
  });

  it('установка массива ингредиентов setIngredients', () => {
    const newIngredients = mockConstructor.ingredients;
    const newState = constructorReducer(
      initialState,
      setIngredients(newIngredients)
    );
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(newIngredients.length);
    expect(newState.ingredients).toEqual(newIngredients);
  });
});
