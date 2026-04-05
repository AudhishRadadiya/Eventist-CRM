import axios from 'axios';
import { showMessage } from '../../common.slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTaxCodesList: [],
  inActiveTaxCodesList: [],
  taxCodesLoading: false,
  isTaxCodesUpdated: false,
  taxCodesDetail: {},
};

export const getTaxCodesListData = createAsyncThunk(
  'admin/get-tax-codes-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/tax_code/list')
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
              resolve(res.data.data[0]);
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

export const updateTaxCodes = createAsyncThunk(
  'admin/update-tax-codes',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, taxCode } = payload;
      axios
        .put(`admin/tax_code/update/${_id}`, taxCode)
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

export const createTaxCodes = createAsyncThunk(
  'admin/create-tax-codes',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/tax_code/create', payload)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            resolve(res.data);
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

export const getTaxCodesData = createAsyncThunk(
  'admin/get-tax-codes',
  (id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/tax_code/${id}`)
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

export const taxCodesSlice = createSlice({
  name: 'tax_codes',
  initialState,
  reducers: {
    setTaxCodesLoading: (state, action) => {
      state.taxCodesLoading = action.payload;
    },
    setIsTaxCodesUpdated: (state, action) => {
      state.isTaxCodesUpdated = action.payload;
    },
    setTaxCodesDetail: (state, action) => {
      state.taxCodesDetail = action.payload;
    },
  },
  extraReducers: {
    [getTaxCodesListData.pending]: state => {
      state.taxCodesLoading = true;
    },
    [getTaxCodesListData.rejected]: state => {
      state.activeTaxCodesList = [];
      state.inActiveTaxCodesList = [];
      state.taxCodesLoading = false;
    },
    [getTaxCodesListData.fulfilled]: (state, action) => {
      state.activeTaxCodesList = action.payload.active || [];
      state.inActiveTaxCodesList = action.payload.inactive || [];
      state.taxCodesLoading = false;
    },
    [updateTaxCodes.pending]: state => {
      state.isTaxCodesUpdated = false;
      state.taxCodesLoading = true;
    },
    [updateTaxCodes.rejected]: state => {
      state.isTaxCodesUpdated = false;
      state.taxCodesLoading = false;
    },
    [updateTaxCodes.fulfilled]: state => {
      state.isTaxCodesUpdated = true;
      state.taxCodesLoading = false;
    },
    [createTaxCodes.pending]: state => {
      state.isTaxCodesUpdated = false;
      state.taxCodesLoading = true;
    },
    [createTaxCodes.rejected]: state => {
      state.isTaxCodesUpdated = false;
      state.taxCodesLoading = false;
    },
    [createTaxCodes.fulfilled]: state => {
      state.isTaxCodesUpdated = true;
      state.taxCodesLoading = false;
    },
    [getTaxCodesData.pending]: state => {
      state.taxCodesLoading = true;
      state.taxCodesDetail = {};
    },
    [getTaxCodesData.rejected]: state => {
      state.taxCodesLoading = false;
      state.taxCodesDetail = {};
    },
    [getTaxCodesData.fulfilled]: (state, action) => {
      state.taxCodesLoading = false;
      state.taxCodesDetail = action.payload;
    },
  },
});

export const { setTaxCodesLoading, setIsTaxCodesUpdated, setTaxCodesDetail } =
  taxCodesSlice.actions;

export default taxCodesSlice.reducer;
