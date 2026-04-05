import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { getTotalBookingsByUser } from 'store/reducers/Report/salesReport.slice';

export default function TotalBookingsByUserTable({ reportData }) {
  const dispatch = useDispatch();

  const { salesTotalBookingsByUser, salesTotalBookingsByUserLoading } =
    useSelector(({ salesReport }) => salesReport);
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (Object.keys(reportParamData).length > 0) {
      const data = {
        start_date: moment(reportParamData?.start_date).format('YYYY-MM-DD'),
        end_date: moment(reportParamData?.end_date).format('YYYY-MM-DD'),
      };
      dispatch(getTotalBookingsByUser(data));
    }
  }, [dispatch]);

  return (
    <>
      {salesTotalBookingsByUserLoading && <Loader />}
      <h4 className="fw_600">
        Total Booking By User from :{' '}
        {reportParamData?.start_date
          ? moment(reportParamData?.start_date).format('DD/MM/YYYY')
          : moment(new Date(reportData.start_date)).format('DD/MM/YYYY')}
        To :{' '}
        {reportParamData?.end_date
          ? moment(reportParamData?.end_date).format('DD/MM/YYYY')
          : moment(new Date(reportData.end_date)).format('DD/MM/YYYY')}
      </h4>
      <div className="table_main_Wrapper mb-3">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <span>User </span>
                </TableCell>
                <TableCell>
                  <span>Total Bookings</span>
                </TableCell>
                <TableCell>
                  <span>Enquired Places </span>
                </TableCell>
                <TableCell>
                  <span>Provisional Places</span>
                </TableCell>
                <TableCell>
                  <span>Confirmed Places</span>
                </TableCell>
                <TableCell>
                  <span>Places Fall-off</span>
                </TableCell>
                <TableCell>
                  <span>Own Booking Notes</span>
                </TableCell>
                <TableCell>
                  <span>Total Notes Made</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesTotalBookingsByUser &&
                salesTotalBookingsByUser?.length > 0 &&
                salesTotalBookingsByUser?.map((data, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{data?.User ? data?.User : ''}</TableCell>
                      <TableCell>{data?.Total_Bookings}</TableCell>
                      <TableCell>{data?.Enquired_Places}</TableCell>
                      <TableCell>{data?.Provisional_Places}</TableCell>
                      <TableCell>{data.Confirmed_Places}</TableCell>
                      <TableCell>{data?.Places_falloff}</TableCell>
                      <TableCell>{data.Notes_Added}</TableCell>
                      <TableCell>{data.Total_Notes_Added}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
