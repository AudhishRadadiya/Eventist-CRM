import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  bookingLoading: false,
  isBookingUpdated: false,
  isInstantBookingUpdated: false,
  isDowngradeUpdate: false,
  isMoveUpdate: false,
  moveBookingList: [],
  CreatedBookingEnquiryId: '',
  CreatedInstantBookingEnquiryId: '',
  isTrasferBookingUpdated: false,
};

export const createBooking = createAsyncThunk(
  'admin/create-booking',
  (booking, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/booking/create', booking)
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

export const updateBookingTransfer = createAsyncThunk(
  'admin/update-bookings-transfer',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, bookingTransfer } = props;
      axios
        .put(`admin/booking/transfer/${_id}`, bookingTransfer)
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

export const updateBookingCancel = createAsyncThunk(
  'admin/update-booking-cancel',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, bookingCancel } = props;
      axios
        .put(`admin/booking/cancel/${_id}`, bookingCancel)
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

export const downgradeBooking = createAsyncThunk(
  'admin/downgrade-booking',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { downgrade, booking_id } = props;
      axios
        .post(`admin/booking/${booking_id}/downgrade`, downgrade)
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

export const moveBooking = createAsyncThunk(
  'admin/move-booking',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { booking_id, event_date_id, moveBookingList } = props;
      axios
        .put(`admin/booking/${booking_id}/move`, { event_date_id })
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            resolve({ moveBookingList, event_date_id });
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

export const getMoveBookingListData = createAsyncThunk(
  'admin/get-move-booking-list',
  (props, { dispatch }) => {
    const { event_id, booking_id } = props;
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/booking/move/${event_id}/event_dates`, {
          booking_id: booking_id,
        })
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

export const createInstantBooking = createAsyncThunk(
  'admin/create-instant-booking',
  (booking, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/instant_booking', booking)
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

export const bookingSlice = createSlice({
  name: 'booking_slice',
  initialState,
  reducers: {
    setBookingLoading: (state, action) => {
      state.bookingLoading = action.payload;
    },
    setIsBookingUpdated: (state, action) => {
      state.isBookingUpdated = action.payload;
    },
    setBookingDetail: (state, action) => {
      state.bookingDetail = action.payload;
    },
    setCreatedBookingId: (state, action) => {
      state.CreatedBookingEnquiryId = action.payload;
    },
    setIsDowngrade: (state, action) => {
      state.isDowngradeUpdate = action.payload;
    },
    setIsInstantBookingUpdated: (state, action) => {
      state.isInstantBookingUpdated = action.payload;
    },
    setCreatedInstantBookingId: (state, action) => {
      state.CreatedInstantBookingEnquiryId = action.payload;
    },
    setMoveBookingList: (state, action) => {
      state.moveBookingList = action.payload;
    },
    setIsMoveUpdate: (state, action) => {
      state.isMoveUpdate = action.payload;
    },
  },
  extraReducers: {
    [createBooking.pending]: state => {
      state.isBookingUpdated = false;
      state.bookingLoading = true;
    },
    [createBooking.rejected]: state => {
      state.isBookingUpdated = false;
      state.bookingLoading = false;
    },
    [createBooking.fulfilled]: (state, action) => {
      state.isBookingUpdated = true;
      state.bookingLoading = false;
      state.CreatedBookingEnquiryId = action.payload.data?._id || '';
    },

    [updateBookingTransfer.pending]: state => {
      // state.isBookingUpdated = false;
      state.isTrasferBookingUpdated = false;
      state.bookingLoading = true;
    },
    [updateBookingTransfer.rejected]: state => {
      // state.isBookingUpdated = false;
      state.isTrasferBookingUpdated = false;
      state.bookingLoading = false;
    },
    [updateBookingTransfer.fulfilled]: state => {
      // state.isBookingUpdated = true;
      state.isTrasferBookingUpdated = true;
      state.bookingLoading = false;
    },
    [updateBookingCancel.pending]: state => {
      state.isBookingUpdated = false;
      state.bookingLoading = true;
    },
    [updateBookingCancel.rejected]: state => {
      state.isBookingUpdated = false;
      state.bookingLoading = false;
    },
    [updateBookingCancel.fulfilled]: state => {
      state.isBookingUpdated = true;
      state.bookingLoading = false;
    },
    [downgradeBooking.pending]: state => {
      state.isDowngradeUpdate = false;
      state.bookingLoading = true;
    },
    [downgradeBooking.rejected]: state => {
      state.isDowngradeUpdate = false;
      state.bookingLoading = false;
    },
    [downgradeBooking.fulfilled]: state => {
      state.isDowngradeUpdate = true;
      state.bookingLoading = false;
    },
    [moveBooking.pending]: state => {
      state.isMoveUpdate = false;
      state.bookingLoading = true;
    },
    [moveBooking.rejected]: state => {
      state.isMoveUpdate = false;
      state.bookingLoading = false;
    },
    [moveBooking.fulfilled]: (state, action) => {
      const data = action.payload.moveBookingList.map(yearGroup => {
        return {
          ...yearGroup,
          eventDate: yearGroup.eventDate.map(item => {
            if (item._id === action.payload.event_date_id)
              return {
                ...item,
                current: !item.current,
              };
            else
              return {
                ...item,
                current: false,
              };
          }),
        };
      });
      state.moveBookingList = data;
      state.isMoveUpdate = true;
      state.bookingLoading = false;
    },
    [getMoveBookingListData.pending]: state => {
      state.bookingLoading = true;
    },
    [getMoveBookingListData.rejected]: state => {
      state.moveBookingList = [];
      state.bookingLoading = false;
    },
    [getMoveBookingListData.fulfilled]: (state, action) => {
      state.moveBookingList = action.payload || [];
      state.bookingLoading = false;
    },
    [createInstantBooking.pending]: state => {
      state.isInstantBookingUpdated = false;
      state.bookingLoading = true;
    },
    [createInstantBooking.rejected]: state => {
      state.isInstantBookingUpdated = false;
      state.bookingLoading = false;
    },
    [createInstantBooking.fulfilled]: (state, action) => {
      state.isInstantBookingUpdated = true;
      state.bookingLoading = false;
      state.CreatedInstantBookingEnquiryId = action.payload.data?._id || '';
    },
  },
});

export const {
  setBookingLoading,
  setIsBookingUpdated,
  setBookingDetail,
  setCreatedBookingId,
  setIsDowngrade,
  setIsInstantBookingUpdated,
  setCreatedInstantBookingId,
  setMoveBookingList,
  setIsMoveUpdate,
} = bookingSlice.actions;

export default bookingSlice.reducer;
