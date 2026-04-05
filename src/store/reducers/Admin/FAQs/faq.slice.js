import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';
const initialState = {
  activeFaqList: [],
  inActiveFaqList: [],
  faqLoading: false,
  isFaqUpdated: false,
  faqDetail: {},
};

export const getFaqListData = createAsyncThunk(
  'admin/faq/get-faq-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/FAQ/list')
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const createFaq = createAsyncThunk(
  'admin/create-faq',
  (faq, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/FAQ/create', faq)
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

export const getFaqData = createAsyncThunk(
  'admin/get-faq',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/FAQ/${_id}`)
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

export const updateFaq = createAsyncThunk(
  'admin/faq/update',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, faq } = props;
      axios
        .put(`admin/FAQ/update/${_id}`, faq)
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

export const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    setIsFaqUpdated: (state, action) => {
      state.isFaqUpdated = action.payload;
    },
    setFaqDetail: (state, action) => {
      state.faqDetail = action.payload;
    },
  },
  extraReducers: {
    [getFaqListData.pending]: state => {
      state.faqLoading = true;
    },
    [getFaqListData.rejected]: state => {
      state.faqLoading = false;
      state.activeFaqList = [];
      state.inActiveFaqList = [];
    },
    [getFaqListData.fulfilled]: (state, action) => {
      state.faqLoading = false;
      state.activeFaqList = action.payload.active || [];
      state.inActiveFaqList = action.payload.inactive || [];
    },
    [createFaq.pending]: state => {
      state.faqLoading = true;
      state.isFaqUpdated = false;
    },
    [createFaq.rejected]: state => {
      state.faqLoading = false;
      state.isFaqUpdated = false;
    },
    [createFaq.fulfilled]: (state, action) => {
      state.faqLoading = false;
      state.isFaqUpdated = true;
    },
    [updateFaq.pending]: state => {
      state.isFaqUpdated = false;
      state.faqLoading = true;
    },
    [updateFaq.rejected]: state => {
      state.isFaqUpdated = false;
      state.faqLoading = false;
    },
    [updateFaq.fulfilled]: (state, action) => {
      state.isFaqUpdated = true;
      state.faqLoading = false;
    },
    [getFaqData.pending]: state => {
      state.faqLoading = true;
      state.faqDetail = {};
    },
    [getFaqData.rejected]: state => {
      state.faqLoading = false;
      state.faqDetail = {};
    },
    [getFaqData.fulfilled]: (state, action) => {
      state.faqLoading = false;
      state.faqDetail = action.payload;
    },
  },
});
export const { setIsFaqUpdated, setFaqDetail } = faqSlice.actions;
export default faqSlice.reducer;
