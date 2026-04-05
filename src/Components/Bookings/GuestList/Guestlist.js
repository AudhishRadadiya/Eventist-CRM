import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useLocation, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Col, Row } from 'react-bootstrap';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import { getBookingGuestListData } from 'store/reducers/Booking/bookingGuest.slice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import AddGuestPopup from '../AddGuestPopup';
import EventGuests from './EventGuests';

export default function Guestlist() {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    bookingGuestList,
    isBookingGuestUpdated,
    isBulkGuestUpdated,
    bookingGuestLoading,
    isGuestlistUpdateData,
    guestlistUpdatedNewData,
  } = useSelector(({ bookingGuest }) => bookingGuest);
  const [addGuestPopup, setAddGuestPopup] = useState(false);
  const openAddGuest = () => setAddGuestPopup(true);
  const closeAddGuest = () => setAddGuestPopup(false);

  useEffect(() => {
    if (isGuestlistUpdateData) dispatch(getBookingGuestListData(bookingId));
  }, [isGuestlistUpdateData]);

  useEffect(() => {
    if (isBulkGuestUpdated || isBookingGuestUpdated)
      dispatch(getBookingGuestListData(bookingId));
  }, [isBulkGuestUpdated, isBookingGuestUpdated]);

  return (
    <div className="inner_wrapper">
      {bookingGuestLoading && <Loader />}
      <div className="guest_list_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Link to="/bookings">Bookings</Link>
            <Typography>Edit booking</Typography>
            <Typography>Guestlist</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row className="align-items-center">
            <Col xs={3}>
              <h1>Guestlist</h1>
            </Col>
            <Col xs={9}>
              <div className="text-end">
                <Link
                  to={`/edit-bookings/${bookingId}`}
                  className="btn_border small"
                >
                  Back to Booking
                </Link>
              </div>
            </Col>
          </Row>
        </div>
        {isGuestlistUpdateData && guestlistUpdatedNewData?.pdf_tickets_file && (
          <div className="view_invoice_wrapper">
            <Link
              to={guestlistUpdatedNewData?.pdf_tickets_file}
              target="_blank"
            >
              There is a new eTicket available - click here to view the eTicket
            </Link>
          </div>
        )}
        <div className="guest-list_top_wrap bg_white_box p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="m-0">+Dietary Requirements</h4>
            <button
              type="button"
              className="btn_primary small"
              onClick={openAddGuest}
            >
              Add Guest
            </button>
          </div>
          {bookingGuestList?.length > 0 && (
            <p>
              Places Confirmed
              <span className="btn_primary small mx-2">
                {state?.confirmed_places}
              </span>
              Provisional Places
              <span className="btn_primary small mx-2">
                {state?.provisional_places}
              </span>
            </p>
          )}
        </div>
        <EventGuests />
      </div>
      <AddGuestPopup
        closeAddGuest={closeAddGuest}
        addGuestPopup={addGuestPopup}
      />
    </div>
  );
}
