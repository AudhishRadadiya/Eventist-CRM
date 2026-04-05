import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { ErrorMessage, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
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

import Loader from 'Components/Common/Loader';
import {
  getSystemData,
  updateSystem,
} from 'store/reducers/Admin/System/system.slice';

import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';

export default function EditSystem() {
  const dispatch = useDispatch();
  const { systemLoading, systemDetail } = useSelector(({ system }) => system);

  const initialValuesSystem = {
    company_name: '',
    internal_name: '',
    from_email: '',
    to_email: '',
    system_refresh_interval: 0,
    login_default_timeout: 0,
    attaclogin_keepalive_timeouthments: 0,
    admin_email: '',
    places_hold_period_jan_1_apr_30: 0,
    places_hold_period_may_1_aug_31: 0,
    places_hold_period_sep_1_sep_30: 0,
    places_hold_period_oct_1_oct_31: 0,
    places_hold_period_nov_1_dec_31: 0,
    places_hold_period_over_50_full: 0,
    places_hold_period_over_70_full: 0,
    places_hold_period_over_85_full: 0,
    places_hold_period_over_95_full: 0,
    min_places_crmbo: 0,
    limit_warning_crmbo: 0,
    sold_out_at_crmbo: 0,
    limit_status_text_crmbo: 0,
    sold_out_text_crmbo: '',
    min_places_bpe: 0,
    limit_warning_bpe: 0,
    sold_out_at_bpe: 0,
    limit_status_text_bpe: 0,
    sold_out_text_bpe: '',
    places_hold_period_jan_1_apr_30_bpe: 0,
    places_hold_period_may_1_aug_31_bpe: 0,
    places_hold_period_sep_1_sep_30_bpe: 0,
    places_hold_period_oct_1_oct_31_bpe: 0,
    places_hold_period_nov_1_dec_31_bpe: 0,
    places_hold_period_over_50_full_bpe: 0,
    places_hold_period_over_70_full_bpe: 0,
    places_hold_period_over_85_full_bpe: 0,
    places_hold_period_over_95_full_bpe: 0,
    paid_in_full_amount_bpe: 0,
    stop_bookings_bpe: 0,
    invoice_template_alert_info: '',
    invoice_template_extra_info: '',
    automatic_etickets: false,
    automatic_exchequer: false,
    automatic_invoice: false,
    automatic_afterparty: false,
    automatic_provisional_hold: false,
    automatic_drinks_reminders: false,
    automatic_reports: false,
    automatic_tims_number_comparisons: false,
    automatic_johns_numbers: false,
    automatic_coupons: false,
    send_exchequer_reports_to: [],
    comparison_reports_compare_year: 2,
    send_comparison_reports_to: [],
    send_party_numbers_reports_to: [],
    send_auto_coupon_notifications_to: [],
  };
  const [systemInitialValues, setSystemInitialValues] =
    useState(initialValuesSystem);

  const addEditSystemSchema = Yup.object().shape({
    company_name: Yup.string()
      .required('Company Name is a required field')
      .matches(/^[^\s]/, 'Company Name cannot include leading spaces'),
    from_email: Yup.string()
      .required('From Email Address is a required field')
      .matches(/^[^\s]/, 'From Email Address cannot include leading spaces'),
    to_email: Yup.string()
      .required('To Email Address is a required field')
      .matches(/^[^\s]/, 'To Email Address cannot include leading spaces'),
  });

  const optionsComparisonReportsCompareYear = [
    {
      id: 0,
      label: ' Previous year (default)',
      value: 'anyYear',
    },
    {
      id: 1,
      label: '2 years ago',
      value: '2022',
    },
    {
      id: 2,
      label: '3 years ago',
      value: '2023',
    },
    { id: 3, label: '4 years ago', value: '2024' },
    { id: 4, label: '5 years ago', value: '2025' },
  ];

  useEffect(() => {
    dispatch(getSystemData());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(systemDetail).length > 0) {
      setSystemInitialValues({
        company_name: systemDetail?.company_name,
        internal_name: systemDetail?.internal_name,
        from_email: systemDetail?.from_email,
        to_email: systemDetail?.to_email,
        system_refresh_interval: systemDetail?.system_refresh_interval,
        login_default_timeout: systemDetail?.login_default_timeout,
        attaclogin_keepalive_timeouthments:
          systemDetail?.attaclogin_keepalive_timeouthments,
        admin_email: systemDetail?.admin_email,
        places_hold_period_jan_1_apr_30:
          systemDetail?.places_hold_period_jan_1_apr_30,
        places_hold_period_may_1_aug_31:
          systemDetail?.places_hold_period_may_1_aug_31,
        places_hold_period_sep_1_sep_30:
          systemDetail?.places_hold_period_sep_1_sep_30,
        places_hold_period_oct_1_oct_31:
          systemDetail?.places_hold_period_oct_1_oct_31,
        places_hold_period_nov_1_dec_31:
          systemDetail?.places_hold_period_nov_1_dec_31,
        places_hold_period_over_50_full:
          systemDetail?.places_hold_period_over_50_full,
        places_hold_period_over_70_full:
          systemDetail?.places_hold_period_over_70_full,
        places_hold_period_over_85_full:
          systemDetail?.places_hold_period_over_85_full,
        places_hold_period_over_95_full:
          systemDetail?.places_hold_period_over_95_full,
        min_places_crmbo: systemDetail?.min_places_crmbo,
        limit_warning_crmbo: systemDetail?.limit_warning_crmbo,
        sold_out_at_crmbo: systemDetail?.sold_out_at_crmbo,
        limit_status_text_crmbo: systemDetail?.limit_status_text_crmbo,
        sold_out_text_crmbo: systemDetail?.sold_out_text_crmbo,
        min_places_bpe: systemDetail?.min_places_bpe,
        limit_warning_bpe: systemDetail?.limit_warning_bpe,
        sold_out_at_bpe: systemDetail?.sold_out_at_bpe,
        limit_status_text_bpe: systemDetail?.limit_status_text_bpe,
        sold_out_text_bpe: systemDetail?.sold_out_text_bpe,
        places_hold_period_jan_1_apr_30_bpe:
          systemDetail?.places_hold_period_jan_1_apr_30_bpe,
        places_hold_period_may_1_aug_31_bpe:
          systemDetail?.places_hold_period_may_1_aug_31_bpe,
        places_hold_period_sep_1_sep_30_bpe:
          systemDetail?.places_hold_period_sep_1_sep_30_bpe,
        places_hold_period_oct_1_oct_31_bpe:
          systemDetail?.places_hold_period_oct_1_oct_31_bpe,
        places_hold_period_nov_1_dec_31_bpe:
          systemDetail?.places_hold_period_nov_1_dec_31_bpe,
        places_hold_period_over_50_full_bpe:
          systemDetail?.places_hold_period_over_50_full_bpe,
        places_hold_period_over_70_full_bpe:
          systemDetail?.places_hold_period_over_70_full_bpe,
        places_hold_period_over_85_full_bpe:
          systemDetail?.places_hold_period_over_85_full_bpe,
        places_hold_period_over_95_full_bpe:
          systemDetail?.places_hold_period_over_95_full_bpe,
        paid_in_full_amount_bpe: systemDetail?.paid_in_full_amount_bpe,
        stop_bookings_bpe: systemDetail?.stop_bookings_bpe,
        invoice_template_alert_info: systemDetail?.invoice_template_alert_info,
        invoice_template_extra_info: systemDetail?.invoice_template_extra_info,
        automatic_etickets: systemDetail?.automatic_etickets,
        automatic_exchequer: systemDetail?.automatic_exchequer,
        automatic_invoice: systemDetail?.automatic_invoice,
        automatic_afterparty: systemDetail?.automatic_afterparty,
        automatic_provisional_hold: systemDetail?.automatic_provisional_hold,
        automatic_drinks_reminders: systemDetail?.automatic_drinks_reminders,
        automatic_reports: systemDetail?.automatic_reports,
        automatic_tims_number_comparisons:
          systemDetail?.automatic_tims_number_comparisons,
        automatic_johns_numbers: systemDetail?.automatic_johns_numbers,
        automatic_coupons: systemDetail?.automatic_coupons,
        send_exchequer_reports_to:
          systemDetail.send_exchequer_reports_to?.join('\n') + '\n',
        comparison_reports_compare_year:
          systemDetail?.comparison_reports_compare_year,
        send_comparison_reports_to:
          systemDetail.send_comparison_reports_to?.join('\n') + '\n',
        send_party_numbers_reports_to:
          systemDetail?.send_party_numbers_reports_to?.join('\n') + '\n',
        send_auto_coupon_notifications_to:
          systemDetail?.send_auto_coupon_notifications_to?.join('\n') + '\n',
      });
    }
  }, [systemDetail]);

  return (
    <div className="inner_wrapper">
      {systemLoading && <Loader />}
      <div className="editsystem_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>System</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Edit System Configuration</h1>
        </div>
        <h5 className="text_primary">Editable Settings:</h5>
        <div className="editsystem_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={systemInitialValues}
              validationSchema={addEditSystemSchema}
              onSubmit={values => {
                dispatch(
                  updateSystem({
                    system: {
                      ...values,
                      send_exchequer_reports_to:
                        values?.send_exchequer_reports_to
                          ?.split(/[ ,\n]+/)
                          ?.filter(item => {
                            if (item) {
                              return item;
                            }
                          }),
                      send_comparison_reports_to:
                        values.send_comparison_reports_to
                          ?.split(/[ ,\n]+/)
                          ?.filter(item => {
                            if (item) {
                              return item;
                            }
                          }),
                      send_party_numbers_reports_to:
                        values.send_party_numbers_reports_to
                          ?.split(/[ ,\n]+/)
                          ?.filter(item => {
                            if (item) {
                              return item;
                            }
                          }),
                      send_auto_coupon_notifications_to:
                        values.send_auto_coupon_notifications_to
                          ?.split(/[ ,\n]+/)
                          ?.filter(item => {
                            if (item) {
                              return item;
                            }
                          }),
                    },
                  }),
                );
              }}
            >
              {({ handleSubmit, getFieldProps }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="card_body admin_card_body">
                    <ul className="mb-3">
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Company Name
                                <sup className="text_primary">*</sup>
                                <span className="fw_400 d-block">
                                  (This will be the default name seen by
                                  customers for any correspondance)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="companyName"
                                  type="text"
                                  variant="outlined"
                                  placeholder="Best Parties Ever"
                                  {...getFieldProps('company_name')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="company_name" />
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
                                <span className="fw_400 d-block">
                                  (This will be the name used on internal
                                  references)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="internalName"
                                  type="text"
                                  variant="outlined"
                                  placeholder="BPE"
                                  {...getFieldProps('internal_name')}
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
                                From Email Address
                                <sup className="text_primary">*</sup>
                                <span className="fw_400 d-block">
                                  (This will be the default email used when
                                  sending emails)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="fromEmail"
                                  type="email"
                                  variant="outlined"
                                  placeholder="bookings@bestpartiesever.com"
                                  {...getFieldProps('from_email')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="from_email" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                To Email Address
                                <sup className="text_primary">*</sup>
                                <span className="fw_400 d-block">
                                  (This will be the address internal emails are
                                  sent to)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="toEmail"
                                  type="email"
                                  variant="outlined"
                                  placeholder="Enter to email"
                                  {...getFieldProps('to_email')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="to_email" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                System Refresh Interval
                                <span className="fw_400 d-block">
                                  (In Milliseconds - The system will poll the
                                  database for updates/alerts/login status)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="interval"
                                  type="text"
                                  variant="outlined"
                                  placeholder="30000"
                                  {...getFieldProps('system_refresh_interval')}
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
                                Login Default Timeout
                                <span className="fw_400 d-block">
                                  (In Minutes - The system will log out users
                                  after this period of inactivity)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="defaultTimeout"
                                  type="text"
                                  variant="outlined"
                                  placeholder="60"
                                  {...getFieldProps('login_default_timeout')}
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
                                Login KeepAlive Timeout
                                <span className="fw_400 d-block">
                                  (In Minutes - The system will log out users
                                  after this period of inactivity if the Keep
                                  Alive checkbox is ticked when loggin in)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="aliveTimeout"
                                  type="text"
                                  variant="outlined"
                                  placeholder="720"
                                  {...getFieldProps(
                                    'attaclogin_keepalive_timeouthments',
                                  )}
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
                                Admin Email
                                <span className="fw_400 d-block">
                                  (Address to be used to report errors etc)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="adminEmail"
                                  type="email"
                                  variant="outlined"
                                  placeholder="bpe@mjdigital.co.uk"
                                  {...getFieldProps('admin_email')}
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
                                Places Hold Period Jan 1st - Apr 30th
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="56"
                                  {...getFieldProps(
                                    'places_hold_period_jan_1_apr_30',
                                  )}
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
                                Places Hold Period May 1st - Aug 31st
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="10"
                                  {...getFieldProps(
                                    'places_hold_period_may_1_aug_31',
                                  )}
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
                                Places Hold Period Sept 1st - Sept 30th{' '}
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="7"
                                  {...getFieldProps(
                                    'places_hold_period_sep_1_sep_30',
                                  )}
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
                                Places Hold Period Oct 1st - Oct 31st{' '}
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="7"
                                  {...getFieldProps(
                                    'places_hold_period_oct_1_oct_31',
                                  )}
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
                                Places Hold Period Nov 1st - Dec 31st{' '}
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="0"
                                  {...getFieldProps(
                                    'places_hold_period_nov_1_dec_31',
                                  )}
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
                                Places Hold Period over 50% full
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold, overriding the date settings
                                  above.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="7"
                                  {...getFieldProps(
                                    'places_hold_period_over_50_full',
                                  )}
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
                                Places Hold Period over 70% full
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold, overriding the date settings
                                  above.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="4"
                                  {...getFieldProps(
                                    'places_hold_period_over_70_full',
                                  )}
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
                                Places Hold Period over 85% full{' '}
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold, overriding the date settings
                                  above.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="2"
                                  {...getFieldProps(
                                    'places_hold_period_over_85_full',
                                  )}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Places Hold Period over 95% full{' '}
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold, overriding the date settings
                                  above.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  id="invoiceAlert"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  placeholder="1"
                                  {...getFieldProps(
                                    'places_hold_period_over_95_full',
                                  )}
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
                                Minimum Places crmbo
                                <span className="fw_400 d-block">
                                  (The minimum number of places for the booking
                                  in crmbo.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="0"
                                  {...getFieldProps('min_places_crmbo')}
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
                                Limit Warning crmbo
                                <span className="fw_400 d-block">
                                  (The number of places left on bookings when
                                  the user is shown a limited places warning in
                                  crmbo.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="100"
                                  {...getFieldProps('limit_warning_crmbo')}
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
                                Sold Out At crmbo
                                <span className="fw_400 d-block">
                                  (The number of places left on bookings when
                                  the user is shown a sold out message in
                                  crmbo.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="0"
                                  {...getFieldProps('sold_out_at_crmbo')}
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
                                Limit Status Text crmbo{' '}
                                <span className="fw_400 d-block">
                                  (The wording for limited places in crmbo.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="Limited Availability"
                                  {...getFieldProps('limit_status_text_crmbo')}
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
                                Sold Out Text crmbo{' '}
                                <span className="fw_400 d-block">
                                  (The wording for sold out in crmbo.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="SOLD OUT"
                                  {...getFieldProps('sold_out_text_crmbo')}
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
                                Minimum Places BPE.com{' '}
                                <span className="fw_400 d-block">
                                  (The minimum number of places for the booking
                                  in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="8"
                                  {...getFieldProps('min_places_bpe')}
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
                                Limit Warning BPE.com
                                <span className="fw_400 d-block">
                                  (The number of places left on bookings when
                                  the user is shown a limited places warning in
                                  bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="150"
                                  {...getFieldProps('limit_warning_bpe')}
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
                                Sold Out At BPE.com
                                <span className="fw_400 d-block">
                                  (The number of places left on bookings when
                                  the user is shown a sold out message in
                                  bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="30"
                                  {...getFieldProps('sold_out_at_bpe')}
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
                                Limit Status Text BPE.com{' '}
                                <span className="fw_400 d-block">
                                  (The wording for limited places in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="<strong title='Limited places left - book now to avoid disappointment'>** Limited Places **</strong>"
                                  {...getFieldProps('limit_status_text_bpe')}
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
                                Sold Out Text BPE.com
                                <span className="fw_400 d-block">
                                  (The wording for sold out in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="<strong>SOLD OUT</strong>"
                                  {...getFieldProps('sold_out_text_bpe')}
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
                                Places Hold Period Jan 1st - Apr 30th BPE.com{' '}
                                <span className="fw_400 d-block">
                                  (The length of the hold period in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="8 weeks"
                                  {...getFieldProps(
                                    'places_hold_period_jan_1_apr_30_bpe',
                                  )}
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
                                Places Hold Period May 1st - Aug 31st BPE.com
                                <span className="fw_400 d-block">
                                  (The length of the hold period in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="10 days"
                                  {...getFieldProps(
                                    'places_hold_period_may_1_aug_31_bpe',
                                  )}
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
                                Places Hold Period Sept 1st - Sept 30th BPE.com{' '}
                                <span className="fw_400 d-block">
                                  (The length of the hold period in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="7 days"
                                  {...getFieldProps(
                                    'places_hold_period_sep_1_sep_30_bpe',
                                  )}
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
                                Places Hold Period Oct 1st - Oct 31st BPE.com{' '}
                                <span className="fw_400 d-block">
                                  (The length of the hold period in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="7 days"
                                  {...getFieldProps(
                                    'places_hold_period_oct_1_oct_31_bpe',
                                  )}
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
                                Places Hold Period Nov 1st - Dec 31st BPE.com
                                <span className="fw_400 d-block">
                                  (The length of the hold period in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="48 hours"
                                  {...getFieldProps(
                                    'places_hold_period_nov_1_dec_31_bpe',
                                  )}
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
                                Places Hold Period over 50% full BPE.com
                                <span className="fw_400 d-block">
                                  (The length of the hold period in bpe.com,
                                  overriding the date settings above.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="7 days"
                                  {...getFieldProps(
                                    'places_hold_period_over_50_full_bpe',
                                  )}
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
                                Places Hold Period over 70% full BPE.com
                                <span className="fw_400 d-block">
                                  (How long in days provisional bookings will be
                                  kept on hold)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="4 days"
                                  {...getFieldProps(
                                    'places_hold_period_over_70_full_bpe',
                                  )}
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
                                Places Hold Period over 85% full BPE.com
                                <span className="fw_400 d-block">
                                  (The length of the hold period in bpe.com,
                                  overriding the date settings above.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="48 hours"
                                  {...getFieldProps(
                                    'places_hold_period_over_85_full_bpe',
                                  )}
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
                                Places Hold Period over 95% full BPE.com
                                <span className="fw_400 d-block">
                                  (The length of the hold period in bpe.com,
                                  overriding the date settings above.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="24 hours"
                                  {...getFieldProps(
                                    'places_hold_period_over_95_full_bpe',
                                  )}
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
                                Paid in full amount BPE.com{' '}
                                <span className="fw_400 d-block">
                                  (The amount that we view the party as fully
                                  paid at in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="5"
                                  {...getFieldProps('paid_in_full_amount_bpe')}
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
                                Stop Bookings BPE.com
                                <span className="fw_400 d-block">
                                  (When to no longer allow bookings to be made
                                  in bpe.com.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  id="holdPeriod"
                                  type="text"
                                  variant="outlined"
                                  placeholder="3 days"
                                  {...getFieldProps('stop_bookings_bpe')}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Invoice Template Alert Info
                                <span className="fw_400 d-block">
                                  (Shows in bold red text below the grand total
                                  on the invoices)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  id="invoiceExtra"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  placeholder=""
                                  {...getFieldProps(
                                    'invoice_template_alert_info',
                                  )}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Invoice Template Extra Info
                                <span className="fw_400 d-block">
                                  (Shows as standard text at the bottom of the
                                  invoices)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  id="invoiceExtra"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  placeholder=""
                                  {...getFieldProps(
                                    'invoice_template_extra_info',
                                  )}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Automatic Tasks Status
                                <span className="d-block fw_400">
                                  (Turn automatic CRMBO tasks on and off)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <div className="system_radio_group">
                                <ul>
                                  <li>
                                    <label className="text_small">
                                      Etickets:
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps('automatic_etickets')}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                  <li>
                                    <label className="text_small">
                                      Exchequer
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps(
                                          'automatic_exchequer',
                                        )}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                  <li>
                                    <label className="text_small">
                                      Invoice:
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps('automatic_invoice')}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                  <li>
                                    <label className="text_small">
                                      Afterparty:
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps(
                                          'automatic_afterparty',
                                        )}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                  <li>
                                    <label className="text_small">
                                      Provisional Hold:
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps(
                                          'automatic_provisional_hold',
                                        )}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                  <li>
                                    <label className="text_small">
                                      Drinks Reminders:
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps(
                                          'automatic_drinks_reminders',
                                        )}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                  <li>
                                    <label className="text_small">
                                      Reports:
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps('automatic_reports')}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                  <li>
                                    <label className="text_small">
                                      Tim's Numbers Comparisons:
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps(
                                          'automatic_tims_number_comparisons',
                                        )}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                  <li>
                                    <label className="text_small">
                                      John's Numbers:
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps(
                                          'automatic_johns_numbers',
                                        )}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                  <li>
                                    <label className="text_small">
                                      Coupons:
                                    </label>
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        {...getFieldProps('automatic_coupons')}
                                      >
                                        <FormControlLabel
                                          value={true}
                                          control={<Radio />}
                                          label="ON"
                                        />
                                        <FormControlLabel
                                          value={false}
                                          control={<Radio />}
                                          label="OFF"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Send Exchequer Reports to
                                <span className="fw_400 d-block">
                                  (Enter a list of email addresses separated by
                                  a new line, comma or semicolon)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  id="Exchequer"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  placeholder=""
                                  {...getFieldProps(
                                    'send_exchequer_reports_to',
                                  )}
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
                                Comparison Reports Compare Year
                                <span className="d-block fw_400">
                                  (Specify the default year to compare the
                                  current numbers to - this is usually set to
                                  "Previous year")
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <Select
                                  labelId="year-label"
                                  id="faqyear"
                                  className="select_wrap"
                                  {...getFieldProps(
                                    'comparison_reports_compare_year',
                                  )}
                                >
                                  {optionsComparisonReportsCompareYear.map(
                                    item => (
                                      <MenuItem value={item.id} key={item.id}>
                                        {item.label}
                                      </MenuItem>
                                    ),
                                  )}
                                </Select>
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Send Comparison Reports to
                                <span className="fw_400 d-block">
                                  (Enter a list of email addresses separated by
                                  a new line, comma or semicolon)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  id="sendReport"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  {...getFieldProps(
                                    'send_comparison_reports_to',
                                  )}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Send Party Numbers Reports to:
                                <span className="fw_400 d-block">
                                  (Enter a list of email addresses separated by
                                  a new line, comma or semicolon)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  id="sendReport"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  {...getFieldProps(
                                    'send_party_numbers_reports_to',
                                  )}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Send Auto Coupon Notifications to
                                <span className="fw_400 d-block">
                                  (Enter a list of email addresses separated by
                                  a new line, comma or semicolon)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col className="col-xxl-4 col-md-5">
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  id="sendReport"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  {...getFieldProps(
                                    'send_auto_coupon_notifications_to',
                                  )}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                    </ul>
                    <div className="card_footer mb-2">
                      <button type="submit" className="btn_border small">
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
