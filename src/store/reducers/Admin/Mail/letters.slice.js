import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';
const initialState = {
  activeLetterList: [],
  inActiveLetterList: [],
  letterLoading: false,
  isLetterUpdated: false,
  letterDetail: {},
};

export const getLettersListData = createAsyncThunk(
  'admin/letter/get-letter-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/letter/list')
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

export const createLetterAsset = createAsyncThunk(
  'admin/create-lette',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/letter/create', data)
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

export const getLettersData = createAsyncThunk(
  'admin/get-single-letter',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/letter/${_id}`)
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

export const updateLetter = createAsyncThunk(
  'admin/letter/update',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, letter } = props;
      axios
        .put(`admin/letter/update/${_id}`, letter)
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

export const letterSlice = createSlice({
  name: 'letter',
  initialState,
  reducers: {
    setIsLetterUpdated: (state, action) => {
      state.isLetterUpdated = action.payload;
    },
    setLetterDetail: (state, action) => {
      state.letterDetail = action.payload;
    },
  },
  extraReducers: {
    [getLettersListData.pending]: state => {
      state.letterLoading = true;
    },
    [getLettersListData.rejected]: state => {
      state.letterLoading = false;
      state.activeLetterList = [];
      state.inActiveLetterList = [];
    },
    [getLettersListData.fulfilled]: (state, action) => {
      state.letterLoading = false;
      state.activeLetterList = action.payload.active || [];
      state.inActiveLetterList = action.payload.inactive || [];
    },
    [createLetterAsset.pending]: state => {
      state.letterLoading = true;
      state.isLetterUpdated = false;
    },
    [createLetterAsset.rejected]: state => {
      state.letterLoading = false;
      state.isLetterUpdated = false;
    },
    [createLetterAsset.fulfilled]: (state, action) => {
      state.letterLoading = false;
      state.isLetterUpdated = true;
    },
    [updateLetter.pending]: state => {
      state.isLetterUpdated = false;
      state.letterLoading = true;
    },
    [updateLetter.rejected]: state => {
      state.isLetterUpdated = false;
      state.letterLoading = false;
    },
    [updateLetter.fulfilled]: (state, action) => {
      state.isLetterUpdated = true;
      state.letterLoading = false;
    },
    [getLettersData.pending]: state => {
      state.letterLoading = true;
      state.letterDetail = {};
    },
    [getLettersData.rejected]: state => {
      state.letterLoading = false;
      state.letterDetail = {};
    },
    [getLettersData.fulfilled]: (state, action) => {
      state.letterLoading = false;
      state.letterDetail = action.payload;
    },
  },
});
export const { setIsLetterUpdated, setLetterDetail } = letterSlice.actions;
export default letterSlice.reducer;
