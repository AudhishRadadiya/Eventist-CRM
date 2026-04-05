import * as Yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
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
  getEventStatusesData,
  setEventStatusesDetail,
  setIsEventStatusesUpdated,
  updateEventStatuses,
  createEventStatuses,
} from 'store/reducers/Admin/Events/eventStatuses.slice';

import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import convert from 'color-convert';
export default function AddEditEventsStatus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { eventStatusesId } = useParams();

  const { eventStatusesLoading, eventStatusesDetail, isEventStatusesUpdated } =
    useSelector(({ eventStatuses }) => eventStatuses);

  const initialValuesEventStatuses = {
    name: '',
    colour: '',
    description: '',
    order: 0,
    show_on_party_numbers_report: false,
    is_active: false,
    deleted: false,
  };

  const [eventStatusesInitialValues, setEventStatusesInitialValues] = useState(
    initialValuesEventStatuses,
  );

  const addEditEventStatusesSchema = Yup.object().shape({
    name: Yup.string()
      .required('name is a required field')
      .matches(/^[^\s]/, 'name cannot include leading spaces'),
    colour: Yup.string().required('colour is a required field'),
  });

  useEffect(() => {
    if (eventStatusesId) {
      dispatch(getEventStatusesData(eventStatusesId));
    }
  }, [eventStatusesId, dispatch]);

  useEffect(() => {
    if (isEventStatusesUpdated) {
      navigate('/events-status');
      dispatch(setEventStatusesDetail({}));
      dispatch(setIsEventStatusesUpdated(false));
    }
    return () => dispatch(setEventStatusesDetail({}));
  }, [isEventStatusesUpdated, navigate, dispatch]);

  useEffect(() => {
    if (Object.keys(eventStatusesDetail)?.length > 0) {
      const colorNameToHex = colorName => {
        if (!convert.keyword.rgb(colorName)) return colorName;
        const rgbColor = convert.keyword.rgb(colorName);
        const hexColor = convert.rgb.hex(rgbColor);
        return `#${hexColor}`;
      };
      setEventStatusesInitialValues({
        name: eventStatusesDetail?.name,
        colour: colorNameToHex(eventStatusesDetail?.colour),
        description: eventStatusesDetail?.description,
        order: eventStatusesDetail?.order || 0,
        show_on_party_numbers_report:
          eventStatusesDetail?.show_on_party_numbers_report,
        is_active: eventStatusesDetail?.is_active,
        deleted: eventStatusesDetail?.deleted,
      });
    }
  }, [eventStatusesDetail]);

  return (
    <div className="inner_wrapper">
      {eventStatusesLoading && <Loader />}
      <div className="add_eventstatus_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Link to="/events-status">Events Statuses</Link>
            <Typography>
              {!eventStatusesLoading &&
              Object.keys(eventStatusesDetail)?.length === 0
                ? 'Add Events Statuses'
                : 'Edit Statuses'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!eventStatusesLoading &&
            Object.keys(eventStatusesDetail)?.length === 0
              ? 'Add New Status'
              : 'Edit Status'}
          </h1>
        </div>
        <h5 className="text_primary">
          {eventStatusesDetail?.name ? eventStatusesDetail?.name : 'New Status'}
          :
        </h5>
        <div className="add_eventstatus_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={eventStatusesInitialValues}
              validationSchema={addEditEventStatusesSchema}
              onSubmit={values => {
                if (Object.keys(eventStatusesDetail)?.length > 0) {
                  dispatch(
                    updateEventStatuses({
                      _id: eventStatusesDetail?._id,
                      eventStatuses: values,
                    }),
                  );
                } else {
                  dispatch(createEventStatuses(values));
                }
              }}
            >
              {({ handleSubmit, values, getFieldProps }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="card_body admin_card_body">
                    <ul>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Name<sup className="text_primary">*</sup>
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
                                  id="name"
                                  type="text"
                                  variant="outlined"
                                  placeholder="Enter Name"
                                  {...getFieldProps('name')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="name" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label className="fw_500">
                                Colour<sup className="text_primary">*</sup>
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
                                  type="color"
                                  id="Colour"
                                  className="input_color"
                                  title="Choose your color"
                                  {...getFieldProps('colour')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="colour" />
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
                                  id="descriptionNote"
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
                              <label className="fw_500">Order</label>
                            </div>
                          </Col>
                          <Col xs={9}>
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
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Show on Party Numbers Reports</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  className="custom_radio"
                                  {...getFieldProps(
                                    'show_on_party_numbers_report',
                                  )}
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
                        {Object.keys(eventStatusesDetail)?.length === 0
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
