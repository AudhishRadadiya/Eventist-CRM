import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';
const initialState = {
  activePagesList: [],
  inActivePagesList: [],
  pagesLoading: false,
  isPagesUpdated: false,
  pagesDetail: {},
};

export const getPagesListData = createAsyncThunk(
  'admin/get-pages-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/pages/list')
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
export const getPagesData = createAsyncThunk(
  'admin/get-pages',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/pages/${_id}`)
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
export const createPages = createAsyncThunk(
  'admin/create-pages',
  (pages, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/pages/create', pages)
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
export const updatePages = createAsyncThunk(
  'admin/update-theme',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, pages } = props;
      axios
        .put(`admin/pages/update/${_id}`, pages)
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

export const pagesSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPagesLoading: (state, action) => {
      state.pagesLoading = action.payload;
    },
    setIsPagesUpdated: (state, action) => {
      state.isPagesUpdated = action.payload;
    },
    setPagesDetail: (state, action) => {
      state.pagesDetail = action.payload;
    },
  },
  extraReducers: {
    [getPagesListData.pending]: state => {
      state.pagesLoading = true;
    },
    [getPagesListData.rejected]: state => {
      state.activePagesList = [];
      state.inActivePagesList = [];
      state.pagesLoading = false;
    },
    [getPagesListData.fulfilled]: (state, action) => {
      state.activePagesList = action.payload.active || [];
      state.inActivePagesList = action.payload.inactive || [];
      state.pagesLoading = false;
    },
    [getPagesData.pending]: state => {
      state.pagesLoading = true;
      state.pagesDetail = {};
    },
    [getPagesData.rejected]: state => {
      state.pagesLoading = false;
      state.pagesDetail = {};
    },
    [getPagesData.fulfilled]: (state, action) => {
      state.pagesLoading = false;
      state.pagesDetail = action.payload;
    },
    [createPages.pending]: state => {
      state.isPagesUpdated = false;
      state.pagesLoading = true;
    },
    [createPages.rejected]: state => {
      state.isPagesUpdated = false;
      state.pagesLoading = false;
    },
    [createPages.fulfilled]: (state, action) => {
      state.isPagesUpdated = true;
      state.pagesLoading = false;
    },
    [updatePages.pending]: state => {
      state.isPagesUpdated = false;
      state.pagesLoading = true;
    },
    [updatePages.rejected]: state => {
      state.isPagesUpdated = false;
      state.pagesLoading = false;
    },
    [updatePages.fulfilled]: (state, action) => {
      state.isPagesUpdated = true;
      state.pagesLoading = false;
    },
  },
});

export const { setPagesLoading, setIsPagesUpdated, setPagesDetail } =
  pagesSlice.actions;

export default pagesSlice.reducer;
