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

export default function DrinksSundriesReportTable() {
  const dispatch = useDispatch();

  const { salesKpiReport, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
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
      {salesKpiReport?.data?.map((elem, i) => {
        return (
          <>
            <h4 className="fw_600">
              {elem?.event_name
                ? `${elem?.event_name} - ${moment(elem?.event_date).format(
                    'DD/MM/YYYY',
                  )}`
                : ''}
              {salesKpiReport?.length}
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
                        <span>Net</span>
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
                    {elem?.data || elem?.total ? (
                      <>
                        {elem?.data?.map(item => (
                          <TableRow key={item?.event_name}>
                            <TableCell>{item?.event_name}</TableCell>
                            <TableCell>
                              <Link
                                to={`/edit-bookings/invoices/${item?.booking_id}`}
                              >
                                {item?.ref_no}
                              </Link>
                            </TableCell>
                            <TableCell>
                              {moment(item?.event_date).format('DD/MM/YYYY')}
                            </TableCell>
                            <TableCell>{item?.price}</TableCell>
                            <TableCell>{item?.places}</TableCell>
                            <TableCell>{item?.gross}</TableCell>
                            <TableCell>{item?.discount_percent}</TableCell>
                            <TableCell>{item?.discount_amount}</TableCell>
                            <TableCell>{item?.net}</TableCell>
                            <TableCell>{item?.ticket_billable}</TableCell>
                            <TableCell>{item?.sub_total}</TableCell>
                          </TableRow>
                        ))}

                        <TableRow>
                          <TableCell className="fw-bold ">
                            {elem?.total?.event_name}
                          </TableCell>
                          <TableCell className="fw-bold ">
                            {elem?.total?.booking_ref}
                          </TableCell>
                          <TableCell className="fw-bold ">
                            {moment(elem?.total?.event_date).format(
                              'DD/MM/YYYY',
                            )}
                          </TableCell>
                          <TableCell className="fw-bold ">
                            {elem?.total?.price}
                          </TableCell>
                          <TableCell className="fw-bold ">
                            {elem?.total?.places}
                          </TableCell>
                          <TableCell className="fw-bold ">
                            {elem?.total?.gross}
                          </TableCell>
                          <TableCell className="fw-bold">
                            {elem?.total?.discount_percent}
                          </TableCell>
                          <TableCell className="fw-bold ">
                            {elem?.total?.discount_amount}
                          </TableCell>
                          <TableCell className="fw-bold ">
                            {elem?.total?.net}
                          </TableCell>
                          <TableCell className="fw-bold ">
                            {elem?.total?.ticket_billable}
                          </TableCell>
                          <TableCell className="fw-bold ">
                            {elem?.total?.sub_total}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell className="fw-bold ">
                          {elem?.event_name}
                        </TableCell>
                        <TableCell className="fw-bold ">
                          {elem?.booking_ref}
                        </TableCell>
                        <TableCell className="fw-bold ">
                          {moment(elem?.event_date).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell className="fw-bold ">
                          {elem?.price}
                        </TableCell>
                        <TableCell className="fw-bold ">
                          {elem?.places}
                        </TableCell>
                        <TableCell className="fw-bold ">
                          {elem?.gross}
                        </TableCell>
                        <TableCell className="fw-bold ">
                          {elem?.discount_percent}
                        </TableCell>
                        <TableCell className="fw-bold ">
                          {elem?.discount_amount}
                        </TableCell>
                        <TableCell className="fw-bold ">{elem?.net}</TableCell>
                        <TableCell className="fw-bold ">
                          {elem?.ticket_billable}
                        </TableCell>
                        <TableCell className="fw-bold ">
                          {elem?.sub_total}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        );
      })}
    </>
  );
}
