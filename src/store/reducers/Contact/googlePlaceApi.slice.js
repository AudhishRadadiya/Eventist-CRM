import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../common.slice';
import axios from 'axios';

const initialState = {
  googlePlaceLoading: false,
  isGooglePlaceUpdated: false,
  googlePlaceDetail: [],
};

export const getGooglePlaceListData = createAsyncThunk(
  'admin-google-place-list-data',
  (props, { dispatch }) => {
    const { postcode } = props;
    // const apiKey = 'AIzaSyCcsYYHq6kCYGzx8BlUp0gR12iwSN9xQeM';

    return new Promise((resolve, reject) => {
      axios
        // .get(
        //   `https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses?query=ideal-postcodes${postcode}&api_key=ak_kt304pjqwaZO2yEoV4xTZzQ2Bdgoy&bias_ip=true&context=GBR&primary_loc=0&async=1`,
        // )
        .get(
          // `https://api.ideal-postcodes.co.uk/v1/postcodes/${postcode}?api_key=ak_kt304pjqwaZO2yEoV4xTZzQ2Bdgoy`,
          `https://api.ideal-postcodes.co.uk/v1/postcodes/${postcode}?api_key=ak_hqf49ie1uLyFmjTG2VOvBi3T2zrI5`,
        )
        .then(res => {
          if (res.data.message === 'Success') {
            if (Object.entries(res?.data?.result).length > 0) {
              resolve(res?.data?.result);
            } else {
              resolve([]);
            }
          } else {
            if (postcode === '') {
              dispatch(
                showMessage({ message: 'Please enter postcode for lookup' }),
              );
            }
            reject();
          }
        })
        .catch(error => {
          if (postcode === '') {
            dispatch(
              showMessage({ message: 'Please enter postcode for lookup' }),
            );
          }
          reject(error);
        });
    });
  },
);

export const googlePlaceSlice = createSlice({
  name: 'googlePlace',
  initialState,
  reducers: {
    setIsGooglePlaceUpdated: (state, action) => {
      state.isGooglePlaceUpdated = action.payload;
    },
    setGooglePlaceDetail: (state, action) => {
      state.googlePlaceDetail = action.payload;
    },
  },
  extraReducers: {
    [getGooglePlaceListData.pending]: state => {
      state.googlePlaceLoading = true;
    },
    [getGooglePlaceListData.rejected]: state => {
      state.googlePlaceLoading = false;
      state.googlePlaceDetail = [];
    },
    [getGooglePlaceListData.fulfilled]: (state, action) => {
      state.googlePlaceLoading = false;
      state.googlePlaceDetail = action.payload;
    },
  },
});
export const { setIsGooglePlaceUpdated, setGooglePlaceDetail } =
  googlePlaceSlice.actions;
export default googlePlaceSlice.reducer;
