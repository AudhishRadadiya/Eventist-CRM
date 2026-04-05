import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Col, Row } from 'react-bootstrap';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import EditIcon from '../../../../Assets/Img/edit.svg';
import Stack from '@mui/material/Stack';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import moment from 'moment';
import {
  getEventData,
  setEventDetail,
  setEventLoading,
  setIsEventUpdated,
  updateEvent,
  updateEventDate,
  bulkUpdateEventDate,
  setIsUpdateEventDateUpdated,
  setIsCreateEventDateUpdated,
} from 'store/reducers/Admin/Events/Parties/parties.slice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { ErrorMessage, Form, Formik } from 'formik';
import { getThemeListData } from 'store/reducers/Admin/Events/theme.slice';
import { getVenueListData } from 'store/reducers/Admin/Events/venue.slice';
import * as Yup from 'yup';
import { createEventDate } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { Pagination } from '@mui/material';
import {
  getTotalPages,
  getPaginationData,
  suspendHandler,
  // numberRegex,
} from 'utils/common';
import useSortable from 'utils/useSortable';
import DataNotFound from 'Components/Common/DataNotFound';
import { DuplicateAndCloneEvent } from './EditParties/DuplicateAndCloneEvent';
import { Automation } from './EditParties/Automation';
import { ETicketInfo } from './EditParties/ETicketInfo';
import { EventInfoBPE } from './EditParties/EventInfoBPE';
import { EventProducts } from './EditParties/EventProducts';
import { getTaxCodesListData } from 'store/reducers/Admin/Financial/taxCodes.slice';
import { getSalesRulesListData } from 'store/reducers/Admin/Events/salesRules.slice';

let pageSize = 10;

export default function EditParties() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { eventId } = useParams();

  const bulkUploadSubmiRef = useRef(null);
  const addDateSubmiRef = useRef(null);
  const {
    isEventUpdated,
    eventLoading,
    eventDetail,
    isCreateEventDateUpdated,
    eventDateUpdatedLoading,
    eventDateDetail,
    CreateEventDateLoading,
    isUpdateEventDateUpdated,
  } = useSelector(({ parties }) => parties);

  const currentYear = new Date().getFullYear();
  const eventYear = eventDetail?.year || currentYear; // Use eventDetail?.year if available, otherwise, use current year
  const pastYear = eventYear - 1;
  const futureYear = currentYear + 6;

  const yearsArrayEditEvent = Array.from(
    { length: futureYear - pastYear + 1 }, // Include both past and future years
    (_, index) => pastYear + index,
  );

  const { activeThemeList } = useSelector(({ theme }) => theme);
  const { activeVenueList } = useSelector(({ venue }) => venue);
  const { activeTaxCodesList } = useSelector(({ taxCodes }) => taxCodes);
  const { activeSalesRulesList } = useSelector(({ salesRules }) => salesRules);

  const initialValuesEvent = {
    sku: '',
    cost_centre: '',
    booking_unique_id: '',
    year: '',
    internal_name: '',
    public_name: '',
    venue_id: '',
    theme_id: '',
    total_places: '',
    overbook_maximum: '',
    minimum_places_exclusive: '',
    price_per_head: 0,
    deposit_per_head: 0,
    tax_code: '',
    price_rule: '',
    sales_target: 0,
    show_online: '',
    eticket: '',
    is_active: false,
    deleted: false,
  };

  const [eventInitialEvent, setEventInitialEvent] =
    useState(initialValuesEvent);
  const [bulkUploadList, setBulkUploadList] = useState({
    List: [],
    MasterChecked: false,
    SelectedList: [],
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (eventId) {
      dispatch(getEventData(eventId));
    }
    if (isCreateEventDateUpdated && eventId !== '') {
      dispatch(getEventData(eventId));
      dispatch(setIsCreateEventDateUpdated(false));
    }
  }, [dispatch, eventId, isCreateEventDateUpdated]);
  useEffect(() => {
    if (isUpdateEventDateUpdated && eventId !== '') {
      dispatch(getEventData(eventId));
      dispatch(setIsUpdateEventDateUpdated(false));
    }
  }, [dispatch, isUpdateEventDateUpdated]);
  useEffect(() => {
    if (isEventUpdated) {
      navigate('/admin/events/parties');
      dispatch(setEventDetail({}));
      dispatch(setIsEventUpdated(false));
    }
    return () => dispatch(setEventDetail({}));
  }, [isEventUpdated]);

  useEffect(() => {
    dispatch(getThemeListData());
    dispatch(getVenueListData());
    // dispatch(setEventLoading());
    dispatch(getTaxCodesListData());
    dispatch(getSalesRulesListData());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(eventDetail)?.length > 0) {
      setEventInitialEvent({
        sku: eventDetail?.sku,
        cost_centre: eventDetail?.cost_centre,
        booking_unique_id: eventDetail?.booking_unique_id,
        year: eventDetail?.year ? eventDetail?.year : '',
        internal_name: eventDetail?.internal_name,
        public_name: eventDetail?.public_name,
        venue_id: eventDetail?.venue_id,
        theme_id: eventDetail?.theme_id,
        total_places: eventDetail?.total_places,
        overbook_maximum: eventDetail?.overbook_maximum,
        minimum_places_exclusive: eventDetail?.minimum_places_exclusive,
        price_per_head: eventDetail?.price_per_head,
        deposit_per_head: eventDetail?.deposit_per_head,
        tax_code: eventDetail?.tax_code,
        price_rule: eventDetail?.price_rule,
        sales_target: eventDetail?.sales_target,
        show_online: eventDetail?.show_online,
        eticket: eventDetail?.eticket,
        nightly_reports_business_done: false,
        is_active: eventDetail?.is_active ? eventDetail?.is_active : false,
        deleted: eventDetail?.deleted ? eventDetail?.deleted : false,
      });
    }
  }, [eventDetail]);

  const editPartiesSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    internal_name: Yup.string()
      .required('Internal name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public name is a required field')
      .matches(/^[^\s]/, 'Public name cannot include leading spaces'),
    booking_unique_id: Yup.string()
      .matches(/^[^\s]/, 'Booking id cannot include leading spaces')
      .required('Booking unique id is a required field'),
    year: Yup.string().required('Year is a required field'),
    venue_id: Yup.string().required('Venue is a required field'),
    theme_id: Yup.string().required('Theme is a required field'),
    tax_code: Yup.string().required('Tax Code is a required field'),
  });

  const editDateSchema = Yup.object().shape({
    start_date: Yup.date().required('Start Date is not valid'),
    end_date: Yup.date()
      .required('End Date is not valid')
      .test('is-valid-date', 'End Date is not a valid date', function (value) {
        return moment(value).isValid();
      })
      .test(
        'is-greater-than-start',
        'End Date must be greater than Start Date',
        function (value) {
          const startDate = this.parent.start_date;
          return moment(value).isSameOrAfter(startDate);
        },
      ),
  });

  const bulkUploadSchema = Yup.object().shape({
    value: Yup.string().required('Please Enter Value'),
  });

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const setCurrentProductCategoryHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    if (Object.keys(eventDateDetail)?.length > 0) {
      const totalActiveRecordCount = getTotalPages(eventDateDetail, pageSize);
      return totalActiveRecordCount;
    }
  }, [eventDateDetail]);

  const activeCurrentData = useMemo(() => {
    if (Object.keys(eventDateDetail)?.length > 0) {
      let currentDataList = getPaginationData(
        eventDateDetail,
        currentPage.activeCurrentPage,
        pageSize,
        totalActiveRecordPage,
        setCurrentProductCategoryHandler,
        'activeCurrentPage',
      );
      return currentDataList;
    } else {
      return [];
    }
  }, [eventDateDetail, currentPage.activeCurrentPage]);
  useEffect(() => {
    setBulkUploadList({
      List: activeCurrentData,
      MasterChecked: false,
      SelectedList: [],
    });
  }, [activeCurrentData]);
  const { itemsActive, requestSortActive } = useSortable(bulkUploadList.List);

  const OpenDelete = date => {
    setDeleteId(date);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };

  useEffect(() => {
    if (Object.keys(eventDetail).length > 0) {
      setProducts(eventDetail?.productData);
    }
  }, [eventDetail]);

  const optionsSurvivorBreakfastAt = [
    {
      id: 1,
      label: '12:00 AM',
      value: '12:00',
    },
    {
      id: 2,
      label: '12:30 AM',
      value: '12:30',
    },
  ];

  const deleteEventDate = date => {
    dispatch(
      updateEventDate({
        _id: deleteId._id,
        date: {
          ...deleteId,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };
  const onMasterCheck = e => {
    let tempList = itemsActive;
    tempList = tempList.map(item => {
      return {
        ...item,
        selected: e.target.checked,
      };
    });
    if (e.target.checked) {
      setBulkUploadList({
        ...bulkUploadList,
        MasterChecked: e.target.checked,
        List: tempList,
        SelectedList: tempList?.map(item => {
          return item._id;
        }),
      });
    } else {
      setBulkUploadList({
        ...bulkUploadList,
        MasterChecked: e.target.checked,
        List: tempList,
        SelectedList: [],
      });
    }
  };
  const onItemCheck = (e, data) => {
    let tempListData = itemsActive;
    tempListData = tempListData.map(item => {
      if (item._id === data._id) {
        return {
          ...item,
          selected: e.target.checked,
        };
      }
      return item;
    });
    let dummyData = tempListData.filter(item => {
      return item.selected;
    });
    if (tempListData?.length === dummyData?.length) {
      setBulkUploadList({
        ...bulkUploadList,
        MasterChecked: true,
        List: tempListData,
        SelectedList: dummyData?.map(item => {
          return item._id;
        }),
      });
    } else {
      setBulkUploadList({
        ...bulkUploadList,
        MasterChecked: false,
        List: tempListData,
        SelectedList: dummyData?.map(item => {
          return item._id;
        }),
      });
    }
  };

  return (
    <div className="inner_wrapper">
      {eventLoading && <Loader />}
      {eventDateUpdatedLoading && <Loader />}
      {CreateEventDateLoading && <Loader />}
      <div className="editparties_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/admin/events/parties">Events / Parties</Link>
            <Typography>Edit Events</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Edit Event</h1>
        </div>
        <div className="editparties_wrap">
          <Row>
            <Col lg={6}>
              <Formik
                enableReinitialize={true}
                initialValues={eventInitialEvent}
                validationSchema={editPartiesSchema}
                onSubmit={values => {
                  const data = {
                    ...values,
                    total_places: Number(values.total_places),
                    overbook_maximum: Number(values.overbook_maximum),
                    minimum_places_exclusive: Number(
                      values.minimum_places_exclusive,
                    ),
                    price_per_head: Number(values.price_per_head),
                    deposit_per_head: Number(values.deposit_per_head),
                    sales_target: Number(values.sales_target),
                  };
                  dispatch(
                    updateEvent({
                      _id: eventDetail?._id,
                      event: data,
                    }),
                  );
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
                    <div className="event_address_wrap">
                      <div className="card_wrapper mb-4">
                        <div className="card_header py-2 px-3">
                          <h4 className="m-0 py-1 text_white">
                            {eventDetail?.internal_name}
                          </h4>
                        </div>
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
                                        {...getFieldProps('sku')}
                                        placeholder="Enter sku"
                                        variant="outlined"
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
                                    <label>Cost Centre</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl
                                      fullWidth
                                      className="main_input_wrap"
                                    >
                                      <TextField
                                        {...getFieldProps('cost_centre')}
                                        placeholder="Enter cost centre"
                                        variant="outlined"
                                      />
                                    </FormControl>
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="cost_centre" />
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
                                      Booking Unique ID
                                      <sup className="text_primary">*</sup>
                                    </label>
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
                                          {...getFieldProps(
                                            'booking_unique_id',
                                          )}
                                          placeholder="Enter booking unique id"
                                          variant="outlined"
                                        />
                                      </FormControl>
                                      <span className="mx-1 text_small">
                                        (shown in email FROM field)
                                      </span>
                                    </div>
                                    <span className="d-block text-danger text_small">
                                      <ErrorMessage name="booking_unique_id" />
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
                                      Year<sup className="text_primary">*</sup>
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
                                        labelId="year"
                                        id="year"
                                        name="year"
                                        value={values.year}
                                        onChange={handleChange}
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem value="SelectOne" disabled>
                                          Select One
                                        </MenuItem>
                                        {yearsArrayEditEvent?.map(item => {
                                          return (
                                            <MenuItem key={item} value={item}>
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
                                        {...getFieldProps('internal_name')}
                                        placeholder="Enter Internal name"
                                        variant="outlined"
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
                                        {...getFieldProps('public_name')}
                                        placeholder="Enter public name"
                                        variant="outlined"
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
                                      Venue<sup className="text_primary">*</sup>
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
                                        labelId="venue_id"
                                        id="venue_id"
                                        name="venue_id"
                                        value={values.venue_id}
                                        onChange={handleChange}
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem value="Select" disabled>
                                          Select
                                        </MenuItem>
                                        {activeVenueList?.map(item => {
                                          return (
                                            <MenuItem
                                              key={item}
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
                                    <ErrorMessage name="venue_id" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Theme<sup className="text_primary">*</sup>
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
                                        labelId="theme_id"
                                        id="theme_id"
                                        name="theme_id"
                                        value={values.theme_id}
                                        onChange={handleChange}
                                        className="input_wrap select_wrap"
                                      >
                                        <MenuItem value="Select" disabled>
                                          Select
                                        </MenuItem>
                                        {activeThemeList?.map(item => {
                                          return (
                                            <MenuItem
                                              key={item}
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
                                    <ErrorMessage name="theme_id" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row className="align-items-start">
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>
                                      Default Options
                                      <span className="d-block fw_400">
                                        (for each new date added)
                                      </span>
                                    </label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <ul className="parties_option_wrap">
                                      <li className="mb-2">
                                        <div className="d-flex align-items-center  option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              onWheel={e => e.target.blur()}
                                              placeholder=""
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'total_places',
                                                  values.total_places &&
                                                    Number(values.total_places),
                                                );
                                              }}
                                              {...getFieldProps('total_places')}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Places
                                          </span>
                                        </div>
                                        <span className="d-block text-danger text_small">
                                          <ErrorMessage name="total_places" />
                                        </span>
                                      </li>
                                      <li className="mb-2">
                                        <div className="d-flex align-items-center  option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              onWheel={e => e.target.blur()}
                                              placeholder=""
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'overbook_maximum',
                                                  values.overbook_maximum &&
                                                    Number(
                                                      values.overbook_maximum,
                                                    ),
                                                );
                                              }}
                                              {...getFieldProps(
                                                'overbook_maximum',
                                              )}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Overbook Maximum
                                          </span>
                                        </div>
                                        <span className="d-block text-danger text_small">
                                          <ErrorMessage name="overbook_maximum" />
                                        </span>
                                      </li>
                                      <li className="mb-2">
                                        <div className="d-flex align-items-center  option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              onWheel={e => e.target.blur()}
                                              placeholder="Enter a Number"
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'minimum_places_exclusive',
                                                  values.minimum_places_exclusive &&
                                                    Number(
                                                      values.minimum_places_exclusive,
                                                    ),
                                                );
                                              }}
                                              {...getFieldProps(
                                                'minimum_places_exclusive',
                                              )}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Minimum Places for Exclusive
                                          </span>
                                        </div>
                                        <span className="d-block text-danger text_small">
                                          <ErrorMessage name="minimum_places_exclusive" />
                                        </span>
                                      </li>
                                      <li className="mb-2">
                                        <div className="d-flex align-items-center  option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              onWheel={e => e.target.blur()}
                                              placeholder="Enter a Number"
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'price_per_head',
                                                  values.price_per_head &&
                                                    Number(
                                                      values.price_per_head,
                                                    ).toFixed(2),
                                                );
                                              }}
                                              {...getFieldProps(
                                                'price_per_head',
                                              )}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Price Per Head (excl. tax)
                                          </span>
                                        </div>
                                        <span className="d-block text-danger text_small">
                                          <ErrorMessage name="price_per_head" />
                                        </span>
                                      </li>
                                      <li className="mb-2">
                                        <div className="d-flex align-items-center option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <TextField
                                              type="number"
                                              onWheel={e => e.target.blur()}
                                              placeholder="Enter a Number"
                                              inputProps={{
                                                min: 0,
                                                step: 'any',
                                              }}
                                              onBlurCapture={() => {
                                                setFieldValue(
                                                  'deposit_per_head',
                                                  values.deposit_per_head &&
                                                    Number(
                                                      values.deposit_per_head,
                                                    ).toFixed(2),
                                                );
                                              }}
                                              {...getFieldProps(
                                                'deposit_per_head',
                                              )}
                                              variant="outlined"
                                            />
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Deposit Per Head (excl. tax)
                                          </span>
                                        </div>
                                        <span className="d-block text-danger text_small">
                                          <ErrorMessage name="deposit_per_head" />
                                        </span>
                                      </li>
                                      <li>
                                        <div className="d-flex align-items-center mb-2 option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <Select
                                              labelId="taxRate-label"
                                              id="tax_code"
                                              name="tax_code"
                                              value={values.tax_code}
                                              displayEmpty
                                              onChange={handleChange}
                                              className="select_wrap"
                                            >
                                              <MenuItem value="" disabled>
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
                                          <span className="mx-1 text_small">
                                            Tax Code
                                            <sup className="text_primary">
                                              *
                                            </sup>
                                          </span>
                                          <span className="d-block text-danger text_small">
                                            <ErrorMessage name="tax_code" />
                                          </span>
                                        </div>
                                      </li>
                                      <li>
                                        <div className="d-flex align-items-center option_flex">
                                          <FormControl
                                            fullWidth
                                            className="main_input_wrap"
                                          >
                                            <Select
                                              labelId="priceRule-label"
                                              id="price_rule"
                                              name="price_rule"
                                              value={values.price_rule}
                                              onChange={handleChange}
                                              displayEmpty
                                              className="select_wrap"
                                            >
                                              <MenuItem value="">
                                                — Use default —
                                              </MenuItem>
                                              {activeSalesRulesList?.map(
                                                (item, index) => {
                                                  return (
                                                    <MenuItem
                                                      key={index}
                                                      value={item?._id}
                                                    >
                                                      {item?.sku}
                                                    </MenuItem>
                                                  );
                                                },
                                              )}
                                            </Select>
                                          </FormControl>
                                          <span className="mx-1 text_small">
                                            Price Rule
                                          </span>
                                        </div>
                                      </li>
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
                                      Sales Target (Places)
                                      <span className="d-block fw_400">
                                        <small>
                                          Please enter the total target amount
                                          of places for this event.
                                        </small>
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
                                        type="number"
                                        onWheel={e => e.target.blur()}
                                        placeholder="Enter a Number"
                                        inputProps={{ min: 0, step: 'any' }}
                                        onBlurCapture={() => {
                                          setFieldValue(
                                            'sales_target',
                                            values.sales_target &&
                                              Number(
                                                values.sales_target,
                                              ).toFixed(2),
                                          );
                                        }}
                                        {...getFieldProps('sales_target')}
                                        variant="outlined"
                                      />
                                    </FormControl>
                                  </div>
                                  <span className="d-block text-danger text_small">
                                    <ErrorMessage name="sales_target" />
                                  </span>
                                </Col>
                              </Row>
                            </li>
                            <li>
                              <Row>
                                <Col xs={5}>
                                  <div className="card_content_left">
                                    <label>Show Online</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        aria-labelledby="ShowOnline-label"
                                        name="radio-buttons-group"
                                        className="custom_radio"
                                        defaultValue={values.show_online}
                                        value={values.show_online}
                                        onChange={e =>
                                          setFieldValue(
                                            'show_online',
                                            e.target.value,
                                          )
                                        }
                                      >
                                        <FormControlLabel
                                          value={0}
                                          control={<Radio />}
                                          label="Yes"
                                        />
                                        <FormControlLabel
                                          value={1}
                                          control={<Radio />}
                                          label="No"
                                        />
                                        <FormControlLabel
                                          value={2}
                                          control={<Radio />}
                                          label="Show for BPE office only"
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
                                        aria-labelledby="active-label"
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
                                    <label>Deleted</label>
                                  </div>
                                </Col>
                                <Col xs={7}>
                                  <div className="card_content_right">
                                    <FormControl>
                                      <RadioGroup
                                        row
                                        aria-labelledby="deleted-label"
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
                              Save Event Setup Info
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </Col>
            <Col lg={6}>
              <div className="event_date_wrap">
                <div className="card_wrapper mb-3">
                  <div className="card_header py-2 px-3">
                    <h4 className="m-0 py-1 text_white">Event Dates</h4>
                  </div>
                  <div className="card_body admin_card_body">
                    <Formik
                      enableReinitialize={true}
                      innerRef={bulkUploadSubmiRef}
                      initialValues={{
                        field: '',
                        value: '',
                      }}
                      validationSchema={bulkUploadSchema}
                      onSubmit={values => {
                        let newObj = {
                          date: bulkUploadList.SelectedList,
                          field: values?.field ? values?.field : '',
                          value: values?.value,
                        };
                        dispatch(
                          bulkUpdateEventDate({ id: eventDetail?._id, newObj }),
                        );
                        bulkUploadSubmiRef &&
                          bulkUploadSubmiRef.current.resetForm();
                      }}
                    >
                      {({ handleSubmit, handleChange, values }) => (
                        <Form onSubmit={handleSubmit}>
                          <div className="bg_gray_box px-2 pt-3 event_date_inner">
                            <ul className="d-flex align-items-center flex-wrap">
                              <li>
                                <div className="d-flex align-items-center mb-3">
                                  <FormControl fullWidth>
                                    <Select
                                      labelId="Field"
                                      id="Field"
                                      name="field"
                                      value={values.field}
                                      onChange={handleChange}
                                      defaultValue="Any Year"
                                      className="input_wrap select_wrap"
                                    >
                                      <MenuItem value="Places">Places</MenuItem>
                                      <MenuItem value="overbook_maximum">
                                        Overbook Maximum
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                  <label>Field</label>
                                </div>
                              </li>
                              <li>
                                <div className="d-flex align-items-center mb-3 position-relative">
                                  <FormControl
                                    fullWidth
                                    className="main_input_wrap"
                                  >
                                    <TextField
                                      id="SKU"
                                      type="number"
                                      onWheel={e => e.target.blur()}
                                      variant="outlined"
                                      name="value"
                                      value={values.value}
                                      onChange={handleChange}
                                    />
                                  </FormControl>
                                  <label>Value</label>
                                </div>
                                <span className="d-block text-danger text_small">
                                  <ErrorMessage name="value" />
                                </span>
                              </li>
                              <li>
                                <div className="form-group checkbox_wrap mb-3">
                                  <FormGroup>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      checked={bulkUploadList.MasterChecked}
                                      onChange={e => {
                                        onMasterCheck(e);
                                      }}
                                      label="Check All?"
                                    />
                                  </FormGroup>
                                </div>
                              </li>
                            </ul>
                            <button
                              type="submit"
                              className="btn_primary small mb-3"
                            >
                              Bulk Update
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>

              <div className="event_date_bottom_wrap">
                <div className="card_wrapper">
                  <div className="card_body admin_card_body mb-3">
                    <Formik
                      enableReinitialize={true}
                      innerRef={addDateSubmiRef}
                      validationSchema={editDateSchema}
                      initialValues={{
                        start_date: '',
                        end_date: '',
                        overwrite_duplicate: false,
                      }}
                      onSubmit={values => {
                        let newobj = {
                          ...values,
                          start_date: moment(values.start_date).format(
                            'YYYY/MM/DD',
                          ),
                          end_date: moment(values.end_date).format(
                            'YYYY/MM/DD',
                          ),
                        };
                        dispatch(
                          createEventDate({
                            id: eventDetail?._id,
                            newobj,
                          }),
                        );
                        addDateSubmiRef && addDateSubmiRef.current.resetForm();
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
                          <div className="bg_gray_box px-2 pt-3 event_date_inner mb-2">
                            <ul className="d-flex align-items-center flex-wrap">
                              <li>
                                <div className="date_picker mb-3">
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      name="start_date"
                                      value={values.start_date}
                                      inputFormat="DD-MM-YYYY"
                                      onChange={date => {
                                        setFieldValue(
                                          'start_date',
                                          date?.toDate(),
                                        );
                                      }}
                                      renderInput={params => (
                                        <TextField
                                          {...params}
                                          onKeyDown={e => {
                                            if (e.keyCode === 8) {
                                              e.preventDefault();
                                              setFieldValue('start_date', null);
                                            }
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                </div>
                                <span className="d-block text-danger text_small">
                                  <ErrorMessage name="start_date" />
                                </span>
                              </li>
                              <li>
                                <div className="date_picker mb-3">
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      value={values.end_date}
                                      inputFormat="DD-MM-YYYY"
                                      name="end_date"
                                      onChange={date =>
                                        setFieldValue(
                                          'end_date',
                                          date?.toDate(),
                                        )
                                      }
                                      renderInput={params => (
                                        <TextField
                                          {...params}
                                          onKeyDown={e => {
                                            setFieldValue('end_date', null);
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                </div>
                                <span className="d-block text-danger text_small">
                                  <ErrorMessage name="end_date" />
                                </span>
                              </li>
                              <li>
                                <div className="form-group inline checkbox_wrap mb-3">
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={values.overwrite_duplicate}
                                          onChange={e => {
                                            setFieldValue(
                                              'overwrite_duplicate',
                                              e.target.checked,
                                            );
                                          }}
                                        />
                                      }
                                      label="Overwrite Duplicates?"
                                    />
                                  </FormGroup>
                                </div>
                              </li>
                            </ul>
                            <button
                              type="submit"
                              className="btn_primary small mb-3"
                            >
                              Add New Dates
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                    <div className="table_main_Wrapper event_date_table_wrap">
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>
                                <span onClick={() => requestSortActive('date')}>
                                  Date
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  onClick={() => requestSortActive('places')}
                                >
                                  Capacity
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  onClick={() =>
                                    requestSortActive(
                                      'price_per_head_exclusive',
                                    )
                                  }
                                >
                                  Price
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  onClick={() => requestSortActive('status')}
                                >
                                  Status
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  onClick={() =>
                                    requestSortActive('minimum_places')
                                  }
                                >
                                  Places
                                </span>
                              </TableCell>
                              <TableCell sx={{ width: '10%' }}>
                                Action
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.keys(eventDetail)?.length > 0 &&
                              eventDetail?.event_dates_data?.length > 0 &&
                              itemsActive.map(item => {
                                return (
                                  <TableRow
                                    className={
                                      `${
                                        item?.is_active ? !item.is_active : ''
                                      }` == ''
                                        ? 'disabled_row'
                                        : ''
                                    }
                                  >
                                    <TableCell>
                                      <div className="form-group checkbox_wrap mb-0">
                                        <FormGroup>
                                          <FormControlLabel
                                            control={<Checkbox />}
                                            checked={item.selected}
                                            onChange={e => {
                                              onItemCheck(e, item);
                                            }}
                                          />
                                        </FormGroup>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {moment(`${item?.date}`).format(
                                        'MMM Do YY',
                                      )}
                                    </TableCell>
                                    <TableCell>{item?.places}</TableCell>
                                    <TableCell>
                                      {item?.price_per_head_exclusive
                                        ? item?.price_per_head_exclusive?.toFixed(
                                            2,
                                          )
                                        : ''}
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        backgroundColor: `${
                                          item?.event_status_data?.colour || ''
                                        }`,
                                        color:
                                          `${item?.event_status_data?.name}` ===
                                          'Mixed Party Night'
                                            ? 'white'
                                            : '',
                                      }}
                                    >
                                      {item?.status ? item.status : ''}
                                    </TableCell>
                                    <TableCell>
                                      <span className="text_light">
                                        {item?.total_provisional}
                                      </span>{' '}
                                      | {item?.total_confirmed}
                                    </TableCell>
                                    <TableCell>
                                      <ul className="action_wrap">
                                        <li>
                                          <Link
                                            to={`/admin/events/parties/edit-parties/edit-date/${item?._id}`}
                                            className="btn_edit"
                                          >
                                            <img
                                              src={EditIcon}
                                              alt="Edit Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <button
                                            type="button"
                                            className={
                                              `${item.is_active}` === 'true'
                                                ? 'btn_warning'
                                                : 'btn_info'
                                            }
                                            onClick={() =>
                                              suspendHandler(
                                                item,
                                                dispatch,
                                                updateEventDate,
                                                'date',
                                              )
                                            }
                                          >
                                            {item?.is_active
                                              ? 'Suspend'
                                              : 'Activate'}
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            type="button"
                                            className="btn_border small"
                                            onClick={() => {
                                              OpenDelete(item);
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </li>
                                      </ul>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                  <div className="table_pagination_wrap">
                    {itemsActive.length > 0 ? (
                      <Row className="g-0 align-items-center my-2">
                        <Col sm={6}>
                          <div className="total_entry">
                            <p className="m-0">
                              Showing {activeIndexOfFirstItem + 1} to{' '}
                              {Math.min(
                                activeIndexOfLastItem,
                                eventDateDetail?.length,
                              )}{' '}
                              of {eventDateDetail?.length} entries
                            </p>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="pagination_wrap">
                            <Stack spacing={2}>
                              <Pagination
                                count={totalActiveRecordPage}
                                page={currentPage.activeCurrentPage}
                                onChange={(e, page) =>
                                  setCurrentPage({
                                    ...currentPage,
                                    activeCurrentPage: page,
                                  })
                                }
                              />
                            </Stack>
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <DataNotFound />
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <EventInfoBPE
          dispatch={dispatch}
          eventDetail={eventDetail}
          optionsSurvivorBreakfastAt={optionsSurvivorBreakfastAt}
        />
        <ETicketInfo dispatch={dispatch} eventDetail={eventDetail} />

        <EventProducts
          dispatch={dispatch}
          eventDetail={eventDetail}
          eventId={eventId}
          products={products}
          productData={products}
          setProducts={setProducts}
        />

        <Automation dispatch={dispatch} eventDetail={eventDetail} />
        <DuplicateAndCloneEvent
          eventInitialEvent={eventInitialEvent}
          editPartiesSchema={editPartiesSchema}
          dispatch={dispatch}
          yearsArray={yearsArrayEditEvent}
          activeVenueList={activeVenueList}
          activeThemeList={activeThemeList}
          activeTaxCodesList={activeTaxCodesList}
          activeSalesRulesList={activeSalesRulesList}
        />
      </div>
      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteEventDate}
        name="Are you sure you want to delete this date? Note: this cannot be undone"
      />
    </div>
  );
}
