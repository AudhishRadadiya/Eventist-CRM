import {
  Breadcrumbs,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getHistoricalData } from 'store/reducers/Booking/bookingHistorical.slice';
import { Col, Row } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DataNotFound from 'Components/Common/DataNotFound';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';

const pageLimit = 10;

export default function HistoricalBooking() {
  const { contactId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currectPage, setCurrectPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [historicalBookingData, setHistoricalBookingData] = useState({});
  const [historicalBookingList, setHistoricalBookingList] = useState([]);
  const { bookingHistoricalData, bookingHistoricalLoading } = useSelector(
    ({ bookingHistorical }) => bookingHistorical,
  );

  useEffect(() => {
    if (contactId) dispatch(getHistoricalData(contactId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  useEffect(() => {
    if (Object.keys(bookingHistoricalData).length) {
      setHistoricalBookingData(bookingHistoricalData);
      const records = currectPage * pageLimit;
      const startIndex = records - pageLimit;
      const endIndex = records;
      const getRecord = bookingHistoricalData?.bookings.slice(
        startIndex,
        endIndex,
      );
      setHistoricalBookingList(getRecord);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingHistoricalData]);

  const handlePagination = page => {
    setLoader(true);
    const records = page * pageLimit;
    const startIndex = records - pageLimit;
    const endIndex = records;
    const getRecord = bookingHistoricalData?.bookings.slice(
      startIndex,
      endIndex,
    );
    setHistoricalBookingList(getRecord);
    setLoader(false);
  };

  return (
    <div className="inner_wrapper">
      {(bookingHistoricalLoading || loader) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link to="/contact">Contact</Link>
          <Link to={`/contact/edit-contact/${contactId}`}>Edit Contact</Link>
          <Typography>Booking History</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <Row>
          <Col xs={9}>
            <h1>Booking History</h1>
          </Col>
        </Row>
      </div>
      <div className="contact_booking_table_wrap">
        <div className="previour_email_wrap">
          {Object.keys(historicalBookingData).length ? (
            <>
              <div className="edit_contact_box">
                <Row>
                  <Col xs={6}>
                    <div className="edit_contact_inner">
                      <div className="contact_detail mb-3">
                        <div className="internal_information">
                          <ul>
                            <li>
                              <label className="text_small fw_500">
                                Contact Name:
                              </label>
                              <div className="right_content">
                                <span>
                                  {historicalBookingData?.forename}{' '}
                                  {historicalBookingData?.surname}
                                </span>
                              </div>
                            </li>
                            <li>
                              <label className="text_small fw_500">
                                Email:
                              </label>
                              <div className="right_content">
                                <span>{historicalBookingData?.email}</span>
                              </div>
                            </li>
                            <li className="align-items-start">
                              <label className="text_small fw_500">
                                Total Booking:
                              </label>
                              <div className="right_content">
                                <span>
                                  {historicalBookingData?.total_bookings || 0}
                                </span>
                              </div>
                            </li>
                            <li>
                              <label className="text_small fw_500">
                                Total Places Avg.:
                              </label>
                              <div className="right_content">
                                <span>
                                  {historicalBookingData?.avg_total_places || 0}
                                </span>
                              </div>
                            </li>
                            <li>
                              <label className="text_small fw_500">
                                Total Paid Avg.:
                              </label>
                              <div className="right_content">
                                <span>
                                  {historicalBookingData?.avg_total_paid || 0}
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="edit_contact_inner">
                      <div className="contact_detail mb-3">
                        <div className="internal_information">
                          <ul>
                            <li>
                              <label className="text_small fw_500">
                                Confirmed Places Avg.:
                              </label>
                              <div className="right_content">
                                <span>
                                  {historicalBookingData?.avg_confirmed_places ||
                                    0}
                                </span>
                              </div>
                            </li>
                            <li>
                              <label className="text_small fw_500">
                                Enquired Places Avg.:
                              </label>
                              <div className="right_content">
                                <span>
                                  {historicalBookingData?.avg_enquired_places ||
                                    0}
                                </span>
                              </div>
                            </li>

                            <li>
                              <label className="text_small fw_500">
                                Provisional Places Avg.:
                              </label>
                              <div className="right_content">
                                <span>
                                  {
                                    historicalBookingData?.avg_provisional_places
                                  }
                                </span>
                              </div>
                            </li>
                            <li>
                              <label className="text_small fw_500">
                                Paid Per Head Avg.:
                              </label>
                              <div className="right_content">
                                <span>
                                  {historicalBookingData?.avg_paid_per_head ||
                                    0}
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="table_main_Wrapper mb-3">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Ref number</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Enquired Places</TableCell>
                        <TableCell>Provisional Places</TableCell>
                        <TableCell>Confirmed Places</TableCell>
                        <TableCell>Total Places</TableCell>
                        <TableCell>Complained</TableCell>
                        <TableCell>Event name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historicalBookingList?.map((item, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell
                              style={{
                                backgroundColor: 'white',
                              }}
                            >
                              <span
                                className="date_wrapper"
                                style={{
                                  backgroundColor: 'white',
                                }}
                              >
                                {item.booking_id}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: 'white',
                              }}
                            >
                              <span
                                className="date_wrapper"
                                style={{
                                  backgroundColor: 'white',
                                }}
                              >
                                {item.booking_date
                                  ? moment(new Date(item.booking_date)).format(
                                      'YYYY/MM/DD',
                                    )
                                  : ''}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: 'white',
                              }}
                            >
                              <span
                                className="date_wrapper"
                                style={{
                                  backgroundColor: 'white',
                                }}
                              >
                                {item.booked_enq_places}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: 'white',
                              }}
                            >
                              <span
                                className="date_wrapper"
                                style={{
                                  backgroundColor: 'white',
                                }}
                              >
                                {item.booked_prov_places}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: 'white',
                              }}
                            >
                              <span
                                className="date_wrapper"
                                style={{
                                  backgroundColor: 'white',
                                }}
                              >
                                {item.booked_confirmed_places}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: 'white',
                              }}
                            >
                              <span
                                className="date_wrapper"
                                style={{
                                  backgroundColor: 'white',
                                }}
                              >
                                {item.booked_total_places}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: 'white',
                              }}
                            >
                              <span
                                className="date_wrapper"
                                style={{
                                  backgroundColor: 'white',
                                }}
                              >
                                {item.booked_complained}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: 'white',
                              }}
                            >
                              <span
                                className="date_wrapper"
                                style={{
                                  backgroundColor: 'white',
                                }}
                              >
                                {item.booked_event}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="table_pagination_wrap">
                  {historicalBookingList?.length > 0 ? (
                    <Row className="g-0 align-items-center my-2">
                      <Col sm={6}>
                        <div className="total_entry">
                          <p className="m-0">
                            Showing {currectPage * pageLimit - 9} to{' '}
                            {currectPage * pageLimit >
                            bookingHistoricalData?.bookings.length
                              ? bookingHistoricalData?.bookings.length
                              : currectPage * pageLimit}{' '}
                            of {bookingHistoricalData?.bookings.length} entries
                          </p>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="pagination_wrap">
                          <Stack spacing={2}>
                            <Pagination
                              count={Math.ceil(
                                bookingHistoricalData?.bookings.length /
                                  pageLimit,
                              )}
                              page={currectPage}
                              onChange={(e, page) => {
                                setCurrectPage(page);
                                handlePagination(page);
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
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}
