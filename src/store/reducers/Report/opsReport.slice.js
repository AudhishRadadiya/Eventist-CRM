import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../common.slice';
import axios from 'axios';

const initialState = {
  opsReportLoading: false,
  isDietaryRequirementUpdated: false,
  bookingNotesList: [],
  eventDateList: [],
  couponsReportList: [],
  dietaryRequirementList: {},
  drinksOrderList: [],
  itemTrackingList: [],
  partyFeedbackList: [],
  partyNumberList: [],
  specialRequirementList: [],
  donloadInvoiceUrl: '',
};

export const getBookingNotes = createAsyncThunk(
  'admin/get-booking-notes',
  (dietaryData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${
            dietaryData.start
              ? `admin/report/booking_notes?start=${dietaryData.start}&limit=${dietaryData.limit}`
              : 'admin/report/booking_notes'
          }`,
          { event_id: dietaryData.event_id },
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
export const getCouponsReport = createAsyncThunk(
  'admin/get-coupons-report',
  (couponData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/coupon_status', couponData)
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
export const getDietaryRequirements = createAsyncThunk(
  'admin/get-dietary-requirements',
  (dietaryData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/dietary', dietaryData)
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
export const getDrinksOrder = createAsyncThunk(
  'admin/get-drinks-order',
  (drinksOrderData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/drink_order', drinksOrderData)
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

export const downloadMultipleInvoice = createAsyncThunk(
  'admin/download_multiple_invoice',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/invoice/download_multiple_invoice', payload)
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

export const getItemTracking = createAsyncThunk(
  'admin/get-item-tracking',
  (itemTrackingData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/item_tracking', itemTrackingData)
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
export const getPartyFeedback = createAsyncThunk(
  'admin/get-party-feedback',
  (specialReqData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/report/party_feedback')
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
export const getPartyNumber = createAsyncThunk(
  'admin/get-party-number',
  (partyNumberData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/party_numbers', partyNumberData)
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
export const getSpecialRequirements = createAsyncThunk(
  'admin/get-special-requirements',
  (specialReqData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/special_requirement', specialReqData)
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

export const getEventDate = createAsyncThunk(
  'admin/get-event-date',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/event_date/list/${_id}`)
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

export const opsReportSlice = createSlice({
  name: 'opsReport',
  initialState,
  reducers: {
    setDonloadInvoiceUrl: (state, action) => {
      state.donloadInvoiceUrl = '';
    },
  },
  extraReducers: {
    [getBookingNotes.pending]: state => {
      state.opsReportLoading = true;
    },
    [getBookingNotes.rejected]: state => {
      state.bookingNotesList = [];
      state.opsReportLoading = false;
    },
    [getBookingNotes.fulfilled]: (state, action) => {
      state.bookingNotesList = action.payload;
      state.opsReportLoading = false;
    },
    [getCouponsReport.pending]: state => {
      state.opsReportLoading = true;
    },
    [getCouponsReport.rejected]: state => {
      state.couponsReportList = [];
      state.opsReportLoading = false;
    },
    [getCouponsReport.fulfilled]: (state, action) => {
      state.couponsReportList = action.payload;
      state.opsReportLoading = false;
    },
    [getDietaryRequirements.pending]: state => {
      state.opsReportLoading = true;
    },
    [getDietaryRequirements.rejected]: state => {
      state.dietaryRequirementList = {};
      state.opsReportLoading = false;
    },
    [getDietaryRequirements.fulfilled]: (state, action) => {
      state.dietaryRequirementList = action.payload;
      state.opsReportLoading = false;
    },
    [getDrinksOrder.pending]: state => {
      state.opsReportLoading = true;
    },
    [getDrinksOrder.rejected]: state => {
      state.drinksOrderList = [];
      state.opsReportLoading = false;
    },
    [getDrinksOrder.fulfilled]: (state, action) => {
      state.drinksOrderList = action.payload;
      state.opsReportLoading = false;
    },
    [downloadMultipleInvoice.pending]: state => {
      state.opsReportLoading = true;
      state.donloadInvoiceUrl = '';
    },
    [downloadMultipleInvoice.rejected]: state => {
      state.opsReportLoading = false;
      state.donloadInvoiceUrl = '';
    },
    [downloadMultipleInvoice.fulfilled]: (state, action) => {
      state.opsReportLoading = false;
      state.donloadInvoiceUrl = action.payload;
    },
    [getItemTracking.pending]: state => {
      state.opsReportLoading = true;
    },
    [getItemTracking.rejected]: state => {
      state.itemTrackingList = [];
      state.opsReportLoading = false;
    },
    [getItemTracking.fulfilled]: (state, action) => {
      state.itemTrackingList = action.payload;
      state.opsReportLoading = false;
    },
    [getPartyFeedback.pending]: state => {
      state.opsReportLoading = true;
    },
    [getPartyFeedback.rejected]: state => {
      state.partyFeedbackList = [];
      state.opsReportLoading = false;
    },
    [getPartyFeedback.fulfilled]: (state, action) => {
      state.partyFeedbackList = action.payload;
      state.opsReportLoading = false;
    },
    [getPartyNumber.pending]: state => {
      state.opsReportLoading = true;
    },
    [getPartyNumber.rejected]: state => {
      state.partyNumberList = [];
      state.opsReportLoading = false;
    },
    [getPartyNumber.fulfilled]: (state, action) => {
      state.partyNumberList = action.payload;
      state.opsReportLoading = false;
    },
    [getSpecialRequirements.pending]: state => {
      state.opsReportLoading = true;
    },
    [getSpecialRequirements.rejected]: state => {
      state.specialRequirementList = [];
      state.opsReportLoading = false;
    },
    [getSpecialRequirements.fulfilled]: (state, action) => {
      state.specialRequirementList = action.payload;
      state.opsReportLoading = false;
    },
    [getEventDate.pending]: state => {
      state.opsReportLoading = true;
    },
    [getEventDate.rejected]: state => {
      state.eventDateList = [];
      state.opsReportLoading = false;
    },
    [getEventDate.fulfilled]: (state, action) => {
      state.eventDateList = action.payload;
      state.opsReportLoading = false;
    },
  },
});
export const { setDonloadInvoiceUrl } = opsReportSlice.actions;
export default opsReportSlice.reducer;
