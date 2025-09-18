import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading?: boolean;
  error?: string | undefined;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: undefined
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const fetchUser = createAsyncThunk('user/fetch', async () =>
  getUserApi()
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TRegisterData) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const checkAuth = createAsyncThunk(
  'user/check',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(fetchUser());
    }
    dispatch(isAuthChecked());
  }
);

// export const checkAuth = createAsyncThunk('user/check', (_, { dispatch }) => {
//   if (getCookie('accessToken')) {
//     dispatch(fetchUser()).finally(() => {
//       dispatch(isAuthChecked());
//     });
//   } else {
//     dispatch(isAuthChecked());
//   }
// });

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    isAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isAuthChecked = true;
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(logoutUser.pending, (state) => {
        state.isAuthChecked = true;
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(updateUser.pending, (state) => {
        state.user = null;
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUser: (state) => state.user,
    selectUserName: (state) => state.user?.name
  }
});

export const { selectIsAuthChecked, selectUser, selectUserName } =
  userSlice.selectors;
export const { isAuthChecked } = userSlice.actions;

export default userSlice.reducer;
