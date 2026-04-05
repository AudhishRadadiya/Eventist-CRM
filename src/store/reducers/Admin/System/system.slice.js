import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../../common.slice';
import axios from 'axios';

const initialState = {
  systemLoading: false,
  isSystemUpdated: false,
  systemDetail: {},
};

export const getSystemData = createAsyncThunk(
  'admin/get-system',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/system_configuration`)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data.data).length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            dispatch(showMessage({ message: res.data.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const updateSystem = createAsyncThunk(
  'admin/update-system',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { system } = props;
      axios
        .put(`admin/system_configuration/update`, system)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            resolve(res.data.data);
          } else {
            dispatch(showMessage({ message: res.data.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);
export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setSystemLoading: (state, action) => {
      state.systemLoading = action.payload;
    },
    setIsSystemUpdated: (state, action) => {
      state.isSystemUpdated = action.payload;
    },
  },
  extraReducers: {
    [getSystemData.pending]: state => {
      state.systemLoading = true;
      state.systemDetail = {};
    },
    [getSystemData.rejected]: state => {
      state.systemLoading = false;
      state.systemDetail = {};
    },
    [getSystemData.fulfilled]: (state, action) => {
      state.systemLoading = false;
      state.systemDetail = action.payload;
    },
    [updateSystem.pending]: state => {
      state.isSystemUpdated = false;
      state.systemLoading = true;
    },
    [updateSystem.rejected]: state => {
      state.isSystemUpdated = false;
      state.systemLoading = false;
    },
    [updateSystem.fulfilled]: (state, action) => {
      state.isSystemUpdated = true;
      state.systemLoading = false;
    },
  },
});

export const { setSystemLoading, setIsSystemUpdated } = systemSlice.actions;

export default systemSlice.reducer;
