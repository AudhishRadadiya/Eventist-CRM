import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
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
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPages,
  getPagesData,
  updatePages,
  setIsPagesUpdated,
  setPagesDetail,
} from 'store/reducers/Admin/Events/pages.slice';
import Loader from 'Components/Common/Loader';
import { ckEditorUploadImage } from 'store/reducers/UploadImage/uploadImage.slice';
export default function AddEditPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { pagesId } = useParams();
  const initialValuesPage = {
    uri: '',
    name: '',
    title: '',
    description: '',
    meta_title: '',
    meta_description: '',
    background: '',
    darken_background: true,
    full_width_content: false,
    content: '',
    secondary_content: '',
    seo_text: '',
    is_active: false,
    deleted: false,
  };
  const { pagesLoading, isPagesUpdated, pagesDetail } = useSelector(
    ({ pages }) => pages,
  );
  const [pagesInitialValues, setPagesInitialValues] =
    useState(initialValuesPage);
  const [pageContentStatus, setPageContentStatus] = useState(false);
  const [secondaryPageContentStatus, setSecondaryPageContentStatus] =
    useState(false);
  const [pageSeoTextStatus, setPageSeoTextStatus] = useState(false);
  useEffect(() => {
    if (pagesId) {
      dispatch(getPagesData(pagesId));
    }
  }, [dispatch, pagesId]);
  useEffect(() => {
    if (isPagesUpdated) {
      navigate('/pages');
      dispatch(setPagesDetail({}));
      dispatch(setIsPagesUpdated(false));
    }
    return () => dispatch(setPagesDetail({}));
  }, [dispatch, navigate, isPagesUpdated]);
  useEffect(() => {
    if (Object.keys(pagesDetail).length > 0) {
      setPagesInitialValues({
        uri: pagesDetail.uri ? pagesDetail.uri : '',
        name: pagesDetail.name ? pagesDetail.name : '',
        title: pagesDetail.title ? pagesDetail.title : '',
        description: pagesDetail.description ? pagesDetail.description : '',
        meta_title: pagesDetail.meta_title ? pagesDetail.meta_title : '',
        meta_description: pagesDetail.meta_description
          ? pagesDetail.meta_description
          : '',
        background: pagesDetail.background ? pagesDetail.background : '',
        darken_background: pagesDetail.darken_background
          ? pagesDetail.darken_background
          : false,
        full_width_content: pagesDetail.full_width_content
          ? pagesDetail.full_width_content
          : false,
        content: pagesDetail.content ? pagesDetail.content : '',
        secondary_content: pagesDetail.secondary_content
          ? pagesDetail.secondary_content
          : '',
        seo_text: pagesDetail.seo_text ? pagesDetail.seo_text : '',
        is_active: pagesDetail.is_active ? pagesDetail.is_active : false,
        deleted: pagesDetail.deleted ? pagesDetail.deleted : false,
      });
    }
  }, [pagesDetail]);
  const addEditPagesSchema = Yup.object().shape({
    uri: Yup.string().required('Page URL is a required field'),
    name: Yup.string().required('Page name is a required field'),
    title: Yup.string().required('Page title is a required field'),
    description: Yup.string().required('Page description is a required field'),
    meta_title: Yup.string().required('Page meta title is a required field'),
    meta_description: Yup.string().required(
      'Page meta description is a required field',
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
      {pagesLoading && <Loader />}
      <div className="addletter_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/pages">Pages</Link>
            <Typography>
              {!pagesLoading && Object.keys(pagesDetail).length === 0
                ? 'Add New Page'
                : 'Edit Page'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!pagesLoading && Object.keys(pagesDetail).length === 0
              ? 'Add New Page'
              : 'Edit Page'}
          </h1>
        </div>
        <div className="addletter_wrap">
          <h5 className="text_primary">
            {pagesDetail?.name ? pagesDetail?.name : 'New Page'}
          </h5>
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={pagesInitialValues}
              validationSchema={addEditPagesSchema}
              onSubmit={values => {
                if (Object.keys(pagesDetail).length > 0) {
                  dispatch(
                    updatePages({ _id: pagesDetail._id, pages: values }),
                  );
                } else {
                  dispatch(createPages(values));
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
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Page URL<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  name="uri"
                                  placeholder="Enter URL"
                                  value={values.uri.split(' ').join('_')}
                                  onChange={handleChange}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="uri" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Page Name<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  placeholder="Enter Page name"
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
                                Page Title<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  placeholder="Enter page title"
                                  {...getFieldProps('title')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="title" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Page Description
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter description"
                                  {...getFieldProps('description')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="description" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Page Meta (SEO) Title* (max 67 characters)
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Page Meta Title"
                                  {...getFieldProps('meta_title')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="meta_title" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Page Meta (SEO) Description* (mac 155
                                characters)<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="w-100 main_input_wrap"
                              >
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Page Meta Description"
                                  {...getFieldProps('meta_description')}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="meta_description" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Page Background:</label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  placeholder="Enter Background"
                                  {...getFieldProps('background')}
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
                              <label>Darken Background?</label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="darken-background-label"
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  value={values.darken_background}
                                  onChange={() =>
                                    setFieldValue(
                                      'darken_background',
                                      !values.darken_background,
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
                              <label>Full Width Content?</label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="full-width-label"
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  value={values.full_width_content}
                                  onChange={() =>
                                    setFieldValue(
                                      'full_width_content',
                                      !values.full_width_content,
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
                        <Row className="align-items-start">
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Page Content:
                                <span
                                  className="text_light text-decoration-underline d-block mt-1"
                                  onClick={() => {
                                    setPageContentStatus(!pageContentStatus);
                                  }}
                                >
                                  Toggle Editor
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            {pageContentStatus ? (
                              <div className="card_content_right">
                                <FormControl fullWidth className="max_33">
                                  <TextField
                                    multiline
                                    rows={3}
                                    placeholder="Enter Page Content:"
                                    {...getFieldProps('content')}
                                  />
                                </FormControl>
                              </div>
                            ) : (
                              <div className="card_content_right">
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={values.content}
                                  onChange={(event, editor) => {
                                    handleChange('content')(editor.getData());
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
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Secondary Page Content This is only used on
                                certain templates
                                <span
                                  className="text_light text-decoration-underline d-block mt-1"
                                  onClick={() => {
                                    setSecondaryPageContentStatus(
                                      !secondaryPageContentStatus,
                                    );
                                  }}
                                >
                                  Toggle Editor
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            {secondaryPageContentStatus ? (
                              <div className="card_content_right">
                                <FormControl fullWidth className="max_33">
                                  <TextField
                                    multiline
                                    rows={3}
                                    placeholder="Enter Secondary Page Content This is only used on certain templates"
                                    {...getFieldProps('secondary_content')}
                                  />
                                </FormControl>
                              </div>
                            ) : (
                              <div className="card_content_right">
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={values.secondary_content}
                                  onChange={(event, editor) => {
                                    handleChange('secondary_content')(
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
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Page SEO Text:
                                <span
                                  className="text_light text-decoration-underline d-block mt-1"
                                  onClick={() => {
                                    setPageSeoTextStatus(!pageSeoTextStatus);
                                  }}
                                >
                                  Toggle Editor
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={6}>
                            {pageSeoTextStatus ? (
                              <div className="card_content_right">
                                <FormControl fullWidth className="max_33">
                                  <TextField
                                    multiline
                                    rows={3}
                                    placeholder="Enter Page SEO Text:"
                                    {...getFieldProps('seo_text')}
                                  />
                                </FormControl>
                              </div>
                            ) : (
                              <div className="card_content_right">
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={values.seo_text}
                                  onChange={(event, editor) => {
                                    handleChange('seo_text')(editor.getData());
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
                                  aria-labelledby="active-label"
                                  name="radio-buttons-group"
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
                            </div>
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
                                  aria-labelledby="delete-label"
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
