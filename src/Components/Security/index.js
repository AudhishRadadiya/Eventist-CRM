import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import CheckIcon from '../../Assets/Img/check-green.svg';
import CrossIcon from '../../Assets/Img/cross-red.svg';
import EditIcon from '../../Assets/Img/edit.svg';
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
import Loader from './../Common/Loader';
import {
  getUserListData,
  setIsUserUpdated,
  updateUserSecurity,
} from 'store/reducers/User/user.slice';
import { getTotalPages, getPaginationData, checkEmail } from 'utils/common';
import useSortable from './../../utils/useSortable';
import DataNotFound from 'Components/Common/DataNotFound';
import DeletePopupModal from 'Components/Common/DeletePopupModal';

const pageSize = 10;

export default function Security() {
  const dispatch = useDispatch();

  const { activeUserList, inActiveUserList, isUserUpdated, userLoading } =
    useSelector(({ user }) => user);

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

  const setCurrentPageHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };
  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(activeUserList, pageSize);
    return totalActiveRecordCount;
  }, [activeUserList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(inActiveUserList, pageSize);
    return totalActiveRecordCount;
  }, [inActiveUserList]);
  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      activeUserList,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentPageHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [activeUserList, currentPage.activeCurrentPage]);
  const inActiveCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      inActiveUserList,
      currentPage.inActiveCurrentPage,
      pageSize,
      totalInActiveRecordPage,
      setCurrentPageHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [inActiveUserList, currentPage.inActiveCurrentPage]);

  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);
  const { itemsInActive, requestSortInActive } =
    useSortable(inActiveCurrentData);
  useEffect(() => {
    dispatch(getUserListData());
  }, [dispatch]);
  useEffect(() => {
    if (isUserUpdated) {
      dispatch(getUserListData());
      dispatch(setIsUserUpdated(false));
    }
  }, [dispatch, isUserUpdated]);
  const suspendUserAccount = user => {
    let userObject = { ...user };
    delete userObject['mergePermissions'];
    delete userObject['mergeRestricted_to_ip_host'];
    dispatch(
      updateUserSecurity({
        _id: user._id,
        user: {
          ...userObject,
          is_active: !userObject.is_active,
        },
      }),
    );
  };

  const OpenDelete = value => {
    setDeleteId(value);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteUserAccount = () => {
    let userObject = { ...deleteId };
    delete userObject['mergePermissions'];
    delete userObject['mergeRestricted_to_ip_host'];
    dispatch(
      updateUserSecurity({
        _id: deleteId._id,
        user: {
          ...userObject,
          deleted: !userObject.deleted,
        },
      }),
    );
  };

  return (
    <div className="inner_wrapper">
      {userLoading && <Loader />}
      <div className="security_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Main Admin</b>
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Manage User</h1>
        </div>
        <div className="security_wrap">
          <div className="security_btn mb-3">
            <Link to="/security/addeditsecurity" className="btn_border small">
              Add New User
            </Link>
          </div>
          <div className="security_active_table">
            <h5 className="text_primary">Active :</h5>
            <div className="table_main_Wrapper table_security_wrap mb-3">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <span onClick={() => requestSortActive('username')}>
                          Username
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('name')}>
                          Name
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('public_name')}>
                          Public Name
                        </span>
                      </TableCell>
                      <TableCell sx={{ width: '30%' }}>
                        <span onClick={() => requestSortActive('email')}>
                          Email
                        </span>
                      </TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>
                        <span
                          onClick={() => requestSortActive('mergePermissions')}
                        >
                          Permissions
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          onClick={() =>
                            requestSortActive('mergeRestricted_to_ip_host')
                          }
                        >
                          Locked to IPs
                        </span>
                      </TableCell>
                      <TableCell sx={{ width: '10%' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {itemsActive.map(user => {
                    return (
                      <TableBody>
                        <TableRow>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.public_name}</TableCell>
                          <TableCell>
                            {' '}
                            <span>
                              {checkEmail(user.email) ? (
                                <img src={CheckIcon} alt="checkIcon" />
                              ) : (
                                <img src={CrossIcon} alt="CrossIcons" />
                              )}
                            </span>{' '}
                            <span className="text_primary">{user.email}</span>
                          </TableCell>
                          <TableCell>
                            {user.super_admin ? (
                              <p className="per_des">
                                <strong>Super Administrator :</strong>
                                 To be able to perform every functionality on
                                the system.
                              </p>
                            ) : (
                              ''
                            )}
                            {user.standard_admin ? (
                              <p className="per_des">
                                <strong>Standard Administrator : </strong>
                                To be able to perform every functionality on the
                                system, but no ability to add new or edit user
                                details, and no access to development and system
                                configuration areas.
                              </p>
                            ) : (
                              ''
                            )}
                            {user.basic_admin ? (
                              <p className="per_des">
                                <strong>Basic Administrator :</strong>
                                 To be entitled to basic access. Only ability to
                                invoice an account, ability to manage (including
                                billables) and create contacts with accounts,
                                create and assign bookings, accept and process
                                coupons, create/view reports.
                              </p>
                            ) : (
                              ''
                            )}
                          </TableCell>
                          <TableCell>
                            <p className="description">
                              {user.mergePermissions}
                            </p>
                          </TableCell>
                          <TableCell>
                            {user.mergeRestricted_to_ip_host
                              ? user.mergeRestricted_to_ip_host
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <ul className="action_wrap">
                              <li>
                                <Link
                                  to={`/security/addeditsecurity/${user._id}`}
                                  className="btn_edit"
                                >
                                  <img src={EditIcon} alt="Edit Icon" />
                                </Link>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="btn_warning"
                                  onClick={() => suspendUserAccount(user)}
                                >
                                  Suspend
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="btn_border small"
                                  onClick={() => OpenDelete(user)}
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    );
                  })}
                </Table>
              </TableContainer>
              <div className="table_pagination_wrap">
                {itemsActive?.length > 0 ? (
                  <Row className="g-0 align-items-center my-2">
                    <Col sm={6}>
                      <div className="total_entry">
                        <p className="m-0">
                          Showing {activeIndexOfFirstItem + 1} to{' '}
                          {Math.min(
                            activeIndexOfLastItem,
                            activeUserList?.length,
                          )}{' '}
                          of {activeUserList?.length} entries
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="pagination_wrap">
                        <Stack spacing={2}>
                          <Pagination
                            count={totalActiveRecordPage}
                            page={currentPage.activeCurrentPage}
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
          </div>
          <div className="security_inactive_table">
            <h5 className="text_primary">Inactive :</h5>
            <div className="table_main_Wrapper table_security_wrap mb-3">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <span onClick={() => requestSortInActive('username')}>
                          Username
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortInActive('name')}>
                          Name
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          onClick={() => requestSortInActive('public_name')}
                        >
                          Public Name
                        </span>
                      </TableCell>
                      <TableCell sx={{ width: '30%' }}>
                        <span onClick={() => requestSortInActive('email')}>
                          Email
                        </span>
                      </TableCell>
                      <TableCell>Description</TableCell>

                      <TableCell>
                        <span
                          onClick={() =>
                            requestSortInActive('mergePermissions')
                          }
                        >
                          Permissions
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          onClick={() =>
                            requestSortInActive('mergeRestricted_to_ip_host')
                          }
                        >
                          Locked to IPs
                        </span>
                      </TableCell>
                      <TableCell sx={{ width: '10%' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {itemsInActive.map(user => {
                    return (
                      <TableBody>
                        <TableRow>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.public_name}</TableCell>
                          <TableCell>
                            <span>
                              {checkEmail(user.email) ? (
                                <img src={CheckIcon} alt="checkIcon" />
                              ) : (
                                <img src={CrossIcon} alt="CrossIcons" />
                              )}
                            </span>{' '}
                            <span className="text_primary">{user.email}</span>
                          </TableCell>
                          <TableCell>
                            {user.super_admin ? (
                              <p className="per_des">
                                <strong>Super Administrator :</strong>
                                 To be able to perform every functionality on
                                the system.
                              </p>
                            ) : (
                              ''
                            )}
                            {user.standard_admin ? (
                              <p className="per_des">
                                <strong>Standard Administrator : </strong>
                                To be able to perform every functionality on the
                                system, but no ability to add new or edit user
                                details, and no access to development and system
                                configuration areas.
                              </p>
                            ) : (
                              ''
                            )}
                            {user.basic_admin ? (
                              <p className="per_des">
                                <strong>Basic Administrator :</strong>
                                 To be entitled to basic access. Only ability to
                                invoice an account, ability to manage (including
                                billables) and create contacts with accounts,
                                create and assign bookings, accept and process
                                coupons, create/view reports.
                              </p>
                            ) : (
                              ''
                            )}
                          </TableCell>
                          <TableCell>
                            <p className="description">
                              {user.mergePermissions}
                            </p>
                          </TableCell>
                          <TableCell>
                            {user.mergeRestricted_to_ip_host
                              ? user.mergeRestricted_to_ip_host
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <ul className="action_wrap">
                              <li>
                                <Link
                                  to={`/security/addeditsecurity/${user._id}`}
                                  className="btn_edit"
                                >
                                  <img src={EditIcon} alt="Edit Icon" />
                                </Link>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="btn_info"
                                  onClick={() => suspendUserAccount(user)}
                                >
                                  Activate
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="btn_border small"
                                  onClick={() => OpenDelete(user)}
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    );
                  })}
                </Table>
              </TableContainer>
              <div className="table_pagination_wrap">
                {itemsInActive?.length > 0 ? (
                  <Row className="g-0 align-items-center my-2">
                    <Col sm={6}>
                      <div className="total_entry">
                        <p className="m-0">
                          Showing {inActiveIndexOfFirstItem + 1} to{' '}
                          {Math.min(
                            inActiveIndexOfLastItem,
                            inActiveUserList?.length,
                          )}{' '}
                          of {inActiveUserList?.length} entries
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
      </div>
      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteUserAccount}
        name="Are you sure you want to delete this user? Note: this cannot be undone"
      />
    </div>
  );
}
