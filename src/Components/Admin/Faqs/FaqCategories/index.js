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
  getFaqCategoryListData,
  setIsFaqCategoryUpdated,
  updateFaqCategory,
} from 'store/reducers/Admin/FAQs/faqCategories.slice';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import useSortable from 'utils/useSortable';
import Loader from 'Components/Common/Loader';
import DataNotFound from 'Components/Common/DataNotFound';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import useSortableAll from 'utils/useSortableAll';

let pageSize = 10;

export default function FaqCategories() {
  const dispatch = useDispatch();

  const {
    isFaqCategoryUpdated,
    activeFaqCategoryList,
    inActiveFaqCategoryList,
    faqCategoryLoading,
  } = useSelector(({ faqCategories }) => faqCategories);

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
    dispatch(getFaqCategoryListData());
    if (isFaqCategoryUpdated) {
      dispatch(setIsFaqCategoryUpdated(false));
    }
  }, [dispatch, isFaqCategoryUpdated]);

  const OpenDelete = value => {
    setDeleteId(value);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteFaqCategoryAccount = () => {
    dispatch(
      updateFaqCategory({
        _id: deleteId._id,
        faqCategory: {
          ...deleteId,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };

  const setCurrentFaqCategoryHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeFaqCategoryList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeFaqCategoryList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveFaqCategoryList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveFaqCategoryList]);

  const { itemsActive, requestSortActive } = useSortableAll(
    activeFaqCategoryList,
  );
  const { itemsInActive, requestSortInActive } = useSortableAll(
    inActiveFaqCategoryList,
  );

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentFaqCategoryHandler,
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
      setCurrentFaqCategoryHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage.inActiveCurrentPage]);

  return (
    <div className="inner_wrapper">
      {faqCategoryLoading && <Loader />}
      <div className="ctgfaqs_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/faqs">FAQs</Link>
            <Typography>FAQs Categories</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Current FAQs Categories</h1>
        </div>
        <div className="ctgfaqs_wrap">
          <div className="ctgfaqs_btn mb-3">
            <Row>
              <Col xs={6}>
                <Link
                  to="/faqs-categories/add-edit-faqs-categories"
                  className="btn_border small"
                >
                  Add New FAQ Category
                </Link>
              </Col>
              <Col xs={6} className="text-end">
                <Link to="/faqs" className="btn_border small">
                  View FAQ
                </Link>
              </Col>
            </Row>
          </div>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper ctgfaqs_active_table mb-3">
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
                        Show Online?
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('order')}>
                        Order #
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('assigned_FAQ')}>
                        Assigned FAQs
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(faqCategory => {
                    return (
                      <TableRow>
                        <TableCell>{faqCategory?.name}</TableCell>
                        <TableCell>
                          {faqCategory?.show_online
                            ? faqCategory?.show_online
                              ? 'Yes'
                              : ''
                            : faqCategory?.show_online === false
                            ? 'No'
                            : ''}
                        </TableCell>
                        <TableCell>
                          {faqCategory?.order ? faqCategory?.order : '0'}
                        </TableCell>
                        <TableCell>
                          {faqCategory?.assigned_FAQ !== ''
                            ? faqCategory?.assigned_FAQ
                            : 'None'}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/faqs-categories/add-edit-faqs-categories/${faqCategory?._id}`}
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
                                    faqCategory,
                                    dispatch,
                                    updateFaqCategory,
                                    'faqCategory',
                                  )
                                }
                              >
                                Suspend
                              </button>
                            </li>
                            {faqCategory?.assigned_FAQ !== '' ? (
                              <li>
                                <button
                                  type="button"
                                  className="btn_border small"
                                  onClick={() => OpenDelete(faqCategory)}
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
                          activeFaqCategoryList?.length,
                        )}{' '}
                        of {activeFaqCategoryList?.length} entries
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
          <div className="table_main_Wrapper ctgfaqs_inactive_table mb-3">
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
                        Show Online?
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('order')}>
                        Order #
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('assigned_FAQ')}>
                        Assigned FAQs
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(faqCategory => {
                    return (
                      <TableRow>
                        <TableCell>{faqCategory?.name}</TableCell>
                        <TableCell>
                          {faqCategory?.show_online
                            ? faqCategory?.show_online
                              ? 'Yes'
                              : ''
                            : faqCategory?.show_online === false
                            ? 'No'
                            : ''}
                        </TableCell>
                        <TableCell>
                          {faqCategory?.order ? faqCategory?.order : '0'}
                        </TableCell>
                        <TableCell>
                          {faqCategory?.assigned_FAQ !== ''
                            ? faqCategory?.assigned_FAQ
                            : 'None'}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/faqs-categories/add-edit-faqs-categories/${faqCategory?._id}`}
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
                                    faqCategory,
                                    dispatch,
                                    updateFaqCategory,
                                    'faqCategory',
                                  )
                                }
                              >
                                Activate
                              </button>
                            </li>
                            {faqCategory?.assigned_FAQ !== '' ? (
                              <li>
                                <button
                                  type="button"
                                  className="btn_border small"
                                  onClick={() => OpenDelete(faqCategory)}
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
                          inActiveFaqCategoryList?.length,
                        )}{' '}
                        of {inActiveFaqCategoryList?.length} entries
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
        onClickDelete={deleteFaqCategoryAccount}
        name="Are you sure you want to delete this FAQ category? Note: this cannot be undone"
      />
    </div>
  );
}
