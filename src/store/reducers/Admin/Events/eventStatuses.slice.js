import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../../common.slice';

const initialState = {
  activeEventStatusesList: [],
  inActiveEventStatusesList: [],
  eventStatusesLoading: false,
  isEventStatusesUpdated: false,
  eventStatusesDetail: {},
};

export const getEventStatusesListData = createAsyncThunk(
  'admin/get-event-statuses-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/event_status/list')
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
          reject(error);
          dispatch(showMessage({ message: error.response.data.msg }));
        });
    });
  },
);

export const updateEventStatuses = createAsyncThunk(
  'admin/update-event_statuses',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, eventStatuses } = payload;
      axios
        .put(`admin/event_status/update/${_id}`, eventStatuses)
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
          dispatch(
            showMessage({
              message: error.response.data.msg,
              varient: 'success',
            }),
          );
          reject(error);
        });
    });
  },
);
export const getEventStatusesData = createAsyncThunk(
  'admin/get-event-statuses',
  _id => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/event_status/${_id}`)
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
          reject(error);
        });
    });
  },
);

export const createEventStatuses = createAsyncThunk(
  'admin/create-event-statuses',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/event_status/create', payload)
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
          dispatch(
            showMessage({
              message: error.response.data.msg,
              varient: 'success',
            }),
          );
          reject(error);
        });
    });
  },
);
export const eventStatusesSlice = createSlice({
  name: 'event_statuses',
  initialState,
  reducers: {
    setEventStatusesLoading: (state, action) => {
      state.eventStatusesLoading = action.payload;
    },
    setIsEventStatusesUpdated: (state, action) => {
      state.isEventStatusesUpdated = action.payload;
    },
    setEventStatusesDetail: (state, action) => {
      state.eventStatusesDetail = action.payload;
    },
    setActiveEventStatusesList: (state, action) => {
      state.activeEventStatusesList = action.payload;
    },
  },
  extraReducers: {
    [getEventStatusesListData.pending]: state => {
      state.eventStatusesLoading = true;
    },
    [getEventStatusesListData.rejected]: state => {
      state.activeEventStatusesList = [];
      state.inActiveEventStatusesList = [];
      state.eventStatusesLoading = false;
    },
    [getEventStatusesListData.fulfilled]: (state, action) => {
      state.activeEventStatusesList = action.payload.active || [];
      state.inActiveEventStatusesList = action.payload.inactive || [];
      state.eventStatusesLoading = false;
    },
    [createEventStatuses.pending]: state => {
      state.isEventStatusesUpdated = false;
      state.eventStatusesLoading = true;
    },
    [createEventStatuses.rejected]: state => {
      state.isEventStatusesUpdated = false;
      state.eventStatusesLoading = false;
    },
    [createEventStatuses.fulfilled]: state => {
      state.isEventStatusesUpdated = true;
      state.eventStatusesLoading = false;
    },
    [updateEventStatuses.pending]: state => {
      state.isEventStatusesUpdated = false;
      state.eventStatusesLoading = true;
    },
    [updateEventStatuses.rejected]: state => {
      state.isEventStatusesUpdated = false;
      state.eventStatusesLoading = false;
    },
    [updateEventStatuses.fulfilled]: state => {
      state.isEventStatusesUpdated = true;
      state.eventStatusesLoading = false;
    },
    [getEventStatusesData.pending]: state => {
      state.eventStatusesLoading = true;
      state.eventStatusesDetail = {};
    },
    [getEventStatusesData.rejected]: state => {
      state.eventStatusesLoading = false;
      state.eventStatusesDetail = {};
    },
    [getEventStatusesData.fulfilled]: (state, action) => {
      state.eventStatusesLoading = false;
      state.eventStatusesDetail = action.payload;
    },
  },
});

export const {
  setIsEventStatusesUpdated,
  setEventStatusesLoading,
  setEventStatusesDetail,
  setActiveEventStatusesList,
} = eventStatusesSlice.actions;

export default eventStatusesSlice.reducer;
