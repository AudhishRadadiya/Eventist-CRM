import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import { showMessage } from '../../../common.slice';

const initialState = {
  watchList: [],
  watchListLoading: false,
  isFetch: false,
};

export const getWatchListData = createAsyncThunk(
  'admin/get-watch-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/watch_list', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const watchListSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    resetWatchlist: (state, action) => {
      state.watchList = [];
      state.watchListLoading = false;
      state.isFetch = false;
    },
  },
  extraReducers: {
    [getWatchListData.pending]: state => {
      state.watchListLoading = true;
    },
    [getWatchListData.rejected]: state => {
      state.watchList = [];
      state.watchListLoading = false;
      state.isFetch = true;
    },
    [getWatchListData.fulfilled]: (state, action) => {
      state.watchList = action.payload;
      state.watchListLoading = false;
      state.isFetch = true;
    },
  },
});
export const { resetWatchlist } = watchListSlice.actions;

export default watchListSlice.reducer;
