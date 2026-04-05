import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';
import { getEnquiriesData } from '../Enquiry/enquiries.slice';
import { bookingPaymentInfo } from './bookingPayment.slice';

const initialState = {
  historyList: [],
  historyPlaceLoading: false,
  isPlaceHistoryUpdate: false,
};

export const getHistoryPlace = createAsyncThunk(
  'admin/get-history-place',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/booking/${booking_id}/history_change_places`)
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

export const updatePlaceBy = createAsyncThunk(
  'admin/update-place-by',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { booking_id, values } = props;
      axios
        .post(`admin/booking/${booking_id}/change_places`, values)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            dispatch(getEnquiriesData(booking_id));
            setTimeout(() => {
              dispatch(bookingPaymentInfo(booking_id));
            }, 2000);
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

export const changePlaceSlice = createSlice({
  name: 'changePlace',
  initialState,
  reducers: {
    setHistoryPlaceHistory: (state, action) => {
      state.historyPlaceLoading = action.payload;
    },
    setIsHistoryPlace: (state, action) => {
      state.isPlaceHistoryUpdate = action.payload;
    },
  },
  extraReducers: {
    [getHistoryPlace.pending]: state => {
      state.historyPlaceLoading = true;
    },
    [getHistoryPlace.rejected]: state => {
      state.historyList = [];
      state.historyPlaceLoading = false;
    },
    [getHistoryPlace.fulfilled]: (state, action) => {
      state.historyList = action.payload || [];
      state.historyPlaceLoading = false;
    },

    [updatePlaceBy.pending]: state => {
      state.isPlaceHistoryUpdate = false;
      state.historyPlaceLoading = true;
    },
    [updatePlaceBy.rejected]: state => {
      state.isPlaceHistoryUpdate = false;
      state.historyPlaceLoading = false;
    },
    [updatePlaceBy.fulfilled]: state => {
      state.isPlaceHistoryUpdate = true;
      state.historyPlaceLoading = false;
    },
  },
});

export const { setHistoryPlaceHistory, setIsHistoryPlace } =
  changePlaceSlice.actions;

export default changePlaceSlice.reducer;
