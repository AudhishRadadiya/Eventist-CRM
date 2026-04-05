import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../common.slice';
import axios from 'axios';

const initialState = {
  emailDetail: {},
  dynamicContent: {},
  getAllAttachmentsData: {},
  mailListLoading: false,
  isMailUpdated: false,
  isDeletedAssets: false,
};

export const sendMail = createAsyncThunk(
  'admin/create-maill',
  (mail, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/email/send', mail)
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
export const getEmailData = createAsyncThunk(
  'admin/get-emmail-data',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/email/view/${_id}`)
        .then(res => {
          if (res?.data?.err === 0) {
            if (res?.data?.data !== null) {
              resolve(res?.data?.data);
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

export const dynamicMailTemplate = createAsyncThunk(
  'admin/dynamic-mail-templete',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('api/dynamicContent', data)
        .then(res => {
          if (res.data.err === 0) {
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

export const getAllAttachments = createAsyncThunk(
  'admin/get-all-attachments',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/mail_asset/attachments', data)
        .then(res => {
          if (res.data.err === 0) {
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

export const deleteAttachment = createAsyncThunk(
  'admin/delete-attachment',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/mail_asset/delete_attachment', data)
        .then(res => {
          if (res.data.err === 0) {
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

export const mailSlice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    setMailLoading: (state, action) => {
      state.mailListLoading = action.payload;
    },
    setIsMailUpdated: (state, action) => {
      state.isMailUpdated = action.payload;
    },
    setEmailDetail: (state, action) => {
      state.emailDetail = action.payload;
    },
  },
  extraReducers: {
    [sendMail.pending]: state => {
      state.isMailUpdated = false;
      state.mailListLoading = true;
    },
    [sendMail.rejected]: state => {
      state.isMailUpdated = false;
      state.mailListLoading = false;
    },
    [sendMail.fulfilled]: (state, action) => {
      state.isMailUpdated = true;
      state.mailListLoading = false;
    },
    [getEmailData.pending]: state => {
      state.mailListLoading = true;
      state.emailDetail = {};
    },
    [getEmailData.rejected]: state => {
      state.mailListLoading = false;
      state.emailDetail = {};
    },
    [getEmailData.fulfilled]: (state, action) => {
      state.mailListLoading = false;
      state.emailDetail = action.payload;
    },
    [dynamicMailTemplate.pending]: state => {
      state.mailListLoading = true;
      state.dynamicContent = {};
    },
    [dynamicMailTemplate.rejected]: state => {
      state.mailListLoading = false;
      state.dynamicContent = {};
    },
    [dynamicMailTemplate.fulfilled]: (state, action) => {
      state.mailListLoading = false;
      state.dynamicContent = action.payload;
    },
    [getAllAttachments.pending]: state => {
      state.mailListLoading = true;
      state.getAllAttachmentsData = {};
    },
    [getAllAttachments.rejected]: state => {
      state.mailListLoading = false;
      state.getAllAttachmentsData = {};
    },
    [getAllAttachments.fulfilled]: (state, action) => {
      state.mailListLoading = false;
      state.getAllAttachmentsData = action.payload;
    },
    [deleteAttachment.pending]: state => {
      state.mailListLoading = true;
      state.isDeletedAssets = false;
    },
    [deleteAttachment.rejected]: state => {
      state.mailListLoading = false;
      state.isDeletedAssets = false;
    },
    [deleteAttachment.fulfilled]: (state, action) => {
      state.mailListLoading = false;
      state.isDeletedAssets = true;
    },
  },
});

export const { setMailLoading, setIsMailUpdated, setEmailDetail } =
  mailSlice.actions;

export default mailSlice.reducer;
