import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from 'store/reducers/common.slice';

const initialState = {
  withoutEventPartiesList: [],
  yearPartiesList: [],
  customerCopyData: {},
  withoutEventPartiesLoading: false,
  yearPartiesLoading: false,
};

export const withoutEventEnquiresList = createAsyncThunk(
  'admin-enquiry-without-event-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/enquiry/without_event/list', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
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

export const yearEnquiresList = createAsyncThunk(
  'admin-enquiry-year-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/enquiry/year/list', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
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

export const eventCustomerCopy = createAsyncThunk(
  'admin-event-customer-copy-year',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/event/dates_prices', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
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

export const enquirePartiesSlice = createSlice({
  name: 'enquireParties',
  initialState,
  reducers: {
    setEnquiresList: (state, action) => {
      state.yearPartiesList = action.payload;
    },
  },
  extraReducers: {
    [withoutEventEnquiresList.pending]: state => {
      state.withoutEventPartiesLoading = true;
    },
    [withoutEventEnquiresList.rejected]: state => {
      state.withoutEventPartiesLoading = false;
      state.enquireParties = [];
    },
    [withoutEventEnquiresList.fulfilled]: (state, action) => {
      state.withoutEventPartiesList = action.payload;
      state.withoutEventPartiesLoading = false;
    },
    [yearEnquiresList.pending]: state => {
      state.yearPartiesLoading = true;
    },
    [yearEnquiresList.rejected]: state => {
      state.yearPartiesLoading = false;
      state.yearPartiesList = [];
    },
    [yearEnquiresList.fulfilled]: (state, action) => {
      state.yearPartiesList = action.payload;
      state.yearPartiesLoading = false;
    },
    [eventCustomerCopy.pending]: state => {
      state.yearPartiesLoading = true;
    },
    [eventCustomerCopy.rejected]: state => {
      state.yearPartiesLoading = false;
      state.customerCopyData = {};
    },
    [eventCustomerCopy.fulfilled]: (state, action) => {
      state.yearPartiesLoading = false;
      state.customerCopyData = action.payload;
    },
  },
});

export const {
  setEnquirePartiesLoading,
  setIsEnquirePartiesUpdated,
  setEnquiresList,
} = enquirePartiesSlice.actions;

export default enquirePartiesSlice.reducer;
