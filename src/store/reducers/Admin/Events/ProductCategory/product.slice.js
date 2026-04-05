import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import { showMessage } from '../../../common.slice';
import { kpiReport } from 'utils/FieldValues';

const initialState = {
  activeProductList: [],
  inActiveProductList: [],
  productLoading: false,
  isProductUpdated: false,
  productDetail: {},
  availableAtEvent: [],
  availableAtEventLoading: false,
};

export const getRightProductListData = data => {
  if (data?.length > 0) {
    const rightProductListData = _.map(data, item => {
      const updatedGroupData = _.map(item.group_data, groupItem => {
        const newKpiData = kpiReport.find(
          val => val.value === groupItem.add_to_kpis_report,
        )?.label;
        const rules = groupItem?.price_rule_data?.map(e => {
          return e.public_name;
        });
        return {
          ...groupItem,
          newAdd_to_kpis_report: newKpiData,
          newrules: rules,
        };
      });
      return {
        ...item,
        group_data: updatedGroupData,
      };
    });
    return rightProductListData;
  }
  return [];
};

export const getProductListData = createAsyncThunk(
  'admin/get-product-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/product/list', data)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getAvailaleEvent = createAsyncThunk(
  'admin/avaliable-event',
  (product, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/product/availability/event_list', product)
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

export const getProductData = createAsyncThunk(
  'admin/get-product',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/product/${_id}`)
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

export const createProduct = createAsyncThunk(
  'admin/create-product-',
  (product, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/product/create', product)
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
          dispatch(
            showMessage({
              message: error.response.data.msg,
            }),
          );
          reject(error);
        });
    });
  },
);

export const updateProduct = createAsyncThunk(
  'admin/update-product',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, product } = props;
      axios
        .put(`admin/product/update/${_id}`, product)
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
          dispatch(
            showMessage({
              message: error.response.data.msg,
            }),
          );
          reject(error);
        });
    });
  },
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductLoading: (state, action) => {
      state.productLoading = action.payload;
    },
    setIsProductUpdated: (state, action) => {
      state.isProductUpdated = action.payload;
    },
    setProductDetail: (state, action) => {
      state.productDetail = action.payload;
    },
  },
  extraReducers: {
    [getProductListData.pending]: state => {
      state.productLoading = true;
    },
    [getProductListData.rejected]: state => {
      state.activeProductList = [];
      state.inActiveProductList = [];
      state.productLoading = false;
    },
    [getProductListData.fulfilled]: (state, action) => {
      state.activeProductList = getRightProductListData(action.payload.active);
      state.inActiveProductList = getRightProductListData(
        action.payload.inactive,
      );
      state.productLoading = false;
    },

    [getAvailaleEvent.pending]: state => {
      state.availableAtEventLoading = true;
    },
    [getAvailaleEvent.rejected]: state => {
      state.availableAtEvent = [];
      state.availableAtEventLoading = false;
    },
    [getAvailaleEvent.fulfilled]: (state, action) => {
      state.availableAtEvent = action.payload;
      state.availableAtEventLoading = false;
    },

    [getProductData.pending]: state => {
      state.productLoading = true;
      state.productDetail = {};
    },
    [getProductData.rejected]: state => {
      state.productLoading = false;
      state.productDetail = {};
    },
    [getProductData.fulfilled]: (state, action) => {
      state.productLoading = false;
      state.productDetail = action.payload;
    },
    [createProduct.pending]: state => {
      state.isProductUpdated = false;
      state.productLoading = true;
    },
    [createProduct.rejected]: state => {
      state.isProductUpdated = false;
      state.productLoading = false;
    },
    [createProduct.fulfilled]: (state, action) => {
      state.isProductUpdated = true;
      state.productLoading = false;
    },
    [updateProduct.pending]: state => {
      state.isProductUpdated = false;
      state.productLoading = true;
    },
    [updateProduct.rejected]: state => {
      state.isProductUpdated = false;
      state.productLoading = false;
    },
    [updateProduct.fulfilled]: (state, action) => {
      state.isProductUpdated = true;
      state.productLoading = false;
    },
  },
});

export const { setProductLoading, setIsProductUpdated, setProductDetail } =
  productSlice.actions;

export default productSlice.reducer;
