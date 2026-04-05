import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../../common.slice';
const initialState = {
  activeProductCategoryList: [],
  inActiveProductCategoryList: [],
  productCategoryLoading: false,
  isProductCategoryUpdated: false,
  productCategoryDetail: {},
};

export const getProductCategoryListData = createAsyncThunk(
  'admin/get-product-category-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/product_category/list')
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
export const getProductCategoryData = createAsyncThunk(
  'admin/get-product-category',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/product_category/${_id}`)
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

export const createProductCategory = createAsyncThunk(
  'admin/create-product-category',
  (productCategory, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/product_category/create', productCategory)
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

export const updateProductCategory = createAsyncThunk(
  'admin/update-product-category',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, productCategory } = props;
      axios
        .put(`admin/product_category/update/${_id}`, productCategory)
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

export const productCategorySlice = createSlice({
  name: 'productCategory',
  initialState,
  reducers: {
    setProductCategoryLoading: (state, action) => {
      state.productCategoryLoading = action.payload;
    },
    setIsProductCategoryUpdated: (state, action) => {
      state.isProductCategoryUpdated = action.payload;
    },
    setProductCategoryDetail: (state, action) => {
      state.productCategoryDetail = action.payload;
    },
  },
  extraReducers: {
    [getProductCategoryListData.pending]: state => {
      state.productCategoryLoading = true;
    },
    [getProductCategoryListData.rejected]: state => {
      state.activeProductCategoryList = [];
      state.inActiveProductCategoryList = [];
      state.productCategoryLoading = false;
    },
    [getProductCategoryListData.fulfilled]: (state, action) => {
      state.activeProductCategoryList = action.payload.active || [];
      state.inActiveProductCategoryList = action.payload.inactive || [];
      state.productCategoryLoading = false;
    },
    [getProductCategoryData.pending]: state => {
      state.productCategoryLoading = true;
      state.productCategoryDetail = {};
    },
    [getProductCategoryData.rejected]: state => {
      state.productCategoryLoading = false;
      state.productCategoryDetail = {};
    },
    [getProductCategoryData.fulfilled]: (state, action) => {
      state.productCategoryLoading = false;
      state.productCategoryDetail = action.payload;
    },
    [createProductCategory.pending]: state => {
      state.isProductCategoryUpdated = false;
      state.productCategoryLoading = true;
    },
    [createProductCategory.rejected]: state => {
      state.isProductCategoryUpdated = false;
      state.productCategoryLoading = false;
    },
    [createProductCategory.fulfilled]: (state, action) => {
      state.isProductCategoryUpdated = true;
      state.productCategoryLoading = false;
    },
    [updateProductCategory.pending]: state => {
      state.isProductCategoryUpdated = false;
      state.productCategoryLoading = true;
    },
    [updateProductCategory.rejected]: state => {
      state.isProductCategoryUpdated = false;
      state.productCategoryLoading = false;
    },
    [updateProductCategory.fulfilled]: (state, action) => {
      state.isProductCategoryUpdated = true;
      state.productCategoryLoading = false;
    },
  },
});

export const {
  setProductCategoryLoading,
  setIsProductCategoryUpdated,
  setProductCategoryDetail,
} = productCategorySlice.actions;

export default productCategorySlice.reducer;
