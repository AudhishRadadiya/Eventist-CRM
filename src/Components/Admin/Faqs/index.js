import React, { useState, useEffect, useMemo } from 'react';
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
import useGroupSortable from 'utils/useGroupSortable';
import _ from 'lodash';
import { getTotalPages } from './../../../utils/common';
import {
  getFaqListData,
  setIsFaqUpdated,
  updateFaq,
} from 'store/reducers/Admin/FAQs/faq.slice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import DataNotFound from 'Components/Common/DataNotFound';
import { limitType } from 'utils/FieldValues';
import { getAllPageData2, getPageListData2 } from 'utils/gropingPagination';
import useGroupSortableAll from 'utils/useGroupSortableAll';

const pageSize = 10;
export default function Faqs() {
  const dispatch = useDispatch();

  const { activeFaqList, inActiveFaqList, isFaqUpdated, faqLoading } =
    useSelector(({ faq }) => faq);

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

  const [activeFaqListArray, setActiveFaqListArray] = useState([]);
  const [inActiveFaqListArray, setInActiveFaqListArray] = useState([]);

  const [activeAllPageData, setActiveAllPageData] = useState([]);
  const [inActiveAllPageData, setInActiveAllPageData] = useState([]);
  useEffect(() => {
    if (activeFaqList?.length > 0) {
      let dummyList = [];
      activeFaqList.map(i => {
        dummyList.push({ catName: i.FAQ_category, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData, show_more: false });
          return { ...groupData, show_more: false };
        });
        return dummyList;
      });
      setActiveFaqListArray(dummyList);
    }
  }, [activeFaqList]);

  useEffect(() => {
    if (inActiveFaqList?.length > 0) {
      let dummyList = [];
      inActiveFaqList.map(i => {
        dummyList.push({ catName: i.FAQ_category, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData, show_more: false });
          return { ...groupData, show_more: false };
        });
        return dummyList;
      });
      setInActiveFaqListArray(dummyList);
    }
  }, [inActiveFaqList]);

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeFaqList.flatMap(i => i.group_data),
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeFaqList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalInActiveRecordCount = getTotalPages(
      inActiveFaqList.flatMap(i => i.group_data),
      pageSize,
    );
    return totalInActiveRecordCount;
  }, [inActiveFaqList]);
  const setCurrentPageHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  useEffect(() => {
    if (activeFaqListArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        activeFaqListArray,
        currentPage.activeCurrentPage,
        pageSize,
        totalActiveRecordPage,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
      setActiveAllPageData(currentDataList);
    }
  }, [activeFaqListArray, totalActiveRecordPage]);

  useEffect(() => {
    if (inActiveFaqListArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        inActiveFaqListArray,
        currentPage.inActiveCurrentPage,
        pageSize,
        totalInActiveRecordPage,
        setCurrentPageHandler,
        'inActiveCurrentPage',
      );
      setInActiveAllPageData(currentDataList);
    }
  }, [inActiveFaqListArray, totalInActiveRecordPage]);

  const { itemsActive, requestSortActive } =
    useGroupSortableAll(activeFaqListArray);
  const { itemsInActive, requestSortInActive } =
    useGroupSortableAll(inActiveFaqListArray);

  const activeCurrentData = useMemo(() => {
    let currentDataList = [];
    if (activeAllPageData?.length > 0) {
      currentDataList = getPageListData2(
        itemsActive,
        activeAllPageData,
        currentPage.activeCurrentPage,
        totalActiveRecordPage,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
    }
    return currentDataList;
  }, [activeAllPageData, itemsActive, currentPage]);
  const inActiveCurrentData = useMemo(() => {
    let currentDataList = [];
    if (inActiveAllPageData?.length > 0) {
      currentDataList = getPageListData2(
        itemsInActive,
        inActiveAllPageData,
        currentPage.inActiveCurrentPage,
        totalInActiveRecordPage,
        setCurrentPageHandler,
        'inActiveCurrentPage',
      );
    }
    return currentDataList;
  }, [inActiveAllPageData, itemsInActive, currentPage]);

  useEffect(() => {
    dispatch(getFaqListData());
  }, [dispatch]);

  useEffect(() => {
    if (isFaqUpdated) {
      dispatch(getFaqListData());
      dispatch(setIsFaqUpdated(false));
    }
  }, [dispatch, isFaqUpdated]);
  const expandHandleChange = (_id, toggle, type) => {
    if (type === 'active') {
      let activeData = activeFaqListArray?.map(item => {
        if (item.catName) {
          return item;
        } else {
          if (item._id === _id) {
            return { ...item, show_more: toggle };
          }
          return item;
        }
      });
      setActiveFaqListArray(activeData);
    } else {
      let activeData = inActiveFaqListArray?.map(item => {
        if (item.catName) {
          return item;
        } else {
          if (item._id === _id) {
            return { ...item, show_more: toggle };
          }
          return item;
        }
      });
      setInActiveFaqListArray(activeData);
    }
  };

  const suspendFaq = faq => {
    dispatch(
      updateFaq({
        _id: faq._id,
        faq: {
          ...faq,
          FAQ_category: faq?.FAQ_category_id,
          is_active: !faq.is_active,
        },
      }),
    );
  };
  const OpenDelete = faq => {
    setDeleteId(faq);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteFaqAccount = () => {
    dispatch(
      updateFaq({
        _id: deleteId._id,
        faq: {
          ...deleteId,
          FAQ_category: deleteId?.FAQ_category_id,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };
  return (
    <div className="inner_wrapper">
      {faqLoading && <Loader />}
      <div className="faqs_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>FAQs</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Current FAQs</h1>
        </div>
        <div className="faqs_wrap">
          <div className="faqs_btn mb-3">
            <Row>
              <Col xs={6}>
                <Link to="/faqs/add-edit-faqs" className="btn_border small">
                  Add New FAQ
                </Link>
              </Col>
              <Col xs={6} className="text-end">
                <Link to="/faqs-categories" className="btn_border small">
                  View FAQ Categories
                </Link>
              </Col>
            </Row>
          </div>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper vertical_top faqs_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('year')}>
                        Year
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('show_online')}>
                        Show Online?
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('featured')}>
                        Is Featured?
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('order')}>
                        Order #
                      </span>
                    </TableCell>
                    <TableCell>Restricted to Venue/s</TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map((faq, index) => {
                    return (
                      <React.Fragment key={index}>
                        {faq?.is_cat ? (
                          <TableRow className="full_row">
                            <TableCell colSpan={6}>{faq?.catName}</TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {faq?.catName && ( // Check if catName exists
                              <TableRow>
                                <TableCell>{faq?.catName}</TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>
                                <span className="text_light">
                                  {faq?.year ? faq?.year : 'Any year'}
                                </span>
                              </TableCell>
                              <TableCell>
                                {faq?.name ? faq?.name : '-'}
                              </TableCell>
                              <TableCell>
                                {faq?.show_online === false ? 'No' : 'Yes'}
                              </TableCell>
                              <TableCell>
                                {faq?.featured === false ? 'No' : 'Yes'}
                              </TableCell>
                              <TableCell>
                                {faq?.order ? faq?.order : '0'}
                              </TableCell>
                              <TableCell>
                                <div
                                  className={
                                    faq?.show_more
                                      ? 'show_more_data expanded'
                                      : 'show_more_data'
                                  }
                                >
                                  <div>
                                    <p className="description">
                                      {limitType[faq?.limit_type]?.value ===
                                      0 ? (
                                        <>
                                          <span className="text_light">
                                            All
                                          </span>
                                        </>
                                      ) : limitType[faq?.limit_type]?.value ===
                                        1 ? (
                                        <>
                                          <span className="text-success">
                                            ONLY :{' '}
                                          </span>
                                          <span className="text_light">
                                            {faq?.venue_data
                                              ?.map(element => {
                                                return element.internal_name;
                                              })
                                              ?.join(',')}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text-danger">
                                            NOT :{' '}
                                          </span>
                                          <span className="text_light">
                                            {faq?.venue_data
                                              ?.map(element => {
                                                return element.internal_name;
                                              })
                                              ?.join(', ')}
                                          </span>
                                        </>
                                      )}
                                    </p>
                                    <span
                                      className="show_more text_primary"
                                      onClick={() =>
                                        expandHandleChange(
                                          faq._id,
                                          !faq.show_more,
                                          'active',
                                        )
                                      }
                                    >
                                      {(faq?.limit_type == 1 &&
                                        faq?.venue_data?.length > 0) ||
                                      (faq?.limit_type == 2 &&
                                        faq?.venue_data?.length > 0)
                                        ? faq?.show_more === false
                                          ? 'Show More'
                                          : 'Show Less'
                                        : ''}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      to={`/faqs/add-edit-faqs/${faq?._id}`}
                                      className="btn_edit"
                                    >
                                      <img src={EditIcon} alt="Edit Icon" />
                                    </Link>
                                  </li>
                                  <li>
                                    <button
                                      type="button"
                                      className="btn_warning"
                                      onClick={() => suspendFaq(faq)}
                                    >
                                      Suspend
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type="button"
                                      className="btn_border small"
                                      onClick={() => OpenDelete(faq)}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                </ul>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="table_pagination_wrap">
              {activeCurrentData?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <p className="m-0">
                      Showing {activeIndexOfFirstItem + 1} to{' '}
                      {Math.min(
                        activeIndexOfLastItem,
                        activeFaqList.flatMap(i => i.group_data)?.length,
                      )}{' '}
                      of {activeFaqList.flatMap(i => i.group_data)?.length}{' '}
                      entries
                    </p>
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

          <h5 className="text_primary">Inactive :</h5>
          <div className="table_main_Wrapper faqs_inactive_table mb-3">
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
                      <span onClick={() => requestSortInActive('name')}>
                        Name
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
                    <TableCell>Restricted to Venue/s</TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(faq => {
                    return (
                      <>
                        {faq?.is_cat ? (
                          <TableRow key={faq} className="full_row">
                            <TableCell colSpan={6}>{faq?.catName}</TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell>
                              <span className="text_light">
                                {faq?.year ? faq?.year : 'Any year'}
                              </span>
                            </TableCell>
                            <TableCell>{faq?.name}</TableCell>
                            <TableCell>
                              {faq?.show_online === false ? 'No' : 'Yes'}
                            </TableCell>
                            <TableCell>
                              {faq?.order ? faq?.order : '0'}
                            </TableCell>
                            <TableCell>
                              <div
                                className={
                                  faq?.show_more
                                    ? 'show_more_data expanded'
                                    : 'show_more_data'
                                }
                              >
                                <div>
                                  <p className="description">
                                    {limitType[faq?.limit_type]?.value === 0 ? (
                                      <>
                                        <span className="text_light">All</span>
                                      </>
                                    ) : limitType[faq?.limit_type]?.value ===
                                      1 ? (
                                      <>
                                        <span className="text-success">
                                          ONLY :{' '}
                                        </span>
                                        <span className="text_light">
                                          {faq?.venue_data
                                            ?.map(element => {
                                              return element.internal_name;
                                            })
                                            ?.join(',')}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-danger">
                                          NOT :{' '}
                                        </span>
                                        <span className="text_light">
                                          {faq?.venue_data
                                            ?.map(element => {
                                              return element.internal_name;
                                            })
                                            ?.join(',')}
                                        </span>
                                      </>
                                    )}
                                  </p>
                                  <span
                                    className="show_more text_primary"
                                    onClick={() =>
                                      expandHandleChange(
                                        faq._id,
                                        !faq.show_more,
                                        'inActive',
                                      )
                                    }
                                  >
                                    {(faq?.limit_type == 1 &&
                                      faq?.venue_data?.length > 0) ||
                                    (faq?.limit_type == 2 &&
                                      faq?.venue_data?.length > 0)
                                      ? faq?.show_more === false
                                        ? 'Show More'
                                        : 'Show Less'
                                      : ''}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <ul className="action_wrap">
                                <li>
                                  <Link
                                    to={`/faqs/add-edit-faqs/${faq?._id}`}
                                    className="btn_edit"
                                  >
                                    <img src={EditIcon} alt="Edit Icon" />
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    type="button"
                                    className="btn_info"
                                    onClick={() => suspendFaq(faq)}
                                  >
                                    Activate
                                  </button>
                                </li>
                                <li>
                                  <button
                                    type="button"
                                    className="btn_border small"
                                    onClick={() => OpenDelete(faq)}
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
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
                        {' '}
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveFaqList.flatMap(i => i.group_data)?.length,
                        )}{' '}
                        of {inActiveFaqList.flatMap(i => i.group_data)?.length}{' '}
                        entries
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
        onClickDelete={deleteFaqAccount}
        name="Are you sure you want to delete this faq? Note: this cannot be undone"
      />
    </div>
  );
}
