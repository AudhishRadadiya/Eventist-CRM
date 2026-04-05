import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../common.slice';
import axios from 'axios';

const initialState = {
  enquiriesList: [],
  enquirieLoading: false,
  isEnquirieUpdated: false,
  isEnquirieCreated: false,
  enquirieDetail: {},
  createEnquiries: {},
  guestCount: 0,
  holdDate: {},
  eticket_text_visible: false,
  invoice_text_visible: false,
};

export const getEnquiriesListData = createAsyncThunk(
  'enquiries/get-enquiries-list',
  (props, { dispatch }) => {
    const {
      is_booking,
      page,
      size,
      year,
      date,
      event,
      include_cancelled,
      search,
      contact,
      account,
      no_venue_date,
      from_dashboard_ev_dates,
    } = props;
    let newObj = {
      is_booking: is_booking,
      year: year === 'All' ? '' : year,
      date: date === 'All' ? '' : date,
      event: event === 'All' ? '' : event,
      search: search,
      contact: contact,
      account: account,
      include_cancelled: include_cancelled,
      no_venue_date: no_venue_date,
      from_dashboard_ev_dates: from_dashboard_ev_dates,
    };
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/booking/list/${page}/${size}`, newObj)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.bookings.length > 0) {
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

export const getEnquiriesData = createAsyncThunk(
  'admin/get-enquiries',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${_id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res?.data?.data)?.length > 0) {
              resolve(res?.data?.data);
            } else {
              resolve([]);
            }
          } else {
            dispatch(showMessage({ message: res?.data?.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error?.response?.data?.msg }));
          reject(error);
        });
    });
  },
);

export const getConfirmPlace = createAsyncThunk(
  'admin/get-confirm-place',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${_id}/confirm`)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res?.data?.data)?.length > 0) {
              resolve(res?.data?.data);
            } else {
              resolve([]);
            }
          } else {
            dispatch(showMessage({ message: res?.data?.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error?.response?.data?.msg }));
          reject(error);
        });
    });
  },
);

export const updateEnquiries = createAsyncThunk(
  'admin/update-enquiries',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id } = payload;
      axios
        .post(`admin/booking/${_id}`, payload)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            if (Object.keys(res?.data?.data)?.length > 0) {
              resolve(res?.data?.data);
            } else {
              resolve([]);
            }
          } else {
            dispatch(showMessage({ message: res?.data?.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error?.response?.data?.msg }));
          reject(error);
        });
    });
  },
);

export const createEnquiry = createAsyncThunk(
  'admin/create-enquiry',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/enquiry/create', props)
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

export const getTotalGuest = createAsyncThunk(
  'admin/guest_count',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${booking_id}/guest_count`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) resolve(res.data.data);
            else resolve([]);
          } else reject();
        })
        .catch(error => {
          reject(error);
          dispatch(showMessage({ message: error.response.data.msg }));
        });
    });
  },
);

export const getHoldDate = createAsyncThunk(
  'admin/hold_data',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${booking_id}/hold_data`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) resolve(res.data.data);
            else resolve([]);
          } else reject();
        })
        .catch(error => {
          reject(error);
          dispatch(showMessage({ message: error.response.data.msg }));
        });
    });
  },
);

export const getEticketInvoiceSendStatus = createAsyncThunk(
  'admin/eticket_invoice_send_status',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${booking_id}/eticket_invoice_send_status`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) resolve(res.data.data);
            else resolve([]);
          } else reject();
        })
        .catch(error => {
          reject(error);
          dispatch(showMessage({ message: error.response.data.msg }));
        });
    });
  },
);

export const enquiriesSlice = createSlice({
  name: 'enquiries',
  initialState,
  reducers: {
    setEnquirieLoading: (state, action) => {
      state.enquirieLoading = action.payload;
    },
    setIsEnquirieUpdated: (state, action) => {
      state.isEnquirieUpdated = action.payload;
    },
    //isEnquirieCreated
    setIsEnquirieCreated: (state, action) => {
      state.isEnquirieCreated = action.payload;
    },
    setEnquirieDetail: (state, action) => {
      state.enquirieDetail = action.payload;
    },
  },
  extraReducers: {
    [getEnquiriesListData.pending]: state => {
      state.enquirieLoading = true;
    },
    [getEnquiriesListData.rejected]: state => {
      state.enquiriesList = [];
      state.enquirieLoading = false;
    },
    [getEnquiriesListData.fulfilled]: (state, action) => {
      state.enquiriesList = action.payload || [];
      state.enquirieLoading = false;
    },
    [getEnquiriesData.pending]: state => {
      state.enquirieLoading = true;
    },
    [getEnquiriesData.rejected]: state => {
      state.enquirieLoading = false;
    },
    [getEnquiriesData.fulfilled]: (state, action) => {
      state.enquirieLoading = false;
      state.enquirieDetail = action.payload;
    },
    [getConfirmPlace.pending]: state => {
      state.isEnquirieUpdated = false;
      state.enquirieLoading = true;
    },
    [getConfirmPlace.rejected]: state => {
      state.isEnquirieUpdated = false;
      state.enquirieLoading = false;
    },
    [getConfirmPlace.fulfilled]: state => {
      state.isEnquirieUpdated = true;
      state.enquirieLoading = false;
    },
    [updateEnquiries.pending]: state => {
      state.isEnquirieUpdated = false;
      state.enquirieLoading = true;
    },
    [updateEnquiries.rejected]: state => {
      state.isEnquirieUpdated = false;
      state.enquirieLoading = false;
    },
    [updateEnquiries.fulfilled]: state => {
      state.isEnquirieUpdated = true;
      state.enquirieLoading = false;
    },
    [createEnquiry.pending]: state => {
      state.isEnquirieCreated = false;
      state.enquirieLoading = true;
    },
    [createEnquiry.rejected]: state => {
      state.isEnquirieCreated = false;
      state.enquirieLoading = false;
      state.createEnquiries = {};
    },
    [createEnquiry.fulfilled]: (state, action) => {
      state.isEnquirieCreated = true;
      state.enquirieLoading = false;
      state.createEnquiries = action.payload;
    },
    [getTotalGuest.fulfilled]: (state, action) => {
      state.guestCount = action.payload;
    },
    [getHoldDate.fulfilled]: (state, action) => {
      state.holdDate = action.payload;
    },
    [getEticketInvoiceSendStatus.fulfilled]: (state, action) => {
      state.invoice_text_visible = action.payload.invoice_text_visible;
      state.eticket_text_visible = action.payload.eticket_text_visible;
    },
  },
});

export const {
  setEnquirieLoading,
  setIsEnquirieUpdated,
  setEnquirieDetail,
  isEnquirieUpdated,
  setIsEnquirieCreated,
} = enquiriesSlice.actions;

export default enquiriesSlice.reducer;
