import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  activeContactList: [],
  inactiveContactList: [],
  contactDetail: {},
  contactListLoading: false,
  isContactUpdated: false,
  CreatedContactEnquiryId: '',
  createdEmail: '',
  duplicateEmailList: [],
  duplicateEmailSecondaryList: [],

  lookupPostcodeList: [],
};

export const getContactListData = createAsyncThunk(
  'admin/get-contact-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/contact/list', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
              resolve(res.data?.data);
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

export const getContactData = createAsyncThunk(
  'admin/get-contact',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/contact/${_id}`)
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
export const updateContact = createAsyncThunk(
  'admin/contact-update',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, contact } = props;
      axios
        .put(`admin/contact/update/${_id}`, contact)
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
export const createContact = createAsyncThunk(
  'admin/create-contact',
  (contact, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/contact/create', contact)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            resolve({
              email: contact.email_primary,
              res: res.data.data,
            });
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

export const getLookupPostcode = createAsyncThunk(
  'admin/get-lookup-postcode-contact-check',
  (postcode, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/lookup', postcode)
        .then(res => {
          if (res.data.err === 0) {
            resolve(res.data);
          } else {
            dispatch(showMessage({ message: res.data.msg }));
            reject();
          }
        })
        .catch(error => {
          // dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const duplicateCheckEmail = createAsyncThunk(
  'admin/dup-check-email',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/contact/dup-check-email', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
              resolve({ data: data, res: res?.data?.data });
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
export const mergeContacts = createAsyncThunk(
  'admin/merge_contacts',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/contact/merge_contacts', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
              dispatch(
                showMessage({ message: res.data.msg, varient: 'success' }),
              );
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
export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setContactLoading: (state, action) => {
      state.contactListLoading = action.payload;
    },
    setIsContactUpdated: (state, action) => {
      state.isContactUpdated = action.payload;
    },
    setContactDetail: (state, action) => {
      state.contactDetail = action.payload;
    },
    setCreatedContactEnquiryId: (state, action) => {
      state.CreatedContactEnquiryId = action.payload;
    },
  },
  extraReducers: {
    [getContactListData.pending]: state => {
      state.contactListLoading = true;
    },
    [getContactListData.rejected]: state => {
      state.activeContactList = [];
      state.inactiveContactList = [];
      state.contactListLoading = false;
    },
    [getContactListData.fulfilled]: (state, action) => {
      state.activeContactList = action?.payload?.active;
      state.inactiveContactList = action.payload?.inactive;
      state.contactListLoading = false;
    },
    [getContactData.pending]: state => {
      state.contactListLoading = true;
      state.contactDetail = {};
    },
    [getContactData.rejected]: state => {
      state.contactListLoading = false;
      state.contactDetail = {};
    },
    [getContactData.fulfilled]: (state, action) => {
      state.contactListLoading = false;
      state.contactDetail = action.payload;
    },
    [updateContact.pending]: state => {
      state.isContactUpdated = false;
      state.contactListLoading = true;
    },
    [updateContact.rejected]: state => {
      state.isContactUpdated = false;
      state.contactListLoading = false;
    },
    [updateContact.fulfilled]: (state, action) => {
      state.isContactUpdated = true;
      state.contactListLoading = false;
      state.CreatedContactEnquiryId = action.payload.enquiry_id || '';
    },
    [createContact.pending]: state => {
      state.isContactUpdated = false;
      state.contactListLoading = true;
    },
    [createContact.rejected]: state => {
      state.isContactUpdated = false;
      state.contactListLoading = false;
    },
    [createContact.fulfilled]: (state, action) => {
      state.isContactUpdated = true;
      state.contactListLoading = false;
      state.CreatedContactEnquiryId = action.payload.res.enquiry_id || '';
      state.createdEmail = action.payload.email || '';
    },
    [getLookupPostcode.pending]: state => {
      state.contactListLoading = true;
    },
    [getLookupPostcode.rejected]: state => {
      state.contactListLoading = false;
      state.lookupPostcodeList = [];
    },
    [getLookupPostcode.fulfilled]: (state, action) => {
      state.contactListLoading = false;
      state.lookupPostcodeList = action.payload;
    },
    [duplicateCheckEmail.pending]: state => {},
    [duplicateCheckEmail.rejected]: state => {
      state.duplicateEmailList = [];
      state.duplicateEmailSecondaryList = [];
    },
    [duplicateCheckEmail.fulfilled]: (state, action) => {
      if (action?.payload?.data?.isSet === 'email_secondary') {
        state.duplicateEmailSecondaryList = action.payload.res;
      } else {
        state.duplicateEmailList = action.payload.res;
      }
    },
  },
});
export const {
  setIsContactUpdated,
  setContactLoading,
  setContactDetail,
  setCreatedContactEnquiryId,
} = contactSlice.actions;
export default contactSlice.reducer;
