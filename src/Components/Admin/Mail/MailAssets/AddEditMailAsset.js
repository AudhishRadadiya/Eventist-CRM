import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Col, Row } from 'react-bootstrap';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ErrorMessage, Form, Formik } from 'formik';
import { availabilityList } from 'utils/FieldValues';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMailAssetsData,
  updateMailAsset,
  createMailAsset,
  setIsMailAssetsUpdated,
  setMailAssetDetail,
} from 'store/reducers/Admin/Mail/mailAssets.slice';
import Loader from 'Components/Common/Loader';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import CrossIcon from '../../../../Assets/Img/cross-red.svg';
import CheckIcon from '../../../../Assets/Img/check-green.svg';
import {
  createEventAlternate,
  getEventAlternateData,
  setIsEventAlternateUpdated,
  updateEventAlternate,
} from 'store/reducers/Admin/Mail/eventAlternativeAsset.slice';
import FileUpload from 'react-material-file-upload';
import {
  ckEditorUploadImage,
  setUploadImageDetail,
  uploadImage,
} from 'store/reducers/UploadImage/uploadImage.slice';
import { showMessage } from 'store/reducers/common.slice';
import { getAllAttachments } from 'store/reducers/mail/mail.slice';
import { capitalizeSentence } from 'utils/common';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
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
            color: theme => theme.palette.grey[600],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function AddEditMailAsset() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { mailAssestId } = useParams();
  const { mailAssetDetail, MailAssetLoading, isMailAssetsUpdated } =
    useSelector(({ mailAssets }) => mailAssets);
  const { getUploadImage, uploadImageLoading } = useSelector(
    ({ uploadImage }) => uploadImage,
  );
  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const parts = typeof getUploadImage == 'string' && getUploadImage?.split('/');
  const fileNameWithExtension = parts[parts.length - 1];
  const [activeEventListData, setActiveEventListData] = useState([]);
  const {
    eventAlternateDetail,
    isEventAlternateUpdated,
    eventAlternateLoading,
  } = useSelector(({ eventAlternate }) => eventAlternate);

  const currentYear = new Date().getFullYear();
  const eventYear = mailAssetDetail?.years || currentYear;
  const pastYear = eventYear - 1;
  const futureYear = currentYear + 1;

  const yearsArrayEditEvent = Array.from(
    { length: futureYear - pastYear + 1 },
    (_, index) => pastYear + index,
  );

  const initialValuesMailAssets = {
    sku: '',
    name: '',
    availability: '',
    years: new Date().getFullYear(),
    email_tag: '',
    type: 0,
    default_content: '',
    file_attachment: '',
    file_attachment_option: 0,
    hide_online: false,
    is_active: true,
    deleted: false,
  };

  const [mailAssetsInitialValues, setMailAssetsInitialValues] = useState(
    initialValuesMailAssets,
  );
  const [mailAlternateDetail, setMailAlternateDetail] = useState({
    event_id: '',
    contents: '',
    file_attachment: '',
    //If the user uploads a new file or selects an existing one, you must pass the is_file: true.
    is_file: false,
    file_attachment_option: 0,
    hide_online: false,
    is_active: true,
    deleted: false,
    force_default: 0,
    mail_asset_id: '',
  });

  const [autoSentenceCase, setAutoSentenceCase] = useState(false);
  const [fileName, setFileName] = useState('');
  const [filterdEventData, setFilterdEventData] = useState([]);
  const [refreshData, setRefreshData] = useState(true);
  const [open, setOpen] = useState({
    is_open: false,
    is_default: false,
  });

  // let fileAttachment = activeEventAlternateList?.filter(
  //   item => item?.file_attachment?.trim() !== '',
  // );
  const { getAllAttachmentsData } = useSelector(({ mail }) => mail);

  useEffect(() => {
    dispatch(getEventListData());
    // dispatch(getEventAlternateListData());
    dispatch(getAllAttachments({ is_deleted: false }));
    return () => {
      dispatch(setMailAssetDetail({}));
      setFilterdEventData([]);
      setRefreshData(true);
      setActiveEventListData([]);
    };
  }, [dispatch]);

  const inputHandler = (event, editor) => {
    setMailAlternateDetail(prevState => ({
      ...prevState,
      contents: editor.getData(),
    }));
  };
  const handleChange = e => {
    const { name, value } = e.target;
    setMailAlternateDetail(prevState => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  useEffect(() => {
    if (mailAssestId) {
      dispatch(getMailAssetsData(mailAssestId));
    }
  }, [dispatch, mailAssestId]);
  useEffect(() => {
    if (isEventAlternateUpdated) {
      dispatch(getMailAssetsData(mailAssestId));
      dispatch(setIsEventAlternateUpdated(false));
      setRefreshData(true);
    }
  }, [isEventAlternateUpdated]);

  useEffect(() => {
    if (isMailAssetsUpdated) {
      navigate('/mail-assets');
      dispatch(setIsMailAssetsUpdated(false));
    }
  }, [isMailAssetsUpdated]);

  useEffect(() => {
    if (
      Object.keys(mailAssetDetail)?.length > 0 &&
      activeEventList?.length > 0 &&
      refreshData
    ) {
      setMailAssetsInitialValues({
        sku: mailAssetDetail?.sku,
        name: mailAssetDetail?.name,
        availability: mailAssetDetail?.availability,
        years: mailAssetDetail?.years,
        email_tag: mailAssetDetail?.email_tag,
        type: mailAssetDetail?.type,
        default_content: mailAssetDetail?.default_content,
        file_attachment: mailAssetDetail?.file_attachment,
        file_attachment_option: mailAssetDetail?.file_attachment_option,
        hide_online: mailAssetDetail?.hide_online
          ? mailAssetDetail?.hide_online
          : false,
        is_active: mailAssetDetail?.is_active
          ? mailAssetDetail?.is_active
          : false,
        deleted: mailAssetDetail?.deleted ? mailAssetDetail?.deleted : false,
      });
      if (mailAssetDetail?.alternativeData?.length > 0) {
        const activeEventListDatas = [...activeEventList];
        const dummyData = activeEventListDatas.map(item => {
          const obj = mailAssetDetail?.alternativeData.find(
            alterNativeList => alterNativeList.event_id === item._id,
          );
          if (obj) {
            return {
              ...item,
              is_active: obj ? obj?.is_active : false,
              is_edit: true,
            };
          }

          return { ...item, is_edit: false, is_active: false };
        });
        setActiveEventListData(dummyData);
        const matchingEvent = dummyData?.filter(
          elem => elem.year === mailAssetDetail?.years,
        );
        if (matchingEvent?.length > 0) {
          setFilterdEventData(matchingEvent);
        }
        setRefreshData(false);
      }
    }
  }, [mailAssetDetail, activeEventList, refreshData]);

  useEffect(() => {
    if (Object.values(eventAlternateDetail)?.length > 0) {
      setMailAlternateDetail({
        event_id: eventAlternateDetail?.event || '',
        contents: eventAlternateDetail?.contents || '',
        force_default: eventAlternateDetail?.force_default
          ? Number(eventAlternateDetail?.force_default)
          : 0,
        file_attachment: eventAlternateDetail?.file_attachment || '',
        file_attachment_option: eventAlternateDetail?.file_attachment_option
          ? Number(eventAlternateDetail?.file_attachment_option)
          : 0,
        hide_online:
          eventAlternateDetail?.hide_online === 'true'
            ? true
            : eventAlternateDetail?.hide_online === true
            ? true
            : false,
        is_active:
          eventAlternateDetail?.is_active === 'true'
            ? true
            : eventAlternateDetail?.is_active === true
            ? true
            : false,
        deleted:
          eventAlternateDetail?.deleted === 'true'
            ? true
            : eventAlternateDetail?.deleted === true
            ? true
            : false,
      });
    }
  }, [eventAlternateDetail]);

  //handleClickOpen are call direct on edit button
  const handleClose = () => {
    setOpen({ ...open, is_open: false });
    setMailAlternateDetail({
      event_id: '',
      contents: '',
      file_attachment: '',
      is_file: false,
      file_attachment_option: 0,
      hide_online: false,
      is_active: true,
      deleted: false,
      force_default: 0,
      mail_asset_id: '',
    });
  };

  const addEditMailAssetsScheme = Yup.object().shape({
    sku: Yup.string().required('SKU is a required field'),
    name: Yup.string().required('Name is a required field'),
    availability: Yup.string().required('Availability is a required field'),
  });

  const handleAlternetCreate = event => {
    let newObj = { ...mailAlternateDetail };
    newObj.file_attachment = mailAssetDetail?.alternativeData?.find(
      alterNativeList => alterNativeList.event_id === null,
    )?.file_attachment;
    delete newObj.force_default;
    dispatch(
      createEventAlternate({
        ...newObj,
        event_id: event?._id,
        mail_asset_id: mailAssestId,
      }),
    );
    setMailAlternateDetail({
      event_id: '',
      contents: '',
      file_attachment: '',
      is_file: false,
      file_attachment_option: 0,
      hide_online: false,
      is_active: true,
      deleted: false,
      force_default: 0,
      mail_asset_id: '',
    });
    let tempListData = filterdEventData?.map(item => {
      if (item?._id === event?._id) {
        return {
          ...item,
          is_edit: true,
        };
      }
      return item;
    });
    setFilterdEventData(tempListData);
  };

  const handleUpdate = () => {
    let updateData = {
      ...mailAlternateDetail,
      event_id: mailAlternateDetail?.event_id?._id,
      mail_asset_id: mailAssestId,
      file_attachment_option: mailAlternateDetail?.file_attachment_option
        ? Number(mailAlternateDetail?.file_attachment_option)
        : 0,
      file_attachment: fileNameWithExtension
        ? fileNameWithExtension
        : mailAlternateDetail?.file_attachment,
      hide_online:
        mailAlternateDetail?.hide_online === 'true'
          ? true
          : mailAlternateDetail?.hide_online === true
          ? true
          : false,
      is_active:
        mailAlternateDetail?.is_active === 'true'
          ? true
          : mailAlternateDetail?.is_active === true
          ? true
          : false,
      deleted:
        mailAlternateDetail?.deleted === 'true'
          ? true
          : mailAlternateDetail?.deleted === true
          ? true
          : false,
      force_default: mailAlternateDetail?.force_default
        ? Number(mailAlternateDetail?.force_default)
        : 0,
      is_file:
        mailAlternateDetail?.file_attachment &&
        mailAlternateDetail?.file_attachment?.length > 0
          ? true
          : false,
    };
    dispatch(
      updateEventAlternate({
        _id: eventAlternateDetail?._id,
        eventAlternate: updateData,
      }),
    );
    if (fileName) {
      setFileName('');
      dispatch(setUploadImageDetail({}));
    }
    setOpen(false);
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
  const isValidHttpUrl = string => {
    try {
      const newUrl = new URL(string);
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
      return false;
    }
  };
  return (
    <div className="inner_wrapper">
      {MailAssetLoading && <Loader />}
      {eventLoading && <Loader />}
      <div className="add_mailasset_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/transactional-emails">Mail</Link>
            <Link to="/mail-assets">Mail Assets</Link>
            <Typography>
              {!MailAssetLoading && Object.keys(mailAssetDetail).length === 0
                ? 'Add New Mail Asset'
                : 'Edit Mail Asset'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!MailAssetLoading && Object.keys(mailAssetDetail).length === 0
              ? 'Add New Mail Asset'
              : 'Edit Mail Asset'}
          </h1>
        </div>
        <h5 className="text_primary">{mailAssetDetail[0]?.name}</h5>
        <div className="add_mailasset_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={mailAssetsInitialValues}
              validationSchema={addEditMailAssetsScheme}
              onSubmit={values => {
                const capitalizedObject = {
                  ...values,
                  name: capitalizeSentence(values.name),
                  email_tag: capitalizeSentence(values.email_tag),
                  sku: capitalizeSentence(values.sku),
                };

                let payload = autoSentenceCase ? capitalizedObject : values;
                if (Object.keys(mailAssetDetail).length > 0) {
                  dispatch(
                    updateMailAsset({
                      _id: mailAssetDetail._id,
                      mail: payload,
                    }),
                  );
                } else {
                  dispatch(createMailAsset(payload));
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
                    <ul>
                      <li>
                        <Row className="justify-content-end">
                          <Col xs={9}>
                            <div className="card_content_right">
                              <div className="form-group inline checkbox_wrap mb-0">
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name="auto_sentence"
                                        checked={autoSentenceCase}
                                        onChange={() => {
                                          setAutoSentenceCase(
                                            !autoSentenceCase,
                                          );
                                        }}
                                      />
                                    }
                                    label="Auto Sentence Case"
                                  />
                                </FormGroup>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Valid in Year:</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <Select
                                  labelId="Year-label"
                                  id="year"
                                  name="years"
                                  value={values.years}
                                  onChange={e => {
                                    const selectedYear = e.target.value;
                                    setFieldValue('years', selectedYear);

                                    const matchingEvent =
                                      activeEventListData?.filter(
                                        elem => elem.year === selectedYear,
                                      );
                                    if (matchingEvent) {
                                      setFilterdEventData(matchingEvent);
                                    }
                                  }}
                                  defaultValue="Any Year"
                                  className="select_wrap"
                                >
                                  {yearsArrayEditEvent?.map(item => {
                                    return (
                                      <MenuItem value={item} key={item}>
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
                              <label>
                                Availability:
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <Select
                                  labelId="availability-label"
                                  id="availability"
                                  name="availability"
                                  value={values.availability}
                                  onChange={handleChange}
                                  className="select_wrap"
                                >
                                  {availabilityList?.map(item => {
                                    return (
                                      <MenuItem
                                        key={item?.value}
                                        value={item?.value}
                                      >
                                        {item?.label}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="availability" />
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Name:<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  {...getFieldProps('name')}
                                  placeholder="Enter name"
                                  value={
                                    autoSentenceCase
                                      ? capitalizeSentence(values.name)
                                      : values.name
                                  }
                                  onChange={e => {
                                    setFieldValue('name', e.target.value);
                                    setFieldValue('sku', e.target.value);
                                    setFieldValue('email_tag', e.target.value);
                                  }}
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
                              <label>
                                SKU:<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <div className="d-flex align-items-center">
                                <FormControl fullWidth className="max_33">
                                  <TextField
                                    {...getFieldProps('sku')}
                                    placeholder="Enter sku"
                                    value={
                                      autoSentenceCase
                                        ? capitalizeSentence(values.sku)
                                        : values.sku
                                    }
                                    onChange={e => {
                                      setFieldValue('sku', e.target.value);
                                      setFieldValue(
                                        'email_tag',
                                        e.target.value,
                                      );
                                    }}
                                  />
                                </FormControl>
                                <span name="email_tag">
                                  Email Tag: [[
                                  {autoSentenceCase
                                    ? capitalizeSentence(values.email_tag)
                                    : values.email_tag}
                                  ]]
                                </span>
                              </div>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="sku" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      {Object.keys(mailAssetDetail).length > 0 && (
                        <li>
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>Contents:</label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <div className="max_33">
                                  <div className="d-flex align-items-center pb-2 border-bottom">
                                    <h6 className="m-0 fw_500">
                                      Default Value
                                    </h6>
                                    <button
                                      type="button"
                                      className="btn_border small mx-4"
                                      onClick={() => {
                                        setOpen({
                                          is_default: true,
                                          is_open: true,
                                        });
                                        // when eventId get null then pass _id of null event in default
                                        dispatch(
                                          getEventAlternateData(
                                            mailAssetDetail?.alternativeData?.find(
                                              alterNativeList =>
                                                alterNativeList?.event_id ===
                                                null,
                                            )?._id,
                                          ),
                                        );
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <span className="text_light">
                                      (
                                      {
                                        mailAssetDetail?.alternativeData?.find(
                                          alterNativeList =>
                                            alterNativeList.event_id === null,
                                        )?.file_attachment
                                      }
                                      )...
                                      {mailAssetDetail?.alternativeData?.find(
                                        alterNativeList =>
                                          alterNativeList.event_id === null,
                                      )?.hide_online ? (
                                        <span className="ml-2">
                                          HIDE ONLINE
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                    </span>
                                  </div>
                                  <div className="py-2 border-bottom">
                                    <h6 className="fw_500">
                                      Event Alternatives
                                    </h6>
                                    <p className="text_light m-0">
                                      Event Alternatives only work for email
                                      sent to a CRMBO contact with a primary
                                      location assigned or a valid booking
                                    </p>
                                  </div>

                                  {filterdEventData?.length > 0 ? (
                                    filterdEventData?.map((event, index) => {
                                      return (
                                        <>
                                          <div>
                                            {event?.is_active ? (
                                              <img
                                                src={CheckIcon}
                                                alt="checkIcon"
                                              />
                                            ) : (
                                              <img
                                                src={CrossIcon}
                                                alt="crossIcon"
                                              />
                                            )}
                                            <span>{event?.sku}</span>

                                            {event?.is_edit ? (
                                              <button
                                                type="button"
                                                className="btn_border small mx-4"
                                                onClick={() => {
                                                  setOpen({
                                                    is_open: true,
                                                  });
                                                  dispatch(
                                                    getEventAlternateData(
                                                      mailAssetDetail?.alternativeData.find(
                                                        alterNativeList =>
                                                          alterNativeList.event_id ===
                                                          event._id,
                                                      )?._id,
                                                    ),
                                                  );
                                                }}
                                              >
                                                Edit
                                              </button>
                                            ) : (
                                              <button
                                                type="button"
                                                className="btn_border small mx-4"
                                                onClick={() =>
                                                  handleAlternetCreate(event)
                                                }
                                              >
                                                Add
                                              </button>
                                            )}
                                            {event?.is_edit && (
                                              <span className="text_light">
                                                (
                                                {
                                                  mailAssetDetail?.alternativeData?.find(
                                                    alterNativeList =>
                                                      alterNativeList.event_id ===
                                                      event._id,
                                                  )?.file_attachment
                                                }
                                                )...
                                                {mailAssetDetail?.alternativeData?.find(
                                                  alterNativeList =>
                                                    alterNativeList.event_id ===
                                                    event._id,
                                                )?.hide_online ? (
                                                  <span className="ml-2">
                                                    HIDE ONLINE
                                                  </span>
                                                ) : (
                                                  ''
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </>
                                      );
                                    })
                                  ) : (
                                    <span className="text_primary text_small">
                                      There are currently no active events
                                      available for the chosen year
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </li>
                      )}
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Hide Online:</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  name="radio-buttons-group"
                                  value={values.hide_online}
                                  className="custom_radio"
                                  onChange={() =>
                                    setFieldValue(
                                      'hide_online',
                                      !values.hide_online,
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
                              <label>Active:</label>
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
                      <li>
                        <Row>
                          <Col xs={11}>
                            <p className="m-0">
                              You can totally remove this mail from the system
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
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  name="radio-buttons-group"
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
      </div>

      <BootstrapDialog
        aria-labelledby="customized-dialog2-title"
        open={open.is_open}
        className="custom_popup"
      >
        {(eventAlternateLoading || uploadImageLoading) && <Loader />}
        <BootstrapDialogTitle
          id="customized-dialog2-title"
          onClose={handleClose}
        >
          Edit Event Alternative Asset
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="card_wrapper">
              <div className="card_body admin_card_body">
                <ul>
                  {eventAlternateDetail?.event_id !== null && (
                    <li>
                      <Row>
                        <Col xs={4}>
                          <div className="card_content_left">
                            <span>Event:</span>
                          </div>
                        </Col>
                        <Col xs={8}>
                          <div className="card_content_right">
                            <p>{mailAlternateDetail?.event_id?.public_name}</p>
                          </div>
                        </Col>
                      </Row>
                    </li>
                  )}
                  <li>
                    <Row>
                      <Col xs={4}>
                        <div className="card_content_left">
                          <span>Contents:</span>
                        </div>
                      </Col>
                      <Col xs={8}>
                        <div className="card_content_right">
                          <CKEditor
                            editor={ClassicEditor}
                            data={mailAlternateDetail?.contents}
                            onChange={inputHandler}
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
                        </div>
                      </Col>
                    </Row>
                  </li>
                  {open.is_default && (
                    <li>
                      <Row>
                        <Col xs={4}>
                          <div className="card_content_left">
                            <label>
                              Force Default as File Attachment:
                              <span className="d-block mt-2 text_light fw_400">
                                If no default file is set but the asset type
                                need to be a file attachment then set this to
                                "Force Is File" - it will reset if a file is
                                added to the default asset.
                              </span>
                            </label>
                          </div>
                        </Col>
                        <Col xs={8}>
                          <div className="card_content_right">
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="force_default"
                                value={mailAlternateDetail?.force_default}
                                className="custom_radio"
                                onChange={e => handleChange(e)}
                              >
                                <FormControlLabel
                                  value={0}
                                  control={<Radio />}
                                  label="Auto select based on type"
                                />
                                <FormControlLabel
                                  value={1}
                                  control={<Radio />}
                                  label="Force 'Is File'."
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </Col>
                      </Row>
                    </li>
                  )}
                  <li>
                    <Row>
                      <Col xs={4}>
                        <div className="card_content_left">
                          <label>File Attachment:</label>
                        </div>
                      </Col>
                      <Col xs={8}>
                        <div className="card_content_right">
                          <ul>
                            <li className="mb-1">
                              <h6 className="fw_500 m-0">
                                File attachments override text content
                              </h6>
                            </li>
                            <li className="mb-2">
                              <FormControl
                                fullWidth
                                className="d-block popup_select"
                              >
                                <label className="fw_500 d-block text_small mb-1">
                                  Choose Existing file:
                                </label>
                                <Select
                                  labelId="choose-file-label"
                                  id="chooseFile"
                                  name="file_attachment"
                                  value={
                                    isValidHttpUrl(
                                      mailAlternateDetail?.file_attachment,
                                    )
                                      ? mailAlternateDetail?.file_attachment
                                      : ' '
                                  }
                                  className="select_wrap"
                                  onChange={e => handleChange(e)}
                                >
                                  <MenuItem value=" ">
                                    Please select file
                                  </MenuItem>
                                  {getAllAttachmentsData?.atts?.map(item => {
                                    return (
                                      <MenuItem value={item?.path}>
                                        {item?.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </li>
                            <li className="mb-1">
                              <div className="custom-file-upload">
                                {/* <label
                                  htmlFor="upload-button"
                                  className="btn_border small cursor-pointer"
                                >
                                  Choose File
                                </label> */}
                                <FormControl className="file_upload_wrap">
                                  <FileUpload
                                    name="file"
                                    type="file"
                                    onChange={e => {
                                      const selectedFile = e[0];
                                      if (
                                        selectedFile &&
                                        (selectedFile.type === 'text/plain' ||
                                          selectedFile.type === 'text/html' ||
                                          selectedFile.type === 'image/png' ||
                                          selectedFile.type === 'image/jpeg' ||
                                          selectedFile.type === 'image/jpg')
                                      ) {
                                        const formData = new FormData();
                                        formData.append('file', selectedFile);
                                        dispatch(uploadImage(formData));

                                        let reader = new FileReader();
                                        reader.onload = e => {
                                          setMailAlternateDetail({
                                            ...mailAlternateDetail,
                                            file_attachment:
                                              fileNameWithExtension,
                                          });
                                        };
                                        reader.readAsText(selectedFile);
                                        setFileName(selectedFile.name);
                                      } else {
                                        dispatch(
                                          showMessage({
                                            message:
                                              'Invalid file type. Please select a TXT or HTML file.',
                                          }),
                                        );
                                        setFileName('');
                                      }
                                    }}
                                  />
                                </FormControl>
                                {fileName && (
                                  <div>Selected File: {fileName}</div>
                                )}

                                <input type="file" id="upload-button" />
                              </div>
                            </li>
                            <li className="mb-1">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  defaultValue="activeYes"
                                  name="file_attachment_option"
                                  className="custom_radio"
                                  value={
                                    mailAlternateDetail?.file_attachment_option
                                  }
                                  onChange={e => handleChange(e)}
                                >
                                  <FormControlLabel
                                    value={0}
                                    control={<Radio />}
                                    label="Unique"
                                  />
                                  <FormControlLabel
                                    value={1}
                                    control={<Radio />}
                                    label="Overwrite Duplicate"
                                  />
                                  <FormControlLabel
                                    value={2}
                                    control={<Radio />}
                                    label="Throw Error"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={4}>
                        <div className="card_content_left">
                          <label>Hide Online:</label>
                        </div>
                      </Col>
                      <Col xs={8}>
                        <div className="card_content_right">
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue="onlineNo"
                              name="hide_online"
                              className="custom_radio"
                              value={mailAlternateDetail?.hide_online}
                              onChange={e => handleChange(e)}
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
                      <Col xs={4}>
                        <div className="card_content_left">
                          <label>Active:</label>
                        </div>
                      </Col>
                      <Col xs={8}>
                        <div className="card_content_right">
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="demo-radio-buttons-group-label"
                              name="is_active"
                              className="custom_radio"
                              value={mailAlternateDetail?.is_active}
                              onChange={e => handleChange(e)}
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
                  <Row className="justify-content-end">
                    <Col xs={8}>
                      <Button
                        type="button"
                        className="btn_border small"
                        onClick={handleUpdate}
                      >
                        update
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
