import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';
import _ from 'lodash';
import { availabilityList } from 'utils/FieldValues';

const initialState = {
  activeTransactionalMailList: [],
  inActiveTransactionalMailList: [],
  transactionMailLoading: false,
  isTransactionalMailUpdated: false,
  transactionalMailDetail: {},
};

export const getRightTransactionalMailListData = data => {
  if (data?.length > 0) {
    const rightTransactionalMailData = _.map(data, item => {
      return {
        ...item,
        newAvailability: availabilityList?.find(
          val => val?.value === item?.availability,
        )?.label,
      };
    });
    return rightTransactionalMailData;
  }
  return [];
};

export const getTransactionalMailListData = createAsyncThunk(
  'admin/get-transactional-mail-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/transactional_email/list')
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

export const createTransactionalEmail = createAsyncThunk(
  'admin/create-transactional-mail',
  (transactionalEmail, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/transactional_email/create', transactionalEmail)
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
export const getTransactionalMailData = createAsyncThunk(
  'admin/get-transactional-mail',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/transactional_email/${_id}`)
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
export const updatetTransactionalMail = createAsyncThunk(
  'admin/update-transactional-mail',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, transactionalMail } = props;
      axios
        .put(`admin/transactional_email/update/${_id}`, transactionalMail)
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

export const transactionalMailSlice = createSlice({
  name: 'transactionalMail',
  initialState,
  reducers: {
    setIsTransactionalMailUpdated: (state, action) => {
      state.isTransactionalMailUpdated = action.payload;
    },
    setTransactionalMailDetail: (state, action) => {
      state.transactionalMailDetail = action.payload;
    },
  },
  extraReducers: {
    [getTransactionalMailListData.pending]: state => {
      state.transactionMailLoading = true;
    },
    [getTransactionalMailListData.rejected]: state => {
      state.activeTransactionalMailList = [];
      state.inActiveTransactionalMailList = [];
      state.transactionMailLoading = false;
    },
    [getTransactionalMailListData.fulfilled]: (state, action) => {
      state.activeTransactionalMailList = getRightTransactionalMailListData(
        action.payload.active,
      );
      state.inActiveTransactionalMailList = getRightTransactionalMailListData(
        action.payload.inactive,
      );
      state.transactionMailLoading = false;
    },
    [createTransactionalEmail.pending]: state => {
      state.transactionMailLoading = true;
      state.isTransactionalMailUpdated = false;
    },
    [createTransactionalEmail.rejected]: state => {
      state.transactionMailLoading = false;
      state.isTransactionalMailUpdated = false;
    },
    [createTransactionalEmail.fulfilled]: (state, action) => {
      state.transactionMailLoading = false;
      state.isTransactionalMailUpdated = true;
    },
    [getTransactionalMailData.pending]: state => {
      state.transactionMailLoading = true;
      state.transactionalMailDetail = {};
    },
    [getTransactionalMailData.rejected]: state => {
      state.transactionMailLoading = false;
      state.transactionalMailDetail = {};
    },
    [getTransactionalMailData.fulfilled]: (state, action) => {
      state.transactionMailLoading = false;
      state.transactionalMailDetail = action.payload;
    },
    [updatetTransactionalMail.pending]: state => {
      state.isTransactionalMailUpdated = false;
      state.transactionMailLoading = true;
    },
    [updatetTransactionalMail.rejected]: state => {
      state.isTransactionalMailUpdated = false;
      state.transactionMailLoading = false;
    },
    [updatetTransactionalMail.fulfilled]: (state, action) => {
      state.isTransactionalMailUpdated = true;
      state.transactionMailLoading = false;
    },
  },
});
export const { setIsTransactionalMailUpdated, setTransactionalMailDetail } =
  transactionalMailSlice.actions;
export default transactionalMailSlice.reducer;
