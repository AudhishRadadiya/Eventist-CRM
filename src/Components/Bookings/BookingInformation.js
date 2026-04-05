import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  styled,
  FormGroup,
  TextField,
  FormControl,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import {
  getConfirmPlace,
  updateEnquiries,
} from 'store/reducers/Enquiry/enquiries.slice';
import { useDispatch, useSelector } from 'react-redux';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 19,
            top: 19,
            color: theme => theme.palette.grey[600],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function BookingInformation({ pages, enquirieDetail }) {
  const dispatch = useDispatch();

  const { userPermissionDetail } = useSelector(({ user }) => user);

  const [bookingUpdate, setBookingUpdate] = useState(false);

  const [placeValue, setPlaceValue] = useState('');
  const [confirmPopup, setConfirmPopup] = useState(false);

  const bookingCreated = enquirieDetail?.booking_info?.booking_created;
  const lastUpdated = enquirieDetail?.booking_info?.last_updated_at;

  const OpenConfirmPopup = () => {
    setConfirmPopup(true);
  };
  const CloseConfirmPopup = () => {
    setConfirmPopup(false);
  };

  useEffect(() => {
    if (enquirieDetail) {
      setPlaceValue(enquirieDetail?.booking_info?.places);
    }
  }, [enquirieDetail]);

  const handleBookingInfo = () => {
    dispatch(
      updateEnquiries({
        _id: enquirieDetail?._id,
        places: placeValue ? Number(placeValue) : '',
      }),
    );
    if (confirmPopup) {
      setConfirmPopup(false);
    }
    setBookingUpdate(true);
  };

  return (
    <>
      <div className="card_wrapper mb-4">
        <div
          className={`card_header d-flex align-items-center justify-content-between py-2 px-3 ${
            pages === 'enquiries' ? 'enquiry' : ''
          }`}
        >
          <h4 className="m-0 py-1 text_white">Booking Information</h4>
        </div>
        <div className="card_body">
          <ul>
            <li>
              <label className="fw_500">Booking Created:</label>
              <div className="right_content">
                <p className="m-0">
                  <span className="text_light">
                    {bookingCreated ? moment(bookingCreated).format('ddd') : ''}
                  </span>{' '}
                  {bookingCreated
                    ? moment(bookingCreated).format('Do MMMM  YYYY')
                    : ''}{' '}
                  <span className="text_light">
                    {bookingCreated
                      ? moment(bookingCreated).format('h:mm:ss')
                      : ''}
                  </span>
                </p>
              </div>
            </li>
            {pages === 'enquiries' && (
              <li>
                <label className="fw_500">Places :</label>
                <div className="right_content">
                  <div className="d-flex align-items-center justify-content-between">
                    <FormGroup className="input_wrap w-50">
                      <FormControl fullWidth className="small_select">
                        <TextField
                          id="Due_input"
                          type="number"
                          onWheel={e => e.target.blur()}
                          variant="outlined"
                          className="input_wrap"
                          placeholder="Enter place value"
                          value={placeValue}
                          onChange={e => setPlaceValue(e.target.value)}
                        />
                      </FormControl>
                    </FormGroup>
                    {pages === 'booking' ? (
                      <Button
                        className="btn_border small"
                        onClick={OpenConfirmPopup}
                      >
                        {bookingUpdate ? 'Updated' : 'Update Places'}
                      </Button>
                    ) : (
                      <Button
                        className="btn_border small"
                        onClick={handleBookingInfo}
                      >
                        {bookingUpdate ? 'Updated' : 'Update Places'}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            )}
            {pages === 'booking' && (
              <>
                <li>
                  <label className="fw_500">Provisional:</label>
                  <div className="right_content">
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="m-0">
                        {enquirieDetail?.booking_info?.provisional_places}
                      </p>
                      {!enquirieDetail?.is_cancelled &&
                        userPermissionDetail?.admin &&
                        userPermissionDetail?.canconfirm && (
                          <>
                            {enquirieDetail?.booking_info
                              ?.provisional_places !== 0 && (
                              <Button
                                className="btn_border small"
                                onClick={() => {
                                  dispatch(
                                    getConfirmPlace(enquirieDetail?._id),
                                  );
                                }}
                              >
                                Confirmed places
                              </Button>
                            )}
                          </>
                        )}
                    </div>
                  </div>
                </li>
                <li>
                  <label className="fw_500">Confirmed:</label>
                  <div className="right_content">
                    <p className="m-0">
                      {enquirieDetail?.booking_info?.confirmed_places}
                    </p>
                  </div>
                </li>
              </>
            )}
            <li>
              <label className="fw_500">Last Update:</label>
              <div className="right_content">
                <p className="m-0">
                  <span className="text_light">
                    {' '}
                    {moment(lastUpdated).format('ddd')}
                  </span>{' '}
                  {moment(lastUpdated).format('Do MMMM  YYYY')}{' '}
                  <span className="text_light">
                    - {moment(lastUpdated).format('h:mm:ss')}
                  </span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <BootstrapDialog
        aria-labelledby="CancelBooking-title"
        open={confirmPopup}
        className="small_popup"
      >
        <BootstrapDialogTitle
          id="CancelBooking-title"
          onClose={CloseConfirmPopup}
        >
          Confirm
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <p className="m-0 text-center">
              Are you sure you want to CONFIRM these places? Note: this cannot
              be undone
            </p>
          </div>
        </DialogContent>
        <DialogActions className="justify-content-center mb-3">
          <ul className="d-flex align-items-center justify-content-center">
            <li>
              <Button
                className="btn_border small mx-2"
                onClick={CloseConfirmPopup}
              >
                Cancel
              </Button>
            </li>
            <li>
              <Button
                className="btn_primary small mx-2"
                onClick={handleBookingInfo}
              >
                Ok
              </Button>
            </li>
          </ul>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
