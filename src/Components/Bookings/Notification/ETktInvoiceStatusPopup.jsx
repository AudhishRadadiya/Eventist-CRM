import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getEticketInvoiceSendStatus } from 'store/reducers/Enquiry/enquiries.slice';

const ETktInvoiceStatusPopup = () => {
  const { invoice_text_visible, eticket_text_visible } = useSelector(
    ({ enquiries }) => enquiries,
  );
  const dispatch = useDispatch();
  const { bookingId } = useParams();

  useEffect(() => {
    dispatch(getEticketInvoiceSendStatus(bookingId));
  }, []);

  return (
    <>
      {invoice_text_visible && (
        <div className="view_invoice_wrapper">
          <Link to={`/edit-bookings/invoices/${bookingId}`}>
            There is a new invoice available which has not been sent to the
            customer - click here to view the invoices
          </Link>
        </div>
      )}
      {eticket_text_visible && (
        <div className="e_ticket_wrapper">
          <Link to={`/edit-bookings/booking-e-ticket/${bookingId}`}>
            THE eTICKETS ARE OUT OF DATE
          </Link>
        </div>
      )}
    </>
  );
};

export default memo(ETktInvoiceStatusPopup);
