import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { monthsTypes } from 'utils/FieldValues';
import Loader from 'Components/Common/Loader';
import { getMonthlyRevenue } from 'store/reducers/Report/salesReport.slice';

const MonthlyRevenueReportTable = ({ reportData }) => {
  const dispatch = useDispatch();
  const { salesMonthlyRevenueList, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );

  const [searchParams] = useSearchParams();
  let monthlyRevenueReportData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(monthlyRevenueReportData).length > 0)
        dispatch(getMonthlyRevenue(monthlyRevenueReportData));
  }, [dispatch]);

  const getMonthName = (monthsArray, month) =>
    month === 12 ? 'December' : monthsArray[month - 1]?.name || '';

  const renderMonthString = (data, reportData, monthsArray) => {
    const month = getMonthName(monthsArray, data?.month);
    const year = data?.year;

    return `${month} ${year}`;
  };

  const renderInvoiceMonthString = (
    monthlyRevenueReportData,
    reportData,
    monthsArray,
  ) => {
    const month =
      getMonthName(monthsArray, monthlyRevenueReportData?.months) ||
      getMonthName(monthsArray, reportData?.months);

    const year = reportData?.years || monthlyRevenueReportData?.years;

    return `${month} ${year}`;
  };

  return (
    <>
      {salesContactSourcesLoading && <Loader />}
      {Object.keys(salesMonthlyRevenueList).length > 0 ? (
        <>
          {salesMonthlyRevenueList?.map(data => {
            return (
              <>
                <h4 className="fw_500">
                  Revenue invoiced in{' '}
                  <span className="fw_600">
                    {renderInvoiceMonthString(
                      monthlyRevenueReportData,
                      reportData,
                      monthsTypes,
                    )}
                  </span>{' '}
                  for:{' '}
                  <span className="d-block fw_600">
                    {renderMonthString(data, reportData, monthsTypes)}
                  </span>
                </h4>
                <div className="table_main_Wrapper mb-3">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Company/Contact Name</TableCell>
                          <TableCell>Event</TableCell>
                          <TableCell>Booking Ref</TableCell>
                          <TableCell>Invoice Number</TableCell>
                          <TableCell>Invoice Date</TableCell>
                          <TableCell>Event Date</TableCell>
                          <TableCell>Event Month</TableCell>
                          <TableCell>Event Year</TableCell>
                          <TableCell>Amount Ex Vat</TableCell>
                          <TableCell>Amount Inc Vat</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.data?.map((item, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                {item?.company_contact_name}
                              </TableCell>
                              <TableCell>{item?.event}</TableCell>
                              <TableCell>
                                <Link
                                  to={`/edit-bookings/invoices/${item?._id}`}
                                  state={{
                                    reportName: 'Revenue Report',
                                  }}
                                >
                                  {item?.booking_ref}
                                </Link>
                              </TableCell>
                              <TableCell>{item?.invoice_no}</TableCell>
                              <TableCell>
                                {moment(item?.invoice_date).format(
                                  'DD/MM/YYYY',
                                )}
                              </TableCell>
                              <TableCell>
                                {moment(item?.event_date).format('DD/MM/YYYY')}
                              </TableCell>
                              <TableCell>
                                {monthsTypes[item?.month - 1]?.name}
                              </TableCell>
                              <TableCell>{item?.event_year}</TableCell>
                              <TableCell>{item?.net?.toFixed(2)}</TableCell>
                              <TableCell>{item?.total?.toFixed(2)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                <h4 className="fw_400 mb-4">
                  Monthly Amount (ex Vat) : £{data?.totalNet?.toFixed(2)} <br />
                  Monthly Amount (inc Vat) : £{data?.totalvat?.toFixed(2)}
                </h4>
              </>
            );
          })}
        </>
      ) : (
        'There are no Monthly Revenue Report for the timeframe specified'
      )}
    </>
  );
};

export default MonthlyRevenueReportTable;
