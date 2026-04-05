import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import { ErrorMessage, Formik } from 'formik';
import Loader from 'Components/Common/Loader';
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
  createAvailabilityStatus,
  getAvailabilityStatusData,
  setAvailabilityStatusDetail,
  setIsAvailabilityStatusUpdated,
  updateAvailabilityStatus,
} from 'store/reducers/Admin/Events/availabilityStatus.slice';
import convert from 'color-convert';

import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';

export const optionNightType = [
  {
    id: 0,
    label: 'Mixed Group Nights Only',
    value: 'mixed_group_nights_only',
  },
  { id: 1, label: 'Exclusive Nights Only', value: 'exclusive_nights_only' },
  {
    id: 2,
    label: 'All Nights',
    value: 'all_nights',
  },
];

export default function AddEditAvailabilityStatus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { availabilityStatusId } = useParams();

  const {
    isAvailabilityStatusUpdated,
    availabilityStatusLoading,
    availabilityStatusDetail,
  } = useSelector(({ availabilityStatus }) => availabilityStatus);

  const initialvaluesAvailabilityStatus = {
    name: '',
    min_percentage_available: 0,
    max_percentage_available: 0,
    colour: '',
    text_colour: '',
    night_type: 0,
    description: '',
    order: 0,
    is_active: false,
    deleted: false,
    show_on_party_numbers_report: true,
  };
  const [availabilityStatusInitialValues, setAvailabilityStatusInitialValues] =
    useState(initialvaluesAvailabilityStatus);

  const addEditAvailabilityStatusSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is a required field')
      .matches(/^[^\s]/, 'Name cannot include leading spaces'),
    colour: Yup.string().required('Colour is a required field'),
  });

  useEffect(() => {
    if (availabilityStatusId) {
      dispatch(getAvailabilityStatusData(availabilityStatusId));
    }
  }, [availabilityStatusId]);

  useEffect(() => {
    if (isAvailabilityStatusUpdated) {
      navigate('/availability-status');
      dispatch(setAvailabilityStatusDetail({}));
      dispatch(setIsAvailabilityStatusUpdated(false));
    }
    return () => dispatch(setAvailabilityStatusDetail({}));
  }, [isAvailabilityStatusUpdated]);

  useEffect(() => {
    if (Object.keys(availabilityStatusDetail)?.length > 0) {
      const colorNameToHex = colorName => {
        if (!convert.keyword.rgb(colorName)) return colorName;
        const rgbColor = convert.keyword.rgb(colorName);
        const hexColor = convert.rgb.hex(rgbColor);
        return `#${hexColor}`;
      };
      setAvailabilityStatusInitialValues({
        name: availabilityStatusDetail?.name,
        min_percentage_available:
          availabilityStatusDetail?.min_percentage_available || 0,
        max_percentage_available:
          availabilityStatusDetail?.max_percentage_available || 0,
        colour: colorNameToHex(availabilityStatusDetail?.colour),
        text_colour: colorNameToHex(availabilityStatusDetail?.text_colour),
        night_type: availabilityStatusDetail?.night_type,
        description: availabilityStatusDetail?.description,
        order: availabilityStatusDetail?.order || 0,
        is_active: availabilityStatusDetail?.is_active,
        deleted: availabilityStatusDetail?.deleted,
        show_on_party_numbers_report:
          availabilityStatusDetail?.show_on_party_numbers_report,
      });
    }
  }, [availabilityStatusDetail]);

  return (
    <div className="inner_wrapper">
      {availabilityStatusLoading && <Loader />}
      <div className="add_availabilitystatus_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Link to="/availability-status">Availability Status</Link>
            <Typography>
              {!availabilityStatusLoading &&
              Object.keys(availabilityStatusDetail)?.length === 0
                ? 'Add New Availability Status'
                : 'Edit Availability Status'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!availabilityStatusLoading &&
            Object.keys(availabilityStatusDetail)?.length === 0
              ? 'Add New Availability Status'
              : 'Edit Availability Status'}
          </h1>
        </div>
        <h5 className="text_primary">
          {availabilityStatusDetail?.name
            ? availabilityStatusDetail?.name
            : 'New Status'}
          :
        </h5>
        <div className="add_availabilitystatus_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={availabilityStatusInitialValues}
              validationSchema={addEditAvailabilityStatusSchema}
              onSubmit={values => {
                if (Object.keys(availabilityStatusDetail)?.length > 0) {
                  dispatch(
                    updateAvailabilityStatus({
                      _id: availabilityStatusDetail?._id,
                      availabilityStatus: values,
                    }),
                  );
                } else {
                  dispatch(createAvailabilityStatus(values));
                }
              }}
            >
              {({ handleSubmit, getFieldProps }) => (
                <form onSubmit={handleSubmit}>
                  <div className="card_body admin_card_body">
                    <ul>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Name<sup className="text_primary">*</sup>
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
                                  id="name"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter Name"
                                  {...getFieldProps('name')}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="name" />
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
                                Min Percentage Available
                                <span className="d-block fw_400">
                                  Please enter the minimum percentage remaining
                                  rather than the percentage booked. Nights will
                                  need to be a minimum of this number and is
                                  inclusive of this number.
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
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="0.0000"
                                  {...getFieldProps('min_percentage_available')}
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
                                Max Percentage Available
                                <span className="d-block fw_400">
                                  Please enter the maximum percentage remaining
                                  rather than the percentage booked. Nights will
                                  need to be below this number and is not
                                  inclusive of this number.
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
                                  id="maxPercentage"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="0.0000"
                                  {...getFieldProps('max_percentage_available')}
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
                                Colour<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <div className="input_color_wrap">
                                <Form.Control
                                  type="color"
                                  id="exampleColorInput"
                                  title="Choose your color"
                                  className="input_color"
                                  {...getFieldProps('colour')}
                                />
                              </div>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="colour" />
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Text Colour</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <div className="input_color_wrap">
                                <Form.Control
                                  type="color"
                                  id="textColor"
                                  title="Choose your color"
                                  className="input_color"
                                  {...getFieldProps('text_colour')}
                                />
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
                                Night Type
                                <span className="d-block fw_400">
                                  Please select whether this status should be
                                  for mixed group nights, exclusive nights or
                                  both.
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
                                <Select
                                  labelId="couponYear-label"
                                  id="nightType"
                                  className="select_wrap"
                                  {...getFieldProps('night_type')}
                                >
                                  {optionNightType.map(elementNigthType => (
                                    <MenuItem
                                      value={elementNigthType?.id}
                                      key={elementNigthType?.id}
                                    >
                                      {elementNigthType?.label}
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
                                  placeholder="100"
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
                              You can totally remove this status from the system
                              if it is no longer text_primary. If you select
                              'Yes' then you will not be able to undo the delete
                              without knowing the exact sku.
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
                      <button type="submit" className="btn_primary small ">
                        {Object.keys(availabilityStatusDetail)?.length === 0
                          ? 'Save'
                          : 'Update'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
