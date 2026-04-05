import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';
const initialState = {
  activeVenueList: [],
  inActiveVenueList: [],
  venueLoading: false,
  isVenueUpdated: false,
  venueDetail: {},
  venueAddress: {},
};

export const getVenueListData = createAsyncThunk(
  'admin/get-venue-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/venue/list')
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
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);
export const getVenueData = createAsyncThunk(
  'admin/get-venue',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/venue/${_id}`)
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

export const createVenue = createAsyncThunk(
  'admin/create-venue',
  (venue, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/venue/create', venue)
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

export const updateVenue = createAsyncThunk(
  'admin/update-venue',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, venue } = props;
      axios
        .put(`admin/venue/update/${_id}`, venue)
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

export const searchVenueAddress = createAsyncThunk(
  'admin/search-venue',
  (address, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/venue/lookup_address', address)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
              resolve(res.data.data);
            } else {
              resolve({});
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

export const venueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {
    setVenueLoading: (state, action) => {
      state.venueLoading = action.payload;
    },
    setIsVenueUpdated: (state, action) => {
      state.isVenueUpdated = action.payload;
    },
    setVenueDetail: (state, action) => {
      state.venueDetail = action.payload;
    },
    setVenueAddress: (state, action) => {
      state.venueAddress = action.payload;
    },
  },
  extraReducers: {
    [getVenueListData.pending]: state => {
      state.venueLoading = true;
    },
    [getVenueListData.rejected]: state => {
      state.activeVenueList = [];
      state.inActiveVenueList = [];
      state.venueLoading = false;
    },
    [getVenueListData.fulfilled]: (state, action) => {
      state.activeVenueList = action.payload.active || [];
      state.inActiveVenueList = action.payload.inactive || [];
      state.venueLoading = false;
    },
    [getVenueData.pending]: state => {
      state.venueLoading = true;
      state.venueDetail = {};
    },
    [getVenueData.rejected]: state => {
      state.venueLoading = false;
      state.venueDetail = {};
    },
    [getVenueData.fulfilled]: (state, action) => {
      state.venueLoading = false;
      state.venueDetail = action.payload;
    },
    [createVenue.pending]: state => {
      state.isVenueUpdated = false;
      state.venueLoading = true;
    },
    [createVenue.rejected]: state => {
      state.isVenueUpdated = false;
      state.venueLoading = false;
    },
    [createVenue.fulfilled]: (state, action) => {
      state.isVenueUpdated = true;
      state.venueLoading = false;
    },
    [updateVenue.pending]: state => {
      state.isVenueUpdated = false;
      state.venueLoading = true;
    },
    [updateVenue.rejected]: state => {
      state.isVenueUpdated = false;
      state.venueLoading = false;
    },
    [updateVenue.fulfilled]: (state, action) => {
      state.isVenueUpdated = true;
      state.venueLoading = false;
    },
    [searchVenueAddress.pending]: state => {
      state.venueLoading = true;
      state.venueAddress = {};
    },
    [searchVenueAddress.rejected]: state => {
      state.venueLoading = false;
      state.venueAddress = {};
    },
    [searchVenueAddress.fulfilled]: (state, action) => {
      state.venueLoading = false;
      state.venueAddress = action.payload;
    },
  },
});

export const {
  setVenueLoading,
  setIsVenueUpdated,
  setVenueDetail,
  setVenueAddress,
} = venueSlice.actions;

export default venueSlice.reducer;
