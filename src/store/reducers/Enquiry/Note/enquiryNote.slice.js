import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../../common.slice';
import axios from 'axios';

const initialState = {
  enquiryNoteLoading: false,
  isEnquiryNoteCreated: false,
  isEnquiryNoteUpdated: false,
  isEnquiryNoteDeleted: false,
  enquiryNoteList: [],
  enquiryNoteDetail: {},
  noteTrackableProductDetail: {},
  noteTrackableHistoryDetail: {},
};

export const getEnquiryNoteListData = createAsyncThunk(
  'enquiry/get-enquiries-note-list',
  ({ _id }, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/enquiry_note/list/${_id}`)
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

export const createEnquiryNote = createAsyncThunk(
  'admin/create-note',
  (note, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/enquiry_note/create', note)
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
export const updateEnquiryNote = createAsyncThunk(
  'note/update-enquiry-note',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, note } = payload;
      axios
        .put(`admin/enquiry_note/update/${_id}`, note)
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

export const getEnquiryNoteData = createAsyncThunk(
  'note/get-single-note',
  ({ _id }, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/enquiry_note/${_id}`)
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

export const getTrackableProductsData = createAsyncThunk(
  'note/get-trackable-product-data',
  ({ booking_id }, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${booking_id}/trackable_products`)
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

export const getTrackedHistoryData = createAsyncThunk(
  'note/get-tracked-history-data-s',
  ({ booking_id }, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking/${booking_id}/tracked_history`)
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

export const deleteEnquiryNote = createAsyncThunk(
  'note/delete-enquiry-note',
  (payload, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id } = payload;
      axios
        .delete(`admin/enquiry_note/${_id}`)
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
export const enquiryNoteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: {
    [getEnquiryNoteListData.pending]: state => {
      state.enquiryNoteLoading = true;
    },
    [getEnquiryNoteListData.rejected]: state => {
      state.enquiryNoteList = [];
      state.enquiryNoteLoading = false;
    },
    [getEnquiryNoteListData.fulfilled]: (state, action) => {
      state.enquiryNoteList = action.payload || [];
      state.enquiryNoteLoading = false;
    },
    [createEnquiryNote.pending]: state => {
      state.isEnquiryNoteCreated = false;
      state.enquiryNoteLoading = true;
    },
    [createEnquiryNote.rejected]: state => {
      state.isEnquiryNoteCreated = false;
      state.enquiryNoteLoading = false;
    },
    [createEnquiryNote.fulfilled]: state => {
      state.isEnquiryNoteCreated = true;
      state.enquiryNoteLoading = false;
    },
    [updateEnquiryNote.pending]: state => {
      state.isEnquiryNoteUpdated = false;
      state.enquiryNoteLoading = true;
    },
    [updateEnquiryNote.rejected]: state => {
      state.isEnquiryNoteUpdated = false;
      state.enquiryNoteLoading = false;
    },
    [updateEnquiryNote.fulfilled]: state => {
      state.isEnquiryNoteUpdated = true;
      state.enquiryNoteLoading = false;
    },
    [deleteEnquiryNote.pending]: state => {
      state.isEnquiryNoteDeleted = false;
      state.enquiryNoteLoading = true;
    },
    [deleteEnquiryNote.rejected]: state => {
      state.isEnquiryNoteDeleted = false;
      state.enquiryNoteLoading = false;
    },
    [deleteEnquiryNote.fulfilled]: state => {
      state.isEnquiryNoteDeleted = true;
      state.enquiryNoteLoading = false;
    },
    [getEnquiryNoteData.pending]: state => {
      state.enquiryNoteLoading = true;
      state.enquiryNoteDetail = {};
    },
    [getEnquiryNoteData.rejected]: state => {
      state.enquiryNoteLoading = false;
      state.enquiryNoteDetail = {};
    },
    [getEnquiryNoteData.fulfilled]: (state, action) => {
      state.enquiryNoteLoading = false;
      state.enquiryNoteDetail = action.payload;
    },
    [getTrackableProductsData.pending]: state => {
      state.enquiryNoteLoading = true;
      state.noteTrackableProductDetail = {};
    },
    [getTrackableProductsData.rejected]: state => {
      state.enquiryNoteLoading = false;
      state.noteTrackableProductDetail = {};
    },
    [getTrackableProductsData.fulfilled]: (state, action) => {
      state.enquiryNoteLoading = false;
      state.noteTrackableProductDetail = action.payload;
    },

    [getTrackedHistoryData.pending]: state => {
      state.enquiryNoteLoading = true;
      state.noteTrackableHistoryDetail = {};
    },
    [getTrackedHistoryData.rejected]: state => {
      state.enquiryNoteLoading = false;
      state.noteTrackableHistoryDetail = {};
    },
    [getTrackedHistoryData.fulfilled]: (state, action) => {
      state.enquiryNoteLoading = false;
      state.noteTrackableHistoryDetail = action.payload;
    },
  },
});

// export const {} = enquiryNoteSlice.actions;

export default enquiryNoteSlice.reducer;
