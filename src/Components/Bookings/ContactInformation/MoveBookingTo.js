import { Button } from 'react-bootstrap';
import {
  FormControl,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import {
  getMoveBookingListData,
  moveBooking,
} from 'store/reducers/Booking/booking.slice';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { getEnquiriesData } from 'store/reducers/Enquiry/enquiries.slice';
import { useParams } from 'react-router-dom';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';
import { bookingPaymentInfo } from 'store/reducers/Booking/bookingPayment.slice';

export default function MoveBookingTo({
  moveBookingPopup,
  setMoveBookingPopup,
}) {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { moveBookingList, bookingLoading, isMoveUpdate } = useSelector(
    ({ booking }) => booking,
  );
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  const [moveBookingSelect, setMoveBookingSelect] = useState('');

  useEffect(() => {
    if (moveBookingPopup && enquirieDetail?.event_info) {
      dispatch(getEventListData());
      setMoveBookingSelect(enquirieDetail?.event_info?._id);
    }
  }, [moveBookingPopup]);

  useEffect(() => {
    if (moveBookingSelect) {
      dispatch(
        getMoveBookingListData({
          event_id: moveBookingSelect,
          booking_id: bookingId,
        }),
      );
    }
  }, [moveBookingSelect]);

  useEffect(() => {
    if (isMoveUpdate) {
      dispatch(getEnquiriesData(bookingId));
      setMoveBookingPopup(false);
      setTimeout(() => {
        dispatch(bookingPaymentInfo(bookingId));
      }, 5000);
    }
  }, [isMoveUpdate]);
  return (
    <>
      <BootstrapDialog
        aria-labelledby="customized-dialog2-title"
        open={moveBookingPopup}
        className="medium_popup"
      >
        <BootstrapDialogTitle
          id="customized-dialog2-title"
          onClose={() => setMoveBookingPopup(false)}
        >
          <div className="owner_select d-flex">
            {(eventLoading || bookingLoading) && <Loader />}
            <div className="form-group inline mb-1">
              <span className="label white_space_nowrap min_width_auto d-block">
                Move Booking to :
              </span>
              <FormControl fullWidth>
                <Select
                  labelId="Enquiries-label"
                  id="Enquiries"
                  value={moveBookingSelect}
                  onChange={event => setMoveBookingSelect(event.target.value)}
                  defaultValue="Select"
                  className="select_wrap"
                >
                  <MenuItem value="Select" disabled>
                    Select
                  </MenuItem>
                  {activeEventList?.map(item => {
                    return (
                      <MenuItem value={item?._id} key={item?._id}>
                        {item?.internal_name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="table_main_Wrapper popup_custom_table">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>£ Net</TableCell>
                      <TableCell>£ Gross</TableCell>
                      <TableCell></TableCell>
                      <TableCell>Available</TableCell>
                      <TableCell>Provisional</TableCell>
                      <TableCell>Confirmed</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {moveBookingList?.length > 0
                      ? moveBookingList?.map((element, index) => {
                          return (
                            <React.Fragment key={index}>
                              <TableRow className="full_row">
                                <TableCell colSpan={9}>
                                  {element?.year}
                                </TableCell>
                              </TableRow>
                              {element?.eventDate?.map(
                                (itemElement, itemIndex) => {
                                  return (
                                    <TableRow
                                      key={itemIndex}
                                      className={
                                        (itemElement?.ok_to_book &&
                                        itemElement?.current
                                          ? 'bg_highlight'
                                          : '') ||
                                        (itemElement?.is_active
                                          ? ''
                                          : 'disable_row')
                                      }
                                    >
                                      <TableCell>
                                        {moment(itemElement?.date).format(
                                          'ddd Do MMMM',
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        £{itemElement?.net?.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        £{itemElement?.gross?.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        {itemElement?.ok_to_book &&
                                          !itemElement?.current && (
                                            <Button
                                              className="btn_border small"
                                              onClick={() => {
                                                dispatch(
                                                  moveBooking({
                                                    booking_id: bookingId,
                                                    event_date_id:
                                                      itemElement?._id,
                                                    moveBookingList,
                                                  }),
                                                );
                                              }}
                                            >
                                              Move
                                            </Button>
                                          )}
                                      </TableCell>
                                      <TableCell>
                                        {itemElement?.available_places}/{' '}
                                        {itemElement?.over_book}
                                      </TableCell>
                                      <TableCell>
                                        {itemElement?.provisional}
                                      </TableCell>
                                      <TableCell>
                                        {itemElement?.confirmed}
                                      </TableCell>
                                      <TableCell>
                                        {itemElement?.status}
                                      </TableCell>
                                    </TableRow>
                                  );
                                },
                              )}
                            </React.Fragment>
                          );
                        })
                      : 'There are currently no dates listed for this event'}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
