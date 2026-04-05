import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Button, Col, Row } from 'react-bootstrap';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import PdfIcon from '../../Assets/Img/pdf-icon.svg';
import EmailIcon from '../../Assets/Img/email.svg';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { eTicketBranding } from 'utils/FieldValues';
import { getEnquiriesData } from 'store/reducers/Enquiry/enquiries.slice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import CrossIcon from '../../Assets/Img/cross-red.svg';
import CheckIcon from '../../Assets/Img/check-green.svg';
import PendingIcon from '../../Assets/Img/pending.svg';
import {
  createETicket,
  getCateringPackageListData,
  previewETicketPDF,
  setIsTicketUpdated,
  setNumberETciketData,
} from 'store/reducers/Booking/eTicket.slice';

export default function BookingETicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { enquirieDetail, enquirieLoading } = useSelector(
    ({ enquiries }) => enquiries,
  );

  const {
    cateringPackageList,
    eTicketLoading,
    iseTicketUpdated,
    numberETciketData,
  } = useSelector(({ eTicket }) => eTicket);

  const [eventNameError, setEventNameError] = useState('');

  const [useOtherOption, setUseOtherOption] = useState([]);
  const [eTicketValue, setETicketValue] = useState({
    e_ticket_branding: eTicketBranding[0]?.value,
    party_name: '',
    use_other: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(getEnquiriesData(id));
      dispatch(getCateringPackageListData(id));
    }
  }, [id]);

  useEffect(() => {
    if (iseTicketUpdated) {
      dispatch(getEnquiriesData(id));
      dispatch(getCateringPackageListData(id));
      dispatch(setIsTicketUpdated(false));
    }
  }, [iseTicketUpdated]);

  useEffect(() => {
    if (Object.keys(enquirieDetail)?.length > 0) {
      const partyName =
        enquirieDetail?.contact_id === '663f66b97637be3fd4c1b5a4' ||
        enquirieDetail?.contact?.company_name === 'Office Christmas' ||
        enquirieDetail?.account_id === '663f1d8592560329d88bf8d7'
          ? enquirieDetail?.agent_ref_po_no
          : enquirieDetail?.contact?.company_name;
      setETicketValue({
        ...eTicketValue,
        party_name: partyName,
      });
      setUseOtherOption([
        {
          label: `${enquirieDetail?.contact?.first_name} ${enquirieDetail?.contact?.surname}`,
          value: `${enquirieDetail?.contact?.first_name} ${enquirieDetail?.contact?.surname}`,
        },
        {
          label: enquirieDetail?.contact?.company_name,
          value: enquirieDetail?.contact?.company_name,
        },
        {
          label: enquirieDetail?.contact?.first_name,
          value: enquirieDetail?.contact?.first_name,
        },
        {
          label: enquirieDetail?.contact?.surname,
          value: enquirieDetail?.contact?.surname,
        },
        {
          label: `PO Ref:${enquirieDetail?.agent_ref_po_no}`,
          value: `PO Ref:${enquirieDetail?.agent_ref_po_no}`,
        },
      ]);
    }
  }, [enquirieDetail]);

  useEffect(() => {
    if (useOtherOption?.length > 0) {
      const partyName =
        enquirieDetail?.contact_id === '663f66b97637be3fd4c1b5a4' ||
        enquirieDetail?.contact?.company_name === 'Office Christmas' ||
        enquirieDetail?.account_id === '663f1d8592560329d88bf8d7'
          ? `PO Ref:${enquirieDetail?.agent_ref_po_no}`
          : enquirieDetail?.contact?.company_name;
      let SelectedOption = useOtherOption?.filter(
        data => data?.value === partyName,
      );
      if (SelectedOption?.length > 0) {
        setETicketValue({
          ...eTicketValue,
          use_other: SelectedOption[0]?.value,
        });
      }
    }
  }, [useOtherOption]);

  const handleCreateEticket = () => {
    if (eTicketValue?.party_name === '') {
      setEventNameError('Please enter party name');
    } else {
      setEventNameError('');
      let newObj = { ...eTicketValue };
      delete newObj.use_other;
      newObj.booking_id = id;
      dispatch(createETicket(newObj));
    }
  };

  const handleBrandingVal = val => {
    let newData = eTicketBranding?.filter(data => data?.value === val);
    return newData[0]?.label;
  };

  useEffect(() => {
    if (numberETciketData?.numberData?.pdf_url) {
      window.open(numberETciketData?.numberData?.pdf_url, '_blank');
      dispatch(setNumberETciketData());
    }
    if (numberETciketData?.guestData?.pdf_url) {
      window.open(numberETciketData?.guestData?.pdf_url, '_blank');
      dispatch(setNumberETciketData());
    }
  }, [numberETciketData]);

  const previewETicket = type => {
    dispatch(
      previewETicketPDF({
        bookingId: id,
        data: { type: type },
      }),
    );
  };
  return (
    <div className="inner_wrapper">
      {(enquirieLoading || eTicketLoading) && <Loader />}
      <div className="booking_eticket_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Link to="/bookings">Bookings</Link>
            <Link to={`/edit-bookings/${id}`}>Edit Bookings</Link>
            <Typography>Booking - E - Ticket</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row className="align-items-center">
            <Col xs={3}>
              <h1>Booking - E - Ticket</h1>
            </Col>
            <Col xs={9}>
              <div className="text-end">
                <Link to={`/edit-bookings/${id}`} className="btn_border small">
                  Back to Booking
                </Link>
              </div>
            </Col>
          </Row>
        </div>
        <div className="booking_eticket_top_table">
          <h4 className="mb-3 text_primary">
            Previously Created Catering Packages
          </h4>
          <div className="table_main_Wrapper pages_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Print Run</TableCell>
                    <TableCell>Catering Packages</TableCell>
                    <TableCell>Party Name</TableCell>
                    <TableCell>Party Contact</TableCell>
                    <TableCell>Branding</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Send</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cateringPackageList &&
                    cateringPackageList?.length > 0 &&
                    cateringPackageList?.map(data => {
                      return (
                        <TableRow>
                          <TableCell>{data?.print_run}</TableCell>
                          <TableCell>{data?.catering_packages}</TableCell>
                          <TableCell>{data?.party_name}</TableCell>
                          <TableCell>
                            <Link
                              to={`/contact/edit-contact/${data?.party_contact}`}
                            >
                              {data?.party_name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {handleBrandingVal(data?.e_ticket_branding)}
                          </TableCell>
                          <TableCell>
                            <ul className="action_wrap">
                              <li className="p-0">
                                {data?.file && (
                                  <Link
                                    to={data?.file}
                                    className="btn_icon bg_gray_box"
                                    target="_blank"
                                    // onClick={() => {
                                    //   exportETicketPdf(data);
                                    // }}
                                  >
                                    <img src={PdfIcon} alt="File Icon" />
                                  </Link>
                                )}
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell>
                            <ul className="action_wrap">
                              <li className="p-0">
                                <button
                                  className="btn_icon bg_gray_box"
                                  onClick={() => {
                                    navigate(
                                      `/send-new-email/${id}?eticket=true&etickets_new=etickets_new`,
                                      {
                                        state: {
                                          enq_id: `${id}`,
                                          eTicket_id: `${data?._id}`,
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
                            {data?.sent_mails?.length > 0 ? (
                              <p className="description">
                                {data?.sent_mails?.map((item, itemIndex) => {
                                  return (
                                    <>
                                      {
                                        <div className="mb-2">
                                          <img
                                            src={
                                              item?.mail_sent
                                                ? CheckIcon
                                                : item?.mail_accepted &&
                                                  !item?.mail_error
                                                ? PendingIcon
                                                : !item?.mail_error
                                                ? CrossIcon
                                                : CrossIcon
                                            }
                                            alt="Check Icon"
                                            className="me-2"
                                          />
                                          <span>
                                            {item?.mail_sent ? (
                                              <>
                                                Sent{' '}
                                                {moment(
                                                  item?.updated_at,
                                                ).format('L h:mm:ss')}
                                              </>
                                            ) : (
                                              <>
                                                {moment(
                                                  item?.updated_at,
                                                ).format('L h:mm:ss')}
                                              </>
                                            )}
                                          </span>
                                        </div>
                                      }
                                    </>
                                  );
                                })}
                              </p>
                            ) : (
                              <p className="text_primary m-0">
                                NOT SENT - these tickets have not been emailed
                                to the customer
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="booking_eticket_bottom">
          <h4 className="text_primary">Create New eTickets PDF</h4>
          <div className="card_wrapper mb-3">
            <div className="card_body admin_card_body">
              <ul>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label>Event:</label>
                      </div>
                    </Col>
                    <Col xs={7}>
                      {enquirieDetail?.event_info?.venue?.internal_name}
                    </Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label>Event Date:</label>
                      </div>
                    </Col>
                    <Col xs={7}>
                      {moment(
                        enquirieDetail?.event_info?.event_date?.date,
                      ).format('ddd Do MMM YYYY')}
                    </Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label>Places Booked:</label>
                      </div>
                    </Col>
                    <Col xs={7}>
                      {enquirieDetail?.booking_info?.confirmed_places}
                    </Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label></label>
                      </div>
                    </Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label>eTicket Branding:</label>
                      </div>
                    </Col>
                    <Col xs={7}>
                      <FormControl fullWidth className="main_input_wrap">
                        <Select
                          labelId="Branding"
                          value={eTicketValue.e_ticket_branding}
                          id="Branding"
                          name="Branding"
                          onChange={e =>
                            setETicketValue({
                              ...eTicketValue,
                              e_ticket_branding: e.target.value,
                            })
                          }
                          className="input_wrap select_wrap"
                        >
                          {eTicketBranding?.map(item => {
                            return (
                              <MenuItem value={item?.value} key={item?.value}>
                                {item?.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label></label>
                      </div>
                    </Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label>
                          Event Name:<sup className="text_primary">*</sup>
                        </label>
                      </div>
                    </Col>
                    <Col xs={7}>
                      <FormGroup className="percentage_input">
                        <FormControl fullWidth className="main_input_wrap">
                          <TextField
                            id="EventPlace"
                            type="text"
                            variant="outlined"
                            placeholder="Enter party name"
                            value={eTicketValue.party_name}
                            onChange={e => {
                              if (e.target.value !== '') {
                                setEventNameError('');
                              }
                              setETicketValue({
                                ...eTicketValue,
                                party_name: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                        <span className="text_small mx-2"> use other:</span>
                        <FormControl fullWidth className="main_input_wrap">
                          <Select
                            labelId="Category"
                            value={eTicketValue.use_other}
                            id="category"
                            name="category"
                            onChange={e =>
                              setETicketValue({
                                ...eTicketValue,
                                use_other: e.target.value,
                                party_name: e.target.value.replace(
                                  'PO Ref:',
                                  '',
                                ),
                              })
                            }
                            className="input_wrap select_wrap"
                          >
                            {useOtherOption &&
                              useOtherOption?.map(item => {
                                return (
                                  <MenuItem
                                    value={item?.value}
                                    key={item?.value}
                                  >
                                    {item?.label}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </FormControl>
                      </FormGroup>
                      {eventNameError !== '' && (
                        <span className="text-danger text_small">
                          {eventNameError}
                        </span>
                      )}
                    </Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label>PO Ref:</label>
                      </div>
                    </Col>
                    <Col xs={7}>{enquirieDetail?.agent_ref_po_no}</Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label>Public Notes</label>
                      </div>
                    </Col>
                    <Col xs={7}>{enquirieDetail?.public_notes}</Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col xs={5}>
                      <div className="card_content_left">
                        <label>Venue Notes</label>
                      </div>
                    </Col>
                    <Col xs={7}>{enquirieDetail?.venue_notes}</Col>
                  </Row>
                </li>
                <li>
                  <Row className="justify-content-end">
                    <Col xs={7}>
                      <Button
                        className="btn_primary small"
                        onClick={() => {
                          handleCreateEticket();
                        }}
                      >
                        Create eTickets
                      </Button>
                    </Col>
                  </Row>
                </li>
              </ul>
            </div>
          </div>
          <h4 className="mb-3">Preview eTickets PDFs</h4>
          <ul className="pdf_link_wrap rtl_dir">
            <li onClick={() => previewETicket(0)}>
              <span className="d-block mb-2 custom_text_hover text-decoration-underline">
                Numbered eTickets
              </span>
            </li>
          </ul>
          {/* {enquirieDetail?.total_guests > 0 && (
            <ul className="pdf_link_wrap rtl_dir">
              <li onClick={() => previewETicket(1)}>
                <span className="custom_text_hover text-decoration-underline">
                  eTickets with Guest Names
                </span>
              </li>
            </ul>
          )} */}
        </div>
      </div>
    </div>
  );
}
