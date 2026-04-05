import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';

const initialState = {
  activeAvailabilityStatusList: [],
  inActiveAvailabilityStatusList: [],
  availabilityStatusLoading: false,
  isAvailabilityStatusUpdated: false,
  availabilityStatusDetail: {},
};

export const getAvailabilityStatusListData = createAsyncThunk(
  'admin/get-availability_status-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/availability_status/list')
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
          reject(error);
          dispatch(showMessage({ message: error.response.data.msg }));
        });
    });
  },
);

export const updateAvailabilityStatus = createAsyncThunk(
  'admin/update-availability-status',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, availabilityStatus } = props;
      axios
        .put(`admin/availability_status/update/${_id}`, availabilityStatus)
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

export const getAvailabilityStatusData = createAsyncThunk(
  'admin/get-availability-status',
  (id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/availability_status/${id}`)
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

export const createAvailabilityStatus = createAsyncThunk(
  'admin/create-availability-status',
  (availabilityStatus, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/availability_status/create', availabilityStatus)
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

export const availabilityStatusSlice = createSlice({
  name: 'availability_status',
  initialState,
  reducers: {
    setAvailabilityStatusLoading: (state, action) => {
      state.availabilityStatusLoading = action.payload;
    },
    setIsAvailabilityStatusUpdated: (state, action) => {
      state.isAvailabilityStatusUpdated = action.payload;
    },
    setAvailabilityStatusDetail: (state, action) => {
      state.availabilityStatusDetail = action.payload;
    },
  },
  extraReducers: {
    [getAvailabilityStatusListData.pending]: state => {
      state.availabilityStatusLoading = true;
    },
    [getAvailabilityStatusListData.rejected]: state => {
      state.activeAvailabilityStatusList = [];
      state.inActiveAvailabilityStatusList = [];
      state.availabilityStatusLoading = false;
    },
    [getAvailabilityStatusListData.fulfilled]: (state, action) => {
      state.activeAvailabilityStatusList = action.payload.active || [];
      state.inActiveAvailabilityStatusList = action.payload.inactive || [];
      state.availabilityStatusLoading = false;
    },
    [updateAvailabilityStatus.pending]: state => {
      state.isAvailabilityStatusUpdated = false;
      state.availabilityStatusLoading = true;
    },
    [updateAvailabilityStatus.rejected]: state => {
      state.isAvailabilityStatusUpdated = false;
      state.availabilityStatusLoading = false;
    },
    [updateAvailabilityStatus.fulfilled]: state => {
      state.isAvailabilityStatusUpdated = true;
      state.availabilityStatusLoading = false;
    },
    [getAvailabilityStatusData.pending]: state => {
      state.availabilityStatusLoading = true;
      state.availabilityStatusDetail = {};
    },
    [getAvailabilityStatusData.rejected]: state => {
      state.availabilityStatusLoading = false;
      state.availabilityStatusDetail = {};
    },
    [getAvailabilityStatusData.fulfilled]: (state, action) => {
      state.availabilityStatusLoading = false;
      state.availabilityStatusDetail = action.payload;
    },
    [createAvailabilityStatus.pending]: state => {
      state.isAvailabilityStatusUpdated = false;
      state.availabilityStatusLoading = true;
    },
    [createAvailabilityStatus.rejected]: state => {
      state.isAvailabilityStatusUpdated = false;
      state.availabilityStatusLoading = false;
    },
    [createAvailabilityStatus.fulfilled]: state => {
      state.isAvailabilityStatusUpdated = true;
      state.availabilityStatusLoading = false;
    },
  },
});

export const {
  setAvailabilityStatusLoading,
  setIsAvailabilityStatusUpdated,
  setAvailabilityStatusDetail,
} = availabilityStatusSlice.actions;

export default availabilityStatusSlice.reducer;
