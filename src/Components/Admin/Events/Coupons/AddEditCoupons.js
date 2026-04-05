import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import deleteIcon from '../../../../Assets/Img/trash.svg';
import plusIcon from '../../../../Assets/Img/plus.svg';
import {
  createCoupon,
  getCouponData,
  setCouponDetail,
  setIsCouponUpdated,
  updateCoupon,
} from 'store/reducers/Admin/Events/Coupon/Coupons/coupon.slice';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import Loader from 'Components/Common/Loader';
import * as Yup from 'yup';
import { getAvailaleEvent } from 'store/reducers/Admin/Events/ProductCategory/product.slice';
import { Checkbox, FormGroup } from '@mui/material';
import moment from 'moment';
import { numberRegex } from 'utils/common';
import { getProductListData } from 'store/reducers/Admin/Events/ProductCategory/product.slice';

export default function AddEditCoupons() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { couponId } = useParams();
  const [showData, setShowData] = useState([]);
  // const [hidePercentage, setHidePercentage] = useState(true);
  const { availableAtEvent } = useSelector(({ product }) => product);
  const { isCouponUpdated, couponLoading, couponDetail } = useSelector(
    ({ coupon }) => coupon,
  );
  const [eventData, setEventData] = useState([]);
  const [productAvailableEventList, setProductAvailableEventList] = useState({
    List: [],
    SelectedList: [],
  });

  const currentYear = new Date().getFullYear();
  const eventYear = couponDetail?.year || currentYear;
  const pastYear = eventYear - 1;
  const futureYear = currentYear + 1;

  const yearsArrayEditEvent = Array.from(
    { length: futureYear - pastYear + 2 },
    (_, index) => pastYear + index,
  );
  const couponInitialData = {
    type: 0,
    name: '',
    description: '',
    start_date: null,
    end_date: null,
    discount_value: '',
    product_value: null,
    quantity: 0,
    of_places: false,
    is_percentage: false,
    is_active: false,
  };
  const initialValuesCoupon = {
    sku: '',
    year: '',
    internal_use_only: false,
    auto_process_coupon: false,
    coupon_type: 1,
    percentage_discount: 0,
    internal_name: '',
    public_name: '',
    public_description: '',
    active_from: new Date(),
    expires_after: new Date(),
    deposits_required_by: null,
    other_offers: 0,
    internal_notes: '',
    is_active: false,
    deleted: false,
    available_at_events: [{ event_id: '', date: [] }],
    coupon_action: [],
  };
  useEffect(() => {
    let dummyList = availableAtEvent?.map(e => {
      let dd = e?.event_date_data?.map(ii => ({
        ...ii,
        selected: false,
      }));
      return { ...e, masterCheck: false, event_date_data: dd };
    });
    setEventData(dummyList);
  }, [availableAtEvent]);
  const toggleShowData = itemId => {
    setShowData(prevState =>
      prevState?.includes(itemId)
        ? prevState.filter(id => id !== itemId)
        : [...prevState, itemId],
    );
  };
  const [couponInitialValues, setCouponInitialValues] =
    useState(initialValuesCoupon);

  const { activeProductList } = useSelector(({ product }) => product);

  useEffect(() => {
    dispatch(getProductListData());
  }, [dispatch]);

  useEffect(() => {
    if (eventData?.length > 0) {
      setProductAvailableEventList({
        ...productAvailableEventList,
        List: eventData,
      });
    }
  }, [eventData]);

  useEffect(() => {
    if (couponId) {
      dispatch(getCouponData(couponId));
    }
  }, [dispatch, couponId]);
  useEffect(() => {
    dispatch(getAvailaleEvent());
  }, [dispatch]);
  useEffect(() => {
    if (isCouponUpdated) {
      navigate('/coupons');
      dispatch(setCouponDetail({}));
      dispatch(setIsCouponUpdated(false));
    }
    return () => dispatch(setCouponDetail({}));
  }, [isCouponUpdated]);

  useEffect(() => {
    if (Object.keys(couponDetail)?.length > 0 && eventData?.length > 0) {
      setCouponInitialValues({
        sku: couponDetail?.sku,
        year: couponDetail?.year ? couponDetail?.year : 'anyYear',
        internal_use_only: couponDetail?.internal_use_only,
        auto_process_coupon: couponDetail?.auto_process_coupon,
        coupon_type: couponDetail?.coupon_type,
        percentage_discount: couponDetail?.percentage_discount,
        internal_name: couponDetail?.internal_name,
        public_name: couponDetail?.public_name,
        public_description: couponDetail?.public_description,
        active_from: couponDetail?.active_from,
        expires_after: couponDetail?.expires_after,
        deposits_required_by: couponDetail?.deposits_required_by,
        other_offers: couponDetail?.other_offers,
        internal_notes: couponDetail?.internal_notes,
        is_active: couponDetail?.is_active,
        deleted: couponDetail?.deleted,
        available_at_events: couponDetail?.available_at_events,
        coupon_action: couponDetail?.coupon_action_data,
      });

      const availabilityList = eventData?.map(item1 => {
        const isEvent = couponDetail?.available_at_events?.find(
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
        let abc = i.date?.filter(i1 => {
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
  }, [couponDetail, eventData]);

  const validationSchema = Yup.object().shape({
    year: Yup.string().required('Year is a required field'),
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    internal_name: Yup.string()
      .required('Internal Name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public Name is a required field')
      .matches(/^[^\s]/, 'Public name cannot include leading spaces'),
    active_from: Yup.date('Active From is a required field')
      .typeError('Please enter a date in the format dd/mm/yyyy')
      // .min(new Date(), 'Date must be in the future')
      .required('Active From is a required field'),
    expires_after: Yup.date('Expires After is a required field')
      .typeError('Please enter a date in the format dd/mm/yyyy')
      .required('Expires After is a required field'),
    deposits_required_by: Yup.date()
      .notRequired()
      .typeError('Please enter a date in the format dd/mm/yyyy'),

    coupon_action: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required('Please select type'),
        // product_value: Yup.string().required('Field is required'),
        start_date: Yup.date()
          .notRequired()
          .typeError('Valid format: dd/mm/yyyy'),
        end_date: Yup.date()
          .notRequired()
          .typeError('Valid format: dd/mm/yyyy'),
      }),
    ),
  });
  const onMasterCheck = (e, data, value) => {
    let abc = [];
    let tempList = productAvailableEventList.List.map(item => {
      if (item._id === data._id) {
        abc = item.event_date_data?.map(ii => {
          return {
            ...ii,
            selected: value,
          };
        });
        return { ...item, event_date_data: abc, masterCheck: value };
      } else {
        return item;
      }
    });
    let newList = tempList.filter(item => {
      return item.masterCheck;
    });

    let listData = newList.map(i => {
      let newObj = {};
      let abc = i.event_date_data.filter(i1 => {
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
    let tempList = productAvailableEventList.List.map(item => {
      if (item._id === data._id) {
        abc = item.event_date_data?.map(ii => {
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
        });

        let xyz = abc.filter(i => {
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
            return { ...item, event_date_data: abc, masterCheck: false };
          }
        }
      } else {
        return item;
      }
    });

    let newList = tempList.filter(item => {
      return item.masterCheck;
    });

    let listData = newList.map(i => {
      let newObj = {};
      let abc = i.event_date_data.filter(i1 => {
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
    let tempList = productAvailableEventList.List.map(item => {
      return { ...item, masterCheck: value };
    });
    let listData = tempList.map(i => {
      return { event_id: i._id, date: '' };
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
      {couponLoading && <Loader />}
      <div className="add_coupons_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Link to="/coupons">Coupons</Link>
            <Typography>
              {!couponLoading && Object.keys(couponDetail).length === 0
                ? 'Add New Coupon '
                : 'Edit Coupon '}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!couponLoading && Object.keys(couponDetail).length === 0
              ? 'Add New Coupon '
              : 'Edit Coupon '}
          </h1>
        </div>
        <div className="add_coupons_wrap">
          <h5 className="text_primary">{couponDetail?.internal_name}</h5>
          <Formik
            enableReinitialize={true}
            initialValues={couponInitialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
              let couponActionData = values?.coupon_action?.map(data => {
                const updatedData = { ...data };
                if (data.type === 1) {
                  if (updatedData.product_value == null)
                    delete updatedData.product_value;
                }
                if (data.type === 2) {
                  if (updatedData.discount_value == null)
                    delete updatedData.discount_value;
                }
                data = updatedData;

                return {
                  ...data,
                  coupon_id: couponDetail._id,
                  quantity: Number(data.quantity),
                  of_places: Boolean(data.of_places),
                  is_percentage: Boolean(data.is_percentage),
                  is_active: Boolean(data.is_active),
                  discount_value: +data.discount_value,
                };
              });
              const data = {
                ...values,
                available_at_events: productAvailableEventList.SelectedList,
                year: values.year === 'anyYear' ? null : Number(values?.year),
                // Number(values?.year),
                coupon_action: couponActionData,
                coupon_type: Number(values?.coupon_type),
                percentage_discount: Number(values?.percentage_discount),
                other_offers: Number(values?.other_offers),
              };
              if (Object.keys(couponDetail).length > 0) {
                dispatch(
                  updateCoupon({
                    _id: couponDetail._id,
                    coupon: data,
                  }),
                );
              } else {
                dispatch(createCoupon(data));
              }
            }}
          >
            {({
              handleSubmit,
              handleChange,
              setFieldValue,
              values,
              getFieldProps,
              errors,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="card_wrapper">
                  <div className="card_body admin_card_body">
                    <ul>
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
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="sku" />
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
                                Year<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <Select
                                  labelId="couponYear"
                                  id="year"
                                  name="year"
                                  value={values.year}
                                  onChange={handleChange}
                                  defaultValue="anyYear"
                                  className="input_wrap select_wrap"
                                >
                                  <MenuItem value="anyYear">Any Year</MenuItem>
                                  {yearsArrayEditEvent?.map(item => {
                                    return (
                                      <MenuItem value={item} key={item}>
                                        {item}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="year" />
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col>
                            <div className="card_content_left">
                              <label>Available at Events?</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <div className="coupons_available">
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
                                  If you want to select only individual dates
                                  for a venue you will also need to tick the
                                  main checkbox against the venue as well as
                                  selecting individual dates.
                                </p>
                              </div>
                            </div>

                            <FieldArray>
                              <div>
                                {/* add filter as per old crm */}
                                {/* {productAvailableEventList?.List?.map((item, index) => ( */}
                                {productAvailableEventList?.List?.filter(
                                  elem =>
                                    elem?.year === new Date().getFullYear(),
                                )
                                  ?.slice()
                                  ?.sort((a, b) =>
                                    a?.internal_name.localeCompare(
                                      b?.internal_name,
                                    ),
                                  )
                                  .map((item, index) => (
                                    <div key={item.id}>
                                      <div className="inner_date_title d-flex justify-content-between align-items-center">
                                        <div className="form-group checkbox_wrap mb-2">
                                          <FormGroup>
                                            <FormControlLabel
                                              control={<Checkbox />}
                                              label={item.internal_name}
                                              checked={item.masterCheck}
                                              onChange={e => {
                                                // onItemCheck(
                                                //   e,
                                                //   item,
                                                //   false,
                                                //   'master',
                                                // );
                                                onMasterCheck(
                                                  e,
                                                  item,
                                                  e.target.checked,
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
                                            <div className="available_selectall mb-2">
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
                                            </div>
                                            <ul>
                                              <li>
                                                {item?.event_date_data?.map(
                                                  data => {
                                                    return (
                                                      <div
                                                        className="form-group inline checkbox_wrap mb-1"
                                                        style={{
                                                          backgroundColor: `${data.event_status?.colour}`,
                                                          ...(data.event_status
                                                            ?.colour && {
                                                            color: 'white',
                                                          }),
                                                          padding: '0 10px',
                                                        }}
                                                      >
                                                        <FormGroup>
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox />
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
                                  ))}
                              </div>
                            </FieldArray>
                          </Col>
                          <span className="d-block text-danger text_small">
                            <ErrorMessage name="available_at_events" />
                          </span>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Internal Use Only?</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="internal-label"
                                  defaultValue="internalYes"
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  value={values.internal_use_only}
                                  onChange={() =>
                                    setFieldValue(
                                      'internal_use_only',
                                      !values.internal_use_only,
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
                                Auto Process Coupon?
                                <span className="d-block fw_400">
                                  Accept and process this automatically if
                                  valid.
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="process-coupon-label"
                                  defaultValue="autoProcessYes"
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  value={values.auto_process_coupon}
                                  onChange={() =>
                                    setFieldValue(
                                      'auto_process_coupon',
                                      !values.auto_process_coupon,
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
                                Coupon Type<sup className="text_primary">*</sup>
                                <span className="d-block fw_400">
                                  Select what benefits are applied by this
                                  coupon
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="coupon-type-label"
                                  defaultValue={0}
                                  name="coupon_type"
                                  className="custom_radio"
                                  value={values.coupon_type}
                                  onChange={handleChange}
                                  // onChange={e => {
                                  //   handleChange(e);
                                  //   setHidePercentage(!hidePercentage);
                                  // }}
                                >
                                  <Field
                                    as={FormControlLabel}
                                    value={1}
                                    control={<Radio />}
                                    label="Simple Discount"
                                  />
                                  <Field
                                    as={FormControlLabel}
                                    value={2}
                                    control={<Radio />}
                                    label="Custom Actions"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      {/*Custom action */}
                      {values.coupon_type == 2 && (
                        <li>
                          <Row className="align-items-start">
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  Coupon Actions
                                  <span className="d-block fw_400">
                                    Select which actions to apply if auto
                                    processing is enabled.
                                  </span>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <div className="coupon_inner_table_top mb-2">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="text_primary m-0">
                                      Coupon Action
                                    </h5>
                                    <div
                                      onClick={() => {
                                        let currentCouponData = [
                                          ...values?.coupon_action,
                                          { ...couponInitialData },
                                        ];
                                        setFieldValue(
                                          'coupon_action',
                                          currentCouponData,
                                        );
                                      }}
                                    >
                                      <img
                                        src={plusIcon}
                                        alt="PlusIcon"
                                        style={{ width: '25px' }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="inner_table coupon_inner_table">
                                  <div className="table_main_Wrapper coupon_active_table mb-3">
                                    <TableContainer component={Paper}>
                                      <Table
                                        sx={{ minWidth: 650 }}
                                        aria-label="simple table"
                                      >
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>
                                              <span>Type</span>
                                            </TableCell>
                                            <TableCell>
                                              <span>Name</span>
                                            </TableCell>
                                            <TableCell>
                                              <span>Description</span>
                                            </TableCell>
                                            <TableCell>
                                              <span>Start Date</span>
                                            </TableCell>
                                            <TableCell>
                                              <span>End Date</span>
                                            </TableCell>
                                            <TableCell>
                                              <span>Value</span>
                                            </TableCell>
                                            <TableCell>
                                              <span>Quantity</span>
                                            </TableCell>
                                            <TableCell>
                                              <span>of Places?</span>
                                            </TableCell>
                                            <TableCell>
                                              <span>Is %</span>
                                            </TableCell>
                                            <TableCell>
                                              <span>Active</span>
                                            </TableCell>
                                            <TableCell></TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {values?.coupon_action?.map(
                                            (couponData, index) => {
                                              return (
                                                <TableRow>
                                                  <TableCell>
                                                    <FormControl
                                                      fullWidth
                                                      className=""
                                                    >
                                                      <Select
                                                        labelId="couponYear"
                                                        id="type"
                                                        name="type"
                                                        value={couponData.type}
                                                        defaultValue="Discount"
                                                        onChange={e => {
                                                          const newCouponActionData =
                                                            values?.coupon_action?.map(
                                                              (
                                                                item,
                                                                index2,
                                                              ) => {
                                                                if (
                                                                  index2 ===
                                                                  index
                                                                ) {
                                                                  return {
                                                                    ...item,
                                                                    type: e
                                                                      .target
                                                                      .value,
                                                                  };
                                                                }
                                                                return item;
                                                              },
                                                            );
                                                          setFieldValue(
                                                            'coupon_action',
                                                            newCouponActionData,
                                                          );
                                                        }}
                                                        className="input_wrap select_wrap"
                                                      >
                                                        <MenuItem value={1}>
                                                          Discount
                                                        </MenuItem>
                                                        <MenuItem value={2}>
                                                          Product
                                                        </MenuItem>
                                                      </Select>
                                                    </FormControl>
                                                    <span className="d-block text-danger text_small">
                                                      <ErrorMessage
                                                        name={`coupon_action[${index}].type`}
                                                      />
                                                    </span>
                                                  </TableCell>
                                                  <TableCell>
                                                    <FormControl
                                                      fullWidth
                                                      className="main_input_wrap"
                                                    >
                                                      <TextField
                                                        id="percentageDis"
                                                        type="text"
                                                        value={couponData.name}
                                                        variant="outlined"
                                                        onChange={e => {
                                                          const newCouponActionNameData =
                                                            values?.coupon_action?.map(
                                                              (
                                                                item,
                                                                index2,
                                                              ) => {
                                                                if (
                                                                  index2 ===
                                                                  index
                                                                ) {
                                                                  return {
                                                                    ...item,
                                                                    name: e
                                                                      .target
                                                                      .value,
                                                                  };
                                                                }
                                                                return item;
                                                              },
                                                            );
                                                          setFieldValue(
                                                            'coupon_action',
                                                            newCouponActionNameData,
                                                          );
                                                        }}
                                                      />
                                                    </FormControl>
                                                  </TableCell>
                                                  <TableCell>
                                                    <FormControl
                                                      fullWidth
                                                      className="main_input_wrap textare_input"
                                                    >
                                                      <TextField
                                                        id="percentageDis"
                                                        multiline
                                                        rows={1}
                                                        type="text"
                                                        value={
                                                          couponData.description
                                                        }
                                                        variant="outlined"
                                                        onChange={e => {
                                                          const newCouponActionDescriptionData =
                                                            values?.coupon_action?.map(
                                                              (
                                                                item,
                                                                index2,
                                                              ) => {
                                                                if (
                                                                  index2 ===
                                                                  index
                                                                ) {
                                                                  return {
                                                                    ...item,
                                                                    description:
                                                                      e.target
                                                                        .value,
                                                                  };
                                                                }
                                                                return item;
                                                              },
                                                            );
                                                          setFieldValue(
                                                            'coupon_action',
                                                            newCouponActionDescriptionData,
                                                          );
                                                        }}
                                                      />
                                                    </FormControl>
                                                  </TableCell>
                                                  <TableCell>
                                                    <FormControl
                                                      fullWidth
                                                      className="main_input_wrap date_picker"
                                                    >
                                                      <LocalizationProvider
                                                        dateAdapter={
                                                          AdapterDayjs
                                                        }
                                                      >
                                                        <DatePicker
                                                          name="start_date"
                                                          value={
                                                            couponData.start_date
                                                          }
                                                          inputFormat="DD-MM-YYYY"
                                                          variant="outlined"
                                                          onChange={e => {
                                                            const newCouponActionDateData =
                                                              values?.coupon_action?.map(
                                                                (
                                                                  item,
                                                                  index2,
                                                                ) => {
                                                                  if (
                                                                    index2 ===
                                                                    index
                                                                  ) {
                                                                    return {
                                                                      ...item,
                                                                      start_date:
                                                                        e,
                                                                    };
                                                                  }
                                                                  return item;
                                                                },
                                                              );
                                                            setFieldValue(
                                                              'coupon_action',
                                                              newCouponActionDateData,
                                                            );
                                                          }}
                                                          renderInput={params => (
                                                            <TextField
                                                              {...params}
                                                              id="start_date"
                                                            />
                                                          )}
                                                          className="input_wrap"
                                                        />
                                                      </LocalizationProvider>
                                                    </FormControl>
                                                    <span className="d-block text-danger text_small">
                                                      <ErrorMessage
                                                        name={`coupon_action[${index}].start_date`}
                                                      />
                                                    </span>
                                                  </TableCell>
                                                  <TableCell>
                                                    <FormControl
                                                      fullWidth
                                                      className="main_input_wrap date_picker"
                                                    >
                                                      <LocalizationProvider
                                                        dateAdapter={
                                                          AdapterDayjs
                                                        }
                                                      >
                                                        <DatePicker
                                                          name="end_date"
                                                          value={
                                                            couponData.end_date
                                                          }
                                                          inputFormat="DD-MM-YYYY"
                                                          variant="outlined"
                                                          onChange={e => {
                                                            const newCouponActionDateData =
                                                              values?.coupon_action?.map(
                                                                (
                                                                  item,
                                                                  index2,
                                                                ) => {
                                                                  if (
                                                                    index2 ===
                                                                    index
                                                                  ) {
                                                                    return {
                                                                      ...item,
                                                                      end_date:
                                                                        e,
                                                                    };
                                                                  }
                                                                  return item;
                                                                },
                                                              );
                                                            setFieldValue(
                                                              'coupon_action',
                                                              newCouponActionDateData,
                                                            );
                                                          }}
                                                          renderInput={params => (
                                                            <TextField
                                                              {...params}
                                                              id="end_date"
                                                            />
                                                          )}
                                                          className="input_wrap"
                                                        />
                                                      </LocalizationProvider>
                                                    </FormControl>
                                                    <span className="d-block text-danger text_small">
                                                      <ErrorMessage
                                                        name={`coupon_action[${index}].end_date`}
                                                      />
                                                    </span>
                                                  </TableCell>

                                                  {couponData?.type === 1 ||
                                                  couponData?.type === '' ? (
                                                    <TableCell>
                                                      <FormControl
                                                        fullWidth
                                                        className="main_input_wrap custom_coupon_action_value"
                                                        style={{
                                                          width: '60px',
                                                        }}
                                                      >
                                                        <TextField
                                                          id="quantity"
                                                          type="text"
                                                          variant="outlined"
                                                          value={
                                                            couponData.discount_value
                                                          }
                                                          onChange={e => {
                                                            const newCouponActionQunatityData =
                                                              values?.coupon_action?.map(
                                                                (
                                                                  item,
                                                                  index2,
                                                                ) => {
                                                                  if (
                                                                    index2 ===
                                                                    index
                                                                  ) {
                                                                    return {
                                                                      ...item,
                                                                      discount_value:
                                                                        e.target
                                                                          .value,
                                                                    };
                                                                  }
                                                                  return item;
                                                                },
                                                              );
                                                            setFieldValue(
                                                              'coupon_action',
                                                              newCouponActionQunatityData,
                                                            );
                                                          }}
                                                        />
                                                      </FormControl>
                                                    </TableCell>
                                                  ) : (
                                                    <TableCell>
                                                      <FormControl fullWidth>
                                                        <Select
                                                          defaultValue=""
                                                          id="grouped-select"
                                                          label="Grouping"
                                                          className="input_wrap select_wrap"
                                                          value={
                                                            couponData.product_value
                                                          }
                                                          onChange={e => {
                                                            const newCouponActionProductData =
                                                              values?.coupon_action?.map(
                                                                (
                                                                  item,
                                                                  index2,
                                                                ) => {
                                                                  if (
                                                                    index2 ===
                                                                    index
                                                                  ) {
                                                                    return {
                                                                      ...item,
                                                                      product_value:
                                                                        e.target
                                                                          .value,
                                                                    };
                                                                  }
                                                                  return item;
                                                                },
                                                              );
                                                            setFieldValue(
                                                              'coupon_action',
                                                              newCouponActionProductData,
                                                            );
                                                          }}
                                                        >
                                                          {activeProductList?.map(
                                                            (data, i) => {
                                                              return [
                                                                <ListSubheader>
                                                                  {
                                                                    data.product_category
                                                                  }
                                                                </ListSubheader>,
                                                                ...data?.group_data?.map(
                                                                  (
                                                                    val,
                                                                    index,
                                                                  ) => {
                                                                    return (
                                                                      <MenuItem
                                                                        key={
                                                                          index
                                                                        }
                                                                        value={
                                                                          val._id
                                                                        }
                                                                      >
                                                                        {val.gross_price +
                                                                          ` - ` +
                                                                          val.internal_name +
                                                                          ` - ` +
                                                                          val.sku}
                                                                      </MenuItem>
                                                                    );
                                                                  },
                                                                ),
                                                              ];
                                                            },
                                                          )}
                                                        </Select>
                                                      </FormControl>
                                                      <span className="d-block text-danger text_small">
                                                        <ErrorMessage
                                                          name={`coupon_action[${index}].product_value`}
                                                        />
                                                      </span>
                                                    </TableCell>
                                                  )}
                                                  <TableCell>
                                                    <FormControl
                                                      fullWidth
                                                      className="main_input_wrap"
                                                      style={{ width: '60px' }}
                                                    >
                                                      <TextField
                                                        id="quantity"
                                                        type="number"
                                                        onKeyDown={e => {
                                                          numberRegex(e);
                                                        }}
                                                        inputProps={{ min: 0 }}
                                                        onBlurCapture={() => {
                                                          setFieldValue(
                                                            'set_order_if_featured',
                                                            Number(
                                                              values.set_order_if_featured,
                                                            ).toFixed(2),
                                                          );
                                                        }}
                                                        variant="outlined"
                                                        value={
                                                          couponData.quantity
                                                        }
                                                        onChange={e => {
                                                          const newCouponActionQunatityData =
                                                            values?.coupon_action?.map(
                                                              (
                                                                item,
                                                                index2,
                                                              ) => {
                                                                if (
                                                                  index2 ===
                                                                  index
                                                                ) {
                                                                  return {
                                                                    ...item,
                                                                    quantity:
                                                                      e.target
                                                                        .value,
                                                                  };
                                                                }
                                                                return item;
                                                              },
                                                            );
                                                          setFieldValue(
                                                            'coupon_action',
                                                            newCouponActionQunatityData,
                                                          );
                                                        }}
                                                      />
                                                    </FormControl>
                                                  </TableCell>
                                                  <TableCell>
                                                    <div className="form-group checkbox_wrap mb-0">
                                                      <FormGroup>
                                                        <FormControlLabel
                                                          control={<Checkbox />}
                                                          value={true}
                                                          checked={
                                                            couponData?.of_places
                                                          }
                                                          onChange={e => {
                                                            const updatedData =
                                                              [
                                                                ...values.coupon_action,
                                                              ];
                                                            updatedData[
                                                              index
                                                            ].of_places =
                                                              e.target.checked;
                                                            setFieldValue(
                                                              'coupon_action',
                                                              updatedData,
                                                            );
                                                            // const newCouponActionPlacesData =
                                                            //   values?.coupon_action?.map(
                                                            //     (
                                                            //       item,
                                                            //       index2,
                                                            //     ) => {
                                                            //       if (
                                                            //         index2 ===
                                                            //         index
                                                            //       ) {
                                                            //         return {
                                                            //           ...item,
                                                            //           of_places:
                                                            //             e.target
                                                            //               .value,
                                                            //         };
                                                            //       }
                                                            //       return item;
                                                            //     },
                                                            //   );
                                                            // setFieldValue(
                                                            //   'coupon_action',
                                                            //   newCouponActionPlacesData,
                                                            // );
                                                          }}
                                                        />
                                                      </FormGroup>
                                                    </div>
                                                  </TableCell>
                                                  <TableCell>
                                                    <div className="form-group checkbox_wrap mb-0">
                                                      <FormGroup>
                                                        <FormControlLabel
                                                          control={<Checkbox />}
                                                          value={true}
                                                          checked={
                                                            couponData?.is_percentage
                                                          }
                                                          onChange={e => {
                                                            const updatedData =
                                                              [
                                                                ...values.coupon_action,
                                                              ];
                                                            updatedData[
                                                              index
                                                            ].is_percentage =
                                                              e.target.checked;
                                                            setFieldValue(
                                                              'coupon_action',
                                                              updatedData,
                                                            );
                                                            // const newCouponActionPlacesData =
                                                            //   values?.coupon_action?.map(
                                                            //     (
                                                            //       item,
                                                            //       index2,
                                                            //     ) => {
                                                            //       if (
                                                            //         index2 ===
                                                            //         index
                                                            //       ) {
                                                            //         return {
                                                            //           ...item,
                                                            //           is_percentage:
                                                            //             e.target
                                                            //               .value,
                                                            //         };
                                                            //       }
                                                            //       return item;
                                                            //     },
                                                            //   );
                                                            // setFieldValue(
                                                            //   'coupon_action',
                                                            //   newCouponActionPlacesData,
                                                            // );
                                                          }}
                                                        />
                                                      </FormGroup>
                                                    </div>
                                                  </TableCell>
                                                  <TableCell>
                                                    <div className="form-group checkbox_wrap mb-0">
                                                      <FormGroup>
                                                        <FormControlLabel
                                                          control={<Checkbox />}
                                                          value={true}
                                                          checked={
                                                            couponData?.is_active
                                                          }
                                                          onChange={e => {
                                                            const updatedData =
                                                              values.coupon_action.map(
                                                                (
                                                                  item,
                                                                  index2,
                                                                ) => {
                                                                  if (
                                                                    index2 ===
                                                                    index
                                                                  ) {
                                                                    return {
                                                                      ...item,
                                                                      is_active:
                                                                        e.target
                                                                          .checked,
                                                                    };
                                                                  }
                                                                  return item;
                                                                },
                                                              );
                                                            setFieldValue(
                                                              'coupon_action',
                                                              updatedData,
                                                            );
                                                          }}
                                                        />
                                                      </FormGroup>
                                                    </div>
                                                  </TableCell>
                                                  <TableCell
                                                    onClick={() => {
                                                      let currentCouponData = [
                                                        ...values.coupon_action,
                                                      ];
                                                      currentCouponData.splice(
                                                        index,
                                                        1,
                                                      );
                                                      setFieldValue(
                                                        'coupon_action',
                                                        currentCouponData,
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      src={deleteIcon}
                                                      alt="delete"
                                                      style={{ width: '22px' }}
                                                    />
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            },
                                          )}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </li>
                      )}
                      {values.coupon_type == 1 && (
                        <li>
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  Percentage Discount
                                  <span className="d-block fw_400">
                                    Enter the discount percentage to apply if
                                    auto processing is enabled.%
                                  </span>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <div className="d-flex align-items-center">
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
                                          'percentage_discount',
                                          Number(
                                            values.percentage_discount,
                                          ).toFixed(2),
                                        );
                                      }}
                                      {...getFieldProps('percentage_discount')}
                                      variant="outlined"
                                    />
                                  </FormControl>
                                  <span className="mx-1 text_small">%</span>
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
                              <label>
                                Internal Name
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
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
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>
                                Public Name<sup className="text_primary">*</sup>
                                <span className="d-block fw_400">
                                  <span className="text_primary">T</span>his
                                  text will show to the customer in their
                                  account section
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
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
                          <Col xs={3}>
                            <div className="card_content_left">
                              <label>Public Description</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  id="resolution_note"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  {...getFieldProps('public_description')}
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
                              <label>
                                Active From<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap date_picker"
                              >
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    name="active_form"
                                    value={values.active_from}
                                    inputFormat="DD-MM-YYYY"
                                    onChange={date =>
                                      setFieldValue('active_from', date)
                                    }
                                    // minDate={new Date()}
                                    renderInput={params => (
                                      <TextField {...params} id="active_from" />
                                    )}
                                    className="input_wrap"
                                  />
                                </LocalizationProvider>
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="active_from" />
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
                                Expires After
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <div className="card_content_right">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap date_picker"
                                >
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      name="expires_after"
                                      value={values.expires_after}
                                      inputFormat="DD-MM-YYYY"
                                      onChange={date =>
                                        setFieldValue('expires_after', date)
                                      }
                                      renderInput={params => (
                                        <TextField
                                          {...params}
                                          id="expires_after"
                                        />
                                      )}
                                      className="input_wrap"
                                    />
                                  </LocalizationProvider>
                                </FormControl>
                                <span className="d-block text-danger text_small">
                                  <ErrorMessage name="expires_after" />
                                </span>
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
                                Deposits Required By
                                <span className="d-block fw_400">
                                  End of this day
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <div className="card_content_right">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap date_picker"
                                >
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      name="deposits_required_by"
                                      value={values.deposits_required_by}
                                      inputFormat="DD-MM-YYYY"
                                      onChange={date =>
                                        setFieldValue(
                                          'deposits_required_by',
                                          date,
                                        )
                                      }
                                      renderInput={params => (
                                        <TextField {...params} id="date" />
                                      )}
                                      className="input_wrap"
                                    />
                                  </LocalizationProvider>
                                </FormControl>
                                <span className="d-block text-danger text_small">
                                  <ErrorMessage name="deposits_required_by" />
                                </span>
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
                                Other Offers
                                <span className="d-block fw_400">
                                  Can be used in conjunction with other offers
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={9}>
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
                                      'other_offers',
                                      Number(values.other_offers).toFixed(2),
                                    );
                                  }}
                                  {...getFieldProps('other_offers')}
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
                              <label>Internal Notes</label>
                            </div>
                          </Col>
                          <Col xs={9}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  id="internalNote"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  {...getFieldProps('internal_notes')}
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
                          <Col xs={11}>
                            <p className="m-0">
                              You can totally remove this coupon from the system
                              if it is no longer text_primary. Note: the SKU
                              will not become available again as previous
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
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                    </ul>
                    <div className="card_footer admin_card_footer mb-2">
                      <button type="submit" className="btn_primary small">
                        {/* <Link to="/coupons" className="btn_primary small"> */}
                        Save
                        {/* </Link> */}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
