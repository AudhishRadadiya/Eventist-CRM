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
import { getDailyPaymentReportList } from 'store/reducers/Report/accountReport.slice';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import { getEventData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { zeroRoundTo } from 'utils/common';

export default function PaymentReportTable({ eventName, reportData }) {
  const dispatch = useDispatch();
  const { accountReportLoading, dailyPaymentReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(reportParamData).length > 0) {
        dispatch(
          getDailyPaymentReportList({
            event_id:
              reportParamData.event_id === 'All'
                ? ''
                : reportParamData.event_id,
            date: moment(new Date(reportParamData?.date)).format('YYYY-MM-DD'),
            year: reportParamData?.year,
          }),
        );
      }
  }, []);

  const { eventDetail } = useSelector(({ parties }) => parties);

  useEffect(() => {
    if (
      typeof reportParamData?.event_id === 'string' &&
      reportParamData?.event_id.length > 5
    ) {
      dispatch(getEventData(reportParamData?.event_id));
    }
  }, [reportParamData?.event_id]);

  return (
    <>
      {accountReportLoading && <Loader />}
      {dailyPaymentReportList?.paymentData?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Payments Received:{' '}
            {reportParamData?.date
              ? moment(reportParamData?.date).format('DD/MM/YYYY')
              : moment(new Date(reportData?.date)).format('DD/MM/YYYY')}
          </h4>
          <h4 className="fw_600">
            At :{' '}
            {eventName
              ? eventName
                ? eventName
                : 'All'
              : eventDetail?.internal_name ?? 'All'}
          </h4>
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
                    {dailyPaymentReportList?.methodsName?.map(headerItem => {
                      return (
                        <>
                          <TableCell>{headerItem?.internal_name}</TableCell>
                        </>
                      );
                    })}
                    <TableCell>Notes</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dailyPaymentReportList?.paymentData?.length > 0 &&
                    dailyPaymentReportList?.paymentData?.map((data, i) => {
                      return (
                        <TableRow>
                          <TableCell>{zeroRoundTo(data?.pid)}</TableCell>
                          <TableCell>
                            <Link
                              to={`/edit-bookings/${data?.booking_id}`}
                              state={{
                                reportName: 'Payments Report',
                              }}
                            >
                              {data?.booking_ref}
                            </Link>
                          </TableCell>
                          <TableCell>{data?.event_name}</TableCell>
                          <TableCell>{data?.name}</TableCell>
                          <TableCell>{data?.company_name}</TableCell>
                          <TableCell>{data?.type}</TableCell>
                          <TableCell>{data?.online_payment}</TableCell>
                          {dailyPaymentReportList?.methodsName?.map(method => {
                            return (
                              <TableCell key={method._id}>
                                {data[method.internal_name]}
                              </TableCell>
                            );
                          })}
                          <TableCell>{data?.notes}</TableCell>
                          <TableCell>
                            {moment(data?.created_at).format('DD/MM/YYYY')}
                            <span className="d-flex">
                              {moment(data?.created_at).format(' h:mm:ss')}
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
                        dailyPaymentReportList?.methodTotals?.totalPayment,
                      )}
                    </TableCell>
                    {dailyPaymentReportList?.methodsName?.map(method => {
                      return (
                        <TableCell key={method._id}>
                          {
                            dailyPaymentReportList?.methodTotals[
                              method.internal_name
                            ]
                          }
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
        </>
      ) : (
        'There are no payment for the timeframe specified'
      )}
    </>
  );
}
