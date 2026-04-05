import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import EditIcon from '../../../../Assets/Img/edit.svg';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import { Col, Row } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEventListData,
  setIsEventUpdated,
  updateEvent,
} from 'store/reducers/Admin/Events/Parties/parties.slice';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import useSortable from 'utils/useSortable';
import Loader from 'Components/Common/Loader';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import useSortableAll from 'utils/useSortableAll';

let pageSize = 10;

export default function EventParties() {
  const dispatch = useDispatch();

  const { activeEventList, inActiveEventList, isEventUpdated, eventLoading } =
    useSelector(({ parties }) => parties);

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const inActiveIndexOfLastItem = currentPage.inActiveCurrentPage * pageSize;
  const inActiveIndexOfFirstItem = inActiveIndexOfLastItem - pageSize;

  useEffect(() => {
    dispatch(getEventListData());
  }, [dispatch]);

  useEffect(() => {
    if (isEventUpdated) {
      dispatch(getEventListData());
      dispatch(setIsEventUpdated(false));
    }
  }, [dispatch, isEventUpdated]);

  const OpenDelete = event => {
    setDeleteId(event);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteEventAccount = () => {
    dispatch(
      updateEvent({
        _id: deleteId._id,
        event: {
          ...deleteId,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };

  const setCurrentPartiesHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(activeEventList, pageSize);
    return totalActiveRecordCount;
  }, [activeEventList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(inActiveEventList, pageSize);
    return totalActiveRecordCount;
  }, [inActiveEventList]);

  const { itemsActive, requestSortActive } = useSortableAll(activeEventList);

  const { itemsInActive, requestSortInActive } =
    useSortableAll(inActiveEventList);
  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentPartiesHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [itemsActive, currentPage.activeCurrentPage]);

  const inActiveCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsInActive,
      currentPage.inActiveCurrentPage,
      pageSize,
      totalInActiveRecordPage,
      setCurrentPartiesHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage.inActiveCurrentPage]);

  const PercentageDisplay = ({ totalPlaces, salesTarget }) => {
    const percentage = salesTarget
      ? ((totalPlaces / salesTarget) * 100)?.toFixed(2)
      : 0;

    let bgcolor = 'red';
    let color = 'white';

    switch (true) {
      case percentage >= 100:
        bgcolor = 'limegreen';
        color = 'black';
        break;
      case percentage >= 80:
        bgcolor = 'yellow';
        color = 'black';
        break;
      case percentage >= 50:
        bgcolor = 'orange';
        color = 'black';
        break;
    }

    return (
      <>
        <span className="d-block">
          {totalPlaces} / {salesTarget}
        </span>
        <span
          style={{ backgroundColor: bgcolor, color: color }}
          className="d-block"
        >
          {percentage}%
        </span>
      </>
    );
  };

  return (
    <div className="inner_wrapper">
      {eventLoading && <Loader />}
      <div className="parties_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events / Parties</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Current Events</h1>
        </div>
        <Link
          to="/admin/events/parties/add-parties"
          className="btn_primary small mb-3"
        >
          Add New Event
        </Link>

        <h5 className="text_primary">Active :</h5>
        <div className="table_main_Wrapper parties_active_table mb-3">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span onClick={() => requestSortActive('year')}>Year</span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('sku')}>SKU</span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('internal_name')}>
                      Internal Name
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('public_name')}>
                      Public Name
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => requestSortActive('booking_unique_id')}
                    >
                      Booking UID
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('cost_centre')}>
                      Cost Centre
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('sales_target')}>
                      Targets
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('notes')}>
                      Notes
                    </span>
                  </TableCell>
                  <TableCell sx={{ width: '10%' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeCurrentData?.map(event => {
                  return (
                    <TableRow key={event._id}>
                      <TableCell>{event?.year}</TableCell>
                      <TableCell>{event?.sku}</TableCell>
                      <TableCell>
                        <p className="w_200">{event?.internal_name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="w_200">{event?.public_name}</p>
                      </TableCell>
                      <TableCell>{event?.booking_unique_id}</TableCell>
                      <TableCell>
                        <span className="date_wrapper">
                          {event?.cost_centre}
                        </span>
                      </TableCell>
                      {/* <TableCell>
                        {event?.sales_target}
                        <span className="d-block text_light">(None Set)</span>
                      </TableCell> */}
                      {event?.user_name != '' ? (
                        <TableCell>
                          {event?.user_name}
                          {event?.sales_target > 0 ? (
                            <PercentageDisplay
                              totalPlaces={event?.total_places}
                              salesTarget={event?.sales_target}
                            />
                          ) : (
                            <span className="d-block">None Set</span>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell>None Set</TableCell>
                      )}
                      <TableCell>{event?.notes}</TableCell>
                      <TableCell>
                        <ul className="action_wrap">
                          <li>
                            <Link
                              to={`/admin/events/parties/edit-parties/${event._id}`}
                              className="btn_edit"
                            >
                              <img src={EditIcon} alt="Edit Icon" />
                            </Link>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="btn_warning small"
                              onClick={() =>
                                suspendHandler(
                                  event,
                                  dispatch,
                                  updateEvent,
                                  'event',
                                )
                              }
                            >
                              Suspend
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="btn_border small"
                              onClick={() => OpenDelete(event)}
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
          <div className="table_pagination_wrap">
            {activeCurrentData?.length > 0 ? (
              <Row className="g-0 align-items-center my-2">
                <Col sm={6}>
                  <div className="total_entry">
                    <p className="m-0">
                      Showing {activeIndexOfFirstItem + 1} to{' '}
                      {Math.min(activeIndexOfLastItem, activeEventList?.length)}{' '}
                      of {activeEventList?.length} entries
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

        <h5 className="text_primary">Inactive :</h5>
        <div className="table_main_Wrapper parties_inactive_table mb-3">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span onClick={() => requestSortInActive('year')}>
                      Year
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('sku')}>SKU</span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('internal_name')}>
                      Internal Name
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('public_name')}>
                      Public Name
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => requestSortInActive('booking_unique_id')}
                    >
                      Booking UID
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('cost_centre')}>
                      Cost Centre
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('sales_target')}>
                      Targets
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('notes')}>
                      Notes
                    </span>
                  </TableCell>
                  <TableCell sx={{ width: '10%' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inActiveCurrentData?.map(event => {
                  return (
                    <TableRow key={event._id}>
                      <TableCell>{event?.year}</TableCell>
                      <TableCell>{event?.sku}</TableCell>
                      <TableCell>
                        <p className="w_200">{event.internal_name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="w_200">{event?.public_name}</p>
                      </TableCell>
                      <TableCell>{event?.booking_unique_id}</TableCell>
                      <TableCell>
                        <span className="date_wrapper">
                          {event?.cost_centre}
                        </span>
                      </TableCell>
                      {event?.user_name != '' ? (
                        <TableCell>
                          {event?.user_name}
                          {event.sales_target > 0 ? (
                            <PercentageDisplay
                              totalPlaces={event.total_places}
                              salesTarget={event.sales_target}
                            />
                          ) : (
                            <span className="d-block">None Set</span>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell>None Set</TableCell>
                      )}
                      <TableCell>{event?.notes}</TableCell>
                      <TableCell>
                        <ul className="action_wrap">
                          <li>
                            <Link
                              to={`/admin/events/parties/edit-parties/${event._id}`}
                              className="btn_edit"
                            >
                              <img src={EditIcon} alt="Edit Icon" />
                            </Link>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="btn_info small"
                              onClick={() =>
                                suspendHandler(
                                  event,
                                  dispatch,
                                  updateEvent,
                                  'event',
                                )
                              }
                            >
                              Activate
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="btn_border small"
                              onClick={() => OpenDelete(event)}
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
          <div className="table_pagination_wrap">
            {inActiveCurrentData?.length ? (
              <Row className="g-0 align-items-center my-2">
                <Col sm={6}>
                  <p className="m-0">
                    Showing {inActiveIndexOfFirstItem + 1} to{' '}
                    {Math.min(
                      inActiveIndexOfLastItem,
                      inActiveEventList?.length,
                    )}{' '}
                    of {inActiveEventList?.length} entries
                  </p>
                </Col>
                <Col sm={6}>
                  <div className="pagination_wrap">
                    <Stack spacing={2}>
                      <Pagination
                        count={totalInActiveRecordPage}
                        page={currentPage.inActiveCurrentPage}
                        onChange={(e, page) =>
                          setCurrentPage({
                            ...currentPage,
                            inActiveCurrentPage: page,
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
      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteEventAccount}
        name="Are you sure you want to delete this event? Note: this cannot be undone"
      />
    </div>
  );
}
