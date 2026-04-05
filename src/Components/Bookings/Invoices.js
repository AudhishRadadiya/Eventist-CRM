import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import { Button, Col, Row } from 'react-bootstrap';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import PdfIcon from '../../Assets/Img/pdf-icon.svg';
import EmailIcon from '../../Assets/Img/email.svg';
import CrossIcon from '../../Assets/Img/cross-red.svg';
import PendingIcon from '../../Assets/Img/pending.svg';
import CheckIcon from '../../Assets/Img/check-green.svg';
import Search from '../../Assets/Img/search.svg';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
} from '@mui/material';

import {
  createInvoice,
  generateInvoiceUrl,
  getCreditInvoice,
  getInvoiceListData,
  setIsCreditInvoice,
} from 'store/reducers/Booking/invoice.slice';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import { formatNumberWithCommas } from 'utils/common';

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

export default function Invoices() {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { userPermissionDetail } = useSelector(({ user }) => user);

  const [creditBookingPopup, setCreditBookingPopup] = useState(false);

  const CloseInvoiceModal = () => {
    setCreditBookingPopup(false);
  };

  const [reInvoice, setReInvoice] = useState(false);
  const [overwrite, setOverwrite] = useState(false);
  const { invoiceList, invoiceLoading, isInvoiceUpdated, isCreditInvoice } =
    useSelector(({ invoice }) => invoice);
  const { state } = useLocation();

  useEffect(() => {
    dispatch(getInvoiceListData(bookingId));
  }, [bookingId, dispatch]);

  useEffect(() => {
    if (isInvoiceUpdated || isCreditInvoice) {
      dispatch(getInvoiceListData(bookingId));
    }
    if (isCreditInvoice) {
      dispatch(setIsCreditInvoice(false));
    }
  }, [bookingId, dispatch, isInvoiceUpdated, isCreditInvoice]);
  useEffect(() => {
    if (invoiceList?.length > 0) {
      if (invoiceList[0]?.type === 0) {
        if (!invoiceList[0]?.full_invoice) {
          setReInvoice(false);
        } else setReInvoice(true);
      } else {
        setReInvoice(false);
      }
    }
  }, [invoiceList]);
  const generateUrl = invoiceID => {
    dispatch(generateInvoiceUrl(invoiceID));
  };

  return (
    <div className="inner_wrapper">
      {invoiceLoading && <Loader />}
      <div className="invoice_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Link to="/bookings">Bookings</Link>
            <Typography>Edit booking</Typography>
            <Typography>Invoices</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row className="align-items-center">
            <Col xs={3}>
              <h1>Edit booking</h1>
            </Col>
            <Col xs={9}>
              <div className="text-end">
                <div className="d-flex justify-content-end">
                  {state?.reportName && (
                    <h1 className="mx-2">Comes From {state?.reportName} </h1>
                  )}
                  <Link
                    to={`/edit-bookings/${bookingId}`}
                    className="btn_border small"
                  >
                    Back to Booking
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="page_title">
          <Row className="align-items-center">
            <Col xs={3}>
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn_primary small ms-2"
                  onClick={() => {
                    setCreditBookingPopup(true);
                  }}
                >
                  xx - Credit Booking - xx
                </button>
              </div>
            </Col>
            <Col xs={9}>
              <div className="text-end d-flex justify-content-end align-items-center">
                {reInvoice && (
                  <>
                    {userPermissionDetail?.super && (
                      <div className="form-group checkbox_wrap m-0">
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={overwrite}
                                onChange={e => setOverwrite(e.target.checked)}
                              />
                            }
                            label="Overwrite Last Invoice if Same?"
                          />
                        </FormGroup>
                      </div>
                    )}
                  </>
                )}
                <button
                  className="btn_border small"
                  onClick={() => {
                    dispatch(
                      createInvoice({
                        booking_id: bookingId,
                        invoice_allow_dupe: overwrite,
                      }),
                    );
                    setReInvoice(!reInvoice);
                  }}
                >
                  {reInvoice ? 'Re-Invoice' : 'Create Full Invoice'}
                </button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="invoices_table_wrap">
          <div className="table_main_Wrapper pages_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell></TableCell>
                    <TableCell sx={{ width: '10%' }}>
                      {' '}
                      Sent to Customer
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceList?.map(item => (
                    <TableRow
                      key={item?._id}
                      className={item?.type === 0 ? 'bg_highlight' : ''}
                    >
                      <TableCell
                        className={
                          item?.type === 0
                            ? item?.full_invoice === false
                              ? ''
                              : 'text_dark'
                            : item?.full_invoice === false
                            ? ''
                            : 'text_primary'
                        }
                      >
                        {item?.invoice_date
                          ? moment(item?.invoice_date).format('Do MMM YYYY')
                          : ''}
                      </TableCell>
                      <TableCell
                        className={
                          item?.type === 0
                            ? item?.full_invoice === false
                              ? ''
                              : 'text_dark'
                            : item?.full_invoice === false
                            ? ''
                            : 'text_primary'
                        }
                      >
                        {item?.invoice_no}
                      </TableCell>
                      <TableCell
                        className={
                          item?.type === 0
                            ? item?.full_invoice === false
                              ? ''
                              : 'text_dark'
                            : item?.full_invoice === false
                            ? ''
                            : 'text_primary'
                        }
                      >
                        {item?.type === 0
                          ? item?.full_invoice === false
                            ? 'Invoice (Surcharge)'
                            : 'Invoice'
                          : item?.full_invoice === false
                          ? 'Credit (Surcharge)'
                          : 'Credit'}
                      </TableCell>
                      <TableCell
                        className={
                          item?.type === 0
                            ? item?.full_invoice === false
                              ? ''
                              : 'text_dark'
                            : item?.full_invoice === false
                            ? ''
                            : 'text_primary'
                        }
                      >
                        £{formatNumberWithCommas(item?.total?.toFixed(2))}
                      </TableCell>
                      <TableCell
                        className={
                          item?.type === 0
                            ? item?.full_invoice === false
                              ? ''
                              : 'text_dark'
                            : item?.full_invoice === false
                            ? ''
                            : 'text_primary'
                        }
                      >
                        £{formatNumberWithCommas(item?.balance?.toFixed(2))}
                      </TableCell>
                      <TableCell>
                        <ul className="action_wrap">
                          <li className="p-0">
                            <Link
                              className="btn_icon bg_gray_box"
                              to={`/edit-bookings/invoices/print/${item?._id}`}
                              target="_blank"
                            >
                              <img src={Search} alt="Search Icon" />
                            </Link>
                          </li>
                          <li>
                            {item?.invoice_url &&
                            item?.invoice_url !==
                              'TypeError: callback is not a function' ? (
                              <Link
                                className="btn_icon bg_gray_box"
                                to={item?.invoice_url}
                                target="_blank"
                              >
                                <img src={PdfIcon} alt="pdf Icon" />
                              </Link>
                            ) : (
                              <img
                                src={PdfIcon}
                                alt="pdf Icon"
                                className="btn_icon bg_gray_box"
                                onClick={() => generateUrl(item._id)}
                              />
                            )}
                            {/* <Link
                              className="btn_icon bg_gray_box"
                              to={item?.invoice_url}
                              target="_blank"
                            >
                              <img src={PdfIcon} alt="pdf Icon" />
                            </Link> */}
                          </li>
                          <li>
                            <button
                              className="btn_icon"
                              onClick={() => {
                                navigate(
                                  `/send-new-email/${bookingId}?invoiceData=true&type=${
                                    item?.type === 0 ? 'invoice' : 'credit'
                                  }`,
                                  {
                                    state: {
                                      enq_id: `${bookingId}`,
                                      invoiceId: `${item?._id}`,
                                    },
                                  },
                                );
                              }}
                            >
                              <img src={EmailIcon} alt="Email Icon" />
                            </button>
                          </li>
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul className="action_wrap">
                          <li className="p-0">
                            <img
                              src={
                                item?.mail_sent
                                  ? CheckIcon
                                  : item?.mail_accepted && !item?.mail_error
                                  ? PendingIcon
                                  : !item?.mail_error
                                  ? CrossIcon
                                  : CrossIcon
                              }
                              alt="Check Icon"
                              className="me-2"
                            />
                            {item?.mail_sent && (
                              <span>
                                {item?.mail_date
                                  ? moment(item?.mail_date).format(
                                      'DD/MM/YYYY HH:mm:ss',
                                    )
                                  : ''}
                              </span>
                            )}
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      <BootstrapDialog
        aria-labelledby="Downgrade-Enquiry-title"
        open={creditBookingPopup}
        className="small_popup"
      >
        <BootstrapDialogTitle
          id="Downgrade-Enquiry-title"
          onClose={CloseInvoiceModal}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <h5>Are you sure you want to credit this booking?</h5>
          </div>
        </DialogContent>
        <DialogActions className="justify-content-center mb-3">
          <ul className="d-flex align-items-center justify-content-center">
            <li>
              <Button
                className="btn_border small mx-2"
                onClick={CloseInvoiceModal}
              >
                Cancel
              </Button>
            </li>
            <li>
              <Button
                className="btn_primary small mx-2"
                onClick={() => {
                  dispatch(getCreditInvoice(bookingId));
                  CloseInvoiceModal();
                }}
              >
                Ok
              </Button>
            </li>
          </ul>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
