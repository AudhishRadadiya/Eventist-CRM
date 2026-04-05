import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getDailyOnlinePaymentReportList } from 'store/reducers/Report/accountReport.slice';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import DataNotFound from 'Components/Common/DataNotFound';
import { zeroRoundTo } from 'utils/common';

export default function OnlinePaymentReportTable() {
  const dispatch = useDispatch();

  const { dailyOnlinePaymentReportList, accountReportLoading } = useSelector(
    ({ accountReport }) => accountReport,
  );

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(reportParamData).length > 0)
        dispatch(
          getDailyOnlinePaymentReportList({
            date: moment(new Date(reportParamData.date)).format('YYYY-MM-DD'),
          }),
        );
  }, []);

  return (
    <>
      {accountReportLoading && <Loader />}
      {dailyOnlinePaymentReportList?.paymentData?.length > 0 ? (
        <div className="table_main_Wrapper mb-3">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>PID</TableCell>
                  <TableCell>Booking Ref</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Company/Contact Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Online Payment (Combined)</TableCell>
                  {/* <TableCell>Stripe</TableCell> */}
                  {/* response start --- methodsName map internal_name */}
                  {dailyOnlinePaymentReportList?.methodsName?.map(
                    headerItem => {
                      return (
                        <>
                          <TableCell>{headerItem?.internal_name}</TableCell>
                        </>
                      );
                    },
                  )}
                  {/* response end */}

                  <TableCell>Notes</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dailyOnlinePaymentReportList?.paymentData?.length > 0 &&
                  dailyOnlinePaymentReportList?.paymentData?.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{item?.pid}</TableCell>
                        <TableCell>
                          <Link
                            to={`/edit-bookings/${item?.booking_id}`}
                            state={{
                              reportName: 'Online Payment Totals Report',
                            }}
                          >
                            {item?.booking_ref}
                          </Link>
                        </TableCell>
                        <TableCell>{item?.event_name}</TableCell>
                        <TableCell>{item?.name}</TableCell>
                        <TableCell>{item?.company_name}</TableCell>
                        <TableCell>{item?.type}</TableCell>
                        <TableCell>
                          {zeroRoundTo(item?.online_payment)}
                        </TableCell>
                        {dailyOnlinePaymentReportList?.methodsName?.map(
                          method => {
                            return (
                              <TableCell key={method._id}>
                                {item[method.internal_name]?.toFixed(2)}
                              </TableCell>
                            );
                          },
                        )}
                        <TableCell>{item?.notes}</TableCell>
                        <TableCell>
                          {moment(item?.time).format('DD/MM/YYYY')}
                          <span className="d-flex">
                            {moment(item?.time).format('h:mm:ss')}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {zeroRoundTo(
                      dailyOnlinePaymentReportList?.methodTotals?.totalPayment,
                    )}
                  </TableCell>
                  {dailyOnlinePaymentReportList?.methodsName?.map(method => {
                    return (
                      <TableCell key={method._id}>
                        {dailyOnlinePaymentReportList?.methodTotals[
                          method.internal_name
                        ]?.toFixed(2)}
                      </TableCell>
                    );
                  })}
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        'There are no online payment for the timeframe specified'
      )}
    </>
  );
}
