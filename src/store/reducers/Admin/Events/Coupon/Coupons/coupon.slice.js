import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../../../common.slice';
import _ from 'lodash';
import { couponType } from 'utils/FieldValues';

const initialState = {
  activeCouponList: [],
  inActiveCouponList: [],
  couponLoading: false,
  isCouponUpdated: false,
  couponDetail: {},
  getBookingCouponAvailableData: {},
};

export const getRightCouponListData = data => {
  if (data?.length > 0) {
    const rightCouponListData = _.map(data, (item, i) => {
      return {
        ...item,
        newCoupon_type: couponType?.find(val => val.value === item.coupon_type)
          ?.label,
        newAvailable_at_events: item?.available_at_events?.map(e => {
          return e.event_name;
        }),
      };
    });
    return rightCouponListData;
  }
  return [];
};
export const getCouponListData = createAsyncThunk(
  'admin/get-coupon-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/coupon/list')
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
export const getCouponData = createAsyncThunk(
  'admin/get-coupon',
  (_id, dispatch) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/coupon/${_id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getBookingCouponAvailableList = createAsyncThunk(
  'admin/get-booking-coupon-available-list',
  (_id, dispatch) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/booking_coupon/available_list/${_id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const createCoupon = createAsyncThunk(
  'admin/create-coupon',
  (coupon, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/coupon/create', coupon)
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

export const updateCoupon = createAsyncThunk(
  'admin/update-coupon',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, coupon } = props;
      axios
        .put(`admin/coupon/update/${_id}`, coupon)
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

export const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    setCouponLoading: (state, action) => {
      state.couponLoading = action.payload;
    },
    setIsCouponUpdated: (state, action) => {
      state.isCouponUpdated = action.payload;
    },
    setCouponDetail: (state, action) => {
      state.couponDetail = action.payload;
    },
  },
  extraReducers: {
    [getCouponListData.pending]: state => {
      state.couponLoading = true;
    },
    [getCouponListData.rejected]: state => {
      state.activeCouponList = [];
      state.inActiveCouponList = [];
      state.couponLoading = false;
    },
    [getCouponListData.fulfilled]: (state, action) => {
      state.activeCouponList = getRightCouponListData(action.payload.active);
      state.inActiveCouponList = getRightCouponListData(
        action.payload.inactive,
      );
      state.couponLoading = false;
    },
    [getCouponData.pending]: state => {
      state.couponLoading = true;
      state.couponDetail = {};
    },
    [getCouponData.rejected]: state => {
      state.couponLoading = false;
      state.couponDetail = {};
    },
    [getCouponData.fulfilled]: (state, action) => {
      state.couponLoading = false;
      state.couponDetail = action.payload;
    },
    [getBookingCouponAvailableList.pending]: state => {
      state.couponLoading = true;
      state.getBookingCouponAvailableData = {};
    },
    [getBookingCouponAvailableList.rejected]: state => {
      state.couponLoading = false;
      state.getBookingCouponAvailableData = {};
    },
    [getBookingCouponAvailableList.fulfilled]: (state, action) => {
      state.couponLoading = false;
      state.getBookingCouponAvailableData = action.payload;
    },
    [createCoupon.pending]: state => {
      state.isCouponUpdated = false;
      state.couponLoading = true;
    },
    [createCoupon.rejected]: state => {
      state.isCouponUpdated = false;
      state.couponLoading = false;
    },
    [createCoupon.fulfilled]: (state, action) => {
      state.isCouponUpdated = true;
      state.couponLoading = false;
    },
    [updateCoupon.pending]: state => {
      state.isCouponUpdated = false;
      state.couponLoading = true;
    },
    [updateCoupon.rejected]: state => {
      state.isCouponUpdated = false;
      state.couponLoading = false;
    },
    [updateCoupon.fulfilled]: (state, action) => {
      state.isCouponUpdated = true;
      state.couponLoading = false;
    },
  },
});

export const { setCouponLoading, setIsCouponUpdated, setCouponDetail } =
  couponSlice.actions;

export default couponSlice.reducer;
