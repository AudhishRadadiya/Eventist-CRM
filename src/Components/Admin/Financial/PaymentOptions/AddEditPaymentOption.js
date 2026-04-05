import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import { ErrorMessage, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Breadcrumbs,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
} from '@mui/material';

import {
  createPaymentOptions,
  getPaymentChannelListData,
  getPaymentOptionsData,
  getSurchargeTaxListData,
  setIsPaymentOptionsUpdated,
  setPaymentOptionsDetail,
  updatePaymentOptions,
} from 'store/reducers/Admin/Financial/paymentOptions.slice';
import Loader from 'Components/Common/Loader';

import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';

export default function AddEditPaymentOption() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { paymentOptionsId } = useParams();

  const {
    paymentOptionsLoading,
    surchargeTaxList,
    paymentOptionsDetail,
    isPaymentOptionsUpdated,
    paymentChannelList,
  } = useSelector(({ paymentOptions }) => paymentOptions);

  const initialValuesPaymentOptions = {
    sku: '',
    internal_name: '',
    public_name: '',
    payment_channel: '',
    new_payment_channel: '',
    gl_code: '',
    surcharge_amount: 0,
    surcharge_type: 0,
    surcharge_tax: '',
    order: 0,
    is_active: false,
    deleted: false,
  };

  const [paymentOptionsInitialValues, setPaymentOptionsInitialValues] =
    useState(initialValuesPaymentOptions);

  const optionsSurchargeType = [
    {
      label: '% Percentage',
      value: 0,
    },
    {
      label: 'Absolute Amount',
      value: 1,
    },
  ];

  const addEditPaymentOptionsSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    internal_name: Yup.string()
      .required('Internal Name is a required field')
      .matches(/^[^\s]/, 'Internal Name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public Name is a required field')
      .matches(/^[^\s]/, 'Public Name cannot include leading spaces'),
    gl_code: Yup.string().required('GL Code is a required field'),
  });

  useEffect(() => {
    dispatch(getPaymentChannelListData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSurchargeTaxListData());
  }, [dispatch]);

  useEffect(() => {
    if (paymentOptionsId) {
      dispatch(getPaymentOptionsData(paymentOptionsId));
    }
  }, [paymentOptionsId, dispatch]);

  useEffect(() => {
    if (Object.keys(paymentOptionsDetail)?.length > 0) {
      setPaymentOptionsInitialValues({
        sku: paymentOptionsDetail?.sku || '',
        internal_name: paymentOptionsDetail?.internal_name || '',
        public_name: paymentOptionsDetail?.public_name || '',
        payment_channel: paymentOptionsDetail?.payment_channel || '',
        gl_code: paymentOptionsDetail?.gl_code || '',
        surcharge_amount: paymentOptionsDetail?.surcharge_amount || 0,
        surcharge_type: paymentOptionsDetail?.surcharge_type,
        surcharge_tax: paymentOptionsDetail?.surcharge_tax || '',
        order: paymentOptionsDetail?.order || 0,
        is_active: paymentOptionsDetail?.is_active || true,
        deleted: paymentOptionsDetail?.deleted || false,
      });
    }
  }, [paymentOptionsDetail]);

  useEffect(() => {
    if (isPaymentOptionsUpdated) {
      navigate('/payment-options');
      dispatch(setPaymentOptionsDetail({}));
      dispatch(setIsPaymentOptionsUpdated(false));
    }
    return () => dispatch(setPaymentOptionsDetail({}));
  }, [isPaymentOptionsUpdated, navigate, dispatch]);

  return (
    <div className="inner_wrapper">
      {paymentOptionsLoading && <Loader />}
      <div className="add_paymentoption_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Financial</Typography>
            <Link to="/payment-options">Payment Options</Link>
            <Typography>
              {!paymentOptionsLoading &&
              Object.keys(paymentOptionsDetail)?.length === 0
                ? 'Add New Payment Option'
                : 'Edit Payment Option'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!paymentOptionsLoading &&
            Object.keys(paymentOptionsDetail)?.length === 0
              ? 'Add New Payment Option'
              : 'Edit Payment Option'}
          </h1>
        </div>
        <h5 className="text_primary">{paymentOptionsDetail?.internal_name}</h5>
        <div className="add_paymentoption_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={paymentOptionsInitialValues}
              validationSchema={addEditPaymentOptionsSchema}
              onSubmit={values => {
                if (Object.keys(paymentOptionsDetail)?.length > 0) {
                  dispatch(
                    updatePaymentOptions({
                      _id: paymentOptionsDetail?._id,
                      paymentOption: {
                        ...values,
                        surcharge_tax:
                          values?.surcharge_tax === 'Please Select'
                            ? ''
                            : values?.surcharge_tax,
                        payment_channel:
                          values?.new_payment_channel?.length > 0
                            ? values?.new_payment_channel
                            : values?.payment_channel || '',
                      },
                    }),
                  );
                } else {
                  dispatch(
                    createPaymentOptions({
                      ...values,
                      payment_channel:
                        values?.new_payment_channel?.length > 0
                          ? values?.new_payment_channel
                          : values?.payment_channel || '',
                    }),
                  );
                }
              }}
            >
              {({
                handleSubmit,
                getFieldProps,
                values,
                handleChange,
                setFieldValue,
              }) => (
                <Form onSubmit={handleSubmit}>
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
                                  id="SKU"
                                  type="text"
                                  variant="outlined"
                                  placeholder="Enter SKU"
                                  {...getFieldProps('sku')}
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
                                  id="InternalName"
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
                                Public Name<sup className="text_primary">*</sup>
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
                                  id="PublicName"
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
                              <label>Payment Channel</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <Select
                                  labelId="couponYear-label"
                                  id="nightType"
                                  defaultValue="online"
                                  className="select_wrap"
                                  {...getFieldProps('payment_channel')}
                                >
                                  {paymentChannelList.map(elementChannel => (
                                    <MenuItem
                                      value={elementChannel}
                                      key={elementChannel}
                                    >
                                      {elementChannel}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <span className="my-1 text_small d-block">
                                Or add new status
                              </span>
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  id="PaymentChannel"
                                  type="text"
                                  variant="outlined"
                                  {...getFieldProps('new_payment_channel')}
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
                                GL Code<sup className="text_primary">*</sup>
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
                                  id="glCode"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  {...getFieldProps('gl_code')}
                                  placeholder="Enter gl code"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="gl_code" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Surcharge Amount</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  id="surchargeAmt"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  placeholder="Enter surcharge amount"
                                  inputProps={{ min: 0, step: 'any' }}
                                  onBlurCapture={() => {
                                    setFieldValue(
                                      'surcharge_amount',
                                      values.surcharge_amount &&
                                        Number(values.surcharge_amount).toFixed(
                                          2,
                                        ),
                                    );
                                  }}
                                  {...getFieldProps('surcharge_amount')}
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
                              <label>Surcharge Type</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <Select
                                  labelId="surchargeType"
                                  id="surcharge_type"
                                  name="surcharge_type"
                                  value={values?.surcharge_type}
                                  onChange={handleChange}
                                  className="select_wrap"
                                >
                                  {optionsSurchargeType?.map(elementType => (
                                    <MenuItem
                                      value={elementType?.value}
                                      key={elementType?.value}
                                    >
                                      {elementType?.label}
                                    </MenuItem>
                                  ))}
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
                              <label>Surcharge Tax</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <Select
                                  labelId="surchargeTax"
                                  id="nightType"
                                  defaultValue="6"
                                  className="select_wrap"
                                  {...getFieldProps('surcharge_tax')}
                                >
                                  <MenuItem value="Please Select">
                                    Please Select
                                  </MenuItem>
                                  {surchargeTaxList.map(elementTax => (
                                    <MenuItem
                                      value={elementTax?._id}
                                      key={elementTax?._id}
                                    >
                                      {`${elementTax?.sku}  `}(
                                      {!!elementTax.percentage
                                        ? elementTax?.percentage?.toString()
                                            .length < 2
                                          ? `0${elementTax?.percentage?.toFixed(
                                              2,
                                            )}`
                                          : elementTax?.percentage?.toFixed(2)
                                        : '00.00'}
                                      %)
                                    </MenuItem>
                                  ))}
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
                              <label>Order</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  id="order"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="0"
                                  {...getFieldProps('order')}
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
                              <label>Active</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  {...getFieldProps('is_active')}
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
                          <Col xs={11}>
                            <p className="m-0">
                              You can totally remove this payment option from
                              the system if it is no longer required. Note: the
                              SKU will not become available again as previous
                              bookings may be referenced against it. If you
                              select 'Yes' then you will not be able to undo the
                              delete without knowing the exact sku.
                            </p>
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
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  {...getFieldProps('deleted')}
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
                        {Object.keys(paymentOptionsDetail)?.length === 0
                          ? 'Save'
                          : 'Update'}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
