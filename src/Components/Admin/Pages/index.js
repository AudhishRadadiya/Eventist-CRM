import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import EditIcon from '../../../Assets/Img/edit.svg';
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
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPagesListData,
  setIsPagesUpdated,
  updatePages,
} from 'store/reducers/Admin/Events/pages.slice';
import Loader from 'Components/Common/Loader';
import DataNotFound from 'Components/Common/DataNotFound';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import useSortable from 'utils/useSortable';

const pageSize = 10;

export default function Pages() {
  const dispatch = useDispatch();

  const { pagesLoading, isPagesUpdated, activePagesList, inActivePagesList } =
    useSelector(({ pages }) => pages);

  const [deletePopup, setDeletePopup] = useState(false);
  const [deletePages, setDeletePages] = useState('');
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const inActiveIndexOfLastItem = currentPage.inActiveCurrentPage * pageSize;
  const inActiveIndexOfFirstItem = inActiveIndexOfLastItem - pageSize;

  useEffect(() => {
    dispatch(getPagesListData());
  }, [dispatch]);

  useEffect(() => {
    if (isPagesUpdated) {
      dispatch(getPagesListData());
      dispatch(setIsPagesUpdated(false));
    }
  }, [isPagesUpdated, dispatch]);

  const OpenDelete = pages => {
    setDeletePages(pages);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };
  const deleteThemeAccount = () => {
    dispatch(
      updatePages({
        _id: deletePages._id,
        pages: {
          ...deletePages,
          deleted: !deletePages.deleted,
        },
      }),
    );
  };
  const setCurrentPageHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };
  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(activePagesList, pageSize);
    return totalActiveRecordCount;
  }, [activePagesList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(inActivePagesList, pageSize);
    return totalActiveRecordCount;
  }, [inActivePagesList]);

  const { itemsActive, requestSortActive } = useSortable(activePagesList);
  const { itemsInActive, requestSortInActive } = useSortable(inActivePagesList);

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

  return (
    <div className="inner_wrapper">
      {pagesLoading && <Loader />}
      <div className="pages_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Pages</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Manage Pages</h1>
        </div>
        <div className="pages_wrap">
          <Link to="/pages/add-edit-pages" className="btn_border small mb-3">
            Add New Page
          </Link>
          <h4>Current Pages</h4>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper pages_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('uri')}>URI</span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('title')}>
                        Title
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('description')}>
                        Description
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(pages => {
                    return (
                      <TableRow>
                        <TableCell>{pages.uri}</TableCell>
                        <TableCell>{pages.name}</TableCell>
                        <TableCell>
                          <p className="w_400">{pages.title}</p>
                        </TableCell>
                        <TableCell>
                          <p className="w_400">{pages.description}</p>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/pages/add-edit-pages/${pages._id}`}
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
                                    pages,
                                    dispatch,
                                    updatePages,
                                    'pages',
                                  )
                                }
                              >
                                Suspend
                              </button>
                            </li>
                            <li>
                              <button
                                type="Button"
                                className="btn_border small"
                                onClick={() => OpenDelete(pages)}
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
                          activePagesList?.length,
                        )}{' '}
                        of {activePagesList?.length} entries
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
          <div className="table_main_Wrapper pages_inactive_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortInActive('uri')}>
                        URI
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('title')}>
                        Title
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('description')}>
                        Description
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(pages => {
                    return (
                      <TableRow>
                        <TableCell>{pages.uri}</TableCell>
                        <TableCell>{pages.name}</TableCell>
                        <TableCell>
                          <p className="w_400">{pages.title}</p>
                        </TableCell>
                        <TableCell>
                          <p className="w_400">{pages.description}</p>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/pages/add-edit-pages/${pages._id}`}
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
                                    pages,
                                    dispatch,
                                    updatePages,
                                    'pages',
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
                                onClick={() => OpenDelete(pages)}
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
                          inActivePagesList?.length,
                        )}{' '}
                        of {inActivePagesList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
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
        name="Are you sure you want to delete this page? Note: this cannot be undone"
      />
    </div>
  );
}
