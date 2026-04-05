import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../common.slice';
import axios from 'axios';

const initialState = {
  globalSearchData: [],
  globalSearchCSVData: [],
  globalSearchLoading: false,
  mainSearchLoading: false,
};
export const getGlobalSearch = createAsyncThunk(
  'admin/get-global-search-data',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { start, limit, data } = props;
      axios
        .post(`admin/search/global-search/${start}/${limit}`, data)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data.data).length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
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

export const csvDataGetGlobalSearch = createAsyncThunk(
  'admin/csv-data-get-global-search',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { start, limit, data } = props;
      axios
        .post(`admin/search/global-search/${start}/${limit}`, data)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data.data).length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
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

export const globalSearchSlice = createSlice({
  name: 'globalSearch',
  initialState,
  reducers: {
    clearData: state => {
      return initialState;
    },
  },
  extraReducers: {
    [getGlobalSearch.pending]: state => {
      state.globalSearchLoading = true;
    },
    [getGlobalSearch.rejected]: state => {
      state.globalSearchData = [];
      state.globalSearchLoading = false;
    },
    [getGlobalSearch.fulfilled]: (state, action) => {
      state.globalSearchData = action.payload;
      state.globalSearchLoading = false;
    },
    [csvDataGetGlobalSearch.pending]: state => {
      state.globalSearchLoading = true;
    },
    [csvDataGetGlobalSearch.rejected]: state => {
      state.globalSearchLoading = false;
    },
    [csvDataGetGlobalSearch.fulfilled]: (state, action) => {
      state.globalSearchCSVData = action.payload;
      state.globalSearchLoading = false;
    },
  },
});

export const { clearData } = globalSearchSlice.actions;

export default globalSearchSlice.reducer;
