import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Col, Row } from 'react-bootstrap';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  createProduct,
  getAvailaleEvent,
  getProductData,
  setIsProductUpdated,
  setProductDetail,
  updateProduct,
} from 'store/reducers/Admin/Events/ProductCategory/product.slice';
import Loader from 'Components/Common/Loader';
import {
  getUniqueYears,
  yearsTwoYearsInThePastFourYearInTheFuture,
} from 'utils/FieldValues';
import { getTaxCodesListData } from 'store/reducers/Admin/Financial/taxCodes.slice';
import { getBillableItemsListData } from 'store/reducers/Admin/Financial/billableItems.slice';
import { getProductCategoryListData } from 'store/reducers/Admin/Events/ProductCategory/productCategory.slice';
import { getSalesRulesListData } from 'store/reducers/Admin/Events/salesRules.slice';
import { numberRegex } from 'utils/common';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';

export default function AddEditProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { productId } = useParams();
  const [isChecked, setIsChecked] = useState(false);
  const [showData, setShowData] = useState([]);

  const {
    isProductUpdated,
    productLoading,
    productDetail,
    availableAtEvent,
    availableAtEventLoading,
  } = useSelector(({ product }) => product);

  // const { activeEventList } = useSelector(({ parties }) => parties);

  // Assuming 'events' is the array you provided
  // const uniqueYears = getUniqueYears(activeEventList);
  const [eventData, setEventData] = useState([]);

  const initialValuesProduct = {
    years: [],
    sku: '',
    internal_name: '',
    public_name: '',
    category: '',
    description: '',
    add_to_kpis_report: 1,
    gross_price: '',
    tax_code: '',
    price_rules: [],
    expiry_date: new Date(),
    is_exclusive: isChecked,
    allow_online_ordering: isChecked,
    show_on_bpe_venue_page: isChecked,
    feature_on_bpe_venue_page: isChecked,
    set_order_if_featured: 0,
    bin_id: '',
    is_trackable: isChecked,
    trackable_multiplier: 0,
    notes: '',
    show_on_drinks_summary: true,
    is_active: true,
    deleted: false,
    bill_as: '',
    disable_auto_invoice: false,
    available_at_events: [{ event_id: '', date: [] }],
  };

  useEffect(() => {
    let dummyList = availableAtEvent.map(e => {
      let dd = e.event_date_data.map(ii => ({
        ...ii,
        selected: false,
      }));
      return { ...e, masterCheck: false, event_date_data: dd };
    });
    setEventData(dummyList);
  }, [availableAtEvent]);
  const [productAvailableEventList, setProductAvailableEventList] = useState({
    List: [],
    SelectedList: [],
  });
  const toggleShowData = itemId => {
    setShowData(prevState =>
      prevState?.includes(itemId)
        ? prevState.filter(id => id !== itemId)
        : [...prevState, itemId],
    );
  };

  const [productInitialValues, setProductInitialValues] =
    useState(initialValuesProduct);
  useEffect(() => {
    if (eventData?.length > 0) {
      setProductAvailableEventList({
        ...productAvailableEventList,
        List: eventData,
      });
    }
  }, [eventData]);
  const { search } = useLocation();
  const isCloning = new URLSearchParams(search).get('clone') === 'true';

  const { activeTaxCodesList } = useSelector(({ taxCodes }) => taxCodes);
  const { activeBillableItemsList } = useSelector(
    ({ billableItems }) => billableItems,
  );
  const { activeProductCategoryList } = useSelector(
    ({ productCategory }) => productCategory,
  );
  const { activeSalesRulesList } = useSelector(({ salesRules }) => salesRules);

  useEffect(() => {
    if (productId) dispatch(getProductData(productId));
    dispatch(getEventListData());
  }, [productId]);

  useEffect(() => {
    if (isProductUpdated) {
      navigate(-1);
      dispatch(setIsProductUpdated(false));
    }
  }, [isProductUpdated]);

  useEffect(() => {
    dispatch(getTaxCodesListData());
    dispatch(getBillableItemsListData());
    dispatch(getProductCategoryListData());
    dispatch(getSalesRulesListData());
    dispatch(getAvailaleEvent());
    return () => dispatch(setProductDetail({}));
  }, []);

  useEffect(() => {
    if (Object.keys(productDetail)?.length > 0 && eventData?.length > 0) {
      setProductInitialValues({
        sku: productDetail?.sku,
        years: productDetail?.years,
        internal_name: productDetail?.internal_name,
        public_name: productDetail?.public_name,
        category: productDetail?.category,
        description: productDetail?.description,
        add_to_kpis_report: productDetail?.add_to_kpis_report,
        gross_price: productDetail?.gross_price,
        tax_code: productDetail?.tax_code,
        price_rules: productDetail?.price_rules,
        expiry_date: productDetail?.expiry_date,
        is_exclusive: productDetail?.is_exclusive,
        allow_online_ordering: productDetail?.allow_online_ordering,
        show_on_bpe_venue_page: productDetail?.show_on_bpe_venue_page,
        feature_on_bpe_venue_page: productDetail?.feature_on_bpe_venue_page,
        set_order_if_featured: productDetail?.set_order_if_featured,
        bin_id: productDetail?.bin_id,
        is_trackable: productDetail?.is_trackable,
        trackable_multiplier: productDetail?.trackable_multiplier,
        notes: productDetail?.notes,
        show_on_drinks_summary: productDetail?.show_on_drinks_summary,
        is_active: productDetail?.is_active,
        deleted: productDetail?.deleted,
        bill_as: productDetail?.bill_as,
        disable_auto_invoice: productDetail?.disable_auto_invoice,
        available_at_events: productDetail?.available_at_events,
        tax_code_data: productDetail?.tax_code_data,
        net_price: productDetail?.net_price,
      });
      const availabilityList = eventData?.map(item1 => {
        const isEvent = productDetail?.available_at_events?.find(
          item2 => item1._id === item2.event_id,
        );

        if (isEvent?.date) {
          const dateObj = item1?.event_date_data?.map(item3 => {
            if (isEvent?.date?.includes(item3._id)) {
              return { ...item3, selected: true };
            }
            return item3;
          });
          return { ...item1, event_date_data: dateObj, masterCheck: true };
        }
        return item1;
      });

      let newList = availabilityList?.filter(item => {
        return item.masterCheck;
      });
      let listData = newList?.map(i => {
        let newObj = {};
        let abc = i.event_date_data?.filter(i1 => {
          return i1.selected;
        });
        let list = abc?.map(item => {
          return item._id;
        });
        newObj = { date: list, event_id: i._id };
        return newObj;
      });
      setProductAvailableEventList({
        ...productAvailableEventList,
        List: availabilityList,
        SelectedList: listData,
      });
    }
  }, [productDetail, eventData]);

  const commanValidation = {
    years: Yup.array()
      .min(1, 'Please select at least one year')
      .required('Please select at least one year'),
    internal_name: Yup.string()
      .required('Internal Name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public Name is a required field')
      .matches(/^[^\s]/, 'Public name cannot include leading spaces'),
    category: Yup.string().required('Category is a required field'),
    bill_as: Yup.string().required('Bill as is a required field'),
    expiry_date: Yup.date()
      .notRequired()
      .typeError('Please enter a date in the format dd/mm/yyyy'),
    tax_code: Yup.string().required('Tax Code is a required field'),
  };
  const cloneValidationSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces')
      .test('SKU already exist', 'Please use different SKU', function (value) {
        return isCloning ? productInitialValues?.sku !== value : '';
      }),
    ...commanValidation,
  });
  const addEditValidationSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    ...commanValidation,
  });
  const onMasterCheck = (e, data, value) => {
    let abc = [];
    let tempList = productAvailableEventList.List?.map(item => {
      if (item._id === data._id) {
        abc = item.event_date_data?.map(ii => {
          return {
            ...ii,
            selected: value,
          };
        });
        return { ...item, event_date_data: abc };
      } else {
        return item;
      }
    });
    let newList = tempList?.filter(item => {
      return item.masterCheck;
    });

    let listData = newList?.map(i => {
      let newObj = {};
      let abc = i.event_date_data?.filter(i1 => {
        return i1.selected;
      });
      let list = abc?.map(item => {
        return item._id;
      });
      newObj = { date: list, event_id: i._id };
      return newObj;
    });
    setProductAvailableEventList({
      ...productAvailableEventList,
      List: tempList,
      SelectedList: listData,
    });
  };
  const onItemCheck = (e, data, value, name) => {
    let abc = [];
    let tempList = productAvailableEventList.List?.map(item => {
      if (item._id === data._id) {
        abc = item.event_date_data?.map(ii => {
          if (name === 'master') {
            return {
              ...ii,
              selected: e.target.checked,
            };
          } else {
            if (ii._id === value._id) {
              return {
                ...ii,
                selected: e.target.checked,
              };
            } else {
              return {
                ...ii,
              };
            }
          }
        });

        let xyz = abc?.filter(i => {
          return i.selected;
        });
        if (name === 'master') {
          return {
            ...item,
            event_date_data: abc,
            masterCheck: e.target.checked,
          };
        } else {
          if (xyz?.length > 0) {
            return { ...item, event_date_data: abc, masterCheck: true };
          } else {
            return { ...item, event_date_data: abc };
          }
        }
      } else {
        return item;
      }
    });

    let newList = tempList?.filter(item => {
      return item.masterCheck;
    });

    let listData = newList?.map(i => {
      let newObj = {};
      let abc = i.event_date_data?.filter(i1 => {
        return i1.selected;
      });
      let list = abc?.map(item => {
        return item._id;
      });
      newObj = { date: list, event_id: i._id };
      return newObj;
    });

    setProductAvailableEventList({
      ...productAvailableEventList,
      List: tempList,
      SelectedList: listData,
    });
  };
  const handleMainSelect = value => {
    let tempList = productAvailableEventList.List?.map(item => {
      const updateDates = item.event_date_data.map(_ => {
        return {
          ..._,
          selected: value,
        };
      });
      return { ...item, masterCheck: value, event_date_data: updateDates };
    });
    let listData = tempList?.map(i => {
      return { event_id: i._id, date: i.event_date_data.map(_ => _._id) };
    });
    if (value) {
      setProductAvailableEventList({
        ...productAvailableEventList,
        List: tempList,
        SelectedList: listData,
      });
    } else {
      setProductAvailableEventList({
        ...productAvailableEventList,
        List: tempList,
        SelectedList: [],
      });
    }
  };

  return (
    <div className="inner_wrapper">
      {productLoading && <Loader />}
      {availableAtEventLoading && <Loader />}
      <div className="addproduct_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Event</Typography>
            <Link to="/admin/products">Products</Link>
            <Typography>
              {isCloning
                ? 'Clone Product'
                : !productLoading && Object.keys(productDetail).length === 0
                ? 'Add New Product '
                : 'Edit Product '}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {isCloning
              ? 'Clone Product'
              : !productLoading && Object.keys(productDetail).length === 0
              ? 'Add New Product '
              : 'Edit Product '}
          </h1>
        </div>
        <div className="addproduct_wrap">
          <Formik
            enableReinitialize={true}
            initialValues={productInitialValues}
            validationSchema={
              isCloning ? cloneValidationSchema : addEditValidationSchema
            }
            onSubmit={values => {
              const data = {
                ...values,
                available_at_events: productAvailableEventList.SelectedList,
                set_order_if_featured: Number(values.set_order_if_featured),
                add_to_kpis_report: Number(values.add_to_kpis_report),
                trackable_multiplier: Number(values.trackable_multiplier),
              };
              if (isCloning) {
                dispatch(createProduct(data));
              } else if (Object.keys(productDetail).length > 0) {
                dispatch(
                  updateProduct({
                    _id: productDetail._id,
                    product: data,
                  }),
                );
              } else {
                dispatch(createProduct(data));
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
                <Row>
                  <Col lg={6}>
                    <div className="event_detail_wrap">
                      <div className="card_wrapper mb-3">
                        {productDetail?.internal_name && (
                          <div className="card_header py-2 px-3">
                            <h4 className="m-0 py-1 text_white">
                              {productDetail?.internal_name}
                            </h4>
                          </div>
                        )}

                        <div className="card_body admin_card_body">
                          <ul>
                            <li>
                              <Row className="align-items-start">
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Year<sup className="text_primary">*</sup>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <ul>
                                      {/* {uniqueYears?.map(item => { */}
                                      {yearsTwoYearsInThePastFourYearInTheFuture?.map(
                                        item => {
                                          return (
                                            <li key={item}>
                                              <div className="form-group checkbox_wrap mb-2">
                                                <Field
                                                  type="checkbox"
                                                  name="years"
                                                  as={FormControlLabel}
                                                  control={<Checkbox />}
                                                  label={item}
                                                  value={item}
                                                  checked={values.years?.includes(
                                                    item,
                                                  )}
                                                  onChange={e => {
                                                    const checked =
                                                      e.target.checked;
                                                    const value = Number(
                                                      e.target.value,
                                                    );
                                                    if (checked) {
                                                      setFieldValue('years', [
                                                        ...values.years,
                                                        value,
                                                      ]);
                                                    } else {
                                                      setFieldValue(
                                                        'years',
                                                        values.years.filter(
                                                          e => e !== value,
                                                        ),
                                                      );
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </li>
                                          );
                                        },
                                      )}
                                      <span className="d-block text-danger text_small">
                                        <ErrorMessage name="years" />
                                      </span>
                                    </ul>
                                  </div>
                                </Col>
                              </Row>
                            </li>
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
                                        id="SKU"
                                        type="text"
                                        variant="outlined"
                                        {...getFieldProps('sku')}
                                        placeholder="Enter sku"
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
                                        id="internalName"
                                        type="text"
                                        variant="outlined"
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
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        id="publicName"
                                        type="text"
                                        variant="outlined"
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
                                    <label>
                                      Description
                                      <span className="d-block fw_400">
                                        This is used for featured products and
                                        is shown in the online shopping cart
                                      </span>
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
                                        rows={2.5}
                                        multiline
                                        id="description"
                                        type="text"
                                        variant="outlined"
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
                                      Category
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
                                      <Select
                                        labelId="Category"
                                        value={values.category}
                                        id="category"
                                        name="category"
                                        defaultValue={values.category}
                                        onChange={handleChange}
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem
                                          value="SelectCategory"
                                          disabled
                                        >
                                          Select Category
                                        </MenuItem>
                                        {activeProductCategoryList?.map(
                                          (item, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={item?._id}
                                              >
                                                {item?.internal_name}
                                              </MenuItem>
                                            );
                                          },
                                        )}
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="category" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Bill As
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
                                      <Select
                                        labelId="billAs"
                                        id="bill_as"
                                        name="bill_as"
                                        value={values.bill_as}
                                        defaultValue={values.bill_as}
                                        onChange={handleChange}
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem
                                          value="SelectCategory"
                                          disabled
                                        >
                                          Select Category
                                        </MenuItem>
                                        {activeBillableItemsList
                                          .filter(
                                            item =>
                                              !item?.sys_only &&
                                              !item?.ledger_neg_income,
                                          )
                                          ?.map((item, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={item?._id}
                                              >
                                                {item?.internal_name}
                                              </MenuItem>
                                            );
                                          })}
                                      </Select>
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="bill_as" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Disable Auto Invoice</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <Select
                                        labelId="Invoice"
                                        id="Invoice"
                                        name="disable_auto_invoice"
                                        value={values.disable_auto_invoice}
                                        onChange={handleChange}
                                        defaultValue={
                                          values.disable_auto_invoice
                                        }
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem value={false}>
                                          No (recommended)
                                        </MenuItem>
                                        <MenuItem value={true}>Yes</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Add to KPIs Report</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <Select
                                        labelId="addRepor"
                                        id="addRepor"
                                        name="add_to_kpis_report"
                                        value={values.add_to_kpis_report}
                                        onChange={handleChange}
                                        defaultValue={values.add_to_kpis_report}
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem value={1}>
                                          Do not list
                                        </MenuItem>
                                        <MenuItem value={2}>
                                          List under Drinks
                                        </MenuItem>
                                        <MenuItem value={3}>
                                          List under Dodgems
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Gross Price (£)</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="d-flex align-items-center flex-wrap">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <TextField
                                          type="number"
                                          onWheel={e => e.target.blur()}
                                          //changes as per client requirement
                                          // onKeyDown={e => {
                                          //   numberRegex(e);
                                          // }}
                                          // inputProps={{ min: 0, step: 'any' }}
                                          // onBlurCapture={() => {
                                          //   setFieldValue(
                                          //     'gross_price',
                                          //     Number(
                                          //       values.gross_price,
                                          //     ).toFixed(2),
                                          //   );
                                          // }}
                                          {...getFieldProps('gross_price')}
                                          variant="outlined"
                                        />
                                      </FormControl>
                                      {productId ? (
                                        <span className="text_small mx-1">
                                          {(values?.tax_code_data?.percentage &&
                                            values?.gross_price) !== 0
                                            ? `(£ ${values?.net_price?.toFixed(
                                                2,
                                              )}
                                          exl. tax ${
                                            values?.tax_code_data?.percentage
                                          })                                
                                          `
                                            : ''}
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Tax Code
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
                                      <Select
                                        labelId="taxCode-label"
                                        id="taxCode"
                                        value={values.tax_code}
                                        name="tax_code"
                                        onChange={handleChange}
                                        defaultValue={values.tax_code}
                                        className="select_wrap"
                                      >
                                        <MenuItem
                                          value="SelectCategory"
                                          disabled
                                        >
                                          Select Category
                                        </MenuItem>
                                        {activeTaxCodesList?.map(
                                          (item, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={item?._id}
                                              >
                                                {item?.public_name}
                                              </MenuItem>
                                            );
                                          },
                                        )}
                                      </Select>
                                    </FormControl>
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="tax_code" />
                                    </span>
                                    <span className="my-1 d-block text_small">
                                      Price entered above includes tax at the
                                      specified rate:
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Price Rules</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <ul>
                                      {activeSalesRulesList
                                        ?.slice()
                                        ?.sort((a, b) =>
                                          a?.public_name.localeCompare(
                                            b?.public_name,
                                          ),
                                        )
                                        ?.map((item, index) => {
                                          return (
                                            <li>
                                              <div className="form-group checkbox_wrap mb-2">
                                                <FormGroup>
                                                  <FormControlLabel
                                                    key={index}
                                                    control={<Checkbox />}
                                                    name="price_rules"
                                                    label={item?.public_name}
                                                    value={item?._id}
                                                    checked={values.price_rules.includes(
                                                      item?._id,
                                                    )}
                                                    onChange={e => {
                                                      const checked =
                                                        e.target.checked;
                                                      const value =
                                                        e.target.value;
                                                      if (checked) {
                                                        setFieldValue(
                                                          'price_rules',
                                                          [
                                                            ...values.price_rules,
                                                            value,
                                                          ],
                                                        );
                                                      } else {
                                                        setFieldValue(
                                                          'price_rules',
                                                          values.price_rules.filter(
                                                            e => e !== value,
                                                          ),
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </FormGroup>
                                              </div>
                                            </li>
                                          );
                                        })}
                                    </ul>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Product Expires</label>
                                  </div>
                                </Col>

                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap date_picker"
                                    >
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DatePicker
                                          name="expiry_date"
                                          value={values.expiry_date}
                                          inputFormat="DD-MM-YYYY"
                                          onChange={date =>
                                            setFieldValue('expiry_date', date)
                                          }
                                          renderInput={params => (
                                            <TextField
                                              {...params}
                                              id="expiry_date"
                                            />
                                          )}
                                          className="input_wrap"
                                        />
                                      </LocalizationProvider>
                                    </FormControl>
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="expiry_date" />
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Is Exclusive</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="form-group checkbox_wrap mb-0">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="is_exclusive"
                                          value={true}
                                          checked={values.is_exclusive}
                                          onChange={e => {
                                            setFieldValue(
                                              'is_exclusive',
                                              e.target.checked,
                                            );
                                            setIsChecked(e.target.checked);
                                          }}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Allow Online Ordering?</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="form-group checkbox_wrap mb-0">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="allow_online_ordering"
                                          value={true}
                                          checked={values.allow_online_ordering}
                                          onChange={e => {
                                            setFieldValue(
                                              'allow_online_ordering',
                                              e.target.checked,
                                            );
                                            setIsChecked(e.target.checked);
                                          }}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Show on BPE.com Venue Page?
                                      <span className="d-block fw_400">
                                        (only works if online ordering is
                                        enabled)
                                      </span>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="form-group checkbox_wrap mb-0">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="show_on_bpe_venue_page"
                                          value={true}
                                          checked={
                                            values.show_on_bpe_venue_page
                                          }
                                          onChange={e => {
                                            setFieldValue(
                                              'show_on_bpe_venue_page',
                                              e.target.checked,
                                            );
                                            setIsChecked(e.target.checked);
                                          }}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Set as Featured on BPE.com Venue Page?
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="form-group checkbox_wrap mb-0">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="feature_on_bpe_venue_page"
                                          value={true}
                                          checked={
                                            values.feature_on_bpe_venue_page
                                          }
                                          onChange={e => {
                                            setFieldValue(
                                              'feature_on_bpe_venue_page',
                                              e.target.checked,
                                            );
                                            setIsChecked(e.target.checked);
                                          }}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Set Order if Featured
                                      <span className="d-block fw_400">
                                        (accepts minus numbers)
                                      </span>
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
                                        onKeyDown={e => {
                                          numberRegex(e);
                                        }}
                                        inputProps={{ min: 0 }}
                                        onBlurCapture={() => {
                                          setFieldValue(
                                            'set_order_if_featured',
                                            values.set_order_if_featured?.toFixed(
                                              2,
                                            ),
                                          );
                                        }}
                                        {...getFieldProps(
                                          'set_order_if_featured',
                                        )}
                                        variant="outlined"
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
                                    <label>Bin ID</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        id="binID"
                                        type="text"
                                        variant="outlined"
                                        name="bin_id"
                                        {...getFieldProps('bin_id')}
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
                                    <label>Is Trackable</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <div className="form-group checkbox_wrap mb-0">
                                      <FormGroup>
                                        <FormControlLabel
                                          control={<Checkbox />}
                                          name="is_trackable"
                                          value={true}
                                          checked={values.is_trackable}
                                          onChange={e => {
                                            setFieldValue(
                                              'is_trackable',
                                              e.target.checked,
                                            );
                                            setIsChecked(e.target.checked);
                                          }}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Trackable Multiplier</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        onKeyDown={e => {
                                          numberRegex(e);
                                        }}
                                        inputProps={{ min: 0 }}
                                        onBlurCapture={() => {
                                          setFieldValue(
                                            'trackable_multiplier',
                                            Number(
                                              values.trackable_multiplier,
                                            ).toFixed(2),
                                          );
                                        }}
                                        {...getFieldProps(
                                          'trackable_multiplier',
                                        )}
                                        variant="outlined"
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
                                        rows={2.5}
                                        multiline
                                        id="notes"
                                        type="text"
                                        variant="outlined"
                                        name="notes"
                                        {...getFieldProps('notes')}
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
                                    <label>Show on drinks summary</label>
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
                                        value={values.show_on_drinks_summary}
                                        onChange={() =>
                                          setFieldValue(
                                            'show_on_drinks_summary',
                                            !values.show_on_drinks_summary,
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
                            <li className="bg_white_box">
                              <p className="m-0">
                                You can totally remove this product from the
                                system if it is no longer required. Note: the
                                SKU will not become available again as previous
                                bookings may be referenced against it. If you
                                select 'Yes' then you will not be able to undo
                                the delete without knowing the exact sku.
                              </p>
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
                          <div className="card_footer admin_card_footer mb-2">
                            <button type="submit" className="btn_primary small">
                              {isCloning ? 'Clone' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="product_availability_wrap">
                      <div className="card_wrapper mb-3">
                        <div className="card_header py-2 px-3">
                          <h4 className="m-0 py-1 text_white">
                            Product Availability
                          </h4>
                        </div>
                        <div className="card_body admin_card_body">
                          <div className="coupons_available p-2">
                            <h6 className="fw_500">Available at Events?</h6>
                            <div className="available_selectall text_primary mb-2">
                              <span
                                className="inner_select_span text-decoration-underline"
                                onClick={() => {
                                  handleMainSelect(true);
                                }}
                              >
                                Select All
                              </span>
                              <span
                                className="text-decoration-underline"
                                onClick={() => {
                                  handleMainSelect(false);
                                }}
                              >
                                Deselect All
                              </span>
                            </div>
                            <p>
                              If you want to select only individual dates for a
                              venue you will also need to tick the main checkbox
                              against the venue as well as selecting individual
                              dates.
                            </p>
                            <ul>
                              <li>
                                <FieldArray>
                                  <div>
                                    {productAvailableEventList?.List?.map(
                                      (item, index) => (
                                        <div key={item.id}>
                                          <div className="inner_date_title d-flex justify-content-between align-items-center">
                                            <div className="form-group checkbox_wrap mb-2">
                                              <FormGroup>
                                                <FormControlLabel
                                                  control={<Checkbox />}
                                                  label={item.internal_name}
                                                  checked={item.masterCheck}
                                                  onChange={e => {
                                                    onItemCheck(
                                                      e,
                                                      item,
                                                      false,
                                                      'master',
                                                    );
                                                  }}
                                                />
                                              </FormGroup>
                                            </div>
                                            <span
                                              className="text_primary pe-auto text-decoration-underline"
                                              onClick={() => {
                                                toggleShowData(item._id);
                                              }}
                                            >
                                              Select Dates
                                            </span>
                                          </div>

                                          {showData?.includes(item._id) && (
                                            <>
                                              <div className="inner_date_wrap">
                                                {/* <div className="available_selectall mb-2">
                                                  <label className="text_small">
                                                    <input
                                                      type="checkbox"
                                                      style={{
                                                        opacity: 0,
                                                      }}
                                                      onChange={e => {
                                                        onMasterCheck(
                                                          e,
                                                          item,
                                                          true,
                                                        );
                                                      }}
                                                    />
                                                    Select All
                                                  </label>
                                                  <label className="text_small">
                                                    <input
                                                      type="checkbox"
                                                      style={{
                                                        opacity: 0,
                                                      }}
                                                      onChange={e => {
                                                        onMasterCheck(
                                                          e,
                                                          item,
                                                          false,
                                                        );
                                                      }}
                                                    />
                                                    Deselect All
                                                  </label>
                                                </div> */}
                                                <ul>
                                                  <li>
                                                    {item.event_date_data?.map(
                                                      data => {
                                                        return (
                                                          <div
                                                            className="form-group inline checkbox_wrap mb-1"
                                                            style={{
                                                              backgroundColor: `${data.event_status?.colour}`,
                                                              ...(data
                                                                .event_status
                                                                ?.colour && {
                                                                color: 'white',
                                                              }),
                                                              padding: '0 10px',
                                                            }}
                                                          >
                                                            <FormGroup>
                                                              <FormControlLabel
                                                                control={
                                                                  <Checkbox
                                                                  // style={{
                                                                  //   color:
                                                                  //     data
                                                                  //       .event_status
                                                                  //       ?.name
                                                                  //       ? '#FFF'
                                                                  //       : undefined,
                                                                  // }}
                                                                  />
                                                                }
                                                                label={
                                                                  <div>
                                                                    <span>
                                                                      {moment(
                                                                        data.date,
                                                                      ).format(
                                                                        'Do MMM YYYY',
                                                                      )}
                                                                    </span>

                                                                    <span>
                                                                      {data
                                                                        .event_status
                                                                        ?.name
                                                                        ? ` - ${data.event_status?.name}`
                                                                        : ''}
                                                                    </span>
                                                                  </div>
                                                                }
                                                                name={`available_at_events.${index}.date`}
                                                                value={data._id}
                                                                onChange={e => {
                                                                  onItemCheck(
                                                                    e,
                                                                    item,
                                                                    data,
                                                                  );
                                                                }}
                                                                checked={
                                                                  data.selected
                                                                }
                                                              />
                                                            </FormGroup>
                                                          </div>
                                                        );
                                                      },
                                                    )}
                                                  </li>
                                                </ul>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </FieldArray>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
