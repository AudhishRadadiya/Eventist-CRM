import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import { Button, Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Loader from 'Components/Common/Loader';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountData } from 'store/reducers/Contact/account.slice';
import { setAccountDetail } from 'store/reducers/Contact/account.slice';
import { setIsAccountUpdated } from 'store/reducers/Contact/account.slice';
import { updateAccount } from 'store/reducers/Contact/account.slice';
import { createAccount } from 'store/reducers/Contact/account.slice';
import { contactTypes } from 'utils/FieldValues';
import { getVenueListData } from 'store/reducers/Admin/Events/venue.slice';
import { capitalizeSentence } from 'utils/common';

export default function AddAccount() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { accountId } = useParams();

  const { isAccountUpdated, accountDetail, accountLoading } = useSelector(
    ({ account }) => account,
  );

  const { activeVenueList } = useSelector(({ venue }) => venue);

  const initialValuesAccount = {
    type: '',
    name: '',
    handle: '',
    address_line_1: '',
    address_line_2: '',
    address_line_3: '',
    address_line_4: '',
    city: '',
    country: '',
    postcode: '',
    primary_event_location: null,
    secondary_event_location: null,
    tertiary_event_location: null,
    invoice_account_automatically: '',
    internal_notes: '',
    public_notes: '',
    is_active: true,
    update_contact_addresses: null,
  };

  const [accountsInitialValues, setAccountInitialValues] =
    useState(initialValuesAccount);

  const [autoSentenceCase, setAutoSentenceCase] = useState(false);

  useEffect(() => {
    dispatch(getVenueListData());
  }, [dispatch]);

  useEffect(() => {
    if (accountId) {
      dispatch(getAccountData(accountId));
    }
  }, [dispatch, accountId]);

  useEffect(() => {
    if (isAccountUpdated) {
      navigate('/contact/account');
      dispatch(setAccountDetail({}));
      dispatch(setIsAccountUpdated(false));
    }
    return () => {
      dispatch(setAccountDetail({}));
    };
  }, [isAccountUpdated]);

  useEffect(() => {
    if (Object.keys(accountDetail)?.length > 0) {
      setAccountInitialValues({
        type: accountDetail?.type,
        name: accountDetail?.name ? accountDetail?.name : '',
        handle: accountDetail?.handle ? accountDetail?.handle : '',
        address_line_1: accountDetail?.address_line_1
          ? accountDetail?.address_line_1
          : '',
        address_line_2: accountDetail?.address_line_2
          ? accountDetail?.address_line_2
          : '',
        address_line_3: accountDetail?.address_line_3
          ? accountDetail?.address_line_3
          : '',
        address_line_4: accountDetail?.address_line_4
          ? accountDetail?.address_line_4
          : '',
        city: accountDetail?.city ? accountDetail?.city : '',
        country: accountDetail?.country ? accountDetail?.country : '',
        postcode: accountDetail?.postcode ? accountDetail?.postcode : '',
        primary_event_location: accountDetail?.primary_event_location
          ? accountDetail?.primary_event_location
          : '',
        secondary_event_location: accountDetail?.secondary_event_location
          ? accountDetail?.secondary_event_location
          : '',
        tertiary_event_location: accountDetail?.tertiary_event_location
          ? accountDetail?.tertiary_event_location
          : '',
        invoice_account_automatically:
          accountDetail?.invoice_account_automatically
            ? accountDetail?.invoice_account_automatically
            : '',
        internal_notes: accountDetail?.internal_notes
          ? accountDetail?.internal_notes
          : '',
        public_notes: accountDetail?.public_notes
          ? accountDetail?.public_notes
          : '',
        update_contact_addresses: accountDetail?.update_contact_addresses,
        is_active: accountDetail?.is_active ? accountDetail?.is_active : true,
      });
    }
  }, [accountDetail]);

  const addEditAccountSchema = Yup.object().shape({
    type: Yup.string().required('Type is a required field'),
    name: Yup.string()
      .matches(/^[^\s]/, 'Name cannot include leading spaces')
      .required('Name is a required field'),
    city: Yup.string().required('City is a required field'),
    country: Yup.string().required('Country is a required field'),
    postcode: Yup.string().required('PostCode is a required field'),
  });

  return (
    <div className="inner_wrapper">
      {accountLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link to="/contact">Contacts</Link>
          <Link to="/contact/account">Account</Link>
          <Typography>
            {!accountLoading && Object.keys(accountDetail).length === 0
              ? 'Add New Account'
              : 'Edit Account'}
          </Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <Row>
          <Col xs={9}>
            <h1>
              {!accountLoading && Object.keys(accountDetail).length === 0
                ? 'Add New Account'
                : 'Edit Account'}
            </h1>
          </Col>
        </Row>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={accountsInitialValues}
        validationSchema={addEditAccountSchema}
        onSubmit={values => {
          const capitalizedObject = {
            ...values,
            name: capitalizeSentence(values.name),
            handle: capitalizeSentence(values.handle),
          };

          let newValues = autoSentenceCase ? capitalizedObject : values;
          if (Object.keys(accountDetail).length > 0) {
            dispatch(
              updateAccount({
                _id: accountDetail._id,
                account: newValues,
              }),
            );
          } else {
            dispatch(createAccount(newValues));
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
            <div className="add_account_wrap bg_white_box p-3">
              <Row>
                <Col xxl={8}>
                  <ul className="mb-4">
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <label className="text_small fw_500">
                            Account Type<span className="text_primary">*</span>:
                          </label>
                        </Col>
                        <Col xs={8}>
                          <FormControl className="w-50">
                            <Select
                              labelId="Method-label"
                              id="Method-select"
                              className="select_wrap"
                              name="type"
                              value={values.type}
                              {...getFieldProps('type')}
                            >
                              <MenuItem value="Select" disabled>
                                Select
                              </MenuItem>
                              {contactTypes?.map((item, index) => {
                                return (
                                  <MenuItem value={item.id} key={index}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <span className="d-block text-danger text_small">
                            <ErrorMessage name="type" />
                          </span>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <label className="text_small fw_500">
                            Company/Account Name
                            <span className="text_primary">*</span>:
                          </label>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <div className="form-group checkbox_wrap m-0">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="auto_sentence"
                                    checked={autoSentenceCase}
                                    onChange={() => {
                                      setAutoSentenceCase(!autoSentenceCase);
                                    }}
                                  />
                                }
                                label="Auto Sentence Case"
                                className="mb-2"
                              />
                            </div>
                            <FormControl className="w-75">
                              <TextField
                                id="AccountName"
                                {...getFieldProps('name')}
                                value={
                                  autoSentenceCase
                                    ? capitalizeSentence(values.name)
                                    : values.name
                                }
                                onChange={e => {
                                  setFieldValue('name', e.target.value);
                                  setFieldValue('handle', e.target.value);
                                }}
                                variant="outlined"
                                // className="input_wrap"
                                placeholder="Enter name"
                              />
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="name" />
                            </span>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Account Handle:
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl className="w-75">
                              <TextField
                                id="AccountHandle"
                                {...getFieldProps('handle')}
                                value={
                                  autoSentenceCase
                                    ? capitalizeSentence(values.handle)
                                    : values.handle
                                }
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter"
                              />
                            </FormControl>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                  </ul>
                  <h4 className="fw_600">Default Address Information</h4>
                  <ul className="mb-4">
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Address Line 1 :
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl>
                              <TextField
                                id="AddressLine1"
                                {...getFieldProps('address_line_1')}
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter"
                                rows={1.5}
                                multiline
                              />
                            </FormControl>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Address Line 2 :
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl>
                              <TextField
                                id="AddressLine2"
                                {...getFieldProps('address_line_2')}
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter"
                                rows={1.5}
                                multiline
                              />
                            </FormControl>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Address Line 3 :
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl>
                              <TextField
                                id="AddressLine3"
                                {...getFieldProps('address_line_3')}
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter"
                                rows={1.5}
                                multiline
                              />
                            </FormControl>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Address Line 4 :
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl>
                              <TextField
                                id="AddressLine4"
                                {...getFieldProps('address_line_4')}
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter"
                                rows={1.5}
                                multiline
                              />
                            </FormControl>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            City<span className="text_primary">*</span>:
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl className="w-75">
                              <TextField
                                id="AddressLine2"
                                {...getFieldProps('city')}
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter city name"
                              />
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="city" />
                            </span>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            County<span className="text_primary">*</span>:
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl className="w-75">
                              <TextField
                                id="AddressLine2"
                                {...getFieldProps('country')}
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter country name"
                              />
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="country" />
                            </span>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Postcode<span className="text_primary">*</span>:
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl className="w-75">
                              <TextField
                                id="AddressLine2"
                                {...getFieldProps('postcode')}
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter postcode"
                              />
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="postcode" />
                            </span>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Primary Event Location :
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormControl className="w-75">
                            <Select
                              labelId="Method-label"
                              id="Method-select"
                              name="primary_event_location"
                              value={values.primary_event_location}
                              onChange={handleChange}
                              className="select_wrap"
                              // defaultValue="Select"
                            >
                              <MenuItem value="Select" disabled>
                                Select
                              </MenuItem>
                              {activeVenueList?.map(item => {
                                return (
                                  <MenuItem key={item?._id} value={item?._id}>
                                    {item?.internal_name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Secondary Event Location :
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormControl className="w-75">
                            <Select
                              labelId="Method-label"
                              id="Method-select"
                              name="secondary_event_location"
                              value={values.secondary_event_location}
                              onChange={handleChange}
                              className="select_wrap"
                              defaultValue="Select"
                            >
                              <MenuItem value="Select" disabled>
                                Select
                              </MenuItem>
                              {activeVenueList?.map(item => {
                                return (
                                  <MenuItem key={item?._id} value={item?._id}>
                                    {item?.internal_name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Tertiary Event Location :
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormControl className="w-75">
                            <Select
                              labelId="Method-label"
                              id="Method-select"
                              name="tertiary_event_location"
                              value={values.tertiary_event_location}
                              onChange={handleChange}
                              className="select_wrap"
                              defaultValue="Select"
                            >
                              <MenuItem value="Select" disabled>
                                Select
                              </MenuItem>
                              {activeVenueList?.map(item => {
                                return (
                                  <MenuItem key={item?._id} value={item?._id}>
                                    {item?.internal_name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Invoice Account Automatically:
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="InvoiceAccount"
                                name="InvoiceAccount-group"
                                className="custom_radio"
                                defaultValue={
                                  values?.invoice_account_automatically
                                }
                                value={values.invoice_account_automatically}
                                onChange={e => {
                                  setFieldValue(
                                    'invoice_account_automatically',
                                    Number(e.target.value),
                                  );
                                }}
                              >
                                <FormControlLabel
                                  value={1}
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value={2}
                                  control={<Radio />}
                                  label="No"
                                />
                                <FormControlLabel
                                  value={3}
                                  control={<Radio />}
                                  label="Yes if booking has discount"
                                />
                              </RadioGroup>
                            </FormControl>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Account Internal Notes:
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl>
                              <TextField
                                id="AccountInternalNotes"
                                {...getFieldProps('internal_notes')}
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter"
                                rows={1.5}
                                multiline
                              />
                            </FormControl>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Account Public Notes:
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl>
                              <TextField
                                id="AccountPublicNotes"
                                {...getFieldProps('public_notes')}
                                variant="outlined"
                                className="input_wrap"
                                placeholder="Enter"
                                rows={1.5}
                                multiline
                              />
                            </FormControl>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">Active:</lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="InvoiceAccount"
                                defaultValue="ActiveYes"
                                name="Active-group"
                                className="custom_radio"
                                value={values.is_active}
                                onChange={() =>
                                  setFieldValue('is_active', !values.is_active)
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
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={4}>
                          <lable className="text_small fw_500">
                            Update contact addresses:
                          </lable>
                        </Col>
                        <Col xs={8}>
                          <FormGroup>
                            <div className="form-group checkbox_wrap m-0">
                              <FormControlLabel
                                label="Yes (if ticked)"
                                name="update_contact_addresses"
                                value={values?.update_contact_addresses}
                                onChange={handleChange}
                                control={<Checkbox />}
                                checked={values?.update_contact_addresses}
                              />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </li>
                  </ul>
                  <Button type="submit" className="btn_primary small">
                    Save
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
