import { DialogActions, DialogContent } from '@mui/material';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';
import { memo } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  deleteBookingCoupon,
  updateBookingCoupon,
} from 'store/reducers/Booking/bookingCoupon.slice';
import Loader from 'Components/Common/Loader';
import { getEnquiriesData } from 'store/reducers/Enquiry/enquiries.slice';
import { Form, Formik } from 'formik';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { filterOnlyUpdatedFields } from 'utils/common';

const RenderTextField = memo(({ name, value, onChange, className }) => {
  return (
    <TextField
      id="ContractReceived"
      type="text"
      variant="outlined"
      className={className}
      name={name}
      value={value}
      onChange={onChange}
      multiline
      rows={3}
      placeholder={'Enter'}
    />
  );
});

const RenderCheckbox = memo(({ className, name, onClick, checked }) => {
  return (
    <FormControlLabel
      control={<Checkbox name={name} onClick={onClick} checked={checked} />}
      className={className}
    />
  );
});

const EditCouponPopup = ({ editCouponPopup, closeEditCoupon }) => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();

  const { bookingCouponLoading, bookingCouponDetail } = useSelector(
    ({ bookingCoupon }) => bookingCoupon,
  );

  return (
    <BootstrapDialog
      aria-labelledby="CancelBooking-title"
      open={editCouponPopup}
      className="small_popup"
    >
      {bookingCouponLoading && <Loader />}

      <BootstrapDialogTitle id="CancelBooking-title" onClose={closeEditCoupon}>
        Edit Coupon
      </BootstrapDialogTitle>
      <Formik
        enableReinitialize={true}
        initialValues={bookingCouponDetail}
        onSubmit={async values => {
          let payload = filterOnlyUpdatedFields(bookingCouponDetail, values);
          payload = {
            ...payload,
            reject_note: values?.is_rejected ? values?.reject_note : '',
            booking_id: values?.booking_id,
            coupon_id: values?.coupon_id,
          };
          closeEditCoupon();
          await dispatch(
            updateBookingCoupon({
              _id: bookingCouponDetail?._id,
              bookingCoupon: payload,
            }),
          );
        }}
      >
        {({ handleSubmit, handleChange, values }) => (
          <Form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <div className="popup_content_wrap">
                <ul>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-center">
                      <Col>
                        <label>Coupon :</label>
                      </Col>
                      <Col>
                        <FormGroup>
                          <FormControl>
                            <p className="m-0">
                              {values.sku} - {values.name}
                            </p>
                          </FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                  </li>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-center">
                      <Col>
                        <label>Mark as Accepted?: (optional) :</label>
                        <p>
                          If this coupon is valid please ensure this box is
                          ticked.
                        </p>
                      </Col>
                      <Col>
                        <FormGroup>
                          <FormControl>
                            <div className="form-group checkbox_wrap">
                              <FormGroup>
                                <RenderCheckbox
                                  name="is_accepted"
                                  checked={values.is_accepted}
                                  onClick={handleChange}
                                />
                              </FormGroup>
                            </div>
                          </FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                  </li>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-center">
                      <Col>
                        <label>Mark as Processed?: (optional)</label>
                        <p>
                          If this coupon has been processed please ensure this
                          box is ticked.
                        </p>
                      </Col>
                      <Col>
                        <FormGroup>
                          <FormControl>
                            <div className="form-group checkbox_wrap mb-2">
                              <FormGroup>
                                <RenderCheckbox
                                  name="is_processed"
                                  checked={values.is_processed}
                                  onClick={handleChange}
                                />
                              </FormGroup>
                            </div>
                          </FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                  </li>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-center">
                      <Col>
                        <label>Force Reject?: (optional)</label>
                        <p>
                          This will void this coupon against this booking and
                          ensure that the customer cannot re-add this coupon via
                          their online account.
                        </p>
                        <p>
                          Please add a note to explain why this coupon is marked
                          as reject.
                        </p>
                      </Col>
                      <Col>
                        <FormGroup>
                          <FormControl>
                            <div className="form-group checkbox_wrap mb-2">
                              <FormGroup>
                                <RenderCheckbox
                                  className="mb-3"
                                  name="is_rejected"
                                  checked={values.is_rejected}
                                  onClick={handleChange}
                                />
                                {/* {values.is_rejected  && ( */}
                                <FormControl className="small_select">
                                  <RenderTextField
                                    name="reject_note"
                                    value={values.reject_note}
                                    onChange={handleChange}
                                  />
                                </FormControl>
                                {/* )} */}
                              </FormGroup>
                            </div>
                          </FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                  </li>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-start">
                      <Col>
                        <label>Coupon Note: (internal / optional)</label>
                      </Col>
                      <Col>
                        <FormGroup>
                          <FormControl fullWidth className="small_select">
                            <RenderTextField
                              className="input_wrap"
                              name="note"
                              value={values.note}
                              onChange={handleChange}
                            />
                          </FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                  </li>
                </ul>
              </div>
            </DialogContent>
            <DialogActions className="justify-content-center mb-3">
              <ul className="d-flex align-items-center justify-content-center">
                <li>
                  <Button className="btn_primary small mx-2" type="submit">
                    Update Coupon
                  </Button>
                </li>
                {!(
                  bookingCouponDetail?.is_accepted &&
                  bookingCouponDetail?.is_processed
                ) && (
                  <li>
                    <Button
                      className="btn_primary small mx-2"
                      onClick={() => {
                        dispatch(deleteBookingCoupon(bookingCouponDetail?._id));
                        closeEditCoupon();
                      }}
                    >
                      Remove Coupon
                    </Button>
                  </li>
                )}
              </ul>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </BootstrapDialog>
  );
};
export default memo(
  EditCouponPopup,
  (prev, next) => prev.editCouponPopup === next.editCouponPopup,
);
