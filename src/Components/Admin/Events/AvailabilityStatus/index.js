import React, { useEffect, useMemo, useState } from 'react';
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

import useSortable from 'utils/useSortable';
import Loader from 'Components/Common/Loader';
import DataNotFound from 'Components/Common/DataNotFound';
import { optionNightType } from './AddEditAvailabilityStatus';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import {
  getAvailabilityStatusListData,
  setIsAvailabilityStatusUpdated,
  updateAvailabilityStatus,
} from 'store/reducers/Admin/Events/availabilityStatus.slice';

import EditIcon from '../../../../Assets/Img/edit.svg';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import useSortableAll from 'utils/useSortableAll';

let pageSize = 10;

export default function AvailabilityStatus() {
  const dispatch = useDispatch();
  const {
    activeAvailabilityStatusList,
    inActiveAvailabilityStatusList,
    isAvailabilityStatusUpdated,
    availabilityStatusLoading,
  } = useSelector(({ availabilityStatus }) => availabilityStatus);

  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const getNightType = type => {
    switch (type) {
      case 0:
        return 'Mixed';

      case 1:
        return 'Exclusive';

      case 2:
        return 'All';

      default:
        return null;
    }
  };

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

  const deleteAvailabilityStatusAccount = () => {
    dispatch(
      updateAvailabilityStatus({
        _id: deleteId?._id,
        availabilityStatus: {
          ...deleteId,
          deleted: !deleteId?.deleted,
        },
      }),
    );
  };
  const setCurrentAvailabilityStatusHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeAvailabilityStatusList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeAvailabilityStatusList]);

  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveAvailabilityStatusList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveAvailabilityStatusList]);

  const { itemsActive, requestSortActive } = useSortableAll(
    activeAvailabilityStatusList,
  );
  const { itemsInActive, requestSortInActive } = useSortableAll(
    inActiveAvailabilityStatusList,
  );

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage?.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentAvailabilityStatusHandler,
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
      setCurrentAvailabilityStatusHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage?.inActiveCurrentPage]);

  useEffect(() => {
    dispatch(getAvailabilityStatusListData());
  }, [dispatch]);

  useEffect(() => {
    if (isAvailabilityStatusUpdated) {
      dispatch(getAvailabilityStatusListData());
      dispatch(setIsAvailabilityStatusUpdated(false));
    }
  }, [isAvailabilityStatusUpdated, dispatch]);

  return (
    <div className="inner_wrapper">
      {availabilityStatusLoading && <Loader />}
      <div className="availabilitystatus_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Typography>Availability Statuses</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Availability Statuses</h1>
        </div>
        <div className="availabilitystatus_wrap">
          <Link
            to="/availability-status/add-edit-availability-status"
            className="btn_primary small mb-3"
          >
            Add New Availability Status
          </Link>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper availabilitystatus_active_table mb-3">
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
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortActive('min_percentage_available')
                        }
                      >
                        Min % Available
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortActive('max_percentage_available')
                        }
                      >
                        Max % Available
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('night_type')}>
                        Night Type
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      <span onClick={() => requestSortActive('description')}>
                        Description
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(elementAvailability => {
                    return (
                      <TableRow key={elementAvailability?._id}>
                        <TableCell>
                          <div className="badge_wrap d-flex align-items-center">
                            <span
                              className="badge"
                              style={{
                                backgroundColor: `${elementAvailability?.colour}`,
                              }}
                            ></span>
                            <span>%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {!!elementAvailability?.item_id
                            ? elementAvailability?.item_id
                            : '-'}
                        </TableCell>
                        <TableCell>{elementAvailability?.name}</TableCell>
                        <TableCell>
                          {!!elementAvailability?.min_percentage_available?.toFixed(
                            4,
                          )
                            ? elementAvailability?.min_percentage_available?.toFixed(
                                4,
                              )
                            : '00'}
                          %
                        </TableCell>
                        <TableCell>
                          {!!elementAvailability?.max_percentage_available?.toFixed(
                            4,
                          )
                            ? elementAvailability?.max_percentage_available?.toFixed(
                                4,
                              )
                            : '00'}
                          %
                        </TableCell>
                        <TableCell>
                          {/* optionNightType[elementAvailability?.night_type]
                              ?.label */}
                          {getNightType(elementAvailability?.night_type)}
                        </TableCell>
                        <TableCell>
                          <p className="w_400">
                            {!!elementAvailability?.description
                              ? elementAvailability?.description
                              : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/availability-status/add-edit-availability-status/${elementAvailability?._id}`}
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
                                    elementAvailability,
                                    dispatch,
                                    updateAvailabilityStatus,
                                    'availabilityStatus',
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
                                  OpenDelete(elementAvailability);
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
                          activeAvailabilityStatusList?.length,
                        )}{' '}
                        of {activeAvailabilityStatusList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalActiveRecordPage}
                          page={currentPage?.activeCurrentPage}
                          onChange={(e, page) => {
                            setCurrentPage({
                              ...currentPage,
                              activeCurrentPage: page,
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

          <h5 className="text_primary">Inactive :</h5>
          <div className="table_main_Wrapper availabilitystatus_inactive_table mb-3">
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
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortInActive('min_percentage_available')
                        }
                      >
                        Min % Available
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortInActive('max_percentage_available')
                        }
                      >
                        Max % Available
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('night_type')}>
                        Night Type
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      <span onClick={() => requestSortInActive('description')}>
                        Description
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(elementAvailability => (
                    <TableRow key={elementAvailability?._id}>
                      <TableCell>
                        <div className="badge_wrap d-flex align-items-center">
                          <span
                            className="badge"
                            style={{
                              backgroundColor: `${elementAvailability?.colour}`,
                            }}
                          ></span>
                          <span>%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {!!elementAvailability?.item_id
                          ? elementAvailability?.item_id
                          : '-'}
                      </TableCell>
                      <TableCell>{elementAvailability?.name}</TableCell>
                      <TableCell>
                        {!!elementAvailability?.min_percentage_available?.toFixed(
                          4,
                        )
                          ? elementAvailability?.min_percentage_available?.toFixed(
                              4,
                            )
                          : '00'}
                        %
                      </TableCell>
                      <TableCell>
                        {!!elementAvailability?.max_percentage_available?.toFixed(
                          4,
                        )
                          ? elementAvailability?.max_percentage_available?.toFixed(
                              4,
                            )
                          : '00'}
                        %
                      </TableCell>
                      <TableCell>
                        {/* {
                          optionNightType[elementAvailability?.night_type]
                            ?.label
                        } */}
                        {getNightType(elementAvailability?.night_type)}
                      </TableCell>
                      <TableCell>
                        <p className="w_400">
                          {!!elementAvailability?.description
                            ? elementAvailability?.description
                            : '-'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <ul className="action_wrap">
                          <li>
                            <Link
                              to={`/availability-status/add-edit-availability-status/${elementAvailability?._id}`}
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
                                  elementAvailability,
                                  dispatch,
                                  updateAvailabilityStatus,
                                  'availabilityStatus',
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
                                OpenDelete(elementAvailability);
                              }}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
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
                          inActiveAvailabilityStatusList?.length,
                        )}{' '}
                        of {inActiveAvailabilityStatusList?.length} entries
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
        onClickDelete={deleteAvailabilityStatusAccount}
        name="Are you sure you want to delete this status? Note: this cannot be undone"
      />
    </div>
  );
}
