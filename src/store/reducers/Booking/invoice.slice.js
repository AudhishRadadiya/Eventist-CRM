import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  invoiceList: [],
  invoiceLoading: false,
  isInvoiceUpdated: false,
  invoiceDetail: {},
  isCreditInvoice: false,
};

export const getInvoiceListData = createAsyncThunk(
  'admin/get-invoice-list-data',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/invoice/all_list/${booking_id}`)
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
          reject(error);
          dispatch(showMessage({ message: error.response.data.msg }));
        });
    });
  },
);

export const getInvoiceData = createAsyncThunk(
  'admin/get-invoice-data',
  (data, { dispatch }) => {
    const { invoiceId } = data;
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/invoice/view/${invoiceId}`)
        .then(res => {
          if (res?.data) {
            if (res?.data) {
              resolve(res.data);
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

export const createInvoice = createAsyncThunk(
  'admin/create-invoice',
  (invoice, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/invoice/create', invoice)
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

export const getCreditInvoice = createAsyncThunk(
  'admin/get-credit-invoice',
  (bookingId, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/invoice/credit_booking/${bookingId}`)
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

export const generateInvoiceUrl = createAsyncThunk(
  'admin/get-invoice-url',
  (invoiceId, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/invoice/generate_url/${invoiceId}`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
              window.open(res.data.data, '_blank');
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

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoiceLoading: (state, action) => {
      state.invoiceLoading = action.payload;
    },
    setIsInvoiceUpdated: (state, action) => {
      state.isInvoiceUpdated = action.payload;
    },
    setInvoiceDetail: (state, action) => {
      state.invoiceDetail = action.payload;
    },
    setIsCreditInvoice: (state, action) => {
      state.isCreditInvoice = action.payload;
    },
  },
  extraReducers: {
    [getInvoiceListData.pending]: state => {
      state.invoiceLoading = true;
    },
    [getInvoiceListData.rejected]: state => {
      state.invoiceList = [];
      state.invoiceLoading = false;
    },
    [getInvoiceListData.fulfilled]: (state, action) => {
      state.invoiceList = action.payload || [];
      state.invoiceLoading = false;
    },

    [getInvoiceData.pending]: state => {
      state.invoiceLoading = true;
      state.invoiceDetail = {};
    },
    [getInvoiceData.rejected]: state => {
      state.invoiceLoading = false;
      state.invoiceDetail = {};
    },
    [getInvoiceData.fulfilled]: (state, action) => {
      state.invoiceLoading = false;
      state.invoiceDetail = action.payload;
    },
    [createInvoice.pending]: state => {
      state.isInvoiceUpdated = false;
      state.invoiceLoading = true;
    },
    [createInvoice.rejected]: state => {
      state.isInvoiceUpdated = false;
      state.invoiceLoading = false;
    },
    [createInvoice.fulfilled]: state => {
      state.isInvoiceUpdated = true;
      state.invoiceLoading = false;
    },
    [getCreditInvoice.pending]: state => {
      state.invoiceLoading = true;
      state.isCreditInvoice = false;
    },
    [getCreditInvoice.rejected]: state => {
      state.invoiceLoading = false;
      state.isCreditInvoice = false;
    },
    [getCreditInvoice.fulfilled]: (state, action) => {
      state.invoiceLoading = false;
      state.isCreditInvoice = true;
    },
    [generateInvoiceUrl.pending]: state => {
      state.invoiceLoading = true;
    },
    [generateInvoiceUrl.rejected]: state => {
      state.invoiceLoading = false;
    },
    [generateInvoiceUrl.fulfilled]: (state, action) => {
      state.invoiceLoading = false;
    },
  },
});

export const {
  setInvoiceLoading,
  setIsInvoiceUpdated,
  setInvoiceDetail,
  setIsCreditInvoice,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
