import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import { FormControl, MenuItem, Paper, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DataNotFound from 'Components/Common/DataNotFound';
import checkGreen from '../../Assets/Img/check-green.svg';
import crossRed from '../../Assets/Img/cross-red.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { resetWatchlist } from 'store/reducers/Admin/Events/WatchList/watchlist.slice';
import Loader from 'Components/Common/Loader';
import GetCookies from 'hooks/GetCookies';
import { fromBase64Unicode } from 'utils/common';

const initialValuesAccount = {
  minPlaces: 0,
  maxPlaces: 10000,
  upperLimit: 50,
  lowerLimit: 0,
  theVenue: '',
  owner_id: '',
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
export default function CartList() {
  const { bookingCartList, bookingCartLoading } = useSelector(
    ({ bookingCart }) => bookingCart,
  );
  const dispatch = useDispatch();
  const [accountsInitialValues, setAccountInitialValues] =
    useState(initialValuesAccount);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartListData, setCartListData] = useState([]);
  const [pageLimit, setPageLimit] = useState('20');
  const [searchText, setSearchText] = useState('');
  const userData = GetCookies('UserSessionCRM');
  const userSession = userData ? JSON.parse(fromBase64Unicode(userData)) : null;

  useEffect(() => {
    if (bookingCartList.length) {
      setCartListData(bookingCartList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingCartList]);

  useEffect(() => {
    if (window.location.pathname === '/my-booking') {
      setAccountInitialValues({
        ...accountsInitialValues,
        owner_id: userSession?._id,
      });
    }
    return () => {
      dispatch(resetWatchlist());
    };
  }, []);

  const currentDataObj = useMemo(() => {
    let cartSearchData =
      cartListData?.length > 0 ? [...cartListData.values()] : [];
    let totalPages = 0;
    if (cartSearchData?.length > 0) {
      cartSearchData = cartSearchData?.slice(
        0 + (currentPage * pageLimit - pageLimit),
        currentPage * pageLimit,
      );
      totalPages = Math.ceil(cartListData.length / pageLimit);
    }
    return { data: cartSearchData || [], totalRows: totalPages || 0 };
  }, [currentPage, pageLimit, cartListData]);

  const handleSearch = useCallback(
    (search = '') => {
      const searchRegex = new RegExp(search, 'i');
      let list;
      if (search.trim()) {
        list = bookingCartList.filter(
          _ =>
            searchRegex.test(_.event_name.toLowerCase()) ||
            searchRegex.test(_.email.toLowerCase()) ||
            searchRegex.test(_.contact_name.toLowerCase()) ||
            searchRegex.test(_.contact_number.toLowerCase()),
        );
      } else {
        list = [...bookingCartList];
      }
      setCartListData(list);
    },
    [bookingCartList],
  );
  return (
    <>
      <div className="dashboard_top_wrap bg_white_box mb-3">
        {bookingCartLoading && <Loader />}
      </div>
      <div class="page_title">
        <h1>Abandad Cart List</h1>
      </div>
      {bookingCartList.length ? (
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
                      <MenuItem value={bookingCartList.length}>All</MenuItem>
                    </Select>
                  </FormControl>
                  <span className="label ms-2">entries</span>
                </div>
              </Col>
              <Col xs={3}>
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
                    <SearchOutlinedIcon />
                  </button>
                </div>
              </Col>
            </Row>
          </div>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Places</TableCell>
                  <TableCell>Contact Name</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Sent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentDataObj?.data?.length > 0 &&
                  currentDataObj?.data?.map((item, itemIndex) => {
                    let enqDate = item.event_date
                      ? moment(item.event_date).format('dddd Do MMMM YYYY')
                      : 'No Date Given';
                    return (
                      <TableRow key={itemIndex}>
                        <TableCell>{item.event_name}</TableCell>
                        <TableCell>
                          <div>{enqDate}</div>
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.places}</TableCell>
                        <TableCell>{item.contact_name}</TableCell>
                        <TableCell>{item.contact_number}</TableCell>
                        <TableCell>
                          {item.send_email ? (
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
                        </TableCell>
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
                      {currentPage * pageLimit < cartListData?.length
                        ? currentPage * pageLimit
                        : cartListData?.length}{' '}
                      of {cartListData?.length} entries{' '}
                      {searchText &&
                        `(filtered from ${bookingCartList.length} total entries)`}
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
        </div>
      ) : (
        <DataNotFound />
      )}
    </>
  );
}
