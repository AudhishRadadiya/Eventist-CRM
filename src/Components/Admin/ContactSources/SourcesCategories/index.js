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
import useSortable from 'utils/useSortable';
import {
  getSourceCategoryListData,
  setIsSourceCategoryUpdated,
  updateSourceCategory,
} from 'store/reducers/Admin/Events/ContactSources/sourceCategory.slice';
import Loader from 'Components/Common/Loader';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import { Pagination } from '@mui/material';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import useSortableAll from 'utils/useSortableAll';

let pageSize = 10;

export default function CategoriesSources() {
  const dispatch = useDispatch();

  const {
    activeSourceCategoryList,
    inActiveSourceCategoryList,
    isSourceCategoryUpdated,
    sourceCategoryLoading,
  } = useSelector(({ sourceCategory }) => sourceCategory);

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
    dispatch(getSourceCategoryListData());
  }, [dispatch]);

  useEffect(() => {
    if (isSourceCategoryUpdated) {
      dispatch(getSourceCategoryListData());
      dispatch(setIsSourceCategoryUpdated(false));
    }
  }, [dispatch, isSourceCategoryUpdated]);

  const OpenDelete = sourceCategory => {
    setDeleteId(sourceCategory);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteSourceCategoryAccount = () => {
    dispatch(
      updateSourceCategory({
        _id: deleteId._id,
        sourceCategory: {
          ...deleteId,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };

  const setCurrentSourceCategoryHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeSourceCategoryList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeSourceCategoryList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveSourceCategoryList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveSourceCategoryList]);

  const { itemsActive, requestSortActive } = useSortableAll(
    activeSourceCategoryList,
  );
  const { itemsInActive, requestSortInActive } = useSortableAll(
    inActiveSourceCategoryList,
  );

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentSourceCategoryHandler,
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
      setCurrentSourceCategoryHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage.inActiveCurrentPage]);

  return (
    <div className="inner_wrapper">
      {sourceCategoryLoading && <Loader />}
      <div className="ctgsource_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/contact-sources">Contact Sources</Link>
            <Typography>Sources Categories</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Current Sources Categories</h1>
        </div>
        <div className="ctgsource_wrap">
          <div className="source_btn mb-3">
            <Row>
              <Col xs={6}>
                <Link
                  to="/categories-sources/add-edit-sources-categories"
                  className="btn_border small"
                >
                  Add New Source Category
                </Link>
              </Col>
              <Col xs={6} className="text-end">
                <Link to="/contact-sources" className="btn_border small">
                  View Source
                </Link>
              </Col>
            </Row>
          </div>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper ctgsource_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('name')}>
                        Category Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('show_online')}>
                        Visible Online?
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('order')}>
                        Order #
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      <span
                        onClick={() => requestSortActive('assigned_sources')}
                      >
                        Assigned Sources
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(sourceCategory => {
                    return (
                      <>
                        <TableRow>
                          <TableCell>{sourceCategory?.name}</TableCell>
                          <TableCell>
                            {sourceCategory?.show_online
                              ? sourceCategory?.show_online
                                ? 'Yes'
                                : ''
                              : sourceCategory?.show_online === false
                              ? 'No'
                              : ''}
                          </TableCell>
                          <TableCell>
                            {sourceCategory?.order ? sourceCategory?.order : 0}
                          </TableCell>
                          <TableCell>
                            {sourceCategory?.assigned_sources
                              ? sourceCategory?.assigned_sources
                              : 'None'}
                          </TableCell>
                          <TableCell>
                            <ul className="action_wrap">
                              <li>
                                <Link
                                  to={`/categories-sources/add-edit-sources-categories/${sourceCategory?._id}`}
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
                                      sourceCategory,
                                      dispatch,
                                      updateSourceCategory,
                                      'sourceCategory',
                                    )
                                  }
                                >
                                  Suspend
                                </button>
                              </li>
                              {sourceCategory?.assigned_sources == 0 ? (
                                <li>
                                  <button
                                    type="button"
                                    className="btn_border small"
                                    onClick={() => OpenDelete(sourceCategory)}
                                  >
                                    Delete
                                  </button>
                                </li>
                              ) : (
                                ''
                              )}
                            </ul>
                          </TableCell>
                        </TableRow>
                      </>
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
                          activeSourceCategoryList?.length,
                        )}{' '}
                        of {activeSourceCategoryList?.length} entries
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
          <div className="table_main_Wrapper ctgsource_inactive_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortInActive('name')}>
                        Category Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('show_online')}>
                        Visible Online?
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('order')}>
                        Order #
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      <span
                        onClick={() => requestSortInActive('assigned_sources')}
                      >
                        Assigned Sources
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(sourceCategory => {
                    return (
                      <>
                        <TableRow>
                          <TableCell>{sourceCategory?.name}</TableCell>
                          <TableCell>
                            {sourceCategory?.show_online
                              ? sourceCategory?.show_online
                                ? 'Yes'
                                : ''
                              : sourceCategory?.show_online === false
                              ? 'No'
                              : ''}
                          </TableCell>
                          <TableCell>
                            {sourceCategory?.order ? sourceCategory?.order : 0}
                          </TableCell>
                          <TableCell>
                            {sourceCategory?.assigned_sources
                              ? sourceCategory?.assigned_sources
                              : 'None'}
                          </TableCell>
                          <TableCell>
                            <ul className="action_wrap">
                              <li>
                                <Link
                                  to={`/categories-sources/add-edit-sources-categories/${sourceCategory?._id}`}
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
                                      sourceCategory,
                                      dispatch,
                                      updateSourceCategory,
                                      'sourceCategory',
                                    )
                                  }
                                >
                                  Activate
                                </button>
                              </li>
                              {sourceCategory?.assigned_sources == 0 ? (
                                <li>
                                  <button
                                    type="button"
                                    className="btn_border small"
                                    onClick={() => OpenDelete(sourceCategory)}
                                  >
                                    Delete
                                  </button>
                                </li>
                              ) : (
                                ''
                              )}
                            </ul>
                          </TableCell>
                        </TableRow>
                      </>
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
                          inActiveSourceCategoryList?.length,
                        )}{' '}
                        of {inActiveSourceCategoryList?.length} entries
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
        onClickDelete={deleteSourceCategoryAccount}
        name="Are you sure you want to delete this source category? Note: this cannot be undone"
      />
    </div>
  );
}
