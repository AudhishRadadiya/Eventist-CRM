import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';
import _ from 'lodash';
import { contactTypes } from 'utils/FieldValues';

const initialState = {
  activeAllAccountList: [],
  activeAccountList: [],
  inActiveAllAccountList: [],
  inActiveAccountList: [],
  accountLoading: false,
  isAccountUpdated: false,
  accountDetail: {},
  lookupAccountDetail: {},
  accountList: [],
  accountAgentsListData: [],
};

const getRightAccountData = data => {
  if (data?.length > 0) {
    const accountData = _.map(data, item => {
      const updatedGroupData = _.map(item.group_data, groupItem => {
        const newTypeData = contactTypes.find(
          val => val.id === groupItem?.type,
        )?.label;
        return {
          ...groupItem,
          newAccountType: newTypeData,
        };
      });
      return {
        ...item,
        group_data: updatedGroupData,
      };
    });
    return accountData;
  }
  return [];
};

export const getAccountAgentsListData = createAsyncThunk(
  'admin/get-accountAgents-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/account_agents')
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
export const getAccountListData = createAsyncThunk(
  'admin-account-get-account-list',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { start, limit, group, is_active, name, address_line_1, postcode } =
        props;

      const payload = { group, is_active, name, address_line_1, postcode };

      axios
        .post(`admin/account/list/${start}/${limit}`, payload)
        .then(res => {
          if (res?.data?.err === 0) {
            if (Object.entries(res?.data?.data)) {
              resolve(res?.data?.data);
            } else {
              dispatch(showMessage({ message: res?.data?.msg }));
              resolve([]);
            }
          } else {
            dispatch(showMessage({ message: res?.data?.msg }));
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

export const createAccount = createAsyncThunk(
  'admin/create-account',
  (account, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/account/create', account)
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

export const getAccountData = createAsyncThunk(
  'admin/get-account',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/account/${_id}`)
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

export const getLookupAccount = createAsyncThunk(
  'admin/get-lookup-account',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/account/contact/${_id}`)
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

export const updateAccount = createAsyncThunk(
  'admin/account/update',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, account } = props;
      axios
        .put(`admin/account/update/${_id}`, account)
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

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setIsAccountUpdated: (state, action) => {
      state.isAccountUpdated = action.payload;
    },
    setAccountDetail: (state, action) => {
      state.accountDetail = action.payload;
    },
    setLookupAccountDetail: (state, action) => {
      state.lookupAccountDetail = action.payload;
    },
    setAccountList: (state, action) => {
      state.accountList = action.payload;
    },
  },
  extraReducers: {
    [getAccountListData.pending]: state => {
      state.accountLoading = true;
    },
    [getAccountListData.rejected]: state => {
      state.accountLoading = false;
      state.activeAccountList = [];
      state.inActiveAccountList = [];
    },
    [getAccountListData.fulfilled]: (state, action) => {
      state.accountLoading = false;
      if (
        action?.payload?.account_data?.active?.length >= 1 &&
        action?.payload?.account_data?.inactive?.length === 0
      ) {
        state.activeAccountList =
          getRightAccountData(action?.payload?.account_data?.active) || [];
        state.activeAllAccountList = action?.payload;
      }
      if (
        action?.payload?.account_data?.inactive?.length >= 1 &&
        action?.payload?.account_data?.active?.length === 0
      ) {
        state.inActiveAccountList =
          getRightAccountData(action?.payload?.account_data?.inactive) || [];
        state.inActiveAllAccountList = action?.payload;
      }
      if (
        action?.payload?.inactive?.account_data?.length === 0 &&
        action?.payload?.active?.account_data?.length === 0
      ) {
        state.activeAccountList = [];
        state.inActiveAccountList = [];
        state.activeAllAccountList = [];
        state.inActiveAllAccountList = [];
      }
      state.accountList = action.payload?.account_data;
    },
    [getAccountAgentsListData.fulfilled]: (state, action) => {
      state.accountAgentsListData = action.payload;
    },
    [createAccount.pending]: state => {
      state.accountLoading = true;
      state.isAccountUpdated = false;
    },
    [createAccount.rejected]: state => {
      state.accountLoading = false;
      state.isAccountUpdated = false;
    },
    [createAccount.fulfilled]: (state, action) => {
      state.accountLoading = false;
      state.isAccountUpdated = true;
    },
    [updateAccount.pending]: state => {
      state.isAccountUpdated = false;
      state.accountLoading = true;
    },
    [updateAccount.rejected]: state => {
      state.isAccountUpdated = false;
      state.accountLoading = false;
    },
    [updateAccount.fulfilled]: (state, action) => {
      state.isAccountUpdated = true;
      state.accountLoading = false;
    },
    [getAccountData.pending]: state => {
      state.accountLoading = true;
      state.accountDetail = {};
    },
    [getAccountData.rejected]: state => {
      state.accountLoading = false;
      state.accountDetail = {};
    },
    [getAccountData.fulfilled]: (state, action) => {
      state.accountLoading = false;
      state.accountDetail = action.payload;
    },
    [getLookupAccount.pending]: state => {
      state.accountLoading = true;
      state.lookupAccountDetail = {};
    },
    [getLookupAccount.rejected]: state => {
      state.accountLoading = false;
      state.lookupAccountDetail = {};
    },
    [getLookupAccount.fulfilled]: (state, action) => {
      state.accountLoading = false;
      state.lookupAccountDetail = action.payload;
    },
  },
});
export const {
  setIsAccountUpdated,
  setAccountDetail,
  setLookupAccountDetail,
  setAccountList,
} = accountSlice.actions;
export default accountSlice.reducer;
