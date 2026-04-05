import axios from 'axios';
import { showMessage } from '../../common.slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePaymentOptionsList: [],
  inActivePaymentOptionsList: [],
  paymentChannelList: [],
  surchargeTaxList: [],
  paymentOptionsLoading: false,
  isPaymentOptionsUpdated: false,
  paymentOptionsDetail: {},
};

export const getPaymentOptionsListData = createAsyncThunk(
  'admin/get-payment-options-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/payment_option/list')
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

export const getPaymentChannelListData = createAsyncThunk(
  'admin/get-payment-channel-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/payment_option/payment_channel/all_list')
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
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

export const updatePaymentOptions = createAsyncThunk(
  'admin/update-payment-options',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, paymentOption } = payload;
      axios
        .put(`admin/payment_option/update/${_id}`, paymentOption)
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

export const getSurchargeTaxListData = createAsyncThunk(
  'admin/get-surcharge-tax-list',
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

export const createPaymentOptions = createAsyncThunk(
  'admin/create-payment-options',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/payment_option/create', payload)
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

export const getPaymentOptionsData = createAsyncThunk(
  'admin/get-payment-options',
  (id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/payment_option/${id}`)
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

export const paymentOptionsSlice = createSlice({
  name: 'payment_options',
  initialState,
  reducers: {
    setPaymentOptionsLoading: (state, actions) => {
      state.paymentOptionsLoading = actions.payload;
    },
    setIsPaymentOptionsUpdated: (state, action) => {
      state.isPaymentOptionsUpdated = action.payload;
    },
    setPaymentOptionsDetail: (state, action) => {
      state.paymentOptionsDetail = action.payload;
    },
  },
  extraReducers: {
    [getPaymentOptionsListData.pending]: state => {
      state.paymentOptionsLoading = true;
    },
    [getPaymentOptionsListData.rejected]: state => {
      state.activePaymentOptionsList = [];
      state.inActivePaymentOptionsList = [];
      state.paymentOptionsLoading = false;
    },
    [getPaymentOptionsListData.fulfilled]: (state, action) => {
      state.activePaymentOptionsList = action.payload.active || [];
      state.inActivePaymentOptionsList = action.payload.inactive || [];
      state.paymentOptionsLoading = false;
    },
    [getPaymentChannelListData.pending]: state => {
      state.paymentOptionsLoading = true;
    },
    [getPaymentChannelListData.rejected]: state => {
      state.paymentOptionsLoading = false;
    },
    [getPaymentChannelListData.fulfilled]: (state, action) => {
      state.paymentChannelList = action.payload || [];
      state.paymentOptionsLoading = false;
    },
    [updatePaymentOptions.pending]: state => {
      state.isPaymentOptionsUpdated = false;
      state.paymentOptionsLoading = true;
    },
    [updatePaymentOptions.rejected]: state => {
      state.isPaymentOptionsUpdated = false;
      state.paymentOptionsLoading = false;
    },
    [updatePaymentOptions.fulfilled]: state => {
      state.isPaymentOptionsUpdated = true;
      state.paymentOptionsLoading = false;
    },
    [getSurchargeTaxListData.pending]: state => {
      state.surchargeTaxList = [];
      state.paymentOptionsLoading = true;
    },
    [getSurchargeTaxListData.rejected]: state => {
      state.surchargeTaxList = [];
      state.paymentOptionsLoading = false;
    },
    [getSurchargeTaxListData.fulfilled]: (state, action) => {
      state.surchargeTaxList = action.payload.active || [];
      state.paymentOptionsLoading = false;
    },
    [createPaymentOptions.pending]: state => {
      state.isPaymentOptionsUpdated = false;
      state.paymentOptionsLoading = true;
    },
    [createPaymentOptions.rejected]: state => {
      state.isPaymentOptionsUpdated = false;
      state.paymentOptionsLoading = false;
    },
    [createPaymentOptions.fulfilled]: state => {
      state.isPaymentOptionsUpdated = true;
      state.paymentOptionsLoading = false;
    },
    [getPaymentOptionsData.pending]: state => {
      state.paymentOptionsLoading = true;
      state.paymentOptionsDetail = {};
    },
    [getPaymentOptionsData.rejected]: state => {
      state.paymentOptionsLoading = false;
      state.paymentOptionsDetail = {};
    },
    [getPaymentOptionsData.fulfilled]: (state, action) => {
      state.paymentOptionsLoading = false;
      state.paymentOptionsDetail = action.payload;
    },
  },
});

export const {
  setPaymentOptionsLoading,
  setIsPaymentOptionsUpdated,
  setPaymentOptionsDetail,
} = paymentOptionsSlice.actions;

export default paymentOptionsSlice.reducer;
