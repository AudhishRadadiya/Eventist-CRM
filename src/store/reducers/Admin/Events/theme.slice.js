import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';
const initialState = {
  activeThemeList: [],
  inActiveThemeList: [],
  themeLoading: false,
  isThemeUpdated: false,
  themeDetail: {},
};

export const getThemeListData = createAsyncThunk(
  'admin/get-theme-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/theme/list')
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
export const getThemeData = createAsyncThunk(
  'admin/get-theme',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/theme/${_id}`)
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
export const createTheme = createAsyncThunk(
  'admin/create-theme',
  (theme, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/theme/create', theme)
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
export const updateTheme = createAsyncThunk(
  'admin/update-theme',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, theme } = props;
      axios
        .put(`admin/theme/update/${_id}`, theme)
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

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeLoading: (state, action) => {
      state.themeLoading = action.payload;
    },
    setIsThemeUpdated: (state, action) => {
      state.isThemeUpdated = action.payload;
    },
    setThemeDetail: (state, action) => {
      state.themeDetail = action.payload;
    },
  },
  extraReducers: {
    [getThemeListData.pending]: state => {
      state.themeLoading = true;
    },
    [getThemeListData.rejected]: state => {
      state.activeThemeList = [];
      state.inActiveThemeList = [];
      state.themeLoading = false;
    },
    [getThemeListData.fulfilled]: (state, action) => {
      state.activeThemeList = action.payload.active || [];
      state.inActiveThemeList = action.payload.inactive || [];
      state.themeLoading = false;
    },
    [getThemeData.pending]: state => {
      state.themeLoading = true;
      state.themeDetail = {};
    },
    [getThemeData.rejected]: state => {
      state.themeLoading = false;
      state.themeDetail = {};
    },
    [getThemeData.fulfilled]: (state, action) => {
      state.themeLoading = false;
      state.themeDetail = action.payload;
    },
    [createTheme.pending]: state => {
      state.isThemeUpdated = false;
      state.themeLoading = true;
    },
    [createTheme.rejected]: state => {
      state.isThemeUpdated = false;
      state.themeLoading = false;
    },
    [createTheme.fulfilled]: (state, action) => {
      state.isThemeUpdated = true;
      state.themeLoading = false;
    },
    [updateTheme.pending]: state => {
      state.isThemeUpdated = false;
      state.themeLoading = true;
    },
    [updateTheme.rejected]: state => {
      state.isThemeUpdated = false;
      state.themeLoading = false;
    },
    [updateTheme.fulfilled]: (state, action) => {
      state.isThemeUpdated = true;
      state.themeLoading = false;
    },
  },
});

export const { setThemeLoading, setIsThemeUpdated, setThemeDetail } =
  themeSlice.actions;

export default themeSlice.reducer;
