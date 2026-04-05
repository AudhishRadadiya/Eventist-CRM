import axios from 'axios';
import { showMessage } from '../../common.slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSalesRulesList: [],
  inActiveSalesRulesList: [],
  salesRulesLoading: false,
  isSalesRulesUpdated: false,
  salesRulesDetail: {},
};

export const getSalesRulesListData = createAsyncThunk(
  'admin/get-sales_rules-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/sales_rule/list')
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
          reject(error);
          dispatch(showMessage({ message: error.response.data.msg }));
        });
    });
  },
);

export const createSalesRules = createAsyncThunk(
  'admin/create-sales_rules',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/sales_rule/create', payload)
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
          dispatch(showMessage({ message: error, varient: 'success' }));
          reject(error);
        });
    });
  },
);

export const updateSalesRules = createAsyncThunk(
  'admin/update-sales_rules',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, salesrules } = payload;
      axios
        .put(`admin/sales_rule/update/${_id}`, salesrules)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'Success' }),
            );
            resolve(res.data.data);
          } else {
            dispatch(showMessage({ message: res.data.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(
            showMessage({
              message: error.response.data.msg,
              varient: 'Success',
            }),
          );
          reject(error);
        });
    });
  },
);

export const getSalesRulesData = createAsyncThunk(
  'admin/get-sales_rules',
  _id => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/sales_rule/${_id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data.data).length > 0) {
              resolve(res.data.data);
            } else {
              reject();
            }
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
);
export const salesRulesSlice = createSlice({
  name: 'sales_rules',
  initialState,
  reducers: {
    setSalesRulesLoading: (state, action) => {
      state.salesRulesLoading = action.payload;
    },
    setIsSalesRulesUpdated: (state, action) => {
      state.isSalesRulesUpdated = action.payload;
    },
    setSalesRulesDetail: (state, action) => {
      state.salesRulesDetail = action.payload;
    },
  },
  extraReducers: {
    [getSalesRulesListData.pending]: state => {
      state.salesRulesLoading = true;
    },
    [getSalesRulesListData.rejected]: state => {
      state.activeSalesRulesList = [];
      state.inActiveSalesRulesList = [];
      state.salesRulesLoading = false;
    },
    [getSalesRulesListData.fulfilled]: (state, action) => {
      state.activeSalesRulesList = action.payload.active || [];
      state.inActiveSalesRulesList = action.payload.inactive || [];
      state.salesRulesLoading = false;
    },
    [getSalesRulesData.pending]: state => {
      state.salesRulesLoading = true;
      state.salesRulesDetail = {};
    },
    [getSalesRulesData.rejected]: state => {
      state.salesRulesLoading = false;
      state.salesRulesDetail = {};
    },
    [getSalesRulesData.fulfilled]: (state, action) => {
      state.salesRulesLoading = false;
      state.salesRulesDetail = action.payload;
    },
    [createSalesRules.pending]: state => {
      state.isSalesRulesUpdated = false;
      state.salesRulesLoading = true;
    },
    [createSalesRules.rejected]: state => {
      state.isSalesRulesUpdated = false;
      state.salesRulesLoading = false;
    },
    [createSalesRules.fulfilled]: state => {
      state.isSalesRulesUpdated = true;
      state.salesRulesLoading = false;
    },
    [updateSalesRules.pending]: state => {
      state.isSalesRulesUpdated = false;
      state.salesRulesLoading = true;
    },
    [updateSalesRules.rejected]: state => {
      state.isSalesRulesUpdated = false;
      state.salesRulesLoading = false;
    },
    [updateSalesRules.fulfilled]: state => {
      state.isSalesRulesUpdated = true;
      state.salesRulesLoading = false;
    },
  },
});

export const {
  setIsSalesRulesUpdated,
  setSalesRulesLoading,
  setSalesRulesDetail,
} = salesRulesSlice.actions;

export default salesRulesSlice.reducer;
