import React, { useState, useEffect } from 'react';
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
import { ErrorMessage, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  createFaqCategory,
  getFaqCategoryData,
  setFaqCategoryDetail,
  setIsFaqCategoryUpdated,
  updateFaqCategory,
} from 'store/reducers/Admin/FAQs/faqCategories.slice';
import * as Yup from 'yup';
import Loader from 'Components/Common/Loader';
export default function AddEditFaqCategories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { faqCategoryId } = useParams();

  const { isFaqCategoryUpdated, faqCategoryLoading, faqCategoryDetail } =
    useSelector(({ faqCategories }) => faqCategories);

  const initialValuesFaqCategory = {
    name: '',
    show_online: false,
    order: 0,
    is_active: false,
  };
  const [faqCategoryInitialValues, setFaqCategoryInitialValues] = useState(
    initialValuesFaqCategory,
  );

  useEffect(() => {
    if (faqCategoryId) {
      dispatch(getFaqCategoryData(faqCategoryId));
    }
  }, [dispatch, faqCategoryId]);

  useEffect(() => {
    if (isFaqCategoryUpdated) {
      navigate('/faqs-categories');
      dispatch(setFaqCategoryDetail({}));
      dispatch(setIsFaqCategoryUpdated(false));
    }
    return () => dispatch(setFaqCategoryDetail({}));
  }, [isFaqCategoryUpdated]);

  useEffect(() => {
    if (Object.keys(faqCategoryDetail).length > 0) {
      setFaqCategoryInitialValues({
        name: faqCategoryDetail?.name,
        order: faqCategoryDetail?.order ? faqCategoryDetail?.order : 0,

        show_online: faqCategoryDetail?.show_online
          ? faqCategoryDetail?.show_online
          : false,
        is_active: faqCategoryDetail?.is_active
          ? faqCategoryDetail?.is_active
          : false,
      });
    }
  }, [faqCategoryDetail]);

  const addEditFaqCategoryScheme = Yup.object().shape({
    name: Yup.string().required('Name is a required field'),
  });
  return (
    <div className="inner_wrapper">
      {faqCategoryLoading && <Loader />}
      <div className="addctgfaqs_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>FAQs</Typography>
            <Link to="/faqs-categories">FAQ Categories</Link>
            <Typography>
              {!faqCategoryLoading &&
              Object.keys(faqCategoryDetail).length === 0
                ? 'Add New FAQ Categories'
                : 'Edit FAQ Categories'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!faqCategoryLoading && Object.keys(faqCategoryDetail).length === 0
              ? 'Add New FAQ Category'
              : 'Edit FAQ Category'}
          </h1>
        </div>
        <h5 className="text_primary">
          {faqCategoryDetail?.name ? faqCategoryDetail?.name : 'New'}:
        </h5>
        <div className="addctgfaqs_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={faqCategoryInitialValues}
              validationSchema={addEditFaqCategoryScheme}
              onSubmit={values => {
                if (Object.keys(faqCategoryDetail).length > 0) {
                  dispatch(
                    updateFaqCategory({
                      _id: faqCategoryDetail._id,
                      faqCategory: values,
                    }),
                  );
                } else {
                  dispatch(createFaqCategory(values));
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
                                  <label>Name:</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <TextField
                                      placeholder="New"
                                      {...getFieldProps('name')}
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
                                      value={values.show_online}
                                      name="radio-buttons-group"
                                      className="custom_radio"
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
                                  <label>Order:</label>
                                </div>
                              </Col>
                              <Col xs={9}>
                                <div className="card_content_right">
                                  <FormControl fullWidth className="max_50">
                                    <TextField
                                      id="Order"
                                      type="number"
                                      onWheel={e => e.target.blur()}
                                      variant="outlined"
                                      {...getFieldProps('order')}
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
