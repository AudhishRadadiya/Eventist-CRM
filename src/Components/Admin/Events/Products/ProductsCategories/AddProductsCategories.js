import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../../Assets/Img/home-breadcrumbs.svg';
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
import * as Yup from 'yup';
import {
  createProductCategory,
  getProductCategoryData,
  setIsProductCategoryUpdated,
  setProductCategoryDetail,
  updateProductCategory,
} from 'store/reducers/Admin/Events/ProductCategory/productCategory.slice';
import Loader from 'Components/Common/Loader';
import { numberRegex } from 'utils/common';

export default function AddProductsCategories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { productCategoryId } = useParams();

  const initialValuesProductCategory = {
    sku: '',
    internal_name: '',
    public_name: '',
    description: '',
    order: 0,
    show_online: false,
    is_active: false,
    deleted: false,
  };

  const [productCategoryInitialValues, setProductCategoryInitialValues] =
    useState(initialValuesProductCategory);

  const {
    isProductCategoryUpdated,
    productCategoryLoading,
    productCategoryDetail,
  } = useSelector(({ productCategory }) => productCategory);

  useEffect(() => {
    if (productCategoryId) {
      dispatch(getProductCategoryData(productCategoryId));
    }
  }, [dispatch, productCategoryId]);

  useEffect(() => {
    if (isProductCategoryUpdated) {
      navigate('/admin/products/products-categories');
      dispatch(setProductCategoryDetail({}));
      dispatch(setIsProductCategoryUpdated(false));
    }
    return () => dispatch(setProductCategoryDetail({}));
  }, [isProductCategoryUpdated]);

  useEffect(() => {
    if (Object.keys(productCategoryDetail)?.length > 0) {
      setProductCategoryInitialValues({
        sku: productCategoryDetail?.sku,
        internal_name: productCategoryDetail?.internal_name,
        public_name: productCategoryDetail?.public_name,
        description: productCategoryDetail?.description,
        order: productCategoryDetail?.order,
        show_online: productCategoryDetail?.show_online,
        is_active: productCategoryDetail?.is_active,
        deleted: productCategoryDetail?.deleted,
      });
    }
  }, [productCategoryDetail]);

  const addEditProductCategorySchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    internal_name: Yup.string()
      .required('Internal name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public name is a required field')
      .matches(/^[^\s]/, 'Public name cannot include leading spaces'),
    order: Yup.number().required('Order is a required filed'),
  });

  return (
    <div className="inner_wrapper">
      {productCategoryLoading && <Loader />}
      <div className="addproductctg_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/products/products-categories">Categories</Link>
            <Typography>
              {!productCategoryLoading &&
              Object.keys(productCategoryDetail).length === 0
                ? 'Add New Product Category'
                : 'Edit Product Category'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!productCategoryLoading &&
            Object.keys(productCategoryDetail).length === 0
              ? 'Add New Product Category'
              : 'Edit Product Category'}
          </h1>
        </div>
        <div className="addproductctg_wrap">
          <h5 className="text_primary">
            {productCategoryDetail?.internal_name}
          </h5>
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={productCategoryInitialValues}
              validationSchema={addEditProductCategorySchema}
              onSubmit={values => {
                if (Object.keys(productCategoryDetail).length > 0) {
                  dispatch(
                    updateProductCategory({
                      _id: productCategoryDetail._id,
                      productCategory: values,
                    }),
                  );
                } else {
                  dispatch(createProductCategory(values));
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
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                SKU<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  {...getFieldProps('sku')}
                                  placeholder="Enter sku"
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="sku" />
                              </span>
                            </div>
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
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  {...getFieldProps('internal_name')}
                                  placeholder="Enter internal name"
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
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  {...getFieldProps('public_name')}
                                  placeholder="Enter public name"
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
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Description</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl fullWidth>
                                <TextField
                                  multiline
                                  rows={4}
                                  {...getFieldProps('description')}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Order
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  type="number"
                                  onKeyDown={e => {
                                    numberRegex(e);
                                  }}
                                  inputProps={{ min: 0 }}
                                  onBlurCapture={() => {
                                    setFieldValue(
                                      'order',
                                      Number(values.order).toFixed(2),
                                    );
                                  }}
                                  {...getFieldProps('order')}
                                  variant="outlined"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="order" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Show Category Online</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="show-online-label"
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
