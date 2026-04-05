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
} from '@mui/material';

import Loader from 'Components/Common/Loader';
import {
  createTaxCodes,
  getTaxCodesData,
  setIsTaxCodesUpdated,
  setTaxCodesDetail,
  updateTaxCodes,
} from 'store/reducers/Admin/Financial/taxCodes.slice';

import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';

export default function AddEditTaxCode() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { taxCodesId } = useParams();

  const { taxCodesLoading, taxCodesDetail, isTaxCodesUpdated } = useSelector(
    ({ taxCodes }) => taxCodes,
  );
  const initialValuesTaxCodes = {
    sku: '',
    public_name: '',
    description: '',
    percentage: 0,
    is_active: false,
    deleted: false,
  };
  const [taxCodesInitialValues, setTaxCodesInitialValues] = useState(
    initialValuesTaxCodes,
  );

  const addEditTaxCodesSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public Name is a required field')
      .matches(/^[^\s]/, 'Public Name cannot include leading spaces'),
  });

  useEffect(() => {
    if (taxCodesId) {
      dispatch(getTaxCodesData(taxCodesId));
    }
  }, [taxCodesId, dispatch]);

  useEffect(() => {
    if (isTaxCodesUpdated) {
      navigate('/tax-codes');
      dispatch(setTaxCodesDetail({}));
      dispatch(setIsTaxCodesUpdated(false));
    }
    return () => dispatch(setTaxCodesDetail({}));
  }, [isTaxCodesUpdated, dispatch, navigate]);

  useEffect(() => {
    if (Object.keys(taxCodesDetail)?.length > 0) {
      setTaxCodesInitialValues({
        sku: taxCodesDetail?.sku,
        public_name: taxCodesDetail?.public_name,
        description: taxCodesDetail?.description,
        percentage: taxCodesDetail?.percentage,
        is_active: taxCodesDetail?.is_active,
        deleted: taxCodesDetail?.deleted,
      });
    }
  }, [taxCodesDetail]);

  return (
    <div className="inner_wrapper">
      {taxCodesLoading && <Loader />}
      <div className="add_taxcode_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Financial</Typography>
            <Link to="/tax-codes">Tax Codes</Link>
            <Typography>
              {!taxCodesLoading && Object.keys(taxCodesDetail)?.length === 0
                ? 'Add New Tax Code'
                : 'Edit Tax Code'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!taxCodesLoading && Object.keys(taxCodesDetail)?.length === 0
              ? 'Add New Tax Code'
              : 'Edit Tax Code'}
          </h1>
        </div>
        <div className="add_taxcode_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={taxCodesInitialValues}
              validationSchema={addEditTaxCodesSchema}
              onSubmit={values => {
                if (Object.keys(taxCodesDetail)?.length > 0) {
                  dispatch(
                    updateTaxCodes({
                      _id: taxCodesDetail?._id,
                      taxCode: values,
                    }),
                  );
                } else {
                  dispatch(createTaxCodes(values));
                }
              }}
            >
              {({ handleSubmit, getFieldProps }) => (
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
                                  placeholder="Enter Name"
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
                        <Row className="align-items-start">
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
                                  id="description"
                                  multiline
                                  rows={3}
                                  type="text"
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
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Percentage</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <div className="d-flex align-items-center">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <TextField
                                    id="percentageDis"
                                    type="number"
                                    onWheel={e => e.target.blur()}
                                    variant="outlined"
                                    className="input_wrap"
                                    placeholder="00.00"
                                    {...getFieldProps('percentage')}
                                  />
                                </FormControl>
                                <span className="mx-1 text_small">%</span>
                              </div>
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
                        {Object.keys(taxCodesDetail)?.length === 0
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
