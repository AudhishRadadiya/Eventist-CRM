import { memo } from 'react';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';
import { Form, Formik } from 'formik';
import { Button } from 'react-bootstrap';
import { DialogContent, DialogActions } from '@mui/material';
import { updateBookingCancel } from 'store/reducers/Booking/booking.slice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
const ConfirmToCancelBookingPopup = ({
  confirmToCancelBookingPopup,
  closeCancelBookingPopup,
  cancelBookingValues,
}) => {
  const dispatch = useDispatch();
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);

  return (
    <BootstrapDialog
      aria-labelledby="CancelBooking-title"
      open={confirmToCancelBookingPopup}
      className="extra_small_popup"
    >
      <Formik
        enableReinitialize={true}
        initialValues={cancelBookingValues}
        onSubmit={values => {
          dispatch(
            updateBookingCancel({
              _id: enquirieDetail?._id,
              bookingCancel: values,
            }),
          );
          closeCancelBookingPopup();
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <BootstrapDialogTitle
              id="CancelBooking-title"
              onClose={closeCancelBookingPopup}
            >
              Confirm To Cancel Booking
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <div className="popup_content_wrap">
                <h5>
                  {`Are you sure you want to cancel your booking for ${moment(
                    enquirieDetail?.event_info?.event_date?.date,
                  ).format('ddd Do MMM YYYY')}?`}
                </h5>
                <h5>
                  <b>Please note</b> that if you cancel your booking, the amount
                  you’ve already paid will not be refunded, and you will need to
                  pay the full amount.
                </h5>
              </div>
            </DialogContent>
            <DialogActions className="justify-content-center mb-3">
              <ul className="d-flex align-items-center justify-content-center">
                <li>
                  <Button
                    className="btn_border small mx-2"
                    onClick={closeCancelBookingPopup}
                  >
                    Cancel
                  </Button>
                </li>
                <li>
                  <Button className="btn_primary small mx-2" type="submit">
                    Confirm
                  </Button>
                </li>
              </ul>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </BootstrapDialog>
  );
};

export default memo(ConfirmToCancelBookingPopup);
