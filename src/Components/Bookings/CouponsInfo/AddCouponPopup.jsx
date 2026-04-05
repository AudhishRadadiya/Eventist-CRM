import { DialogContent } from '@mui/material';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';
import { memo, useEffect, useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createBookingCoupon } from 'store/reducers/Booking/bookingCoupon.slice';
import { getBookingCouponAvailableList } from 'store/reducers/Admin/Events/Coupon/Coupons/coupon.slice';
import Loader from 'Components/Common/Loader';

const AddCouponPopup = ({ addCouponPopup, closeAddCoupon }) => {
  const { getBookingCouponAvailableData, couponLoading } = useSelector(
    ({ coupon }) => coupon,
  );
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [couponId, setCouponId] = useState('');
  const [initialState, setInitialState] = useState({
    booking_id: bookingId,
    coupon_id: '',
    note: '',
  });
  useEffect(() => {
    if (addCouponPopup) dispatch(getBookingCouponAvailableList(bookingId));
  }, [addCouponPopup]);

  const handleSubmite = () => {
    if (couponId === '') {
      setErrorMessage('Please select an atleast one coupon');
    } else {
      dispatch(createBookingCoupon(initialState));
      setInitialState({});
      setCouponId('');
      closeAddCoupon();
    }
  };
  const handleChange = e => {
    const { name, value } = e.target;
    setInitialState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const renderOptions = useMemo(() => {
    return (listSubheader, options) => {
      return [
        <ListSubheader key={listSubheader}>{listSubheader}</ListSubheader>,
        ...options?.map(activeItem => (
          <MenuItem key={activeItem?._id} value={activeItem?._id}>
            {activeItem?.internal_name}
          </MenuItem>
        )),
      ];
    };
  }, []);

  const couponOptions = useMemo(() => {
    if (
      getBookingCouponAvailableData?.active_coupon?.length ||
      getBookingCouponAvailableData?.expired_coupon?.length
    ) {
      return (
        <>
          <ul>
            <li className="bg_gray_box px-3 py-2 mb-2">
              <Row className="align-items-center">
                <Col>
                  <label>Select Coupon :</label>
                </Col>
                <Col>
                  <FormGroup className="input_wrap">
                    <FormControl>
                      <Select
                        defaultValue="Please Select"
                        id="grouped-select"
                        name="coupon_id"
                        value={couponId}
                        onChange={e => {
                          if (e.target.value !== '') {
                            setErrorMessage('');
                          }
                          setCouponId(e.target.value);
                          handleChange(e);
                        }}
                      >
                        {renderOptions(
                          '--- Active ---',
                          getBookingCouponAvailableData?.active_coupon,
                        )}
                        {renderOptions(
                          '--- Expire ---',
                          getBookingCouponAvailableData?.expired_coupon,
                        )}
                      </Select>
                      {errorMessage !== '' && (
                        <span className="d-block text-danger text_small lookup_error">
                          {errorMessage}
                        </span>
                      )}
                    </FormControl>
                  </FormGroup>
                </Col>
              </Row>
            </li>
            <li className="bg_gray_box px-3 py-2 mb-2">
              <Row className="align-items-start">
                <Col>
                  <label>Coupon Note: (optional)</label>
                </Col>
                <Col>
                  <FormGroup className="input_wrap">
                    <FormControl fullWidth className="small_select">
                      <TextField
                        id="ContractReceived"
                        type="text"
                        multiline
                        rows={3}
                        variant="outlined"
                        className="input_wrap"
                        placeholder="Enter"
                        name="note"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </FormGroup>
                </Col>
              </Row>
            </li>
          </ul>
          <ul className="d-flex align-items-center justify-content-center">
            <li>
              <Button
                className="btn_primary small mx-2"
                onClick={handleSubmite}
              >
                Add Coupon
              </Button>
            </li>
          </ul>
        </>
      );
    } else {
      return (
        <ul>
          <li className="bg_gray_box px-3 py-2 mb-2">
            <Row className="align-items-center">
              <Col xs={4}>
                <label>Select Coupon :</label>
              </Col>
              <Col xs={8}>
                <FormGroup className="input_wrap">
                  <FormControl>
                    <TextField
                      type="text"
                      variant="outlined"
                      className="input_wrap"
                      value="Sorry, there are no coupons available for this booking"
                    />
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>
          </li>
        </ul>
      );
    }
  }, [getBookingCouponAvailableData, couponId, errorMessage]);

  if (couponLoading) return <Loader />;
  return (
    <BootstrapDialog
      aria-labelledby="CancelBooking-title"
      open={addCouponPopup}
      className="small_popup"
    >
      <BootstrapDialogTitle id="CancelBooking-title" onClose={closeAddCoupon}>
        Add Coupon
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <div className="popup_content_wrap">{couponOptions}</div>
      </DialogContent>
    </BootstrapDialog>
  );
};
export default memo(
  AddCouponPopup,
  (prev, next) => prev.addCouponPopup === next.addCouponPopup,
);
