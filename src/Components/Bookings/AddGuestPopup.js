import React, { useEffect, useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { Button, Col, Row } from 'react-bootstrap';
import * as Yup from 'yup';
import {
  bulkUpdateBookingGuest,
  createBookingGuest,
} from 'store/reducers/Booking/bookingGuest.slice';
import { requirementList } from 'utils/FieldValues';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import {
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Refresh from '../../Assets/Img/refresh.svg';
import Transh from '../../Assets/Img/trash.svg';
import CheckIcon from '../../Assets/Img/check-green.svg';
import CrossIcon from '../../Assets/Img/cross-red.svg';

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
export default function AddGuestPopup({
  closeAddGuest,
  addGuestPopup,
  OpenRebuidETicket,
  OpenDeleteETicket,
  editUser,
}) {
  const [requirement, setRequirement] = useState([]);
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    requirements: requirementList,
    is_attending: '',
  });
  useEffect(() => {
    if (editUser) {
      setInitialValues(editUser);
      setRequirement(editUser.requirements);
    }
  }, [editUser]);

  useEffect(() => {
    if (requirementList.length > 0) {
      setRequirement(requirementList);
    }
  }, []);

  const GuestSchema = Yup.object().shape({
    first_name: Yup.string().required('Please Enter Value'),
    last_name: Yup.string().required('Please Enter Value'),
    email: Yup.string()
      .required('Email is a required field')
      .test('email-or-none', 'Invalid email or "none"', function (value) {
        return value === 'none' || Yup.string().email().isValidSync(value);
      }),
  });
  const onItemCheck = (e, data) => {
    let tempListData = requirement.map(item => {
      if (item.title === data.title) {
        return {
          ...item,
          is_selected: e.target.checked,
        };
      }
      return item;
    });
    setRequirement(tempListData);
  };

  return (
    <BootstrapDialog
      aria-labelledby="CancelBooking-title"
      open={addGuestPopup}
      className="small_popup"
    >
      <BootstrapDialogTitle id="CancelBooking-title" onClose={closeAddGuest}>
        {editUser ? 'Edit Guest' : 'Add Guest'}
      </BootstrapDialogTitle>

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={GuestSchema}
        onSubmit={values => {
          let bookingGuest = {
            ...values,
            booking_id: bookingId,
            is_attending: Number(values.is_attending),
            requirements: requirement,
          };
          if (editUser) {
            const guest = {
              guests: [bookingGuest],
            };

            dispatch(
              bulkUpdateBookingGuest({
                _id: bookingId,
                bookingGuest: guest,
              }),
            );
          } else {
            dispatch(createBookingGuest(bookingGuest));
          }
          closeAddGuest();
        }}
      >
        {({
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          getFieldProps,
        }) => (
          <Form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <div className="popup_content_wrap">
                <ul>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label>First Name</label>
                        <sup className="text_primary">*</sup>
                      </Col>
                      <Col xs={7}>
                        <FormControl fullWidth className="main_input_wrap">
                          <TextField
                            id="firstName"
                            type="text"
                            variant="outlined"
                            name="first_name"
                            value={values.first_name}
                            {...getFieldProps('first_name')}
                          />
                        </FormControl>
                        <span className="d-block text-danger text_small">
                          <ErrorMessage name="first_name" />
                        </span>
                      </Col>
                    </Row>
                  </li>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label>Last Name</label>
                        <sup className="text_primary">*</sup>
                      </Col>
                      <Col xs={7}>
                        <FormControl fullWidth className="main_input_wrap">
                          <TextField
                            id="lastName"
                            type="text"
                            variant="outlined"
                            name="last_name"
                            value={values.last_name}
                            {...getFieldProps('last_name')}
                          />
                        </FormControl>
                        <span className="d-block text-danger text_small">
                          <ErrorMessage name="last_name" />
                        </span>
                      </Col>
                    </Row>
                  </li>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label>Email</label>
                        <sup className="text_primary">*</sup>
                      </Col>
                      <Col xs={7}>
                        <FormControl fullWidth className="main_input_wrap">
                          <TextField
                            id="lastName"
                            type="text"
                            variant="outlined"
                            name="email"
                            value={values.email}
                            {...getFieldProps('email')}
                          />
                        </FormControl>
                        <span className="text_small">
                          (Enter "none" if no email available)
                        </span>
                        <span className="d-block text-danger text_small">
                          <ErrorMessage name="email" />
                        </span>
                      </Col>
                    </Row>
                  </li>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-start">
                      <Col xs={5}>
                        <label>Requirements</label>
                      </Col>
                      <Col xs={7}>
                        <div className="guest_table_check">
                          <ul>
                            {requirement.map((data, index) => {
                              // Changed from initialValues.requirements to requirement
                              return (
                                <li key={index}>
                                  <div className="form-group checkbox_wrap mb-2">
                                    <FormGroup>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        className={
                                          data.title === 'Wheelchair User'
                                            ? 'text_primary'
                                            : ''
                                        }
                                        label={data.title}
                                        checked={data.is_selected}
                                        onChange={e => {
                                          onItemCheck(e, data);
                                          setFieldValue(
                                            `requirements.${data._id}.is_selected`,
                                            e.target.checked,
                                          ); // Update Formik state
                                        }}
                                      />
                                    </FormGroup>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li className="bg_gray_box px-3 py-2 mb-2">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <label>Attendance</label>
                      </Col>
                      <Col xs={7}>
                        <div className="guest_table_radio">
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="internal-label"
                              defaultValue="internalYes"
                              name="radio-buttons-group"
                              className="custom_radio"
                              value={values?.is_attending}
                              // onChange={handleChange}
                              onChange={e =>
                                setFieldValue('is_attending', e.target.value)
                              }
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
                      </Col>
                    </Row>
                  </li>
                  {editUser && (
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-start">
                        <Col xs={5}>
                          <label>Tkt</label>
                        </Col>
                        <Col xs={7}>
                          <div className="guest_tkt_wrap">
                            <ul>
                              <li>
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <TextField
                                    id="etickets_num"
                                    type="number"
                                    onWheel={e => e.target.blur()}
                                    variant="outlined"
                                    value={values.etickets_num}
                                    {...getFieldProps('etickets_num')}
                                  />
                                </FormControl>
                              </li>
                              <li>
                                {values?.eTicket_file !== '' ? (
                                  <img
                                    className="cursor-pointer"
                                    src={CheckIcon}
                                    alt="CheckIcon"
                                    onClick={() => {
                                      window.open(
                                        values?.eTicket_file,
                                        '_blank',
                                      );
                                    }}
                                  />
                                ) : (
                                  <img src={CrossIcon} alt="Cross Icon" />
                                )}
                              </li>
                              <li
                                className="cursor-pointer"
                                onClick={() => OpenRebuidETicket(editUser)}
                              >
                                <img src={Refresh} alt="CheckIcon" />
                              </li>
                              <li
                                className="cursor-pointer"
                                onClick={() => OpenDeleteETicket(editUser)}
                              >
                                <img src={Transh} alt="CheckIcon" />
                              </li>
                            </ul>
                          </div>
                        </Col>
                      </Row>
                    </li>
                  )}
                </ul>
              </div>
            </DialogContent>
            <DialogActions className="justify-content-end mb-3">
              <ul className="d-flex align-items-center justify-content-end">
                <li>
                  <Button
                    type="submit"
                    className="btn_primary small mx-2"
                    // onClick={closeAddGuest}
                  >
                    {editUser ? 'Edit Guest' : 'Add Guest'}
                  </Button>
                </li>
              </ul>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </BootstrapDialog>
  );
}
