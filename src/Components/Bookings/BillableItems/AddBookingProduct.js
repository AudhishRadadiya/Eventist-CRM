import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import {
  Typography,
  Breadcrumbs,
  FormGroup,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from '@mui/material';

import { numberRegex } from 'utils/common';
import { yearsTwoYearsInThePastFourYearInTheFuture } from 'utils/FieldValues';

import Loader from 'Components/Common/Loader';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  createProduct,
  getAvailaleEvent,
  setIsProductUpdated,
  setProductDetail,
} from 'store/reducers/Admin/Events/ProductCategory/product.slice';
import { getTaxCodesListData } from 'store/reducers/Admin/Financial/taxCodes.slice';
import { getBillableItemsListData } from 'store/reducers/Admin/Financial/billableItems.slice';
import { getProductCategoryListData } from 'store/reducers/Admin/Events/ProductCategory/productCategory.slice';
import { getSalesRulesListData } from 'store/reducers/Admin/Events/salesRules.slice';

import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';

export default function AddBookingProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookingId } = useParams();

  const { isProductUpdated, productLoading, availableAtEvent } = useSelector(
    ({ product }) => product,
  );
  const { activeTaxCodesList } = useSelector(({ taxCodes }) => taxCodes);
  const { activeBillableItemsList } = useSelector(
    ({ billableItems }) => billableItems,
  );
  const { activeProductCategoryList } = useSelector(
    ({ productCategory }) => productCategory,
  );
  const { activeSalesRulesList } = useSelector(({ salesRules }) => salesRules);

  const initialValuesProduct = {
    years: [],
    sku: '',
    internal_name: '',
    public_name: '',
    category: '',
    description: '',
    add_to_kpis_report: 1,
    gross_price: 0,
    tax_code: '',
    price_rules: [],
    expiry_date: new Date(),
    is_exclusive: false,
    allow_online_ordering: false,
    show_on_bpe_venue_page: false,
    feature_on_bpe_venue_page: false,
    set_order_if_featured: 0,
    bin_id: '',
    is_trackable: false,
    trackable_multiplier: 0,
    notes: '',
    show_on_drinks_summary: true,
    is_active: true,
    deleted: false,
    bill_as: '',
    disable_auto_invoice: false,
    available_at_events: [{ event_id: '', date: [] }],
  };

  const [eventData, setEventData] = useState([]);
  const [productAvailableEventList, setProductAvailableEventList] = useState({
    List: [],
    SelectedList: [],
  });

  const addEditValidationSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    years: Yup.array()
      .min(1, 'Please select at least one year')
      .required('Please select at least one year'),
    internal_name: Yup.string()
      .required('Internal Name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public Name is a required field')
      .matches(/^[^\s]/, 'Public name cannot include leading spaces'),
    category: Yup.string().required('Category is a required field'),
    bill_as: Yup.string().required('Bill As is a required field'),
    tax_code: Yup.string().required('Tax Code is a required field'),
    expiry_date: Yup.date()
      .notRequired()
      .typeError('Please enter a date in the format dd/mm/yyyy'),
  });

  useEffect(() => {
    let dummyList = availableAtEvent.map(e => {
      let dd = e.event_date_data.map(ii => ({
        ...ii,
        selected: false,
      }));
      return { ...e, masterCheck: false, event_date_data: dd };
    });
    setEventData(dummyList);
  }, [availableAtEvent]);

  useEffect(() => {
    if (eventData?.length > 0) {
      setProductAvailableEventList({
        ...productAvailableEventList,
        List: eventData,
      });
    }
  }, [eventData]);

  useEffect(() => {
    if (isProductUpdated) {
      navigate(`/edit-bookings/booking-billable-items/${bookingId}`);
      dispatch(setProductDetail({}));
      dispatch(setIsProductUpdated(false));
    }
    return () => dispatch(setProductDetail({}));
  }, [isProductUpdated]);

  useEffect(() => {
    dispatch(getTaxCodesListData());
    dispatch(getBillableItemsListData());
    dispatch(getProductCategoryListData());
    dispatch(getSalesRulesListData());
    dispatch(getAvailaleEvent());
  }, []);

  return (
    <div className="inner_wrapper">
      {productLoading && <Loader />}
      <div className="add_booking_product_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography to="/bookings">Bookings</Typography>
            <Typography>Edit booking</Typography>
            <Typography>Add Booking Product</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row className="align-items-center">
            <Col xs={3}>
              <h1>Add New Booking Product</h1>
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
        <div className="add_booking_product_wrap">
          <Formik
            enableReinitialize={true}
            initialValues={initialValuesProduct}
            validationSchema={addEditValidationSchema}
            onSubmit={values => {
              const data = {
                ...values,
                available_at_events: productAvailableEventList.SelectedList,
                set_order_if_featured: Number(values.set_order_if_featured),
                add_to_kpis_report: Number(values.add_to_kpis_report),
                trackable_multiplier: Number(values.trackable_multiplier),
                booking_id: bookingId,
              };
              dispatch(createProduct(data));
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
                <Row>
                  <Col lg={6}>
                    <div className="event_detail_wrap">
                      <div className="card_wrapper mb-3">
                        <div className="card_header py-2 px-3">
                          <h4 className="m-0 py-1 text_white">
                            Add New Booking Specific Product
                          </h4>
                        </div>
                        <div className="card_body admin_card_body">
                          <ul>
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
                                    <ul>
                                      {yearsTwoYearsInThePastFourYearInTheFuture?.map(
                                        item => {
                                          return (
                                            <li key={item}>
                                              <div className="form-group checkbox_wrap mb-2">
                                                <Field
                                                  type="checkbox"
                                                  name="years"
                                                  as={FormControlLabel}
                                                  control={<Checkbox />}
                                                  label={item}
                                                  value={item}
                                                  checked={values.years.includes(
                                                    item,
                                                  )}
                                                  onChange={e => {
                                                    const checked =
                                                      e.target.checked;
                                                    const value = Number(
                                                      e.target.value,
                                                    );
                                                    if (checked) {
                                                      setFieldValue('years', [
                                                        ...values.years,
                                                        value,
                                                      ]);
                                                    } else {
                                                      setFieldValue(
                                                        'years',
                                                        values.years.filter(
                                                          e => e !== value,
                                                        ),
                                                      );
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </li>
                                          );
                                        },
                                      )}
                                      <span className="d-block text-danger text_small">
                                        <ErrorMessage name="years" />
                                      </span>
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
                                        id="SKU"
                                        type="text"
                                        variant="outlined"
                                        {...getFieldProps('sku')}
                                        placeholder="Enter sku"
                                      />
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="sku" />
                                  </span>
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
                                        id="internalName"
                                        type="text"
                                        variant="outlined"
                                        {...getFieldProps('internal_name')}
                                        placeholder="Enter internal name"
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
                                        id="publicName"
                                        type="text"
                                        variant="outlined"
                                        {...getFieldProps('public_name')}
                                        placeholder="Enter public name"
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
                                    <label>Description</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        rows={2.5}
                                        multiline
                                        id="description"
                                        type="text"
                                        variant="outlined"
                                        {...getFieldProps('description')}
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
                                      Category
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
                                      <Select
                                        labelId="Category"
                                        value={values.category}
                                        id="category"
                                        name="category"
                                        defaultValue={values.category}
                                        onChange={handleChange}
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem
                                          value="SelectCategory"
                                          disabled
                                        >
                                          Select Category
                                        </MenuItem>
                                        {activeProductCategoryList
                                          ?.filter(
                                            item =>
                                              !item?.sys_only &&
                                              !item?.ledger_neg_income,
                                          )
                                          ?.map((item, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
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
                                    <ErrorMessage name="category" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Bill As
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
                                      <Select
                                        labelId="billAs"
                                        id="bill_as"
                                        name="bill_as"
                                        value={values.bill_as}
                                        defaultValue={values.bill_as}
                                        onChange={handleChange}
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem
                                          value="SelectCategory"
                                          disabled
                                        >
                                          Select Category
                                        </MenuItem>
                                        {activeBillableItemsList
                                          .filter(
                                            item =>
                                              !item?.sys_only &&
                                              !item?.ledger_neg_income,
                                          )
                                          ?.map((item, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={item?._id}
                                              >
                                                {item?.internal_name}
                                              </MenuItem>
                                            );
                                          })}
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="bill_as" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Disable Auto Invoice</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <Select
                                        labelId="Invoice"
                                        id="Invoice"
                                        name="disable_auto_invoice"
                                        value={values.disable_auto_invoice}
                                        onChange={handleChange}
                                        defaultValue={
                                          values.disable_auto_invoice
                                        }
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem value={false}>
                                          No (recommended)
                                        </MenuItem>
                                        <MenuItem value={true}>Yes</MenuItem>
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
                                    <label>Add to KPIs Report</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <Select
                                        labelId="addRepor"
                                        id="addRepor"
                                        name="add_to_kpis_report"
                                        value={values.add_to_kpis_report}
                                        onChange={handleChange}
                                        defaultValue={values.add_to_kpis_report}
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem value={1}>
                                          Do not list
                                        </MenuItem>
                                        <MenuItem value={2}>
                                          List under Drinks
                                        </MenuItem>
                                        <MenuItem value={3}>
                                          List under Dodgems
                                        </MenuItem>
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
                                    <label>Gross Price (£)</label>
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
                                          type="number"
                                          onWheel={e => e.target.blur()}
                                          //changes as per client requirement
                                          // onKeyDown={e => {
                                          //   numberRegex(e);
                                          // }}
                                          // inputProps={{ min: 0, step: 'any' }}
                                          // onBlurCapture={() => {
                                          //   setFieldValue(
                                          //     'gross_price',
                                          //     Number(
                                          //       values.gross_price,
                                          //     )?.toFixed(2),
                                          //   );
                                          // }}
                                          {...getFieldProps('gross_price')}
                                          variant="outlined"
                                        />
                                      </FormControl>
                                      {/* <span className="text_small mx-1">
                                        {(values?.tax_code_data?.percentage &&
                                          values?.gross_price) !== 0
                                          ? `(£ ${values?.net_price?.toFixed(2)}
                                           exl. tax ${
                                             values?.tax_code_data?.percentage
                                           }) `
                                          : ''}
                                      </span> */}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Tax Code
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
                                      <Select
                                        labelId="taxCode-label"
                                        id="taxCode"
                                        value={values.tax_code}
                                        name="tax_code"
                                        onChange={handleChange}
                                        defaultValue={values.tax_code}
                                        className="select_wrap"
                                      >
                                        <MenuItem
                                          value="SelectCategory"
                                          disabled
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
                                    <span className="my-1 d-block text_small">
                                      Price entered above includes tax at the
                                      specified rate:
                                    </span>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="tax_code" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Price Rules</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <ul>
                                      {activeSalesRulesList
                                        ?.slice()
                                        ?.sort((a, b) =>
                                          a?.public_name.localeCompare(
                                            b?.public_name,
                                          ),
                                        )
                                        ?.map((item, index) => {
                                          return (
                                            <li>
                                              <div className="form-group checkbox_wrap mb-2">
                                                <FormGroup>
                                                  <FormControlLabel
                                                    key={index}
                                                    control={<Checkbox />}
                                                    name="price_rules"
                                                    label={item?.public_name}
                                                    value={item?._id}
                                                    checked={values.price_rules.includes(
                                                      item?._id,
                                                    )}
                                                    onChange={e => {
                                                      const checked =
                                                        e.target.checked;
                                                      const value =
                                                        e.target.value;
                                                      if (checked) {
                                                        setFieldValue(
                                                          'price_rules',
                                                          [
                                                            ...values.price_rules,
                                                            value,
                                                          ],
                                                        );
                                                      } else {
                                                        setFieldValue(
                                                          'price_rules',
                                                          values.price_rules.filter(
                                                            e => e !== value,
                                                          ),
                                                        );
                                                      }
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
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Product Expires</label>
                                  </div>
                                </Col>

                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap date_picker"
                                    >
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DatePicker
                                          name="expiry_date"
                                          value={values.expiry_date}
                                          inputFormat="DD-MM-YYYY"
                                          onChange={date =>
                                            setFieldValue('expiry_date', date)
                                          }
                                          renderInput={params => (
                                            <TextField
                                              {...params}
                                              id="expiry_date"
                                            />
                                          )}
                                          className="input_wrap"
                                        />
                                      </LocalizationProvider>
                                    </FormControl>
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="expiry_date" />
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Is Exclusive</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="form-group checkbox_wrap mb-0">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="is_exclusive"
                                          value={true}
                                          checked={values.is_exclusive}
                                          onChange={e => {
                                            setFieldValue(
                                              'is_exclusive',
                                              e.target.checked,
                                            );
                                          }}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Allow Online Ordering?</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="form-group checkbox_wrap mb-0">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="allow_online_ordering"
                                          value={true}
                                          checked={values.allow_online_ordering}
                                          onChange={e => {
                                            setFieldValue(
                                              'allow_online_ordering',
                                              e.target.checked,
                                            );
                                          }}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Bin ID</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        id="binID"
                                        type="text"
                                        variant="outlined"
                                        name="bin_id"
                                        {...getFieldProps('bin_id')}
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
                                    <label>Is Trackable</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="form-group checkbox_wrap mb-0">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="is_trackable"
                                          value={true}
                                          checked={values.is_trackable}
                                          onChange={e => {
                                            setFieldValue(
                                              'is_trackable',
                                              e.target.checked,
                                            );
                                          }}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Trackable Multiplier</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        onKeyDown={e => {
                                          numberRegex(e);
                                        }}
                                        inputProps={{ min: 0 }}
                                        onBlurCapture={() => {
                                          setFieldValue(
                                            'trackable_multiplier',
                                            Number(
                                              values.trackable_multiplier,
                                            ).toFixed(2),
                                          );
                                        }}
                                        {...getFieldProps(
                                          'trackable_multiplier',
                                        )}
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
                                    <label>Notes</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        rows={2.5}
                                        multiline
                                        id="notes"
                                        type="text"
                                        variant="outlined"
                                        name="notes"
                                        {...getFieldProps('notes')}
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
                                    <label>Show on drinks summary</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        value={values.show_on_drinks_summary}
                                        onChange={() =>
                                          setFieldValue(
                                            'show_on_drinks_summary',
                                            !values.show_on_drinks_summary,
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
                                    <label>Active</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        value={values.is_active}
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
                            <li className="bg_white_box">
                              <p className="m-0">
                                You can totally remove this product from the
                                system if it is no longer required. Note: the
                                SKU will not become available again as previous
                                bookings may be referenced against it. If you
                                select 'Yes' then you will not be able to undo
                                the delete without knowing the exact sku.
                              </p>
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
                                        aria-labelledby="demo-radio-buttons-group-label"
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
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
