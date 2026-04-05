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
  createBillableItem,
  getBillableItemsData,
  getTaxRateListData,
  setBillableItemsDetail,
  setIsBillableItemsUpdated,
  updateBillableItems,
} from 'store/reducers/Admin/Financial/billableItems.slice';
import Loader from 'Components/Common/Loader';

import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';

export default function AddEditBillableItem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { billableItemsId } = useParams();
  const {
    billableItemsLoading,
    billableItemsDetail,
    isBillableItemsUpdated,
    taxRateList,
  } = useSelector(({ billableItems }) => billableItems);
  const initialValuesBillableItems = {
    sku: '',
    internal_name: '',
    public_name: '',
    tax_rate: '',
    order: 0,
    is_active: false,
    deleted: false,
  };
  const [billableItemsInitialValues, setBillableItemsInitialValues] = useState(
    initialValuesBillableItems,
  );

  const addEditBillableItemsSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    internal_name: Yup.string()
      .required('Internal Name is a required field')
      .matches(/^[^\s]/, 'Internal Name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public Name is a required field')
      .matches(/^[^\s]/, 'Public Name cannot include leading spaces'),
  });

  useEffect(() => {
    dispatch(getTaxRateListData());
  }, [dispatch]);
  useEffect(() => {
    if (billableItemsId) {
      dispatch(getBillableItemsData(billableItemsId));
    }
  }, [billableItemsId, dispatch]);

  useEffect(() => {
    if (isBillableItemsUpdated) {
      navigate('/billable-items');
      dispatch(setBillableItemsDetail({}));
      dispatch(setIsBillableItemsUpdated(false));
    }
    return () => dispatch(setBillableItemsDetail({}));
  }, [isBillableItemsUpdated, navigate, dispatch]);

  useEffect(() => {
    if (Object.keys(billableItemsDetail)?.length > 0) {
      setBillableItemsInitialValues({
        sku: billableItemsDetail?.sku || '',
        internal_name: billableItemsDetail?.internal_name || '',
        public_name: billableItemsDetail?.public_name || '',
        tax_rate: billableItemsDetail?.tax_rate || null,
        order: billableItemsDetail?.order || 0,
        is_active: billableItemsDetail?.is_active || true,
        deleted: billableItemsDetail?.deleted || false,
      });
    }
  }, [billableItemsDetail]);

  return (
    <div className="inner_wrapper">
      {billableItemsLoading && <Loader />}
      <div className="add_billable_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Financial</Typography>
            <Link to="/billable-items"> Billable Items</Link>
            <Typography>
              {!billableItemsLoading &&
              Object.keys(billableItemsDetail)?.length === 0
                ? 'Add New Billable Item'
                : 'Edit Billable Item'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!billableItemsLoading &&
            Object.keys(billableItemsDetail)?.length === 0
              ? 'Add New Billable Item'
              : 'Edit Billable Item'}
          </h1>
        </div>
        <h5 className="text_primary">{billableItemsDetail?.internal_name}</h5>
        <div className="add_billable_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={billableItemsInitialValues}
              validationSchema={addEditBillableItemsSchema}
              onSubmit={values => {
                if (Object.keys(billableItemsDetail)?.length > 0) {
                  dispatch(
                    updateBillableItems({
                      _id: billableItemsDetail?._id,
                      billableItems: values,
                    }),
                  );
                } else {
                  dispatch(createBillableItem(values));
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
                                  placeholder="Enter Internal Name"
                                  {...getFieldProps('internal_name')}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="internal_name" />
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
                                  placeholder="Enter Public Name"
                                  {...getFieldProps('public_name')}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="public_name" />
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
                                Tax Rate
                                <span className="d-block fw_400">
                                  Note: any product-based tax rates will be set
                                  by the products directly so do not need
                                  setting here. Tickets tax rates are set
                                  against the event/dates.
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <div className="d-flex align-items-center">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <Select
                                    labelId="taxRate-label"
                                    id="taxRate"
                                    className="select_wrap"
                                    {...getFieldProps('tax_rate')}
                                  >
                                    {taxRateList.map(elementTaxRate => (
                                      <MenuItem
                                        value={elementTaxRate?._id}
                                        key={elementTaxRate?._id}
                                      >
                                        {elementTaxRate?.sku}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                <span className="mx-1 text_small">
                                  Tax Rate
                                </span>
                              </div>
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
                                  id="Order"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
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
                          <Col xs={12}>
                            <p className="m-0">
                              You can totally remove this billable item from the
                              system if it is no longer required. Note: the SKU
                              will not become available again as previous
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
                        {Object.keys(billableItemsDetail)?.length === 0
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
