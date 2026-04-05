import React from 'react';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { downgradeBooking } from 'store/reducers/Booking/booking.slice';
import { Button } from 'react-bootstrap';

import {
  FormGroup,
  TextField,
  FormControl,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
const DowngradeEnquiryPopup = ({
  downgradeEnquiryPopup,
  OpenDowngradeEnquiry,
}) => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();

  return (
    <BootstrapDialog
      aria-labelledby="Downgrade-Enquiry-title"
      open={downgradeEnquiryPopup}
      className="small_popup"
    >
      <Formik
        enableReinitialize={true}
        initialValues={{
          downgrade_note: '',
        }}
        validationSchema={Yup.object().shape({
          downgrade_note: Yup.string().required(
            'Downgrade note is a required field',
          ),
        })}
        onSubmit={values => {
          dispatch(
            downgradeBooking({
              booking_id: bookingId,
              downgrade: values,
            }),
          );
          OpenDowngradeEnquiry(false);
        }}
      >
        {({ handleSubmit, handleChange, values }) => (
          <Form onSubmit={handleSubmit}>
            <BootstrapDialogTitle
              id="Downgrade-Enquiry-title"
              onClose={() => OpenDowngradeEnquiry(false)}
            >
              Downgrade to Enquiry
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <div className="popup_content_wrap">
                <h5>
                  Why is this booking being downgraded?
                  <sup className="text_primary">*</sup>
                </h5>
                <FormGroup className="input_wrap">
                  <FormControl fullWidth className="small_select">
                    <TextField
                      id="Discount"
                      type="text"
                      variant="outlined"
                      className="input_wrap"
                      name="downgrade_note"
                      value={values.downgrade_note}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <span className="d-block text-danger text_small">
                    <ErrorMessage name="downgrade_note" />
                  </span>
                </FormGroup>
              </div>
            </DialogContent>
            <DialogActions className="justify-content-center mb-3">
              <ul className="d-flex align-items-center justify-content-center">
                <li>
                  <Button
                    className="btn_border small mx-2"
                    onClick={() => OpenDowngradeEnquiry(false)}
                  >
                    Cancel
                  </Button>
                </li>
                <li>
                  <Button className="btn_primary small mx-2" type="submit">
                    Ok
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

export default DowngradeEnquiryPopup;
