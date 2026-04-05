import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Col, Row } from 'react-bootstrap';
import {
  getEventDateData,
  updateEventDate,
  setIsUpdateEventDateUpdated,
  resetEeventStatus,
} from 'store/reducers/Admin/Events/Parties/parties.slice';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorMessage, Form, Formik } from 'formik';
import { restrictForGroupNew, statusList } from 'utils/FieldValues';
import moment from 'moment';
import * as Yup from 'yup';
import Loader from 'Components/Common/Loader';
import { getSalesRulesListData } from 'store/reducers/Admin/Events/salesRules.slice';
import { getTaxCodesListData } from 'store/reducers/Admin/Financial/taxCodes.slice';
import { getEventStatusesListData } from 'store/reducers/Admin/Events/eventStatuses.slice';
import { DateTimePicker } from '@mui/x-date-pickers';
export default function EditEventDate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { eventDateId } = useParams();

  const { CreateEventDateLoading, eventDateList, isUpdateEventDateUpdated } =
    useSelector(({ parties }) => parties);
  const { activeSalesRulesList } = useSelector(({ salesRules }) => salesRules);
  const { activeTaxCodesList } = useSelector(({ taxCodes }) => taxCodes);
  const { activeEventStatusesList } = useSelector(
    ({ eventStatuses }) => eventStatuses,
  );

  const initialValuesEditDate = {
    date: '',
    places: '',
    overbook_maximum: 0,
    minimum_places: 0,
    minimum_places_exclusive: 0,
    tax_code: '',
    price_per_head_exclusive: 0,
    deposit_per_head_exclusive: 0,
    original_price_if_discounted: 0,
    price_rule: '',
    internal_status: '',
    internal_status_notes: '',
    status: '',
    new_status: '',
    always_show_status_online: false,
    booking_places_interval: 0,
    require_full_payments_for_bookings_below: 0,
    night_code: '',
    contact_source: '',
    hide_price_online: false,
    hide_data_online: false,
    open_for_bookings: false,
    override_online_places_limited_at: 0,
    override_online_places_sold_out_at: 0,
    notes: '',
    is_active: false,
    deleted: false,
    restrict_bookings_to_groups: {
      super: false,
      admin: false,
      minplaces: false,
      canconfirm: false,
      contacts: false,
      assign: false,
      changeplaces: false,
      processcoupons: false,
      reports: false,
      system: false,
      dev: false,
    },
  };
  useEffect(() => {
    dispatch(getTaxCodesListData());
    dispatch(getSalesRulesListData());
    dispatch(getEventStatusesListData());
  }, [dispatch]);
  useEffect(() => {
    if (eventDateId) {
      dispatch(getEventDateData(eventDateId));
    }
  }, [dispatch, eventDateId]);
  const [eventInitialEditDate, setEventInitialEditDate] = useState(
    initialValuesEditDate,
  );
  const editEventDateSchema = Yup.object().shape({
    date: Yup.date().required('Date is a required field'),
    places: Yup.number().required(
      'Please enter the number of places available',
    ),
    minimum_places: Yup.number().required(
      'Please enter the maximum number of places with overbooking capacity',
    ),
    price_per_head_exclusive: Yup.number().required(
      'Please enter a price per head',
    ),
    deposit_per_head_exclusive: Yup.number().required(
      'Please enter a deposit price per head',
    ),
  });
  useEffect(() => {
    if (isUpdateEventDateUpdated) {
      navigate(`/admin/events/parties/edit-parties/${eventDateList?.event_id}`);
      dispatch(setIsUpdateEventDateUpdated(false));
    }
  }, [isUpdateEventDateUpdated, dispatch]);
  useEffect(() => {
    if (Object.keys(eventDateList)?.length > 0) {
      setEventInitialEditDate({
        date: eventDateList?.date,
        places: eventDateList?.places,
        overbook_maximum: eventDateList?.overbook_maximum,
        minimum_places: eventDateList?.minimum_places,
        minimum_places_exclusive: eventDateList?.minimum_places_exclusive,
        tax_code: eventDateList?.tax_code,
        price_per_head_exclusive: eventDateList?.price_per_head_exclusive,
        deposit_per_head_exclusive: eventDateList?.deposit_per_head_exclusive,
        original_price_if_discounted:
          eventDateList?.original_price_if_discounted,
        price_rule: eventDateList?.price_rule,
        internal_status: eventDateList?.internal_status,
        internal_status_notes: eventDateList?.internal_status_notes,
        status: eventDateList?.status
          ? statusList.some(val => eventDateList?.status === val.value)
            ? eventDateList?.status
            : ''
          : '',
        new_status: eventDateList?.status
          ? statusList.some(val => eventDateList?.status === val.value)
            ? ''
            : eventDateList?.status
          : '',
        always_show_status_online: eventDateList?.always_show_status_online,
        booking_places_interval: eventDateList?.booking_places_interval,
        require_full_payments_for_bookings_below:
          eventDateList?.require_full_payments_for_bookings_below,
        night_code: eventDateList?.night_code,
        contact_source: eventDateList?.contact_source,
        hide_price_online: eventDateList?.hide_price_online,
        hide_data_online: eventDateList?.hide_data_online,
        open_for_bookings: eventDateList?.open_for_bookings,
        override_online_places_limited_at:
          eventDateList?.override_online_places_limited_at,
        override_online_places_sold_out_at:
          eventDateList?.override_online_places_sold_out_at,
        restrict_bookings_to_groups: {
          ...initialValuesEditDate.restrict_bookings_to_groups,
          ...eventDateList?.restrict_bookings_to_groups,
        },
        notes: eventDateList?.notes,
        is_active: eventDateList?.is_active,
        deleted: eventDateList?.deleted,
      });
    }
  }, [eventDateList]);
  return (
    <div className="inner_wrapper">
      {CreateEventDateLoading && <Loader />}
      <div className="editparties_eventdate_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/admin/events/parties">Events / Parties</Link>
            <Link
              to={`/admin/events/parties/edit-parties/${eventDateList?.event_id}`}
            >
              Edit Events / Parties
            </Link>
            <Typography>Edit Date</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Edit Date</h1>
        </div>
        <div className="card_wrapper mb-4">
          <Formik
            enableReinitialize={true}
            initialValues={eventInitialEditDate}
            validationSchema={editEventDateSchema}
            onSubmit={values => {
              let data = {
                ...values,
                // date: moment(values.date).format('YYYY-MM-DD'),
                status:
                  values?.new_status?.length > 0
                    ? values?.new_status
                    : values.status || '',
              };
              delete data['new_status'];
              dispatch(
                updateEventDate({
                  _id: eventDateList?._id,
                  date: data,
                }),
              );
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
                <div className="card_body admin_card_body">
                  <ul>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Date<sup className="text_primary">*</sup>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl
                              fullWidth
                              className="main_input_wrap date_picker"
                            >
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  name="date"
                                  inputFormat="DD-MM-YYYY hh:mm a"
                                  value={values.date}
                                  onChange={date => {
                                    setFieldValue('date', date);
                                  }}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      onKeyDown={e => {
                                        if (e.keyCode === 8) {
                                          e.preventDefault();
                                          setFieldValue('start_date', null);
                                          // setFieldValue('date', date?.toDate());
                                        }
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="date" />
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Places<sup className="text_primary">*</sup>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={values.places}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    places: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="places" />
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Overbook Maximum
                              <sup className="text_primary">*</sup>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={values.overbook_maximum}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    overbook_maximum: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Minimum Places</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={values.minimum_places}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    minimum_places: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="minimum_places" />
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Minimum Places for Exclusive</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={values.minimum_places_exclusive}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    minimum_places_exclusive: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Tax Code</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <Select
                                labelId="taxRate-label"
                                id="taxRate"
                                value={values.tax_code}
                                name="tax_code"
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    tax_code: e.target.value,
                                  })
                                }
                                className="select_wrap"
                              >
                                <MenuItem value="SelectCategory" disabled>
                                  Select Category
                                </MenuItem>

                                {activeTaxCodesList?.map((item, index) => {
                                  return (
                                    <MenuItem key={index} value={item?._id}>
                                      {item?.public_name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Price Per Head (excl tax)</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={values.price_per_head_exclusive}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    price_per_head_exclusive: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="price_per_head_exclusive" />
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Deposit Per Head (excl tax)</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={values.deposit_per_head_exclusive}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    deposit_per_head_exclusive: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="deposit_per_head_exclusive" />
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Original Price if Discounted (excl tax)
                              <span className="d-block fw_400">
                                To show this date as a discounted price on the
                                website enter the original full price here,
                                excluding tax. This only affects the display of
                                prices on the website.
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={values.original_price_if_discounted}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    original_price_if_discounted:
                                      e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Price Rule</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <Select
                                labelId="status-select-label"
                                id="statusSelect"
                                defaultValue="7"
                                className="select_wrap"
                                value={values.price_rule}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    price_rule: e.target.value,
                                  })
                                }
                              >
                                {activeSalesRulesList.map(item => {
                                  return (
                                    <MenuItem value={item._id}>
                                      {item.public_name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>

                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Internal Status</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="internal-status-label"
                                defaultValue="activeYes"
                                name="radio-buttons-group"
                                className="custom_radio"
                                value={values.internal_status}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    internal_status: e.target.value,
                                  })
                                }
                                // {...getFieldProps('internal_status')}
                              >
                                {activeEventStatusesList?.map((item, index) => {
                                  return (
                                    <FormControlLabel
                                      key={item?._id}
                                      value={item?._id}
                                      style={{
                                        marginBottom: '2px',
                                        backgroundColor: `${item?.colour}`,
                                        color:
                                          `${item?.name}` ===
                                            'Mixed Party Night' && 'white',
                                      }}
                                      // style={{
                                      //   color: `${item?.colour}`,
                                      // }}
                                      control={<Radio />}
                                      label={item?.name}
                                    />
                                  );
                                })}
                              </RadioGroup>
                              <button
                                type="button"
                                className="btn_border small  btn btn-primary w-fit-content mt-2"
                                onClick={async () => {
                                  let data = {
                                    ...eventInitialEditDate,
                                    internal_status: null,
                                  };
                                  await dispatch(
                                    resetEeventStatus({
                                      _id: eventDateList?._id,
                                      date: data,
                                      stayInPage: true,
                                    }),
                                  );
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    internal_status: null,
                                  });
                                }}
                              >
                                Reset Internal Status
                              </button>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Internal Status Notes</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                rows={2.5}
                                multiline
                                value={values.internal_status_notes}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    internal_status_notes: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Status</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <Select
                                labelId="status-select-label"
                                id="statusSelect"
                                defaultValue="7"
                                className="select_wrap"
                                value={values.status}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    status: e.target.value,
                                  })
                                }
                              >
                                {statusList.map(item => {
                                  return (
                                    <MenuItem value={item.value}>
                                      {item.label}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <span className="my-1 text_small d-block">
                              Or add new status
                            </span>
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                id="Status"
                                type="text"
                                variant="outlined"
                                value={values.new_status}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    new_status: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Always show above status online
                              <span className="d-block fw_400">
                                (Overrides the Sold Out text)
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="always-online-label"
                                name="radio-buttons-group"
                                value={values.always_show_status_online}
                                className="custom_radio"
                                onChange={() =>
                                  setFieldValue(
                                    'always_show_status_online',
                                    !values.always_show_status_online,
                                  )
                                }
                              >
                                <FormControlLabel
                                  value={true}
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value={false}
                                  control={<Radio />}
                                  label="No"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Booking Places Intervals
                              <span className="d-block fw_400">
                                Default: 1 place - if you want to force people
                                to book in multiples of 10 for example then
                                change this to 10 - this means people can only
                                book whole tables.
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                id="BookingPlaces"
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={values.booking_places_interval}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    booking_places_interval: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Require Full Payment for Bookings Below:
                              <span className="d-block fw_400">
                                Set to 0 or leave blank to disable - if you
                                enter a number then bookings made online will be
                                forced to make full payment if they are below
                                this number. Any bookings of this number and
                                above can be made with deposits. Enter a very
                                high number to force all bookings to pay in
                                full.
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                type="number"
                                onWheel={e => e.target.blur()}
                                id="FullPayment"
                                value={
                                  values.require_full_payments_for_bookings_below
                                }
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    require_full_payments_for_bookings_below:
                                      e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Night Code
                              <span className="d-block fw_400">
                                Note: this night will only be open to people who
                                know this code
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                id="NightCode"
                                value={values.night_code}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    night_code: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Set Contact Source
                              <span className="d-block fw_400">
                                Enter the ID of the contact source and all
                                contacts who book on this night will be assigned
                                to this contact source - NOTE: this only works
                                when using the lock code above.
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                id="ContactSource"
                                value={values.contact_source}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    contact_source: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Hide price online</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="hide-price-label"
                                value={values.hide_price_online}
                                onChange={() =>
                                  setFieldValue(
                                    'hide_price_online',
                                    !values.hide_price_online,
                                  )
                                }
                                name="radio-buttons-group"
                                className="custom_radio"
                              >
                                <FormControlLabel
                                  value={true}
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value={false}
                                  control={<Radio />}
                                  label="No"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Hide date online</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="hide-date-label"
                                value={values.hide_data_online}
                                onChange={() =>
                                  setFieldValue(
                                    'hide_data_online',
                                    !values.hide_data_online,
                                  )
                                }
                                name="radio-buttons-group"
                                className="custom_radio"
                              >
                                <FormControlLabel
                                  value={true}
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value={false}
                                  control={<Radio />}
                                  label="No"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Open for Bookings</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="open-booking-label"
                                value={values.open_for_bookings}
                                onChange={() =>
                                  setFieldValue(
                                    'open_for_bookings',
                                    !values.open_for_bookings,
                                  )
                                }
                                name="radio-buttons-group"
                                className="custom_radio"
                              >
                                <FormControlLabel
                                  value={true}
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value={false}
                                  control={<Radio />}
                                  label="No"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Override Online Places Limited at
                              <span className="d-block fw_400">
                                Set the number of places which triggers the
                                website to show Limited Places as the night
                                status.
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                type="number"
                                onWheel={e => e.target.blur()}
                                id="OnlineLimit"
                                value={values.override_online_places_limited_at}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    override_online_places_limited_at:
                                      e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Override Online Places Sold Out at
                              <span className="d-block fw_400">
                                Set the number of places which triggers the
                                website to show Sold Out as the night status.
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                id="OnlineSold"
                                type="number"
                                onWheel={e => e.target.blur()}
                                value={
                                  values.override_online_places_sold_out_at
                                }
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    override_online_places_sold_out_at:
                                      e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>
                              Restrict Booking to Following Groups
                              <span className="d-block fw_400">
                                Note: Super and Admin will always have access to
                                book regardless of what is ticked here.
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <ul>
                              {/* {restrictForGroupNew.map((item, i) => {
                                return (
                                  <li key={i}>
                                    <div className="form-group inline checkbox_wrap mb-0">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="restrict_bookings_to_groups"
                                          label={item?.label}
                                          value={item?.value}
                                          checked={
                                            Array.isArray(
                                              values?.restrict_bookings_to_groups,
                                            ) &&
                                            values?.restrict_bookings_to_groups?.includes(
                                              item?.value,
                                            )
                                          }
                                          onChange={handleChange}
                                        />
                                      </FormGroup>
                                    </div>
                                  </li>
                                );
                              })} */}
                              <Col xs={7}>
                                <div className="card_content_right">
                                  <ul>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="super"
                                              name="super"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.super
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    super:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.super,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Super Administrator (can perform special functions)"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="admin"
                                              name="admin"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.admin
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    admin:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.admin,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Administrator (access all areas - not development)"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="minplaces"
                                              name="minplaces"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.minplaces
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    minplaces:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.minplaces,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Ability to create booking with minimum of ONE space"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="canconfirm"
                                              name="canconfirm"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.canconfirm
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    canconfirm:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.canconfirm,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Ability to confirm a booking without payment"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="contacts"
                                              name="contacts"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.contacts
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    contacts:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.contacts,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Ability to manage contacts with accounts"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="assign"
                                              name="assign"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.assign
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    assign:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.assign,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Ability to assign bookings to other users"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="changeplaces"
                                              name="changeplaces"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.changeplaces
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    changeplaces:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.changeplaces,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Change Places Once Invoiced"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="processcoupons"
                                              name="processcoupons"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.processcoupons
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    processcoupons:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.processcoupons,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Accept and Process Coupons"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="reports"
                                              name="reports"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.reports
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    reports:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.reports,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Create/View reports"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="system"
                                              name="system"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.system
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    system:
                                                      !values
                                                        ?.restrict_bookings_to_groups
                                                        ?.system,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="System Access (can use dangerous system functions)"
                                        />
                                      </FormGroup>
                                    </li>
                                    <li>
                                      <FormGroup className="inline_checkbox_wrap mb-2">
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="dev"
                                              name="dev"
                                              checked={
                                                values
                                                  ?.restrict_bookings_to_groups
                                                  ?.dev
                                              }
                                              onChange={() =>
                                                setFieldValue(
                                                  'restrict_bookings_to_groups',
                                                  {
                                                    ...values?.restrict_bookings_to_groups,
                                                    dev: !values?.permissions
                                                      ?.dev,
                                                  },
                                                )
                                              }
                                            />
                                          }
                                          label="Developer Access (can use development functions)"
                                        />
                                      </FormGroup>
                                    </li>
                                  </ul>
                                </div>
                              </Col>
                            </ul>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Active</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="active-label"
                                value={values.is_active}
                                onChange={() =>
                                  setFieldValue('is_active', !values.is_active)
                                }
                                name="radio-buttons-group"
                                className="custom_radio"
                              >
                                <FormControlLabel
                                  value={true}
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value={false}
                                  control={<Radio />}
                                  label="No"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Notes</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl fullWidth className="main_input_wrap">
                              <TextField
                                rows={2.5}
                                multiline
                                id="Notes"
                                value={values.notes}
                                onChange={e =>
                                  setEventInitialEditDate({
                                    ...eventInitialEditDate,
                                    notes: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <p className="m-0 fw_400">
                              You can totally remove this date from the system
                              if it is no longer required. Note: the SKU will
                              not become available again as previous bookings
                              may be referenced against it. If you select 'Yes'
                              then you will not be able to undo the delete
                              without knowing the exact sku.
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col xs={5}>
                          <div className="card_content_left">
                            <label>Deleted</label>
                          </div>
                        </Col>
                        <Col xs={7}>
                          <div className="card_content_right">
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="deleted-label"
                                value={values.deleted}
                                name="radio-buttons-group"
                                className="custom_radio"
                                onChange={() =>
                                  setFieldValue('deleted', !values.deleted)
                                }
                              >
                                <FormControlLabel
                                  value={true}
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value={false}
                                  control={<Radio />}
                                  label="No"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                  </ul>
                  <div className="card_footer admin_card_footer mb-2">
                    <button type="submit" className="btn_primary small">
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
