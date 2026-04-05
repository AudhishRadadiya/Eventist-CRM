import { memo, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FormGroup, TextField, FormControl } from '@mui/material';
import { updateEnquiries } from 'store/reducers/Enquiry/enquiries.slice';
import { useDispatch, useSelector } from 'react-redux';
import ChangePlace from '../ChangePlace/ChangePlace';
import { numberRegexE } from 'utils/common';
import { bookingPaymentInfo } from 'store/reducers/Booking/bookingPayment.slice';
import PaymentOtherInfo from './PaymentOtherInfo';
import { useParams } from 'react-router-dom';

const PaymentInformation = ({ pages }) => {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  const [open, setOpen] = useState(false);
  const [discountUpdate, setDiscountUpdate] = useState(false);
  const [discount, setDiscount] = useState(0);

  const { bookingPaymentInfoData } = useSelector(
    ({ bookingPayment }) => bookingPayment,
  );

  const fetchRequiredData = useCallback(async () => {
    const res = await dispatch(bookingPaymentInfo(bookingId));

    if (res?.payload) {
      setDiscount(res?.payload.discount);
    }
  }, [bookingId, dispatch]);

  useEffect(() => {
    fetchRequiredData();
  }, []);

  useEffect(() => {
    if (enquirieDetail?.payment_info?.discount)
      setDiscount(enquirieDetail?.payment_info?.discount?.toFixed(2));
  }, [enquirieDetail]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="card_wrapper mb-4">
        <div
          className={`card_header d-flex align-items-center justify-content-between py-2 px-3 ${
            pages === 'enquiries' ? 'enquiry' : ''
          }`}
        >
          <h4 className="m-0 py-1 text_white">Payment Information</h4>
        </div>
        <div className="card_body">
          <ul>
            <li>
              <label className="fw_500">Discount:</label>
              <div className="right_content">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FormGroup className="input_wrap w-60">
                      <FormControl fullWidth className="small_select">
                        <TextField
                          id="Discount"
                          type="number"
                          variant="outlined"
                          className="input_wrap"
                          placeholder="Enter discount"
                          onKeyDown={e => {
                            numberRegexE(e);
                          }}
                          inputProps={{ min: 0, step: 'any' }}
                          value={discount}
                          onChange={e => {
                            setDiscount(e.target.value);
                          }}
                          onFocus={() => {
                            if (discount == '0.00') {
                              setDiscount('');
                            }
                          }}
                          // changes as per click up requirement
                          onBlur={() => {
                            if (discount === '') {
                              setDiscount(0);
                            }
                          }}
                        />
                      </FormControl>
                    </FormGroup>
                    <span className="ms-2">%</span>
                  </div>
                  <Button
                    className="btn_border small"
                    onClick={async () => {
                      const res = await dispatch(
                        updateEnquiries({
                          _id: enquirieDetail?._id,
                          discount: discount,
                        }),
                      );

                      if (res?.payload) {
                        dispatch(bookingPaymentInfo(bookingId));
                      }

                      setDiscountUpdate(true);
                    }}
                  >
                    {discountUpdate ? 'Updated' : 'Update Discount'}
                  </Button>
                </div>
              </div>
            </li>
            <PaymentOtherInfo handleClickOpen={handleClickOpen} pages={pages} />
          </ul>
        </div>
      </div>
      <ChangePlace open={open} handleClose={handleClose} place="max" />
    </>
  );
};

export default memo(PaymentInformation);
