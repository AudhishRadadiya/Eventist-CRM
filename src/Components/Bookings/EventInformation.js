import React, { memo, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { DateTimePicker } from '@mui/x-date-pickers';
import CallMadeIcon from '@mui/icons-material/CallMade';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Stack,
  Pagination,
  FormGroup,
} from '@mui/material';
import * as Yup from 'yup';
import useSortable from 'utils/useSortable';
import {
  addTax,
  formatNumberWithCommas,
  getPaginationData,
  getTotalPages,
  numberRegex,
  toMoney,
} from 'utils/common';

import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  createEventEnquiries,
  deleteEnquiryEvent,
  getEventEnquiriesData,
  getEventEnquiriesListData,
  setEnquiriesEventDetail,
  setIsEnquiriesEventUpdated,
  updateEventEnquiries,
} from 'store/reducers/Enquiry/Event/enquiriesEvent.slice.js';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';

import Loader from 'Components/Common/Loader';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import { ErrorMessage, Form, Formik } from 'formik';
import {
  createBooking,
  setCreatedBookingId,
  setIsBookingUpdated,
} from 'store/reducers/Booking/booking.slice';
import {
  getEnquiriesData,
  setEnquirieDetail,
  updateEnquiries,
} from 'store/reducers/Enquiry/enquiries.slice';

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

let pageSize = 5;

const EventInformation = ({ pages, enquirieDetail }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const initialValuesEvent = {
    event_id: null,
    enquiry_date: '',
    enquiry_id: bookingId,
  };
  const [eventList, setEventList] = useState(initialValuesEvent);
  const [customDepositPopup, setCustomDepositPopup] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setEventList(initialValuesEvent);
    dispatch(setEnquiriesEventDetail({}));
    setOpen(false);
  };

  const {
    enquiriesEventList,
    enquiriesEventLoading,
    isEnquiriesEventUpdated,
    enquiriesEventDetail,
  } = useSelector(({ enquiriesEvent }) => enquiriesEvent);

  const { enquirieLoading, isEnquirieUpdated } = useSelector(
    ({ enquiries }) => enquiries,
  );

  const { activeEventList } = useSelector(({ parties }) => parties);
  const { isBookingUpdated, CreatedBookingEnquiryId, bookingLoading } =
    useSelector(({ booking }) => booking);

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  useEffect(() => {
    if (open) {
      dispatch(getEventListData());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (Object.values(enquiriesEventDetail)?.length > 0) {
      setEventList({
        event_id: enquiriesEventDetail?.event?._id
          ? enquiriesEventDetail?.event?._id
          : '',
        enquiry_date: enquiriesEventDetail?.enquiry_date
          ? enquiriesEventDetail?.enquiry_date
          : '',
        enquiry_id: enquiriesEventDetail?.enquiry_id
          ? enquiriesEventDetail?.enquiry_id
          : '',
      });
    }
  }, [enquiriesEventDetail]);

  useEffect(() => {
    if (window.location.pathname.includes('/edit-enquiries')) {
      dispatch(getEventEnquiriesListData(bookingId));
    }
    return () => {
      dispatch(setCreatedBookingId(''));
    };
  }, []);
  useEffect(() => {
    if (isEnquirieUpdated) {
      dispatch(getEnquiriesData(bookingId));
      setOpen(false);
    }
  }, [isEnquirieUpdated]);

  useEffect(() => {
    if (isEnquiriesEventUpdated) {
      dispatch(getEventEnquiriesListData(bookingId));
      dispatch(setIsEnquiriesEventUpdated(false));
    }
  }, [isEnquiriesEventUpdated]);

  useEffect(() => {
    if (isBookingUpdated) {
      if (CreatedBookingEnquiryId !== '') {
        dispatch(setEnquirieDetail({}));
        navigate(`/edit-bookings/${CreatedBookingEnquiryId}`);
      }
      dispatch(setIsBookingUpdated(false));
    }
  }, [isBookingUpdated]);

  const OpenDelete = data => {
    setDeleteId(data);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const eventInfoValidation = Yup.object().shape({
    event_id: Yup.string().required('Event is a required field'),
  });

  const deleteEventInfo = () => {
    dispatch(
      deleteEnquiryEvent({
        _id: deleteId?._id,
      }),
    );
  };

  const setCurrentBillableItemsHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(enquiriesEventList, pageSize);
    return totalActiveRecordCount;
  }, [enquiriesEventList]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      enquiriesEventList,
      currentPage?.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentBillableItemsHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [enquiriesEventList, currentPage?.activeCurrentPage]);

  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);

  return (
    <>
      <div className="card_wrapper mb-4">
        {(enquiriesEventLoading || bookingLoading || enquirieLoading) && (
          <Loader />
        )}
        <div
          className={`card_header d-flex align-items-center justify-content-between py-2 px-3 ${
            pages === 'enquiries' ? 'enquiry' : ''
          }`}
        >
          <h4 className="m-0 py-1 text_white">Event Information</h4>
        </div>

        <div className="card_body">
          {pages === 'booking' && (
            <ul>
              <li>
                <label className="fw_500">Event:</label>
                <div className="right_content">
                  <p className="m-0 d-flex align-items-center justify-content-between">
                    {enquirieDetail?.event_info?.internal_name}{' '}
                    {/* <Button className="btn_border small">
                      Update Reference
                    </Button> */}
                  </p>
                </div>
              </li>
              <li>
                <label className="fw_500">Venue:</label>
                <div className="right_content">
                  <p className="m-0">
                    {enquirieDetail?.event_info?.venue?.internal_name}
                  </p>
                </div>
              </li>
              <li>
                <label className="fw_500">Theme:</label>
                <div className="right_content">
                  <p className="m-0">
                    {enquirieDetail?.event_info?.theme?.internal_name}
                  </p>
                </div>
              </li>
              <li>
                <label className="fw_500">Date:</label>
                <div className="right_content">
                  <p
                    className="m-0 d-flex justify-content-between"
                    style={{
                      color: `${enquirieDetail?.event_info?.event_date?.status?.colour}`,
                    }}
                  >
                    {enquirieDetail?.event_info?.event_date?.status?.name}
                  </p>
                  <p className="m-0 d-flex justify-content-between">
                    {moment(
                      enquirieDetail?.event_info?.event_date?.date,
                    ).format('ddd Do MMM YYYY')}
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/bookings`, {
                          state: {
                            event: `${enquirieDetail?.event_info?._id}`,
                            date: `${enquirieDetail?.event_info?.event_date?._id}`,
                            event_date: `${enquirieDetail?.event_info?.event_date?.date}`,
                          },
                        });
                      }}
                    >
                      <CallMadeIcon />
                    </span>
                  </p>
                </div>
              </li>
              <li>
                <label className="fw_500">Ticket Price:</label>
                <div className="right_content">
                  <p className="m-0">
                    £
                    {formatNumberWithCommas(
                      toMoney(enquirieDetail?.event_info?.ticket_price),
                    )}
                    <span className="text_light">
                      {' '}
                      / £
                      {formatNumberWithCommas(
                        toMoney(
                          addTax(
                            enquirieDetail?.event_info?.ticket_price,
                            enquirieDetail?.event_info?.tax_code?.percentage,
                          ),
                        ),
                      )}{' '}
                      {enquirieDetail?.event_info?.tax_code?.public_name ||
                      enquirieDetail?.event_info?.tax_code?.percentage
                        ? '@'
                        : ''}{' '}
                      {enquirieDetail?.event_info?.tax_code?.percentage
                        ? enquirieDetail?.event_info?.tax_code?.percentage %
                            1 ===
                          0
                          ? `${enquirieDetail?.event_info?.tax_code?.percentage} %`
                          : `${enquirieDetail?.event_info?.tax_code?.percentage?.toFixed(
                              2,
                            )}%`
                        : ''}
                      {enquirieDetail?.event_info?.tax_code?.public_name
                        ? `(${enquirieDetail?.event_info?.tax_code?.public_name})`
                        : ''}
                    </span>
                  </p>
                </div>

                {/* not in use */}
                {/* {enquirieDetail?.event_info?.event_deposit_override && (
                  <div className="right_content">
                    <p className="m-0">
                      £
                      {toMoney(
                        enquirieDetail?.event_info?.event_deposit_override,
                      )}
                      <span className="text_light">
                        / £
                        {toMoney(
                          addTax(
                            enquirieDetail?.event_info?.event_deposit_override,
                            enquirieDetail?.event_info?.tax_code?.percentage,
                          ),
                        )}{' '}
                        @{' '}
                        <span id="dateTaxPC">
                          {enquirieDetail?.event_info?.tax_code?.percentage}
                        </span>{' '}
                        {enquirieDetail?.event_info?.tax_code?.public_name}
                      </span>
                    </p>
                  </div>
                )} */}
              </li>
              <li>
                <label className="fw_500">Deposit Amount:</label>
                <div className="right_content">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="m-0">
                      £
                      {formatNumberWithCommas(
                        enquirieDetail?.event_info?.event_deposit_amount?.toFixed(
                          2,
                        ),
                      )}
                    </p>
                    {!customDepositPopup && (
                      <Button
                        className="btn_border small"
                        onClick={() =>
                          setCustomDepositPopup(!customDepositPopup)
                        }
                      >
                        Set Custom Deposit
                      </Button>
                    )}
                    {customDepositPopup && (
                      <div className="d-flex justify-content-end align-items-center">
                        <FormGroup className="input_wrap w-50 me-2">
                          <FormControl fullWidth className="small_select">
                            <TextField
                              id="Discount"
                              type="number"
                              variant="outlined"
                              className="input_wrap"
                              placeholder="Enter deposit amount"
                              onKeyDown={e => {
                                numberRegex(e);
                              }}
                              inputProps={{
                                min: 0,
                                step: 'any',
                              }}
                              value={depositAmount}
                              onChange={e => {
                                setDepositAmount(e.target.value);
                              }}
                            />
                          </FormControl>
                        </FormGroup>
                        <Button
                          className="btn_border small"
                          onClick={() => {
                            dispatch(
                              updateEnquiries({
                                _id: enquirieDetail?._id,
                                event_deposit_amount: depositAmount,
                              }),
                            );
                            // setCustomDepositPopup(true);
                            setCustomDepositPopup(!customDepositPopup);
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          )}
          {pages === 'enquiries' && (
            <>
              <div className="bg_gray_box table_main_Wrapper table_content_show">
                <TableContainer component={Paper} className="default_table">
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <span onClick={() => requestSortActive('event')}>
                            Venue
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            onClick={() => requestSortActive('enquiry_date')}
                          >
                            Date
                          </span>
                        </TableCell>
                        <TableCell>
                          <span onClick={() => requestSortActive('places')}>
                            Places
                          </span>
                        </TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* <TableRow className="bg_highlight">
                        <TableCell colSpan={4} >
                          DOWNGRADED FROM THIS DATE
                        </TableCell>
                      </TableRow> */}
                      {itemsActive?.map((element, index) => {
                        const downgradedFromThis =
                          element.event_id === enquirieDetail.event_id &&
                          enquirieDetail.event_date_id === element.event_date_id
                            ? true
                            : false;
                        return (
                          <>
                            {downgradedFromThis ? (
                              <TableRow>
                                <span
                                  style={{
                                    background: '#333399',
                                    color: '#ffffff ',
                                    padding: '5px',
                                    borderRadius: '10px 10px 0px 0px',
                                  }}
                                >
                                  DOWNGRADED FROM THIS DATE
                                </span>
                              </TableRow>
                            ) : (
                              ''
                            )}
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  background: downgradedFromThis ? '#DDF' : '',
                                }}
                              >
                                <p className="description event_info_desc">
                                  {element?.event?.public_name}
                                </p>
                              </TableCell>
                              <TableCell
                                style={{
                                  background: downgradedFromThis ? '#DDF' : '',
                                }}
                              >
                                <span className="text_primary table_content_spanShow ">
                                  {element?.enquiry_date
                                    ? element.enquiry_date.endsWith(
                                        'T18:30:00.000Z',
                                      )
                                      ? moment(element.enquiry_date).format(
                                          'ddd Do MMM YYYY',
                                        )
                                      : moment(element.enquiry_date).format(
                                          'ddd Do MMM YYYY', // change format as per client requirement
                                          // 'ddd Do MMM YYYY [@] HH:mmA',
                                        )
                                    : 'No Date Given'}
                                </span>
                              </TableCell>
                              <TableCell
                                style={{
                                  background: downgradedFromThis ? '#DDF' : '',
                                }}
                              >
                                <span className="table_content_spanShow">
                                  {/* {element?.places
                                  ? element?.places?.total_places +
                                    'Prov: ' +
                                    element.places.prov +
                                    ' / ' +
                                    'Conf: ' +
                                    element?.places?.conf +
                                    element?.places?.hold_days +
                                    'Days Hold'
                                  : 'No Party'} */}
                                  <span className="d-block">
                                    {element?.places?.total_places}
                                  </span>
                                  <span className="d-block">
                                    {'Prov: ' + element?.places?.prov}
                                    {'/ Conf: ' + element?.places?.conf}
                                  </span>
                                  <span className="d-block">
                                    {element?.places?.hold_days + ' Days Hold'}
                                  </span>
                                </span>
                              </TableCell>
                              <TableCell>
                                <ul className="d-flex justify-content-end">
                                  {element?.is_book ? (
                                    <li className="me-2">
                                      <Button
                                        className="btn_border small"
                                        onClick={() => {
                                          const booking = {
                                            event_date: element?.enquiry_date,
                                            event_id: element?.event?._id,
                                            enquiry_id: element?.enquiry_id,
                                          };
                                          dispatch(createBooking(booking));
                                        }}
                                      >
                                        Book
                                      </Button>
                                    </li>
                                  ) : (
                                    ''
                                  )}
                                  <li className="me-2">
                                    <Button
                                      className="btn_border small"
                                      onClick={() => {
                                        handleClickOpen();
                                        // setEditList(element);
                                        dispatch(
                                          getEventEnquiriesData(element?._id),
                                        );
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_border small"
                                      onClick={() => {
                                        OpenDelete(element);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </li>
                                </ul>
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Button
                  className={`btn_border small ms-3 mb-2 mt-2 ${
                    pages === 'enquiries' ? 'enquiry' : ''
                  }`}
                  onClick={handleClickOpen}
                >
                  Add Enquiry
                </Button>
              </div>
              <div className="table_pagination_wrap">
                {itemsActive?.length > 0 && (
                  <Row className="g-0 align-items-center my-2">
                    <Col sm={6}>
                      <div className="total_entry">
                        <p className="m-0">
                          Showing {activeIndexOfFirstItem + 1} to{' '}
                          {Math.min(
                            activeIndexOfLastItem,
                            enquiriesEventList?.length,
                          )}{' '}
                          of {enquiriesEventList?.length} entries
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="pagination_wrap">
                        <Stack spacing={2}>
                          <Pagination
                            count={totalActiveRecordPage}
                            page={currentPage?.activeCurrentPage}
                            onChange={(e, page) => {
                              setCurrentPage({
                                ...currentPage,
                                activeCurrentPage: page,
                              });
                            }}
                          />
                        </Stack>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog
        aria-labelledby="CancelBooking-title"
        open={open}
        className="small_popup"
      >
        <BootstrapDialogTitle id="CancelBooking-title" onClose={handleClose}>
          <span className="mb-0 mt-2">
            {!enquiriesEventLoading &&
            Object.keys(enquiriesEventDetail).length === 0
              ? 'Add Enquiry'
              : 'Edit Enquiry'}
          </span>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <Formik
              enableReinitialize={true}
              initialValues={eventList}
              onSubmit={values => {
                if (Object.keys(enquiriesEventDetail).length > 0) {
                  dispatch(
                    updateEventEnquiries({
                      _id: enquiriesEventDetail?._id,
                      data: values,
                    }),
                  );
                } else {
                  dispatch(createEventEnquiries(values));
                }
                handleClose();
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
                  <div className="delete_popup_wrap p-0 text-start">
                    <div className="card_wrapper">
                      <div className="card_body admin_card_body">
                        <ul>
                          <li>
                            <Row>
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>Enquiry Event:</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_left">
                                  <FormControl>
                                    <Select
                                      labelId="Enquiries-label"
                                      id="Enquiries"
                                      name="event_id"
                                      value={values?.event_id}
                                      onChange={handleChange}
                                      defaultValue="Select"
                                      className="select_wrap main_input_wrap"
                                    >
                                      <MenuItem value="Select" disabled>
                                        Select
                                      </MenuItem>
                                      {activeEventList?.map(item => {
                                        return (
                                          <MenuItem
                                            value={item?._id}
                                            key={item?._id}
                                          >
                                            {item?.public_name}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="event_id" />
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          </li>
                          <li>
                            <Row>
                              <Col xs={3}>
                                <div className="card_content_left text-start">
                                  <label>Enquiry Date:</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_left">
                                  <span className="text_small d-block text-start">
                                    NO DATE PROVIDED - PLEASE SELECT A DATE
                                  </span>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap date_picker"
                                    >
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DateTimePicker
                                          name="enquiry_date"
                                          inputFormat="DD-MM-YYYY hh:mm a"
                                          value={values.enquiry_date}
                                          onChange={date =>
                                            setFieldValue('enquiry_date', date)
                                          }
                                          renderInput={props => (
                                            <TextField {...props} />
                                          )}
                                        />
                                      </LocalizationProvider>
                                    </FormControl>
                                    <span
                                      className="text-decoration-underline text_small cursor-pointer"
                                      onClick={() => {
                                        setFieldValue('enquiry_date', null);
                                      }}
                                    >
                                      Clear Date
                                    </span>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </li>
                          <li>
                            <Row className="justify-content-end">
                              <Col xs={9}>
                                <div className="card_content_left">
                                  <button
                                    className="btn_primary small"
                                    type="submit"
                                  >
                                    {!enquiriesEventLoading &&
                                    Object.keys(enquiriesEventDetail).length ===
                                      0
                                      ? 'Add'
                                      : 'Update'}
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </DialogContent>
      </Dialog>
      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteEventInfo}
        name="Are you sure you want to delete this?"
      />
    </>
  );
};

export default memo(EventInformation);
