import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Col, Row } from 'react-bootstrap';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ErrorMessage, Form, Formik } from 'formik';
import validator from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './../Common/Loader';
import {
  createUserSecurity,
  getUserData,
  getUserListData,
  setIsUserUpdated,
  setUserDetail,
  updateUserSecurity,
  userAssignBooking,
} from 'store/reducers/User/user.slice';
import { yearsThreeYearsInThePastOneYearInTheFuture } from 'utils/FieldValues';
import { getVenueListData } from 'store/reducers/Admin/Events/venue.slice';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { numberRegex } from 'utils/common';

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 19,
            top: 19,
            color: color => color.palette.grey[600],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function AddEditSecurity() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { userId } = useParams();

  const { isUserUpdated, userDetail, userLoading } = useSelector(
    ({ user }) => user,
  );
  const { inActiveVenueList } = useSelector(({ venue }) => venue);
  const { activeUserList } = useSelector(({ user }) => user);

  const initialValues = {
    username: '',
    password: '',
    name: '',
    public_name: '',
    email: '',
    super_admin: false,
    standard_admin: false,
    basic_admin: false,
    restricted_to_ip_host: '',
    is_active: true,
    deleted: false,
  };
  const [userInitialValues, setUserInitialValues] = useState(initialValues);
  const [autoSentenceCase, setAutoSentenceCase] = useState(false);

  const [forYear, setForYear] = useState('All');
  const [forVenue, setForVenue] = useState('All');
  const [reAssign, setReAssign] = useState('');
  const [minPlace, setMinPlace] = useState('');
  const [maxPlace, setMaxPlace] = useState('');
  const [reassignError, setReassignError] = useState('');
  const [advanceOption, setAdvanceOption] = useState(false);
  const [modalPopup, setModalPopup] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(getUserData(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (isUserUpdated) {
      navigate('/security');
      dispatch(setIsUserUpdated(false));
      dispatch(setUserDetail({}));
    }
    return () => dispatch(setUserDetail({}));
  }, [isUserUpdated]);

  useEffect(() => {
    dispatch(getVenueListData());
    dispatch(getUserListData());
    setReAssign('');
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(userDetail).length > 0) {
      setUserInitialValues({
        username: userDetail.username,
        password: userDetail.password,
        name: userDetail.name,
        public_name: userDetail.public_name,
        email: userDetail.email,
        restricted_to_ip_host: userDetail.restricted_to_ip_host.trim(),
        is_active: userDetail.is_active,
        deleted: userDetail.deleted,
        super_admin: userDetail.super_admin,
        standard_admin: userDetail.standard_admin,
        basic_admin: userDetail.basic_admin,
      });
    }
  }, [userDetail]);

  const OpenModal = () => {
    if (reAssign === '') {
      setReassignError('Please select a user to assign the booking to');
    } else {
      setModalPopup(true);
    }
  };

  const CloseModal = () => {
    setModalPopup(false);
  };

  const reassignPopup = () => {
    dispatch(
      userAssignBooking({
        id: userId,
        data: {
          reassign_id: reAssign,
          year: forYear === 'All' ? '' : forYear,
          venue_id: forVenue === 'All' ? '' : forVenue,
          min_places: Number(minPlace),
          max_places: Number(maxPlace),
        },
      }),
    );
    setReAssign('');
    CloseModal();
  };

  return (
    <div className="inner_wrapper">
      {userLoading && <Loader />}
      <div className="editsecurity_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Main Admin</b>
            </Typography>
            <Typography>
              {!userLoading && Object.keys(userDetail).length === 0
                ? 'Add User'
                : 'Edit User'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!userLoading && Object.keys(userDetail).length === 0
              ? 'Add User'
              : 'Edit User'}
          </h1>
        </div>
        <div className="editsecurity_wrap">
          <Row>
            <Col xs={6}>
              <div className="security_newuser_wrap">
                <div className="card_wrapper mb-4">
                  <div className="card_header py-2 px-3">
                    <Row className="align-items-center">
                      <Col xs={5}>
                        <h4 className="m-0 py-1 text_white">
                          {userDetail?.name ? userDetail?.name : 'New User'}
                        </h4>
                      </Col>
                      <Col xs={7}>
                        <FormGroup className="inline_checkbox_wrap checkbox_white">
                          <FormControlLabel
                            control={
                              <Checkbox
                                id="auto_sentence"
                                name="auto_sentence"
                                checked={autoSentenceCase}
                                onChange={() => {
                                  setAutoSentenceCase(!autoSentenceCase);
                                }}
                              />
                            }
                            label="Auto Sentence Case"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <Formik
                    enableReinitialize={true}
                    initialValues={userInitialValues}
                    validate={values => {
                      const errors = {};
                      // if (
                      //   values?.password !== undefined &&
                      //   values?.password.trim().length < 1
                      // ) {
                      //   errors.password =
                      //     'Password must be at least 1 characters';
                      // }
                      if (!values.username) {
                        errors.username = 'Username is a required field!';
                      } else if (values.username.trim().length < 2) {
                        errors.username =
                          'Username must be at least 2 characters';
                      }
                      if (
                        values?.password !== undefined &&
                        values.password.trim().length < 1
                      ) {
                        errors.password =
                          '*Password must be at least 1 characters';
                      }
                      if (!values.name) {
                        errors.name = 'Name is a required field!';
                      } else if (values.name.trim().length < 4) {
                        errors.name = 'Name must be at least 4 characters';
                      }
                      if (!values.public_name) {
                        errors.public_name = 'Public name is a required field!';
                      } else if (values.public_name.trim().length < 5) {
                        errors.public_name =
                          'Public name must be at least 4 characters';
                      }
                      if (!values.email) {
                        errors.email = 'Email is a required field';
                      } else if (!validator.isEmail(values.email)) {
                        errors.email = 'Invalid email address format';
                      }
                      // if (!Object.values(values.permissions).includes(true)) {
                      //   errors.permissions = '*Atleast 1 permission required';
                      // }
                      // if (!values.restricted_to_ip_host) {
                      //   errors.restricted_to_ip_host =
                      //     '*Restrict to IP/Host is a required field';
                      // } else {
                      //   const ipHostValues = values.restricted_to_ip_host
                      //     .trim()
                      //     .split(',');
                      //   ipHostValues.map(item => {
                      //     if (
                      //       !/^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)(?:\:(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/.test(
                      //         item,
                      //       )
                      //     ) {
                      //       errors.restricted_to_ip_host =
                      //         'You have entered an invalid IP/Host!';
                      //     }
                      //     return item;
                      //   });
                      // }
                      return errors;
                    }}
                    onSubmit={values => {
                      if (Object.keys(userDetail).length > 0) {
                        dispatch(
                          updateUserSecurity({
                            _id: userDetail._id,
                            user: values,
                          }),
                        );
                      } else {
                        dispatch(createUserSecurity(values));
                      }
                    }}
                  >
                    {({
                      handleSubmit,
                      setFieldValue,
                      values,
                      getFieldProps,
                      errors,
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <div className="card_body admin_card_body">
                          <ul>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Username
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
                                        {...getFieldProps('username')}
                                      />
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="username" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Password
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
                                        type="text"
                                        {...getFieldProps('password')}
                                        placeholder="••••••"
                                      />
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="password" />
                                  </span>
                                  {/* <span className="d-block text-danger text_small">
                                    {errors?.password}
                                  </span> */}
                                </Col>
                              </Row>
                            </li>
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
                                    <div className="d-flex align-items-center">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <TextField
                                          {...getFieldProps('name')}
                                          className={
                                            autoSentenceCase
                                              ? 'custom_capital'
                                              : ''
                                          }
                                        />
                                      </FormControl>
                                      <span className="text_small mx-1">
                                        (shown in email FROM field)
                                      </span>
                                    </div>
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
                                        className={
                                          autoSentenceCase
                                            ? 'custom_capital'
                                            : ''
                                        }
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
                                      Email<sup className="text_primary">*</sup>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField {...getFieldProps('email')} />
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="email" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row className="align-items-start">
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Permissions</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <ul>
                                      <li>
                                        <FormGroup className="inline_checkbox_wrap permisssion_checkbox mb-2">
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                id="super"
                                                name="super"
                                                checked={values.super_admin}
                                                onChange={() =>
                                                  setFieldValue(
                                                    'super_admin',
                                                    !values.super_admin,
                                                  )
                                                }
                                              />
                                            }
                                          />
                                          <span>
                                            <strong>
                                              Super Administrator :
                                            </strong>
                                             To be able to perform every
                                            functionality on the system.
                                          </span>
                                        </FormGroup>
                                      </li>
                                      <li>
                                        <FormGroup className="inline_checkbox_wrap permisssion_checkbox mb-2">
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                id="super"
                                                name="super"
                                                checked={values.standard_admin}
                                                onChange={() =>
                                                  setFieldValue(
                                                    'standard_admin',
                                                    !values.standard_admin,
                                                  )
                                                }
                                              />
                                            }
                                          />
                                          <span>
                                            <strong>
                                              Standard Administrator : 
                                            </strong>
                                            To be able to perform every
                                            functionality on the system, but no
                                            ability to add new or edit user
                                            details, and no access to
                                            development and system configuration
                                            areas.
                                          </span>
                                        </FormGroup>
                                      </li>
                                      <li>
                                        <FormGroup className="inline_checkbox_wrap permisssion_checkbox mb-2">
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                id="super"
                                                name="super"
                                                checked={values.basic_admin}
                                                onChange={() =>
                                                  setFieldValue(
                                                    'basic_admin',
                                                    !values.basic_admin,
                                                  )
                                                }
                                              />
                                            }
                                          />
                                          <span>
                                            <strong>
                                              Basic Administrator :
                                            </strong>
                                             To be entitled to basic access.
                                            Only ability to invoice an account,
                                            ability to manage (including
                                            billables) and create contacts with
                                            accounts, create and assign
                                            bookings, accept and process
                                            coupons, create/view reports.
                                          </span>
                                        </FormGroup>
                                      </li>
                                    </ul>
                                  </div>
                                  {/* <span className="d-block text-danger text_small">
                                    <ErrorMessage name="permissions" />
                                  </span> */}
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Restrict to IP/Host</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        {...getFieldProps(
                                          'restricted_to_ip_host',
                                        )}
                                      />
                                    </FormControl>
                                  </div>
                                  {/* <span className="d-block text-danger text_small">
                                    <ErrorMessage name="restricted_to_ip_host" />
                                  </span> */}
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
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </Col>
            <Col xs={6}>
              <div className="security_booking_wrap">
                <div className="card_wrapper mb-4">
                  <div className="card_header py-2 px-3">
                    <h4 className="m-0 py-1 text_white">User’s Bookings</h4>
                  </div>
                  {userId && userDetail?.total_assigned_bookings > 0 ? (
                    <div className="card_body admin_card_body">
                      <ul>
                        <li>
                          <h6 className="m-0 fw_500">
                            This user has
                            <span className="text_primary mx-1">
                              {userDetail?.total_assigned_bookings}
                            </span>
                            assigned bookings.
                          </h6>
                        </li>
                        <li>
                          <Row>
                            <Col>
                              <div className="card_content_left">
                                <label>Advanced Options</label>
                              </div>
                            </Col>
                            <Col>
                              <div className="card_content_right text-end">
                                <Button
                                  className="btn_border small mx-1"
                                  onClick={() =>
                                    setAdvanceOption(!advanceOption)
                                  }
                                >
                                  Advanced
                                </Button>
                              </div>
                            </Col>
                          </Row>
                          {advanceOption && (
                            <div className="security_advance_wrap mt-2">
                              <ul>
                                <li>
                                  <Row>
                                    <Col xs={6}>
                                      <div className="card_content_left">
                                        <label>For Year</label>
                                      </div>
                                    </Col>
                                    <Col xs={6}>
                                      <div className="card_content_right">
                                        <FormControl
                                          fullWidth
                                          className="main_input_wrap"
                                        >
                                          <Select
                                            labelId="forYear"
                                            id="forYear"
                                            value={!forYear ? 'All' : forYear}
                                            onChange={event =>
                                              setForYear(event.target.value)
                                            }
                                            className="input_wrap select_wrap"
                                          >
                                            <MenuItem value="All">
                                              -- All Year --
                                            </MenuItem>
                                            {yearsThreeYearsInThePastOneYearInTheFuture?.map(
                                              item => {
                                                return (
                                                  <MenuItem
                                                    value={item}
                                                    key={item}
                                                  >
                                                    {item}
                                                  </MenuItem>
                                                );
                                              },
                                            )}
                                          </Select>
                                        </FormControl>
                                      </div>
                                    </Col>
                                  </Row>
                                </li>
                                <li>
                                  <Row>
                                    <Col xs={6}>
                                      <div className="card_content_left">
                                        <label>For Venue</label>
                                      </div>
                                    </Col>
                                    <Col xs={6}>
                                      <div className="card_content_right">
                                        <FormControl
                                          fullWidth
                                          className="main_input_wrap"
                                        >
                                          <Select
                                            labelId="forVenue"
                                            id="forVenue"
                                            value={!forVenue ? 'All' : forVenue}
                                            onChange={event =>
                                              setForVenue(event.target.value)
                                            }
                                            className="input_wrap select_wrap"
                                          >
                                            <MenuItem value="All">
                                              -- All Venue --
                                            </MenuItem>
                                            {inActiveVenueList?.map(item => {
                                              return (
                                                <MenuItem
                                                  key={item?._id}
                                                  value={item?._id}
                                                >
                                                  {item?.internal_name +
                                                    '(' +
                                                    item?.sku +
                                                    ')'}
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
                                    <Col xs={6}>
                                      <div className="card_content_left">
                                        <label>
                                          With Min Places (inclusive)
                                          <span className="fw_400 d-block">
                                            This will combine provisional and
                                            confirmed places to check total
                                            places, or use enquired places if no
                                            prov/conf places set.
                                          </span>
                                        </label>
                                      </div>
                                    </Col>
                                    <Col xs={6}>
                                      <div className="card_content_right">
                                        <FormControl
                                          fullWidth
                                          className="main_input_wrap"
                                        >
                                          <TextField
                                            id="MinPlaces"
                                            type="number"
                                            onWheel={e => e.target.blur()}
                                            variant="outlined"
                                            placeholder=""
                                            onKeyDown={e => {
                                              numberRegex(e);
                                            }}
                                            inputProps={{
                                              min: 0,
                                              step: 'any',
                                            }}
                                            value={minPlace}
                                            onChange={event =>
                                              setMinPlace(event.target.value)
                                            }
                                          />
                                        </FormControl>
                                      </div>
                                    </Col>
                                  </Row>
                                </li>
                                <li>
                                  <Row>
                                    <Col xs={6}>
                                      <div className="card_content_left">
                                        <label>
                                          With Max Places (inclusive)
                                          <span className="fw_400 d-block">
                                            This will combine provisional and
                                            confirmed places to check total
                                            places, or use enquired places if no
                                            prov/conf places set.
                                          </span>
                                        </label>
                                      </div>
                                    </Col>
                                    <Col xs={6}>
                                      <div className="card_content_right">
                                        <FormControl
                                          fullWidth
                                          className="main_input_wrap"
                                        >
                                          <TextField
                                            id="MaxPlaces"
                                            type="number"
                                            onWheel={e => e.target.blur()}
                                            variant="outlined"
                                            placeholder=""
                                            onKeyDown={e => {
                                              numberRegex(e);
                                            }}
                                            inputProps={{
                                              min: 0,
                                              step: 'any',
                                            }}
                                            value={maxPlace}
                                            onChange={event =>
                                              setMaxPlace(event.target.value)
                                            }
                                          />
                                        </FormControl>
                                      </div>
                                    </Col>
                                  </Row>
                                </li>
                              </ul>
                            </div>
                          )}
                        </li>
                        <li>
                          <Row>
                            <Col xs={6}>
                              <div className="card_content_left">
                                <label>
                                  Reassign all bookings to
                                  <sup className="text_primary">*</sup>
                                </label>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div className="card_content_right">
                                <div className="d-flex justify-content-end align-items-start">
                                  <FormControl
                                    fullWidth
                                    className="main_input_wrap bg_transparent"
                                  >
                                    <Select
                                      labelId="reAssign"
                                      id="reAssign"
                                      value={reAssign}
                                      onChange={event => {
                                        if (event.target.value !== '') {
                                          setReassignError('');
                                        }
                                        setReAssign(event.target.value);
                                      }}
                                      defaultValue="ReAssign"
                                      className="input_wrap select_wrap"
                                    >
                                      <MenuItem value="ReAssign" disabled>
                                        -- Do not reassign --
                                      </MenuItem>
                                      {activeUserList?.map(item => {
                                        return (
                                          <MenuItem
                                            key={item}
                                            value={item?._id}
                                          >
                                            {item?.username} ({item?.name})
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                    {reassignError !== '' && (
                                      <span className="d-block text-danger text_small">
                                        {reassignError}
                                      </span>
                                    )}
                                  </FormControl>
                                  <Button
                                    className="btn_border small mx-1"
                                    onClick={() => OpenModal()}
                                  >
                                    Reassign
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="card_body admin_card_body">
                      <ul>
                        <li>
                          <h6 className="m-0 fw_500">
                            This user does not have any assigned bookings.
                          </h6>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Dialog
        aria-labelledby="CancelBooking-title"
        open={modalPopup}
        className="delete_popup"
      >
        <BootstrapDialogTitle
          id="CancelBooking-title"
          onClose={CloseModal}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="delete_popup_wrap">
              <p>Are you sure you want to reassign all this user's bookings?</p>
              <ul className="d-flex align-items-center justify-content-center">
                <li>
                  <Button className="btn_border mx-2" onClick={CloseModal}>
                    Cancel
                  </Button>
                </li>
                <li>
                  <Button className="btn_primary mx-2" onClick={reassignPopup}>
                    Ok
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
