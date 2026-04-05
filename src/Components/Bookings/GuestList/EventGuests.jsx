import React, { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBookingGuestListData,
  recreateETicketGuestList,
} from 'store/reducers/Booking/bookingGuest.slice';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { Link, useParams } from 'react-router-dom';
import GuestRow from './GuestRow';
import DeletePopupModal from 'Components/Common/DeletePopupModal';

const EventGuests = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const { bookingGuestList } = useSelector(({ bookingGuest }) => bookingGuest);
  const [enabledEticket, setEnabledEticket] = useState(false);
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [recreatePopup, setRecreatedPopup] = useState(false);

  useEffect(() => {
    dispatch(getBookingGuestListData(bookingId));
  }, []);

  const closeResetRecreateETicket = () => setRecreatedPopup(false);

  const resetRecreateETicketEticket = () =>
    dispatch(
      recreateETicketGuestList({
        booking_id: bookingId,
      }),
    );

  const memoizedGuestList = useMemo(() => {
    return bookingGuestList?.filter(data => !data.deleted) || [];
  }, [bookingGuestList]);
  const memoizedDeletedGuestList = useMemo(() => {
    return bookingGuestList?.filter(data => data.deleted) || [];
  }, [bookingGuestList]);

  return (
    <>
      {bookingGuestList?.length > 0 ? (
        <>
          <div className="guest_list_table">
            <div className="table_main_Wrapper pages_active_table mb-3">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Manager</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Surname</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Requirements</TableCell>
                      <TableCell>Attendance</TableCell>
                      <TableCell>Tkt #</TableCell>
                      <TableCell sx={{ width: '10%' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {memoizedGuestList.map((data, index) => (
                      <GuestRow data={data} />
                    ))}
                    <TableRow className="full_row">
                      <TableCell>
                        <span
                          className="text-decoration-underline custom_text_hover"
                          onClick={() => {
                            setDeleteToggle(!deleteToggle);
                          }}
                        >
                          DELETED / UNLINKED GUESTS
                        </span>
                      </TableCell>
                    </TableRow>
                    {deleteToggle &&
                      memoizedDeletedGuestList.map((data, index) => (
                        <GuestRow data={data} />
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <p>
            THIS BOOKING {enabledEticket ? 'HAS' : 'DOES NOT HAVE'} eTICKETS
            <Link
              to={`/etickets/tickets/${bookingId}`}
              className={
                enabledEticket
                  ? 'custom_text_hover text-decoration-underline mx-1'
                  : 'custom_text_hover mx-1'
              }
              target="_blank"
            >
              DIRECTORY BROWSING
            </Link>
            ENABLED -
            <span
              className="custom_text_hover text-decoration-underline mx-1"
              onClick={() => {
                setEnabledEticket(!enabledEticket);
              }}
            >
              {enabledEticket
                ? 'CLICK HERE TO DISABLE'
                : 'CLICK HERE TO ENABLE'}
            </span>
          </p>
          <p>
            <span
              className="custom_text_hover text-decoration-underline"
              onClick={() => setRecreatedPopup(true)}
            >
              RESET TICKET NUMBERS AND RECREATE ALL NAMED GUEST ETICKETS - THIS
              WILL DELETE ALL PREVIOUSLY CREATED ETICKETS
            </span>
          </p>
        </>
      ) : (
        'There are no guests assigned to this booking'
      )}
      <DeletePopupModal
        CloseDelete={closeResetRecreateETicket}
        deletePopup={recreatePopup}
        onClickDelete={resetRecreateETicketEticket}
        ok="ok"
        name="Are you sure you want to recreate all eTickets - this will renumber all the tickets so any tickets already sent out will be incorrect. This will take some time.?"
      />
    </>
  );
};
export default memo(EventGuests);
