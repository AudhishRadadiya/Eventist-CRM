import { useCallback, useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import RefreshIcon from '../../Assets/Img/refresh.svg';
import { Button, Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorMessage, Form, Formik } from 'formik';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  dynamicMailTemplate,
  getAllAttachments,
  getEmailData,
  sendMail,
  setEmailDetail,
  setIsMailUpdated,
} from 'store/reducers/mail/mail.slice';
import { getTransactionalMailListData } from 'store/reducers/Admin/Mail/mail.slice';
import { ckEditorUploadImage } from 'store/reducers/UploadImage/uploadImage.slice';
import Cookies from 'js-cookie';
import Loader from 'Components/Common/Loader';
import PreviousSentEmails from './PreviousSentEmails';
import { getEmailListData } from 'store/reducers/Enquiry/LegacyNotes/enquiriesLegacyNotes.slice';
import moment from 'moment';
import {
  getContactData,
  setContactDetail,
} from 'store/reducers/Contact/contact.slice';
import {
  getEnquiriesData,
  setEnquirieDetail,
} from 'store/reducers/Enquiry/enquiries.slice';
import * as Yup from 'yup';
import { Dialog, DialogContent } from '@mui/material';
import { fromBase64Unicode } from 'utils/common';

let availability = {
  booking: 0,
  enquiry: 0,
  contact: 4,
  payment: 1,
  invoice: 5,
  eticket: 7,
};
export default function SendNewEmail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const comFrom = reportParamData.hasOwnProperty('booking')
    ? 'booking'
    : reportParamData.hasOwnProperty('enquiry')
    ? 'enquiry'
    : reportParamData.hasOwnProperty('payment')
    ? 'payment'
    : reportParamData.hasOwnProperty('invoiceData')
    ? 'invoice'
    : reportParamData.hasOwnProperty('eticket')
    ? 'eticket'
    : reportParamData.hasOwnProperty('contact')
    ? 'contact'
    : 'contact';
  const { search, state } = useLocation();

  const {
    emailDetail,
    isMailUpdated,
    mailListLoading,
    dynamicContent,
    getAllAttachmentsData,
  } = useSelector(({ mail }) => mail);

  const [dynamicAtts, setDynamicAtts] = useState([]);
  const [allAtts, setAllAtts] = useState([]);
  const [showConfirmEmailPopup, setShowConfirmEmailPopup] = useState({
    show: false,
    payload: {},
  });
  const setAtts = useCallback(
    x => {
      setDynamicAtts(dynamicContent?.atts);
      setAllAtts(getAllAttachmentsData?.atts);
    },
    [dynamicContent?.atts, getAllAttachmentsData?.atts],
  );

  useEffect(() => {
    setAtts();
  }, [setAtts]);

  const UserSessionCRMCookie = Cookies.get('UserSessionCRM');
  const UserSessionCRM = UserSessionCRMCookie
    ? JSON.parse(fromBase64Unicode(UserSessionCRMCookie))
    : null;
  const { activeTransactionalMailList, transactionMailLoading } = useSelector(
    ({ transactionalMail }) => transactionalMail,
  );
  // change api for email template refresh button

  const [spanValue, setSpanValue] = useState('bookings@bestpartiesever.com');
  const [defaultSender, setDefaultSender] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [acceptDifferentEmail, setAcceptDifferentEmail] = useState({
    checked: false,
    showError: false,
  });
  const emailInitialValues = {
    from_name: UserSessionCRM?.name,
    // from_email: 'bookings@bestpartiesever.com',
    from_email: UserSessionCRM ? UserSessionCRM?.email : '',
    send_from: 'bookings@bestpartiesever.com',
    to_email: '',
    send_blind_copy_to: '',
    email_template: '',
    subject: '',
    email_body: '',
    attachments: [],
    ref_type:
      reportParamData?.contact === 'true'
        ? 1
        : reportParamData?.enquiries === 'true'
        ? 2
        : reportParamData?.etickets_new === 'etickets_new'
        ? 5
        : reportParamData?.booking === 'true'
        ? 3
        : reportParamData?.type === 'invoice'
        ? 4
        : reportParamData?.type === 'credit'
        ? 4
        : reportParamData?.payment_receipt_deposit ===
            'payment_receipt_deposit' ||
          reportParamData?.payment_receipt_deposit === 'payment_receipt_balance'
        ? 7
        : '',
    ref_id: emailDetail?.ref_id
      ? emailDetail?.ref_id
      : state?.invoiceId
      ? state?.invoiceId
      : state?.eTicket_id
      ? state?.eTicket_id
      : id,
  };

  const [initialEmailContact, setInitialEmailContact] =
    useState(emailInitialValues);
  const { contactDetail, contactListLoading } = useSelector(
    ({ contact }) => contact,
  );
  const { enquirieDetail, enquirieLoading } = useSelector(
    ({ enquiries }) => enquiries,
  );

  useEffect(() => {
    if (id === state?.enq_id) {
      reportParamData?.contact === 'true'
        ? dispatch(getContactData(id))
        : dispatch(getEnquiriesData(id));

      dispatch(getTransactionalMailListData());
    } else if (reportParamData.booking || reportParamData.enquiries) {
      dispatch(getTransactionalMailListData());
    }
  }, [dispatch, id, search, state?.enq_id]);

  useEffect(() => {
    // Clear old data
    dispatch(setContactDetail({}));
    dispatch(setEnquirieDetail({}));
  }, []);

  useEffect(() => {
    if (state?.enq_id) {
      if (id !== state?.enq_id) {
        // dispatch(getEmailData(id));
        dispatch(getEmailData(state?.enq_id));
        setDefaultSender(false);
      } else {
        dispatch(setEmailDetail({}));
      }
    }
  }, [dispatch, id, state?.enq_id]);

  useEffect(() => {
    //Commet: in case future Previous send email table - show only if send invoice / creadit mail insted of all booking prevoius send mail table
    if (isMailUpdated) {
      dispatch(
        getEmailListData({
          ref_id: id,
          ref_type:
            reportParamData?.contact === 'true'
              ? 1
              : reportParamData?.enquiries === 'true'
              ? 2
              : reportParamData?.booking === 'true'
              ? 3
              : reportParamData?.type === 'invoice'
              ? 4
              : reportParamData?.type === 'credit'
              ? 4
              : reportParamData?.etickets_new === 'etickets_new'
              ? 5
              : reportParamData?.payment_receipt_deposit ===
                  'payment_receipt_deposit' ||
                reportParamData?.payment_receipt_deposit ===
                  'payment_receipt_balance'
              ? 7
              : '',
          booking_id: reportParamData.bookingid || id,
        }),
      );
      dispatch(setEmailDetail({}));
      dispatch(setIsMailUpdated(false));
    }
  }, [dispatch, isMailUpdated]);

  // const getSkuAsPerMailModule = useCallback(templateType => {
  //   const skuByModules = {
  //     invoice: 'New Invoice Created',
  //     credit: 'credit_note',
  //     etickets_new: 'etickets_new',
  //     payment_receipt_deposit: 'payment_receipt_deposit',
  //     web_booking_confirmation: 'web_booking_confirmation',
  //     default: 'default',
  //     brochure_email: 'brochure_email',
  //   };
  //   return skuByModules[templateType] ?? skuByModules['default'];
  // }, []);

  useEffect(() => {
    if (Object.keys(contactDetail)?.length > 0) {
      const emailTemplates = activeTransactionalMailList.filter(
        item =>
          +item.availability === availability[comFrom] ||
          +item.availability === 6,
      );
      setInitialEmailContact({
        ...initialEmailContact,
        to_email: contactDetail?.email_primary,
        send_blind_copy_to: contactDetail?.email_secondary,
        email_template: selectedItem?._id
          ? selectedItem?._id
          : emailTemplates?.length > 0
          ? emailTemplates[0]?._id
          : contactDetail?.email_template,
        subject:
          emailTemplates?.length > 0
            ? dynamicContent?.email_contents?.filledSubject
            : '',
        // subject: dynamicContent?.email_contents?.filledSubject,
        email_body:
          emailTemplates?.length > 0
            ? dynamicContent?.email_contents?.filledTemplate.replace(
                '[[FromName]]',
                !defaultSender
                  ? emailDetail?.created_at
                    ? emailDetail?.from_name
                    : UserSessionCRM.name
                  : 'Best Parties Ever',
              )
            : '',
        ref_id: emailDetail?.ref_id
          ? emailDetail?.ref_id
          : state?.invoiceId
          ? state?.invoiceId
          : state?.eTicket_id
          ? state?.eTicket_id
          : id,
        // email_body:
        //   emailTemplates?.length > 0 ? emailTemplates[0]?.email_contents : '',
      });
    } else if (Object.keys(enquirieDetail)?.length > 0) {
      // const templateSku = getSkuAsPerMailModule(reportParamData?.type);
      // const tempateId = activeTransactionalMailList?.find(
      //   item => item?.sku === templateSku,
      // )?._id;
      const emailTemplates = activeTransactionalMailList.filter(
        item =>
          +item.availability === availability[comFrom] ||
          +item.availability === 6,
      );
      setInitialEmailContact({
        ...initialEmailContact,
        to_email: emailDetail?.created_at
          ? emailDetail?.to_email
          : enquirieDetail?.contact?.email_primary,
        send_blind_copy_to: enquirieDetail?.contact?.email_secondary,
        email_template: selectedItem?._id
          ? selectedItem?._id
          : reportParamData?.type === 'invoice'
          ? emailTemplates?.find(item => item?.sku === 'invoice_new')?._id
          : reportParamData?.type === 'credit'
          ? emailTemplates?.find(item => item?.sku === 'credit_note')?._id
          : reportParamData?.etickets_new === 'etickets_new'
          ? emailTemplates?.find(
              item => item?.sku === 'etickets_new' || item?.sku === 'default',
            )?._id
          : reportParamData?.hasOwnProperty('payment_receipt_deposit')
          ? emailTemplates?.find(
              item => item?.sku === reportParamData?.payment_receipt_deposit,
            )?._id
          : reportParamData?.hasOwnProperty('payment_receipt_balance')
          ? emailTemplates?.find(
              item => item?.sku === reportParamData?.payment_receipt_deposit,
            )?._id
          : reportParamData?.booking_confirmation === 'web_booking_confirmation'
          ? emailTemplates?.find(
              item => item?.sku === 'web_booking_confirmation',
            )?._id
          : reportParamData?.default === 'default'
          ? emailTemplates?.find(item => item?.sku === 'default')?._id
          : reportParamData?.brochure_email === 'brochure_email'
          ? emailTemplates?.find(item => item?.sku === 'brochure_email')?._id
          : emailTemplates?.length > 0
          ? emailTemplates[0]?._id
          : '',
        // subject:
        //   activeTransactionalMailList?.length > 0
        //     ? activeTransactionalMailList[0]?.subject
        //     : '',
        subject: state?.email_subject
          ? state?.email_subject
          : dynamicContent?.email_contents?.filledSubject,
        email_body: emailDetail?.created_at
          ? emailDetail?.email_body
          : dynamicContent?.email_contents?.filledTemplate
          ? dynamicContent?.email_contents?.filledTemplate.replace(
              '[[FromName]]',
              !defaultSender
                ? emailDetail?.created_at
                  ? emailDetail?.from_name
                  : UserSessionCRM.name
                : 'Best Parties Ever',
            )
          : '',
        ref_id: emailDetail?.ref_id
          ? emailDetail?.ref_id
          : state?.invoiceId
          ? state?.invoiceId
          : state?.eTicket_id
          ? state?.eTicket_id
          : id,
      });
    }
  }, [
    activeTransactionalMailList,
    contactDetail,
    enquirieDetail,
    dynamicContent,
  ]);

  const [attachment, setAttachments] = useState(false);

  const attachmentsHandle = () => {
    setAttachments(true);
  };

  const handleImageUpload = useCallback(async data => {
    const res = await dispatch(ckEditorUploadImage(data));
    if (res) return res;
    else return false;
  }, []);

  const imageUploadFunc = editor => {
    editor.plugins.get('FileRepository').createUploadAdapter = loader => {
      return {
        upload: async () => {
          const formData = new FormData();
          formData.append('file', await loader?.file);
          const res = await handleImageUpload(formData);
          if (res)
            return {
              default: res.payload,
            };
        },
      };
    };
  };

  const validationSchema = Yup.object().shape({
    //Future send_blind_copy_to with to_email validation validaion not required
    from_name: Yup.string().required('From name URL is a required field'),
    from_email: Yup.string()
      .email('Invalid email')
      .required('From_email name is a required field')
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Invalid email'),
    to_email: Yup.string()
      .email('Invalid email')
      .required('To email name is a required field')
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Invalid email'),
    // send_blind_copy_to: Yup.string()
    //   .email('Invalid email')
    //   .nullable()
    //   .matches(/^\w+([.]?\w+)@\w+([\\.-]?\w+)(\.\w{2,3})+$/, 'Invalid email')
    //   .test(
    //     'email-match',
    //     'To Email should not be the same as Send blind copy ',
    //     function (value) {
    //       const toEmail = this.parent.to_email;
    //       return value !== toEmail;
    //     },
    //   ),
  });
  // const [attachmentsid, setAttachmentsid] = useState([]);

  // const handleCheck = event => {
  //   var updatedList = [...attachmentsid];
  //   if (event.target.checked) {
  //     updatedList = [...attachmentsid, event.target.checked];
  //   } else {
  //     updatedList.splice(attachmentsid.indexOf(event.target.checked), 1);
  //   }
  //   setAttachmentsid(updatedList);
  // };
  // const attachments = attachmentsid?.map(id => id);

  const handleDynamicAttsCheck = useCallback(
    ind => {
      const newAtts = attachment
        ? JSON.parse(JSON.stringify(allAtts))
        : JSON.parse(JSON.stringify(dynamicAtts));

      if (newAtts[ind]) newAtts[ind].is_selected = !newAtts[ind].is_selected;

      if (attachment) setAllAtts(newAtts);
      else setDynamicAtts(newAtts);
    },
    [attachment, allAtts, dynamicAtts],
  );

  useEffect(() => {
    if (initialEmailContact?.email_template || reportParamData.bookingid) {
      const dynamicTemplateParams = reportParamData?.contact
        ? { contact_id: id }
        : reportParamData?.booking
        ? { booking_id: reportParamData.bookingid || id }
        : reportParamData?.enquiries
        ? { booking_id: id }
        : reportParamData?.payment
        ? { payment_id: state?.invoiceId, booking_id: id }
        : reportParamData?.eticket
        ? { eTicket_id: state?.eTicket_id, booking_id: id }
        : reportParamData?.invoiceData
        ? { invoice_id: state?.invoiceId, booking_id: id }
        : '';
      dispatch(
        dynamicMailTemplate({
          ...dynamicTemplateParams,
          template_id: selectedItem?._id
            ? selectedItem?._id
            : reportParamData?.type === 'invoice'
            ? 'invoice_new'
            : reportParamData?.type === 'credit'
            ? 'credit_note'
            : reportParamData?.etickets_new === 'etickets_new'
            ? 'etickets_new'
            : reportParamData?.payment_receipt_deposit ===
              'payment_receipt_deposit'
            ? 'payment_receipt_deposit'
            : reportParamData?.booking_confirmation ===
              'web_booking_confirmation'
            ? 'web_booking_confirmation'
            : reportParamData?.default === 'default'
            ? 'default'
            : reportParamData?.brochure_email === 'brochure_email'
            ? 'brochure_email'
            : initialEmailContact?.email_template
            ? initialEmailContact?.email_template
            : selectedItem?._id,
          // template_id:
          //   reportParamData?.type === 'invoice' ? 'invoice_new' : 'credit_note',
          is_mail: true,
          remove_from_name: true,
        }),
      );
    }
  }, [initialEmailContact?.email_template]);

  useEffect(() => {
    if (attachment) {
      dispatch(getAllAttachments({ is_deleted: false }));
    }
  }, [attachment]);

  useEffect(() => {
    const newValue =
      !defaultSender && emailDetail?.created_at
        ? emailDetail?.created_at
          ? // emailDetail?.from_email
            emailDetail?.send_from
          : UserSessionCRM.email
        : 'bookings@bestpartiesever.com';
    setSpanValue(newValue);
    let email_templateObj = {};
    const emailTemplates = activeTransactionalMailList.filter(
      item =>
        +item.availability === availability[comFrom] ||
        +item.availability === 6,
    );
    email_templateObj = {
      subject: state?.email_subject,
      email_body: emailDetail?.created_at ? emailDetail?.email_body : '',
    };
    if (Object.keys(contactDetail)?.length > 0)
      email_templateObj = {
        email_template: selectedItem?._id
          ? selectedItem?._id
          : emailTemplates?.length > 0
          ? emailTemplates[0]?._id
          : contactDetail?.email_template,
        subject: emailTemplates?.length > 0 ? emailTemplates[0]?.subject : '',
        email_body:
          emailTemplates?.length > 0
            ? dynamicContent?.email_contents?.filledTemplate.replace(
                '[[FromName]]',
                !defaultSender
                  ? emailDetail?.created_at
                    ? emailDetail?.from_name
                    : UserSessionCRM.name
                  : 'Best Parties Ever',
              )
            : '',
      };
    else if (Object.keys(enquirieDetail)?.length > 0) {
      email_templateObj = {
        email_template: selectedItem?._id
          ? selectedItem?._id
          : reportParamData?.type === 'invoice'
          ? emailTemplates?.find(item => item?.sku === 'invoice_new')?._id
          : reportParamData?.type === 'credit'
          ? emailTemplates?.find(item => item?.sku === 'credit_note')?._id
          : reportParamData?.etickets_new === 'etickets_new'
          ? emailTemplates?.find(
              item => item?.sku === 'etickets_new' || item?.sku === 'default',
            )?._id
          : reportParamData?.hasOwnProperty('payment_receipt_deposit')
          ? emailTemplates?.find(
              item => item?.sku === reportParamData?.payment_receipt_deposit,
            )?._id
          : reportParamData?.hasOwnProperty('payment_receipt_balance')
          ? emailTemplates?.find(
              item => item?.sku === reportParamData?.payment_receipt_deposit,
            )?._id
          : reportParamData?.booking_confirmation === 'web_booking_confirmation'
          ? emailTemplates?.find(
              item => item?.sku === 'web_booking_confirmation',
            )?._id
          : reportParamData?.default === 'default'
          ? emailTemplates?.find(item => item?.sku === 'default')?._id
          : reportParamData?.brochure_email === 'brochure_email'
          ? emailTemplates?.find(item => item?.sku === 'brochure_email')?._id
          : emailTemplates?.length > 0
          ? emailTemplates[0]?._id
          : '',
        subject: state?.email_subject
          ? state?.email_subject
          : dynamicContent?.email_contents?.filledSubject,
        email_body: emailDetail?.created_at
          ? emailDetail?.email_body
          : dynamicContent?.email_contents?.filledTemplate
          ? dynamicContent?.email_contents?.filledTemplate.replace(
              '[[FromName]]',
              !defaultSender
                ? emailDetail?.created_at
                  ? emailDetail?.from_name
                  : UserSessionCRM.name
                : 'Best Parties Ever',
            )
          : '',
      };
    }
    setInitialEmailContact({
      ...initialEmailContact,
      ...email_templateObj,
      from_email: !defaultSender
        ? emailDetail?.created_at
          ? emailDetail?.from_email
          : UserSessionCRM.email
        : 'bookings@bestpartiesever.com',
      from_name: !defaultSender
        ? emailDetail?.created_at
          ? emailDetail?.from_name
          : UserSessionCRM.name
        : 'Best Parties Ever',
      send_from: newValue,
      to_email: emailDetail?.created_at
        ? emailDetail?.to_email
        : enquirieDetail?.contact?.email_primary
        ? enquirieDetail?.contact?.email_primary
        : Object.keys(contactDetail)?.length > 0
        ? contactDetail?.email_primary
        : '',
      ref_id: emailDetail?.ref_id
        ? emailDetail?.ref_id
        : state?.invoiceId
        ? state?.invoiceId
        : state?.eTicket_id
        ? state?.eTicket_id
        : id,
    });
  }, [defaultSender, emailDetail]);

  const handleSendEmail = () => {
    if (!acceptDifferentEmail.checked) {
      return setAcceptDifferentEmail({
        ...acceptDifferentEmail,
        showError: true,
      });
    } else {
      dispatch(sendMail(showConfirmEmailPopup.payload)).then(action => {
        if (sendMail.fulfilled.match(action)) {
          navigate(-1);
          showConfirmEmailPopup({ show: false, payload: {} });
          setAcceptDifferentEmail({
            ...acceptDifferentEmail,
            showError: false,
          });
        }
      });
    }
  };

  return (
    <div className="inner_wrapper">
      {(mailListLoading ||
        transactionMailLoading ||
        contactListLoading ||
        enquirieLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link
            to={
              reportParamData?.contact === 'true'
                ? `/contact`
                : reportParamData?.enquiries === 'true'
                ? `/enquiries`
                : //  else case : search === '?booking=true' || search === '?type=credit' || search === '?type=invoice'
                  `/bookings`
            }
          >
            {reportParamData?.contact === 'true'
              ? `Contact`
              : reportParamData?.enquiries === 'true'
              ? `Enquiries`
              : `Booking`}
          </Link>
          <Link
            to={
              reportParamData?.contact === 'true'
                ? `/contact/edit-contact/${reportParamData.bookingid || id}`
                : reportParamData?.enquiries === 'true'
                ? `/edit-enquiries/${reportParamData.bookingid || id}`
                : `/edit-bookings/${reportParamData.bookingid || id}`
            }
          >
            Edit
            {reportParamData?.contact === 'true'
              ? ` Contact`
              : reportParamData?.enquiries === 'true'
              ? ` Enquiries`
              : ` Booking`}
          </Link>
          <Typography>Send New Email</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <Row className="align-items-center">
          <Col xs={3}>
            <h1>
              Edit
              {reportParamData?.contact === 'true'
                ? ` Contact`
                : reportParamData?.enquiries === 'true'
                ? ` Enquiries`
                : ` Booking`}
            </h1>
          </Col>
          <Col xs={9}>
            <div className="text-end">
              <Link onClick={() => navigate(-1)} className="btn_border small">
                Back to
                {reportParamData?.contact === 'true'
                  ? ` Contact`
                  : reportParamData?.enquiries === 'true'
                  ? ` Enquiries`
                  : ` Booking`}
              </Link>
            </div>
          </Col>
        </Row>
      </div>
      <div className="send_new_main_wrap bg_white_box p-3 mb-3">
        <Row>
          <Col xxl={8}>
            <h2>Send New Email</h2>
            <Formik
              enableReinitialize={true}
              initialValues={initialEmailContact}
              validationSchema={validationSchema}
              onSubmit={values => {
                const atts = attachment ? allAtts : dynamicAtts;
                const selectedAtts = atts
                  ?.filter(x => x?.is_selected)
                  ?.map(x => x?.path);

                const combinedValues = {
                  ...values,
                  attachments: selectedAtts,
                };
                combinedValues['replyTo'] = values?.from_email;
                combinedValues['subject'] = values.subject;
                // combinedValues['subject'] =
                //   dynamicContent?.email_contents?.filledSubject ||
                //   values.subject;
                combinedValues['email_body'] = values?.email_body;
                // combinedValues['email_body'] = emailDetail?.created_at
                //   ? emailDetail?.email_body
                //   : dynamicContent?.email_contents?.filledTemplate ||
                //     values?.email_body;
                if (
                  reportParamData.hasOwnProperty('booking') ||
                  reportParamData.hasOwnProperty('payment') ||
                  reportParamData.hasOwnProperty('invoiceData') ||
                  reportParamData.hasOwnProperty('eticket') ||
                  reportParamData.hasOwnProperty('enquiries')
                ) {
                  combinedValues['booking_id'] =
                    reportParamData.bookingid || id;
                  if (
                    (emailDetail?.created_at
                      ? emailDetail?.to_email
                      : enquirieDetail?.contact?.email_primary) !==
                    values.to_email
                  ) {
                    setAcceptDifferentEmail({
                      checked: false,
                      showError: false,
                    });
                    return setShowConfirmEmailPopup({
                      show: true,
                      payload: combinedValues,
                    });
                  }
                } else if (reportParamData.hasOwnProperty('contact')) {
                  if (contactDetail?.email_primary !== values.to_email) {
                    setAcceptDifferentEmail({
                      checked: false,
                      showError: false,
                    });
                    return setShowConfirmEmailPopup({
                      show: true,
                      payload: combinedValues,
                    });
                  }
                } else setShowConfirmEmailPopup({ show: false, payload: {} });
                dispatch(sendMail(combinedValues)).then(action => {
                  if (sendMail.fulfilled.match(action)) {
                    navigate(-1);
                  }
                });
              }}
            >
              {({
                handleChange,
                handleSubmit,
                setFieldValue,
                values,
                getFieldProps,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <ul>
                    {emailDetail?.created_at && (
                      <>
                        <li className="bg_gray_box px-3 py-2 mb-2">
                          <Row className="align-items-center">
                            <Col xs={2}>
                              <label className="text_small fw_500">
                                Sent On:
                              </label>
                            </Col>
                            <Col>
                              <Row className="align-items-center">
                                <Col xs={6}>
                                  <FormControl fullWidth>
                                    <TextField
                                      disabled={
                                        emailDetail?.created_at ? true : false
                                      }
                                      id="created_at"
                                      name="created_at"
                                      type="text"
                                      variant="outlined"
                                      className="input_wrap"
                                      value={moment(
                                        emailDetail?.created_at,
                                      ).format('dddd Do MMMM YYYY h:mm:ss')}
                                    />
                                  </FormControl>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="primary_region" />
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </li>
                      </>
                    )}
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={2}>
                          <label className="text_small fw_500">
                            From Name:
                          </label>
                        </Col>
                        <Col>
                          <Row className="align-items-center">
                            <Col xs={6}>
                              <FormControl fullWidth>
                                <TextField
                                  disabled={
                                    emailDetail?.from_name ? true : false
                                  }
                                  id="from_name"
                                  name="from_name"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter Name"
                                  value={values.from_name}
                                  onChange={e => {
                                    setFieldValue('from_name', e.target.value);
                                    if (!emailDetail?.created_at) {
                                      setFieldValue(
                                        'email_body',
                                        dynamicContent?.email_contents?.filledTemplate.replace(
                                          '[[FromName]]',
                                          e.target.value,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="from_name" />
                              </span>
                            </Col>
                            {/* {!emailDetail?.from_name && ( */}
                            <Col xs={6} className="text-end">
                              <label className="text_small">
                                Send From:
                                <span
                                  className="text-decoration-underline sendMail"
                                  name="send_from"
                                  onClick={() => {
                                    setDefaultSender(!defaultSender);
                                  }}
                                >
                                  {spanValue}
                                </span>
                              </label>
                            </Col>
                            {/* )} */}
                          </Row>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={2}>
                          <label className="text_small fw_500">
                            From Email:
                          </label>
                        </Col>
                        <Col>
                          <Row className="align-items-center">
                            <Col xs={6}>
                              <FormControl fullWidth>
                                <TextField
                                  disabled={
                                    emailDetail?.from_email ? true : false
                                  }
                                  id="from_email"
                                  type="email"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter Email"
                                  name="from_email"
                                  {...getFieldProps('from_email')}
                                />
                                <span className="d-block text-danger text_small">
                                  <ErrorMessage name="from_email" />
                                </span>
                              </FormControl>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={2}>
                          <label className="text_small fw_500">To Email:</label>
                        </Col>
                        <Col>
                          <Row className="align-items-center">
                            <Col xs={6}>
                              <FormControl fullWidth>
                                <TextField
                                  disabled={
                                    emailDetail?.to_email ? true : false
                                  }
                                  id="ToEmail"
                                  type="email"
                                  name="to_email"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter Email"
                                  value={values.to_email}
                                  {...getFieldProps('to_email')}
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="to_email" />
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={2}>
                          <label className="text_small fw_500">
                            Send Blind Copy To:
                          </label>
                        </Col>
                        <Col>
                          <Row className="align-items-center">
                            <Col xs={6}>
                              <FormControl fullWidth>
                                <TextField
                                  disabled={
                                    emailDetail?.send_blind_copy_to ||
                                    emailDetail?.send_blind_copy_to === ''
                                      ? true
                                      : false
                                  }
                                  id="ToEmail"
                                  name="send_blind_copy_to"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                  values={values.send_blind_copy_to}
                                  {...getFieldProps('send_blind_copy_to')}
                                />
                              </FormControl>
                              {/* <span className="d-block text-danger text_small">
                                <ErrorMessage name="send_blind_copy_to" />
                              </span> */}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </li>
                    {!emailDetail?.created_at && (
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={2}>
                            <label className="text_small fw_500">
                              Email Templates:
                            </label>
                          </Col>
                          <Col>
                            <Row className="align-items-center">
                              <Col xs={6}>
                                <FormControl fullWidth className="input_wrap">
                                  <Select
                                    disabled={
                                      emailDetail?.email_template ? true : false
                                    }
                                    labelId="mailList"
                                    id="Method-select"
                                    name="email_template"
                                    value={values?.email_template}
                                    onChange={e => {
                                      const selectedItemId = e.target.value;
                                      const selectedItem =
                                        activeTransactionalMailList?.find(
                                          item => item?._id === selectedItemId,
                                        );
                                      setSelectedItem(selectedItem);
                                      setFieldValue(
                                        'email_template',
                                        selectedItemId,
                                      );
                                    }}
                                    className="select_wrap"
                                  >
                                    <MenuItem value="" disabled>
                                      Select
                                    </MenuItem>
                                    {activeTransactionalMailList
                                      .filter(
                                        item =>
                                          +item.availability ===
                                            availability[comFrom] ||
                                          +item.availability === 6,
                                      )
                                      ?.map(item => {
                                        return (
                                          <MenuItem
                                            value={item?._id}
                                            key={item?._id}
                                          >
                                            {item?.name}
                                          </MenuItem>
                                        );
                                      })}
                                  </Select>
                                </FormControl>
                              </Col>

                              {!Object.keys(emailDetail).length > 0 && (
                                <Col xs={6}>
                                  <Button
                                    className="btn_refresh"
                                    onClick={() => {
                                      const dynamicTemplateParams =
                                        reportParamData?.contact
                                          ? { contact_id: id }
                                          : reportParamData?.booking
                                          ? { booking_id: id }
                                          : reportParamData?.enquiries
                                          ? { booking_id: id }
                                          : reportParamData?.payment
                                          ? {
                                              payment_id: state?.invoiceId,
                                              booking_id: id,
                                            }
                                          : reportParamData?.eticket
                                          ? {
                                              eTicket_id: state?.eTicket_id,
                                              booking_id: id,
                                            } //need check
                                          : reportParamData?.invoiceData
                                          ? {
                                              invoice_id: state?.invoiceId,
                                              booking_id: id,
                                            }
                                          : '';
                                      // setAttachmentsid([]);
                                      setAtts();
                                      setInitialEmailContact({
                                        ...initialEmailContact,
                                        email_template: values?.email_template
                                          ? values?.email_template
                                          : selectedItem?._id,
                                      });
                                      setAttachments(false);
                                    }}
                                  >
                                    <img
                                      src={RefreshIcon}
                                      alt="Refresh button"
                                    />
                                  </Button>
                                </Col>
                              )}
                            </Row>
                          </Col>
                        </Row>
                      </li>
                    )}
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={2}>
                          <label className="text_small fw_500">Subject:</label>
                        </Col>
                        <Col>
                          <Row className="align-items-center">
                            <Col xs={6}>
                              <FormControl fullWidth>
                                {/* <TextField
                                  disabled={emailDetail?.subject ? true : false}
                                  id="subject"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                  {...getFieldProps('subject')}
                                /> */}
                                <TextField
                                  disabled={
                                    emailDetail?.created_at ? true : false
                                  }
                                  id="subject"
                                  type="text"
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                  name="subject"
                                  value={values?.subject}
                                  // value={
                                  //   state?.email_subject
                                  //     ? state?.email_subject
                                  //     : dynamicContent?.email_contents
                                  //         ?.filledSubject || values?.subject
                                  // }
                                  onChange={handleChange}
                                />
                              </FormControl>
                            </Col>
                            {/* {!emailDetail?.to_email && ( */}
                            <Col xs={6} className="text-end">
                              <Button
                                className="btn_border small"
                                type="submit"
                              >
                                Send Now
                              </Button>
                            </Col>
                            {/* )} */}
                          </Row>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-start">
                        <Col xs={2}>
                          <label className="text_small fw_500">
                            Email Body:
                          </label>
                        </Col>
                        <Col>
                          <CKEditor
                            // disabled={emailDetail?.email_body ? true : false}
                            editor={ClassicEditor}
                            // data={showFileContent}
                            // data={
                            //   emailDetail?.created_at
                            //     ? emailDetail?.email_body
                            //     : dynamicContent?.email_contents
                            //         ?.filledTemplate || values?.email_body
                            // }
                            data={values?.email_body || ''}
                            onChange={(event, editor) => {
                              handleChange('email_body')(editor?.getData());
                            }}
                            className="w-50"
                            style={{
                              borderColor: '#DADDDF',
                              padding: '5px',
                              borderRadius: '5px',
                              background: '#fff',
                            }}
                            onReady={editor => {
                              imageUploadFunc(editor);
                            }}
                          />
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-start">
                        <Col xs={2}>
                          <label className="text_small fw_500">
                            Attachments:
                          </label>
                          <span
                            className="text_light text_decoration text_small d-block cursor-pointer"
                            onClick={() => attachmentsHandle()}
                          >
                            Show All Attachments
                          </span>
                        </Col>
                        <Col>
                          {attachment
                            ? allAtts?.map((x, index) => {
                                return x?.name ? (
                                  <FormGroup key={index}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={x?.is_selected}
                                          onChange={() => {
                                            handleDynamicAttsCheck(index);
                                          }}
                                          value={x.path}
                                        />
                                      }
                                      label={x?.name && x.name}
                                      className="mb-2"
                                    />
                                  </FormGroup>
                                ) : null;
                              })
                            : dynamicAtts?.map((x, index) => {
                                return x?.name ? (
                                  <FormGroup key={index}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={x?.is_selected}
                                          onChange={() => {
                                            handleDynamicAttsCheck(index);
                                          }}
                                          value={x.path}
                                        />
                                      }
                                      label={x?.name && x.name}
                                      className="mb-2"
                                    />
                                  </FormGroup>
                                ) : null;
                              })}
                          {/* {dynamicContent?.atts?.map((items, index) => {
                            return items?.name ? (
                              <FormGroup key={index}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={handleCheck}
                                      value={items.path}
                                    />
                                  }
                                  label={items?.name && items.name}
                                  className="mb-2"
                                />
                              </FormGroup>
                            ) : null;
                          })} */}
                        </Col>
                      </Row>
                    </li>
                  </ul>
                  {/* {!emailDetail?.to_email && ( */}
                  <Button className="btn_border small" type="submit">
                    Send Now
                  </Button>
                  {/* )} */}
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
      <div className="previour_email_wrap">
        <PreviousSentEmails
          reportParamData={reportParamData}
          search={search}
          state={state}
          // pages={
          //   reportParamData.hasOwnProperty('booking') ? 'booking' : 'enquiries'
          // }
          id={id}
        />
      </div>
      <Dialog
        aria-labelledby="CancelBooking-title"
        open={showConfirmEmailPopup.show}
        className="delete_popup max_500"
      >
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="delete_popup_wrap py-3">
              <div>Your primary email and send to email is different.</div>
              <div>Are you sure want send to email any recipient email ?</div>
              <div className="form-group checkbox_wrap mb-2 text-center">
                <FormGroup style={{ alignItems: 'center', marginTop: '5px' }}>
                  <FormControlLabel
                    control={<Checkbox />}
                    name="price_rules"
                    label={'Accept!'}
                    checked={acceptDifferentEmail.checked}
                    onChange={e => {
                      setAcceptDifferentEmail({
                        ...acceptDifferentEmail,
                        checked: !acceptDifferentEmail.checked,
                      });
                    }}
                  />
                </FormGroup>
                <span className="d-block text-danger text_small">
                  {acceptDifferentEmail.showError
                    ? 'Please click here to accept it.'
                    : ''}
                </span>
              </div>
              <ul className="d-flex align-items-center justify-content-center mt-2">
                <li>
                  <Button
                    className="btn_border mx-2 px-3 py-1"
                    onClick={() => setShowConfirmEmailPopup(false)}
                  >
                    Cancel
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn_primary mx-2 px-3 py-1"
                    onClick={() => handleSendEmail()}
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
