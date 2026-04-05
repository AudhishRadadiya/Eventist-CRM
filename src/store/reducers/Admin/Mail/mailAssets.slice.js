import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';
import _ from 'lodash';
import { availabilityList } from 'utils/FieldValues';

const initialState = {
  activeMailAssetList: [],
  inActiveMailAssetList: [],
  MailAssetLoading: false,
  isMailAssetsUpdated: false,
  isMailAlternativeAssetsDeleted: false,
  mailAssetDetail: {},
};

const getRightMailAssetData = data => {
  if (data?.length > 0) {
    const abc = _.map(data, item => {
      return {
        ...item,
        newAvailability: availabilityList?.find(
          val => val?.value === item?.availability,
        )?.label,
      };
    });
    return abc;
  }
  return [];
};

export const getMailAssetsListData = createAsyncThunk(
  'admin/get-mail-assets-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/mail_asset/list')
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.mail_assetData.length > 0) {
              resolve(res.data.data.mail_assetData[0].result);
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

export const getMailAssetsData = createAsyncThunk(
  'admin/mail/get-mail-assets',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/mail_asset/${_id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data.data).length > 0) {
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

export const createMailAsset = createAsyncThunk(
  'admin/create-mail-asset',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/mail_asset/create', data)
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

export const updateMailAsset = createAsyncThunk(
  'admin/update-mail-asset',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, mail } = props;
      axios
        .put(`admin/mail_asset/update/${_id}`, mail)
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

export const deleteMailAlternativeAsset = createAsyncThunk(
  'admin/delete-mail-alternative-asset',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/alternative_asset/remove`, props)
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

export const mailAssetsSlice = createSlice({
  name: 'mailAssets',
  initialState,
  reducers: {
    setIsMailAlternativeAssetsDeleted: (state, action) => {
      state.isMailAlternativeAssetsDeleted = action.payload;
    },
    setIsMailAssetsUpdated: (state, action) => {
      state.isMailAssetsUpdated = action.payload;
    },
    setMailAssetDetail: (state, action) => {
      state.mailAssetDetail = action.payload;
    },
  },
  extraReducers: {
    [getMailAssetsListData.pending]: state => {
      state.MailAssetLoading = true;
    },
    [getMailAssetsListData.rejected]: state => {
      state.MailAssetLoading = false;
      state.activeMailAssetList = [];
      state.inActiveMailAssetList = [];
    },
    [getMailAssetsListData.fulfilled]: (state, action) => {
      state.activeMailAssetList = getRightMailAssetData(action.payload.active);
      state.inActiveMailAssetList = getRightMailAssetData(
        action.payload.inactive,
      );
      state.MailAssetLoading = false;
    },
    [createMailAsset.pending]: state => {
      state.MailAssetLoading = true;
      state.isMailAssetsUpdated = false;
    },
    [createMailAsset.rejected]: state => {
      state.MailAssetLoading = false;
      state.isMailAssetsUpdated = false;
    },
    [createMailAsset.fulfilled]: (state, action) => {
      state.MailAssetLoading = false;
      state.isMailAssetsUpdated = true;
    },
    [getMailAssetsData.pending]: state => {
      state.MailAssetLoading = true;
      state.mailAssetDetail = {};
    },
    [getMailAssetsData.rejected]: state => {
      state.MailAssetLoading = false;
      state.mailAssetDetail = {};
    },
    [getMailAssetsData.fulfilled]: (state, action) => {
      state.MailAssetLoading = false;
      state.mailAssetDetail = action.payload;
    },
    [updateMailAsset.pending]: state => {
      state.isMailAssetsUpdated = false;
      state.MailAssetLoading = true;
    },
    [updateMailAsset.rejected]: state => {
      state.isMailAssetsUpdated = false;
      state.MailAssetLoading = false;
    },
    [updateMailAsset.fulfilled]: (state, action) => {
      state.isMailAssetsUpdated = true;
      state.MailAssetLoading = false;
    },
    [deleteMailAlternativeAsset.pending]: state => {
      state.isMailAlternativeAssetsDeleted = false;
      state.MailAssetLoading = true;
    },
    [deleteMailAlternativeAsset.rejected]: state => {
      state.isMailAlternativeAssetsDeleted = false;
      state.MailAssetLoading = false;
    },
    [deleteMailAlternativeAsset.fulfilled]: (state, action) => {
      state.isMailAlternativeAssetsDeleted = true;
      state.MailAssetLoading = false;
    },
  },
});
export const {
  setIsMailAssetsUpdated,
  setMailAssetDetail,
  setIsMailAlternativeAssetsDeleted,
} = mailAssetsSlice.actions;
export default mailAssetsSlice.reducer;
