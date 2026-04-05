import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import { Button } from 'react-bootstrap';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TrashIcon from '../../Assets/Img/trash.svg';

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
            color: color => color.palette.grey[600],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const DeletePopupModal = ({
  CloseDelete,
  deletePopup,
  onClickDelete,
  name,
  ok,
}) => {
  return (
    <>
      <Dialog
        aria-labelledby="CancelBooking-title"
        open={deletePopup}
        className="delete_popup"
      >
        <BootstrapDialogTitle
          id="CancelBooking-title"
          onClose={CloseDelete}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="delete_popup_wrap">
              <img src={TrashIcon} alt="Delete Icon" />
              <h2 className="mb-3">Are you sure ?</h2>
              <p>{name}</p>
              <ul className="d-flex align-items-center justify-content-center">
                <li>
                  <Button className="btn_border mx-2" onClick={CloseDelete}>
                    Cancel
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn_primary mx-2"
                    onClick={() => {
                      onClickDelete();
                      CloseDelete();
                    }}
                  >
                    {ok ? ok : 'Delete'}
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeletePopupModal;
