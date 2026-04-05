import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
import { getTicketRevenueReport } from 'store/reducers/Report/salesReport.slice';
import { zeroRoundTo } from 'utils/common';

export default function TicketRevenueReportTable() {
  const dispatch = useDispatch();

  const { salesTicketRevenueReport, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(reportParamData).length > 0)
        dispatch(
          getTicketRevenueReport({
            select_year: Number(reportParamData.select_year),
            event_id: reportParamData?.event_id,
          }),
        );
  }, [dispatch]);

  return (
    <>
      {salesContactSourcesLoading && <Loader />}
      <div id="content-ticket-revenue-report">
        {salesTicketRevenueReport?.map((elem, i) => {
          return (
            <>
              {elem?.data?.map(item => {
                return (
                  <>
                    <h4 className="fw_600">
                      {elem?.event_name +
                        ' - ' +
                        moment(item?.date).format('DD/MM/YYYY')}
                    </h4>
                    <div className="table_main_Wrapper mb-3">
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Event</TableCell>
                              <TableCell>
                                <span>Booking Ref </span>
                              </TableCell>
                              <TableCell>
                                <span>Event Date</span>
                              </TableCell>
                              <TableCell>
                                <span>Price </span>
                              </TableCell>
                              <TableCell>
                                <span>Places</span>
                              </TableCell>
                              <TableCell>
                                <span>Gross</span>
                              </TableCell>
                              <TableCell>
                                <span>Discount Percent </span>
                              </TableCell>
                              <TableCell>
                                <span>Discount Amount </span>
                              </TableCell>
                              <TableCell>
                                <span>Ticket Total</span>
                              </TableCell>
                              <TableCell>
                                <span>Ticket Billables </span>
                              </TableCell>
                              <TableCell>
                                <span>Sub Total</span>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item?.data?.map(itemData => {
                              return (
                                <TableRow>
                                  <TableCell>
                                    {itemData?.ev_internal_name}
                                  </TableCell>
                                  <TableCell>
                                    <Link
                                      to={`/edit-bookings/invoices/${itemData?.booking_id}`}
                                      state={{
                                        reportName: 'Ticket Revenue Report',
                                      }}
                                    >
                                      {itemData?.ref_no}
                                    </Link>
                                  </TableCell>
                                  <TableCell>
                                    {itemData?.date_date
                                      ? moment(itemData?.date_date).format(
                                          'DD/MM/YYYY',
                                        )
                                      : ''}
                                  </TableCell>
                                  <TableCell>
                                    {zeroRoundTo(itemData?.Price)}
                                  </TableCell>
                                  <TableCell>{itemData?.Places}</TableCell>
                                  <TableCell>
                                    {itemData?.Gross?.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {itemData?.Discount_Percent}
                                  </TableCell>
                                  <TableCell>
                                    {itemData?.Discount_Amount?.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {itemData?.Net?.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {itemData?.Ticket_Billables}
                                  </TableCell>
                                  <TableCell>
                                    {zeroRoundTo(itemData?.SubTotal)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </>
                );
              })}
            </>
          );
        })}
      </div>
    </>
  );
}
