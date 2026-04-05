import React, { useCallback, useEffect, useState } from 'react';
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
import { ErrorMessage, Form, Formik } from 'formik';
import { availabilityList } from 'utils/FieldValues';
import * as Yup from 'yup';
import {
  createLetterAsset,
  setIsLetterUpdated,
  setLetterDetail,
  updateLetter,
  getLettersData,
} from 'store/reducers/Admin/Mail/letters.slice';
import Loader from 'Components/Common/Loader';
import {
  ckEditorUploadImage,
  uploadImage,
} from 'store/reducers/UploadImage/uploadImage.slice';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'store/reducers/common.slice';
import { getAllAttachments } from 'store/reducers/mail/mail.slice';

export default function AddEditLetter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { letterId } = useParams();
  const { mailListLoading, getAllAttachmentsData } = useSelector(
    ({ mail }) => mail,
  );
  const [file, setFile] = useState();
  const [chooseExistingFile, setChooseExistingFile] = useState(false);
  const { isLetterUpdated, letterLoading, letterDetail } = useSelector(
    ({ letter }) => letter,
  );
  const { getUploadImage } = useSelector(({ uploadImage }) => uploadImage);

  const initialValuesLetter = {
    availability: '',
    sku: '',
    name: '',
    description: '',
    file: '',
    contents: '',
    is_active: false,
    deleted: false,
  };
  const [letterInitialValues, setLetterInitialValues] =
    useState(initialValuesLetter);
  const [letterContentsStatus, setLetterContentsStatus] = useState(false);
  useEffect(() => {
    if (isLetterUpdated) {
      navigate('/letters');
      dispatch(setLetterDetail({}));
      dispatch(setIsLetterUpdated());
    }
    return () => dispatch(setLetterDetail({}));
  }, [isLetterUpdated]);
  useEffect(() => {
    if (letterId) {
      dispatch(getLettersData(letterId));
    }
  }, [dispatch, letterId]);
  useEffect(() => {
    if (Object.keys(letterDetail).length > 0) {
      setLetterInitialValues({
        availability: letterDetail?.availability,
        sku: letterDetail?.sku,
        name: letterDetail?.name,
        description: letterDetail?.description ? letterDetail?.description : '',
        contents: letterDetail?.contents ? letterDetail?.contents : '',
        file: letterDetail?.file ? letterDetail?.file : '',
        is_active: letterDetail?.is_active ? letterDetail?.is_active : false,
        deleted: letterDetail?.deleted ? letterDetail?.deleted : false,
      });
    }
  }, [letterDetail]);
  const addEditTransctionalEmailScheme = Yup.object().shape({
    sku: Yup.string().required('SKU is a required field'),
    name: Yup.string().required('Name is a required field'),
    availability: Yup.string().required('Availability is a required field'),
  });
  const onChangeImageUpload = e => {
    const formData = new FormData();
    formData.append('file', e[0]);
    dispatch(uploadImage(formData));
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
  return (
    <div className="inner_wrapper">
      {letterLoading && <Loader />}
      {mailListLoading && <Loader />}
      <div className="addletter_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Mail</Typography>
            <Link to="/letters">Letters</Link>
            <Typography>
              {!letterLoading && Object.keys(letterDetail).length === 0
                ? 'Add New Letter'
                : 'Edit Letter'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!letterLoading && Object.keys(letterDetail).length === 0
              ? 'Add New Letter'
              : 'Edit Letter'}
          </h1>
        </div>
        <h5 className="text_primary">{letterDetail?.name}</h5>
        <div className="addletter_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={letterInitialValues}
              validationSchema={addEditTransctionalEmailScheme}
              onSubmit={values => {
                if (Object.keys(letterDetail).length > 0) {
                  let newObj = {
                    ...values,
                    file:
                      Object.keys(getUploadImage).length > 0
                        ? getUploadImage
                        : letterDetail.file,
                  };
                  dispatch(
                    updateLetter({
                      _id: letterDetail._id,
                      letter: newObj,
                    }),
                  );
                } else {
                  dispatch(
                    createLetterAsset({
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
                    <Row>
                      <Col xl={10}>
                        <ul className="custom_admin_card_inner">
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
                                  <FormControl fullWidth className="max_50">
                                    <Select
                                      labelId="couponYear-label"
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
                                    SKU<sup className="text_primary">*</sup>
                                  </label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
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
                                  <FormControl fullWidth className="max_50">
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
                            <Row className="align-items-start">
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>Description</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
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

                                          // Check if the selected file is a TXT or HTML file
                                          if (
                                            selectedFile &&
                                            (selectedFile.type ===
                                              'text/plain' ||
                                              selectedFile.type === 'text/html')
                                          ) {
                                            const formData = new FormData();
                                            formData.append(
                                              'file',
                                              selectedFile,
                                            );
                                            dispatch(uploadImage(formData));

                                            let reader = new FileReader();
                                            reader.onload = e => {
                                              setFieldValue(
                                                'contents',
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
                                                  let filetest = await fetch(
                                                    file,
                                                  )
                                                    .then(r => r.blob())
                                                    .then(
                                                      blobFile =>
                                                        new File(
                                                          [blobFile],
                                                          file,
                                                          {
                                                            type: 'text/html',
                                                          },
                                                        ),
                                                    );
                                                  let reader = new FileReader();
                                                  reader.onload = e => {
                                                    setFieldValue(
                                                      'contents',
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
                            <Row className="align-items-start">
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>
                                    Letter Contents:
                                    <span
                                      className="text_light text-decoration-underline d-block mt-1"
                                      onClick={() => {
                                        setLetterContentsStatus(
                                          !letterContentsStatus,
                                        );
                                      }}
                                    >
                                      Toggle Editor
                                    </span>
                                  </label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  {letterContentsStatus ? (
                                    <div className="card_content_right">
                                      <FormControl fullWidth className="max_33">
                                        <TextField
                                          multiline
                                          rows={3}
                                          placeholder="Enter Letter Contents"
                                          {...getFieldProps('contents')}
                                        />
                                      </FormControl>
                                    </div>
                                  ) : (
                                    <div className="custom_ckeditor">
                                      <CKEditor
                                        className="w-50"
                                        editor={ClassicEditor}
                                        data={values.contents}
                                        onChange={(event, editor) => {
                                          handleChange('contents')(
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
                                  <label>Active</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl>
                                    <RadioGroup
                                      row
                                      aria-labelledby="demo-radio-buttons-group-label"
                                      defaultValue="activeYes"
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
                              <Col xs={12}>
                                <p className="m-0">
                                  You can totally remove this letter from the
                                  system if it is no longer required. Note: the
                                  SKU will not become available again as
                                  previous bookings may be referenced against
                                  it. If you select 'Yes' then you will not be
                                  able to undo the delete without knowing the
                                  exact sku.
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
                                      defaultValue="deleteNo"
                                      name="radio-buttons-group"
                                      value={values.deleted}
                                      className="custom_radio"
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
                      </Col>
                    </Row>
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
