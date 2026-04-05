import axios from 'axios';
import { showMessage } from '../../common.slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeBillableItemsList: [],
  inActiveBillableItemsList: [],
  taxRateList: [],
  billableItemsLoading: false,
  isBillableItemsUpdated: false,
  billableItemsDetail: {},
};

export const getBillableItemsListData = createAsyncThunk(
  'admin/get-billable-items-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/billable_item/list')
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.err === 0) {
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

export const getTaxRateListData = createAsyncThunk(
  'admin/get-tax-rate-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/tax_code/list')
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.err === 0) {
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

export const updateBillableItems = createAsyncThunk(
  'admin/update-billable-items',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, billableItems } = payload;
      axios
        .put(`admin/billable_item/update/${_id}`, billableItems)
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

export const createBillableItem = createAsyncThunk(
  'admin/create-bilable-item',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/billable_item/create', payload)
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

export const getBillableItemsData = createAsyncThunk(
  'admin/get-billable-items',
  (id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/billable_item/${id}`)
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
export const billableItemsSlice = createSlice({
  name: 'billable_items',
  initialState,
  reducers: {
    setBillableItemsLoading: (state, action) => {
      state.billableItemsLoading = action.payload;
    },
    setIsBillableItemsUpdated: (state, action) => {
      state.isBillableItemsUpdated = action.payload;
    },
    setBillableItemsDetail: (state, action) => {
      state.billableItemsDetail = action.payload;
    },
  },
  extraReducers: {
    [getBillableItemsListData.pending]: state => {
      state.billableItemsLoading = true;
    },
    [getBillableItemsListData.rejected]: state => {
      state.activeBillableItemsList = [];
      state.inActiveBillableItemsList = [];
      state.billableItemsLoading = false;
    },
    [getBillableItemsListData.fulfilled]: (state, action) => {
      state.activeBillableItemsList = action.payload.active || [];
      state.inActiveBillableItemsList = action.payload.inactive || [];
      state.billableItemsLoading = false;
    },
    [getTaxRateListData.pending]: state => {
      state.taxRateList = [];
      state.billableItemsLoading = true;
    },
    [getTaxRateListData.rejected]: state => {
      state.taxRateList = [];
      state.billableItemsLoading = false;
    },
    [getTaxRateListData.fulfilled]: (state, action) => {
      state.taxRateList = action.payload.active || [];
      state.billableItemsLoading = false;
    },
    [updateBillableItems.pending]: state => {
      state.isBillableItemsUpdated = false;
      state.billableItemsLoading = true;
    },
    [updateBillableItems.rejected]: state => {
      state.isBillableItemsUpdated = false;
      state.billableItemsLoading = false;
    },
    [updateBillableItems.fulfilled]: state => {
      state.isBillableItemsUpdated = true;
      state.billableItemsLoading = false;
    },
    [createBillableItem.pending]: state => {
      state.isBillableItemsUpdated = false;
      state.billableItemsLoading = true;
    },
    [createBillableItem.rejected]: state => {
      state.isBillableItemsUpdated = false;
      state.billableItemsLoading = false;
    },
    [createBillableItem.fulfilled]: state => {
      state.isBillableItemsUpdated = true;
      state.billableItemsLoading = false;
    },
    [getBillableItemsData.pending]: state => {
      state.billableItemsLoading = true;
      state.billableItemsDetail = {};
    },
    [getBillableItemsData.rejected]: state => {
      state.billableItemsLoading = false;
      state.billableItemsDetail = {};
    },
    [getBillableItemsData.fulfilled]: (state, action) => {
      state.billableItemsLoading = false;
      state.billableItemsDetail = action.payload;
    },
  },
});

export const {
  setIsBillableItemsUpdated,
  setBillableItemsDetail,
  setBillableItemsLoading,
} = billableItemsSlice.actions;

export default billableItemsSlice.reducer;
