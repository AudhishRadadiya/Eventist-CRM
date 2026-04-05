import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import { Button, Col, Row } from 'react-bootstrap';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import { useDispatch, useSelector } from 'react-redux';
import { getEnquiriesData } from 'store/reducers/Enquiry/enquiries.slice';
import EditIcon from '../.././Assets/Img/edit.svg';
import CheckIcon from '../../Assets/Img/check-green.svg';
import CrossIcon from '../../Assets/Img/cross-red.svg';
import PendingIcon from '../../Assets/Img/pending.svg';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '../../Assets/Img/email.svg';
import moment from 'moment';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  createBookingPayment,
  getBookingPaymentData,
  getBookingPaymentList,
  setBookingPayment,
  updateBookingPayment,
  updateBookingPaymentReverse,
} from 'store/reducers/Booking/bookingPayment.slice';
import useSortable from 'utils/useSortable';
import { getPaymentOptionsListData } from 'store/reducers/Admin/Financial/paymentOptions.slice';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import styled from '@emotion/styled';
import Loader from 'Components/Common/Loader';
import ShowMoreInitializer from 'Components/Common/ShowMoreInitializer';
import ShowMoreHandler from 'Components/Common/ShowMoreHandler';
import { zeroRoundTo } from 'utils/common';

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

export default function AddPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initalValues = {
    type: 1,
    method: '',
    amount: '',
    surcharge: '',
    info: '',
    notes: '',
    admin_overrides: false,
  };

  const { bookingId } = useParams();
  const [state, setState] = useState(initalValues);
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);

  const { userPermissionDetail } = useSelector(({ user }) => user);

  const { activePaymentOptionsList } = useSelector(
    ({ paymentOptions }) => paymentOptions,
  );

  const {
    bookingPayment,
    bookingPaymentDetail,
    bookingPaymentLoading,
    isBookingPaymentUpdated,
  } = useSelector(({ bookingPayment }) => bookingPayment);

  const [showSurcharge, setShowSurcharge] = useState('');
  const [showSurchargeType, setShowSurchargeType] = useState('');

  const [extendedNotes, setExtendedNotes] = useState(false);
  // const [adminOnly, setAdminOnly] = useState(false);
  const [adminOnly, setAdminOnly] = useState(true);

  const [reversePopup, setReversePopup] = useState(false);
  // const [reverseInfo, setReverseInfo] = useState('');

  const [paymentNotePopup, setPaymentNotePopup] = useState(false);
  const [paymentNote, setPaymentNote] = useState('');

  const [paymentInfoPopup, setPaymentInfoPopup] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState('');

  const [previousPaymentId, setPreviousPaymentId] = useState('');
  const [paymentData, setPaymentData] = useState([]);
  const [check, setCheck] = useState([]);

  useEffect(() => {
    dispatch(getEnquiriesData(bookingId));
    dispatch(getBookingPaymentList(bookingId));
    dispatch(getPaymentOptionsListData());
  }, [dispatch, bookingId]);

  useEffect(() => {
    if (bookingPaymentDetail) {
      setPaymentInfo(bookingPaymentDetail?.info);
      setPaymentNote(bookingPaymentDetail?.notes);
    }
    return () => {
      // dispatch(setBookingPayment([]));
      setPaymentData([]);
    };
  }, [bookingPaymentDetail]);

  useEffect(() => {
    if (bookingPayment?.payments?.length > 0) {
      setPaymentData(bookingPayment?.payments);
    }
  }, [bookingPayment?.payments]);

  useEffect(() => {
    if (isBookingPaymentUpdated) {
      dispatch(getBookingPaymentList(bookingId));
      setState(initalValues);
      setShowSurcharge('');
    }
  }, [isBookingPaymentUpdated]);

  const OpenReversePayment = id => {
    setReversePopup(true);
    setPreviousPaymentId(id);
    // setReverseInfo('');
    if (id) {
      dispatch(
        getBookingPaymentData({ booking_id: bookingId, payment_id: id }),
      );
    }
  };
  const CloseReversePayment = () => {
    setReversePopup(false);
  };

  const OpenPaymentInfo = id => {
    setPreviousPaymentId(id);
    setPaymentInfoPopup(true);
    if (id) {
      dispatch(
        getBookingPaymentData({ booking_id: bookingId, payment_id: id }),
      );
    }
  };
  const ClosePaymentInfo = () => {
    setPaymentInfoPopup(false);
  };

  const OpenPaymentNote = id => {
    setPreviousPaymentId(id);
    setPaymentNotePopup(true);
    if (id) {
      dispatch(
        getBookingPaymentData({ booking_id: bookingId, payment_id: id }),
      );
    }
  };
  const ClosePaymentNote = () => {
    setPaymentNotePopup(false);
  };

  const handleSurchargeChange = e => {
    const surchargeAmount = activePaymentOptionsList?.find(
      elem => elem?._id === e.target.value,
    )?.surcharge_amount;
    const surchargeType = activePaymentOptionsList?.find(
      elem => elem?._id === e.target.value,
    )?.surcharge_type;
    setShowSurcharge(surchargeAmount);
    setShowSurchargeType(surchargeType);
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.string().required('Amount is a required field'),
    method: Yup.string().required('Method is a required field'),
    type: Yup.string().required('Type is a required field'),
  });

  const { itemsInActive, requestSortInActive } = useSortable(check);

  const showTypeOptionDependBookingDate = useMemo(() => {
    let isValid = false;

    if (enquirieDetail?.event_info?.event_date?.date) {
      const partyBookingDate = enquirieDetail?.event_info?.event_date?.date;

      const today = moment();
      const sixWeeksLater = moment(partyBookingDate).subtract(6, 'weeks');
      const lastDateOfYear = moment(partyBookingDate).endOf('year');

      isValid =
        today.isSameOrAfter(sixWeeksLater) &&
        today.isSameOrBefore(lastDateOfYear);

      return isValid;
    }
  }, [enquirieDetail?.event_info?.event_date?.date]);

  return (
    <>
      {bookingPaymentLoading && <Loader />}
      <div className="inner_wrapper">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Link to="/bookings">Bookings</Link>
            <Link to={`/edit-bookings/${bookingId}`}>Edit Bookings</Link>
            <Typography>Add Payment</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row className="align-items-center">
            <Col xs={3}>
              <h1>Add Payment</h1>
            </Col>
            <Col xs={9}>
              <div className="text-end">
                <Link
                  to={`/edit-bookings/${bookingId}`}
                  className="btn_border small"
                >
                  Back to Booking
                </Link>
              </div>
            </Col>
          </Row>
        </div>
        <div className="booking_information bg_white_box p-3 mb-3">
          <h2>Booking Information</h2>
          <div className="booking_info_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <b className="fw_500">Ref:</b>{' '}
                      <span>{enquirieDetail?.ref_number}</span>
                    </TableCell>
                    <TableCell>
                      <b className="fw_500">Event:</b>
                      <span>{enquirieDetail?.event_info?.internal_name}</span>
                    </TableCell>
                    <TableCell>
                      <b className="fw_500">Date:</b>{' '}
                      <span>
                        {moment(
                          enquirieDetail?.event_info?.event_date?.date,
                        ).format('ddd Do MMM YYYY')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <b className="fw_500">Places:</b>
                      {bookingPayment?.confirmed_Places} /{' '}
                      {bookingPayment?.confirmed_Places +
                        bookingPayment?.provisional_places}{' '}
                      <span className="text_light">
                        ({bookingPayment?.max} max)
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b className="fw_500">Name:</b>{' '}
                      <span>
                        {enquirieDetail?.contact?.first_name +
                          ' ' +
                          enquirieDetail?.contact?.surname}
                      </span>
                    </TableCell>
                    <TableCell>
                      <b className="fw_500">Email:</b>
                      <span>{enquirieDetail?.contact?.email_primary}</span>
                    </TableCell>
                    <TableCell>
                      <b className="fw_500">Balance Due:</b>{' '}
                      <span>£{bookingPayment?.balance_due?.toFixed(2)}</span>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={state}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const updatedValues = {
                ...values,
                type: values?.type === 3 ? 1 : values?.type,
              };

              const data = {
                booking_id: bookingId,
                values: updatedValues,
              };
              dispatch(createBookingPayment(data));
              resetForm();
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
                <div className="booking_info_table mb-3 add_booking_table">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Method</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Surcharge</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <FormControl fullWidth className="input_wrap">
                              <Select
                                labelId="Deposit-label"
                                id="Deposit-select"
                                name="type"
                                value={values?.type}
                                onChange={handleChange}
                                className="select_wrap"
                              >
                                <MenuItem value={1}>Deposit</MenuItem>
                                {enquirieDetail?.is_invoice && adminOnly ? (
                                  <MenuItem value={2}>Balance</MenuItem>
                                ) : enquirieDetail?.is_invoice === false ? (
                                  <MenuItem value={2}>Balance</MenuItem>
                                ) : (
                                  ''
                                )}
                                {showTypeOptionDependBookingDate && (
                                  <MenuItem value={3}>Full Payment</MenuItem>
                                )}
                              </Select>
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="type" />
                            </span>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth className="input_wrap ">
                              <Select
                                labelId="Method-label"
                                id="Method-select"
                                name="method"
                                value={values?.method}
                                onChange={e => {
                                  handleSurchargeChange(e);
                                  setFieldValue('method', e.target.value);
                                }}
                                className="select_wrap"
                              >
                                {activePaymentOptionsList
                                  ?.filter(
                                    item =>
                                      !(
                                        userPermissionDetail?.system &&
                                        item?.payment_channel === 'system'
                                      ),
                                  )
                                  ?.map(item => {
                                    return (
                                      <MenuItem
                                        key={item?._id}
                                        value={item?._id}
                                        onClick={() => {
                                          const surchargeTax =
                                            (item?.surcharge_amount *
                                              item?.percentage) /
                                            100;

                                          const result =
                                            item?.surcharge_amount +
                                            surchargeTax;
                                          if (item?.surcharge_type == 1) {
                                            setFieldValue('surcharge', result);
                                          } else {
                                            if (
                                              item?.public_name ===
                                              'Corporate Credit Card'
                                            ) {
                                              let surChargeValue =
                                                (Number(values?.amount) *
                                                  item?.surcharge_amount) /
                                                100;
                                              setFieldValue(
                                                'amount',
                                                values?.amount,
                                              );

                                              Number(item?.surcharge_type) === 1
                                                ? setFieldValue(
                                                    'surcharge',
                                                    item?.surcharge_amount +
                                                      (item?.surcharge_amount *
                                                        Number(
                                                          item?.percentage,
                                                        )) /
                                                        100,
                                                  )
                                                : item?.percentage
                                                ? setFieldValue(
                                                    'surcharge',
                                                    (
                                                      surChargeValue +
                                                      (surChargeValue *
                                                        Number(
                                                          item?.percentage,
                                                        )) /
                                                        100
                                                    )?.toFixed(2),
                                                  )
                                                : setFieldValue(
                                                    'surcharge',
                                                    surChargeValue?.toFixed(2),
                                                  );
                                            } else {
                                              setFieldValue('surcharge', 0.0);
                                            }
                                          }
                                        }}
                                      >
                                        {item?.internal_name}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            </FormControl>
                            <span className="d-inline-block my-2 mx-2">
                              {showSurcharge
                                ? showSurcharge?.toFixed(2) +
                                  (showSurchargeType == 0 ? '%' : '')
                                : ''}
                            </span>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="method" />
                            </span>
                          </TableCell>
                          <TableCell>
                            <FormGroup className="input_wrap">
                              <FormControl fullWidth>
                                <TextField
                                  id="Amount-input"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter amount"
                                  name="amount"
                                  value={values?.amount}
                                  onChange={e => {
                                    let surChargeValue =
                                      (Number(e.target.value) * showSurcharge) /
                                      100;
                                    setFieldValue('amount', e.target.value);

                                    const data = activePaymentOptionsList?.find(
                                      elem => elem?._id === values?.method,
                                    );

                                    Number(data?.surcharge_type) === 1
                                      ? setFieldValue(
                                          'surcharge',
                                          showSurcharge +
                                            (showSurcharge *
                                              Number(data?.percentage)) /
                                              100,
                                        )
                                      : data?.percentage
                                      ? setFieldValue(
                                          'surcharge',
                                          (
                                            surChargeValue +
                                            (surChargeValue *
                                              Number(data?.percentage)) /
                                              100
                                          )?.toFixed(2),
                                        )
                                      : setFieldValue(
                                          'surcharge',
                                          surChargeValue?.toFixed(2),
                                        );
                                  }}
                                />
                              </FormControl>
                              <span className="d-block  text-danger text_small">
                                <ErrorMessage name="amount" />
                              </span>
                            </FormGroup>
                          </TableCell>
                          <TableCell>
                            <FormGroup className="input_wrap">
                              <FormControl fullWidth>
                                <TextField
                                  id="Surcharge-input"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="0.00"
                                  name="surcharge"
                                  value={values?.surcharge}
                                  onChange={e => {
                                    setFieldValue('surcharge', e.target.value);
                                  }}
                                />
                              </FormControl>
                            </FormGroup>
                          </TableCell>
                          <TableCell>
                            <FormGroup className="input_wrap">
                              <FormControl fullWidth>
                                <TextField
                                  disabled
                                  id="Total-input"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Total"
                                  value={
                                    Number(values?.amount) +
                                    Number(values?.surcharge)
                                  }
                                />
                              </FormControl>
                            </FormGroup>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                <div className="payment_info_note">
                  <label className="mb-2 text_small">
                    <b className="fw_500">Payment Info:</b> (Paying-In Slip
                    no./BACS reference if available)
                  </label>
                  <Row>
                    <Col>
                      <FormGroup className="input_wrap">
                        <FormControl fullWidth>
                          <TextField
                            id="resolution_note"
                            multiline
                            rows={3}
                            variant="outlined"
                            placeholder="Enter payment Info"
                            name="info"
                            value={values?.info}
                            onChange={e => {
                              setFieldValue('info', e.target.value);
                            }}
                          />
                        </FormControl>
                      </FormGroup>
                      <div className="extended_note">
                        <span
                          className="text_decoration text_small my-3 d-inline-block"
                          onClick={() => setExtendedNotes(!extendedNotes)}
                        >
                          Show/Hide Extended Notes
                        </span>
                        {extendedNotes && (
                          <FormGroup className="input_wrap mb-3">
                            <FormControl fullWidth>
                              <TextField
                                id="ExtendedNotes"
                                multiline
                                rows={3}
                                variant="outlined"
                                placeholder="Enter Extended Notes"
                                name="notes"
                                value={values?.notes}
                                onChange={handleChange}
                              />
                            </FormControl>
                          </FormGroup>
                        )}
                        {userPermissionDetail?.admin && (
                          <p className="m-0">
                            <b className="fw_500">Admin Only:</b>
                            <span
                              className="text_decoration text_small cursor-pointer"
                              onClick={() => setAdminOnly(!adminOnly)}
                            >
                              {adminOnly
                                ? ' Override to allow deposit payments + payment reversals'
                                : ' Hide admin overrides'}
                            </span>
                          </p>
                        )}
                      </div>
                    </Col>
                    <Col>
                      <Button type="submit" className="btn_border small">
                        Insert Transactions
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="table_main_Wrapper p-2 payment_table_wrapper">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="text_primary m-0">Previous Payments</h5>
          </div>
          {activePaymentOptionsList?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortInActive('booking_ref')}>
                        Booking Ref
                      </span>
                    </TableCell>
                    <TableCell>
                      {' '}
                      <span onClick={() => requestSortInActive('event')}>
                        Event
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('type')}>
                        Type
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('amount')}>
                        Amount
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('surcharge')}>
                        Surcharge
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('total')}>
                        Total
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('method')}>
                        Method
                      </span>
                    </TableCell>
                    <TableCell>
                      {' '}
                      <span onClick={() => requestSortInActive('date')}>
                        Date
                      </span>
                    </TableCell>
                    <TableCell>Info</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Receipt</TableCell>
                    <TableCell>Sent</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsInActive?.map(element => {
                    return (
                      <TableRow key={element?._id}>
                        <TableCell>{element?.booking_ref}</TableCell>
                        <TableCell>{element?.event?.sku}</TableCell>
                        <TableCell>
                          {(element?.type === 1 && 'Deposit') ||
                            (element?.type === 2 && 'Balance')}
                        </TableCell>
                        <TableCell
                          className={element?.amount <= 0 ? 'text-danger' : ''}
                        >
                          £{zeroRoundTo(element?.amount)}
                        </TableCell>
                        <TableCell>£{element?.surcharge?.toFixed(2)}</TableCell>
                        <TableCell
                          className={element?.total <= 0 ? 'text-danger' : ''}
                        >
                          £{element?.total?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span>{element?.method?.internal_name}</span>
                        </TableCell>
                        <TableCell>
                          {element?.created_at
                            ? moment(element?.created_at).format(
                                ' DD/MM/YY h:mm:ss',
                              )
                            : '-'}{' '}
                        </TableCell>
                        <TableCell>
                          <div
                            className={
                              element?.show_more_info
                                ? 'show_more_data expanded'
                                : 'show_more_data'
                            }
                          >
                            <p className="description">
                              <img
                                src={EditIcon}
                                alt="Edit Icon"
                                className="cursor-pointer"
                                onClick={() => OpenPaymentInfo(element?._id)}
                              />
                              {element?.info}
                            </p>

                            <ShowMoreHandler
                              check={check}
                              setCheck={setCheck}
                              _id={element._id}
                              toggle={element.show_more_info}
                              elementData={element?.info}
                              keyName={'show_more_info'}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={
                              element?.show_more_note
                                ? 'show_more_data expanded'
                                : 'show_more_data'
                            }
                          >
                            <p className="description">
                              <img
                                src={EditIcon}
                                alt="Edit Icon"
                                className="cursor-pointer"
                                onClick={() => OpenPaymentNote(element?._id)}
                              />{' '}
                              {element?.notes}
                            </p>
                            <ShowMoreHandler
                              check={check}
                              setCheck={setCheck}
                              _id={element._id}
                              toggle={element.show_more_note}
                              elementData={element?.notes}
                              keyName={'show_more_note'}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            className="btn_icon"
                            onClick={() => {
                              navigate(
                                `/send-new-email/${bookingId}?payment=true&payment_receipt_deposit=payment_receipt_${
                                  element?.type === 2 ? 'balance' : 'deposit'
                                }`,
                                {
                                  state: {
                                    enq_id: `${bookingId}`,
                                    invoiceId: `${element?._id}`,
                                  },
                                },
                              );
                            }}
                          >
                            <img src={EmailIcon} alt="Email Icon" />
                          </button>
                        </TableCell>
                        <TableCell>
                          {element?.sent ? (
                            <img src={CheckIcon} alt="Check Icon" />
                          ) : element?.mail_accepted && !element?.mail_error ? (
                            <img src={PendingIcon} alt="Pending Icon" />
                          ) : !element?.mail_error ? (
                            <img src={CrossIcon} alt="Cross Icon" />
                          ) : (
                            <img src={CrossIcon} alt="Cross Icon" />
                          )}
                        </TableCell>
                        <TableCell>
                          {adminOnly ||
                            (element?.is_reversed == false && (
                              <img
                                src={CrossIcon}
                                alt="Check Icon"
                                className="cursor-pointer"
                                onClick={() => OpenReversePayment(element?._id)}
                              />
                            ))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p className="m-0 text_light">
              There are currently no transactions listed against this booking
            </p>
          )}
        </div>
      </div>

      <BootstrapDialog
        aria-labelledby="Downgrade-Enquiry-title"
        open={reversePopup}
        className="small_popup"
      >
        <BootstrapDialogTitle
          id="Downgrade-Enquiry-title"
          onClose={CloseReversePayment}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <h5>Are you sure you want to reverse this payment?</h5>
            <FormGroup className="input_wrap">
              <FormControl fullWidth className="small_select">
                <label className="mb-2">Enter notes below:</label>
                <TextField
                  id="Amount-input"
                  multiline
                  rows={3}
                  variant="outlined"
                  className="input_wrap"
                  placeholder="Enter amount"
                  name="amount"
                  value={paymentNote}
                  onChange={e => setPaymentNote(e.target.value)}
                />
              </FormControl>
            </FormGroup>
          </div>
        </DialogContent>
        <DialogActions className="justify-content-center mb-3">
          <ul className="d-flex align-items-center justify-content-center">
            <li>
              <Button
                className="btn_border small mx-2"
                onClick={CloseReversePayment}
              >
                Cancel
              </Button>
            </li>
            <li>
              <Button
                className="btn_primary small mx-2"
                onClick={() => {
                  dispatch(
                    updateBookingPaymentReverse({
                      booking_id: bookingId,
                      payment_id: previousPaymentId,
                      value: {
                        notes: paymentNote,
                      },
                    }),
                  );
                  CloseReversePayment();
                }}
              >
                Ok
              </Button>
            </li>
          </ul>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        aria-labelledby="Downgrade-Enquiry-title"
        open={paymentInfoPopup}
        className="small_popup"
      >
        {bookingPaymentLoading && <Loader />}
        <BootstrapDialogTitle
          id="Downgrade-Enquiry-title"
          onClose={ClosePaymentInfo}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <h5>Are you sure you want to update this payment's info?</h5>
            <FormGroup className="input_wrap">
              <FormControl fullWidth className="small_select">
                <label className="mb-2">Enter notes below:</label>
                <TextField
                  id="Amount-input"
                  multiline
                  rows={3}
                  variant="outlined"
                  className="input_wrap"
                  placeholder="Enter amount"
                  name="amount"
                  value={paymentInfo}
                  onChange={e => setPaymentInfo(e.target.value)}
                />
              </FormControl>
            </FormGroup>
          </div>
        </DialogContent>
        <DialogActions className="justify-content-center mb-3">
          <ul className="d-flex align-items-center justify-content-center">
            <li>
              <Button
                className="btn_border small mx-2"
                onClick={ClosePaymentInfo}
              >
                Cancel
              </Button>
            </li>
            <li>
              <Button
                className="btn_primary small mx-2"
                onClick={() => {
                  dispatch(
                    updateBookingPayment({
                      booking_id: bookingId,
                      payment_id: previousPaymentId,
                      value: {
                        info: paymentInfo,
                      },
                    }),
                  );
                  ClosePaymentInfo();
                }}
              >
                Ok
              </Button>
            </li>
          </ul>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        aria-labelledby="Downgrade-Enquiry-title"
        open={paymentNotePopup}
        className="small_popup"
      >
        {bookingPaymentLoading && <Loader />}
        <BootstrapDialogTitle
          id="Downgrade-Enquiry-title"
          onClose={ClosePaymentNote}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <h5>Are you sure you want to update this payment's notes?</h5>
            <FormGroup className="input_wrap">
              <FormControl fullWidth className="small_select">
                <label className="mb-2">Enter notes below:</label>
                <TextField
                  id="Amount-input"
                  multiline
                  rows={3}
                  variant="outlined"
                  className="input_wrap"
                  placeholder="Enter Text"
                  value={paymentNote}
                  onChange={e => setPaymentNote(e.target.value)}
                />
              </FormControl>
            </FormGroup>
          </div>
        </DialogContent>
        <DialogActions className="justify-content-center mb-3">
          <ul className="d-flex align-items-center justify-content-center">
            <li>
              <Button
                className="btn_border small mx-2"
                onClick={ClosePaymentNote}
              >
                Cancel
              </Button>
            </li>
            <li>
              <Button
                className="btn_primary small mx-2"
                onClick={() => {
                  dispatch(
                    updateBookingPayment({
                      booking_id: bookingId,
                      payment_id: previousPaymentId,
                      value: {
                        notes: paymentNote,
                      },
                    }),
                  );
                  ClosePaymentNote();
                }}
              >
                Ok
              </Button>
            </li>
          </ul>
        </DialogActions>
      </BootstrapDialog>
      <ShowMoreInitializer data={paymentData} setState={setCheck} />
    </>
  );
}
