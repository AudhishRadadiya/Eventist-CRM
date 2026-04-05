import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../../common.slice';

const initialState = {
  activeContactSourcesList: [],
  inActiveContactSourcesList: [],
  contactSourcesLoading: false,
  isContactSourcesUpdated: false,
  contactSourcesDetail: {},
};

export const getContactSourcesListDataActive = createAsyncThunk(
  'admin/get-contact-sources-list-active',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/contact_source/list', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getContactSourcesListDataInActive = createAsyncThunk(
  'admin/get-contact-sources-list-inactive',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/contact_source/list', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getContactSourcesData = createAsyncThunk(
  'admin/get-contact-sources',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/contact_source/${_id}`)
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

export const createContactSources = createAsyncThunk(
  'admin/create-contact- sources',
  (contactSources, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/contact_source/create', contactSources)
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

export const updateContactSources = createAsyncThunk(
  'admin/update-contact-source',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, contactSources } = props;
      axios
        .put(`admin/contact_source/update/${_id}`, contactSources)
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

export const contactSourcesSlice = createSlice({
  name: 'contactSources',
  initialState,
  reducers: {
    setContactSourcesLoading: (state, action) => {
      state.contactSourcesLoading = action.payload;
    },
    setIsContactSourcesUpdated: (state, action) => {
      state.isContactSourcesUpdated = action.payload;
    },
    setContactSourcesDetail: (state, action) => {
      state.contactSourcesDetail = action.payload;
    },
  },
  extraReducers: {
    [getContactSourcesListDataActive.pending]: state => {
      state.contactSourcesLoading = true;
    },
    [getContactSourcesListDataActive.rejected]: state => {
      state.activeContactSourcesList = [];
      state.contactSourcesLoading = false;
    },
    [getContactSourcesListDataActive.fulfilled]: (state, action) => {
      state.activeContactSourcesList = action.payload.active;
      state.contactSourcesLoading = false;
    },
    [getContactSourcesListDataInActive.pending]: state => {
      state.contactSourcesLoading = true;
    },
    [getContactSourcesListDataInActive.rejected]: state => {
      state.inActiveContactSourcesList = [];
      state.contactSourcesLoading = false;
    },
    [getContactSourcesListDataInActive.fulfilled]: (state, action) => {
      state.inActiveContactSourcesList = action.payload.inactive;
      state.contactSourcesLoading = false;
    },
    [getContactSourcesData.pending]: state => {
      state.contactSourcesLoading = true;
      state.contactSourcesDetail = {};
    },
    [getContactSourcesData.rejected]: state => {
      state.contactSourcesLoading = false;
      state.contactSourcesDetail = {};
    },
    [getContactSourcesData.fulfilled]: (state, action) => {
      state.contactSourcesLoading = false;
      state.contactSourcesDetail = action.payload;
    },
    [createContactSources.pending]: state => {
      state.isContactSourcesUpdated = false;
      state.contactSourcesLoading = true;
    },
    [createContactSources.rejected]: state => {
      state.isContactSourcesUpdated = false;
      state.contactSourcesLoading = false;
    },
    [createContactSources.fulfilled]: (state, action) => {
      state.isContactSourcesUpdated = true;
      state.contactSourcesLoading = false;
    },
    [updateContactSources.pending]: state => {
      state.isContactSourcesUpdated = false;
      state.contactSourcesLoading = true;
    },
    [updateContactSources.rejected]: state => {
      state.isContactSourcesUpdated = false;
      state.contactSourcesLoading = false;
    },
    [updateContactSources.fulfilled]: (state, action) => {
      state.isContactSourcesUpdated = true;
      state.contactSourcesLoading = false;
    },
  },
});

export const {
  setContactSourcesLoading,
  setIsContactSourcesUpdated,
  setContactSourcesDetail,
} = contactSourcesSlice.actions;

export default contactSourcesSlice.reducer;
