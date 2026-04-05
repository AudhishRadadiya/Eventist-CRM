import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';

const initialState = {
  activeEventAlternateList: [],
  inActiveEventAlternateList: [],
  eventAlternateLoading: false,
  isEventAlternateUpdated: false,
  eventAlternateDetail: {},
  // createAlternateId: '',
};

export const getEventAlternateData = createAsyncThunk(
  'admin/mail/get-singal-event-alternate',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/alternative_asset/${_id}`)
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

export const createEventAlternate = createAsyncThunk(
  'admin/create-event-alternate',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/alternative_asset/create', data)
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

export const updateEventAlternate = createAsyncThunk(
  'admin/update-event-alternate',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, eventAlternate } = props;
      axios
        .put(`admin/alternative_asset/update/${_id}`, eventAlternate)
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

export const eventAlternateSlice = createSlice({
  name: 'eventAlternate',
  initialState,
  reducers: {
    setIsEventAlternateUpdated: (state, action) => {
      state.isEventAlternateUpdated = action.payload;
    },
    setEventAlternateDetail: (state, action) => {
      state.eventAlternateDetail = action.payload;
    },
  },
  extraReducers: {
    [createEventAlternate.pending]: state => {
      state.eventAlternateLoading = true;
      state.isEventAlternateUpdated = false;
    },
    [createEventAlternate.rejected]: state => {
      state.eventAlternateLoading = false;
      state.isEventAlternateUpdated = false;
    },
    [createEventAlternate.fulfilled]: state => {
      state.eventAlternateLoading = false;
      state.isEventAlternateUpdated = true;
    },
    [getEventAlternateData.pending]: state => {
      state.eventAlternateLoading = true;
      state.eventAlternateDetail = {};
    },
    [getEventAlternateData.rejected]: state => {
      state.eventAlternateLoading = false;
      state.eventAlternateDetail = {};
    },
    [getEventAlternateData.fulfilled]: (state, action) => {
      state.eventAlternateLoading = false;
      state.eventAlternateDetail = action.payload;
    },
    [updateEventAlternate.pending]: state => {
      state.isEventAlternateUpdated = false;
      state.eventAlternateLoading = true;
    },
    [updateEventAlternate.rejected]: state => {
      state.isEventAlternateUpdated = false;
      state.eventAlternateLoading = false;
    },
    [updateEventAlternate.fulfilled]: (state, action) => {
      state.isEventAlternateUpdated = true;
      state.eventAlternateLoading = false;
    },
  },
});
export const { setIsEventAlternateUpdated, setEventAlternateDetail } =
  eventAlternateSlice.actions;
export default eventAlternateSlice.reducer;
