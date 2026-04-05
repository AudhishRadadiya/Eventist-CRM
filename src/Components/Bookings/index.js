import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import CheckIcon from '../../Assets/Img/check-green.svg';
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
import useSortable from 'utils/useSortable';
import Loader from 'Components/Common/Loader';
import DataNotFound from 'Components/Common/DataNotFound';
import moment from 'moment';
import { BookingNoteTable } from './BookingNoteTable';
import {
  getEnquiriesListData,
  setIsEnquirieUpdated,
} from 'store/reducers/Enquiry/enquiries.slice';
import {
  getEventData,
  getEventListData,
} from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getVenueListData } from 'store/reducers/Admin/Events/venue.slice';
import { getUniqueYears } from 'utils/FieldValues';
import { checkEmail } from 'utils/common';
import { setGuestlistUpdatedNewData } from 'store/reducers/Booking/bookingGuest.slice';
import ExcelIcon from '../../Assets/Img/excel-icon.svg';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function Bookings() {
  // const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [pageSize, setPageSize] = useState(1400);
  const searchParams = new URLSearchParams(location.search);
  const params = {};
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  const { search, state } = useLocation();

  const { enquirieLoading, isEnquirieUpdated, enquiriesList } = useSelector(
    ({ enquiries }) => enquiries,
  );
  const { activeEventList, inActiveEventList, eventLoading, eventDateDetail } =
    useSelector(({ parties }) => parties);

  const newEventList = [...activeEventList, ...inActiveEventList];

  const currentYear = new Date().getFullYear();

  // Assuming 'events' is the array you provided
  const uniqueYears = getUniqueYears(newEventList);

  const isAccount = new URLSearchParams(search).get('account') === 'true';
  const isContact = new URLSearchParams(search).get('contact') === 'true';
  const isParties = new URLSearchParams(search).get('parties') === 'true';
  const isIncludeCancelled =
    new URLSearchParams(search).get('show') === 'cancelled';

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

  const activeIndexOfLastItem = currentPage * (state ? pageSize : 25);
  const activeIndexOfFirstItem =
    activeIndexOfLastItem - (state ? pageSize : 25);

  const handlePageStartIndex = (page, limit) => {
    let startIndex = (page - 1) * limit + 1;
    return startIndex;
  };
  const handleNotes = note => {
    let internalNotes = [];
    let newArr = note.filter(
      data => data?.visibility === 0 || data.visibility === 2,
    );
    newArr?.length > 0
      ? newArr?.map(data =>
          internalNotes?.push(
            `${data.user?.name} - ${moment(data?.date).format(
              'DD/MM/YYYY',
            )} - ${data?.subject} \n`,
          ),
        )
      : internalNotes?.push(
          `${note[0].user?.name} - ${moment(note[0]?.date).format(
            'DD/MM/YYYY',
          )} - ${note[0]?.subject}`,
        );

    return internalNotes;
  };

  const handlePublic = note => {
    let publicNotes = [];
    let newArr = note.filter(
      data => data?.visibility === 1 || data.visibility === 2,
    );
    newArr?.length > 0
      ? newArr?.map(data =>
          publicNotes?.push(
            `${data.user?.name} - ${moment(data?.date).format(
              'DD/MM/YYYY',
            )} - ${data?.subject} \n`,
          ),
        )
      : publicNotes?.push(`${note[0].user?.name} - ${moment(
          note[0]?.date,
        ).format('DD/MM/YYYY')} - ${note[0]?.subject}
      `);
    return publicNotes;
  };
  useEffect(() => {
    dispatch(getVenueListData());
    dispatch(getEventListData());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
    if (params) {
      const bookingData = {
        is_booking: true,
        page: handlePageStartIndex(currentPage, state ? pageSize : 25),
        size: state ? pageSize : 25,
      };
      const stateData = { ...onSearchingData };
      if (isIncludeCancelled || params?.include_cancelled) {
        bookingData['contact'] = params.date ?? params?.contactid ?? '';
        bookingData['include_cancelled'] = true;
        stateData['include_cancelled'] = params?.include_cancelled;
      }
      if (params?.contactid && isAccount) {
        bookingData['account'] = params.date ?? params?.contactid ?? '';
      } else if (params?.contactid && isContact) {
        bookingData['contact'] = params.date ?? params?.contactid ?? '';
      } else if (isParties || params?.year) {
        bookingData['year'] = Number(params?.year) ?? '';
        if (!isIncludeCancelled) {
          bookingData['date'] = params.date ?? params?.contactid ?? '';
        }
        bookingData['event'] = params?.event ?? '';
        stateData['year'] = Number(params?.year) ?? 'All';
        stateData['event'] = params?.event ?? 'All';
        stateData['date'] = params.date ?? params?.contactid ?? 'All';
        handleEventFilter(Number(params?.year));
        if (params.date !== 'All' && params?.event) {
          dispatch(getEventData(params?.event));
        }
      }
      setOnSearchingData(stateData);

      dispatch(getEnquiriesListData(bookingData));
    } else {
      const bookingData = {
        is_booking: true,
        page: handlePageStartIndex(currentPage, state ? pageSize : 25),
        size: state ? pageSize : 25,
      };

      if (Object.keys(params)?.length === 0)
        dispatch(getEnquiriesListData(bookingData));
    }
  }, [location.search, pageSize]);

  useEffect(() => {
    setCurrentPage(1);

    const bookingData = {
      ...onSearchingData,
      is_booking: true,
      page: handlePageStartIndex(currentPage, state ? pageSize : 25),
      size: state ? pageSize : 25,
    };
    if (isEnquirieUpdated) {
      dispatch(getEnquiriesListData(bookingData));
      dispatch(setIsEnquirieUpdated(false));
    }
  }, [isEnquirieUpdated, dispatch]);

  const handlePageChange = page => {
    if (params?.contactid && isParties) {
      const bookingData = {
        is_booking: true,
        page: handlePageStartIndex(page, state ? pageSize : 25),
        size: state ? pageSize : 25,
        year: Number(params?.year),
        date: params?.contactid,
        event: params?.event,
      };
      dispatch(getEnquiriesListData(bookingData));
    } else {
      const bookingData = {
        ...onSearchingData,
        is_booking: true,
        page: handlePageStartIndex(page, state ? pageSize : 25),
        size: state ? pageSize : 25,
      };
      dispatch(getEnquiriesListData(bookingData));
    }
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

  const downloadCsv = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet', {});

    if (itemsActive?.length > 0) {
      worksheet.getRow(1).values = [
        'Booking Ref',
        'Event Name',
        'Organisation',
        'Contact Name',
        'Enquired Places',
        'Provisional Places',
        'Confirmed Places',
        'Venue Notes',
        'Public Notes',
        'PO Ref',
      ];

      worksheet.getRow(1).font = {
        bold: true,
      };

      worksheet.columns = [
        { key: 'ref_number', width: 17 },
        { key: 'internal_name', width: 17 },
        { key: 'organization', width: 17 },
        { key: 'contact_name', width: 17 },
        { key: 'places', width: 17 },
        { key: 'provisional_places', width: 17 },
        { key: 'confirmed_places', width: 17 },
        { key: 'venue_notes', width: 17 },
        { key: 'public_notes', width: 17 },
        { key: 'agent_ref_po_no', width: 17 },
      ];

      itemsActive?.forEach(data => {
        worksheet.addRow({
          ref_number: data?.ref_number,
          internal_name: data?.event.internal_name,
          organization: data?.organization ? data?.organization : '-',
          contact_name: data?.contact.first_name + ' ' + data?.contact.surname,
          places: data?.places,
          provisional_places: data?.provisional_places,
          confirmed_places: data?.confirmed_places,
          venue_notes: data?.csv_venue_notes,
          public_notes: data?.csv_public_notes,
          agent_ref_po_no: data?.agent_ref_po_no,
        });
      });
    }
    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `${state?.event_name}_${moment(new Date()).format('YYYY-MM-DD')}.xlsx`,
      );
    });
  };

  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);

  return (
    <div className="inner_wrapper">
      {enquirieLoading && <Loader />}
      {eventLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Bookings</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title booking_title_wrap">
        <Row className="align-items-center">
          <Col xs={3}>
            <h1>Events Dashboard</h1>
          </Col>
          <Col xs={9}>
            <div className="top_filter_wrap">
              <ul>
                <li>
                  <div className="form-group inline mb-0 year_wrap">
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
                          let searchParams = new URLSearchParams(
                            window.location.search,
                          );
                          searchParams.set('year', e.target.value);
                          searchParams.delete('event');
                          searchParams.delete('date');
                          if (params?.contactid) {
                            navigate(`/bookings?${searchParams}`);
                          } else {
                            navigate(
                              `/bookings?year=${e.target.value}&event=${onSearchingData?.event}&date=${onSearchingData?.date}`,
                            );
                          }
                          setOnSearchingData({
                            ...onSearchingData,
                            year: e.target.value,
                          });
                        }}
                        onClick={e => {
                          setCurrentYearDataFirst(true);
                        }}
                        defaultValue="Select One"
                        className="select_wrap"
                      >
                        <MenuItem value="All">All year</MenuItem>
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
                          let searchParams = new URLSearchParams(
                            window.location.search,
                          );
                          searchParams.set('event', e.target.value);
                          if (!isIncludeCancelled && !isContact && !isAccount)
                            searchParams.set('date', 'All');
                          if (params?.contactid) {
                            navigate(`/bookings?${searchParams}`);
                          } else {
                            navigate(
                              `/bookings?year=${onSearchingData?.year}&event=${e.target.value}&date=${onSearchingData?.date}`,
                            );
                          }
                          setOnSearchingData({
                            ...onSearchingData,
                            event: e.target.value,
                          });
                        }}
                        defaultValue="Select"
                        className="select_wrap"
                      >
                        <MenuItem value="All">Select Event</MenuItem>
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
                              let searchParams = new URLSearchParams(
                                window.location.search,
                              );
                              searchParams.set('date', e.target.value);

                              if (params?.contactid) {
                                navigate(`/bookings?${searchParams}`);
                              } else {
                                navigate(
                                  `/bookings?year=${onSearchingData?.year}&event=${onSearchingData?.event}&date=${e.target.value}`,
                                );
                              }
                              setOnSearchingData({
                                ...onSearchingData,
                                date: e.target.value,
                              });
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
                            value={onSearchingData?.include_cancelled}
                            // checked={onSearchingData.include_cancelled}
                            onChange={e => {
                              let searchParams = new URLSearchParams(
                                window.location.search,
                              );
                              if (e.target.checked)
                                searchParams.set('include_cancelled', 'true');
                              else searchParams.delete('include_cancelled');

                              if (params?.contactid) {
                                navigate(`/bookings?${searchParams}`);
                              } else {
                                navigate(
                                  `/bookings?year=${onSearchingData?.year}&event=${onSearchingData?.event}&date=${onSearchingData?.date}&include_cancelled=${e.target.checked}`,
                                );
                              }
                              // setOnSearchingData({
                              //   ...onSearchingData,
                              //   include_cancelled: e.target.checked,
                              // });
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
            {/* <Col xs={state ? 6 : 4}> */}
            <Col xs={4}>
              <h4 className="fw_600">
                {/* <h4 className="fw_600 m-0"> */}
                {state ? 'Current Bookings' : 'Latest Bookings'}
              </h4>
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
                      <MenuItem value="1400">All</MenuItem>
                    </Select>
                  </FormControl>
                  <span className="label ms-2">entries</span>
                </div>
              )}
            </Col>
            <Col
              xs={state ? 7 : 3}
              className="d-flex justify-content-end align-items-center "
            >
              <Col xs={state ? 5 : 12}>
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
                      onClick={() => {
                        dispatch(
                          getEnquiriesListData({
                            ...onSearchingData,
                            page: handlePageStartIndex(
                              currentPage,
                              state ? pageSize : 25,
                            ),
                            size: state ? pageSize : 25,
                            is_booking: true,
                          }),
                        );
                      }}
                    />
                  </button>
                </div>
              </Col>
              {state ? (
                <Col xs={2}>
                  <span
                    className="d-flex align-items-center justify-content-end"
                    role="button"
                  >
                    <div className="pdf_icon" onClick={downloadCsv}>
                      <img src={ExcelIcon} alt="pdf Icon" />
                    </div>
                    <div className="pdf_text" onClick={downloadCsv}>
                      <p className="m-0 ps-1">Download .CSV</p>
                    </div>
                  </span>
                </Col>
              ) : null}
            </Col>
          </Row>

          {enquiriesList?.length === 0 && (
            <Link
              to={`/create-new-booking/${params?.contactid}`}
              className="btn_border small"
            >
              Add New Booking
            </Link>
          )}

          {enquiriesList?.length !== 0 && isParties ? (
            <Row className="align-items-center">
              <h4 className="fw_600 m-0">
                {moment(state?.event_date).format('dddd Do MMMM')}
              </h4>
            </Row>
          ) : (
            ''
            // <p className="text_primary ">
            //   There are currently no bookings listed
            // </p>
          )}
        </div>
        <div className="table_main_Wrapper vertical_top">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>
                    <span
                      onClick={() => requestSortActive('event.internal_name')}
                    >
                      Event{' '}
                    </span>
                  </TableCell>
                  {(state === '' || state === null) && (
                    <TableCell>
                      <span
                        onClick={() => requestSortActive('event_date.date')}
                      >
                        Date
                      </span>
                    </TableCell>
                  )}
                  <TableCell>
                    <span onClick={() => requestSortActive('ref_number')}>
                      Booking Ref
                    </span>
                  </TableCell>
                  {state && (
                    <TableCell>
                      <span>Organisation</span>
                    </TableCell>
                  )}
                  <TableCell>
                    <span onClick={() => requestSortActive('contact')}>
                      Contact
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('places')}>
                      Enquired
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => requestSortActive('provisional_places')}
                    >
                      Provisional
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('confirmed_places')}>
                      Confirmed
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('agent_ref_po_no')}>
                      Agent Ref
                    </span>
                  </TableCell>
                  {(state === '' || state === null) && (
                    <TableCell>
                      <span
                        onClick={() => requestSortActive('booking_created')}
                      >
                        Date Booked
                      </span>
                    </TableCell>
                  )}
                  {(state === '' || state === null) && (
                    <TableCell>Booking Notes</TableCell>
                  )}
                  {state && <TableCell>Internal Notes</TableCell>}
                  {state && <TableCell>Public Notes</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsActive?.map(bookings => {
                  return (
                    <TableRow
                      key={bookings?._id}
                      className={bookings?.is_cancelled ? 'bg_highlight' : ''}
                    >
                      <TableCell>
                        <Link
                          className="view_btn"
                          to={`/edit-bookings/${bookings?._id}`}
                          onClick={() =>
                            dispatch(setGuestlistUpdatedNewData({}))
                          }
                        >
                          <img src={EyeIcon} alt="Eye Icon" />
                        </Link>
                      </TableCell>
                      {(state === '' || state === null) && (
                        <TableCell>
                          {bookings?.event?.internal_name ? (
                            <Link to={`/edit-bookings/${bookings?._id}`}>
                              {bookings?.event ? (
                                <div style={{ whiteSpace: 'pre-line' }}>
                                  {bookings?.event?.internal_name.replace(
                                    /,/g,
                                    '\n',
                                  )}
                                </div>
                              ) : (
                                '-'
                              )}
                            </Link>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        {bookings?.event_date?.date ? (
                          <Link
                            to={`/edit-bookings/${bookings?._id}`}
                            className="date_wrapper"
                          >
                            {bookings?.event_date?.date
                              ? moment(bookings?.event_date?.date).format(
                                  'dddd Do MMMM',
                                )
                              : '-'}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {bookings?.ref_number
                          ? `${bookings.ref_number} (${bookings.ref_number_uid})`
                          : '-'}
                      </TableCell>
                      {state && (
                        <TableCell>
                          {bookings?.organization
                            ? bookings?.organization
                            : '-'}
                        </TableCell>
                      )}
                      <TableCell>
                        <Link
                          to={`/contact/edit-contact/${bookings?.contact?._id}`}
                          className="contact_text_wrap"
                        >
                          <span>
                            {bookings?.contact &&
                            checkEmail(bookings?.contact?.email_primary) ? (
                              <img src={CheckIcon} alt="checkIcon" />
                            ) : (
                              ''
                              // <img src={CrossIcon} alt="CrossIcons" />
                            )}
                          </span>{' '}
                          {bookings?.contact?.first_name}
                          <span className="d-block">
                            {bookings?.contact?.surname}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {bookings?.places ? bookings?.places : '-'}
                      </TableCell>
                      <TableCell>
                        {bookings?.provisional_places
                          ? bookings?.provisional_places
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {bookings?.confirmed_places
                          ? bookings?.confirmed_places
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {bookings?.agent_ref_po_no
                          ? bookings?.agent_ref_po_no
                          : '-'}
                      </TableCell>
                      {(state === '' || state === null) && (
                        <TableCell>
                          <span className="date_wrapper">
                            {bookings?.booking_created
                              ? moment(bookings?.booking_created).format(
                                  'MMMM Do YYYY, h:mm:ss',
                                )
                              : '-'}
                          </span>
                        </TableCell>
                      )}
                      {(state === '' || state === null) && (
                        <>
                          <TableCell className="inner_table_wrap">
                            {bookings?.enquiry_note?.length > 0 ? (
                              <BookingNoteTable
                                noteData={bookings?.enquiry_note}
                              />
                            ) : (
                              ''
                            )}
                          </TableCell>
                        </>
                      )}

                      {/* this is for when notes list then use can you this --> when client needed change it */}
                      {/* {bookings?.enquiry_note.length > 0 ? (
                        <BookingNoteTable noteData={bookings?.enquiry_note} />
                      ) : (
                        ''
                      )} */}
                      {/*  */}
                      {state && (
                        <TableCell>
                          <p className="description">
                            {bookings?.enquiry_note?.length > 0
                              ? handleNotes(bookings?.enquiry_note)
                              : '-'}
                          </p>
                        </TableCell>
                      )}
                      {state && (
                        <TableCell>
                          <p className="description">
                            {bookings?.enquiry_note?.length > 0
                              ? handlePublic(bookings?.enquiry_note)
                              : '-'}
                          </p>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="table_pagination_wrap">
            {enquiriesList.bookings?.length > 0 ? (
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
