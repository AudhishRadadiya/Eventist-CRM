import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  bookingGuestList: [],
  bookingGuestLoading: false,
  isBookingGuestUpdated: false,
  bookingGuestDetail: {},
  isBulkGuestUpdated: false,
  bookingPartyETicketList: [],
  isGuestlistUpdateData: false,
  guestlistUpdatedNewData: {},
};

export const getBookingGuestListData = createAsyncThunk(
  'admin/get-booking-guest-list',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${booking_id}/guest`)
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

export const bulkUpdateBookingGuest = createAsyncThunk(
  'admin/bulk-update-booking-guest',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, bookingGuest } = props;
      axios
        .put(`admin/booking/${_id}/guest`, bookingGuest)
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

export const createBookingGuest = createAsyncThunk(
  'admin/create-booking-guest',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/booking/${props.booking_id}/guest`, props)
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
export const deleteReactiveBookingGuest = createAsyncThunk(
  'admin/delete-reactive-booking-guest',
  (props, { dispatch }) => {
    const { booking_id, guest_id, obj } = props;
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/booking/${booking_id}/guest/${guest_id}`, obj)
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

export const rebuildETicketGuestList = createAsyncThunk(
  'admin/rebuild-eticket-guest-list',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/e-ticket/rebuild`, props)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            resolve(res.data?.data);
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

export const deleteETicketGuestList = createAsyncThunk(
  'admin/delete-eticket-guest-list',
  (eticket_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`admin/e-ticket/${eticket_id}`)
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

export const recreateETicketGuestList = createAsyncThunk(
  'admin/recreate-eticket-guest-list',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/e-ticket/reset_recreate`, props)
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

export const getBookingPartyETicketList = createAsyncThunk(
  'admin/get-booking-party-e-ticket-List',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/e-ticket/directory/${booking_id}`)
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

export const bookingGuestSlice = createSlice({
  name: 'booking_guest',
  initialState,
  reducers: {
    setBookingGuestLoading: (state, action) => {
      state.bookingGuestLoading = action.payload;
    },
    setIsBookingGuestUpdated: (state, action) => {
      state.isBookingGuestUpdated = action.payload;
    },
    setBookingGuestDetail: (state, action) => {
      state.bookingGuestDetail = action.payload;
    },
    setGuestlistUpdatedNewData: (state, action) => {
      state.guestlistUpdatedNewData = action.payload;
    },
  },
  extraReducers: {
    [getBookingGuestListData.pending]: state => {
      state.bookingGuestLoading = true;
    },
    [getBookingGuestListData.rejected]: state => {
      state.bookingGuestList = [];
      state.bookingGuestLoading = false;
    },
    [getBookingGuestListData.fulfilled]: (state, action) => {
      state.bookingGuestList = action.payload || [];
      state.bookingGuestLoading = false;
    },
    [bulkUpdateBookingGuest.pending]: state => {
      state.isBulkGuestUpdated = false;
      state.bookingGuestLoading = true;
    },
    [bulkUpdateBookingGuest.rejected]: state => {
      state.isBulkGuestUpdated = false;
      state.bookingGuestLoading = false;
    },
    [bulkUpdateBookingGuest.fulfilled]: state => {
      state.isBulkGuestUpdated = true;
      state.bookingGuestLoading = false;
    },
    [createBookingGuest.pending]: state => {
      state.isBookingGuestUpdated = false;
      state.bookingGuestLoading = true;
    },
    [createBookingGuest.rejected]: state => {
      state.isBookingGuestUpdated = false;
      state.bookingGuestLoading = false;
    },
    [createBookingGuest.fulfilled]: state => {
      state.isBookingGuestUpdated = true;
      state.bookingGuestLoading = false;
    },
    [deleteReactiveBookingGuest.pending]: state => {
      state.isBookingGuestUpdated = false;
      state.bookingGuestLoading = true;
    },
    [deleteReactiveBookingGuest.rejected]: state => {
      state.isBookingGuestUpdated = false;
      state.bookingGuestLoading = false;
    },
    [deleteReactiveBookingGuest.fulfilled]: state => {
      state.isBookingGuestUpdated = true;
      state.bookingGuestLoading = false;
    },
    [rebuildETicketGuestList.pending]: state => {
      // state.isBookingGuestUpdated = false;
      state.bookingGuestLoading = true;
      state.isGuestlistUpdateData = false;
      state.guestlistUpdatedNewData = {};
    },
    [rebuildETicketGuestList.rejected]: state => {
      // state.isBookingGuestUpdated = false;
      state.bookingGuestLoading = false;
      state.isGuestlistUpdateData = false;
      state.guestlistUpdatedNewData = {};
    },
    [rebuildETicketGuestList.fulfilled]: (state, action) => {
      state.bookingGuestLoading = false;
      state.isGuestlistUpdateData = true;
      state.guestlistUpdatedNewData = action.payload;
    },
    [recreateETicketGuestList.pending]: state => {
      // state.isBookingGuestUpdated = false;
      state.bookingGuestLoading = true;
      state.isGuestlistUpdateData = false;
    },
    [recreateETicketGuestList.rejected]: state => {
      // state.isBookingGuestUpdated = false;
      state.bookingGuestLoading = false;
      state.isGuestlistUpdateData = false;
    },
    [recreateETicketGuestList.fulfilled]: state => {
      // state.isBookingGuestUpdated = true;
      state.bookingGuestLoading = false;
      state.isGuestlistUpdateData = true;
    },
    [getBookingPartyETicketList.pending]: state => {
      state.bookingGuestLoading = true;
      state.bookingPartyETicketList = {};
    },
    [getBookingPartyETicketList.rejected]: state => {
      state.bookingGuestLoading = false;
      state.bookingPartyETicketList = {};
    },
    [getBookingPartyETicketList.fulfilled]: (state, action) => {
      state.bookingGuestLoading = false;
      state.bookingPartyETicketList = action.payload;
    },
  },
});

export const {
  setBookingGuestLoading,
  setIsBookingGuestUpdated,
  setBookingGuestDetail,
  setGuestlistUpdatedNewData,
} = bookingGuestSlice.actions;

export default bookingGuestSlice.reducer;
