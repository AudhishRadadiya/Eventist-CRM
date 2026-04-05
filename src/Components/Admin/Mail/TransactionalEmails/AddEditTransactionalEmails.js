import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
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
import FileUpload from 'react-material-file-upload';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { ErrorMessage, Form, Formik } from 'formik';
import { availabilityList } from 'utils/FieldValues';
import * as Yup from 'yup';
import {
  createTransactionalEmail,
  setIsTransactionalMailUpdated,
  getTransactionalMailData,
  setTransactionalMailDetail,
  updatetTransactionalMail,
} from 'store/reducers/Admin/Mail/mail.slice';
import Loader from 'Components/Common/Loader';
import {
  ckEditorUploadImage,
  uploadImage,
} from 'store/reducers/UploadImage/uploadImage.slice';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'store/reducers/common.slice';
import { getMailAssetsListData } from 'store/reducers/Admin/Mail/mailAssets.slice';
import { getAllAttachments } from 'store/reducers/mail/mail.slice';

export default function AddEditTransactionalEmails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { trandactionalEmailId } = useParams();

  const { mailListLoading, getAllAttachmentsData } = useSelector(
    ({ mail }) => mail,
  );
  const { activeMailAssetList } = useSelector(({ mailAssets }) => mailAssets);

  const {
    isTransactionalMailUpdated,
    transactionMailLoading,
    transactionalMailDetail,
  } = useSelector(({ transactionalMail }) => transactionalMail);
  const { getUploadImage } = useSelector(({ uploadImage }) => uploadImage);

  const [file, setFile] = useState();

  const initialValuesTransactionalEmail = {
    sku: '',
    availability: '',
    name: '',
    subject: '',
    description: '',
    file: '',
    email_contents: '',
    attachments: [],
    override_default_attachments: false,
    is_active: false,
    deleted: false,
  };

  const [chooseExistingFile, setChooseExistingFile] = useState(false);
  const [mailInitialValues, setMailInitialValues] = useState(
    initialValuesTransactionalEmail,
  );
  const [toggleStatus, setToggleStatus] = useState(false);

  useEffect(() => {
    dispatch(getMailAssetsListData());
    if (trandactionalEmailId) {
      dispatch(getTransactionalMailData(trandactionalEmailId));
    }
  }, [dispatch, trandactionalEmailId]);

  useEffect(() => {
    if (isTransactionalMailUpdated) {
      navigate('/transactional-emails');
      dispatch(setTransactionalMailDetail({}));
      dispatch(setIsTransactionalMailUpdated(false));
    }
    return () => dispatch(setTransactionalMailDetail({}));
  }, [isTransactionalMailUpdated]);

  useEffect(() => {
    if (Object.keys(transactionalMailDetail).length > 0) {
      setMailInitialValues({
        availability: transactionalMailDetail?.availability,
        sku: transactionalMailDetail?.sku,
        name: transactionalMailDetail?.name,
        subject: transactionalMailDetail?.subject,
        description: transactionalMailDetail?.description
          ? transactionalMailDetail?.description
          : '',
        email_contents: transactionalMailDetail?.email_contents
          ? transactionalMailDetail?.email_contents
          : '',
        file: transactionalMailDetail?.file
          ? transactionalMailDetail?.file
          : '',
        attachments: transactionalMailDetail?.attachments,
        is_active: transactionalMailDetail?.is_active
          ? transactionalMailDetail?.is_active
          : false,
        override_default_attachments:
          transactionalMailDetail?.override_default_attachments
            ? transactionalMailDetail?.override_default_attachments
            : false,
        deleted: transactionalMailDetail?.deleted
          ? transactionalMailDetail?.deleted
          : false,
      });
    }
  }, [transactionalMailDetail]);

  const addEditTransctionalEmailScheme = Yup.object().shape({
    availability: Yup.string().required('Availability is a required field'),
    sku: Yup.string().required('SKU is a required field'),
    name: Yup.string().required('Name is a required field'),
    subject: Yup.string().required('Subject is a required field'),
  });

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

  return (
    <div className="inner_wrapper">
      {transactionMailLoading && <Loader />}
      {mailListLoading && <Loader />}
      <div className="add_newmail_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/transactional-emails">Mail</Link>
            <Typography>
              {!transactionMailLoading &&
              Object.keys(transactionalMailDetail).length === 0
                ? 'Add New Transactional Email'
                : 'Edit Transactional Email'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!transactionMailLoading &&
            Object.keys(transactionalMailDetail).length === 0
              ? 'Add New Transactional Email'
              : 'Edit Transactional Email'}
          </h1>
        </div>
        <div className="add_newmail_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={mailInitialValues}
              validationSchema={addEditTransctionalEmailScheme}
              onSubmit={values => {
                if (Object.keys(transactionalMailDetail).length > 0) {
                  let newObj = {
                    ...values,
                    file:
                      Object.keys(getUploadImage).length > 0
                        ? getUploadImage
                        : transactionalMailDetail.file,
                  };
                  dispatch(
                    updatetTransactionalMail({
                      _id: transactionalMailDetail._id,
                      transactionalMail: newObj,
                    }),
                  );
                } else {
                  dispatch(
                    createTransactionalEmail({
                      ...values,
                      file: getUploadImage,
                    }),
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
                    <ul>
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
                                  defaultValue="Contacts"
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
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="availability" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                SKU<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  placeholder="Enter SKU"
                                  {...getFieldProps('sku')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="sku" />
                            </span>
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
                              <label>
                                Subject:<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  placeholder="Enter subject"
                                  {...getFieldProps('subject')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="subject" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Description</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Description"
                                  {...getFieldProps('description')}
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
                              <label>File:</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <div className="d-flex file_custom_wrap">
                                <FormControl
                                  fullWidth
                                  className="file_upload_wrap"
                                >
                                  <FileUpload
                                    name="file"
                                    type="file"
                                    onChange={e => {
                                      const selectedFile = e[0];
                                      if (
                                        selectedFile &&
                                        (selectedFile.type === 'text/plain' ||
                                          selectedFile.type === 'text/html')
                                      ) {
                                        const formData = new FormData();
                                        formData.append('file', selectedFile);
                                        dispatch(uploadImage(formData));

                                        let reader = new FileReader();
                                        reader.onload = e => {
                                          setFieldValue(
                                            'email_contents',
                                            e.target.result,
                                          );
                                        };
                                        reader.readAsText(selectedFile);
                                      } else {
                                        dispatch(
                                          showMessage({
                                            message:
                                              'Invalid file type. Please select a TXT or HTML file.',
                                          }),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="custom_select_box">
                                  <div className="cusom_select_inner">
                                    <label
                                      className="mb-2 w-100"
                                      onClick={() => {
                                        if (!chooseExistingFile) {
                                          dispatch(
                                            getAllAttachments({
                                              forExistEmailTmplContent: true,
                                            }),
                                          );
                                          setChooseExistingFile(true);
                                        }
                                      }}
                                    >
                                      Choose Existing File
                                    </label>
                                    {chooseExistingFile && (
                                      <ul className="d-flex w-100">
                                        <li className="w-100">
                                          <FormControl
                                            fullWidth
                                            className="w-100"
                                          >
                                            <Select
                                              labelId="couponYear-label"
                                              id="chooseFile"
                                              value={
                                                getAllAttachmentsData?.path
                                              }
                                              onChange={e => {
                                                setFile(e.target.value);
                                              }}
                                              className="select_wrap"
                                            >
                                              {getAllAttachmentsData?.atts?.map(
                                                (item, i) => {
                                                  return (
                                                    <MenuItem
                                                      key={i}
                                                      value={item?.path}
                                                    >
                                                      {item?.name}
                                                    </MenuItem>
                                                  );
                                                },
                                              )}
                                            </Select>
                                          </FormControl>
                                        </li>
                                        <li>
                                          <button
                                            type="button"
                                            className="btn_border small mx-1"
                                            onClick={async e => {
                                              let filetest = await fetch(file)
                                                .then(r => r.blob())
                                                .then(
                                                  blobFile =>
                                                    new File([blobFile], file, {
                                                      type: 'text/html',
                                                    }),
                                                );
                                              let reader = new FileReader();
                                              reader.onload = e => {
                                                setFieldValue(
                                                  'email_contents',
                                                  e.target.result,
                                                );
                                              };
                                              reader.readAsText(filetest);
                                            }}
                                          >
                                            Save
                                          </button>
                                        </li>
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Email Contents:
                                <span
                                  className=" text-decoration-underline d-block mt-1"
                                  onClick={() => {
                                    setToggleStatus(!toggleStatus);
                                  }}
                                >
                                  Toggle Editor
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <span className="d-block mb-2">
                                Asset Tags: Array
                              </span>

                              {toggleStatus ? (
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_33">
                                    <TextField
                                      multiline
                                      rows={3}
                                      placeholder="Enter Email Contents"
                                      {...getFieldProps('email_contents')}
                                    />
                                  </FormControl>
                                </div>
                              ) : (
                                <div className="custom_ckeditor">
                                  <CKEditor
                                    editor={ClassicEditor}
                                    data={values.email_contents}
                                    onChange={(event, editor) => {
                                      handleChange('email_contents')(
                                        editor.getData(),
                                      );
                                    }}
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
                              )}
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Attachments:</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <ul>
                                <li className="form-group checkbox_wrap mb-2">
                                  {activeMailAssetList?.map((item, index) => {
                                    return (
                                      item?.type === 0 && (
                                        <FormGroup
                                          className="inline_checkbox_wrap new_checkbox"
                                          key={index}
                                        >
                                          <FormControlLabel
                                            control={<Checkbox />}
                                            name="attachments"
                                            value={item?._id}
                                            label={item?.sku}
                                            checked={values?.attachments.includes(
                                              item?._id,
                                            )}
                                            onChange={handleChange}
                                          />
                                          <label
                                            htmlFor="CheckOne"
                                            className="text_small cursor-pointer"
                                          >
                                            {item?.sku}
                                            <span className="text_light ps-1">
                                              Default Content :
                                              {item?.default_content}
                                            </span>
                                          </label>
                                        </FormGroup>
                                      )
                                    );
                                  })}
                                </li>
                              </ul>
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
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Override Default Attachments:
                                <span className="d-block text_light mt-1">
                                  If this template overrides another template
                                  then specify whether to inherit the original
                                  attachments or to overwrite with the above.
                                </span>
                              </label>
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
                                  value={values.override_default_attachments}
                                  onChange={() =>
                                    setFieldValue(
                                      'override_default_attachments',
                                      !values.override_default_attachments,
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
                          <Col xs={12}>
                            <p className="m-0 text_light">
                              You can totally remove this payment option from
                              the system if it is no longer required. Note: the
                              SKU will not become available again as previous
                              bookings may be referenced against it. If you
                              select 'Yes' then you will not be able to undo the
                              delete without knowing the exact sku.
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
                      <button type="submit" className="btn_primary small ">
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
