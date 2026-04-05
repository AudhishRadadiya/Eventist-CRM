import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
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
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDispatch, useSelector } from 'react-redux';
import { getVenueListData } from 'store/reducers/Admin/Events/venue.slice';
import {
  createFaq,
  getFaqData,
  setFaqDetail,
  setIsFaqUpdated,
  updateFaq,
} from 'store/reducers/Admin/FAQs/faq.slice';
import Loader from 'Components/Common/Loader';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik } from 'formik';
import { limitType } from 'utils/FieldValues';
import { getFaqCategoryListData } from 'store/reducers/Admin/FAQs/faqCategories.slice';
import { ckEditorUploadImage } from 'store/reducers/UploadImage/uploadImage.slice';

export default function AddEditFaqs() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { faqId } = useParams();

  const { activeFaqCategoryList } = useSelector(
    ({ faqCategories }) => faqCategories,
  );
  const { activeVenueList } = useSelector(({ venue }) => venue);
  const { isFaqUpdated, faqDetail, faqLoading } = useSelector(({ faq }) => faq);
  const [toggleEditor, setToggleEditor] = useState(false);

  const currentYear = new Date().getFullYear();
  const eventYear = faqDetail?.year || currentYear;
  const pastYear = eventYear - 1;
  const futureYear = currentYear + 1;

  const yearsArrayEditEvent = Array.from(
    { length: futureYear - pastYear + 1 },
    (_, index) => pastYear + index,
  );

  const initialValuesFaqs = {
    FAQ_category: '',
    name: '',
    question: '',
    answer: '',
    year: '',
    show_online: false,
    featured: false,
    order: 0,
    extra_info_internal_only: '',
    limit_type: 0,
    venues: [],
    is_active: false,
  };

  const [faqsInitialValues, setFaqsInitialValues] = useState(initialValuesFaqs);

  useEffect(() => {
    dispatch(getFaqCategoryListData());
    dispatch(getVenueListData());
  }, [dispatch]);

  useEffect(() => {
    if (faqId) {
      dispatch(getFaqData(faqId));
    }
  }, [dispatch, faqId]);

  useEffect(() => {
    if (isFaqUpdated) {
      navigate('/faqs');
      dispatch(setFaqDetail({}));
      dispatch(setIsFaqUpdated(false));
    }
    return () => {
      dispatch(setFaqDetail({}));
    };
  }, [isFaqUpdated]);

  useEffect(() => {
    if (Object.keys(faqDetail)?.length > 0) {
      setFaqsInitialValues({
        FAQ_category: faqDetail?.FAQ_category,
        name: faqDetail?.name,
        question: faqDetail?.question,
        answer: faqDetail?.answer,
        year: faqDetail?.year ? faqDetail?.year : 'anyYear',
        show_online: faqDetail?.show_online,
        featured: faqDetail?.featured,
        order: faqDetail?.order,
        extra_info_internal_only: faqDetail?.extra_info_internal_only,
        limit_type: faqDetail?.limit_type,
        venues: faqDetail?.venues,
        is_active: faqDetail?.is_active ? faqDetail?.is_active : false,
      });
    }
  }, [faqDetail]);

  const addEditFaqScheme = Yup.object().shape({
    FAQ_category: Yup.string().required('FAQ ategory is a required field'),
    name: Yup.string()
      .matches(/^[^\s]/, 'Name cannot include leading spaces')
      .required('Name is a required field'),
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
      {faqLoading && <Loader />}
      <div className="addfaqs_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/faqs">FAQs</Link>
            <Typography>
              {!faqLoading && Object.keys(faqDetail).length === 0
                ? 'Add New FAQ'
                : 'Edit FAQ'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row>
            <Col xs={6}>
              <h1>
                {!faqLoading && Object.keys(faqDetail).length === 0
                  ? 'Add New FAQ'
                  : 'Edit FAQ'}
              </h1>
            </Col>
            <Col xs={6} className="text-end">
              <Link to="/faqs" className="btn_border small mx-2">
                Back to FAQs
              </Link>
              <Link to="/faqs-categories" className="btn_border small">
                View FAQs Categories
              </Link>
            </Col>
          </Row>
        </div>
        <h5 className="text_primary">
          {faqDetail?.name ? faqDetail?.name : 'New FAQ'}:
        </h5>
        <div className="addfaqs_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={faqsInitialValues}
              validationSchema={addEditFaqScheme}
              onSubmit={values => {
                const yearValue = values.year === 'anyYear' ? '' : values?.year;
                if (Object.keys(faqDetail).length > 0) {
                  dispatch(
                    updateFaq({
                      _id: faqDetail._id,
                      faq: { ...values, year: yearValue },
                    }),
                  );
                } else {
                  dispatch(createFaq({ ...values, year: yearValue }));
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
                        <ul className="custom_admin_card_inner mb-3">
                          <li>
                            <Row>
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>
                                    FAQ Category:{' '}
                                    <sup className="text_primary">*</sup>
                                  </label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <Select
                                      labelId="faqCategory-label"
                                      id="FAQ_category"
                                      name="FAQ_category"
                                      value={values.FAQ_category}
                                      onChange={handleChange}
                                      className="select_wrap"
                                    >
                                      <MenuItem value="pleaseSelect" disabled>
                                        Please Select
                                      </MenuItem>
                                      {activeFaqCategoryList?.map(item => {
                                        return (
                                          <MenuItem
                                            key={item}
                                            value={item?._id}
                                          >
                                            {item?.name}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="FAQ_category" />
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
                                    FAQ Name:{' '}
                                    <sup className="text_primary">*</sup>
                                    <span className="d-block text_light fw_400">
                                      This is for internal use only
                                    </span>
                                  </label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <TextField
                                      {...getFieldProps('name')}
                                      placeholder="Enter name"
                                    />
                                  </FormControl>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="name" />
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          </li>
                          <li>
                            <Row className="align-items-start">
                              <Col xs={3}>
                                <div className="card_content_left">
                                  <label>FAQ Question:</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <TextField
                                      id="faqQuestion"
                                      multiline
                                      rows={3}
                                      variant="outlined"
                                      {...getFieldProps('question')}
                                      placeholder="Enter question"
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
                                  <label>
                                    FAQ Answer:
                                    <span
                                      className="text_light text-decoration-underline d-block mt-1 fw_400"
                                      onClick={() => {
                                        setToggleEditor(!toggleEditor);
                                      }}
                                    >
                                      Toggle Editor
                                    </span>
                                  </label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  {toggleEditor ? (
                                    <FormControl fullWidth className="max_50">
                                      <TextField
                                        id="faqQuestion"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        placeholder="Enter"
                                        {...getFieldProps('answer')}
                                      />
                                    </FormControl>
                                  ) : (
                                    <div className="custom_ckeditor">
                                      <CKEditor
                                        editor={ClassicEditor}
                                        data={values.answer}
                                        onChange={(event, editor) => {
                                          handleChange('answer')(
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
                                  <label>FAQ Year:</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <Select
                                      labelId="year-label"
                                      id="faqYear"
                                      value={values.year}
                                      name="year"
                                      onChange={handleChange}
                                      className="select_wrap"
                                      defaultValue="anyYear"
                                    >
                                      <MenuItem value="anyYear">
                                        Any year
                                      </MenuItem>
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
                                  <label>Show Online?</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl>
                                    <RadioGroup
                                      row
                                      aria-labelledby="show-online-label"
                                      defaultValue="showOnlineYes"
                                      name="radio-buttons-group"
                                      className="custom_radio"
                                      value={values.show_online}
                                      onChange={() =>
                                        setFieldValue(
                                          'show_online',
                                          !values.show_online,
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
                                  <label>Is Featured?</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl>
                                    <RadioGroup
                                      row
                                      aria-labelledby="show-online-label"
                                      defaultValue="showOnlineYes"
                                      name="radio-buttons-group"
                                      className="custom_radio"
                                      value={values.featured}
                                      onChange={() =>
                                        setFieldValue(
                                          'featured',
                                          !values.featured,
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
                                  <label>Order:</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <TextField
                                      type="number"
                                      onWheel={e => e.target.blur()}
                                      placeholder="100"
                                      {...getFieldProps('order')}
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
                                  <label>Extra Info (internal only)</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <TextField
                                      id="faqExtraInfo"
                                      multiline
                                      rows={3}
                                      variant="outlined"
                                      placeholder="Enter Description"
                                      value={values.extra_info_internal_only}
                                      onChange={e => {
                                        handleChange(
                                          'extra_info_internal_only',
                                        )(e.target.value);
                                      }}
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
                                  <label>Active</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl>
                                    <RadioGroup
                                      row
                                      aria-labelledby="active-label"
                                      defaultValue="activeYes"
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
                        </ul>
                      </Col>
                    </Row>
                    <h5 className="text_primary ps-2">Limit to Venues</h5>
                    <ul className="limit_venue_wrap">
                      <li>
                        <div className="card_content_left">
                          <label>Limit Type:</label>
                        </div>
                        <div className="card_content_right">
                          <Row>
                            <Col xs={4}>
                              <FormControl fullWidth className="limit_input">
                                <Select
                                  labelId="limitTypeLabel"
                                  id="limitType"
                                  value={values.limit_type}
                                  name="limit_type"
                                  onChange={handleChange}
                                  className="select_wrap"
                                >
                                  {limitType.map(item => {
                                    return (
                                      <MenuItem value={item.value}>
                                        {item.label}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </Col>
                          </Row>
                        </div>
                      </li>
                      {values?.limit_type !== 0 && (
                        <li className="align-items-start">
                          <div className="card_content_left">
                            <label>Venues</label>
                          </div>
                          <div className="card_content_right">
                            <Row className="align-items-center">
                              {activeVenueList?.map(item => {
                                return (
                                  <Col
                                    className="col-xl-3 col-4"
                                    key={item?._id}
                                  >
                                    <div className="form-group checkbox_wrap mb-2">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="venues"
                                          value={item?._id}
                                          label={item?.sku}
                                          checked={values?.venues.includes(
                                            item?._id,
                                          )}
                                          onChange={handleChange}
                                        />
                                      </FormGroup>
                                    </div>
                                  </Col>
                                );
                              })}
                            </Row>
                          </div>
                        </li>
                      )}
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
