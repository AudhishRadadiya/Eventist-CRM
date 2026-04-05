import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import { ErrorMessage, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Breadcrumbs,
  FormGroup,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import Loader from 'Components/Common/Loader';
import {
  createSalesRules,
  getSalesRulesData,
  setIsSalesRulesUpdated,
  setSalesRulesDetail,
  updateSalesRules,
} from 'store/reducers/Admin/Events/salesRules.slice';

import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';

export const optionsRule = [
  {
    id: 0,
    value: 'Minimum',
  },
  {
    id: 1,
    value: 'Maximum',
  },
  {
    id: 2,
    value: 'Multiples',
  },
  {
    id: 3,
    value: 'Equals Exactly',
  },
  {
    id: 4,
    value: 'Linked Product',
  },
  {
    id: 5,
    value: 'Vat Adjustment',
  },
];

export default function AddEditSalesRules() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { salesRulesId } = useParams();
  const { isSalesRulesUpdated, salesRulesDetail, salesRulesLoading } =
    useSelector(({ salesRules }) => salesRules);

  const initialValuesSalesRules = {
    sku: '',
    public_name: '',
    description: '',
    rule: 0,
    of_value: 0,
    of_value_sum: '',
    round: 0,
    is_active: false,
    deleted: false,
  };

  const [salesRulesInitialValues, setSalesRulesInitialValues] = useState(
    initialValuesSalesRules,
  );

  const addEditSalesRulesSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public Name is required field')
      .matches(/^[^\s]/, 'Public Name cannot include leading spaces'),
  });

  const optionsOfValue = [
    {
      id: 1, //it's change ref by vivek
      value: 'Placed Booked',
    },
  ];

  const optionsRound = [
    {
      id: 0,
      value: 'Always Round Up (1.1=>2)',
    },
    {
      id: 1,
      value: 'Always Round Down (1.9=>1)',
    },
    {
      id: 2,
      value: 'Round to Closest (1.4 =>1 & 1.5=>2)',
    },
  ];

  useEffect(() => {
    if (salesRulesId) {
      dispatch(getSalesRulesData(salesRulesId));
    }
  }, [dispatch, salesRulesId]);

  useEffect(() => {
    if (isSalesRulesUpdated) {
      navigate('/sales-rules');
      dispatch(setSalesRulesDetail({}));
      dispatch(setIsSalesRulesUpdated(false));
    }
    return () => dispatch(setSalesRulesDetail({}));
  }, [isSalesRulesUpdated, dispatch, navigate]);

  useEffect(() => {
    if (Object.keys(salesRulesDetail)?.length > 0) {
      setSalesRulesInitialValues({
        sku: salesRulesDetail?.sku,
        public_name: salesRulesDetail?.public_name,
        description: salesRulesDetail?.description,
        rule: salesRulesDetail?.rule,
        of_value: salesRulesDetail?.of_value,
        of_value_sum: salesRulesDetail?.of_value_sum || '',
        round: salesRulesDetail?.round,
        is_active: salesRulesDetail?.is_active,
        deleted: salesRulesDetail?.deleted,
      });
    }
  }, [salesRulesDetail]);

  return (
    <div className="inner_wrapper">
      {salesRulesLoading && <Loader />}
      <div className="add_salesrules_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Link to="/sales-rules">Sales Rules</Link>
            <Typography>
              {!salesRulesLoading && Object.keys(salesRulesDetail)?.length === 0
                ? 'Add New Sales Rules'
                : 'Edit Sales Rules'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!salesRulesLoading && Object.keys(salesRulesDetail)?.length === 0
              ? 'Add New Sales Rule'
              : 'Edit Sales Rule'}
          </h1>
        </div>
        <div className="add_salesrules_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={salesRulesInitialValues}
              validationSchema={addEditSalesRulesSchema}
              onSubmit={values => {
                if (Object.keys(salesRulesDetail)?.length > 0) {
                  dispatch(
                    updateSalesRules({
                      _id: salesRulesDetail?._id,
                      salesrules: values,
                    }),
                  );
                } else {
                  dispatch(createSalesRules(values));
                }
              }}
            >
              {({ errors, touched, handleSubmit, values, getFieldProps }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="card_body admin_card_body">
                    <ul>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                SKU<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  placeholder="Enter SKU"
                                  {...getFieldProps('sku')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              {touched.sku && errors.sku && (
                                <ErrorMessage name="sku" />
                              )}
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Public Name<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  placeholder="Enter Public Name"
                                  {...getFieldProps('public_name')}
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
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Description</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  placeholder="Enter Description"
                                  {...getFieldProps('description')}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Rule Settings</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <p className="m-0">
                                Rule setting values should include math
                                operators if using Placed Booked (e.g. Minimum
                                Places Booked *1 - would mean a minimum of one
                                per number of places booked). Math operators
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Rule</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <div className="d-flex align-items-center">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <Select
                                    className="select_wrap"
                                    {...getFieldProps('rule')}
                                  >
                                    {optionsRule?.map(elementRule => {
                                      return (
                                        <MenuItem
                                          value={elementRule?.id}
                                          key={elementRule?.id}
                                        >
                                          {elementRule?.value}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                                <span className="mx-1 text_small">of</span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      {values?.rule === 4 || values?.rule === 5 ? null : (
                        <li>
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label> of Value</label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormGroup className="percentage_input">
                                  <FormControl
                                    fullWidth
                                    className="main_input_wrap"
                                  >
                                    <Select
                                      className="select_wrap"
                                      {...getFieldProps('of_value')}
                                    >
                                      {optionsOfValue?.map(elementOfValue => {
                                        return (
                                          <MenuItem
                                            value={elementOfValue?.id}
                                            key={elementOfValue?.id}
                                          >
                                            {elementOfValue?.value}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                  <FormControl
                                    fullWidth
                                    className="mx-1 main_input_wrap"
                                  >
                                    <TextField
                                      type="text"
                                      variant="outlined"
                                      className="input_wrap"
                                      {...getFieldProps('of_value_sum')}
                                    />
                                  </FormControl>
                                </FormGroup>
                              </div>
                            </Col>
                          </Row>
                        </li>
                      )}
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Round</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <div className="d-flex align-items-center">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <Select
                                    className="select_wrap"
                                    {...getFieldProps('round')}
                                  >
                                    {optionsRound?.map(elementRound => {
                                      return (
                                        <MenuItem
                                          value={elementRound?.id}
                                          key={elementRound?.id}
                                        >
                                          {elementRound?.value}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                                <span className="ms-1 text_small">
                                  if above sum is not a whole number
                                </span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Active</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
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
                              You can totally remove this coupon from the system
                              if it is no longer required. Note: the SKU will
                              not become available again as previous bookings
                              may be referenced against it. If you select 'Yes'
                              then you will not be able to undo the delete
                              without knowing the exact sku.
                            </p>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Deleted</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
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
                        {Object.keys(salesRulesDetail)?.length === 0
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
