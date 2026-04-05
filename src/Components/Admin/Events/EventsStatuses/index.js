import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  Breadcrumbs,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Stack,
  Paper,
  Pagination,
} from '@mui/material';

import {
  getEventStatusesListData,
  updateEventStatuses,
  setIsEventStatusesUpdated,
} from 'store/reducers/Admin/Events/eventStatuses.slice';
import Loader from 'Components/Common/Loader';
import useSortable from 'utils/useSortable';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import useSortableAll from 'utils/useSortableAll';
import EditIcon from '../../../../Assets/Img/edit.svg';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';

let pageSize = 10;

export default function EventsStatus() {
  const dispatch = useDispatch();
  const {
    activeEventStatusesList,
    inActiveEventStatusesList,
    isEventStatusesUpdated,
    eventStatusesLoading,
  } = useSelector(({ eventStatuses }) => eventStatuses);

  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const inActiveIndexOfLastItem = currentPage.inActiveCurrentPage * pageSize;
  const inActiveIndexOfFirstItem = inActiveIndexOfLastItem - pageSize;

  const OpenDelete = data => {
    setDeleteId(data);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteEventStatusesAccount = () => {
    dispatch(
      updateEventStatuses({
        _id: deleteId?._id,
        eventStatuses: { ...deleteId, deleted: !deleteId?.deleted },
      }),
    );
  };

  const setCurrentEventStatusesHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeEventStatusesList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeEventStatusesList]);

  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveEventStatusesList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveEventStatusesList]);

  const { itemsActive, requestSortActive } = useSortableAll(
    activeEventStatusesList,
  );
  const { itemsInActive, requestSortInActive } = useSortableAll(
    inActiveEventStatusesList,
  );
  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage?.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentEventStatusesHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [itemsActive, currentPage?.activeCurrentPage]);

  const inActiveCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsInActive,
      currentPage?.inActiveCurrentPage,
      pageSize,
      totalInActiveRecordPage,
      setCurrentEventStatusesHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage?.inActiveCurrentPage]);
  useEffect(() => {
    dispatch(getEventStatusesListData());
  }, [dispatch]);

  useEffect(() => {
    if (isEventStatusesUpdated) {
      dispatch(getEventStatusesListData());
      dispatch(setIsEventStatusesUpdated(false));
    }
  }, [dispatch, isEventStatusesUpdated]);

  return (
    <div className="inner_wrapper">
      {eventStatusesLoading && <Loader />}
      <div className="eventstatus_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Typography>Events Statuses</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Events Statuses</h1>
        </div>
        <div className="eventstatus_wrap">
          <Link
            to="/events-status/add-edit-event-status"
            className="btn_primary small mb-3"
          >
            Add New Status
          </Link>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper eventstatus_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('colour')}>
                        Colors
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('item_id')}>
                        ID
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      <span onClick={() => requestSortActive('description')}>
                        Description
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortActive('show_on_party_numbers_report')
                        }
                      >
                        Show on Report
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(elementEvent => {
                    return (
                      <TableRow key={elementEvent?._id}>
                        <TableCell>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: `${elementEvent?.colour}`,
                            }}
                          ></span>
                        </TableCell>
                        <TableCell>
                          {!!elementEvent?.item_id
                            ? elementEvent?.item_id
                            : '-'}
                        </TableCell>
                        <TableCell>{elementEvent?.name}</TableCell>
                        <TableCell>
                          <p className="w_400">
                            {!!elementEvent?.description
                              ? elementEvent?.description
                              : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {elementEvent?.show_on_party_numbers_report
                            ? 'Yes'
                            : ''}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/events-status/add-edit-event-status/${elementEvent?._id}`}
                                className="btn_edit"
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </Link>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_warning"
                                onClick={() => {
                                  suspendHandler(
                                    elementEvent,
                                    dispatch,
                                    updateEventStatuses,
                                    'eventStatuses',
                                  );
                                }}
                              >
                                Suspend
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_border small"
                                onClick={() => {
                                  OpenDelete(elementEvent);
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
            <div className="table_pagination_wrap">
              {activeCurrentData?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          activeIndexOfLastItem,
                          activeEventStatusesList?.length,
                        )}{' '}
                        of {activeEventStatusesList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalActiveRecordPage}
                          page={currentPage?.activeCurrentPage}
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
          <div className="table_main_Wrapper eventstatus_inactive_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortInActive('colour')}>
                        Colors
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('item_id')}>
                        ID
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      <span onClick={() => requestSortInActive('description')}>
                        Description
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortInActive('show_on_party_numbers_report')
                        }
                      >
                        Show on Report
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(elementEvent => {
                    return (
                      <TableRow key={elementEvent?._id}>
                        <TableCell>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: `${elementEvent?.colour}`,
                            }}
                          ></span>
                        </TableCell>
                        <TableCell>
                          {!!elementEvent?.item_id
                            ? elementEvent?.item_id
                            : '-'}
                        </TableCell>
                        <TableCell>{elementEvent?.name}</TableCell>
                        <TableCell>
                          <p className="w_400">
                            {!!elementEvent?.description
                              ? elementEvent?.description
                              : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {' '}
                          {elementEvent?.show_on_party_numbers_report
                            ? 'Yes'
                            : 'No'}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/events-status/add-edit-event-status/${elementEvent?._id}`}
                                className="btn_edit"
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </Link>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_info"
                                onClick={() => {
                                  suspendHandler(
                                    elementEvent,
                                    dispatch,
                                    updateEventStatuses,
                                    'eventStatuses',
                                  );
                                }}
                              >
                                Activate
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_border small"
                                onClick={() => {
                                  OpenDelete(elementEvent);
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
            <div className="table_pagination_wrap">
              {inActiveCurrentData?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveEventStatusesList?.length,
                        )}{' '}
                        of {inActiveEventStatusesList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalInActiveRecordPage}
                          page={currentPage?.inActiveCurrentPage}
                          onChange={(e, page) => {
                            setCurrentPage({
                              ...currentPage,
                              inActiveCurrentPage: page,
                            });
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
      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteEventStatusesAccount}
        name="Are you sure you want to delete this status? Note: this cannot be undone"
      />
    </div>
  );
}
