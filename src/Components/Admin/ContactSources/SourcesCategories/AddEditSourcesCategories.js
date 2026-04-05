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
import { useDispatch, useSelector } from 'react-redux';
import {
  createSourceCategory,
  getSourceCategoryData,
  setIsSourceCategoryUpdated,
  setSourceCategoryDetail,
  updateSourceCategory,
} from 'store/reducers/Admin/Events/ContactSources/sourceCategory.slice';
import Loader from 'Components/Common/Loader';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';

export default function AddEditSourcesCategories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { sourceCategoryId } = useParams();

  const {
    isSourceCategoryUpdated,
    sourceCategoryLoading,
    sourceCategoryDetail,
  } = useSelector(({ sourceCategory }) => sourceCategory);

  const initialValuesSourceCategory = {
    name: '',
    show_online: false,
    order: 0,
    is_active: true,
  };

  const [sourceCategoryInitialValues, setSourceCategoryInitialValues] =
    useState(initialValuesSourceCategory);

  useEffect(() => {
    if (sourceCategoryId) {
      dispatch(getSourceCategoryData(sourceCategoryId));
    }
  }, [dispatch, sourceCategoryId]);

  useEffect(() => {
    if (isSourceCategoryUpdated) {
      navigate('/categories-sources');
      dispatch(setSourceCategoryDetail({}));
      dispatch(setIsSourceCategoryUpdated(false));
    }
    return () => {
      dispatch(setSourceCategoryDetail({}));
    };
  }, [isSourceCategoryUpdated]);

  useEffect(() => {
    if (Object.keys(sourceCategoryDetail)?.length > 0) {
      setSourceCategoryInitialValues({
        name: sourceCategoryDetail?.name,
        show_online: sourceCategoryDetail?.show_online,
        order: sourceCategoryDetail?.order,
        is_active: sourceCategoryDetail?.is_active
          ? sourceCategoryDetail?.is_active
          : false,
      });
    }
  }, [sourceCategoryDetail]);

  const addEditSourceCategorySchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[^\s]/, 'Name cannot include leading spaces')
      .required('Name is a required field'),
  });

  return (
    <div className="inner_wrapper">
      {sourceCategoryLoading && <Loader />}
      <div className="addctgsource_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/contact-sources">Contact Sources</Link>
            <Link to="/categories-sources">Current Sources Categories</Link>
            <Typography>
              {!sourceCategoryLoading &&
              Object.keys(sourceCategoryDetail).length === 0
                ? 'Add New Sources Category'
                : 'Edit Source Category'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!sourceCategoryLoading &&
            Object.keys(sourceCategoryDetail).length === 0
              ? 'Add New Sources Category'
              : 'Edit Source Category'}
          </h1>
        </div>
        <h5 className="text_primary">
          {sourceCategoryDetail?.name ? sourceCategoryDetail?.name : 'Name'}:
        </h5>
        <div className="addctgsource_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={sourceCategoryInitialValues}
              validationSchema={addEditSourceCategorySchema}
              onSubmit={values => {
                if (Object.keys(sourceCategoryDetail).length > 0) {
                  dispatch(
                    updateSourceCategory({
                      _id: sourceCategoryDetail._id,
                      sourceCategory: values,
                    }),
                  );
                } else {
                  dispatch(createSourceCategory(values));
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
                                  <sup className="text_primary">*</sup>
                                </div>
                              </Col>
                              <Col xs={4}>
                                <div className="card_content_right">
                                  <FormControl fullWidth>
                                    <TextField
                                      {...getFieldProps('name')}
                                      variant="outlined"
                                      placeholder="Enter name"
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
                                  <label>Show Online?</label>
                                </div>
                              </Col>
                              <Col xs={4}>
                                <div className="card_content_right">
                                  <FormControl>
                                    <RadioGroup
                                      row
                                      aria-labelledby="show-online-label"
                                      name="radio-buttons-group"
                                      value={values.show_online}
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
                              <Col xs={4}>
                                <div className="card_content_right">
                                  <FormControl fullWidth>
                                    <TextField
                                      type="number"
                                      onWheel={e => e.target.blur()}
                                      {...getFieldProps('order')}
                                      variant="outlined"
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
                        </ul>
                      </Col>
                    </Row>
                    <div className="card_footer admin_card_footer mb-2">
                      <button type="submit" className="btn_border small">
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
