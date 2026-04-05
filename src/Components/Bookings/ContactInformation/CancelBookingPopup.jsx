import React, { memo, useState } from 'react';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import {
  MenuItem,
  Select,
  FormGroup,
  TextField,
  FormControl,
  DialogContent,
  DialogActions,
  ListSubheader,
} from '@mui/material';
import ConfirmToCancelBookingPopup from './ConfirmToCancelBookingPopup';
const CancelBookingPopup = ({ cancelBookingPopup, openCancelBooking }) => {
  const [cancelBookingValues, setCancelBookingValues] = useState({
    reason: '',
    cancel_notes: '',
  });
  const [confirmToCancelBookingPopup, setConfirmToCancelBookingPopup] =
    useState(false);

  const closeCancelBookingPopup = () => {
    openCancelBooking(false);
    setConfirmToCancelBookingPopup(false);
  };
  return (
    <>
      <BootstrapDialog
        aria-labelledby="CancelBooking-title"
        open={cancelBookingPopup}
        className="extra_small_popup"
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            reason: '',
            cancel_notes: '',
          }}
          validationSchema={Yup.object().shape({
            reason: Yup.string().required('Reason is a required field'),
          })}
          onSubmit={values => {
            setCancelBookingValues(values);
            setConfirmToCancelBookingPopup(true);
          }}
        >
          {({ handleSubmit, handleChange, setFieldValue, values }) => (
            <Form onSubmit={handleSubmit}>
              <BootstrapDialogTitle
                id="CancelBooking-title"
                onClose={() => openCancelBooking(false)}
              >
                Cancel Booking
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <div className="popup_content_wrap">
                  <h5>
                    Why is this being cancelled?
                    <sup className="text_primary">*</sup>
                  </h5>
                  <FormGroup className="input_wrap">
                    <FormControl className="mb-3">
                      <Select
                        defaultValue="Select a Reason"
                        id="grouped-select"
                        name="reason"
                        value={values.reason}
                        onChange={handleChange}
                      >
                        <MenuItem value="Select a Reason" disabled>
                          Select a Reason
                        </MenuItem>
                        <MenuItem value={0}>Duplicate Booking/Enquiry</MenuItem>
                        <MenuItem value={1}>
                          No Response - Releasing Places
                        </MenuItem>
                        <ListSubheader>
                          Customer Requested Cancelation
                        </ListSubheader>
                        <MenuItem value={2.1} className="ps-4">
                          Booked elsewhere
                        </MenuItem>
                        <MenuItem value={2.2} className="ps-4">
                          No longer having Xmas party
                        </MenuItem>
                        <MenuItem value={2.3} className="ps-4">
                          Package/Prices not acceptable
                        </MenuItem>
                        <MenuItem value={2.4} className="ps-4">
                          Covid 19
                        </MenuItem>
                        <MenuItem value={2.5} className="ps-4">
                          Customer Requested Cancelation - Other Reason
                        </MenuItem>
                        <MenuItem value={3}>
                          Test Booking / Booking Created in Error
                        </MenuItem>
                        <MenuItem value={4}>
                          Other - Cancelled for reason specified below
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <span className="d-block text-danger text_small">
                      <ErrorMessage name="reason" />
                    </span>
                    <FormControl>
                      <lable className="mb-2">
                        Please give more information below :
                      </lable>
                      <TextField
                        id="resolution_note"
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Enter reason detail, e.g. competitor name, issue reasons etc."
                        name="cancel_notes"
                        value={values?.cancel_notes}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </FormGroup>
                </div>
              </DialogContent>
              <DialogActions className="justify-content-center mb-3">
                <ul className="d-flex align-items-center justify-content-center">
                  <li>
                    <Button
                      className="btn_border small mx-2"
                      onClick={() => openCancelBooking(false)}
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
      <ConfirmToCancelBookingPopup
        confirmToCancelBookingPopup={confirmToCancelBookingPopup}
        cancelBookingValues={cancelBookingValues}
        closeCancelBookingPopup={closeCancelBookingPopup}
      />
    </>
  );
};

export default memo(CancelBookingPopup);
