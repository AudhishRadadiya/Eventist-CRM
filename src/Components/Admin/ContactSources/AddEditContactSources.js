import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Col, Row } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { useDispatch, useSelector } from 'react-redux';
import {
  createContactSources,
  getContactSourcesData,
  getContactSourcesListDataActive,
  setContactSourcesDetail,
  setIsContactSourcesUpdated,
  updateContactSources,
} from 'store/reducers/Admin/Events/ContactSources/contactSources.slice';
import Loader from 'Components/Common/Loader';
import { ErrorMessage, Form, Formik } from 'formik';
import { limitType } from 'utils/FieldValues';
import * as Yup from 'yup';
import { numberRegex } from 'utils/common';
import { getSourceCategoryListData } from 'store/reducers/Admin/Events/ContactSources/sourceCategory.slice';

export default function AddEditContactSources() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { contactsourceId } = useParams();

  const {
    activeContactSourcesList,
    isContactSourcesUpdated,
    contactSourcesLoading,
    contactSourcesDetail,
  } = useSelector(({ contactSources }) => contactSources);

  const { activeVenueList } = useSelector(({ venue }) => venue);
  const { activeSourceCategoryList } = useSelector(
    ({ sourceCategory }) => sourceCategory,
  );

  const currentYear = new Date().getFullYear();
  const eventYear = contactSourcesDetail?.year || currentYear;
  const pastYear = eventYear - 1;
  const futureYear = currentYear + 1;

  const yearsArrayEditEvent = Array.from(
    { length: futureYear - pastYear + 1 },
    (_, index) => pastYear + index,
  );

  const initialValuesContactSources = {
    category: '',
    name: '',
    year: '',
    show_online: false,
    order: 0,
    extra_info_internal_only: '',
    limit_type: 0,
    venues: [],
    is_active: false,
    deleted: false,
  };

  const [contactSourcesInitialValues, setContactSourcesInitialValues] =
    useState(initialValuesContactSources);

  useEffect(() => {
    dispatch(getSourceCategoryListData());
    // dispatch(getVenueListData());
  }, [dispatch]);

  useEffect(() => {
    if (contactsourceId) {
      dispatch(getContactSourcesData(contactsourceId));
    }
  }, [dispatch, contactsourceId]);

  useEffect(() => {
    if (isContactSourcesUpdated) {
      navigate('/contact-sources');
      dispatch(setContactSourcesDetail({}));
      dispatch(setIsContactSourcesUpdated(false));
    }
    return () => {
      dispatch(setContactSourcesDetail({}));
    };
  }, [isContactSourcesUpdated]);

  useEffect(() => {
    dispatch(
      getContactSourcesListDataActive({
        is_active: true,
        is_total_contacts: true,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(contactSourcesDetail)?.length > 0) {
      setContactSourcesInitialValues({
        category: contactSourcesDetail?.category,
        name: contactSourcesDetail?.name,
        year: contactSourcesDetail?.year
          ? contactSourcesDetail?.year
          : 'anyYear',
        show_online: contactSourcesDetail?.show_online,
        order: contactSourcesDetail?.order ? contactSourcesDetail?.order : 0,
        extra_info_internal_only:
          contactSourcesDetail?.extra_info_internal_only,
        limit_type: contactSourcesDetail?.limit_type,
        venues: contactSourcesDetail?.venues,
        is_active: contactSourcesDetail?.is_active
          ? contactSourcesDetail?.is_active
          : false,
        deleted: contactSourcesDetail?.deleted
          ? contactSourcesDetail?.deleted
          : false,
      });
    }
  }, [contactSourcesDetail]);

  const addEditContactSourceSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^\s]/, 'Name cannot include leading spaces')
      .required('Name is a required field'),
    category: Yup.string().required('Category is a required field'),
  });

  return (
    <div className="inner_wrapper">
      {contactSourcesLoading && <Loader />}
      <div className="addsource_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/contact-sources">Contact Sources</Link>
            <Typography>
              {!contactSourcesLoading &&
              Object.keys(contactSourcesDetail).length === 0
                ? 'Add New Source'
                : 'Edit Source'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row>
            <Col xs={6}>
              <h1>
                {!contactSourcesLoading &&
                Object.keys(contactSourcesDetail).length === 0
                  ? 'Add New Source'
                  : 'Edit Source'}
              </h1>
            </Col>
            <Col xs={6} className="text-end">
              <Link to="/contact-sources" className="btn_border small mx-2">
                Back to Source
              </Link>
              <Link to="/categories-sources" className="btn_border small">
                View Source Categories
              </Link>
            </Col>
          </Row>
        </div>
        <h5 className="text_primary">
          {contactSourcesDetail?.name
            ? contactSourcesDetail?.name
            : 'New Source'}
        </h5>
        <div className="addsource_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={contactSourcesInitialValues}
              validationSchema={addEditContactSourceSchema}
              onSubmit={values => {
                const yearValue = values.year === 'anyYear' ? '' : values?.year;
                if (Object.keys(contactSourcesDetail).length > 0) {
                  dispatch(
                    updateContactSources({
                      _id: contactSourcesDetail._id,
                      contactSources: { ...values, year: yearValue },
                    }),
                  );
                } else {
                  dispatch(
                    createContactSources({ ...values, year: yearValue }),
                  );
                }
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
                    <Row>
                      <Col xl={10}>
                        <ul className="custom_admin_card_inner mb-3">
                          <li>
                            <Row>
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>Source Category:</label>
                                  <sup className="text_primary">*</sup>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <Select
                                      labelId="sourceCategory-label"
                                      id="category"
                                      name="category"
                                      value={values.category}
                                      onChange={handleChange}
                                      className="select_wrap"
                                    >
                                      <MenuItem value="">
                                        Please Select
                                      </MenuItem>
                                      {activeSourceCategoryList?.map(item => {
                                        return (
                                          <MenuItem
                                            key={item}
                                            value={item?._id}
                                          >
                                            {item?.name}
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
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>Source Name:</label>
                                  <sup className="text_primary">*</sup>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <TextField
                                      {...getFieldProps('name')}
                                      variant="outlined"
                                      placeholder="Enter source name"
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
                                  <label>Source Year:</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <Select
                                      labelId="year-label"
                                      id="year"
                                      name="year"
                                      value={values.year}
                                      onChange={handleChange}
                                      defaultValue="anyYear"
                                      className="select_wrap"
                                    >
                                      <MenuItem value="anyYear">
                                        Any Year
                                      </MenuItem>
                                      {yearsArrayEditEvent?.map(item => {
                                        return (
                                          <MenuItem key={item} value={item}>
                                            {item}
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
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>Show Online?</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl>
                                    <RadioGroup
                                      row
                                      aria-labelledby="show-online-label"
                                      value={values.show_online}
                                      name="radio-buttons-group"
                                      className="custom_radio"
                                      onChange={() =>
                                        setFieldValue(
                                          'show_online',
                                          !values.show_online,
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
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>Order:</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <TextField
                                      type="number"
                                      onKeyDown={e => {
                                        numberRegex(e);
                                      }}
                                      inputProps={{ min: 0 }}
                                      onBlurCapture={() => {
                                        setFieldValue(
                                          'order',
                                          Number(values.order).toFixed(2),
                                        );
                                      }}
                                      {...getFieldProps('order')}
                                      variant="outlined"
                                      placeholder="Enter order"
                                    />
                                  </FormControl>
                                </div>
                              </Col>
                            </Row>
                          </li>
                          <li>
                            <Row className="align-items-start">
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>Extra Info (internal only)</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <TextField
                                      {...getFieldProps(
                                        'extra_info_internal_only',
                                      )}
                                      multiline
                                      rows={3}
                                      variant="outlined"
                                      placeholder="Enter Description"
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
                                  <label>Active</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl>
                                    <RadioGroup
                                      row
                                      aria-labelledby="demo-radio-buttons-group-label"
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
                        </ul>
                      </Col>
                    </Row>
                    <h5 className="text_primary ps-2">Limit to Venues</h5>
                    <ul className="limit_venue_wrap">
                      <li>
                        <div className="card_content_left">
                          <label>Limit Type:</label>
                        </div>
                        <div className="card_content_right">
                          <Row>
                            <Col xs={4}>
                              <FormControl fullWidth className="limit_input">
                                <Select
                                  labelId="limitTypeLabel"
                                  id="limit_type"
                                  name="limit_type"
                                  value={values.limit_type}
                                  onChange={handleChange}
                                  className="select_wrap"
                                >
                                  {limitType.map(item => {
                                    return (
                                      <MenuItem value={item.value}>
                                        {item.label}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </Col>
                          </Row>
                        </div>
                      </li>
                      {values?.limit_type !== 0 && (
                        <li className="align-items-start">
                          <div className="card_content_left">
                            <label>Venues</label>
                          </div>
                          <div className="card_content_right">
                            <Row className="align-items-center">
                              {activeVenueList?.map(item => {
                                return (
                                  <Col className="col-4" key={item?._id}>
                                    <div className="form-group checkbox_wrap mb-2">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="venues"
                                          value={item?._id}
                                          label={item?.sku}
                                          checked={values?.venues?.includes(
                                            item?._id,
                                          )}
                                          onChange={handleChange}
                                        />
                                      </FormGroup>
                                    </div>
                                  </Col>
                                );
                              })}
                            </Row>
                          </div>
                        </li>
                      )}
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
    </div>
  );
}
