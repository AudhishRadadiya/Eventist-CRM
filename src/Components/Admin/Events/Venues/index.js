import React, { useEffect, useState, useMemo } from 'react';
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
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  getVenueListData,
  setIsVenueUpdated,
  updateVenue,
} from 'store/reducers/Admin/Events/venue.slice';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import useSortable from 'utils/useSortable';
import Loader from 'Components/Common/Loader';
import { Pagination } from '@mui/material';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';

let pageSize = 10;

export default function Venues() {
  const dispatch = useDispatch();

  const { activeVenueList, inActiveVenueList, isVenueUpdated, venueLoading } =
    useSelector(({ venue }) => venue);

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
    dispatch(getVenueListData());
  }, [dispatch]);

  useEffect(() => {
    if (isVenueUpdated) {
      dispatch(getVenueListData());
      dispatch(setIsVenueUpdated(false));
    }
  }, [dispatch, isVenueUpdated]);

  const OpenDelete = venue => {
    setDeleteId(venue);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteVenueAccount = () => {
    let data = { ...deleteId };
    delete data['venues_sales_manager'];

    dispatch(
      updateVenue({
        _id: deleteId._id,
        venue: {
          ...data,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };

  const setCurrentVenueHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(activeVenueList, pageSize);
    return totalActiveRecordCount;
  }, [activeVenueList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(inActiveVenueList, pageSize);
    return totalActiveRecordCount;
  }, [inActiveVenueList]);

  const { itemsActive, requestSortActive } = useSortable(activeVenueList);
  const { itemsInActive, requestSortInActive } = useSortable(inActiveVenueList);

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentVenueHandler,
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
      setCurrentVenueHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage.inActiveCurrentPage]);

  return (
    <div className="inner_wrapper">
      {venueLoading && <Loader />}
      <div className="venues_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Typography>Venues</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Current Venue</h1>
        </div>
        <div className="venues_wrap">
          <Link
            to="/admin/events/venues/add-edit-venues"
            className="btn_primary small mb-3"
          >
            Add New Venue
          </Link>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper venues_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('sku')}>SKU</span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortActive('tag_for_mail_templates')
                        }
                      >
                        Short Tag
                      </span>
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
                      {/* <span
                        onClick={() =>
                          requestSortActive('venues_sales_manager')
                        }
                      > */}
                      Sales Manager
                      {/* </span> */}
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
                  {activeCurrentData?.map(venue => {
                    return (
                      <TableRow key={venue?._id}>
                        <TableCell>{venue.sku}</TableCell>
                        <TableCell>{venue.tag_for_mail_templates}</TableCell>
                        <TableCell>
                          <p className="w_300">{venue.internal_name}</p>
                        </TableCell>
                        <TableCell>
                          <p className="w_300">{venue.public_name}</p>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              `${Object.keys(venue?.venues_sales_manager)}`
                                ?.length > 0
                                ? 'contact_note_wrapper'
                                : 'contact_note_wrapper text_light'
                            }
                          >
                            {venue?.venues_sales_manager?.public_name}
                            {venue?.venues_sales_manager?.username
                              ? `(${venue?.venues_sales_manager?.username})`
                              : 'None'}
                          </span>
                        </TableCell>
                        <TableCell>{venue.notes ? venue.notes : '-'}</TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/admin/events/venues/add-edit-venues/${venue._id}`}
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
                                  let data = { ...venue };
                                  delete data['venues_sales_manager'];
                                  suspendHandler(
                                    data,
                                    dispatch,
                                    updateVenue,
                                    'venue',
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
                                onClick={() => OpenDelete(venue)}
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
                          activeVenueList?.length,
                        )}{' '}
                        of {activeVenueList?.length} entries
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
          <div className="table_main_Wrapper venues_inactive_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortInActive('sku')}>
                        SKU
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortInActive('tag_for_mail_templates')
                        }
                      >
                        Short Tag
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('internal_name')}
                      >
                        Internal Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('public_name')}>
                        Public Name
                      </span>
                    </TableCell>
                    <TableCell>
                      {/* <span
                        onClick={() =>
                          requestSortInActive('venues_sales_manager')
                        }
                      > */}
                      Sales Manager
                      {/* </span> */}
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
                  {inActiveCurrentData?.map(venue => {
                    return (
                      <TableRow key={venue?._id}>
                        <TableCell>{venue.sku}</TableCell>
                        <TableCell>{venue.tag_for_mail_templates}</TableCell>
                        <TableCell>{venue.internal_name}</TableCell>
                        <TableCell>
                          <p className="w_200">{venue.public_name}</p>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              `${Object.keys(venue?.venues_sales_manager)}`
                                ?.length > 0
                                ? 'contact_note_wrapper'
                                : 'contact_note_wrapper text_light'
                            }
                          >
                            {venue?.venues_sales_manager?.public_name}
                            {venue?.venues_sales_manager?.username
                              ? `(${venue?.venues_sales_manager?.username})`
                              : 'None'}
                          </span>
                        </TableCell>
                        <TableCell>{venue.notes ? venue.notes : '-'}</TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/admin/events/venues/add-edit-venues/${venue._id}`}
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
                                  let data = { ...venue };
                                  delete data['venues_sales_manager'];
                                  suspendHandler(
                                    data,
                                    dispatch,
                                    updateVenue,
                                    'venue',
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
                                onClick={() => OpenDelete(venue)}
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
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveVenueList?.length,
                        )}{' '}
                        of {inActiveVenueList?.length} entries
                      </p>
                    </div>
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
      </div>
      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteVenueAccount}
        name="Are you sure you want to delete this venue? Note: this cannot be undone"
      />
    </div>
  );
}
