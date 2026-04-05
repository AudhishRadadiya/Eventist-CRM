import { memo, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import {
  FormGroup,
  TextField,
  FormControl,
  DialogContent,
} from '@mui/material';
import Loader from 'Components/Common/Loader';
import PlusIcon from '../../../Assets/Img/plus.svg';
import MinusIcon from '../../../Assets/Img/minus.svg';
import CrossIcon from '../../../Assets/Img/cross-red.svg';
import { numberRegex } from 'utils/common';
import { useDispatch, useSelector } from 'react-redux';
import {
  getHistoryPlace,
  setIsHistoryPlace,
  updatePlaceBy,
} from 'store/reducers/Booking/changePlace.slice';
import { useParams } from 'react-router-dom';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';
import ContactDetails from './ContactDetails';
import ChangePlaceHistory from './ChangePlaceHistory';
import { getEnquiriesData } from 'store/reducers/Enquiry/enquiries.slice';
import { bookingPaymentInfo } from 'store/reducers/Booking/bookingPayment.slice';

const ChangePlace = ({ open, handleClose, place }) => {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const { userPermissionDetail } = useSelector(({ user }) => user);
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  const { historyPlaceLoading, isPlaceHistoryUpdate } = useSelector(
    ({ changePlace }) => changePlace,
  );
  const [increasePlacesBy, setIncreasePlacesBy] = useState('');
  const [decreasePlacesBy, setDecreasePlacesBy] = useState('');
  const [incTotal, setIncTotal] = useState('');
  const [decrTotal, setDecrTotal] = useState('');
  const [increasePlacesError, setIncreasePlacesError] = useState('');
  const [decreasePlacesError, setDecreasePlacesError] = useState('');

  useEffect(() => {
    if (open) dispatch(getHistoryPlace(bookingId));
  }, [open]);

  useEffect(() => {
    if (isPlaceHistoryUpdate) {
      closeClick();
      dispatch(setIsHistoryPlace(false));
    }
  }, [isPlaceHistoryUpdate]);

  const handleIncreasePlace = () => {
    if (increasePlacesBy === '') {
      setIncreasePlacesError('Please enter increase place');
    } else {
      setIncreasePlacesError('');
      dispatch(
        updatePlaceBy({
          booking_id: bookingId,
          values: {
            places_change_by: Number(increasePlacesBy),
            ...(place === 'max'
              ? { is_max_places_change: true }
              : { is_inc: true }),
          },
        }),
      );
    }
  };

  const handleDecreasePlace = () => {
    if (decreasePlacesBy === '') {
      setDecreasePlacesError('Please enter decrease place');
    } else if (
      decreasePlacesBy >
      enquirieDetail?.booking_info?.confirmed_places +
        enquirieDetail?.booking_info?.provisional_places
    ) {
      setDecreasePlacesError('Not enough places booked');
    } else {
      setDecreasePlacesError('');
      dispatch(
        updatePlaceBy({
          booking_id: bookingId,
          values: {
            places_change_by: Number(decreasePlacesBy),
            ...(place === 'max'
              ? { is_max_places_change: false }
              : { is_inc: false }),
          },
        }),
      );
    }
  };
  const increasePlace = () => {
    if (
      (userPermissionDetail?.admin || userPermissionDetail?.super) &&
      userPermissionDetail?.changeplaces
    ) {
      handleIncreasePlace();
    } else return;
  };
  const decreasePlace = () => {
    if (
      (userPermissionDetail?.admin || userPermissionDetail?.super) &&
      userPermissionDetail?.changeplaces
    ) {
      handleDecreasePlace();
    } else return;
  };
  const closeClick = () => {
    setIncreasePlacesError('');
    setDecreasePlacesError('');
    setIncreasePlacesBy('');
    setDecreasePlacesBy('');
    handleClose();
  };

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog2-title"
      open={open}
      className="medium_popup"
    >
      {historyPlaceLoading && <Loader />}
      <BootstrapDialogTitle id="customized-dialog2-title" onClose={closeClick}>
        {place === 'max' ? 'Change Maximum Places Booked' : 'Change Places'}
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <div className="popup_content_wrap">
          <Row>
            <Col xs={7}>
              {!place && <ContactDetails />}
              {place === 'max' && (
                <div className="popup_content_inner h-100">
                  <div className="bg_gray_box p-3 h-100">
                    <p>
                      Administrators can change the maximum places count to
                      alter the retained deposits for each booking.
                    </p>
                    <p>
                      NOTE: If you have already got deposit payments or invoices
                      attached to this booking they NEED TO BE REVERSED and
                      re-entered AFTER you have changed the maximum places
                      value.
                    </p>
                    <p>
                      This change does not affect the current placed booked but
                      only the maximum amount of places ever booked that is
                      stored in the system.
                    </p>
                  </div>
                </div>
              )}
            </Col>
            <Col xs={5}>
              {enquirieDetail?.is_invoice ||
              ((userPermissionDetail?.admin || userPermissionDetail?.super) &&
                userPermissionDetail?.changeplaces) ? (
                <>
                  <div className="popup_content_inner">
                    <ul className="mb-3 changes_places">
                      <li className="pb-3 flex-wrap">
                        <label className="w-100">
                          Increase Places By:
                          <sup className="text_primary">*</sup>
                        </label>
                        <div className="right_content w-100">
                          <div className="d-flex align-items-center">
                            <FormGroup>
                              <FormControl fullWidth className="small_select">
                                <TextField
                                  id="Discount"
                                  type="number"
                                  onKeyDown={e => {
                                    numberRegex(e);
                                  }}
                                  variant="outlined"
                                  className="input_wrap"
                                  inputProps={{
                                    min: 0,
                                    step: 'any',
                                  }}
                                  disabled={
                                    (userPermissionDetail?.admin ||
                                      userPermissionDetail?.super) &&
                                    userPermissionDetail?.changeplaces
                                      ? false
                                      : true
                                  }
                                  value={increasePlacesBy}
                                  onChange={e => {
                                    if (e.target.value !== '') {
                                      setIncreasePlacesError('');
                                    }
                                    setIncreasePlacesBy(e.target.value);
                                    if (place === 'max') {
                                      setIncTotal(
                                        Number(e.target.value) +
                                          enquirieDetail?.max_places,
                                      );
                                    } else {
                                      setIncTotal(
                                        Number(e.target.value) +
                                          enquirieDetail?.booking_info
                                            ?.confirmed_places +
                                          enquirieDetail?.booking_info
                                            ?.provisional_places,
                                      );
                                    }
                                  }}
                                />
                                {increasePlacesError !== '' && (
                                  <span className="d-block text-danger text_small lookup_error">
                                    {increasePlacesError}
                                  </span>
                                )}
                              </FormControl>
                            </FormGroup>
                            {increasePlacesBy >
                            enquirieDetail?.booking_info?.overbook_maximum ? (
                              <Button className="btn_plus ms-2">
                                <img src={CrossIcon} alt="Cross Icon" />
                              </Button>
                            ) : (
                              <>
                                <Button
                                  className="btn_plus ms-2"
                                  onClick={increasePlace}
                                >
                                  <img src={PlusIcon} alt="Plus Icon" />
                                </Button>
                                <span className="ms-3">
                                  {increasePlacesBy !== ''
                                    ? ' To ' + incTotal
                                    : ''}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                      <li className="pb-3 flex-wrap">
                        <label className="w-100">
                          Decrease Places By:
                          <sup className="text_primary">*</sup>
                        </label>
                        <div className="right_content w-100">
                          <div className="d-flex">
                            <FormGroup>
                              <FormControl fullWidth className="small_select">
                                <TextField
                                  id="Discount"
                                  type="number"
                                  variant="outlined"
                                  className="input_wrap"
                                  onKeyDown={e => {
                                    numberRegex(e);
                                  }}
                                  inputProps={{
                                    min: 0,
                                    step: 'any',
                                  }}
                                  disabled={
                                    (userPermissionDetail?.admin ||
                                      userPermissionDetail?.super) &&
                                    userPermissionDetail?.changeplaces
                                      ? false
                                      : true
                                  }
                                  value={decreasePlacesBy}
                                  onChange={e => {
                                    if (e.target.value !== '') {
                                      setDecreasePlacesError('');
                                    }
                                    setDecreasePlacesBy(e.target.value);
                                    if (place === 'max') {
                                      setDecrTotal(
                                        Number(e.target.value) -
                                          enquirieDetail?.max_places,
                                      );
                                    } else {
                                      setDecrTotal(
                                        Number(e.target.value) -
                                          (enquirieDetail?.booking_info
                                            ?.confirmed_places +
                                            enquirieDetail?.booking_info
                                              ?.provisional_places),
                                      );
                                    }
                                  }}
                                />
                                {decreasePlacesError !== '' && (
                                  <span className="d-block text-danger text_small lookup_error">
                                    {decreasePlacesError}
                                  </span>
                                )}
                              </FormControl>
                            </FormGroup>
                            <Button
                              className="btn_plus ms-2"
                              onClick={decreasePlace}
                            >
                              <img src={MinusIcon} alt="Minus Icon" />
                            </Button>
                            <span className="ms-3">
                              {decreasePlacesBy !== ''
                                ? ' To ' + Math.abs(decrTotal)
                                : ''}
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <ChangePlaceHistory />
                  </div>
                </>
              ) : (
                <p className="text-center mt-4 mx-5">
                  This booking has already been invoiced - changing places now
                  will create a credit note and re-invoice for the new amount.
                  Places can only be changed by the customer online or by an
                  administrator once all the relevant paperwork has ben
                  collected.
                </p>
              )}
            </Col>
          </Row>
        </div>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default memo(ChangePlace);
