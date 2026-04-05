import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../../common.slice';

const initialState = {
  activeSourceCategoryList: [],
  inActiveSourceCategoryList: [],
  sourceCategoryLoading: false,
  isSourceCategoryUpdated: false,
  sourceCategoryDetail: {},
};

export const getSourceCategoryListData = createAsyncThunk(
  'admin/get-sources-category-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/source_category/list')
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

export const getSourceCategoryData = createAsyncThunk(
  'admin/get-sources-category',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/source_category/${_id}`)
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

export const createSourceCategory = createAsyncThunk(
  'admin/create-sources-category',
  (sourceCategory, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/source_category/create', sourceCategory)
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

export const updateSourceCategory = createAsyncThunk(
  'admin/update-sources-category',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, sourceCategory } = props;
      axios
        .put(`admin/source_category/update/${_id}`, sourceCategory)
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

export const sourceCategorySlice = createSlice({
  name: 'sourceCategory',
  initialState,
  reducers: {
    setSourceCategoryLoading: (state, action) => {
      state.sourceCategoryLoading = action.payload;
    },
    setIsSourceCategoryUpdated: (state, action) => {
      state.isSourceCategoryUpdated = action.payload;
    },
    setSourceCategoryDetail: (state, action) => {
      state.sourceCategoryDetail = action.payload;
    },
  },
  extraReducers: {
    [getSourceCategoryListData.pending]: state => {
      state.sourceCategoryLoading = true;
    },
    [getSourceCategoryListData.rejected]: state => {
      state.activeSourceCategoryList = [];
      state.inActiveSourceCategoryList = [];
      state.sourceCategoryLoading = false;
    },
    [getSourceCategoryListData.fulfilled]: (state, action) => {
      state.activeSourceCategoryList = action.payload.active;
      state.inActiveSourceCategoryList = action.payload.inactive;
      state.sourceCategoryLoading = false;
    },
    [getSourceCategoryData.pending]: state => {
      state.sourceCategoryLoading = true;
      state.sourceCategoryDetail = {};
    },
    [getSourceCategoryData.rejected]: state => {
      state.sourceCategoryLoading = false;
      state.sourceCategoryDetail = {};
    },
    [getSourceCategoryData.fulfilled]: (state, action) => {
      state.sourceCategoryLoading = false;
      state.sourceCategoryDetail = action.payload;
    },
    [createSourceCategory.pending]: state => {
      state.isSourceCategoryUpdated = false;
      state.sourceCategoryLoading = true;
    },
    [createSourceCategory.rejected]: state => {
      state.isSourceCategoryUpdated = false;
      state.sourceCategoryLoading = false;
    },
    [createSourceCategory.fulfilled]: (state, action) => {
      state.isSourceCategoryUpdated = true;
      state.sourceCategoryLoading = false;
    },
    [updateSourceCategory.pending]: state => {
      state.isSourceCategoryUpdated = false;
      state.sourceCategoryLoading = true;
    },
    [updateSourceCategory.rejected]: state => {
      state.isSourceCategoryUpdated = false;
      state.sourceCategoryLoading = false;
    },
    [updateSourceCategory.fulfilled]: (state, action) => {
      state.isSourceCategoryUpdated = true;
      state.sourceCategoryLoading = false;
    },
  },
});

export const {
  setSourceCategoryLoading,
  setIsSourceCategoryUpdated,
  setSourceCategoryDetail,
} = sourceCategorySlice.actions;

export default sourceCategorySlice.reducer;
