import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import { FormControl, MenuItem, Paper, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DataNotFound from 'Components/Common/DataNotFound';
import checkGreen from '../../Assets/Img/check-green.svg';
import crossRed from '../../Assets/Img/cross-red.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { WatchlistNoteTable } from './WatchListNotes';
import ExcelIcon from '../../Assets/Img/excel-icon.svg';
import { checkEmail, fromBase64Unicode } from 'utils/common';
import { resetWatchlist } from 'store/reducers/Admin/Events/WatchList/watchlist.slice';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import { getWatchListData } from 'store/reducers/Admin/Events/WatchList/watchlist.slice';
import Loader from 'Components/Common/Loader';
import GetCookies from 'hooks/GetCookies';

const initialValuesAccount = {
  minPlaces: 0,
  maxPlaces: 10000,
  upperLimit: 50,
  lowerLimit: 0,
  theVenue: null,
  owner_id: null,
  hideBookings: false,
  hideEnquiries: false,
  hideConfirmed: false,
  hideProvisional: false,
  hideExclusive: false,
  hideMixed: false,
  theLcMin: 0,
  theLcMax: -1001,
  showSQL: false,
};
export default function WatchList() {
  const { watchList, getWatchListFilter, isFetch } = useSelector(
    ({ watchlist }) => watchlist,
  );
  const dispatch = useDispatch();
  const [accountsInitialValues, setAccountInitialValues] =
    useState(initialValuesAccount);
  const { activeEventList } = useSelector(({ parties }) => parties);
  const { watchListLoading } = useSelector(({ watchlist }) => watchlist);
  const { activeUserList } = useSelector(({ user }) => user);
  const [currentPage, setCurrentPage] = useState(1);
  const [watchListData, setwatchListData] = useState([]);
  const [pageLimit, setPageLimit] = useState('5');
  const [searchText, setSearchText] = useState('');
  const userData = GetCookies('UserSessionCRM');
  const userSession = userData ? JSON.parse(fromBase64Unicode(userData)) : null;
  useEffect(() => {
    if (watchList.length) {
      setwatchListData(watchList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchList]);
  useEffect(() => {
    if (window.location.pathname === '/my-booking') {
      setAccountInitialValues({
        ...accountsInitialValues,
        ...getWatchListFilter,
        owner_id: userSession?._id,
      });
    } else {
      setAccountInitialValues({
        ...accountsInitialValues,
        ...getWatchListFilter,
      });
    }
    return () => {
      dispatch(resetWatchlist());
    };
  }, [getWatchListFilter]);

  const currentDataObj = useMemo(() => {
    let jewellerySearchStockData =
      watchListData?.length > 0 ? [...watchListData.values()] : [];
    let totalPages = 0;
    if (jewellerySearchStockData?.length > 0) {
      jewellerySearchStockData = jewellerySearchStockData?.slice(
        0 + (currentPage * pageLimit - pageLimit),
        currentPage * pageLimit,
      );
      totalPages = Math.ceil(watchListData.length / pageLimit);
    }
    return { data: jewellerySearchStockData || [], totalRows: totalPages || 0 };
  }, [currentPage, pageLimit, watchListData]);

  const handleSearch = useCallback(
    (search = '') => {
      const searchRegex = new RegExp(search, 'i');
      let list;
      if (search.trim()) {
        list = watchList.filter(
          _ =>
            searchRegex.test(_.event_internal_name.toLowerCase()) ||
            searchRegex.test(_.first_name.toLowerCase()) ||
            searchRegex.test(_.surname.toLowerCase()) ||
            searchRegex.test(_.ref_number) ||
            searchRegex.test(_?.company_name.toLowerCase()) ||
            searchRegex.test(_?.account_name.toLowerCase()) ||
            searchRegex.test(_?.telephone_primary.toLowerCase()) ||
            searchRegex.test(_?.telephone_secondary.toLowerCase()),
        );
      } else {
        list = [...watchList];
      }
      setwatchListData(list);
    },
    [watchList],
  );

  const downloadCsv = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet', {});

    if (watchList?.length > 0) {
      worksheet.getRow(1).values = [
        'Event',
        'Date',
        'Booking Ref',
        'Contact',
        'Enquired',
        'Provisional',
        'Confirmed',
        'Contact Days',
        'Status',
        'PO_Agent_Ref',
        'Date Booked',
        'Booking Notes',
      ];

      worksheet.getRow(1).font = {
        bold: true,
      };

      worksheet.columns = [
        { key: 'event', width: 17 },
        { key: 'date', width: 17 },
        { key: 'booking_ref', width: 17 },
        { key: 'contact', width: 17 },
        { key: 'enquired', width: 17 },
        { key: 'provisional', width: 17 },
        { key: 'confirmed_places', width: 17 },
        { key: 'contact_days', width: 17 },
        { key: 'status', width: 17 },
        { key: 'agent_ref', width: 17 },
        { key: 'date_booked', width: 17 },
        // { key: 'booking_notes', width: 17 },
      ];

      watchList?.forEach(data => {
        let enqDate = data.event_date
          ? moment(data.event_date).format('dddd Do MMMM YYYY')
          : 'No Date Given';
        let daysSinceLastContact = '';
        if (data.lastcontactdate) {
          if (data.daysSinceLastContact > 7) {
            daysSinceLastContact = ' Last Contact: 7+ Days ';
          } else if (
            data.daysSinceLastContact <= 7 &&
            data.daysSinceLastContact > 3
          ) {
            daysSinceLastContact = ' Last Contact: 3-7 Days ';
          } else if (data.daysSinceLastContact <= 3) {
            daysSinceLastContact = ' Last Contact: Under 3 Days ';
          }
        } else {
          daysSinceLastContact = 'NOT CONTACTED - ' + data.thediff;
        }
        let holdExpiresInfoxl =
          data.thediff < 0
            ? data.thediff * -1 + ' days until hold expires'
            : 'Hold expired ' + data.thediff + 'days ago';
        let provHoldDatexl = ' Hold Period ' + data.hold_days + ' Days ';
        let provHoldPCxl = '';
        if (data.precent_left)
          provHoldPCxl =
            ' Percentage Left ' + data.precent_left.toFixed(2) + '% ';
        else provHoldPCxl = 0;
        let availablePlacesxl = '';
        if (data.isEnq) availablePlacesxl = ' N/A ';
        else
          availablePlacesxl =
            ' Places Left ' + data.availablePlaces + '/' + data.total_enquired;
        worksheet.addRow({
          event: data?.event_internal_name,
          date: enqDate,
          booking_ref: data?.ref_number,
          contact:
            data?.first_name + data?.surname + data.account_name
              ? data.account_name
              : data.company_name +
                'Tel:' +
                data.telephone_primary +
                'Mob:' +
                data.telephone_secondary,
          enquired: data?.places,
          provisional: data?.provisional_places,
          confirmed_places: data?.confirmed_places,
          contact_days: data?.daysSinceLastContact,
          status:
            daysSinceLastContact +
            holdExpiresInfoxl +
            ' ' +
            provHoldDatexl +
            provHoldPCxl +
            availablePlacesxl,
          agent_ref: data?.agent_ref_po_no,
          date_booked:
            moment(data.created_at).format('DD/MM/YYYY hh:mm:ss') +
            ' Overdue Days: ' +
            data.thediff,
          // booking_notes: data?.confirmed,
        });
      });
    }
    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(blob, `Search_${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
    });
  };

  return (
    <>
      <div className="dashboard_top_wrap bg_white_box mb-3">
        {watchListLoading && <Loader />}
        <Formik
          enableReinitialize={true}
          initialValues={accountsInitialValues}
          // validationSchema={addEditAccountSchema}
          onSubmit={values => {
            const payload = { ...values };
            if (!payload.upperLimit || payload.upperLimit === 0)
              payload.upperLimit = 50;
            dispatch(getWatchListData(payload));
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
              <div className="p-3">
                <div className="dashboard_top_wrap_inner">
                  <Row>
                    <Col md={6}>
                      <Row>
                        <Col sm={6}>
                          <div className="form-group inline">
                            <span className="label">Min Places:</span>
                            <FormGroup className="input_wrap">
                              <FormControl fullWidth>
                                <TextField
                                  id="MinPlaces"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  {...getFieldProps('minPlaces')}
                                />
                              </FormControl>
                            </FormGroup>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="form-group inline">
                            <span className="label">Max Places:</span>
                            <FormGroup className="input_wrap">
                              <FormControl fullWidth>
                                <TextField
                                  id="MaxPlaces"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  {...getFieldProps('maxPlaces')}
                                />
                              </FormControl>
                            </FormGroup>
                          </div>
                        </Col>
                        <Col sm={12}>
                          <div className="form-group inline">
                            <span className="label">Filter by Venue</span>
                            <FormControl className="input_wrap">
                              <Select
                                labelId="theVenue"
                                id="theVenue"
                                name="theVenue"
                                value={values.theVenue}
                                onChange={handleChange}
                                className="select_wrap w-100"
                              >
                                {activeEventList
                                  ?.slice()
                                  ?.sort((a, b) =>
                                    a?.sku?.localeCompare(b?.sku),
                                  )
                                  ?.map((item, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={item?._id}
                                        onClick={() => {}}
                                      >
                                        {item?.sku} - {item?.public_name}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            </FormControl>
                          </div>
                        </Col>
                        <Col sm={12}>
                          <div className="form-group inline">
                            <span className="label">Owned by</span>
                            <FormControl fullWidth className="input_wrap">
                              <Select
                                labelId="Enquiries-label"
                                id="Enquiries"
                                name="owner_id"
                                value={values.owner_id}
                                onChange={handleChange}
                                defaultValue="Select"
                                className="select_wrap w-100"
                                disabled={
                                  window.location.pathname === '/my-booking'
                                    ? true
                                    : false
                                }
                              >
                                <MenuItem
                                  style={{ padding: '15px' }}
                                  value={''}
                                >{``}</MenuItem>
                                {activeUserList?.map(user => {
                                  return (
                                    <MenuItem
                                      value={user?._id}
                                      key={`user_${user?._id}`}
                                    >
                                      {user?.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="form-group inline checkbox_wrap">
                            <span className="label">Hide Exclusive</span>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.hideExclusive}
                                    onChange={e => {
                                      setFieldValue(
                                        'hideExclusive',
                                        e.target.checked,
                                      );
                                    }}
                                  />
                                }
                              />
                            </FormGroup>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="form-group inline checkbox_wrap">
                            <span className="label">Hide Mixed</span>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.hideMixed}
                                    onChange={e => {
                                      setFieldValue(
                                        'hideMixed',
                                        e.target.checked,
                                      );
                                    }}
                                  />
                                }
                              />
                            </FormGroup>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <div className="dashboard_top_wrap_right">
                        <Row>
                          <Col sm={6}>
                            <div className="form-group inline">
                              <span className="label">
                                Min Last Contact Days:
                              </span>
                              <FormGroup className="input_wrap">
                                <FormControl fullWidth>
                                  <TextField
                                    id="MinLastContactDays"
                                    type="number"
                                    onWheel={e => e.target.blur()}
                                    variant="outlined"
                                    {...getFieldProps('theLcMin')}
                                  />
                                </FormControl>
                              </FormGroup>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="form-group inline">
                              <span className="label">
                                Max Last Contact Days:
                              </span>
                              <FormGroup className="input_wrap">
                                <FormControl fullWidth>
                                  <TextField
                                    id="MaxLastContactDays"
                                    type="number"
                                    onWheel={e => e.target.blur()}
                                    variant="outlined"
                                    {...getFieldProps('theLcMax')}
                                  />
                                </FormControl>
                              </FormGroup>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="form-group inline checkbox_wrap">
                              <span className="label">Hide Bookings</span>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={values.hideBookings}
                                      onChange={e => {
                                        setFieldValue(
                                          'hideBookings',
                                          e.target.checked,
                                        );
                                      }}
                                    />
                                  }
                                />
                              </FormGroup>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="form-group inline checkbox_wrap">
                              <span className="label">Hide Enquiries</span>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={values.hideEnquiries}
                                      onChange={e => {
                                        setFieldValue(
                                          'hideEnquiries',
                                          e.target.checked,
                                        );
                                      }}
                                    />
                                  }
                                />
                              </FormGroup>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="form-group inline checkbox_wrap">
                              <span className="label">Hide Confirmed</span>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={values.hideConfirmed}
                                      onChange={e => {
                                        setFieldValue(
                                          'hideConfirmed',
                                          e.target.checked,
                                        );
                                      }}
                                    />
                                  }
                                />
                              </FormGroup>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="form-group inline checkbox_wrap">
                              <span className="label">Hide Provisional</span>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={values.hideProvisional}
                                      onChange={e => {
                                        setFieldValue(
                                          'hideProvisional',
                                          e.target.checked,
                                        );
                                      }}
                                    />
                                  }
                                />
                              </FormGroup>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="form-group inline">
                              <span className="label">Limit results from:</span>
                              <FormGroup className="input_wrap">
                                <FormControl fullWidth>
                                  <TextField
                                    id="Limitresultsfrom"
                                    type="number"
                                    onWheel={e => e.target.blur()}
                                    variant="outlined"
                                    {...getFieldProps('lowerLimit')}
                                  />
                                </FormControl>
                              </FormGroup>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="form-group inline">
                              <span className="label">Limit results to</span>
                              <FormGroup className="input_wrap">
                                <FormControl fullWidth>
                                  <TextField
                                    id="Limitresultsto"
                                    type="number"
                                    onWheel={e => e.target.blur()}
                                    variant="outlined"
                                    {...getFieldProps('upperLimit')}
                                  />
                                </FormControl>
                              </FormGroup>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="dashboard_bottom_wrap">
                <div className="px-3 py-2">
                  <Row className="align-items-center">
                    <Col sm={6}>
                      <div className="form-group checkbox_wrap mb-0">
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.showSQL}
                                onChange={e => {
                                  setFieldValue('showSQL', e.target.checked);
                                }}
                              />
                            }
                            label="Show SQL"
                          />
                        </FormGroup>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <Button className="btn_border small" type="submit">
                        Run Watchlist and Save Data
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {isFetch ? (
        watchList.length ? (
          <div className="table_main_Wrapper vertical_top">
            <div className="page_title">
              <Row className="align-items-center justify-content-between">
                <Col xs={4}>
                  <div className="d-flex align-items-center">
                    <span className="label me-2">Show:</span>
                    <FormControl fullWidth>
                      <Select
                        labelId="Year-label"
                        id="Year-select"
                        name="year"
                        value={pageLimit}
                        onChange={e => {
                          setPageLimit(e.target.value);
                          setCurrentPage(1);
                        }}
                        defaultValue="Select One"
                        className="select_wrap"
                      >
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="20">20</MenuItem>
                        <MenuItem value={watchList.length}>All</MenuItem>
                      </Select>
                    </FormControl>
                    <span className="label ms-2">entries</span>
                  </div>
                </Col>
                <Col xs={3}>
                  {/* <div className="text-end">
                  <span className="label">Search:</span>
                  <input
                    type="search"
                    placeholder="Search"
                    className="form-control"
                    onChange={e => handleSearch(e.target.value)}
                  />
                </div> */}
                  <div className="search_wrapper_common">
                    <input
                      type="text"
                      placeholder="Search"
                      className="form-control"
                      onChange={e => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                        handleSearch(e.target.value);
                      }}
                    />
                    <button className="btn_primary small">
                      <SearchOutlinedIcon
                      // onClick={() => {
                      //   Search(searchBookNotes);
                      // }}
                      />
                    </button>
                  </div>
                </Col>
              </Row>
            </div>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span>View</span>
                    </TableCell>
                    <TableCell>
                      <span>Event</span>
                    </TableCell>
                    <TableCell>
                      <span>Date</span>
                    </TableCell>
                    <TableCell>Booking Ref</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Enquired</TableCell>
                    <TableCell>Provisional</TableCell>
                    <TableCell>Confirmed</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>PO/Agent Ref</TableCell>
                    <TableCell>Date Booked</TableCell>
                    <TableCell>Booking Notes</TableCell>
                    <TableCell>Booking Owner</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentDataObj?.data?.length > 0 &&
                    currentDataObj?.data?.map((item, itemIndex) => {
                      let enqDate = item.event_date
                        ? moment(item.event_date).format('dddd Do MMMM YYYY')
                        : 'No Date Given';
                      let note = item.notes.length
                        ? ''
                        : 'No notes against this booking';

                      // always assume the worst :)
                      let colour = 'red';
                      // change colour based on hold date or on last contact
                      if (
                        item.thediff <= 0 ||
                        (item.daysSinceLastContact <= 7 &&
                          item.daysSinceLastContact > 3)
                      ) {
                        colour = 'orange';
                      }
                      if (
                        item.thediff <= -2 ||
                        item.daysSinceLastContact <= 3
                      ) {
                        colour = 'limegreen';
                      }

                      let holdColour = 'grey';
                      // eslint-disable-next-line default-case
                      switch (true) {
                        case +item.thediff < -7:
                          holdColour = 'limegreen';
                          break;
                        case +item.thediff <= -3 && +item.thediff >= -7:
                          holdColour = 'orange';
                          break;
                        case +item.thediff <= -1 && +item.thediff >= -2:
                          holdColour = 'orangered';
                          break;
                        case +item.thediff > 0:
                          holdColour = 'red';
                          break;
                      }

                      return (
                        <TableRow key={itemIndex}>
                          <TableCell>
                            <Link
                              to={`/${
                                item.isEnq ? 'edit-enquiries' : 'edit-bookings'
                              }/${item._id}`}
                              className="small mb-3"
                            >
                              <span>View</span>
                            </Link>
                          </TableCell>
                          <TableCell>{item.event_internal_name}</TableCell>
                          <TableCell>
                            <div>
                              {enqDate}
                              {item.open_for_bookings ? (
                                <span className="text-danger text_small d-block">
                                  CLOSED/EXCL NIGHT
                                </span>
                              ) : (
                                ''
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{item.ref_number}</TableCell>
                          <TableCell>
                            <ul>
                              <li className="mb-2">
                                <Link
                                  to={`/contact/edit-contact/${item.contact_id}`}
                                  className=""
                                >
                                  {item?.first_name &&
                                  checkEmail(item.email_primary) ? (
                                    <img
                                      src={checkGreen}
                                      alt="CheckIcon"
                                      className="me-1"
                                      style={{ width: '15px' }}
                                    />
                                  ) : (
                                    <img
                                      src={crossRed}
                                      alt="CrossIcon"
                                      className="me-1"
                                      style={{ width: '15px' }}
                                    />
                                  )}
                                  {item.first_name}
                                </Link>
                              </li>
                              <li className="mb-2">
                                <Link
                                  to={`/contact/edit-contact/${item.contact_id}`}
                                  className=""
                                >
                                  {/*   <img
                                  src={crossRed}
                                  alt="CrossIcon"
                                  className="me-1"
                                  style={{ width: '15px' }}
                                /> */}
                                  {item.surname}
                                </Link>
                              </li>
                              <li className="mb-2">
                                <span>
                                  {item.account_name
                                    ? item.account_name
                                    : item.company_name}
                                </span>
                              </li>
                              <li className="mb-2">
                                <span>
                                  {item.telephone_primary && (
                                    <>Tel: {item.telephone_primary}</>
                                  )}
                                  {item.telephone_secondary && (
                                    <>Mob: {item.telephone_secondary}</>
                                  )}
                                </span>
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell>{item.places}</TableCell>
                          <TableCell>{item.provisional_places}</TableCell>
                          <TableCell>{item.confirmed_places}</TableCell>
                          <TableCell>
                            <ul>
                              <li className="mb-2">
                                <label className="d-block fw_600">
                                  {item.lastcontactdate
                                    ? item.daysSinceLastContact
                                    : 'UNKNOWN'}
                                  {/* <br />
                                {item.lastcontactdate ? (
                                  <div
                                    style={{
                                      fontWeight: 'bold',
                                      backgroundColor: colour,
                                      color: 'white',
                                      padding: '2px 5px',
                                    }}
                                    title={`${daysSinceLastContact}+  " Days - " +${item.thediff}`}
                                  >
                                    {daysSinceLastContact > 7
                                      ? 'Last Contact: 7+ Days'
                                      : daysSinceLastContact <= 7 &&
                                        daysSinceLastContact > 3
                                      ? 'Last Contact: 3-7 Days'
                                      : daysSinceLastContact <= 3
                                      ? 'Last Contact: Under 3 Days'
                                      : ''}
                                  </div>
                                ) : (
                                  'NOT CONTACTED - ' + item.thediff
                                )}
                                <br />
                                <span
                                  title={`Days: ` + item.thediff}
                                  style={{
                                    fontWeight: 'bold',
                                    backgroundColor:
                                      +item.thediff < 0 ? '' : holdColour,
                                    color: 'white',
                                    padding: '2px 5px',
                                  }}
                                >
                                  {+item.thediff < 0
                                    ? +item.thediff * -1
                                    : item.thediff}
                                </span>{' '}
                                {+item.thediff > 0
                                  ? ' days until hold expires'
                                  : ' days ago'}
                                <br /> */}
                                </label>
                                {item.lastcontactdate ? (
                                  <span
                                    className="text_primary"
                                    style={{ color: colour }}
                                    title={`${item.daysSinceLastContact}+  " Days - " +${item.thediff}`}
                                  >
                                    {item.daysSinceLastContact > 7
                                      ? 'Last Contact: 7+ Days'
                                      : item.daysSinceLastContact <= 7 &&
                                        item.daysSinceLastContact > 3
                                      ? 'Last Contact: 3-7 Days'
                                      : item.daysSinceLastContact <= 3
                                      ? 'Last Contact: Under 3 Days'
                                      : ''}
                                    {/* Last Contact: 7+ Days */}
                                  </span>
                                ) : (
                                  'NOT CONTACTED - ' + item.thediff
                                )}
                              </li>
                              <li className="mb-2">
                                {+item.thediff > 0 ? (
                                  <label className="d-block fw_600">
                                    Hold expired
                                  </label>
                                ) : (
                                  ''
                                )}
                                <span
                                  className="text_primary"
                                  style={{
                                    color: +item.thediff < 0 ? '' : holdColour,
                                  }}
                                  title={`Days: ` + item.thediff}
                                >
                                  {+item.thediff < 0
                                    ? +item.thediff * -1
                                    : item.thediff}{' '}
                                  {+item.thediff > 0
                                    ? ' days until hold expires'
                                    : ' days ago'}
                                </span>
                              </li>
                              <li className="mb-2">
                                <label className="d-block fw_600">
                                  Hold Period
                                </label>
                                <span>{item.hold_days} Days</span>
                              </li>
                              <li className="mb-2">
                                <label className="d-block fw_600">
                                  Percentage Left
                                </label>
                                <span>
                                  {item.precent_left
                                    ? item.precent_left.toFixed(2)
                                    : '0'}
                                  %
                                </span>
                              </li>
                              <li className="mb-2">
                                <label className="d-block fw_600">
                                  Places Left
                                </label>
                                <span>
                                  {item.availablePlaces}/{item.total_enquired}
                                </span>
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell>{item.agent_ref_po_no}</TableCell>
                          <TableCell>
                            {moment(item.created_at).format(
                              'DD/MM/YYYY hh:mm:ss',
                            )}
                            <br />
                            Overdue Days: {item.thediff}
                          </TableCell>
                          <TableCell>
                            {item.notes?.length > 0 ? (
                              <WatchlistNoteTable noteData={item.notes} />
                            ) : (
                              ''
                            )}
                          </TableCell>
                          <TableCell>{item.owner_name}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="table_pagination_wrap">
              {currentDataObj?.data?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {(currentPage - 1) * Number(pageLimit) + 1} to{' '}
                        {currentPage * pageLimit < watchListData?.length
                          ? currentPage * pageLimit
                          : watchListData?.length}{' '}
                        of {watchListData?.length} entries{' '}
                        {searchText &&
                          `(filtered from ${watchList.length} total entries)`}
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={currentDataObj?.totalRows}
                          page={currentPage}
                          onChange={(e, page) => {
                            setCurrentPage(page);
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
            <Link to="">
              <span className="d-flex">
                <div
                  className="pdf_icon"
                  onClick={() => {
                    downloadCsv();
                  }}
                >
                  <img src={ExcelIcon} alt="pdf Icon" />
                </div>
                <div
                  className="pdf_text"
                  onClick={() => {
                    downloadCsv();
                  }}
                >
                  <p>Download .CSV</p>
                </div>
              </span>
            </Link>
          </div>
        ) : (
          <DataNotFound />
        )
      ) : null}
    </>
  );
}
