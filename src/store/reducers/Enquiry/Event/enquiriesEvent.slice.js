import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'store/reducers/common.slice';

const initialState = {
  enquiriesEventList: [],
  enquiriesEventLoading: false,
  isEnquiriesEventUpdated: false,
  enquiriesEventDetail: {},
};

export const getEventEnquiriesListData = createAsyncThunk(
  'enquiries/get-event-enquiries-list',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/enquiry_event/list/${_id}`)
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
export const createEventEnquiries = createAsyncThunk(
  'admin/create-event-enquiries',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/enquiry_event/create', payload)
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

export const getEventEnquiriesData = createAsyncThunk(
  'admin/get-event-enquiries',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/enquiry_event/${_id}`)
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

export const updateEventEnquiries = createAsyncThunk(
  'admin/update-event-enquiries',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, data } = props;
      axios
        .put(`admin/enquiry_event/update/${_id}`, data)
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

export const deleteEnquiryEvent = createAsyncThunk(
  'note/delete-enquiry-event',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id } = payload;
      axios
        .delete(`admin/enquiry_event/${_id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res?.data)?.length > 0) {
              resolve(res?.data);
              dispatch(
                showMessage({ message: res.data.msg, varient: 'success' }),
              );
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

export const enquiriesEventSlice = createSlice({
  name: 'enquiries_event',
  initialState,
  reducers: {
    setEnquiriesEventLoading: (state, action) => {
      state.enquiriesEventLoading = action.payload;
    },
    setIsEnquiriesEventUpdated: (state, action) => {
      state.isEnquiriesEventUpdated = action.payload;
    },
    setEnquiriesEventDetail: (state, action) => {
      state.enquiriesEventDetail = action.payload;
    },
  },
  extraReducers: {
    [getEventEnquiriesListData.pending]: state => {
      state.enquiriesEventLoading = true;
    },
    [getEventEnquiriesListData.rejected]: state => {
      state.enquiriesEventList = [];
      state.enquiriesEventLoading = false;
    },
    [getEventEnquiriesListData.fulfilled]: (state, action) => {
      state.enquiriesEventList = action.payload || [];
      state.enquiriesEventLoading = false;
    },
    [createEventEnquiries.pending]: state => {
      state.isEnquiriesEventUpdated = false;
      state.enquiriesEventLoading = true;
    },
    [createEventEnquiries.rejected]: state => {
      state.isEnquiriesEventUpdated = false;
      state.enquiriesEventLoading = false;
    },
    [createEventEnquiries.fulfilled]: state => {
      state.isEnquiriesEventUpdated = true;
      state.enquiriesEventLoading = false;
    },
    [getEventEnquiriesData.pending]: state => {
      state.enquiriesEventLoading = true;
      state.enquiriesEventDetail = {};
    },
    [getEventEnquiriesData.rejected]: state => {
      state.enquiriesEventLoading = false;
      state.enquiriesEventDetail = {};
    },
    [getEventEnquiriesData.fulfilled]: (state, action) => {
      state.enquiriesEventLoading = false;
      state.enquiriesEventDetail = action.payload;
    },
    [updateEventEnquiries.pending]: state => {
      state.isEnquiriesEventUpdated = false;
      state.enquiriesEventLoading = true;
    },
    [updateEventEnquiries.rejected]: state => {
      state.isEnquiriesEventUpdated = false;
      state.enquiriesEventLoading = false;
    },
    [updateEventEnquiries.fulfilled]: state => {
      state.isEnquiriesEventUpdated = true;
      state.enquiriesEventLoading = false;
    },
    [deleteEnquiryEvent.pending]: state => {
      state.isEnquiriesEventUpdated = false;
      state.enquiriesEventLoading = true;
    },
    [deleteEnquiryEvent.rejected]: state => {
      state.isEnquiriesEventUpdated = false;
      state.enquiriesEventLoading = false;
    },
    [deleteEnquiryEvent.fulfilled]: state => {
      state.isEnquiriesEventUpdated = true;
      state.enquiriesEventLoading = false;
    },
  },
});

export const {
  setEnquiriesEventLoading,
  setIsEnquiriesEventUpdated,
  setEnquiriesEventDetail,
} = enquiriesEventSlice.actions;

export default enquiriesEventSlice.reducer;
