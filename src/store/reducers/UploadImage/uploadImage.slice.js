import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  uploadImageLoading: false,
  isUploadImageUpdated: false,
  getUploadImage: '',
  getCkEditorUploadImage: '',
};

export const uploadImage = createAsyncThunk(
  'admin/upload-image',
  (file, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('api/upload', file)
        .then(res => {
          if (res.data.status === 200) {
            dispatch(
              showMessage({
                message: res.data.msg,
                varient: 'success',
              }),
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

export const ckEditorUploadImage = createAsyncThunk(
  'admin/ckeditor-upload-image',
  (file, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('api/upload', file)
        .then(res => {
          if (res.data.status === 200) {
            dispatch(
              showMessage({
                message: res.data.msg,
                varient: 'success',
              }),
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

export const uploadImageSlice = createSlice({
  name: 'uploadImage',
  initialState,
  reducers: {
    setUploadImageLoading: (state, action) => {
      state.uploadImageLoading = action.payload;
    },
    setIsUploadImageUpdated: (state, action) => {
      state.isUploadImageUpdated = action.payload;
    },
    setUploadImageDetail: (state, action) => {
      state.getUploadImage = action.payload;
    },
  },
  extraReducers: {
    [uploadImage.pending]: state => {
      state.uploadImageLoading = true;
      state.isUploadImageUpdated = false;
      state.getUploadImage = {};
    },
    [uploadImage.rejected]: state => {
      state.uploadImageLoading = false;
      state.isUploadImageUpdated = false;
      state.getUploadImage = {};
    },
    [uploadImage.fulfilled]: (state, action) => {
      state.uploadImageLoading = false;
      state.isUploadImageUpdated = true;
      state.getUploadImage = action.payload;
    },
    [ckEditorUploadImage.pending]: state => {
      state.uploadImageLoading = true;
      state.isUploadImageUpdated = false;
      state.getCkEditorUploadImage = {};
    },
    [ckEditorUploadImage.rejected]: state => {
      state.uploadImageLoading = false;
      state.isUploadImageUpdated = false;
      state.getCkEditorUploadImage = {};
    },
    [ckEditorUploadImage.fulfilled]: (state, action) => {
      state.uploadImageLoading = false;
      state.isUploadImageUpdated = true;
      state.getCkEditorUploadImage = action.payload;
    },
  },
});

export const {
  setUploadImageLoading,
  setIsUploadImageUpdated,
  setUploadImageDetail,
} = uploadImageSlice.actions;

export default uploadImageSlice.reducer;
