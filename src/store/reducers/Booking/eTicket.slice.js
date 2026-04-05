import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';

const initialState = {
  eTicketLoading: false,
  iseTicketUpdated: false,
  cateringPackageList: [],
  numberETciketData: {},
  eTciketWithGuestData: {},
};

export const getCateringPackageListData = createAsyncThunk(
  'admin/get-catering-package-list',
  (booking_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/e-ticket/catering_packages/${booking_id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
              resolve(res.data.data);
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
export const createETicket = createAsyncThunk(
  'admin/create-eticket',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/e-ticket/create`, props)
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

export const previewETicketPDF = createAsyncThunk(
  'admin/preview-eticket-pdf',
  async (props, { dispatch }) => {
    const { bookingId, data } = props;
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/e-ticket/preview/${bookingId}`, data)
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
    // try {
    //   const result = await axios.post(
    //     `admin/e-ticket/preview/${bookingId}`,
    //     data,
    //     {
    //       responseType: 'arraybuffer',
    //       headers: {
    //         Accept: 'application/pdf',
    //       },
    //     },
    //   );
    //   const blob = new Blob([result.data], { type: 'application/pdf' });
    //   const pdf_url = URL.createObjectURL(blob);
    //   return pdf_url;
    // } catch (error) {
    //   // const errorMessage = error.response?.data?.msg || 'Error fetching PDF';
    //   dispatch(showMessage({ message: error.response?.data?.msg }));
    //   throw error;
    // }
  },
);

export const eTicketSlice = createSlice({
  name: 'eTicket',
  initialState,
  reducers: {
    setIsTicketUpdated: (state, action) => {
      state.iseTicketUpdated = action.payload;
    },
    setNumberETciketData: (state, action) => {
      state.numberETciketData = {};
    },
  },
  extraReducers: {
    [getCateringPackageListData.pending]: state => {
      state.eTicketLoading = true;
    },
    [getCateringPackageListData.rejected]: state => {
      state.cateringPackageList = [];
      state.eTicketLoading = false;
    },
    [getCateringPackageListData.fulfilled]: (state, action) => {
      state.cateringPackageList = action.payload || [];
      state.eTicketLoading = false;
    },
    [createETicket.pending]: state => {
      state.iseTicketUpdated = false;
      state.eTicketLoading = true;
    },
    [createETicket.rejected]: state => {
      state.iseTicketUpdated = false;
      state.eTicketLoading = false;
    },
    [createETicket.fulfilled]: state => {
      state.iseTicketUpdated = true;
      state.eTicketLoading = false;
    },
    [previewETicketPDF.pending]: state => {
      state.eTicketLoading = true;
    },
    [previewETicketPDF.rejected]: state => {
      state.numberETciketData = {};
      state.eTicketLoading = false;
    },
    [previewETicketPDF.fulfilled]: (state, action) => {
      const { data } = action.meta.arg;
      const pdf_url = action.payload.data.eticket_link;
      if (data.type === 0) {
        state.numberETciketData = {
          ...state.numberETciketData,
          numberData: { type: 0, pdf_url },
        };
      } else if (data.type === 1) {
        state.numberETciketData = {
          ...state.numberETciketData,
          guestData: { type: 1, pdf_url },
        };
      }

      state.eTicketLoading = false;
    },
  },
});

export const { setIsTicketUpdated, setNumberETciketData } =
  eTicketSlice.actions;

export default eTicketSlice.reducer;
