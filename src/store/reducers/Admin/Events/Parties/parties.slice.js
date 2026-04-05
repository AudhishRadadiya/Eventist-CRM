import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../../common.slice';
const initialState = {
  activeEventList: [],
  inActiveEventList: [],
  eventLoading: false,
  isEventUpdated: false,
  eventDetail: {},
  eventDateDetail: [],
  isCreateEventDateUpdated: false,
  CreateEventDateLoading: false,
  isEventDateUpdated: false,
  eventDateUpdatedLoading: false,
  eventDateList: {},
  isUpdateEventDateUpdated: false,
};

export const getEventListData = createAsyncThunk(
  'admin/get-event-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/event/list')
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
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const getEventData = createAsyncThunk(
  'admin/get-event',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/event/${_id}`)
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

export const createEvent = createAsyncThunk(
  'admin/create-event',
  (event, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/event/create', event)
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

export const updateEvent = createAsyncThunk(
  'admin/update-event',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, event } = props;
      axios
        .put(`admin/event/update/${_id}`, event)
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

export const updateProducts = createAsyncThunk(
  'admin/update-Products',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, products } = props;
      axios
        .post(`admin/event/product/${_id}`, { products })
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

export const updateEventAutomation = createAsyncThunk(
  'admin/update-event-automation',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, eventAutomation } = props;
      axios
        .put(`admin/automation/update/${_id}`, eventAutomation)
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

export const updateETicketInfo = createAsyncThunk(
  'admin/update-event-eticketinfo',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, eTicketInfo } = payload;
      axios
        .put(`admin/event_e_ticket/update/${_id}`, eTicketInfo)
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

export const updateEventBDE = createAsyncThunk(
  'admin/update-event-bde',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, eventBde } = payload;
      axios
        .put(`admin/event_bpe/update/${_id}`, eventBde)
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

export const createEventDate = createAsyncThunk(
  'admin/create-event-date',
  ({ id, newobj }, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/event_date/create/${id}`, newobj)
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
export const updateEventDate = createAsyncThunk(
  'admin/event-date/update',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, date } = payload;
      axios
        .put(`admin/event_date/update/${_id}`, date)
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
export const resetEeventStatus = createAsyncThunk(
  'admin/event-date/update-internal-status',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, date } = payload;
      axios
        .put(`admin/event_date/update/${_id}`, date)
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
export const bulkUpdateEventDate = createAsyncThunk(
  'admin/event-date/bulk-update',
  ({ id, newObj }, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .put(`admin/event_date/bulk_update/${id}`, newObj)
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
export const getEventDateData = createAsyncThunk(
  'admin/get-event-date',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/event_date/${_id}`)
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
export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEventLoading: (state, action) => {
      state.eventLoading = action.payload;
    },
    setIsEventUpdated: (state, action) => {
      state.isEventUpdated = action.payload;
    },
    setEventDetail: (state, action) => {
      state.eventDetail = action.payload;
    },
    setIsCreateEventDateUpdated: (state, action) => {
      state.isCreateEventDateUpdated = action.payload;
    },
    setIsUpdateEventDateUpdated: (state, action) => {
      state.isUpdateEventDateUpdated = action.payload;
    },
    setActiveEventList: (state, action) => {
      state.activeEventList = action.payload;
    },
  },
  extraReducers: {
    [getEventListData.pending]: state => {
      state.eventLoading = true;
    },
    [getEventListData.rejected]: state => {
      state.activeEventList = [];
      state.inActiveEventList = [];
      state.eventLoading = false;
    },
    [getEventListData.fulfilled]: (state, action) => {
      state.activeEventList = action.payload.active || [];
      state.inActiveEventList = action.payload.inactive || [];
      state.eventLoading = false;
    },
    [getEventData.pending]: state => {
      state.eventLoading = true;
      state.eventDetail = {};
    },
    [getEventData.rejected]: state => {
      state.eventLoading = false;
      state.eventDetail = {};
    },
    [getEventData.fulfilled]: (state, action) => {
      state.eventLoading = false;
      state.eventDetail = action.payload;
      let finalEventDateDetail = action.payload?.event_dates_data?.map(
        (item, index) => {
          let finalObj = {};
          finalObj = { ...item, selected: false };
          return finalObj;
        },
      );
      state.eventDateDetail = finalEventDateDetail;
    },
    [createEvent.pending]: state => {
      state.isEventUpdated = false;
      state.eventLoading = true;
    },
    [createEvent.rejected]: state => {
      state.isEventUpdated = false;
      state.eventLoading = false;
    },
    [createEvent.fulfilled]: (state, action) => {
      state.isEventUpdated = true;
      state.eventLoading = false;
    },
    [updateEvent.pending]: state => {
      state.isEventUpdated = false;
      state.eventLoading = true;
    },
    [updateEvent.rejected]: state => {
      state.isEventUpdated = false;
      state.eventLoading = false;
    },
    [updateEvent.fulfilled]: (state, action) => {
      state.isEventUpdated = true;
      state.eventLoading = false;
    },
    [updateEventAutomation.pending]: state => {
      state.isEventUpdated = false;
      state.eventLoading = true;
    },
    [updateEventAutomation.rejected]: state => {
      state.isEventUpdated = false;
      state.eventLoading = false;
    },
    [updateEventAutomation.fulfilled]: (state, action) => {
      state.isEventUpdated = true;
      state.eventLoading = false;
    },
    [updateEventBDE.pending]: state => {
      state.isEventUpdated = false;
      state.eventLoading = true;
    },
    [updateEventBDE.rejected]: state => {
      state.isEventUpdated = false;
      state.eventLoading = false;
    },
    [updateEventBDE.fulfilled]: state => {
      state.isEventUpdated = true;
      state.eventLoading = false;
    },
    [updateETicketInfo.pending]: state => {
      state.isEventUpdated = false;
      state.eventLoading = true;
    },
    [updateETicketInfo.rejected]: state => {
      state.isEventUpdated = false;
      state.eventLoading = false;
    },
    [updateETicketInfo.fulfilled]: state => {
      state.isEventUpdated = true;
      state.eventLoading = false;
    },
    [createEventDate.pending]: state => {
      state.isCreateEventDateUpdated = false;
      state.CreateEventDateLoading = true;
    },
    [createEventDate.rejected]: state => {
      state.isCreateEventDateUpdated = false;
      state.CreateEventDateLoading = false;
    },
    [createEventDate.fulfilled]: (state, action) => {
      state.isCreateEventDateUpdated = true;
      state.CreateEventDateLoading = false;
    },
    [updateEventDate.pending]: state => {
      state.isUpdateEventDateUpdated = false;
      state.CreateEventDateLoading = true;
    },
    [updateEventDate.rejected]: state => {
      state.isUpdateEventDateUpdated = false;
      state.CreateEventDateLoading = false;
    },
    [updateEventDate.fulfilled]: state => {
      state.isUpdateEventDateUpdated = true;
      state.CreateEventDateLoading = false;
    },
    [resetEeventStatus.pending]: state => {
      state.CreateEventDateLoading = true;
    },
    [resetEeventStatus.rejected]: state => {
      state.CreateEventDateLoading = false;
    },
    [resetEeventStatus.fulfilled]: state => {
      state.CreateEventDateLoading = false;
    },
    [bulkUpdateEventDate.pending]: state => {
      state.isCreateEventDateUpdated = false;
      state.CreateEventDateLoading = true;
    },
    [bulkUpdateEventDate.rejected]: state => {
      state.isCreateEventDateUpdated = false;
      state.CreateEventDateLoading = false;
    },
    [bulkUpdateEventDate.fulfilled]: state => {
      state.isCreateEventDateUpdated = true;
      state.CreateEventDateLoading = false;
    },
    [updateProducts.pending]: state => {
      state.isEventUpdated = false;
      state.eventLoading = true;
    },
    [updateProducts.rejected]: state => {
      state.isEventUpdated = false;
      state.eventLoading = false;
    },
    [updateProducts.fulfilled]: state => {
      state.isEventUpdated = true;
      state.eventLoading = false;
    },
    [getEventDateData.pending]: state => {
      state.CreateEventDateLoading = true;
      state.eventDateList = {};
    },
    [getEventDateData.rejected]: state => {
      state.CreateEventDateLoading = false;
      state.eventDateList = {};
    },
    [getEventDateData.fulfilled]: (state, action) => {
      state.CreateEventDateLoading = false;
      state.eventDateList = action.payload;
    },
  },
});

export const {
  setEventLoading,
  setIsEventUpdated,
  setEventDetail,
  setIsCreateEventDateUpdated,
  setIsUpdateEventDateUpdated,
  setActiveEventList,
} = eventSlice.actions;

export default eventSlice.reducer;
