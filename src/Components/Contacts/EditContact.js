import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import { Button, Col, Row } from 'react-bootstrap';
import _ from 'lodash';
import EmailIcon from '../../Assets/Img/email.svg';
import CheckIcon from '../../Assets/Img/check-green.svg';
import CrossIcon from '../../Assets/Img/cross-red.svg';
import FileIcon from '../../Assets/Img/file.svg';
import SearchIcon from '../../Assets/Img/search.svg';
import EyeIcon from '../../Assets/Img/eye.svg';
import CloseIconS from '../../Assets/Img/close.svg';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseIcon2 from '@mui/icons-material/Close';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';

import {
  getContactData,
  setContactDetail,
  setIsContactUpdated,
  updateContact,
  setCreatedContactEnquiryId,
  duplicateCheckEmail,
  getLookupPostcode,
  mergeContacts,
} from 'store/reducers/Contact/contact.slice';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorMessage, Form, Formik } from 'formik';
import { getVenueListData } from 'store/reducers/Admin/Events/venue.slice';
import {
  getAccountListData,
  setAccountList,
} from 'store/reducers/Contact/account.slice';
import * as Yup from 'yup';
import $ from 'jquery';
import { contactTypes } from 'utils/FieldValues';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TrashIcon from '../../Assets/Img/trash.svg';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { capitalizeSentence, numberRegex } from 'utils/common';
import { Autocomplete, Popover } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getContactSourcesListDataActive } from 'store/reducers/Admin/Events/ContactSources/contactSources.slice';
import base64 from 'base-64';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 38,
  padding: 10,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#454545',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor: theme.palette.mode === 'light' ? '#F54776' : '',
    height: 18,
    top: 10,
  },
}));
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
          <CloseIcon2 />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
export default function EditContact() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const yourState = location.state && location.state;

  const { userPermissionDetail } = useSelector(({ user }) => user);

  const [loopUpErrorMsg, setLookUpErrorMsg] = useState('');
  const [markAs, setMarkAs] = useState(false);
  const [lookUp, setLookUp] = useState('');
  const [mergeEmailCheck, setMergeEmailCheck] = useState(false);
  const [mergeEmailCheckValid, setMergeEmailCheckValid] = useState(false);
  const initialValuesEditContact = {
    account_id: '',
    type: 2,
    company_name: '',
    source: null,
    is_other: false,
    title: '',
    first_name: '',
    surname: '',
    newSource: '',
    email_primary: '',
    email_secondary: '',
    telephone_primary: '',
    telephone_secondary: '',
    fax: '',
    marketing_opt_in: true,
    full_opt_out: false,
    auto_invoice_customer: true,
    notes: '',
    website_security_code: '',
    user_has_set_password: false,
    password_reset_link: '',
    info: '',
    address_line_1: '',
    address_line_2: '',
    address_line_3: '',
    city: '',
    country: '',
    post_code: '',
    primary_event_location: '',
    secondary_event_location: '',
    tertiary_event_location: '',
    is_exclusive: false,
    is_active: true,
    approx_places: '',
    deleted: false,
    look_up: '',
    submitButton: '',
    save: false,
    caseChanger: true,
  };
  const [eventInitialContact, setEventInitialContact] = useState(
    initialValuesEditContact,
  );

  const { contactId } = useParams();
  const {
    isContactUpdated,
    contactDetail,
    CreatedContactEnquiryId,
    contactListLoading,
    duplicateEmailList,
    duplicateEmailSecondaryList,
    lookupPostcodeList,
  } = useSelector(({ contact }) => contact);

  const { activeContactSourcesList } = useSelector(
    ({ contactSources }) => contactSources,
  );
  const { activeVenueList } = useSelector(({ venue }) => venue);
  const { accountList } = useSelector(({ account }) => account);
  const [showContent, setShowcontent] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showCmpName, setShowCmpName] = useState('');
  const [removePopUp, setRemovePopUp] = useState(false);
  const [lookResult, setLookResult] = useState(false);
  const [mergeEmailPopup, setMergeEmailPopup] = useState(false);
  const newobj = useMemo(() => {
    let activeContactSourcesListData = [...activeContactSourcesList] || [];
    activeContactSourcesListData = [...activeContactSourcesListData];
    const activeContactSourcesListOption = [
      ...activeContactSourcesListData
        .flatMap(item => item.group_data)
        .map(option => {
          return {
            label: option?.name,
            value: option?._id,
            title: option.source_category,
          };
        }),
      {
        label: 'other',
        value: 'other',
        title: 'other',
      },
    ];
    return activeContactSourcesListOption;
  }, [activeContactSourcesList]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorSecondary, setAnchorSecondary] = useState(null);

  const [emailForLookup, setEmailForLookup] = useState(false);
  const [emailForLookupState, setEmailForLookupState] = useState('');
  const { state } = useLocation();

  const OpenEmailLookup = () => {
    if (duplicateEmailList?.length > 0) {
      setEmailForLookup(true);
    }
  };

  const CloseEmailLookup = () => {
    setEmailForLookup(false);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickSecondary = event => {
    setAnchorSecondary(event.currentTarget);
  };

  const handleCloseSecondary = () => {
    setAnchorSecondary(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const openSecondary = Boolean(anchorSecondary);
  const idSecondary = openSecondary ? 'simple-popover' : undefined;

  const showContentHandle = value => {
    setShowcontent(value);
  };
  const OpenClose = () => {
    setRemovePopUp(true);
  };
  const ClosePopUp = () => {
    setRemovePopUp(false);
  };
  const removeAccount = () => {
    setShowCmpName('');
    setRemovePopUp(false);
  };

  useEffect(() => {
    if (contactId) {
      dispatch(getContactData(contactId));
      dispatch(setIsContactUpdated(false));
    }
    return () => {
      dispatch(setCreatedContactEnquiryId(''));
    };
  }, [contactId]);

  useEffect(() => {
    dispatch(getVenueListData());
    dispatch(
      getContactSourcesListDataActive({
        is_active: true,
      }),
    );
    return () => {
      setSaveName('');
      setShowcontent(false);
    };
  }, []);
  useEffect(() => {
    if (isContactUpdated) {
      if (saveName === 'save') {
        if (yourState?.booking === 'booking') {
          navigate(`/edit-bookings/${yourState?._id}`);
        } else if (yourState?.booking === 'enquiries') {
          navigate(`/edit-enquiries/${yourState?._id}`);
        } else if (yourState?.booking === 'contact') {
          navigate(`/contact`);
        }
      } else {
        if (CreatedContactEnquiryId !== '') {
          navigate(`/edit-enquiries/${CreatedContactEnquiryId}`);
        }
      }
      dispatch(setContactDetail({}));
      dispatch(setIsContactUpdated(false));
    }
  }, [isContactUpdated, CreatedContactEnquiryId]);

  const timeCode = base64.encode([Date.now(), contactDetail?._id].join('|'));

  useEffect(() => {
    if (Object.keys(contactDetail)?.length > 0) {
      setEventInitialContact(prevState => ({
        ...prevState,
        account_id: contactDetail?.account_id,
        type: contactDetail?.type,
        company_name: contactDetail?.company_name,
        // source: contactDetail?.source,
        is_other: contactDetail?.is_other,
        title: contactDetail?.title,
        first_name: contactDetail?.first_name,
        surname: contactDetail?.surname,
        email_primary: contactDetail?.email_primary,
        email_secondary: contactDetail?.email_secondary,
        telephone_primary: contactDetail?.telephone_primary,
        telephone_secondary: contactDetail?.telephone_secondary,
        fax: contactDetail?.fax,
        marketing_opt_in: contactDetail?.marketing_opt_in,
        full_opt_out: contactDetail?.full_opt_out,
        auto_invoice_customer: contactDetail?.auto_invoice_customer,
        is_exclusive: contactDetail?.is_exclusive,
        notes: contactDetail?.notes,
        website_security_code: contactDetail?.website_security_code,
        user_has_set_password: contactDetail?.user_has_set_password
          ? contactDetail?.user_has_set_password
          : false,
        password_reset_link: `${process.env.REACT_APP_WEBSITE_URL}reset-password?act=${timeCode}&e=${contactDetail?.email_primary}`,
        info: `Created by ${contactDetail?.created_by} on ${moment(
          contactDetail?.created_at,
        ).format('dddd, MMMM Do YYYY')} Last updated by ${
          contactDetail?.updated_by
        } on ${moment(contactDetail?.updated_at).format('dddd, MMMM Do YYYY')}`,
        address_line_1: contactDetail?.address_line_1,
        address_line_2: contactDetail?.address_line_2,
        address_line_3: contactDetail?.address_line_3,
        city: contactDetail?.city,
        country: contactDetail?.country,
        post_code: contactDetail?.post_code,
        primary_event_location: contactDetail?.primary_event_location,
        secondary_event_location: contactDetail?.secondary_event_location,
        tertiary_event_location: contactDetail?.tertiary_event_location,
        is_active: contactDetail?.is_active,
        approx_places: contactDetail?.approx_places || '',
        deleted: contactDetail?.deleted,
        save: contactDetail?.save,
      }));
    }
    setShowCmpName(contactDetail?.account_name);
  }, [contactDetail]);

  useEffect(() => {
    if (
      activeContactSourcesList?.length &&
      Object.keys(contactDetail)?.length > 0
    ) {
      if (!contactDetail.data_source) {
        const sourceObj =
          newobj?.find(item => item.value === contactDetail.source) || null;
        setEventInitialContact(prevState => ({
          ...prevState,
          source: sourceObj,
        }));
      } else {
        setEventInitialContact(prevState => ({
          ...prevState,
          source: {
            label: 'other',
            value: 'other',
            title: 'other',
          },
          newSource: contactDetail.data_source,
        }));
      }
    }
  }, [activeContactSourcesList, contactDetail]);

  useEffect(() => {
    $('.main_content').scroll(function () {
      if ($(this).scrollTop() > 200) {
        $('.progress_wrap').addClass('fixed');
      } else {
        $('.progress_wrap').removeClass('fixed');
      }
    });
  }, []);

  const calculateProgress = values => {
    let obj = [
      values.first_name,
      values.source,
      values.title,
      values.surname,
      values.email_primary,
      values.telephone_primary,
      values.address_line_1,
      values.city,
      values.country,
      values.primary_event_location,
    ];
    let data = Object.values(obj);
    const completedFields = Object.values(data).filter(
      value => value !== '',
    ).length;
    const progress = (completedFields / Object.keys(data).length) * 58 + 42;
    return progress;
  };
  const editContactScheme = Yup.object().shape({
    source: Yup.object().shape({
      label: Yup.string().required(),
      value: Yup.string().required(),
      title: Yup.string().required(),
    }),
    // title: Yup.string()
    //   .required()
    //   .test('title', 'Title is a required field', function (value) {
    //     if (value === 'Please Select' || value === '') {
    //       return this.createError({
    //         path: 'title',
    //         message: 'Title is a required field',
    //       });
    //     } else return true;
    //   }),
    // source: Yup.string().required('Source is a required field'),
    newSource: Yup.string().when('source', source =>
      source[0]?.value === 'other'
        ? Yup.string().required('Please enter a source value')
        : Yup.string().notRequired(),
    ),
    first_name: Yup.string()
      .required('First Name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    surname: Yup.string().required('Surname is a required field'),
    email_primary: Yup.string()
      .email('Invalid email')
      .required('Email is a required field')
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Invalid email')
      .test(
        'unique-email',
        'The email address you entered already exists',
        function (value) {
          if (!value || !Array.isArray(duplicateEmailList)) {
            return true;
          }

          const emailExists =
            Array.isArray(duplicateEmailList) &&
            duplicateEmailList?.some(item => item.email_primary === value);
          return emailExists
            ? this.createError({
                path: 'email_primary',
                message: 'The email address you entered already exists',
              })
            : true;
        },
      ),
    email_secondary: Yup.string()
      .email('Invalid email')
      .notRequired()
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Invalid email')
      .test(
        'unique-email',
        'The email address you entered already exists',
        function (value) {
          if (!value || !Array.isArray(duplicateEmailSecondaryList)) {
            return true;
          }

          const emailExists =
            Array.isArray(duplicateEmailSecondaryList) &&
            duplicateEmailSecondaryList?.some(
              item => item.email_secondary === value,
            );
          return emailExists
            ? this.createError({
                path: 'email_secondary',
                message: 'The email address you entered already exists',
              })
            : true;
        },
      ),
    telephone_primary: Yup.string().required(
      'Primary Telephone is a required field',
    ),
    // .matches(/^(0|(\+44))?(\d{10}|\d{12})$/, 'Invalid phone number'),
    // .test('check0or44', 'Invalid phone number', function (value) {
    //   if (value && value.toString().length < 10)
    //     return this.createError({
    //       path: 'telephone_primary',
    //       message: 'Invalid phone number',
    //     });
    //   else return true;
    // }),
    // .test('check0or44', 'Invalid phone number', function (value) {
    //   if (!value) {
    //     return this.createError({
    //       path: 'telephone_primary',
    //       message: 'Primary Telephone is a required field',
    //     });
    //   } else if (
    //     !value.toString().startsWith('0') &&
    //     !value.toString().startsWith('44')
    //   ) {
    //     return this.createError({
    //       path: 'telephone_primary',
    //       message: 'Telephone primary must be start with 0 or 44',
    //     });
    //   } else if (value.toString().startsWith('0')) {
    //     if (value.toString().length !== 11) {
    //       return this.createError({
    //         path: 'telephone_primary',
    //         message: 'Invalid phone number',
    //       });
    //     } else return true;
    //   } else if (value.toString().startsWith('44')) {
    //     if (value.toString().length !== 12) {
    //       return this.createError({
    //         path: 'telephone_primary',
    //         message: 'Invalid phone number',
    //       });
    //     } else {
    //       return true;
    //     }
    //   } else return true;
    // }),
    telephone_secondary: Yup.string().notRequired(),
    // .test('check0or44', 'Invalid phone number', function (value) {
    //   if (value && value.toString().length < 10)
    //     return this.createError({
    //       path: 'telephone_primary',
    //       message: 'Invalid phone number',
    //     });
    //   else return true;
    // }),
    //   .matches(/^(0|(\+44))?(\d{10}|\d{12})$/, 'Invalid phone number'),
    // .test('check0or44', 'Invalid phone number', function (value) {
    //   if (!value) {
    //     return true;
    //   } else if (
    //     !value.toString().startsWith('0') &&
    //     !value.toString().startsWith('44')
    //   ) {
    //     return this.createError({
    //       path: 'telephone_secondary',
    //       message: 'Telephone primary must be start with 0 or 44',
    //     });
    //   } else if (value.toString().startsWith('0')) {
    //     if (value.toString().length !== 11) {
    //       return this.createError({
    //         path: 'telephone_secondary',
    //         message: 'Invalid phone number',
    //       });
    //     } else return true;
    //   } else if (value.toString().startsWith('44')) {
    //     if (value.toString().length !== 12) {
    //       return this.createError({
    //         path: 'telephone_secondary',
    //         message: 'Invalid phone number',
    //       });
    //     } else {
    //       return true;
    //     }
    //   } else return true;
    // }),
    address_line_1: Yup.string().required('Address Line 1 is a required field'),
    city: Yup.string().required('City is a required field'),
    country: Yup.string().required('Country is a required field'),
    primary_event_location: Yup.string().required(
      'Primary event location is a required field',
    ),
    //new code
    approx_places: Yup.number().when('submitButton', (type, schema) => {
      return type[0] === 'submit'
        ? Yup.number()
            .typeError('Please enter a valid number')
            .required(
              'Please enter the number of places you want to book. Minimum places: 8',
            )
            .test(
              'is-minimum-8',
              'You need to enter 8 or more places',
              value => !isNaN(value) && value >= 8,
            )
            .positive('Number must be greater than 0')
        : schema.nullable();
    }),
    //old code
    // approx_places: Yup.number().when('submitButton', (type, schema) => {
    //   type[0] === 'submit'
    //     ? (schema = Yup.number()
    //         // changes as per requirement
    //         .required(
    //           'Please enter the number of places you want to book Minimum amount: 8',
    //         )
    //         .test(
    //           'is-minimum-8',
    //           'You need to enter 8 or more places',
    //           value => value >= 8,
    //         )
    //         .positive('Number must be greater than 0'))
    //     : (schema = schema.nullable());
    //   return schema;
    // }),
  });

  let checkedDowngraded = contactDetail?.enquiries?.filter(
    i => i?.is_downgraded,
  );

  // const base64 = require('base-64');

  const handleEmailChange = useCallback((key, newValue) => {
    newValue &&
      dispatch(
        duplicateCheckEmail({
          email: newValue,
          isSet: key,
        }),
      );
  }, []);
  const handleMergeEmail = () => {
    if (!mergeEmailCheck) {
      return setMergeEmailCheckValid(true);
    } else {
      dispatch(
        mergeContacts({
          contact_id: contactId,
        }),
      );
      window.location.reload();
      setMergeEmailCheckValid(false);
    }
  };

  const emailChange = useCallback(_.debounce(handleEmailChange, 800), []);

  return (
    <div className="inner_wrapper">
      {contactListLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link to="/contact">Contact</Link>
          <Typography>Edit Contact</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <div className="d-flex justify-content-between">
          <h1>Edit Contact</h1>
          {state?.reportName && <h1>Comes From {state?.reportName} </h1>}
        </div>
      </div>
      <div className="booking_right_head mb-3">
        {markAs && (
          <div classname="contact_alert_Wrap my-3">
            This contact has an Invalid address
          </div>
        )}
        <ul>
          <li onClick={() => setMarkAs(!markAs)}>
            <Link to="" className="btn_border small">
              Mark as INVALID Address
            </Link>
          </li>

          <li>
            <Link
              to={`/historical-booking/${contactId}`}
              className="btn_border small"
            >
              Historical Booking
            </Link>
          </li>

          <li>
            <button
              className="btn_icon"
              // to={`/send-new-email/${contactId}?contact=true`}
              onClick={() => {
                navigate(
                  `/send-new-email/${contactId}?contact=true&brochure_email=brochure_email`,
                  {
                    state: { enq_id: `${contactId}` },
                  },
                );
              }}
            >
              <img src={EmailIcon} alt="Email Icon" />
            </button>
          </li>
          <li>
            <Link
              className="btn_icon"
              to={`/send-new-letter/${contactId}?contact=true&contactid=${contactId}`}
            >
              <img src={FileIcon} alt="File Icon" />
            </Link>
          </li>
          <li>
            <Link
              className="btn_icon"
              to={`/bookings/?contactid=${contactId}&show=cancelled`}
            >
              <img src={SearchIcon} alt="search Icon" />
            </Link>
          </li>
        </ul>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={eventInitialContact}
        validationSchema={editContactScheme}
        onSubmit={values => {
          const data = {
            ...values,
            source:
              values?.source?.value === 'other'
                ? values.newSource
                : values?.source?.value,
            is_other: values?.source?.value === 'other' ? true : false,
            approx_places: values.approx_places && Number(values.approx_places),
            // account_id: showCmpName === '' ? null : values.account_id,
            account_id: values.account_id,
            title: values?.title == 'Please Select' ? '' : values?.title,
          };
          // if (
          //   !data.telephone_primary.toString().startsWith('0') &&
          //   !data.telephone_primary.toString().startsWith('44')
          // ) {
          //   data.telephone_primary =
          //     (data.telephone_primary.toString().length === 10 ? '0' : '44') +
          //     values.telephone_primary;
          // }
          // if (data.telephone_secondary) {
          //   if (
          //     !data.telephone_secondary.toString().startsWith('0') &&
          //     !data.telephone_secondary.toString().startsWith('44')
          //   ) {
          //     data.telephone_secondary =
          //       (data.telephone_secondary.toString().length === 10
          //         ? '0'
          //         : '44') + values.telephone_secondary;
          //   }
          // }
          delete data['caseChanger'];
          delete data['newSource'];
          const finalValues =
            values.submitButton === 'submit' ? { ...data, save: true } : data;
          delete finalValues['submitButton'];
          if (Object.keys(contactDetail).length > 0) {
            dispatch(
              updateContact({
                _id: contactDetail._id,
                contact: finalValues,
              }),
            );
          }
        }}
      >
        {({
          handleChange,

          setFieldValue,
          values,
          getFieldProps,
        }) => (
          <Form>
            <Row>
              <Col>
                <h5 className="text_primary">Edit Contact :</h5>
              </Col>
              <Col className="text-end">
                <FormGroup className="d-inline-block">
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Auto Sentence Case"
                      name="caseChanger"
                      className="justify-content-end m-0"
                      checked={values.caseChanger}
                      onChange={e => {
                        setFieldValue('caseChanger', e.target.checked);
                      }}
                    />
                  </FormGroup>
                </FormGroup>
              </Col>
            </Row>

            <div className="main_edit_contact_Wrap bg_white_box p-3 mb-3">
              <div className="progress_wrap" id="progress_wrap">
                <BorderLinearProgress
                  variant="determinate"
                  value={calculateProgress(values)}
                />
                <span className="progress_value">
                  {Math.ceil(calculateProgress(values))}%
                </span>
              </div>
              {showCmpName !== '' && contactDetail?.account_id !== '' && (
                <div className="contact_alert_Wrap my-3">
                  <>
                    <h5>This contact is under the account:</h5>

                    <Link
                      to={`/contact/account/add-account/${values.account_id}`}
                    >
                      <h3 className="text_decoration text-white ">
                        {showCmpName}
                      </h3>
                    </Link>
                  </>
                  {userPermissionDetail?.admin && (
                    <>
                      {showCmpName && (
                        <span
                          className="remove"
                          onClick={() => {
                            OpenClose();
                          }}
                        >
                          Remove From Account
                          <img
                            src={CloseIconS}
                            alt="Remove Icon"
                            className="ps-2"
                          />
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
              {showCmpName === '' && contactDetail?.account_id !== null && (
                <div className="contact_alert_Wrap my-3">
                  <span>
                    Please save this contact to complete the removal process
                  </span>
                </div>
              )}
              {/* </div> */}
              {userPermissionDetail?.contacts && (
                <div className="assign_to_contact_wrap py-3">
                  <Row className="align-items-center justify-content-center">
                    <Col xs={2}>
                      <h3 className="m-0">Assign to Account:</h3>
                    </Col>
                    <Col xs={4}>
                      <div className="d-flex align-items-start position-relative mb-2">
                        <FormGroup className="w-100">
                          <FormControl fullWidth className="large_input">
                            <TextField
                              type="text"
                              variant="outlined"
                              className="select_with_search"
                              value={lookUp}
                              onChange={e => {
                                if (e.target.value !== '') {
                                  setLookUpErrorMsg('');
                                }
                                setLookUp(e.target.value);
                              }}
                            />
                          </FormControl>
                        </FormGroup>
                        <Button
                          className="btn_border ms-3"
                          onClick={() => {
                            if (lookUp === '') {
                              setLookUpErrorMsg(
                                'Please Enter an account number for lookup',
                              );
                            } else if (lookUp?.length < 3) {
                              setLookUpErrorMsg(
                                'Minimum 3 characters required',
                              );
                            } else {
                              setLookUpErrorMsg('');
                              dispatch(
                                getAccountListData({
                                  start: 0,
                                  limit: 50,
                                  group: true,
                                  is_active: true,
                                  name: lookUp,
                                }),
                              );
                              showContentHandle(true);
                            }
                          }}
                        >
                          Lookup
                        </Button>
                        {loopUpErrorMsg !== '' && (
                          <span className="d-block text-danger text_small lookup_error">
                            {loopUpErrorMsg}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>
                  {accountList &&
                  accountList?.active?.length > 0 &&
                  showContent ? (
                    <FormControl fullWidth className="main_input_wrap">
                      <Row className="justify-content-center mt-3">
                        <Col xs={6}>
                          <div className="lookup_data_wrap">
                            <div className="lookup_data_inner">
                              {accountList?.active
                                ?.flatMap(i => i.data)
                                ?.map((data, index) => (
                                  <button
                                    className="d-block lookup_data"
                                    type="button"
                                    onClick={() => {
                                      setFieldValue('account_id', data._id);
                                      setFieldValue('type', data?.type);
                                      setFieldValue('company_name', data?.name);
                                      setFieldValue(
                                        'post_code',
                                        data?.postcode,
                                      );
                                    }}
                                    key={index}
                                    name="account_id"
                                    value={data._id}
                                  >
                                    {data?.name}
                                  </button>
                                ))}
                              <button
                                type="button"
                                onClick={() => {
                                  setLookUp('');
                                  dispatch(setAccountList([]));
                                }}
                                className="btn_primary small"
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </FormControl>
                  ) : (
                    ''
                  )}
                </div>
              )}
              <div className="edit_contact_box">
                <Row>
                  <Col xs={6}>
                    <div className="edit_contact_inner">
                      <h3>Postcode</h3>
                      <p>
                        Please enter the postcode below and click "Lookup"{' '}
                        <span className="d-block text_light">
                          (This costs 2p per lookup)
                        </span>
                      </p>
                      <div className="d-flex align-items-center max_75">
                        <FormGroup className="w-100">
                          <FormControl fullWidth className="large_input">
                            <TextField
                              id="Postcode"
                              variant="outlined"
                              className="input_wrap"
                              placeholder="0"
                              value={values.post_code}
                              onChange={e =>
                                handleChange('post_code')(e.target.value)
                              }
                            />
                          </FormControl>
                        </FormGroup>
                        <Button
                          className="btn_border ms-3"
                          onClick={() => {
                            setLookResult(true);
                            dispatch(
                              getLookupPostcode({
                                postcode: values?.post_code,
                                source: 'ideal',
                                venue_id: contactDetail?.primary_event_location,
                              }),
                            );
                          }}
                        >
                          Lookup
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <h3>Results</h3>
                    {!lookResult || lookupPostcodeList?.length == 0 ? (
                      <div className="edit_contact_inner">
                        <span className="bg_gray_box text_light px-3 py-2 d-block">
                          Results will display here
                        </span>
                      </div>
                    ) : (
                      <>
                        {lookupPostcodeList?.data?.length > 0 &&
                        Object?.entries(lookupPostcodeList)?.length > 0 ? (
                          <>
                            <div className="lookup_data_wrap">
                              <div className="lookup_data_inner">
                                {lookupPostcodeList?.data
                                  ?.slice()
                                  ?.sort((a, b) => {
                                    if (!b?.company && !a?.company) {
                                      // Check if both names are purely numeric
                                      const numA = parseInt(
                                        (a?.company ? a?.company : a?.address1)
                                          .match(/\d/g)
                                          ?.join(''),
                                      );
                                      const numB = parseInt(
                                        (b?.company ? b?.company : b?.address1)
                                          .match(/\d/g)
                                          ?.join(''),
                                      );
                                      const isNumericA = !isNaN(numA);
                                      const isNumericB = !isNaN(numB);
                                      if (isNumericA && isNumericB)
                                        // If both names are purely numeric, compare numerically
                                        return numA - numB;
                                      else if (isNumericA && !isNumericB)
                                        // If one name is numeric and the other is not, numeric comes first
                                        return -1;
                                      else if (!isNumericA && isNumericB)
                                        // If one name is numeric and the other is not, numeric comes first
                                        return 1;
                                      else if (!isNumericA && !isNumericB)
                                        return a?.address1?.localeCompare(
                                          b?.address1,
                                        );
                                    } else
                                      return a?.company?.localeCompare(
                                        b?.company,
                                      );
                                  })
                                  ?.map((data, index) => {
                                    return (
                                      <button
                                        type="button"
                                        key={index}
                                        className="d-block lookup_data"
                                        onClick={() => {
                                          showContentHandle();

                                          setFieldValue(
                                            'address_line_1',
                                            data?.address1,
                                          );
                                          setFieldValue(
                                            'address_line_2',
                                            data?.address2,
                                          );
                                          setFieldValue(
                                            'address_line_3',
                                            data?.address3,
                                          );
                                          setFieldValue('city', data?.city);
                                          setFieldValue(
                                            'country',
                                            data?.county,
                                          );
                                          setFieldValue(
                                            'company_name',
                                            data?.company,
                                          );
                                          setFieldValue(
                                            'type',
                                            data?.company !== '' ? 2 : 3,
                                          );
                                          setFieldValue(
                                            'primary_event_location',
                                            data?.location1,
                                          );
                                        }}
                                      >
                                        <strong>
                                          {data?.company
                                            ? data.company + ', '
                                            : ''}
                                        </strong>
                                        {data?.address1
                                          ? data.address1 + ', '
                                          : ''}
                                        {data?.address2
                                          ? data.address2 + ', '
                                          : ''}
                                        {data?.address3
                                          ? data.address3 + ', '
                                          : ''}
                                        {data?.city}
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="edit_contact_inner lookup_data_wrap">
                              <span className="text_primary">
                                {lookupPostcodeList?.msg}
                              </span>
                              <span
                                className="cursor-pointer icon_hover"
                                onClick={() => {
                                  showContentHandle();
                                }}
                              >
                                <img src={CheckIcon} alt="checkIcon" />
                                Enter address manually?
                              </span>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
              </div>
              <div className="edit_contact_box">
                <Row>
                  <Col xs={6}>
                    <div className="edit_contact_inner">
                      <h3>Contact Type</h3>
                      <p>
                        If this contact is representing a company please select
                        "Company" from the list below
                      </p>
                      <FormGroup className="max_33 select_big">
                        <FormControl fullWidth className="input_wrap">
                          <Select
                            labelId="Method-label"
                            id="Method-select"
                            className="select_wrap"
                            name="type"
                            value={values.type}
                            {...getFieldProps('type')}
                          >
                            <MenuItem value="select" disabled>
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
                      </FormGroup>
                    </div>
                  </Col>
                  {values.type !== 3 && (
                    <Col xs={6}>
                      <div className="edit_contact_inner">
                        <h3>Business Name / Party Booking Name</h3>
                        <FormGroup className="max_33">
                          <FormControl fullWidth className="large_input">
                            <TextField
                              id="BusinessName"
                              type="text"
                              variant="outlined"
                              className="input_wrap"
                              name="company_name"
                              value={values.company_name}
                              onChange={e => {
                                handleChange('company_name')(e.target.value);
                              }}
                            />
                          </FormControl>
                        </FormGroup>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>

              <div className="edit_contact_box pb-0">
                <Row>
                  <Col xs={6}>
                    <div className="edit_contact_inner">
                      <div className="contact_detail mb-3">
                        <h3 className="mb-3">Contact Details</h3>
                        <ul>
                          <li className="align-items-start">
                            <label className="mt-2 text_small fw_500">
                              Source<sup className="text_primary">*</sup>
                            </label>
                            <FormGroup>
                              <FormControl>
                                <Autocomplete
                                  id="grouped-demo"
                                  fullWidth
                                  className="select_with_search"
                                  value={values?.source}
                                  options={newobj}
                                  groupBy={options => options.title}
                                  getOptionLabel={options => options.label}
                                  renderInput={params => (
                                    <TextField {...params} />
                                  )}
                                  onChange={(e, newValue) => {
                                    setFieldValue('source', newValue);
                                  }}
                                />
                                <span className="d-block text-danger text_small">
                                  <ErrorMessage name="source" />
                                </span>
                                {values?.source?.value === 'other' && (
                                  <>
                                    <TextField
                                      id="other"
                                      type="text"
                                      variant="outlined"
                                      value={values.newSource}
                                      className="input_wrap"
                                      onChange={e => {
                                        handleChange('newSource')(
                                          e?.target?.value,
                                        );
                                      }}
                                    />
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="newSource" />
                                    </span>
                                  </>
                                )}
                              </FormControl>
                              <span className="text_small d-inline-block mt-1">
                                How did you hear about Best Parties Ever?
                              </span>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">Title</label>
                            <FormGroup>
                              <FormControl fullWidth className="input_wrap">
                                <Select
                                  defaultValue="Please Select"
                                  id="grouped-select"
                                  className="select_wrap "
                                  value={values.title}
                                  onChange={e => {
                                    handleChange('title')(e.target.value);
                                  }}
                                >
                                  <MenuItem value="Please Select">
                                    Please Select (name)
                                  </MenuItem>
                                  <MenuItem value="Mr">Mr</MenuItem>
                                  <MenuItem value="Mrs">Mrs</MenuItem>
                                  <MenuItem value="Ms">Ms</MenuItem>
                                  <MenuItem value="Miss">Miss</MenuItem>
                                  <MenuItem value="Dr">Dr</MenuItem>
                                </Select>
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="title" />
                              </span>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              First Name<sup className="text_primary">*</sup>
                            </label>
                            <FormGroup>
                              <FormControl fullWidth>
                                <TextField
                                  id="FirstName"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  value={
                                    values.caseChanger
                                      ? capitalizeSentence(values.first_name)
                                      : values.first_name
                                  }
                                  onChange={e => {
                                    handleChange('first_name')(e.target.value);
                                  }}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="first_name" />
                              </span>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Surname<sup className="text_primary">*</sup>
                            </label>
                            <FormGroup>
                              <FormControl fullWidth>
                                <TextField
                                  id="Surname"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  value={
                                    values.caseChanger
                                      ? capitalizeSentence(values.surname)
                                      : values.surname
                                  }
                                  onChange={e => {
                                    handleChange('surname')(e.target.value);
                                  }}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="surname" />
                              </span>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Email (primary)
                              <sup className="text_primary">*</sup>
                            </label>
                            <div className="input_with_img">
                              <FormGroup className="w-100">
                                <FormControl fullWidth>
                                  <TextField
                                    id="Email"
                                    type="text"
                                    variant="outlined"
                                    className="input_wrap w-100"
                                    name="email_primary"
                                    value={values?.email_primary}
                                    onChange={e => {
                                      handleChange('email_primary')(
                                        e.target.value,
                                      );
                                      setEmailForLookupState(e.target.value);
                                      emailChange(
                                        'email_primary',
                                        e?.target?.value,
                                      );
                                    }}
                                    aria-describedby={id}
                                    onClick={handleClick}
                                  />
                                  {duplicateEmailList?.length > 0 ? (
                                    <>
                                      <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                          vertical: 'top',
                                          horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                        }}
                                      >
                                        The email address you entered already
                                        exists:
                                        <CloseIcon
                                          className="cursor-pointer"
                                          onClick={() => setAnchorEl(null)}
                                        />
                                        {duplicateEmailList?.length > 0 &&
                                          duplicateEmailList?.map(
                                            (item, index) => {
                                              return (
                                                <Typography sx={{ p: 1 }}>
                                                  <Link
                                                    className="d-block"
                                                    to={`/contact/edit-contact/${item._id}`}
                                                    target="_blank"
                                                  >
                                                    {item?.first_name +
                                                      ' ' +
                                                      item?.surname +
                                                      ' ' +
                                                      '(' +
                                                      item?.email_primary +
                                                      ')'}
                                                  </Link>
                                                </Typography>
                                              );
                                            },
                                          )}
                                      </Popover>
                                    </>
                                  ) : (
                                    ''
                                  )}
                                </FormControl>
                                <span className="d-block text-danger text_small">
                                  <ErrorMessage name="email_primary" />
                                </span>
                              </FormGroup>
                              {values?.email_primary &&
                                (duplicateEmailList?.length > 0 ? (
                                  <img
                                    style={{ width: '20px' }}
                                    src={CrossIcon}
                                    alt="crossIcon"
                                    className="input_img"
                                  />
                                ) : (
                                  <img
                                    style={{ width: '20px' }}
                                    src={CheckIcon}
                                    alt="checkIcon"
                                  />
                                ))}
                            </div>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Email (secondary)
                            </label>
                            <div className="input_with_img">
                              <FormGroup>
                                <FormControl fullWidth>
                                  <TextField
                                    id="Email2"
                                    type="text"
                                    variant="outlined"
                                    className="input_wrap"
                                    name="email_secondary"
                                    value={values?.email_secondary}
                                    placeholder="Enter your email"
                                    // {...getFieldProps('email_secondary')}
                                    onChange={e => {
                                      handleChange('email_secondary')(
                                        e.target.value,
                                      );
                                      emailChange(
                                        'email_secondary',
                                        e.target.value,
                                      );
                                    }}
                                    aria-describedby={idSecondary}
                                    onClick={handleClickSecondary}
                                  />
                                  {duplicateEmailSecondaryList?.length > 0 ? (
                                    <>
                                      <Popover
                                        id={idSecondary}
                                        open={openSecondary}
                                        anchorEl={anchorSecondary}
                                        onClose={handleCloseSecondary}
                                        anchorOrigin={{
                                          vertical: 'top',
                                          horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                        }}
                                      >
                                        The email address you entered already
                                        exists:
                                        <CloseIcon
                                          className="cursor-pointer"
                                          onClick={() =>
                                            setAnchorSecondary(null)
                                          }
                                        />
                                        {duplicateEmailSecondaryList?.length >
                                          0 &&
                                          duplicateEmailSecondaryList?.map(
                                            (item, index) => {
                                              return (
                                                <Typography sx={{ p: 1 }}>
                                                  <Link
                                                    className="d-block"
                                                    to={`/contact/edit-contact/${item._id}`}
                                                    target="_blank"
                                                  >
                                                    {item?.first_name +
                                                      ' ' +
                                                      item?.surname +
                                                      ' ' +
                                                      '(' +
                                                      item?.email_primary +
                                                      ')'}
                                                  </Link>
                                                </Typography>
                                              );
                                            },
                                          )}
                                      </Popover>
                                    </>
                                  ) : (
                                    ''
                                  )}
                                </FormControl>
                                <span className="d-block text-danger text_small">
                                  <ErrorMessage name="email_secondary" />
                                </span>
                              </FormGroup>

                              {values?.email_secondary &&
                                (duplicateEmailSecondaryList?.length > 0 ? (
                                  <img
                                    style={{ width: '20px' }}
                                    src={CrossIcon}
                                    alt="crossIcon"
                                    className="input_img"
                                  />
                                ) : (
                                  <img
                                    style={{ width: '20px' }}
                                    src={CheckIcon}
                                    alt="checkIcon"
                                  />
                                ))}
                            </div>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Primary Telephone
                              <sup className="text_primary">*</sup>
                            </label>
                            <FormGroup>
                              <FormControl fullWidth>
                                <TextField
                                  id="PrimaryTelephone"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter your Telephone Number"
                                  {...getFieldProps('telephone_primary')}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="telephone_primary" />
                              </span>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Alternate Telephone (Mobile)
                            </label>
                            <FormGroup>
                              <FormControl fullWidth>
                                <TextField
                                  id="PrimaryTelephone"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter Alternate Telephone Number"
                                  {...getFieldProps('telephone_secondary')}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="telephone_secondary" />
                              </span>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">Fax</label>
                            <FormGroup>
                              <FormControl fullWidth>
                                <TextField
                                  id="Fax"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter your Fax number"
                                  {...getFieldProps('fax')}
                                />
                              </FormControl>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Marketing Opt In
                            </label>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                label=""
                                className="m-0"
                                checked={values.marketing_opt_in}
                                onChange={e => {
                                  setFieldValue(
                                    'marketing_opt_in',
                                    e.target.checked,
                                  );
                                }}
                              />
                            </FormGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="internal_information">
                        <h3 className="mb-3">Internal Information</h3>
                        <ul>
                          <li>
                            <label className="text_small fw_500">
                              Full Opt Out
                            </label>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Please make a note below as to why this person is opting out"
                                className="m-0"
                                checked={values.full_opt_out}
                                onChange={e => {
                                  setFieldValue(
                                    'full_opt_out',
                                    e.target.checked,
                                  );
                                }}
                              />
                            </FormGroup>
                          </li>
                          <li className="align-items-start">
                            <label className="text_small fw_500">Notes</label>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="Notes"
                                  type="text"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter your Notes"
                                  value={
                                    values.caseChanger
                                      ? capitalizeSentence(values.notes)
                                      : values.notes
                                  }
                                  onChange={e => {
                                    handleChange('notes')(e.target.value);
                                  }}
                                />
                              </FormControl>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Auto Invoice Customer
                            </label>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Untick this box if this customer should not be invoiced automatically 10 weeks before their party date"
                                className="m-0"
                                checked={values.auto_invoice_customer}
                                onChange={e => {
                                  setFieldValue(
                                    'auto_invoice_customer',
                                    e.target.checked,
                                  );
                                }}
                              />
                            </FormGroup>
                          </li>

                          <li>
                            <label className="text_small fw_500">Active</label>
                            <FormGroup>
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="Active-label"
                                  defaultValue="activeYes"
                                  name="Active-group"
                                  className="custom_radio"
                                  value={values.is_active}
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
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Is Exclusive
                            </label>
                            <FormGroup>
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="Exclusive-label"
                                  defaultValue="activeYes"
                                  name="Exclusive-group"
                                  value={values.is_exclusive}
                                  onChange={e => {
                                    setFieldValue(
                                      'full_opt_out',
                                      !values.is_exclusive,
                                    );

                                    setFieldValue(
                                      'is_exclusive',
                                      !values.is_exclusive,
                                    );
                                  }}
                                  className="custom_radio"
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
                          </li>

                          <li>
                            <label className="text_small fw_500">
                              Website Security Code
                            </label>
                            <div className="right_content">
                              <span>{values?.website_security_code}</span>
                            </div>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              User has set password
                            </label>
                            <div className="right_content">
                              <span className="text_light">
                                {values?.user_has_set_password ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </li>
                          <li className="align-items-start">
                            <label className="text_small fw_500">
                              Password reset link
                            </label>
                            <div className="right_content">
                              <Link
                                to={values?.password_reset_link}
                                name="password_reset_link"
                                value={values.password_reset_link}
                                className="text_decoration text_small"
                                target="_blank"
                              >
                                {values?.password_reset_link}
                              </Link>
                            </div>
                          </li>
                          <li className="align-items-start">
                            <label className="text_small fw_500">Info</label>
                            <div className="right_content">
                              {contactDetail?.web_registered && (
                                <p className="m-0">ONLINE REGISTRATION</p>
                              )}
                              <p className="m-0">{values?.info}</p>
                            </div>
                          </li>
                          {userPermissionDetail?.admin && (
                            <li>
                              <label className="text_small fw_500">
                                Deleted
                              </label>
                              <FormGroup>
                                <FormControl>
                                  <RadioGroup
                                    row
                                    aria-labelledby="Deleted-label"
                                    defaultValue="activeYes"
                                    name="Deleted-group"
                                    className="custom_radio"
                                    value={values.deleted}
                                    onChange={() =>
                                      setFieldValue('deleted', !values.deleted)
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
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="edit_contact_inner">
                      <div className="address_details mb-3">
                        <h3 className="mb-3">Address Details</h3>
                        <ul>
                          <li className="align-items-start">
                            <label className="text_small fw_500">
                              Address Line 1
                              <sup className="text_primary">*</sup>
                            </label>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="Address1"
                                  type="text"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Add"
                                  value={
                                    values.caseChanger
                                      ? capitalizeSentence(
                                          values.address_line_1,
                                        )
                                      : values.address_line_1
                                  }
                                  onChange={e => {
                                    handleChange('address_line_1')(
                                      e.target.value,
                                    );
                                  }}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="address_line_1" />
                              </span>
                            </FormGroup>
                          </li>
                          <li className="align-items-start">
                            <label className="text_small fw_500">
                              Address Line 2
                            </label>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="Address2"
                                  type="text"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Add"
                                  value={
                                    values.caseChanger
                                      ? capitalizeSentence(
                                          values.address_line_2,
                                        )
                                      : values.address_line_2
                                  }
                                  onChange={e => {
                                    handleChange('address_line_2')(
                                      e.target.value,
                                    );
                                  }}
                                />
                              </FormControl>
                            </FormGroup>
                          </li>
                          <li className="align-items-start">
                            <label className="text_small fw_500">
                              Address Line 3
                            </label>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="Address2"
                                  type="text"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Add"
                                  value={
                                    values.caseChanger
                                      ? capitalizeSentence(
                                          values.address_line_3,
                                        )
                                      : values.address_line_3
                                  }
                                  onChange={e => {
                                    handleChange('address_line_3')(
                                      e.target.value,
                                    );
                                  }}
                                />
                              </FormControl>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              City<sup className="text_primary">*</sup>
                            </label>
                            <FormGroup>
                              <FormControl fullWidth>
                                <TextField
                                  id="City"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter your City"
                                  value={
                                    values.caseChanger
                                      ? capitalizeSentence(values.city)
                                      : values.city
                                  }
                                  onChange={e => {
                                    handleChange('city')(e.target.value);
                                  }}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="city" />
                              </span>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              County<sup className="text_primary">*</sup>
                            </label>
                            <FormGroup>
                              <FormControl fullWidth>
                                <TextField
                                  id="County"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter your County"
                                  value={
                                    values.caseChanger
                                      ? capitalizeSentence(values.country)
                                      : values.country
                                  }
                                  onChange={e => {
                                    handleChange('country')(e.target.value);
                                  }}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="country" />
                              </span>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500 text_light">
                              Postcode
                            </label>
                            <div className="right_content">
                              <span className="text_light text_small fw_400">
                                This is entered at the top of this page
                              </span>
                            </div>
                          </li>
                          <li className="align-items-start">
                            <label className="text_small fw_500">
                              Primary Event Location
                              <sup className="text_primary">*</sup>
                            </label>
                            <FormGroup>
                              <FormControl fullWidth className="input_wrap">
                                <Select
                                  defaultValue="Please Select"
                                  id="grouped-select"
                                  name="primary_event_location"
                                  className="select_wrap "
                                  value={values?.primary_event_location}
                                  onChange={handleChange}
                                >
                                  <MenuItem value="Select" disabled>
                                    Select
                                  </MenuItem>
                                  {activeVenueList?.map((venue, index) => (
                                    <MenuItem value={venue?._id} key={index}>
                                      {venue?.internal_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="primary_event_location" />
                              </span>
                              <span className="text_small d-inline-block mt-1 text_primary">
                                This is Important!
                              </span>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Secondary Location
                            </label>
                            <FormGroup>
                              <FormControl fullWidth className="input_wrap">
                                <Select
                                  defaultValue="Please Select"
                                  id="Secondary-Location-select"
                                  className="select_wrap "
                                  value={values?.secondary_event_location}
                                  {...getFieldProps('secondary_event_location')}
                                >
                                  {activeVenueList.map(venue => (
                                    <MenuItem
                                      value={venue?._id}
                                      key={venue?._id}
                                    >
                                      {venue?.internal_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </FormGroup>
                          </li>
                          <li>
                            <label className="text_small fw_500">
                              Tertiary Location
                            </label>
                            <FormGroup>
                              <FormControl fullWidth className="input_wrap">
                                <Select
                                  defaultValue="Please Select"
                                  id="Tertiary-Location-select"
                                  className="select_wrap "
                                  value={values?.tertiary_event_location}
                                  {...getFieldProps('tertiary_event_location')}
                                >
                                  {activeVenueList.map(venue => (
                                    <MenuItem
                                      value={venue?._id}
                                      key={venue?._id}
                                    >
                                      {venue?.internal_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </FormGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="new_enquiry">
                        <h3 className="mb-3">New Enquiry?</h3>
                        <p>
                          You will be able to specify the venue and dates on the
                          next screen.
                        </p>
                        <ul>
                          <li>
                            <label className="text_small fw_500">
                              Approx Places:
                              <sup className="text_primary">*</sup>
                            </label>
                            <FormGroup>
                              <FormControl fullWidth>
                                <TextField
                                  id="ApproxPlaces"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  onKeyDown={e => {
                                    numberRegex(e);
                                  }}
                                  inputProps={{
                                    min: 0,
                                    step: 'any',
                                  }}
                                  variant="outlined"
                                  className="input_wrap"
                                  // placeholder="Enter"
                                  {...getFieldProps('approx_places')}
                                  onBlurCapture={() => {
                                    setFieldValue(
                                      'approx_places',
                                      Number(values.approx_places),
                                    );
                                  }}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="approx_places" />
                              </span>
                            </FormGroup>
                          </li>
                        </ul>
                        <ul className="d-flex align-items-center justify-content-between mt-3">
                          <li>
                            <Button
                              className="btn_primary small"
                              type="submit"
                              value="submit"
                              onClick={e => {
                                handleChange('submitButton')(e.target.value);
                                setSaveName('submit');
                                OpenEmailLookup();
                              }}
                            >
                              Save and Add Enquiry
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="btn_border small"
                              type="submit"
                              value="save"
                              onClick={e => {
                                handleChange('submitButton')(e.target.value);
                                setSaveName('save');
                                OpenEmailLookup();
                              }}
                            >
                              Save Contact Without Enquiry
                            </Button>
                          </li>
                        </ul>
                      </div>
                      {contactDetail?.is_have_dup ? (
                        <div className="new_enquiry">
                          <h3 className="mb-3">Merge duplicate contact?</h3>
                          <p>
                            All duplicate contacts will be erased, and their
                            bookings and emails will be combined with the latest
                            one.
                          </p>
                          {/* <ul>
                          <li>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Email Merge"
                                className="m-0"
                                checked={mergeEmailCheck}
                                onChange={e => {
                                  setMergeEmailCheck(e.target.checked);
                                }}
                              />
                            </FormGroup>
                          </li>
                        </ul> */}
                          <ul className="d-flex align-items-center justify-content-between mt-3">
                            <li>
                              <span
                                className="btn_primary small"
                                type="submit"
                                value="submit"
                                onClick={() => setMergeEmailPopup(true)}
                              >
                                Merge
                              </span>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="contact_booking_table_wrap">
              <div className="previour_email_wrap">
                <div className="parties_table_Wrap">
                  <h4 className="fw_600 m-0">Bookings</h4>
                </div>
                <div className="table_main_Wrapper mb-3">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Event</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Booking Ref</TableCell>
                          <TableCell>Enquired</TableCell>
                          <TableCell>Provisional</TableCell>
                          <TableCell>Confirmed</TableCell>
                          <TableCell>Date Booked</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>View</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contactDetail?.bookings?.map(element => {
                          const textDecoration =
                            element?.is_cancelled ||
                            ((Boolean(element?.is_payment) ||
                              Boolean(element?.is_invoice)) &&
                              !element?.confirmed_places > 0 &&
                              !element?.provisional_places > 0)
                              ? 'line-through'
                              : 'none';
                          const backgroundColor =
                            (element?.is_cancelled && element?.complained) ||
                            (element?.is_cancelled && element?.is_downgraded)
                              ? '#ffdddd'
                              : 'white';

                          return (
                            <TableRow
                              key={element?._id}
                              style={{ textDecoration, backgroundColor }}
                            >
                              <TableCell
                                style={{ textDecoration, backgroundColor }}
                              >
                                <span
                                  className="date_wrapper"
                                  style={{ textDecoration, backgroundColor }}
                                >
                                  <Link to={`/edit-bookings/${element?._id}`}>
                                    {element?.event}
                                  </Link>
                                </span>
                              </TableCell>
                              <TableCell
                                style={{ textDecoration, backgroundColor }}
                              >
                                {element?.date
                                  ? moment(element?.date).format(
                                      'dddd Do MMMM YYYY',
                                    )
                                  : ''}
                              </TableCell>
                              <TableCell
                                style={{ textDecoration, backgroundColor }}
                              >
                                {element?.booking_ref}
                              </TableCell>
                              <TableCell
                                style={{ textDecoration, backgroundColor }}
                              >
                                {element?.enquired}
                              </TableCell>
                              <TableCell
                                style={{ textDecoration, backgroundColor }}
                              >
                                {element?.provisional_places}
                              </TableCell>
                              <TableCell
                                style={{ textDecoration, backgroundColor }}
                              >
                                {element?.confirmed_places}
                              </TableCell>
                              <TableCell
                                style={{ textDecoration, backgroundColor }}
                              >
                                <span
                                  className="date_wrapper"
                                  style={{ textDecoration, backgroundColor }}
                                >
                                  {element?.date_booked
                                    ? moment(element?.date_booked).format(
                                        'dddd Do MMMM YYYY',
                                      )
                                    : ''}
                                </span>
                              </TableCell>
                              <TableCell
                                style={{ textDecoration, backgroundColor }}
                              >
                                Booking -{' '}
                                {element?.is_cancelled ||
                                ((Boolean(element?.is_payment) ||
                                  Boolean(element?.is_invoice)) &&
                                  !element?.confirmed_places > 0 &&
                                  !element?.provisional_places > 0) ? (
                                  <span>cancelled</span>
                                ) : (
                                  ''
                                )}
                                {element?.is_downgraded && (
                                  <button className="rounded bg-primary border-0 text-white ms-2">
                                    DOWNGRADED
                                  </button>
                                )}
                                {element?.complained && (
                                  <button
                                    className="rounded bg-warning
                                  border-0 text-white ms-2"
                                  >
                                    COMPLAINED
                                  </button>
                                )}
                              </TableCell>
                              <TableCell style={{ backgroundColor }}>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      to={`/edit-bookings/${element?._id}`}
                                      className="view_btn"
                                    >
                                      <img src={EyeIcon} alt="View icon" />
                                    </Link>
                                  </li>
                                </ul>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <div className="contact_booking_table_wrap">
        <div className="previour_email_wrap">
          <div className="parties_table_Wrap">
            <h4 className="fw_600 m-0">Enquiries</h4>
          </div>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Event</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Booking Ref</TableCell>
                    <TableCell>Enquired</TableCell>
                    <TableCell>Provisional</TableCell>
                    <TableCell>Confirmed</TableCell>
                    <TableCell>Date Booked</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contactDetail?.enquiries?.map(item => {
                    const textDecoration = item?.is_cancelled
                      ? 'line-through'
                      : 'none';
                    const backgroundColor =
                      item?.is_cancelled || item?.complained
                        ? '#ffdddd'
                        : 'white';

                    return (
                      <>
                        {!item?.is_downgraded && (
                          <TableRow key={item?._id}>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              <span
                                className="date_wrapper"
                                style={{ textDecoration, backgroundColor }}
                              >
                                <Link to={`/edit-enquiries/${item?._id}`}>
                                  {item?.event}
                                </Link>
                              </span>
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.date ? (
                                item?.is_book ? (
                                  <span className="text_primary">
                                    {moment(item?.date).format(
                                      'dddd Do MMMM YYYY',
                                    )}
                                  </span>
                                ) : (
                                  moment(item?.date).format('dddd Do MMMM YYYY')
                                )
                              ) : (
                                'No Date Given'
                              )}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.booking_ref}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.enquired}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.provisional_places}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.confirmed_places}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              <span
                                className="date_wrapper"
                                style={{ textDecoration, backgroundColor }}
                              >
                                {item?.date_booked
                                  ? moment(item?.date_booked).format(
                                      'dddd Do MMMM YYYY',
                                    )
                                  : ''}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              <span className="bedge bedge_gray">Enquiry</span>
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              <ul className="action_wrap">
                                <li>
                                  <Link
                                    to={`/edit-enquiries/${item?._id}`}
                                    className="view_btn"
                                  >
                                    <img src={EyeIcon} alt="View icon" />
                                  </Link>
                                </li>
                              </ul>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                  {checkedDowngraded?.length > 0 && (
                    <h3>DOWNGRADED FROM THIS DATE</h3>
                  )}
                  {contactDetail?.enquiries?.map(item => {
                    const isCancelled = item?.is_cancelled;
                    const isComplained = item?.complained;

                    const textDecoration = isCancelled
                      ? 'line-through'
                      : 'none';
                    const backgroundColor =
                      isCancelled || isComplained ? 'red' : 'white';

                    return (
                      <>
                        {item?.is_downgraded && (
                          <TableRow key={item?._id}>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.event}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.date ? (
                                item?.is_book ? (
                                  <span className="text_primary">
                                    {moment(item?.date).format(
                                      'dddd Do MMMM YYYY',
                                    )}
                                  </span>
                                ) : (
                                  moment(item?.date).format('dddd Do MMMM YYYY')
                                )
                              ) : (
                                'No Date Given'
                              )}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.booking_ref}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.enquired}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.provisional_places}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.confirmed_places}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              {item?.date_booked
                                ? moment(item?.date_booked).format(
                                    'dddd Do MMMM YYYY',
                                  )
                                : ''}
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              <span className="bedge bedge_gray">Enquiry</span>
                            </TableCell>
                            <TableCell
                              style={{ textDecoration, backgroundColor }}
                            >
                              <ul className="action_wrap">
                                <li>
                                  <Link
                                    to={`/edit-bookings/${item?._id}`}
                                    className="view_btn"
                                  >
                                    <img src={EyeIcon} alt="View icon" />
                                  </Link>
                                </li>
                              </ul>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      <Dialog
        aria-labelledby="CancelBooking-title"
        open={emailForLookup}
        className="delete_popup max_500"
      >
        <BootstrapDialogTitle
          id="CancelBooking-title"
          onClose={CloseEmailLookup}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="delete_popup_wrap py-3">
              <p className="mb-3 mt-2">
                A contact already exists with the email: {emailForLookupState} -{' '}
                <Link
                  to={`/contact?email=${emailForLookupState}`}
                  state={{ email: emailForLookupState }}
                  target="_blank"
                >
                  Lookup Email
                </Link>
              </p>
              <ul className="d-flex align-items-center justify-content-center">
                <li>
                  <Button
                    className="btn_primary mx-2 px-3 py-1"
                    onClick={() => {
                      CloseEmailLookup();
                    }}
                  >
                    Ok
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        aria-labelledby="CancelBooking-title"
        open={removePopUp}
        className="delete_popup"
      >
        <BootstrapDialogTitle
          id="CancelBooking-title"
          onClose={ClosePopUp}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="delete_popup_wrap">
              <img src={TrashIcon} alt="Delete Icon" />
              <h2 className="mb-3">Are you sure ?</h2>
              <p>
                Are you sure you want to remove this contact from its account
              </p>
              <ul className="d-flex align-items-center justify-content-center">
                <li>
                  <Button className="btn_border mx-2" onClick={ClosePopUp}>
                    Cancel
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn_primary mx-2"
                    onClick={() => {
                      removeAccount();
                    }}
                  >
                    Remove
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        aria-labelledby="CancelBooking-title"
        open={mergeEmailPopup}
        className="delete_popup max_500"
      >
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="delete_popup_wrap py-3">
              <div>
                Do you want to merge the duplicate contacts into this contact?
              </div>
              <div className="form-group checkbox_wrap mb-2 text-center">
                <FormGroup style={{ alignItems: 'center', marginTop: '5px' }}>
                  <FormControlLabel
                    control={<Checkbox />}
                    name="price_rules"
                    label={'Accept!'}
                    checked={mergeEmailCheck}
                    onChange={e => {
                      setMergeEmailCheck(e.target.checked);
                    }}
                  />
                </FormGroup>
                <span className="d-block text-danger text_small">
                  {mergeEmailCheckValid
                    ? 'Please click here to accept it.'
                    : ''}
                </span>
              </div>
              <ul className="d-flex align-items-center justify-content-center mt-2">
                <li>
                  <Button
                    className="btn_border mx-2 px-3 py-1"
                    onClick={() => setMergeEmailPopup(false)}
                  >
                    Cancel
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn_primary mx-2 px-3 py-1"
                    onClick={handleMergeEmail}
                  >
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
