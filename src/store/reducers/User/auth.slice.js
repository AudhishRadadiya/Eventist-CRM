import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import SetCookies from 'hooks/SetCookies';
import { showMessage } from '../common.slice';
import { toBase64Unicode } from 'utils/common';
const initialState = {
  isLogOut: false,
  loginLoading: false,
  isUserLogin: false,
  isLoader: true,
};

export const loginAction = createAsyncThunk(
  'auth/login',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/login', dataProp)
        .then(res => {
          if (Object.keys(res.data.data).length > 0) {
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${res.data.data.Token}`;
            SetCookies('TokenCRM', toBase64Unicode(res.data.data.Token));
            SetCookies(
              'UserSessionCRM',
              toBase64Unicode(JSON.stringify(res.data.data.Userdata)),
            );
            resolve(res.data.data);
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
          } else {
            dispatch(showMessage({ message: res.data.msg }));
            reject({ message: res.data.msg });
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLogout: (state, action) => {
      state.isLogOut = action.payload;
    },
    setIsUserLogin: (state, action) => {
      state.isUserLogin = action.payload;
    },
    setIsLoader: (state, action) => {
      state.isLoader = action.payload;
    },
    setLoginLoading: (state, action) => {
      state.loginLoading = action.payload;
    },
    setUserDevice: (state, action) => {
      state.device = action.payload;
      if (action.payload) {
        sessionStorage.setItem(
          'DeviceType',
          window.btoa(JSON.stringify(action.payload)),
        );
      }
    },
  },
  extraReducers: {
    [loginAction.pending]: state => {
      state.isUserLogin = false;
      state.loginLoading = true;
    },
    [loginAction.rejected]: state => {
      state.isUserLogin = false;
      state.loginLoading = false;
    },
    [loginAction.fulfilled]: (state, action) => {
      state.userData = action.payload.Userdata;
      state.isUserLogin = true;
      state.loginLoading = false;
    },
  },
});

export const { setIsLogout, setIsUserLogin, setIsLoader, setLoginLoading } =
  authSlice.actions;

export default authSlice.reducer;
