import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';
const initialState = {
  activeFaqCategoryList: [],
  inActiveFaqCategoryList: [],
  faqCategoryLoading: false,
  isFaqCategoryUpdated: false,
  faqCategoryDetail: {},
};

export const getFaqCategoryListData = createAsyncThunk(
  'admin/faq/get-faq-category-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/FAQ_category/list')
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
              resolve(res.data.data[0]);
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

export const createFaqCategory = createAsyncThunk(
  'admin/create-faq-category',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/FAQ_category/create', data)
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

export const getFaqCategoryData = createAsyncThunk(
  'admin/get-faq-category',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/FAQ_category/${_id}`)
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

export const updateFaqCategory = createAsyncThunk(
  'admin/faq-category/update',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, faqCategory } = props;
      axios
        .put(`admin/FAQ_category/update/${_id}`, faqCategory)
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

export const faqCategoriesSlice = createSlice({
  name: 'faqCategory',
  initialState,
  reducers: {
    setIsFaqCategoryUpdated: (state, action) => {
      state.isFaqCategoryUpdated = action.payload;
    },
    setFaqCategoryDetail: (state, action) => {
      state.faqCategoryDetail = action.payload;
    },
  },
  extraReducers: {
    [getFaqCategoryListData.pending]: state => {
      state.faqCategoryLoading = true;
    },
    [getFaqCategoryListData.rejected]: state => {
      state.faqCategoryLoading = false;
      state.activeFaqCategoryList = [];
      state.inActiveFaqCategoryList = [];
    },
    [getFaqCategoryListData.fulfilled]: (state, action) => {
      state.faqCategoryLoading = false;
      state.activeFaqCategoryList = action.payload.active || [];
      state.inActiveFaqCategoryList = action.payload.inactive || [];
    },
    [createFaqCategory.pending]: state => {
      state.faqCategoryLoading = true;
      state.isFaqCategoryUpdated = false;
    },
    [createFaqCategory.rejected]: state => {
      state.faqCategoryLoading = false;
      state.isFaqCategoryUpdated = false;
    },
    [createFaqCategory.fulfilled]: (state, action) => {
      state.faqCategoryLoading = false;
      state.isFaqCategoryUpdated = true;
    },
    [updateFaqCategory.pending]: state => {
      state.isFaqCategoryUpdated = false;
      state.faqCategoryLoading = true;
    },
    [updateFaqCategory.rejected]: state => {
      state.isFaqCategoryUpdated = false;
      state.faqCategoryLoading = false;
    },
    [updateFaqCategory.fulfilled]: (state, action) => {
      state.isFaqCategoryUpdated = true;
      state.faqCategoryLoading = false;
    },
    [getFaqCategoryData.pending]: state => {
      state.faqCategoryLoading = true;
      state.faqCategoryDetail = {};
    },
    [getFaqCategoryData.rejected]: state => {
      state.faqCategoryLoading = false;
      state.faqCategoryDetail = {};
    },
    [getFaqCategoryData.fulfilled]: (state, action) => {
      state.faqCategoryLoading = false;
      state.faqCategoryDetail = action.payload;
    },
  },
});
export const { setIsFaqCategoryUpdated, setFaqCategoryDetail } =
  faqCategoriesSlice.actions;
export default faqCategoriesSlice.reducer;
