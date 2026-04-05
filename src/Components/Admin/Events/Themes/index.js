import React, { useEffect, useMemo, useState } from 'react';
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
  getThemeListData,
  setIsThemeUpdated,
  updateTheme,
} from 'store/reducers/Admin/Events/theme.slice';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import useSortable from 'utils/useSortable';
import Loader from 'Components/Common/Loader';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import useSortableAll from 'utils/useSortableAll';
const pageSize = 10;

export default function Themes() {
  const dispatch = useDispatch();

  const { themeLoading, activeThemeList, inActiveThemeList, isThemeUpdated } =
    useSelector(({ theme }) => theme);
  const [deletePopup, setDeletePopup] = React.useState(false);
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
    const totalActiveRecordCount = getTotalPages(activeThemeList, pageSize);
    return totalActiveRecordCount;
  }, [activeThemeList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(inActiveThemeList, pageSize);
    return totalActiveRecordCount;
  }, [inActiveThemeList]);
  const { itemsActive, requestSortActive } = useSortableAll(activeThemeList);
  const { itemsInActive, requestSortInActive } =
    useSortableAll(inActiveThemeList);
  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentPageHandler,
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
      setCurrentPageHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage.inActiveCurrentPage]);

  useEffect(() => {
    dispatch(getThemeListData());
  }, [dispatch]);

  useEffect(() => {
    if (isThemeUpdated) {
      dispatch(getThemeListData());
      dispatch(setIsThemeUpdated(false));
    }
  }, [dispatch, isThemeUpdated]);

  const deleteThemeAccount = () => {
    dispatch(
      updateTheme({
        _id: deleteId._id,
        theme: {
          ...deleteId,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };
  const OpenDelete = venue => {
    setDeleteId(venue);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };
  return (
    <div className="inner_wrapper">
      {themeLoading && <Loader />}
      <div className="themes_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Typography>Themes</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Event Themes</h1>
        </div>
        <div className="themes_wrap">
          <Link
            to="/admin/events/add-edit-themes"
            className="btn_primary small mb-3"
          >
            Add New Theme
          </Link>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper themes_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
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
                    <TableCell sx={{ width: '40%' }}>
                      <span onClick={() => requestSortActive('notes')}>
                        Notes
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(theme => {
                    return (
                      <TableRow key={theme?._id}>
                        <TableCell>{theme.sku}</TableCell>
                        <TableCell>{theme.internal_name}</TableCell>
                        <TableCell>{theme.public_name}</TableCell>
                        <TableCell>
                          <p className="w_400">
                            {theme.notes ? theme.notes : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/admin/events/add-edit-themes/${theme._id}`}
                                className="btn_edit"
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </Link>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_warning"
                                onClick={() =>
                                  suspendHandler(
                                    theme,
                                    dispatch,
                                    updateTheme,
                                    'theme',
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
                                onClick={() => OpenDelete(theme)}
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
                          activeThemeList?.length,
                        )}{' '}
                        of {activeThemeList?.length} entries
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
          <div className="table_main_Wrapper themes_inactive_table mb-3">
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
                    <TableCell sx={{ width: '40%' }}>
                      <span onClick={() => requestSortInActive('notes')}>
                        Notes
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(theme => {
                    return (
                      <TableRow key={theme?._id}>
                        <TableCell>{theme.sku}</TableCell>
                        <TableCell>{theme.internal_name}</TableCell>
                        <TableCell>{theme.public_name}</TableCell>
                        <TableCell>
                          <p className="w_400">
                            {theme.notes ? theme.notes : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/admin/events/add-edit-themes/${theme._id}`}
                                className="btn_edit"
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </Link>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_info"
                                onClick={() =>
                                  suspendHandler(
                                    theme,
                                    dispatch,
                                    updateTheme,
                                    'theme',
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
                                onClick={() => OpenDelete(theme)}
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
                          inActiveThemeList?.length,
                        )}{' '}
                        of {inActiveThemeList?.length} entries
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
        onClickDelete={deleteThemeAccount}
        name="Are you sure you want to delete this theme? Note: this cannot be undone"
      />
    </div>
  );
}
