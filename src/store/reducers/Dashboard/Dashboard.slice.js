import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';
const initialState = {
  storeErrorData: [],
  storeErrorLoading: false,
  isStoreUpdateError: false,
  // comparisonData: {},
};

export const getstoreErrorListData = createAsyncThunk(
  'admin/get-store-error-list-data',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/error/list')
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const updateStoreError = createAsyncThunk(
  'admin/update-store-error',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, resolved_note } = props;
      axios
        .put(`admin/error/${_id}`, resolved_note)
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
          // dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const storeErrorSlice = createSlice({
  name: 'storeError',
  initialState,
  reducers: {
    setStoreErrorLoading: (state, action) => {
      state.storeErrorLoading = action.payload;
    },
    setIsStoreErrorUpdated: (state, action) => {
      state.isStoreUpdateError = action.payload;
    },
  },
  extraReducers: {
    [getstoreErrorListData.pending]: state => {
      state.storeErrorLoading = true;
    },
    [getstoreErrorListData.rejected]: state => {
      state.storeErrorData = [];
      state.storeErrorLoading = false;
    },
    [getstoreErrorListData.fulfilled]: (state, action) => {
      state.storeErrorData = action.payload;
      state.storeErrorLoading = false;
    },
    [updateStoreError.pending]: state => {
      state.isStoreUpdateError = false;
      state.storeErrorLoading = true;
    },
    [updateStoreError.rejected]: state => {
      state.isStoreUpdateError = false;
      state.storeErrorLoading = false;
    },
    [updateStoreError.fulfilled]: (state, action) => {
      state.isStoreUpdateError = true;
      state.storeErrorLoading = false;
    },
  },
});

export const { setStoreErrorLoading, setIsStoreErrorUpdated } =
  storeErrorSlice.actions;

export default storeErrorSlice.reducer;
