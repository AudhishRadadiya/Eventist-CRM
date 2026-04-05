import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../common.slice';
import axios from 'axios';

const initialState = {
  accountReportLoading: false,
  debortReportList: [],
  businessReportList: [],
  depositReportList: [],
  transactionExportReportList: [],
  dailyOnlinePaymentReportList: [],
  dailyPaymentReportList: [],
  dailyInvoiceReportList: [],
  exchaquerReportList: [],
};

export const getDebortReportList = createAsyncThunk(
  'admin/debort-report-list',
  (debortData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/debtor_list', debortData)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data?.data?.length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            dispatch(showMessage({ message: res.data.msg }));
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);
export const getBusinessReportList = createAsyncThunk(
  'admin/business-report-list',
  (debortData, { dispatch }) => {
    let { start_date, end_date, event_id, year } = debortData;
    let newObj = {
      start_date: start_date,
      end_date: end_date,
      event_id: event_id,
      year: year,
    };
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/business_done', newObj)
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
export const getDepositReportList = createAsyncThunk(
  'admin/deposit-report-list',
  (debortData, { dispatch }) => {
    let { start_date, end_date, event_id, start, limit } = debortData;
    let newObj = {
      start_date: start_date,
      end_date: end_date,
      event_id: event_id === 'All' ? '' : event_id,
    };
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${
            start
              ? `admin/report/deposits_list?start=${start}&limit=${limit}`
              : 'admin/report/deposits_list'
          } `,
          newObj,
        )
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
export const getTransactionExportReportList = createAsyncThunk(
  'admin/transaction-export-report-list',
  (transactionData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/transaction_export', transactionData)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data?.data)?.length > 0) {
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
export const getDailyOnlinePaymentReportList = createAsyncThunk(
  'admin/report-daily-online-payment',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/daily_online_payment', data)
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
export const getDailyPaymentReportList = createAsyncThunk(
  'admin/report-daily-payment',
  (paymentData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/daily_payment', paymentData)
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
export const getDailyInvoiceReportList = createAsyncThunk(
  'admin/report-daily-invoice',
  (invoiceData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/daily_invoice', invoiceData)
        .then(res => {
          if (res.data.err === 0) {
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
export const getExchequerReportList = createAsyncThunk(
  'admin/report-exchaquer',
  (exchaquerData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/exchequer', exchaquerData)
        .then(res => {
          if (res.data.err === 0) {
            resolve(res.data.data);
          } else {
            // dispatch(showMessage({ message: res.data.msg }));
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
export const accountReportSlice = createSlice({
  name: 'accountReport',
  initialState,
  reducers: {},
  extraReducers: {
    [getDebortReportList.pending]: state => {
      state.debortReportList = [];
      state.accountReportLoading = true;
    },
    [getDebortReportList.rejected]: state => {
      state.debortReportList = [];
      state.accountReportLoading = false;
    },
    [getDebortReportList.fulfilled]: (state, action) => {
      state.debortReportList = action.payload;
      state.accountReportLoading = false;
    },
    [getBusinessReportList.pending]: state => {
      state.businessReportList = [];
      state.accountReportLoading = true;
    },
    [getBusinessReportList.rejected]: state => {
      state.businessReportList = [];
      state.accountReportLoading = false;
    },
    [getBusinessReportList.fulfilled]: (state, action) => {
      state.businessReportList = action.payload;
      state.accountReportLoading = false;
    },
    [getDepositReportList.pending]: state => {
      // state.depositReportList = [];
      state.accountReportLoading = true;
    },
    [getDepositReportList.rejected]: state => {
      state.depositReportList = [];
      state.accountReportLoading = false;
    },
    [getDepositReportList.fulfilled]: (state, action) => {
      state.depositReportList = action.payload;
      state.accountReportLoading = false;
    },
    [getTransactionExportReportList.pending]: state => {
      state.transactionExportReportList = [];
      state.accountReportLoading = true;
    },
    [getTransactionExportReportList.rejected]: state => {
      state.transactionExportReportList = [];
      state.accountReportLoading = false;
    },
    [getTransactionExportReportList.fulfilled]: (state, action) => {
      state.transactionExportReportList = action.payload;
      state.accountReportLoading = false;
    },
    [getDailyOnlinePaymentReportList.pending]: state => {
      state.accountReportLoading = true;
    },
    [getDailyOnlinePaymentReportList.rejected]: state => {
      state.dailyOnlinePaymentReportList = [];
      state.accountReportLoading = false;
    },
    [getDailyOnlinePaymentReportList.fulfilled]: (state, action) => {
      state.dailyOnlinePaymentReportList = action.payload;
      state.accountReportLoading = false;
    },
    [getDailyPaymentReportList.pending]: state => {
      state.dailyPaymentReportList = [];
      state.accountReportLoading = true;
    },
    [getDailyPaymentReportList.rejected]: state => {
      state.dailyPaymentReportList = [];
      state.accountReportLoading = false;
    },
    [getDailyPaymentReportList.fulfilled]: (state, action) => {
      state.dailyPaymentReportList = action.payload;
      state.accountReportLoading = false;
    },
    [getDailyInvoiceReportList.pending]: state => {
      state.dailyInvoiceReportList = [];
      state.accountReportLoading = true;
    },
    [getDailyInvoiceReportList.rejected]: state => {
      state.dailyInvoiceReportList = [];
      state.accountReportLoading = false;
    },
    [getDailyInvoiceReportList.fulfilled]: (state, action) => {
      state.dailyInvoiceReportList = action.payload;
      state.accountReportLoading = false;
    },
    [getExchequerReportList.pending]: state => {
      state.exchaquerReportList = [];
      state.accountReportLoading = true;
    },
    [getExchequerReportList.rejected]: state => {
      state.exchaquerReportList = [];
      state.accountReportLoading = false;
    },
    [getExchequerReportList.fulfilled]: (state, action) => {
      state.exchaquerReportList = action.payload;
      state.accountReportLoading = false;
    },
  },
});

export default accountReportSlice.reducer;
