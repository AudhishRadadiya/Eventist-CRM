import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from '../common.slice';

const initialState = {
  salesContactSourcesLoading: false,
  isDietaryRequirementUpdated: false,
  salesContactSourcesList: [],
  salesMonthlyRevenueList: [],
  salesComparisonTotalsReport: [],
  salesComparisonTypeReport: [],
  salesComparisonDetailReport: [],
  salesProductReport: [],
  salesTotalBookingsByUser: [],
  drinksOrderList: [],
  salesWeekNumberList: [],
  salesTicketRevenueReport: [],
  salesKpiReport: [],
  salesTotalBookingsByUserLoading: false,
};

export const getSalesContactSources = createAsyncThunk(
  'admin/get-sales-contact-sources-list',
  (props, { dispatch }) => {
    let {
      cancelled_booking,
      contact_sources,
      event_id,
      show_type,
      start_date,
      end_date,
    } = props;
    let payload = {
      event_id: event_id === 'all' ? '' : event_id,
      cancelled_booking: cancelled_booking,
      contact_sources: contact_sources === 'all' ? '' : contact_sources,
      show_type: show_type,
      start_date: start_date,
      end_date: end_date,
    };
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/contact_sources', payload)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getMonthlyRevenue = createAsyncThunk(
  'admin/get-monthly-revenue',
  (props, { dispatch }) => {
    let { event_id, years, months } = props;
    let payload = {
      event_id: event_id === 'all' ? '' : event_id,
      years: years,
      months: months,
    };
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/monthly_revenue', payload)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getEventNumbersComparisonTotals = createAsyncThunk(
  'admin/get-event-numbers-comparison-totals',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/event_comparison_total', props)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getComparisonTypeReport = createAsyncThunk(
  'admin/get-comparison-type-report',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/comparison_booking_type', props)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getComparisonDetailReport = createAsyncThunk(
  'admin/get-comparison-detail-report',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/event_comparison', props)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getTicketRevenueReport = createAsyncThunk(
  'admin/get-ticket-revenue-report',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/ticket_revenue', props)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getTotalBookingsByUser = createAsyncThunk(
  'admin/get-total-booking-by-user',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/total_booking_by_user', props)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
              let data = res.data.data;
              let updatedList = data?.map(d => {
                return {
                  ...d,
                  Places_falloff:
                    d?.Provisional_places &&
                    d?.enquired_places &&
                    d?.confirmed_places
                      ? (d?.enquired_places -
                          (d?.Provisional_places + d?.confirmed_places)) *
                        -1
                      : 0,
                };
              });
              resolve(updatedList);
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

export const getProductsReport = createAsyncThunk(
  'admin/get-product-report',
  (productData, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/product_order', productData)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getSalesWeekNumbers = createAsyncThunk(
  'admin/get-sales-week-numbers',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/week_numbers', props)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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

export const getKpiReport = createAsyncThunk(
  'admin/report/kpi-report',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/report/kpi-report', props)
        .then(res => {
          if (res.data.err === 0) {
            if (res.data.data) {
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
export const salesReportSlice = createSlice({
  name: 'salesReport',
  initialState,
  reducers: {},
  extraReducers: {
    [getSalesContactSources.pending]: state => {
      state.salesContactSourcesLoading = true;
    },
    [getSalesContactSources.rejected]: state => {
      state.salesContactSourcesList = [];
      state.salesContactSourcesLoading = false;
    },
    [getSalesContactSources.fulfilled]: (state, action) => {
      state.salesContactSourcesList = action.payload;
      state.salesContactSourcesLoading = false;
    },
    [getMonthlyRevenue.pending]: state => {
      state.salesContactSourcesLoading = true;
    },
    [getMonthlyRevenue.rejected]: state => {
      state.salesMonthlyRevenueList = [];
      state.salesContactSourcesLoading = false;
    },
    [getMonthlyRevenue.fulfilled]: (state, action) => {
      state.salesMonthlyRevenueList = action.payload;
      state.salesContactSourcesLoading = false;
    },
    [getEventNumbersComparisonTotals.pending]: state => {
      state.salesContactSourcesLoading = true;
    },
    [getEventNumbersComparisonTotals.rejected]: state => {
      state.salesComparisonTotalsReport = [];
      state.salesContactSourcesLoading = false;
    },
    [getEventNumbersComparisonTotals.fulfilled]: (state, action) => {
      state.salesComparisonTotalsReport = action.payload;
      state.salesContactSourcesLoading = false;
    },
    [getComparisonTypeReport.pending]: state => {
      state.salesContactSourcesLoading = true;
    },
    [getComparisonTypeReport.rejected]: state => {
      state.salesComparisonTypeReport = [];
      state.salesContactSourcesLoading = false;
    },
    [getComparisonTypeReport.fulfilled]: (state, action) => {
      state.salesComparisonTypeReport = action.payload;
      state.salesContactSourcesLoading = false;
    },
    [getComparisonDetailReport.pending]: state => {
      state.salesContactSourcesLoading = true;
    },
    [getComparisonDetailReport.rejected]: state => {
      state.salesComparisonDetailReport = [];
      state.salesContactSourcesLoading = false;
    },
    [getComparisonDetailReport.fulfilled]: (state, action) => {
      state.salesComparisonDetailReport = action.payload;
      state.salesContactSourcesLoading = false;
    },
    [getTicketRevenueReport.pending]: state => {
      state.salesContactSourcesLoading = true;
    },
    [getTicketRevenueReport.rejected]: state => {
      state.salesTicketRevenueReport = [];
      state.salesContactSourcesLoading = false;
    },
    [getTicketRevenueReport.fulfilled]: (state, action) => {
      state.salesTicketRevenueReport = action.payload;
      state.salesContactSourcesLoading = false;
    },
    [getTotalBookingsByUser.pending]: state => {
      state.salesTotalBookingsByUserLoading = true;
    },
    [getTotalBookingsByUser.rejected]: state => {
      state.salesTotalBookingsByUser = [];
      state.salesTotalBookingsByUserLoading = false;
    },
    [getTotalBookingsByUser.fulfilled]: (state, action) => {
      state.salesTotalBookingsByUser = action.payload;
      state.salesTotalBookingsByUserLoading = false;
    },
    [getProductsReport.pending]: state => {
      state.salesContactSourcesLoading = true;
    },
    [getProductsReport.rejected]: state => {
      state.salesProductReport = [];
      state.salesContactSourcesLoading = false;
    },
    [getProductsReport.fulfilled]: (state, action) => {
      state.salesProductReport = action.payload;
      state.salesContactSourcesLoading = false;
    },
    [getSalesWeekNumbers.pending]: state => {
      state.salesContactSourcesLoading = true;
    },
    [getSalesWeekNumbers.rejected]: state => {
      state.salesWeekNumberList = [];
      state.salesContactSourcesLoading = false;
    },
    [getSalesWeekNumbers.fulfilled]: (state, action) => {
      state.salesWeekNumberList = action.payload;
      state.salesContactSourcesLoading = false;
    },

    [getKpiReport.pending]: state => {
      state.salesContactSourcesLoading = true;
    },
    [getKpiReport.rejected]: state => {
      state.salesKpiReport = [];
      state.salesContactSourcesLoading = false;
    },
    [getKpiReport.fulfilled]: (state, action) => {
      state.salesKpiReport = action.payload;
      state.salesContactSourcesLoading = false;
    },
  },
});

export default salesReportSlice.reducer;
