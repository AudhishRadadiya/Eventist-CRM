import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import CheckIcon from '../../Assets/Img/check-green.svg';
import CrossIcon from '../../Assets/Img/cross-red.svg';
import EyeIcon from '../../Assets/Img/eye.svg';
import { Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEnquiriesListData,
  setIsEnquirieUpdated,
} from 'store/reducers/Enquiry/enquiries.slice';
import Loader from 'Components/Common/Loader';
import {
  getEventData,
  getEventListData,
} from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getUniqueYears } from 'utils/FieldValues';

import useSortable from 'utils/useSortable';
import DataNotFound from 'Components/Common/DataNotFound';
import moment from 'moment';
import { BookNoteTable } from './BookNoteTable';
import { checkEmail } from 'utils/common';

export default function Index() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { search, state } = useLocation();
  const [pageSize, setPageSize] = useState(25);
  const currentYear = new Date().getFullYear();

  const isParties = new URLSearchParams(search).get('parties') === 'true';

  const { enquirieLoading, isEnquirieUpdated, enquiriesList } = useSelector(
    ({ enquiries }) => enquiries,
  );
  const { activeEventList, inActiveEventList, eventLoading, eventDateDetail } =
    useSelector(({ parties }) => parties);

  const newEventList = [...activeEventList, ...inActiveEventList];

  const uniqueYears = getUniqueYears(newEventList);

  const searchParams = new URLSearchParams(location.search);
  const params = {};
  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  const [onSearchingData, setOnSearchingData] = useState({
    year: 'All',
    include_cancelled: false,
    date: 'All',
    event: 'All',
    search: '',
  });

  const [filterEvent, setFilterEvent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentYearDataFirst, setCurrentYearDataFirst] = useState(false);

  const activeIndexOfLastItem = currentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  useEffect(() => {
    let data =
      search.includes('?date=true') && id
        ? {
            no_venue_date: id === 'null' ? null : id,
            event: params.eventid ? params.eventid : '',
          }
        : { contact: id };

    const bookingData = {
      ...data,
      is_booking: false,
      page: 1,
      size: pageSize,
    };
    if (search.includes('?date=true')) {
      dispatch(getEnquiriesListData(bookingData));
    }
  }, [dispatch, location.search]);

  useEffect(() => {
    let data = search === '?contact=true' && { contact: id };

    const bookingData = {
      ...data,
      is_booking: false,
      page: 1,
      size: pageSize,
    };

    // dispatch(getVenueListData());
    dispatch(getEventListData());
    // if (Object.keys(params)?.length === 0)
    //   dispatch(getEnquiriesListData(bookingData));
    if (Object.keys(params).length === 0 || params['contact'] === 'true') {
      dispatch(getEnquiriesListData(bookingData));
    }
  }, [dispatch, location.search, pageSize]);

  useEffect(() => {
    if (params.year) {
      const yearData = params.year || new Date().getFullYear();
      const eventData = params.event || '';
      const dateData = params.date || '';
      const includeData = params?.include_cancelled
        ? JSON.parse(params.include_cancelled)
        : false || false;
      setCurrentPage(1);
      setOnSearchingData({
        ...onSearchingData,
        year: yearData,
        event: eventData,
        date: dateData,
        include_cancelled: includeData,
      });
      dispatch(
        getEnquiriesListData({
          ...onSearchingData,
          year: yearData === 'All' ? '' : Number(yearData),
          event: eventData,
          date: dateData,
          include_cancelled: includeData,
          page: 1,
          size: pageSize,
          is_booking: false,
        }),
      );
    } else {
      setOnSearchingData({
        ...onSearchingData,
        year: 'All',
        include_cancelled: false,
        date: 'All',
        event: 'All',
        search: '',
      });
    }
  }, [location.search]);

  useEffect(() => {
    if (id && isParties) {
      const bookingData = {
        is_booking: false,
        page: currentPage,
        size: 50,
        date: id,
        event: state?.event,
        from_dashboard_ev_dates: true,
      };
      dispatch(getEnquiriesListData(bookingData));
    }
  }, [dispatch, id]);
  useEffect(() => {
    const bookingData = {
      is_booking: false,
      page: currentPage,
      size: pageSize,
    };
    setCurrentPage(1);
    if (isEnquirieUpdated) {
      dispatch(getEnquiriesListData(bookingData));
      dispatch(setIsEnquirieUpdated(false));
    }
  }, [isEnquirieUpdated, dispatch]);

  const handlePageStartIndex = (page, limit) => {
    let startIndex = (page - 1) * limit + 1;
    return startIndex;
  };

  const handlePageChange = page => {
    const bookingData = {
      ...onSearchingData,
      is_booking: false,
      page: handlePageStartIndex(page, pageSize),
      size: pageSize,
    };
    if (search.includes('?date=true') && id) {
      bookingData['no_venue_date'] = id === 'null' ? null : id;
      bookingData['event'] = params.eventid ? params.eventid : '';
    }
    dispatch(getEnquiriesListData(bookingData));
  };
  const handleEventFilter = data => {
    let newArr = newEventList.filter((item, index) => item.year === data);
    setFilterEvent(newArr);
  };
  const activeCurrentData = useMemo(() => {
    if (Object.entries(enquiriesList).length > 0) {
      return enquiriesList.bookings;
    } else {
      return [];
    }
  }, [enquiriesList]);
  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);
  return (
    <div className="inner_wrapper">
      {(enquirieLoading || eventLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Enquiries</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <Row className="align-items-center">
          <Col xs={3}>
            <h1>Events Dashboard</h1>
          </Col>
          <Col xs={9}>
            <div className="top_filter_wrap">
              <ul className="enquirie_top_filter">
                <li>
                  <div className="form-group inline mb-0">
                    <span className="label">Year:</span>
                    <FormControl fullWidth>
                      <Select
                        labelId="Year-label"
                        id="Year-select"
                        name="year"
                        value={
                          !onSearchingData.year ? 'All' : onSearchingData.year
                        }
                        onChange={e => {
                          navigate(
                            `/enquiries?year=${e.target.value}&event=${onSearchingData.event}&date=${onSearchingData.date}`,
                          );
                          setOnSearchingData({
                            ...onSearchingData,
                            year: e.target.value,
                          });
                          if (e.target.value !== 'All') {
                            handleEventFilter(e.target.value);
                          }
                          // dispatch(
                          //   getEnquiriesListData({
                          //     ...onSearchingData,
                          //     year: e.target.value,
                          //     page: currentPage,
                          //     size: pageSize,
                          //     is_booking: false,
                          //   }),
                          // );
                        }}
                        onClick={e => {
                          setCurrentYearDataFirst(true);
                        }}
                        className="select_wrap"
                      >
                        <MenuItem value="All" selected>
                          All year
                        </MenuItem>
                        {uniqueYears?.map(item => {
                          return (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </li>
                <li>
                  <div className="form-group inline mb-0">
                    <span className="label">Select Event: Venue</span>
                    <FormControl fullWidth>
                      <Select
                        labelId="Event-label"
                        id="Event-select"
                        name="event"
                        value={
                          !onSearchingData.event ? 'All' : onSearchingData.event
                        }
                        onChange={e => {
                          navigate(
                            `/enquiries?year=${onSearchingData.year}&event=${e.target.value}&date=${onSearchingData.date}`,
                          );
                          setOnSearchingData({
                            ...onSearchingData,
                            event: e.target.value,
                          });

                          // dispatch(
                          //   getEnquiriesListData({
                          //     ...onSearchingData,
                          //     event: e.target.value,
                          //     page: currentPage,
                          //     size: pageSize,
                          //     is_booking: false,
                          //   }),
                          // );
                        }}
                        className="select_wrap"
                      >
                        <MenuItem value="All" selected>
                          Select Event
                        </MenuItem>

                        {onSearchingData?.year === 'All'
                          ? !currentYearDataFirst
                            ? newEventList
                                ?.filter(item => item?.year == currentYear)
                                ?.slice()
                                ?.sort((a, b) => a?.sku?.localeCompare(b?.sku))
                                ?.map((item, index) => {
                                  return (
                                    <MenuItem
                                      key={index}
                                      value={item?._id}
                                      onClick={() => {
                                        dispatch(getEventData(item?._id));
                                      }}
                                    >
                                      {item?.sku} - {item?.public_name}
                                    </MenuItem>
                                  );
                                })
                            : newEventList
                                ?.slice()
                                ?.sort((a, b) => a?.sku?.localeCompare(b?.sku))
                                ?.map((item, index) => {
                                  return (
                                    <MenuItem
                                      key={index}
                                      value={item?._id}
                                      onClick={() => {
                                        dispatch(getEventData(item?._id));
                                      }}
                                    >
                                      {item?.sku} - {item?.public_name}
                                    </MenuItem>
                                  );
                                })
                          : onSearchingData?.year !== 'All' &&
                            filterEvent.length > 0 &&
                            filterEvent.map((item, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={item?._id}
                                  onClick={() => {
                                    dispatch(getEventData(item?._id));
                                  }}
                                >
                                  {item?.sku} - {item?.public_name}
                                </MenuItem>
                              );
                            })}
                      </Select>
                    </FormControl>
                  </div>
                </li>
                {onSearchingData.event !== 'All' &&
                  Object.keys(eventDateDetail).length > 0 && (
                    <li>
                      <div className="form-group inline date_picker mb-0">
                        <span className="label">Date</span>
                        <FormControl fullWidth>
                          <Select
                            labelId="Event-label"
                            id="Event-select"
                            name="date"
                            value={
                              !onSearchingData.date
                                ? 'All'
                                : onSearchingData.date
                            }
                            onChange={e => {
                              navigate(
                                `/enquiries?year=${onSearchingData.year}&event=${onSearchingData.event}&date=${e.target.value}`,
                              );
                              setOnSearchingData({
                                ...onSearchingData,
                                date: e.target.value,
                              });
                              // dispatch(
                              //   getEnquiriesListData({
                              //     ...onSearchingData,
                              //     date: e.target.value,
                              //     page: currentPage,
                              //     size: pageSize,
                              //     is_booking: false,
                              //   }),
                              // );
                            }}
                            className="select_wrap"
                          >
                            <MenuItem value="All">Show all</MenuItem>
                            {eventDateDetail?.map((item, index) => {
                              return (
                                <MenuItem key={index} value={item?._id}>
                                  {moment(item?.date).format(
                                    'dddd Do MMMM YYYY',
                                  )}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                    </li>
                  )}
                <li>
                  <div className="form-group inline checkbox_wrap mb-0">
                    <FormGroup>
                      <FormControlLabel
                        className="me-0"
                        control={
                          <Checkbox
                            name="include_cancelled"
                            onChange={e => {
                              navigate(
                                `/enquiries?year=${onSearchingData.year}&event=${onSearchingData.event}&date=${onSearchingData.date}&include_cancelled=${e.target.checked}`,
                              );
                              setOnSearchingData({
                                ...onSearchingData,
                                include_cancelled: e.target.checked,
                              });
                              // dispatch(
                              //   getEnquiriesListData({
                              //     ...onSearchingData,
                              //     include_cancelled: e.target.checked,
                              //     page: currentPage,
                              //     size: pageSize,
                              //     is_booking: false,
                              //   }),
                              // );
                            }}
                          />
                        }
                        label="Include Cancelled"
                      />
                    </FormGroup>
                  </div>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>

      <div className="latest_booking_wrap">
        <div className="parties_table_Wrap">
          <Row className="align-items-end justify-content-between mb-3">
            <Col xs={4}>
              <h4 className="fw_600">Latest Enquiries</h4>
              {state && (
                <div className="d-flex align-items-center">
                  <span className="label me-2">Show:</span>
                  <FormControl fullWidth>
                    <Select
                      labelId="Year-label"
                      id="Year-select"
                      name="year"
                      value={pageSize.toString()}
                      onChange={e => {
                        setPageSize(+e.target.value);
                        setCurrentPage(1);
                      }}
                      defaultValue="Select One"
                      className="select_wrap"
                    >
                      <MenuItem value="25">25</MenuItem>
                      <MenuItem value="50">50</MenuItem>
                      <MenuItem value="100">100</MenuItem>
                      <MenuItem value="150">150</MenuItem>
                      <MenuItem value="200">200</MenuItem>
                      <MenuItem value={enquiriesList?.total?.toString() || ''}>
                        All
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <span className="label ms-2">entries</span>
                </div>
              )}
            </Col>
            <Col xs={3}>
              <div className="search_wrapper_common">
                <input
                  type="search"
                  placeholder="Search"
                  className="form-control"
                  onChange={e => {
                    setOnSearchingData({
                      ...onSearchingData,
                      search: e.target.value,
                    });
                  }}
                />
                <button className="btn_primary small">
                  <SearchOutlinedIcon
                    onClick={e => {
                      dispatch(
                        getEnquiriesListData({
                          ...onSearchingData,
                          page: currentPage,
                          size: pageSize,
                          is_booking: false,
                          no_venue_date: id == 'null' ? null : id,
                        }),
                      );
                    }}
                  />
                </button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="table_main_Wrapper vertical_top">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>
                    <span>Event - Date</span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('ref_number')}>
                      Booking Ref
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('contact')}>
                      Contact
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('enquired')}>
                      Enquired
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('agent_ref_po_no')}>
                      PO/Agent Ref
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('date')}>
                      Date Enquired
                    </span>
                  </TableCell>
                  <TableCell>
                    <span>Booking Notes</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsActive?.map(enquiries => {
                  return (
                    <TableRow
                      className={enquiries?.is_cancelled ? 'bg_highlight' : ''}
                    >
                      <TableCell>
                        <Link
                          className="view_btn"
                          to={`/edit-enquiries/${enquiries?._id}`}
                        >
                          <img src={EyeIcon} alt="Eye Icon" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/edit-enquiries/${enquiries?._id}`}>
                          <ul className="event_date_wrap">
                            {enquiries?.events?.map(i => (
                              <li>{i}</li>
                            ))}
                          </ul>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {enquiries?.ref_number ? enquiries?.ref_number : '-'}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/contact/edit-contact/${enquiries?.contact?._id}`}
                          className="contact_text_wrap"
                        >
                          <span>
                            {enquiries?.contact &&
                            checkEmail(enquiries?.contact?.email_primary) ? (
                              <img src={CheckIcon} alt="checkIcon" />
                            ) : (
                              ''
                              // <img src={CrossIcon} alt="CrossIcons" />
                            )}
                          </span>{' '}
                          {enquiries?.contact?.first_name}
                          <span className="d-block">
                            {enquiries?.contact?.surname}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {enquiries?.places ? enquiries?.places : '-'}
                      </TableCell>
                      <TableCell>
                        {enquiries?.agent_ref_po_no
                          ? enquiries?.agent_ref_po_no
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <span className="date_wrapper">
                          {enquiries?.date_enquired
                            ? moment(enquiries?.date_enquired).format(
                                'MMMM Do YYYY, h:mm:ss',
                              )
                            : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="inner_table_wrap">
                        {enquiries?.enquiry_note.length > 0 ? (
                          <BookNoteTable noteData={enquiries?.enquiry_note} />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="table_pagination_wrap">
            {itemsActive?.length > 0 ? (
              <Row className="g-0 align-items-center my-2">
                <Col sm={6}>
                  <div className="total_entry">
                    <p className="m-0">
                      Showing {activeIndexOfFirstItem + 1} to{' '}
                      {activeIndexOfFirstItem + enquiriesList?.bookings?.length}{' '}
                      of {enquiriesList?.total} entries
                    </p>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="pagination_wrap">
                    <Stack spacing={2}>
                      <Pagination
                        count={enquiriesList.totalPages}
                        page={currentPage}
                        onChange={(e, page) => {
                          setCurrentPage(page);
                          handlePageChange(page);
                        }}
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
    </div>
  );
}
