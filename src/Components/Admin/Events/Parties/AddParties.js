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
import { Col, Row } from 'react-bootstrap';
import { ErrorMessage, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  createEvent,
  setEventDetail,
  setIsEventUpdated,
} from 'store/reducers/Admin/Events/Parties/parties.slice';
import * as Yup from 'yup';
import { yearsArrayCreateEvent } from 'utils/FieldValues';
import { getThemeListData } from 'store/reducers/Admin/Events/theme.slice';
import { getVenueListData } from 'store/reducers/Admin/Events/venue.slice';
import Loader from 'Components/Common/Loader';
import { getTaxCodesListData } from 'store/reducers/Admin/Financial/taxCodes.slice';
import { getSalesRulesListData } from 'store/reducers/Admin/Events/salesRules.slice';
import { numberRegex } from 'utils/common';
import { DuplicateAndCloneEvent } from './EditParties/DuplicateAndCloneEvent';
import { EventProducts } from './EditParties/EventProducts';
import { getProductListData } from 'store/reducers/Admin/Events/ProductCategory/product.slice';
import { Automation } from './EditParties/Automation';

export default function AddParties() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isEventUpdated, eventLoading, eventDetail } = useSelector(
    ({ parties }) => parties,
  );
  const { activeProductList } = useSelector(({ product }) => product);

  const { activeThemeList } = useSelector(({ theme }) => theme);
  const { activeVenueList } = useSelector(({ venue }) => venue);
  const { activeTaxCodesList } = useSelector(({ taxCodes }) => taxCodes);
  const { activeSalesRulesList } = useSelector(({ salesRules }) => salesRules);
  // const [eventYear, setEventYear] = useState('SelectOne');
  const [Venue, setVenue] = useState('Select');
  const [Theme, setTheme] = useState('Select');
  const [taxRate, setTaxRate] = useState('vat');
  const [priceRule, setPriceRule] = useState('default');
  const [products, setProducts] = useState([]);

  let { eventId } = useParams();
  const currentYear = new Date().getFullYear();
  const eventYear = eventDetail?.year || currentYear; // Use eventDetail?.year if available, otherwise, use current year
  const pastYear = eventYear - 1;
  const futureYear = currentYear + 6;

  const yearsArrayEditEvent = Array.from(
    { length: futureYear - pastYear + 1 }, // Include both past and future years
    (_, index) => pastYear + index,
  );
  const initialValuesEvent = {
    sku: '',
    cost_centre: '',
    booking_unique_id: '',
    year: new Date().getFullYear(),
    internal_name: '',
    public_name: '',
    venue_id: '',
    theme_id: '',
    total_places: '',
    overbook_maximum: '',
    minimum_places_exclusive: 0,
    price_per_head: '',
    deposit_per_head: '',
    tax_code: '',
    price_rule: '',
    sales_target: 0,
    show_online: 1,
    is_active: false,
    deleted: false,
    eticket: false,
    nightly_reports_business_done: false,
  };
  useEffect(() => {
    dispatch(getProductListData());
    dispatch(getSalesRulesListData());
    dispatch(getTaxCodesListData());
  }, [dispatch]);
  useEffect(() => {
    if (isEventUpdated) {
      navigate('/admin/events/parties');
      dispatch(setEventDetail({}));
      dispatch(setIsEventUpdated(false));
    }
    return () => dispatch(setEventDetail({}));
  }, [isEventUpdated]);

  useEffect(() => {
    if (Object.keys(eventDetail).length > 0) {
      setProducts(eventDetail?.productData);
    }
  }, [eventDetail]);

  const addPartiesSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    internal_name: Yup.string()
      .required('Internal name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public name is a required field')
      .matches(/^[^\s]/, 'Public name cannot include leading spaces'),
    booking_unique_id: Yup.string()
      .matches(/^[^\s]/, 'Booking id cannot include leading spaces')
      .required('Booking unique id is a required field'),
    year: Yup.string().required('Year is a required field'),
    venue_id: Yup.string().required('Venue is a required field'),
    theme_id: Yup.string().required('Theme is a required field'),
    tax_code: Yup.string().required('Tax Code is a required field'),
  });

  const eventYearhandleChange = event => {
    // setEventYear(event.target.value);
  };
  const VenuehandleChange = event => {
    setVenue(event.target.value);
  };
  const ThemehandleChange = event => {
    setTheme(event.target.value);
  };
  const taxRatehandleChange = event => {
    setTaxRate(event.target.value);
  };
  const priceRulehandleChange = event => {
    setPriceRule(event.target.value);
  };

  return (
    <div className="inner_wrapper">
      {eventLoading && <Loader />}
      <div className="addparties_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/admin/events/parties">Events / Parties</Link>
            <Typography>Add New Events</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Add New Event</h1>
        </div>
        <div className="editparties_wrap">
          <Row>
            <Col xs={6}>
              <Formik
                enableReinitialize={true}
                initialValues={initialValuesEvent}
                validationSchema={addPartiesSchema}
                onSubmit={values => {
                  const data = {
                    ...values,
                    total_places: Number(values.total_places),
                    overbook_maximum: Number(values.overbook_maximum),
                    minimum_places_exclusive: Number(
                      values.minimum_places_exclusive,
                    ),
                    price_per_head: Number(values.price_per_head),
                    deposit_per_head: Number(values.deposit_per_head),
                    sales_target: Number(values.sales_target),
                  };
                  dispatch(createEvent(data));
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
                    <div className="event_address_wrap">
                      <div className="card_wrapper mb-4">
                        <div className="card_body admin_card_body">
                          <ul>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      SKU<sup className="text_primary">*</sup>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        {...getFieldProps('sku')}
                                        placeholder="Enter sku"
                                        variant="outlined"
                                      />
                                    </FormControl>
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="sku" />
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Cost Centre</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        {...getFieldProps('cost_centre')}
                                        placeholder="Enter cost centre"
                                        variant="outlined"
                                      />
                                    </FormControl>
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="cost_centre" />
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
                                      Booking Unique ID
                                      <sup className="text_primary">*</sup>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="d-flex align-items-center flex-wrap">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <TextField
                                          {...getFieldProps(
                                            'booking_unique_id',
                                          )}
                                          placeholder="Enter booking unique id"
                                          variant="outlined"
                                        />
                                      </FormControl>
                                      <span className="mx-1 text_small">
                                        (shown in email FROM field)
                                      </span>
                                    </div>
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="booking_unique_id" />
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
                                      Year<sup className="text_primary">*</sup>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <Select
                                        labelId="year"
                                        id="year"
                                        name="year"
                                        value={values.year}
                                        onChange={handleChange}
                                        defaultValue="Any Year"
                                        className="input_wrap select_wrap"
                                      >
                                        {yearsArrayCreateEvent.map(item => {
                                          return (
                                            <MenuItem key={item} value={item}>
                                              {item}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl>
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="year" />
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
                                      Internal Name
                                      <sup className="text_primary">*</sup>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        {...getFieldProps('internal_name')}
                                        placeholder="Enter Internal name"
                                        variant="outlined"
                                      />
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="internal_name" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Public Name
                                      <sup className="text_primary">*</sup>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        {...getFieldProps('public_name')}
                                        placeholder="Enter public name"
                                        variant="outlined"
                                      />
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="public_name" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Venue<sup className="text_primary">*</sup>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <Select
                                        labelId="venue_id"
                                        id="venue_id"
                                        name="venue_id"
                                        displayEmpty
                                        value={values.venue_id}
                                        onChange={handleChange}
                                        defaultValue=""
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem value="" disabled>
                                          Select
                                        </MenuItem>
                                        {activeVenueList?.map(item => {
                                          return (
                                            <MenuItem
                                              key={item}
                                              value={item?._id}
                                            >
                                              {item?.sku}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="venue_id" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Theme<sup className="text_primary">*</sup>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <Select
                                        labelId="theme_id"
                                        id="theme_id"
                                        displayEmpty
                                        name="theme_id"
                                        value={values.theme_id}
                                        onChange={handleChange}
                                        defaultValue="Select"
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem value="" disabled>
                                          Select
                                        </MenuItem>
                                        {activeThemeList?.map(item => {
                                          return (
                                            <MenuItem
                                              key={item}
                                              value={item?._id}
                                            >
                                              {item?.sku}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="theme_id" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row className="align-items-start">
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Default Options
                                      <span className="d-block fw_400">
                                        (for each new date added)
                                      </span>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <ul className="parties_option_wrap">
                                      <li>
                                        <div className="d-flex align-items-center mb-2 option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              placeholder=""
                                              onWheel={e => e.target.blur()}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'total_places',
                                                  values.total_places &&
                                                    Number(values.total_places),
                                                );
                                              }}
                                              {...getFieldProps('total_places')}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Places
                                          </span>
                                        </div>
                                      </li>
                                      <li>
                                        <div className="d-flex align-items-center mb-2 option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              placeholder=""
                                              onWheel={e => e.target.blur()}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'overbook_maximum',
                                                  values.overbook_maximum &&
                                                    Number(
                                                      values.overbook_maximum,
                                                    ),
                                                );
                                              }}
                                              {...getFieldProps(
                                                'overbook_maximum',
                                              )}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Overbook Maximum
                                          </span>
                                        </div>
                                      </li>
                                      <li>
                                        <div className="d-flex align-items-center mb-2 option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              placeholder=""
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              onWheel={e => e.target.blur()}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'minimum_places_exclusive',
                                                  values.minimum_places_exclusive &&
                                                    Number(
                                                      values.minimum_places_exclusive,
                                                    ),
                                                );
                                              }}
                                              {...getFieldProps(
                                                'minimum_places_exclusive',
                                              )}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Minimum Places for Exclusive
                                          </span>
                                        </div>
                                      </li>
                                      <li>
                                        <div className="d-flex align-items-center mb-2 option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              placeholder="Enter a Number"
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              onWheel={e => e.target.blur()}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'price_per_head',
                                                  values.price_per_head &&
                                                    Number(
                                                      values.price_per_head,
                                                    ).toFixed(2),
                                                );
                                              }}
                                              {...getFieldProps(
                                                'price_per_head',
                                              )}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Price Per Head (excl. tax)
                                          </span>
                                        </div>
                                      </li>
                                      <li>
                                        <div className="d-flex align-items-center mb-2 option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              placeholder="Enter a Number"
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              onWheel={e => e.target.blur()}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'deposit_per_head',
                                                  Number(
                                                    values.deposit_per_head,
                                                  ).toFixed(2),
                                                );
                                              }}
                                              {...getFieldProps(
                                                'deposit_per_head',
                                              )}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Deposit Per Head (excl. tax)
                                          </span>
                                        </div>
                                      </li>
                                      <li>
                                        <div className="d-flex align-items-center mb-2 option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <Select
                                              labelId="taxRate-label"
                                              id="tax_code"
                                              name="tax_code"
                                              value={values.tax_code}
                                              onChange={handleChange}
                                              displayEmpty
                                              defaultValue={values.tax_code}
                                              className="select_wrap"
                                            >
                                              <MenuItem
                                                value=""
                                                style={{ padding: '14px' }}
                                              >
                                                Select Category
                                              </MenuItem>
                                              {activeTaxCodesList?.map(
                                                (item, index) => {
                                                  return (
                                                    <MenuItem
                                                      key={index}
                                                      value={item?._id}
                                                    >
                                                      {item?.public_name}
                                                    </MenuItem>
                                                  );
                                                },
                                              )}
                                            </Select>
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Tax Code
                                            <sup className="text_primary">
                                              *
                                            </sup>
                                          </span>
                                          <span className="d-block text-danger text_small">
                                            <ErrorMessage name="tax_code" />
                                          </span>
                                        </div>
                                      </li>
                                      <li>
                                        <div className="d-flex align-items-center option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <Select
                                              labelId="priceRule-label"
                                              id="price_rule"
                                              name="price_rule"
                                              value={values.price_rule}
                                              onChange={handleChange}
                                              displayEmpty
                                              className="select_wrap"
                                            >
                                              <MenuItem
                                                value=""
                                                style={{ padding: '14px' }}
                                              >
                                                — Use default —
                                              </MenuItem>
                                              {activeSalesRulesList?.map(
                                                item => {
                                                  return (
                                                    <MenuItem
                                                      key={item}
                                                      value={item?._id}
                                                    >
                                                      {item?.public_name}
                                                    </MenuItem>
                                                  );
                                                },
                                              )}
                                            </Select>
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Price Rule
                                          </span>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Sales Target (Places)
                                      <span className="d-block fw_400">
                                        <small>
                                          Please enter the total target amount
                                          of places for this event.
                                        </small>
                                      </span>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        type="number"
                                        placeholder="Enter a Number"
                                        inputProps={{ min: 0, step: 'any' }}
                                        onWheel={e => e.target.blur()}
                                        onBlurCapture={() => {
                                          setFieldValue(
                                            'sales_target',
                                            values.sales_target &&
                                              Number(
                                                values.sales_target,
                                              ).toFixed(2),
                                          );
                                        }}
                                        {...getFieldProps('sales_target')}
                                        variant="outlined"
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
                                    <label>Show Online</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        aria-labelledby="ShowOnline-label"
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        value={values.show_online}
                                        onChange={e =>
                                          setFieldValue(
                                            'show_online',
                                            e.target.value,
                                          )
                                        }
                                      >
                                        <FormControlLabel
                                          value={0}
                                          control={<Radio />}
                                          label="Yes"
                                        />
                                        <FormControlLabel
                                          value={1}
                                          control={<Radio />}
                                          label="No"
                                        />
                                        <FormControlLabel
                                          value={2}
                                          control={<Radio />}
                                          label="Show for BPE office only"
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
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        onChange={() =>
                                          setFieldValue(
                                            'is_active',
                                            !values.is_active,
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
                                    <label>Deleted</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        aria-labelledby="deleted-label"
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        value={values.deleted}
                                        onChange={() =>
                                          setFieldValue(
                                            'deleted',
                                            !values.deleted,
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
                          </ul>
                          <div className="card_footer admin_card_footer mb-2">
                            <button type="submit" className="btn_primary small">
                              Save Event Setup Info
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </Col>
            <Col xs={6}>
              <div className="event_date_wrap">
                <div className="card_wrapper mb-3">
                  <div className="card_header py-2 px-3">
                    <h4 className="m-0 py-1 text_white">Event Dates</h4>
                  </div>
                  <div className="card_body admin_card_body">
                    <h6 className="fw_500 my-1">Dates</h6>
                    <div className="bg_gray_box px-2 py-3 event_date_inner">
                      <p className="m-0 text_light">
                        There are currently no dates listed for this event
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <EventProducts
          dispatch={dispatch}
          productData={activeProductList}
          eventId={null}
          products={products}
          setProducts={setProducts}
        />
        <Automation dispatch={dispatch} eventDetail={null} />
        <DuplicateAndCloneEvent
          eventInitialEvent={initialValuesEvent}
          editPartiesSchema={addPartiesSchema}
          dispatch={dispatch}
          yearsArray={yearsArrayEditEvent}
          activeVenueList={activeVenueList}
          activeThemeList={activeThemeList}
          activeTaxCodesList={activeTaxCodesList}
          activeSalesRulesList={activeSalesRulesList}
        />
      </div>
    </div>
  );
}
