import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Loader from 'Components/Common/Loader';
import { getProductsReport } from 'store/reducers/Report/salesReport.slice';

export default function ProductsOrderSummaryTable({
  isLocalStorageGetData,
  salesProductReportData,
}) {
  const { salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const storedData = JSON.parse(localStorage.getItem('stateData'));
  const getProductData = useCallback(async () => {
    if (storedData && Object?.keys(storedData)?.length > 0) {
      const { payload } = await dispatch(
        getProductsReport({
          select_year: storedData?.select_year,
          product_ids: storedData?.product_ids,
          report_type: storedData?.report_type,
          event_id:
            storedData?.event_id === 'Select' ? '' : storedData.event_id,
          split_totals_by_venue: storedData?.split_totals_by_venue,
          start_date: moment(new Date(storedData?.start_date)).format(
            'YYYY-MM-DD',
          ),
          end_date: moment(new Date(storedData?.end_date)).format('YYYY-MM-DD'),
          // select_year: Number(storedData?.select_year),
          // product_ids: storedData?.product_ids,
          // report_type: storedData?.report_type,
          // event_id: storedData?.event_id,
          // split_totals_by_venue: storedData?.split_totals_by_venue,
          // start_date: storedData?.start_date,
          // end_date: storedData?.end_date,
        }),
      );
      if (payload?.product_order?.length > 0 || payload?.result?.length > 0) {
        setData(payload);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLocalStorageGetData) {
      setData(salesProductReportData);
    } else {
      getProductData();
    }
  }, [isLocalStorageGetData, getProductData, salesProductReportData]);
  return (
    <>
      {salesContactSourcesLoading && <Loader />}
      {data?.product_order?.length > 0 && (
        <>
          <h4 className="fw_600">
            {`Products Report from :- ${moment(storedData?.start_date).format(
              'DD/MM/YYYY',
            )}   To  ${moment(storedData?.end_date).format('DD/MM/YYYY')}`}
          </h4>
          <h4 className="fw_600">At: all</h4>

          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Booking</TableCell>
                    <TableCell>Venue</TableCell>
                    <TableCell>Event Date</TableCell>
                    <TableCell>Company/Contact Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Bin#</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.product_order?.length > 0 &&
                    data?.product_order?.map((elem, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{elem?.booking_ref}</TableCell>
                          <TableCell>{elem?.event_name}</TableCell>
                          <TableCell>
                            {elem?.event_date
                              ? moment(elem?.event_date).format('DD/MM/YYYY')
                              : ''}
                          </TableCell>
                          <TableCell>{elem?.contact}</TableCell>
                          <TableCell>{elem?.quantity}</TableCell>
                          <TableCell>{elem?.product}</TableCell>
                          <TableCell>{elem?.bin_id}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
      {data?.result?.length > 0 && (
        <>
          <h4 className="fw_600">Total</h4>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Venue</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Bin#</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.result?.length > 0 &&
                    data?.result?.map((elem, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{elem?.event_name}</TableCell>
                          <TableCell>{elem?.quantity}</TableCell>
                          <TableCell>{elem?.product}</TableCell>
                          <TableCell>{elem?.bin_id}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
      {data?.product_order?.length === 0 &&
        data?.result?.length === 0 &&
        'There are no tracking items for the timeframe specified'}
    </>
  );
}
