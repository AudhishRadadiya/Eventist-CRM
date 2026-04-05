import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import {
  getDrinksOrder,
  getEventDate,
} from 'store/reducers/Report/opsReport.slice';
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
import { zeroRoundTo } from 'utils/common';

export default function DrinkReportTable({ eventName, reportData }) {
  const dispatch = useDispatch();

  const { drinksOrderList, opsReportLoading, eventDateList } = useSelector(
    ({ opsReport }) => opsReport,
  );

  const { eventDetail } = useSelector(({ parties }) => parties);

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(reportParamData).length > 0) {
        dispatch(
          getDrinksOrder({
            event_id: reportParamData?.event_id,
            event_date:
              reportParamData.event_date === 'All'
                ? ''
                : reportParamData?.event_date === 'future'
                ? 'future'
                : reportParamData.event_date,
          }),
        );
        dispatch(getEventData(reportParamData?.event_id));
        dispatch(getEventDate(reportParamData?.event_id));
      }
  }, []);

  const getDateDescription = data => {
    const eventDate = data?.event_date;
    const eventDateShow = eventDateList?.filter(item => item._id === eventDate);

    return eventDate === 'All'
      ? 'All Nights'
      : eventDate === 'future'
      ? 'All Future Nights'
      : moment(eventDateShow[0]?.date).format('DD/MM/YYYY');
  };

  return (
    <>
      {opsReportLoading && <Loader />}
      {drinksOrderList?.drinks?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Drink Order summary for :{' '}
            {getDateDescription(reportData ? reportData : reportParamData)}
          </h4>
          <h4 className="fw_600">
            At :{' '}
            {reportParamData?.event_id
              ? eventDetail?.internal_name
                ? eventDetail?.internal_name
                : eventName[0]?.internal_name ?? ''
              : eventName[0]?.internal_name}
          </h4>

          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Booking</TableCell>
                    <TableCell>Party Date</TableCell>
                    <TableCell>Company/Contact Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Bin#</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drinksOrderList?.drinks?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Link
                          to={`/edit-bookings/${item?._id}`}
                          state={{
                            reportName: 'Drinks Order Summary Report',
                          }}
                        >
                          {item?.booking}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {moment(item?.party_date).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>{item?.Company_ContactName}</TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell>{item?.product_name}</TableCell>
                      <TableCell>{item?.bin_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <h4 className="fw_600">Totals</h4>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Type</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Total Quantity</TableCell>
                    <TableCell>Total Cost</TableCell>
                    <TableCell>Bin#</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drinksOrderList?.total?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item?.product_type}</TableCell>
                      <TableCell>{item?.product_name}</TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell>
                        {item?.total_cost
                          ? '£ ' + zeroRoundTo(item?.total_cost)
                          : ''}
                      </TableCell>
                      <TableCell>{item?.bin_id}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {drinksOrderList?.total_pricetotal_price
                        ? '£ ' + zeroRoundTo(drinksOrderList?.total_price)
                        : ''}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        'There are no drinks or products ordered for the timeframe specified'
      )}
    </>
  );
}
