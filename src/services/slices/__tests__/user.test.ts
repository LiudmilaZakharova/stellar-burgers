import userReducer, {
  fetchUser,
  initialState,
  isAuthChecked,
  loginUser,
  logoutUser,
  registerUser,
  selectIsAuthChecked,
  selectUser,
  selectUserName,
  TUserState,
  updateUser
} from '../user';

const mockUser = {
  email: 'user@user.test',
  name: 'User'
};

describe('user slice test', () => {
  it('должен вернуть состояние по умолчанию при передаче пустого действия', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен вернуть статус аутентификации с isAuthChecked', () => {
    const newState = userReducer(initialState, isAuthChecked());

    expect(newState.isAuthChecked).toBe(true);
  });

  describe('проверка registerUser', () => {
    it('обработка registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('обработка registerUser.fulfilled', () => {
      const action = { type: registerUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('обработка registerUser.rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: registerUser.rejected.type,
        payload: undefined,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('проверка loginUser', () => {
    it('обработка loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('обработка loginUser.fulfilled', () => {
      const action = { type: loginUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('обработка loginUser.rejected', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: loginUser.rejected.type,
        payload: undefined,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('проверка logoutUser', () => {
    it('обработка logoutUser.pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('обработка logoutUser.fulfilled', () => {
      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer({ ...initialState, user: mockUser }, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
    });

    it('обработка logoutUser.rejected', () => {
      const errorMessage = 'Ошибка выхода';
      const action = {
        type: logoutUser.rejected.type,
        payload: undefined,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('проверка fetchUser', () => {
    it('обработка fetchUser.pending', () => {
      const action = { type: fetchUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('обработка fetchUser.fulfilled', () => {
      const action = {
        type: fetchUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    it('обработка fetchUser.rejected', () => {
      const errorMessage = 'Ошибка';
      const action = {
        type: fetchUser.rejected.type,
        payload: undefined,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('проверка updateUser', () => {
    it('обработка updateUser.pending', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.user).toBeNull();
      expect(state.error).toBeUndefined();
    });

    it('обработка updateUser.fulfilled', () => {
      const action = { type: updateUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('обработка updateUser.rejected', () => {
      const errorMessage = 'Ошибка';
      const action = {
        type: updateUser.rejected.type,
        payload: undefined,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});

describe('тестирование селекторов', () => {
  const newState: TUserState = {
    user: mockUser,
    isAuthChecked: false,
    isLoading: false,
    error: undefined
  };

  it('selectIsAuthChecked возвращает верное значение', () => {
    expect(selectIsAuthChecked({ user: newState })).toBe(false);
  });

  it('selectUser возвращает пользователя', () => {
    expect(selectUser({ user: newState })).toEqual(mockUser);
  });

  it('selectUserName возвращает имя пользователя', () => {
    expect(selectUserName({ user: newState })).toBe('User');
    expect(
      selectUserName({ user: { ...initialState, user: null } })
    ).toBeUndefined();
  });
});
