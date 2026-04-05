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
import { Col, Row } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  createTheme,
  getThemeData,
  setIsThemeUpdated,
  setThemeDetail,
  updateTheme,
} from 'store/reducers/Admin/Events/theme.slice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { ckEditorUploadImage } from 'store/reducers/UploadImage/uploadImage.slice';

export default function AddEditThemes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { themeId } = useParams();
  const initialValuesTheme = {
    sku: '',
    internal_name: '',
    public_name: '',
    description: '',
    theme_video: '',
    notes: '',
    is_active: false,
    deleted: false,
  };
  const [themeInitialValues, setThemeInitialValues] =
    useState(initialValuesTheme);
  const { isThemeUpdated, themeLoading, themeDetail } = useSelector(
    ({ theme }) => theme,
  );
  useEffect(() => {
    if (themeId) {
      dispatch(getThemeData(themeId));
    }
  }, [dispatch, themeId]);
  useEffect(() => {
    if (isThemeUpdated) {
      navigate('/admin/events/themes');
      dispatch(setThemeDetail({}));
      dispatch(setIsThemeUpdated(false));
    }
    return () => dispatch(setThemeDetail({}));
  }, [isThemeUpdated]);
  useEffect(() => {
    if (Object.keys(themeDetail).length > 0) {
      setThemeInitialValues({
        sku: themeDetail.sku,
        internal_name: themeDetail.internal_name,
        public_name: themeDetail.public_name,
        description: themeDetail.description ? themeDetail.description : '',
        theme_video: themeDetail.theme_video || '',
        notes: themeDetail.notes ? themeDetail.notes : '',
        is_active: themeDetail.is_active ? themeDetail.is_active : false,
        deleted: themeDetail?.deleted ? themeDetail?.deleted : false,
      });
    }
  }, [themeDetail]);
  const addEditThemesSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    internal_name: Yup.string()
      .required('Internal Name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public Name is a required field')
      .matches(/^[^\s]/, 'Public name cannot include leading spaces'),
    theme_video: Yup.string().matches(
      /^\d{8}$/,
      'Theme Video must be 8 digits',
    ),
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
      {themeLoading && <Loader />}
      <div className="addvenues_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Link to="/admin/events/themes">Themes</Link>
            <Typography>
              {!themeLoading && Object.keys(themeDetail).length === 0
                ? 'Add New Theme'
                : 'Edit Theme'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!themeLoading && Object.keys(themeDetail).length === 0
              ? 'Add New Theme'
              : 'Edit Theme'}
          </h1>
        </div>
        <div className="addvenues_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={themeInitialValues}
              validationSchema={addEditThemesSchema}
              onSubmit={values => {
                if (Object.keys(themeDetail).length > 0) {
                  dispatch(
                    updateTheme({ _id: themeDetail._id, theme: values }),
                  );
                } else {
                  dispatch(createTheme(values));
                }
              }}
            >
              {({
                handleSubmit,
                handleChange,
                values,
                getFieldProps,
                setFieldValue,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="card_body admin_card_body">
                    <ul>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                SKU<sup className="text_primary">*</sup>
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
                                  placeholder="Enter sku"
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
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Internal Name
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
                                  placeholder="Enter Internal name"
                                  {...getFieldProps('internal_name')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="internal_name" />
                            </span>
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
                                  placeholder="Enter public name"
                                  {...getFieldProps('public_name')}
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
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Description
                                <span className="d-block fw_400">
                                  This can be used in the event description by
                                  using the tag: [[theme_desc]]
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values.description}
                                onChange={(event, editor) => {
                                  handleChange('description')(editor.getData());
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
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Theme Code</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  placeholder="Enter theme code"
                                  {...getFieldProps('theme_video')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="theme_video" />
                            </span>
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
                              <label>Notes</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  multiline
                                  rows={2}
                                  {...getFieldProps('notes')}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={11}>
                            <p className="m-0">
                              You can totally remove this venue from the system
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
                                  value={values.deleted}
                                  name="radio-buttons-group"
                                  className="custom_radio"
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
