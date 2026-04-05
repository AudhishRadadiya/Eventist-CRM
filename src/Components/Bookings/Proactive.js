import { useMemo, useState } from 'react';
import moment from 'moment';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import Note from './Note';
import CouponsInfo from './CouponsInfo/CouponsInfo';
import EventInformation from './EventInformation';
import BookingInformation from './BookingInformation';
import PaymentInformation from './PaymentInfo/PaymentInformation';
import ContactInformation from './ContactInformation/ContactInformation';
import SpecialRequirement from './SpecialRequirement';
import LegacyNotes from './LegacyNotes';
import ChangePlace from './ChangePlace/ChangePlace';
import FileIcon from '../../Assets/Img/file.svg';
import EmailIcon from '../../Assets/Img/email.svg';
import { useSelector } from 'react-redux';

export default function Proactive({ pages }) {
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const renderCouponsInfo = useMemo(() => {
    if (pages === 'booking') {
      return <CouponsInfo enquirieDetail={enquirieDetail} />;
    } else return null;
  }, [enquirieDetail]);

  const showButtonDependBookingDate = useMemo(() => {
    let isValid = false;

    if (enquirieDetail?.event_info?.event_date?.date) {
      const partyBookingDate = enquirieDetail?.event_info?.event_date?.date;

      const today = moment();
      const sixWeeksLater = moment(partyBookingDate).subtract(6, 'weeks');
      const lastDateOfYear = moment(partyBookingDate).endOf('year');

      isValid =
        today.isSameOrAfter(sixWeeksLater) &&
        today.isSameOrBefore(lastDateOfYear);

      return isValid;
    }
  }, [enquirieDetail?.event_info?.event_date?.date]);

  const invoicingButtonCondition = useMemo(() => {
    const condition =
      (enquirieDetail?.booking_info?.confirmed_places > 0 &&
        !enquirieDetail?.booking_info?.provisional_places) ||
      enquirieDetail?.is_invoice ||
      enquirieDetail?.is_cancelled ||
      (showButtonDependBookingDate &&
        enquirieDetail?.booking_info?.provisional_places > 0);

    return condition;
  }, [enquirieDetail, showButtonDependBookingDate]);

  const billableItemsButtonCondition = useMemo(() => {
    const condition =
      (enquirieDetail?.booking_info?.confirmed_places > 0 &&
        !enquirieDetail?.booking_info?.provisional_places) ||
      enquirieDetail?.is_invoice ||
      (showButtonDependBookingDate &&
        enquirieDetail?.booking_info?.provisional_places > 0);

    return condition;
  }, [enquirieDetail, showButtonDependBookingDate]);

  return (
    <>
      <div className="edit_booking_content_wrap">
        <Row>
          <Col lg={6}>
            <div
              className="booking_head d-flex align-items-center justify-content-between mb-1 p-2"
              style={{
                backgroundColor: pages === 'enquiries' ? '#6666cc' : '',
              }}
            >
              <h4 className="text_light m-0">
                {pages === 'enquiries' ? 'Enquiry: ' : 'Booking: '}
                <span
                  style={{
                    color: pages === 'enquiries' ? '#fff' : '',
                  }}
                >
                  {enquirieDetail?.ref_number}
                </span>{' '}
                - ({enquirieDetail?.booking_unique_id}{' '}
                {enquirieDetail?.ref_number}){' '}
                {pages === 'enquiries' &&
                  `- Sec Code: ${enquirieDetail?.booking_uid}`}
              </h4>
              <h4
                className="fw_600 m-0"
                style={{
                  color: pages === 'enquiries' ? '#fff' : '',
                }}
              >
                {' '}
                {enquirieDetail?.created_at
                  ? moment(enquirieDetail?.created_at).format('YYYY')
                  : ''}
              </h4>
            </div>
            <div className="booking_contact_info">
              <ContactInformation pages={pages} />
            </div>
          </Col>
          <Col lg={6}>
            <div className="d-flex flex-wrap">
              <div className="booking_left_head">
                <ul>
                  {pages === 'booking' && (
                    <>
                      {invoicingButtonCondition && (
                        <li>
                          <Link
                            to={`/edit-bookings/invoices/${enquirieDetail?._id}`}
                            className="btn_border small me-2"
                          >
                            Invoicing
                          </Link>
                        </li>
                      )}
                      {billableItemsButtonCondition && (
                        <li>
                          <Link
                            to={`/edit-bookings/booking-billable-items/${enquirieDetail?._id}`}
                            className="btn_border small"
                          >
                            Billable Items
                          </Link>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>
              <div className="booking_right_head ms-auto">
                <ul>
                  {pages === 'booking' && (
                    <>
                      {enquirieDetail?.is_booking && (
                        <>
                          <li>
                            <Link
                              to={`${process.env.REACT_APP_WEBSITE_URL}login?email=${enquirieDetail?.contact?.email_primary}&password=frmcrmbo`}
                              className="btn_border small"
                              target="_blank"
                            >
                              Log into BPE.com
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="btn_border small"
                              onClick={handleClickOpen}
                            >
                              Change Places{' '}
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/add-payment/${enquirieDetail?._id}`}
                              className="btn_border small"
                            >
                              Payments
                            </Link>
                          </li>
                        </>
                      )}
                    </>
                  )}
                  <li>
                    <button
                      className="btn_icon"
                      onClick={() => {
                        if (pages === 'booking') {
                          navigate(
                            `/send-new-email/${enquirieDetail?._id}?${pages}=true&booking_confirmation=web_booking_confirmation`,
                            {
                              state: { enq_id: `${enquirieDetail?._id}` },
                            },
                          );
                        } else {
                          navigate(
                            `/send-new-email/${enquirieDetail?._id}?${pages}=true&default=default`,
                            {
                              state: { enq_id: `${enquirieDetail?._id}` },
                            },
                          );
                        }
                      }}
                    >
                      <img src={EmailIcon} alt="Email Icon" />
                    </button>
                  </li>
                  <li>
                    <Link
                      className="btn_icon"
                      to={`/send-new-letter/${enquirieDetail?._id}?${pages}=true&contactid=${enquirieDetail?.contact?._id}`}
                    >
                      <img src={FileIcon} alt="File Icon" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <EventInformation pages={pages} enquirieDetail={enquirieDetail} />
            <BookingInformation pages={pages} enquirieDetail={enquirieDetail} />
            {renderCouponsInfo}
            <PaymentInformation pages={pages} />
          </Col>

          <Col xs={12}>
            {pages === 'booking' && <SpecialRequirement />}
            <Note id={bookingId} enquirieDetail={enquirieDetail} />
          </Col>
          <Col xs={12}>
            <LegacyNotes
              enquirieDetail={enquirieDetail}
              pages={pages}
              id={bookingId}
            />
          </Col>
        </Row>
      </div>

      <ChangePlace open={open} handleClose={handleClose} />
    </>
  );
}
