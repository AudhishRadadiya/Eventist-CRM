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
import { getDailyInvoiceReportList } from 'store/reducers/Report/accountReport.slice';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import { zeroRoundTo } from 'utils/common';

export default function InvoiceReportTable({ date }) {
  const { accountReportLoading, dailyInvoiceReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  let paymentData = Object.fromEntries([...searchParams]);
  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(paymentData).length > 0) {
        dispatch(
          getDailyInvoiceReportList({
            event_id:
              paymentData.event_id === 'All' ? '' : paymentData.event_id,
            start_date: moment(new Date(paymentData?.start_date)).format(
              'YYYY-MM-DD',
            ),
            end_date: moment(new Date(paymentData?.end_date)).format(
              'YYYY-MM-DD',
            ),
          }),
        );
      }
  }, [dispatch]);

  return (
    <>
      {accountReportLoading && <Loader />}
      {dailyInvoiceReportList?.length > 0 ? (
        <>
          {dailyInvoiceReportList?.length > 0 &&
            dailyInvoiceReportList?.map((data, i) => {
              return (
                <div className="table_main_Wrapper mb-3">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Event Date</TableCell>
                          <TableCell>Invoice #</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Scope</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Company/Contact Name</TableCell>
                          <TableCell>Cancellation Charge</TableCell>
                          <TableCell>Retained Depts</TableCell>
                          <TableCell>Balance</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {moment(new Date(date)).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell
                            className={
                              data?.total_cancellation < 0 ? 'text-danger' : ''
                            }
                          >
                            {data?.total_cancellation}
                          </TableCell>
                          <TableCell
                            className={
                              data?.total_retained < 0 ? 'text-danger' : ''
                            }
                          >
                            {data?.total_retained}
                          </TableCell>
                          <TableCell
                            className={
                              data?.total_balance < 0 ? 'text-danger' : ''
                            }
                          >
                            {data?.total_balance?.toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={
                              data?.overall_total < 0 ? 'text-danger' : ''
                            }
                          >
                            {data?.overall_total?.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        {data &&
                          data?.invoice_data?.map((item, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>
                                  {moment(item?.event_date).format(
                                    'DD/MM/YYYY',
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Link
                                    to={`/edit-bookings/${item?.booking_id}`}
                                    state={{
                                      reportName:
                                        'Invoice and Credit Notes Report',
                                    }}
                                  >
                                    {item?.invoice_no}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  {item?.type === 0 ? 'Invoice' : 'Credit'}
                                </TableCell>
                                <TableCell>{item?.scop}</TableCell>
                                <TableCell>{item?.name}</TableCell>
                                <TableCell>{item?.company_name}</TableCell>
                                <TableCell
                                  className={
                                    item?.cancellation_charge < 0
                                      ? 'text-danger'
                                      : ''
                                  }
                                >
                                  {item?.cancellation_charge}
                                </TableCell>
                                <TableCell
                                  className={
                                    item?.retained_depts < 0
                                      ? 'text-danger'
                                      : ''
                                  }
                                >
                                  {item?.retained_depts}
                                </TableCell>
                                <TableCell
                                  className={
                                    item?.balance < 0 ? 'text-danger' : ''
                                  }
                                >
                                  {zeroRoundTo(item?.balance)}
                                </TableCell>
                                <TableCell
                                  className={
                                    item?.total < 0 ? 'text-danger' : ''
                                  }
                                >
                                  {zeroRoundTo(item?.total)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              );
            })}
        </>
      ) : (
        'There are no invoice for the timeframe specified'
      )}
    </>
  );
}
