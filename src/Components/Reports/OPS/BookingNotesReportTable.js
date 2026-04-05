import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getBookingNotes } from 'store/reducers/Report/opsReport.slice';
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
import DataNotFound from 'Components/Common/DataNotFound';

export default function BookingNotesReportTable({ eventName }) {
  const dispatch = useDispatch();

  const { bookingNotesList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );
  const { eventDetail } = useSelector(({ parties }) => parties);

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(reportParamData).length > 0)
        dispatch(
          getBookingNotes({
            event_id:
              reportParamData?.event_id === 'All'
                ? ''
                : reportParamData?.event_id,
          }),
        );
  }, []);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (
        typeof reportParamData?.event_id === 'string' &&
        reportParamData?.event_id
      ) {
        reportParamData?.event_id !== 'All' &&
          dispatch(getEventData(reportParamData?.event_id));
      }
  }, [reportParamData?.event_id]);

  return (
    <>
      {opsReportLoading && <Loader />}
      {bookingNotesList?.data?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Booking Notes for:{' '}
            {eventName
              ? eventName[0]
                ? eventName[0]?.internal_name + ' ' + eventName[0]?.year
                : 'All'
              : eventDetail?.internal_name + ' ' + eventDetail?.year ?? 'All'}
          </h4>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Booking</TableCell>
                    <TableCell>Event Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Company/Contact Name</TableCell>
                    <TableCell>Places P/C</TableCell>
                    <TableCell>Booking Notes</TableCell>
                    <TableCell>PO / Agent Ref</TableCell>
                    <TableCell>Venue Notes</TableCell>
                    <TableCell>Public Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingNotesList?.data?.length > 0 ? (
                    bookingNotesList?.data?.map(item => {
                      return (
                        <>
                          {item?.data?.map(itemData => {
                            return (
                              <TableRow key={itemData?._id}>
                                <TableCell>
                                  <Link
                                    to={`/edit-bookings/${itemData?._id}`}
                                    state={{
                                      reportName: 'Booking Notes Report',
                                    }}
                                  >
                                    {itemData?.booking_ref}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  {moment(itemData?.event_date).format(
                                    'ddd DD/MM/YYYY',
                                  )}
                                </TableCell>
                                <TableCell>{itemData?.name}</TableCell>
                                <TableCell>{itemData?.company_name}</TableCell>
                                <TableCell>{itemData?.places}</TableCell>
                                <TableCell>{itemData?.booking_notes}</TableCell>
                                <TableCell>{itemData?.po_agent_ref}</TableCell>
                                <TableCell>{itemData?.venue_notes}</TableCell>
                                <TableCell>{itemData?.public_notes}</TableCell>
                              </TableRow>
                            );
                          })}
                        </>
                      );
                    })
                  ) : (
                    <DataNotFound />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        'There are no bookings with notes for the event specified'
      )}
    </>
  );
}
