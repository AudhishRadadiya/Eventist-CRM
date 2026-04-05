import React, { memo, useState } from 'react';
import {
  FormControlLabel,
  FormGroup,
  TableCell,
  TableRow,
} from '@mui/material';
import CheckIcon from '../../../Assets/Img/check-green.svg';
import CrossIcon from '../../../Assets/Img/cross-red.svg';
import Checkbox from '@mui/material/Checkbox';
import { Radio, RadioGroup } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import {
  deleteETicketGuestList,
  deleteReactiveBookingGuest,
  rebuildETicketGuestList,
} from 'store/reducers/Booking/bookingGuest.slice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddGuestPopup from '../AddGuestPopup';
import EditIcon from '../../../Assets/Img/edit.svg';

const GuestRow = ({ data }) => {
  const [deleteGuestId, setDeleteGuestdId] = useState('');
  const [deleteGuestPopup, setDeleteGuestPopup] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [addGuestPopup, setAddGuestPopup] = useState(false);
  const [deleteETicketPopup, setDeleteETicketPopup] = useState(false);
  const [deleteETicketId, setDeleteETicketdId] = useState('');
  const [rebuildPopup, setRebuildPopup] = useState(false);
  const [rebuildId, setRebuildId] = useState('');
  const dispatch = useDispatch();
  const { bookingId } = useParams();

  // delete guest
  const OpenGuestDelete = data => {
    setDeleteGuestdId(data);
    setDeleteGuestPopup(true);
  };
  const CloseGuestDelete = () => setDeleteGuestPopup(false);
  const deleteGuestListData = () => {
    let obj = { deleted: !deleteGuestId.deleted };
    dispatch(
      deleteReactiveBookingGuest({
        guest_id: deleteGuestId._id,
        booking_id: bookingId,
        obj,
      }),
    );
  };
  const closeAddGuest = () => {
    setAddGuestPopup(false);
    setEditUser(null);
  };
  const OpenRebuidETicket = data => {
    setRebuildId(data);
    setRebuildPopup(true);
  };
  const OpenDeleteETicket = data => {
    setDeleteETicketdId(data);
    setDeleteETicketPopup(true);
  };

  const CloseRebuidETicket = () => setRebuildPopup(false);

  const rebuildETicketListData = () =>
    dispatch(
      rebuildETicketGuestList({
        guest_id: rebuildId._id,
        booking_id: bookingId,
      }),
    );
  const CloseDeleteETicket = () => setDeleteETicketPopup(false);

  const deleteEticketListData = () =>
    dispatch(deleteETicketGuestList(deleteETicketId._id));

  return (
    <>
      <TableRow className={data.deleted ? 'bg_highlight' : ''}>
        <TableCell>
          <img
            src={data?.is_manager ? CheckIcon : CrossIcon}
            alt={data?.is_manager ? 'Check Icon' : 'Cross Icon'}
          />
        </TableCell>
        <TableCell>
          <FormControl fullWidth className="main_input_wrap">
            <span>{data.first_name}</span>
          </FormControl>
        </TableCell>
        <TableCell>
          <FormControl fullWidth className="main_input_wrap">
            <span>{data.last_name}</span>
          </FormControl>
        </TableCell>
        <TableCell>
          <FormControl fullWidth className="main_input_wrap">
            <span>{data.email}</span>
          </FormControl>
        </TableCell>
        <TableCell>
          <div className="guest_table_check">
            <ul>
              {data.requirements?.map((item, index) => {
                return (
                  <li key={index}>
                    <div className="form-group checkbox_wrap mb-2">
                      <FormGroup>
                        <FormControlLabel
                          className={
                            item?.title?.toLowerCase() === 'wheelchair user'
                              ? 'text_primary'
                              : ''
                          }
                          control={<Checkbox />}
                          label={item.title}
                          checked={item.is_selected}
                          disabled
                        />
                      </FormGroup>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </TableCell>
        <TableCell>
          <div className="guest_table_radio">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="internal-label"
                name="radio-buttons-group"
                value={data.is_attending}
                disabled
                className="custom_radio"
              >
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label="Attending"
                  className="w-100"
                />
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Not Attending"
                  className="w-100"
                />
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Don't Know"
                  className="w-100"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </TableCell>
        <TableCell>
          <FormControl fullWidth className="main_input_wrap">
            <span>{data.etickets_num}</span>
          </FormControl>
        </TableCell>
        <TableCell>
          <ul className="action_wrap d-flex align-items-center justify-content-between">
            <li
              className={`cursor-pointer`}
              onClick={() => {
                setEditUser(data);
                setAddGuestPopup(true);
              }}
            >
              <img src={EditIcon} alt="Edit Icon" />
            </li>
            <li className="p-0">
              <button
                type="button"
                className="btn_danger"
                onClick={() => OpenGuestDelete(data)}
              >
                {data.deleted ? 'Re-active' : 'Delete'}
              </button>
            </li>
          </ul>
        </TableCell>
      </TableRow>
      <AddGuestPopup
        closeAddGuest={closeAddGuest}
        addGuestPopup={addGuestPopup}
        editUser={editUser}
        OpenRebuidETicket={OpenRebuidETicket}
        OpenDeleteETicket={OpenDeleteETicket}
      />

      <DeletePopupModal
        CloseDelete={CloseRebuidETicket}
        deletePopup={rebuildPopup}
        onClickDelete={rebuildETicketListData}
        ok="ok"
        name="Are you sure you want to recreate named eTickets for this guest?"
      />
      <DeletePopupModal
        CloseDelete={CloseDeleteETicket}
        deletePopup={deleteETicketPopup}
        onClickDelete={deleteEticketListData}
        name="Are you sure you want to DELETE the eTicket file for this guest?"
      />
      <DeletePopupModal
        CloseDelete={CloseGuestDelete}
        deletePopup={deleteGuestPopup}
        onClickDelete={deleteGuestListData}
        ok={
          deleteGuestId?.deleted === false
            ? `Delete`
            : deleteGuestId?.deleted
            ? `ok`
            : ''
        }
        name={
          deleteGuestId?.deleted === false
            ? `Are you sure you want to delete this guest?`
            : deleteGuestId?.deleted
            ? `Are you sure you want to re-activate this guest?`
            : ''
        }
      />
    </>
  );
};

export default memo(GuestRow);
