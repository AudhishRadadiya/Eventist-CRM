import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  MenuItem,
  Select,
  FormGroup,
  TextField,
  FormControl,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { getAccountAgentsListData } from 'store/reducers/Contact/account.slice';
import { updateEnquiries } from 'store/reducers/Enquiry/enquiries.slice';
import {
  setIsBookingUpdated,
  setIsDowngrade,
} from 'store/reducers/Booking/booking.slice';
import Loader from 'Components/Common/Loader';
import { contactTypes } from 'utils/FieldValues';
import TransferBookingToContact from './TransferBookingToContact';
import MoveBookingTo from './MoveBookingTo';
import { numberRegex } from 'utils/common';
import DowngradeEnquiryPopup from './DowngradeEnquiryPopup';
import CancelBookingPopup from './CancelBookingPopup';
import { ContactDetail } from './ContactDetail';
import { ToggleButton } from './ToggleButton';
import CrossIcon from '../../../Assets/Img/cross-red.svg';
import CheckIcon from '../../../Assets/Img/check-green.svg';
import TransferredFromList from './TransferredFromList';
import MovedFromList from './MovedFromList';
export default function ContactInformation({ pages }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { isBookingUpdated, isDowngradeUpdate } = useSelector(
    ({ booking }) => booking,
  );
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  const { accountAgentsListData } = useSelector(({ account }) => account);
  const { bookingLoading } = useSelector(({ booking }) => booking);
  const { activeContactSourcesList } = useSelector(
    ({ contactSources }) => contactSources,
  );
  const [ownerSelect, setOwnerSelect] = useState('Select');
  const [agentSelect, setAgentSelect] = useState('Select');
  const [transferBookingPopup, setTransferBookingPopup] = useState(false);
  const [moveBookingPopup, setMoveBookingPopup] = useState(false);
  const [downgradeEnquiryPopup, setDowngradeEnquiryPopup] = useState(false);
  const [cancelBookingPopup, setCancelBookingPopup] = useState(false);
  const [complained, setComplained] = useState(false);
  const [agentRef, setAgentRef] = useState('');
  const [contractIssued, setContractIssued] = useState('');
  const [downgradeTimeDate, setDowngradeTimeDate] = useState('');
  const [contentInfoUpdate, setContentInfoUpdate] = useState({
    agentRefStatus: false,
    bookingSource: false,
    contractIssued: false,
    downgradeTimeDate: false,
    contractReceived: false,
    agentPercentage: false,
    agent: false,
  });
  const [switches, setSwitches] = useState({
    agentBooking: false,
    exclusiveBooking: false,
    drinksReminders: false,
    finalPaymentWarning: false,
    onlineAccount: false,
  });
  const [agentPercentage, setAgentPercentage] = useState('');
  const [contractReceived, setContractReceived] = useState('');
  const prevEnquirieDetail = useRef(null);

  useEffect(() => {
    if (enquirieDetail) {
      setAgentRef(enquirieDetail?.agent_ref_po_no);
      setOwnerSelect(enquirieDetail?.booking_source ?? null);
      setAgentPercentage(
        enquirieDetail?.agent_percentage
          ? Number(enquirieDetail?.agent_percentage)
          : '',
      );
      setAgentSelect(enquirieDetail?.agent ?? '');
      setContractIssued(enquirieDetail?.contract_issued ?? '');
      setDowngradeTimeDate(enquirieDetail?.downgrade_at ?? '');
      setContractReceived(enquirieDetail?.contract_received ?? '');
      if (Object.values(enquirieDetail).length) {
        setSwitches({
          agentBooking: enquirieDetail?.agent_booking,
          exclusiveBooking: enquirieDetail?.exclusive_booking,
          drinksReminders: enquirieDetail?.drinks_reminders,
          finalPaymentWarning: enquirieDetail?.final_payment_warnings,
          onlineAccount: enquirieDetail?.online_account,
        });
        if (
          enquirieDetail?.agent_booking !==
          prevEnquirieDetail.current?.agent_booking
        ) {
          if (enquirieDetail?.agent_booking)
            dispatch(getAccountAgentsListData());
          prevEnquirieDetail.current = enquirieDetail?.is_booking;
        }
        setComplained(enquirieDetail?.complained);
      }
    }
  }, [enquirieDetail]);

  useEffect(() => {
    if (isBookingUpdated) {
      navigate('/bookings');
      // dispatch(getEnquiriesData(enquirieDetail?._id));
      dispatch(setIsBookingUpdated(false));
    }
  }, [isBookingUpdated]);

  useEffect(() => {
    if (isDowngradeUpdate) {
      navigate(`/edit-enquiries/${enquirieDetail?._id}`);
      dispatch(setIsDowngrade(false));
    }
  }, [isDowngradeUpdate]);

  const handleSwitchChange = (name, checked) => {
    setSwitches(prevSwitches => ({
      ...prevSwitches,
      [name]: checked,
    }));
  };

  const handleUpdateEnquiries = (key, value) => {
    if (key === 'exclusive_booking') {
      dispatch(
        updateEnquiries({
          _id: enquirieDetail?._id,
          [key]: value,
          drinks_reminders: value,
          final_payment_warnings: value,
          online_account: value,
        }),
      );
    } else {
      dispatch(
        updateEnquiries({
          _id: enquirieDetail?._id,
          [key]: value,
        }),
      );
    }
  };
  const renderAgentSection = useMemo(() => {
    if (switches?.agentBooking) {
      return (
        <>
          <li>
            <label className="fw_500">Agent Percentage:</label>
            <div className="right_content">
              <div className="d-flex justify-content-between align-items-center">
                <FormGroup className="input_wrap w-50">
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      onKeyDown={e => {
                        numberRegex(e);
                      }}
                      inputProps={{ min: 0, step: 'any' }}
                      id="AgentPercentage"
                      variant="outlined"
                      className="input_wrap"
                      placeholder="0"
                      value={agentPercentage}
                      onChange={e => {
                        setAgentPercentage(e.target.value);
                      }}
                    />
                  </FormControl>
                </FormGroup>
                <Button
                  className="btn_border small"
                  onClick={() => {
                    handleUpdateEnquiries(
                      'agent_percentage',
                      Number(agentPercentage),
                    );
                    setContentInfoUpdate({
                      ...contentInfoUpdate,
                      agentPercentage: true,
                    });
                  }}
                >
                  {contentInfoUpdate.agentPercentage
                    ? 'Updated'
                    : 'Update Agent Percentage'}
                </Button>
              </div>
            </div>
          </li>
          <li>
            <label className="fw_500">Agent:</label>
            <div className="right_content">
              <div className="d-flex justify-content-between align-items-center">
                <FormControl className="w-50">
                  <Select
                    labelId="Enquiries-label"
                    id="Enquiries"
                    value={agentSelect}
                    onChange={event => setAgentSelect(event.target.value)}
                    defaultValue="Select"
                    className="select_wrap"
                  >
                    <MenuItem value="Select" disabled>
                      Select
                    </MenuItem>
                    {accountAgentsListData?.map(element => {
                      return (
                        <MenuItem value={element?._id} key={element?._id}>
                          {element?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Button
                  className="btn_border small"
                  onClick={() => {
                    handleUpdateEnquiries('agent', agentSelect);
                    setContentInfoUpdate({
                      ...contentInfoUpdate,
                      agent: true,
                    });
                  }}
                >
                  {contentInfoUpdate.agent ? 'Updated' : 'Update Agent'}
                </Button>
              </div>
            </div>
          </li>
        </>
      );
    } else return null;
  }, [switches?.agentBooking]);

  const OpenDowngradeEnquiry = flag => setDowngradeEnquiryPopup(flag);
  const openCancelBooking = flag => setCancelBookingPopup(flag);

  return (
    <>
      <div className="card_wrapper mb-4">
        {bookingLoading && <Loader />}
        <div
          className={`card_header d-flex align-items-center justify-content-between py-2 px-3 ${
            pages === 'enquiries' ? 'enquiry' : ''
          }`}
        >
          <h4 className="m-0 py-1 text_white">Contact Information</h4>
          <Link
            to={`/contact/edit-contact/${enquirieDetail?.contact?._id}`}
            state={{ _id: enquirieDetail?._id, booking: pages }} // Add state here for contact update
            className="btn_border small"
          >
            Edit Contact
          </Link>
        </div>
        <div className="card_body">
          <ul>
            <li>
              <label className="fw_500">Agent Ref / PO #:</label>
              <div className="right_content">
                <div className="d-flex justify-content-between">
                  <FormGroup className="input_wrap w-50">
                    <FormControl fullWidth className="small_select">
                      <TextField
                        id="Due_input"
                        type="text"
                        variant="outlined"
                        className="input_wrap"
                        placeholder="Enter agent ref"
                        value={agentRef}
                        onChange={e => setAgentRef(e.target.value)}
                      />
                    </FormControl>
                  </FormGroup>
                  <Button
                    className="btn_border small"
                    onClick={() => {
                      handleUpdateEnquiries('agent_ref_po_no', agentRef);
                      setContentInfoUpdate({
                        ...contentInfoUpdate,
                        agentRefStatus: true,
                      });
                    }}
                  >
                    {contentInfoUpdate.agentRefStatus
                      ? 'Updated'
                      : 'Update Reference'}
                  </Button>
                </div>
              </div>
            </li>
            {pages === 'booking' && (
              <>
                <TransferredFromList enquirieDetail={enquirieDetail} />
                <MovedFromList enquirieDetail={enquirieDetail} />
              </>
            )}
            <li>
              <label className="fw_500">Name:</label>
              <div className="right_content">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="m-0">
                      {Object.keys(enquirieDetail).length ? (
                        <>
                          {enquirieDetail?.contact?.title +
                            ' ' +
                            enquirieDetail?.contact?.first_name +
                            ' ' +
                            enquirieDetail?.contact?.surname}
                        </>
                      ) : (
                        ''
                      )}
                      {enquirieDetail?.contact?.is_exclusive && (
                        <Link
                          to={`/contact/edit-contact/${enquirieDetail?.contact?._id}`}
                          className="btn_border small ms-2"
                        >
                          {enquirieDetail?.contact?.is_exclusive
                            ? 'EXCLUSIVE CLIENT'
                            : ''}
                        </Link>
                      )}
                    </h5>
                  </div>

                  <Link
                    to={`${process.env.REACT_APP_WEBSITE_URL}login?email=${enquirieDetail?.contact?.email_primary}&password=frmcrmbo`}
                    className="btn_border small"
                    target="_blank"
                  >
                    Log into BPE.com
                  </Link>
                </div>
              </div>
            </li>
            <li>
              <label className="fw_500">Organisation Name:</label>
              <div className="right_content">
                <h5 className="m-0">
                  {enquirieDetail?.contact?.company_name ?? '-'}
                </h5>
              </div>
            </li>
            <ContactDetail
              label="Telephone"
              value={enquirieDetail?.contact?.telephone_primary}
            />
            <ContactDetail
              label="Mobile"
              value={enquirieDetail?.contact?.telephone_secondary}
            />
            <ContactDetail label="Fax" value={enquirieDetail?.contact?.fax} />
            <ContactDetail
              label="Email (Primary)"
              value={enquirieDetail?.contact?.email_primary}
            />
            <ContactDetail
              label="Email (Secondary)"
              value={enquirieDetail?.contact?.email_secondary}
            />
            <ContactDetail
              label="Address"
              value={enquirieDetail?.contact?.address_line_1}
            />
            <ContactDetail label="City" value={enquirieDetail?.contact?.city} />
            <ContactDetail
              label="County"
              value={enquirieDetail?.contact?.country}
            />
            <ContactDetail
              label="Postcode"
              value={enquirieDetail?.contact?.post_code}
            />
            <ContactDetail
              label="Account Type"
              value={
                enquirieDetail?.contact?.account?.type
                  ? contactTypes[enquirieDetail?.contact?.account?.type]?.name
                  : '-'
              }
            />
            <li>
              <label className="fw_500">OK to Email:</label>
              <div className="right_content">
                <img
                  src={
                    enquirieDetail?.contact?.full_opt_out
                      ? CheckIcon
                      : CrossIcon
                  }
                  alt="check Icon"
                />
              </div>
            </li>
            <li>
              <label className="fw_500">Booking Source:</label>
              <div className="right_content">
                <div className="d-flex justify-content-between align-items-center">
                  <FormControl className="w-50">
                    <Select
                      labelId="Enquiries-label"
                      id="Enquiries"
                      value={ownerSelect}
                      onChange={event => setOwnerSelect(event.target.value)}
                      defaultValue="Please Select"
                      className="select_wrap"
                    >
                      <MenuItem value="Please Select">Please Select</MenuItem>
                      {activeContactSourcesList?.map(item =>
                        item.group_data.map(element => {
                          return (
                            <MenuItem value={element?._id} key={element?._id}>
                              {element?.name}
                            </MenuItem>
                          );
                        }),
                      )}
                    </Select>
                  </FormControl>
                  <Button
                    className="btn_border small"
                    onClick={() => {
                      handleUpdateEnquiries('booking_source', ownerSelect);
                      setContentInfoUpdate({
                        ...contentInfoUpdate,
                        bookingSource: true,
                      });
                    }}
                  >
                    {contentInfoUpdate.bookingSource
                      ? 'Updated'
                      : 'Update Source'}
                  </Button>
                </div>
              </div>
            </li>
            <li>
              <label className="fw_500">Contract Issued:</label>
              <div className="right_content">
                <div className="date_picker  d-flex justify-content-between align-items-center">
                  <div className="w-50">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={contractIssued}
                        inputFormat="DD-MM-YYYY"
                        onChange={value => {
                          setContractIssued(value);
                        }}
                        renderInput={params => {
                          return <TextField {...params} />;
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <Button
                    className="btn_border small"
                    onClick={() => {
                      handleUpdateEnquiries('contract_issued', contractIssued);
                      setContentInfoUpdate({
                        ...contentInfoUpdate,
                        contractIssued: true,
                      });
                    }}
                  >
                    {contentInfoUpdate.contractIssued
                      ? 'Updated'
                      : 'Update Contract Issued'}
                  </Button>
                </div>
              </div>
            </li>
            <li>
              <label className="fw_500">Contract Received:</label>
              <div className="right_content">
                <div className="date_picker  d-flex justify-content-between align-items-center">
                  <div className="w-50">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={contractReceived}
                        inputFormat="DD-MM-YYYY"
                        onChange={value => {
                          setContractReceived(value);
                        }}
                        renderInput={params => {
                          return <TextField {...params} />;
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <Button
                    className="btn_border small"
                    onClick={() => {
                      handleUpdateEnquiries(
                        'contract_received',
                        contractReceived,
                      );
                      setContentInfoUpdate({
                        ...contentInfoUpdate,
                        contractReceived: true,
                      });
                    }}
                  >
                    {contentInfoUpdate.contractReceived
                      ? 'Updated'
                      : 'Update Contract Received'}
                  </Button>
                </div>
              </div>
            </li>
            <ToggleButton
              label={'Agent Booking'}
              switchState={switches?.agentBooking}
              onSwitchChange={e => {
                handleSwitchChange('agentBooking', e.target.checked);
                handleUpdateEnquiries(
                  'agent_booking',
                  !enquirieDetail?.agent_booking,
                );
              }}
              name="agentBooking"
            />
            {renderAgentSection}
            <li>
              <label className="fw_500">Downgrade Time:</label>
              <div className="right_content">
                <div className="date_picker  d-flex justify-content-between align-items-center">
                  <div className="w-50">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={downgradeTimeDate}
                        inputFormat="DD-MM-YYYY"
                        onChange={value => {
                          setDowngradeTimeDate(value);
                        }}
                        renderInput={params => {
                          return <TextField {...params} />;
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <Button
                    className="btn_border small"
                    onClick={() => {
                      handleUpdateEnquiries('downgrade_at', downgradeTimeDate);
                      setContentInfoUpdate({
                        ...contentInfoUpdate,
                        downgradeTimeDate: true,
                      });
                    }}
                  >
                    {contentInfoUpdate.downgradeTimeDate
                      ? 'Updated'
                      : 'Update Downgrade At'}
                  </Button>
                </div>
              </div>
            </li>
            <ToggleButton
              label={'Exclusive Booking'}
              switchState={switches?.exclusiveBooking}
              onSwitchChange={e => {
                setSwitches(prevSwitches => ({
                  ...prevSwitches,
                  exclusiveBooking: e.target.checked,
                  drinksReminders: e.target.checked,
                  finalPaymentWarning: e.target.checked,
                  onlineAccount: e.target.checked,
                }));
                handleUpdateEnquiries(
                  'exclusive_booking',
                  !enquirieDetail?.exclusive_booking,
                );
              }}
              name="exclusiveBooking"
            />
            <ToggleButton
              label={'Drinks Reminders'}
              switchState={switches?.drinksReminders}
              onSwitchChange={e => {
                handleSwitchChange('drinksReminders', e.target.checked);
                handleUpdateEnquiries(
                  'drinks_reminders',
                  !enquirieDetail?.drinks_reminders,
                );
              }}
              name="drinksReminders"
            />
            <ToggleButton
              label={'Final Payment Warning'}
              switchState={switches?.finalPaymentWarning}
              onSwitchChange={e => {
                handleSwitchChange('finalPaymentWarning', e.target.checked);
                handleUpdateEnquiries(
                  'final_payment_warnings',
                  !enquirieDetail?.final_payment_warnings,
                );
              }}
              name="finalPaymentWarning"
            />
            <ToggleButton
              label={'Online Account'}
              switchState={switches?.onlineAccount}
              onSwitchChange={e => {
                handleSwitchChange('onlineAccount', e.target.checked);
                handleUpdateEnquiries(
                  'online_account',
                  !enquirieDetail?.online_account,
                );
              }}
              name="onlineAccount"
            />
            <li>
              <label className="fw_500">Complained:</label>
              <div className="right_content">
                <div className="d-flex align-items-center justify-content-between">
                  <img
                    src={complained ? CheckIcon : CrossIcon}
                    alt="Cross Icon"
                  />
                  <Button
                    className="btn_border small"
                    onClick={() => {
                      setComplained(!complained);
                      handleUpdateEnquiries('complained', !complained);
                    }}
                    name="Complained"
                  >
                    {complained ? 'Did Not Complain' : 'Mark As Complained'}
                  </Button>
                </div>
              </div>
            </li>
          </ul>
          <div className="card_footer mb-2">
            {pages === 'booking' && (
              <ul className="d-flex justify-content-end flex-wrap">
                {/* {enquirieDetail?.payment_info?.amount_paid > 0 && ( */}
                {!enquirieDetail?.is_cancelled && (
                  <>
                    <li className="mb-1">
                      <Button
                        className="btn_border small"
                        onClick={() => setTransferBookingPopup(true)}
                      >
                        Transfer Booking
                      </Button>
                    </li>
                    <li className="mb-1">
                      <Button
                        className="btn_border small"
                        onClick={() => setMoveBookingPopup(true)}
                      >
                        Move Booking
                      </Button>
                    </li>
                  </>
                )}
                {/* )} */}
                {enquirieDetail?.is_booking &&
                (+enquirieDetail?.booking_info?.confirmed_places ||
                  +enquirieDetail?.booking_info?.provisional_places) ? (
                  <li className="mb-1">
                    <Button
                      className="btn_border small"
                      onClick={() => OpenDowngradeEnquiry(true)}
                    >
                      Downgrade to Enquiry
                    </Button>
                  </li>
                ) : (
                  ''
                )}
                {!Boolean(
                  enquirieDetail?.is_payment || enquirieDetail?.is_invoice,
                ) && (
                  <li className="mb-1">
                    <Button
                      className="btn_border small"
                      onClick={() => openCancelBooking(true)}
                    >
                      Cancel Booking
                    </Button>
                  </li>
                )}
              </ul>
            )}
            {pages === 'booking' &&
              enquirieDetail?.booking_info?.provisional_places <= 0 &&
              enquirieDetail?.booking_info?.confirmed_places && (
                <div className="text-end mt-2">
                  <Button
                    className="btn_border small ms-3"
                    onClick={() => {
                      navigate(`/edit-bookings/booking-e-ticket/${bookingId}`);
                    }}
                  >
                    e-Tickets
                  </Button>
                </div>
              )}
            {pages === 'enquiries' && (
              <ul className="d-flex justify-content-end">
                <li>
                  <Button
                    className="btn_primary small"
                    onClick={() => openCancelBooking(true)}
                  >
                    Cancel Enquiry
                  </Button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <TransferBookingToContact
        transferBookingPopup={transferBookingPopup}
        setTransferBookingPopup={setTransferBookingPopup}
      />
      <MoveBookingTo
        moveBookingPopup={moveBookingPopup}
        setMoveBookingPopup={setMoveBookingPopup}
      />
      <DowngradeEnquiryPopup
        downgradeEnquiryPopup={downgradeEnquiryPopup}
        OpenDowngradeEnquiry={OpenDowngradeEnquiry}
      />
      <CancelBookingPopup
        cancelBookingPopup={cancelBookingPopup}
        openCancelBooking={openCancelBooking}
      />
    </>
  );
}
