import { useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Loader from 'Components/Common/Loader';
import { getSalesContactSources } from 'store/reducers/Report/salesReport.slice';
import { getEventData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getContactSourcesData } from 'store/reducers/Admin/Events/ContactSources/contactSources.slice';

export default function ContactSourceReportTable({
  reportData,
  eventName,
  contactSource,
}) {
  const { salesContactSourcesList, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );
  const { eventDetail } = useSelector(({ parties }) => parties);
  const { contactSourcesDetail } = useSelector(
    ({ contactSources }) => contactSources,
  );
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  let contactSourceData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print')) {
      if (Object.keys(contactSourceData).length > 0) {
        dispatch(getSalesContactSources(contactSourceData));
        if (
          typeof contactSourceData?.event_id === 'string' &&
          contactSourceData?.event_id.length > 5
        ) {
          dispatch(getEventData(contactSourceData?.event_id));
        }
        dispatch(getContactSourcesData(contactSourceData?.contact_sources));
      }
    }
  }, []);

  return (
    <>
      {salesContactSourcesLoading && <Loader />}
      {Object.keys(salesContactSourcesList?.items || {})?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Contact Sources Report from:{' '}
            {contactSourceData?.start_date
              ? moment(contactSourceData?.start_date).format('DD/MM/YYYY')
              : moment(reportData?.start_date).format('DD/MM/YYYY')}{' '}
            To :{' '}
            {contactSourceData?.end_date
              ? moment(contactSourceData?.end_date).format('DD/MM/YYYY')
              : moment(reportData?.end_date).format('DD/MM/YYYY')}
          </h4>
          <h4 className="fw_600">
            At:{' '}
            {eventName
              ? eventName[0]?.internal_name
                ? eventName[0].internal_name
                : 'All'
              : eventDetail?.internal_name ?? 'All'}
          </h4>
          <h4 className="fw_600">
            For Contact Source :{' '}
            {contactSource
              ? contactSource?.name
                ? contactSource.name
                : 'All'
              : contactSourcesDetail?.name ?? 'All'}
          </h4>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Contact ID</TableCell>
                    <TableCell>Contact Created</TableCell>
                    <TableCell>Booking ID</TableCell>
                    <TableCell>Date Booked</TableCell>
                    <TableCell>Primary Venue</TableCell>
                    <TableCell>Booked Venue</TableCell>
                    <TableCell>Event Date</TableCell>
                    <TableCell>Company/Contact Name</TableCell>
                    <TableCell>Contact Source Category</TableCell>
                    <TableCell>Contact Source</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesContactSourcesList?.items?.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Link
                            to={`/contact/edit-contact/${item?._id}`}
                            state={{
                              reportName: 'Contact Sources Report',
                            }}
                          >
                            {item?._id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {moment(item?.contact_created).format(
                            'YYYY-MM-DD h:mm:ss',
                          )}
                        </TableCell>
                        <TableCell>
                          <Link
                            to={
                              item?.event
                                ? `/edit-bookings/${item?.booking_id}`
                                : `/edit-enquiries/${item?.booking_id}`
                            }
                            state={{
                              reportName: 'Contact Sources Report',
                            }}
                          >
                            {item?.booking_ref}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {moment(item?.booking_created).format(
                            'YYYY-MM-DD h:mm:ss',
                          )}
                        </TableCell>
                        <TableCell>{item?.venue}</TableCell>
                        <TableCell>{item?.event}</TableCell>
                        <TableCell>
                          {item?.event_date
                            ? moment(item?.event_date).format(
                                'YYYY-MM-DD h:mm:ss',
                              )
                            : ''}
                        </TableCell>
                        <TableCell>{item?.Company_Contact_Name}</TableCell>
                        <TableCell>{item?.source_category}</TableCell>
                        <TableCell>{item?.contact_source}</TableCell>
                      </TableRow>
                    );
                  })}
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
                    <TableCell>Quantity</TableCell>
                    <TableCell>Contact Source Category</TableCell>
                    <TableCell>Contact Source</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesContactSourcesList?.totals?.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{item?.quantity}</TableCell>
                        <TableCell>{item?.source_cat_name}</TableCell>
                        <TableCell>{item?.source_name}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        'There are no contact sources report for the timeframe specified'
      )}
    </>
  );
}
