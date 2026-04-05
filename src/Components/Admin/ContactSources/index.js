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
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  getContactSourcesListDataActive,
  getContactSourcesListDataInActive,
  setIsContactSourcesUpdated,
  updateContactSources,
} from 'store/reducers/Admin/Events/ContactSources/contactSources.slice';
import Loader from 'Components/Common/Loader';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import Pagination from '@mui/material/Pagination';
import { getTotalPages } from './../../../utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import useGroupSortable from 'utils/useGroupSortable';
import { getAllPageData2, getPageListData2 } from 'utils/gropingPagination';
import { limitType } from 'utils/FieldValues';
import useGroupSortableAll from 'utils/useGroupSortableAll';

const pageSize = 10;

export default function ContactSources() {
  const dispatch = useDispatch();
  const {
    activeContactSourcesList,
    inActiveContactSourcesList,
    isContactSourcesUpdated,
    contactSourcesLoading,
  } = useSelector(({ contactSources }) => contactSources);

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

  const [activeContactSourceArray, setActiveContactSourceArray] = useState([]);
  const [inActiveContactSourceArray, setInActiveContactSourceArray] = useState(
    [],
  );
  const [activeAllPageData, setActiveAllPageData] = useState([]);
  const [inActiveAllPageData, setInActiveAllPageData] = useState([]);

  const setCurrentPageHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };
  useEffect(() => {
    if (activeContactSourcesList?.length > 0) {
      let dummyList = [];
      activeContactSourcesList.map(i => {
        dummyList.push({ catName: i.source_category, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData, show_more: false });
          return { ...groupData, show_more: false };
        });
        return dummyList;
      });
      setActiveContactSourceArray(dummyList);
    }
  }, [activeContactSourcesList]);

  useEffect(() => {
    if (inActiveContactSourcesList?.length > 0) {
      let dummyList = [];
      inActiveContactSourcesList.map(i => {
        dummyList.push({ catName: i.source_category, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData, show_more: false });
          return { ...groupData, show_more: false };
        });
        return dummyList;
      });
      setInActiveContactSourceArray(dummyList);
    }
  }, [inActiveContactSourcesList]);
  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeContactSourcesList.flatMap(i => i.group_data),
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeContactSourcesList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveContactSourcesList.flatMap(i => i.group_data),
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveContactSourcesList]);

  useEffect(() => {
    if (activeContactSourceArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        activeContactSourceArray,
        currentPage.activeCurrentPage,
        pageSize,
        totalActiveRecordPage,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
      setActiveAllPageData(currentDataList);
    }
  }, [activeContactSourceArray, totalActiveRecordPage]);
  useEffect(() => {
    if (inActiveContactSourceArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        inActiveContactSourceArray,
        currentPage.inActiveCurrentPage,
        pageSize,
        totalInActiveRecordPage,
        setCurrentPageHandler,
        'inActiveCurrentPage',
      );
      setInActiveAllPageData(currentDataList);
    }
  }, [inActiveContactSourceArray, totalInActiveRecordPage]);
  const { itemsActive, requestSortActive } = useGroupSortableAll(
    activeContactSourceArray,
  );
  const { itemsInActive, requestSortInActive } = useGroupSortableAll(
    inActiveContactSourceArray,
  );

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
    dispatch(
      getContactSourcesListDataActive({
        is_active: true,
        is_total_contacts: true,
      }),
    );
    dispatch(
      getContactSourcesListDataInActive({
        is_active: false,
        is_total_contacts: true,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (isContactSourcesUpdated) {
      dispatch(
        getContactSourcesListDataActive({
          is_active: true,
          is_total_contacts: true,
        }),
      );
      dispatch(
        getContactSourcesListDataInActive({
          is_active: false,
          is_total_contacts: true,
        }),
      );
      dispatch(setIsContactSourcesUpdated(false));
    }
  }, [dispatch, isContactSourcesUpdated]);

  const expandHandleChange = (_id, toggle, type) => {
    if (type === 'active') {
      let activeData = activeContactSourceArray?.map(item => {
        if (item.catName) {
          return item;
        } else {
          if (item._id === _id) {
            return { ...item, show_more: toggle };
          }
          return item;
        }
      });
      setActiveContactSourceArray(activeData);
    } else {
      let activeData = inActiveContactSourceArray?.map(item => {
        if (item.catName) {
          return item;
        } else {
          if (item._id === _id) {
            return { ...item, show_more: toggle };
          }
          return item;
        }
      });
      setInActiveContactSourceArray(activeData);
    }
  };

  const suspendContactSources = contactSources => {
    dispatch(
      updateContactSources({
        _id: contactSources._id,
        contactSources: {
          ...contactSources,
          category: contactSources?.category,
          is_active: !contactSources.is_active,
        },
      }),
    );
  };

  const OpenDelete = contactSources => {
    setDeleteId(contactSources);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteContactSourcesAccount = () => {
    dispatch(
      updateContactSources({
        _id: deleteId._id,
        contactSources: {
          ...deleteId,
          category: deleteId?.category,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };
  return (
    <div className="inner_wrapper">
      {contactSourcesLoading && <Loader />}
      <div className="source_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Contact Sources</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Contact Sources</h1>
        </div>
        <div className="source_wrap">
          <div className="source_btn mb-3">
            <Row>
              <Col xs={6}>
                <Link
                  to="/contact-sources/add-edit-contact-sources"
                  className="btn_border small"
                >
                  Add New Source
                </Link>
              </Col>
              <Col xs={6} className="text-end">
                <Link to="/categories-sources" className="btn_border small">
                  View Source Categories
                </Link>
              </Col>
            </Row>
          </div>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper source_active_table mb-3">
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
                      <span onClick={() => requestSortActive('order')}>
                        Order
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('total_contact')}>
                        Total Contacts
                      </span>
                    </TableCell>
                    <TableCell>Restricted to Venue/s</TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(contactSources => {
                    return (
                      <>
                        {contactSources?.is_cat ? (
                          <TableRow key={contactSources} className="full_row">
                            <TableCell colSpan={7}>
                              {contactSources?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {contactSources?.catName && ( // Check if catName exists
                              <TableRow>
                                <TableCell>{contactSources?.catName}</TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>
                                <span className="text_light">
                                  {contactSources?.year
                                    ? contactSources?.year
                                    : 'Any'}
                                </span>
                              </TableCell>
                              <TableCell>{contactSources?.name}</TableCell>
                              <TableCell>
                                {contactSources?.show_online === false
                                  ? 'No'
                                  : 'Yes'}
                              </TableCell>
                              <TableCell>{contactSources?.order}</TableCell>
                              <TableCell>
                                <span className="text_light">
                                  {contactSources?.totalContacts}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div
                                  className={
                                    contactSources?.show_more
                                      ? 'show_more_data expanded'
                                      : 'show_more_data'
                                  }
                                >
                                  <div>
                                    <p className="description">
                                      {limitType[contactSources?.limit_type]
                                        ?.value === 0 ? (
                                        <>
                                          <span className="text_light">
                                            ALL
                                          </span>
                                        </>
                                      ) : limitType[contactSources?.limit_type]
                                          ?.value === 1 ? (
                                        <>
                                          <span className="text_light">
                                            {contactSources?.venue_restricted?.map(
                                              item => item?.internal_name,
                                            )}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text_primary">
                                            EXCEPT :{' '}
                                          </span>
                                          <span className="text_light">
                                            {contactSources?.venue_restricted?.map(
                                              item => item?.internal_name,
                                            )}
                                          </span>
                                        </>
                                      )}
                                    </p>
                                  </div>
                                  <span
                                    className="show_more text_primary"
                                    onClick={() =>
                                      expandHandleChange(
                                        contactSources._id,
                                        !contactSources.show_more,
                                        'active',
                                      )
                                    }
                                  >
                                    {(contactSources?.limit_type == 1 &&
                                      contactSources?.venue_restricted?.length >
                                        0) ||
                                    (contactSources?.limit_type == 2 &&
                                      contactSources?.venue_restricted?.length >
                                        0)
                                      ? contactSources?.show_more === false
                                        ? 'Show More'
                                        : 'Show Less'
                                      : ''}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      to={`/contact-sources/add-edit-contact-sources/${contactSources._id}`}
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
                                        suspendContactSources(contactSources)
                                      }
                                    >
                                      Suspend
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type="button"
                                      className="btn_border small"
                                      onClick={() => OpenDelete(contactSources)}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                </ul>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
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
                          activeContactSourcesList.flatMap(i => i.group_data)
                            ?.length,
                        )}{' '}
                        of{' '}
                        {
                          activeContactSourcesList.flatMap(i => i.group_data)
                            ?.length
                        }{' '}
                        entries
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
          <div className="table_main_Wrapper source_active_table mb-3">
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
                        Order
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('total_contact')}
                      >
                        Total Contacts
                      </span>
                    </TableCell>
                    <TableCell>Restricted to Venue/s</TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(contactSources => {
                    return (
                      <>
                        {contactSources?.is_cat ? (
                          <TableRow key={contactSources} className="full_row">
                            <TableCell colSpan={7}>
                              {contactSources?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell>
                              <span className="text_light">
                                {contactSources?.year
                                  ? contactSources?.year
                                  : 'Any'}
                              </span>
                            </TableCell>
                            <TableCell>{contactSources?.name}</TableCell>
                            <TableCell>
                              {contactSources?.show_online === false
                                ? 'No'
                                : 'Yes'}
                            </TableCell>
                            <TableCell>{contactSources?.order}</TableCell>
                            <TableCell>
                              <span className="text_light">
                                {contactSources?.totalContacts}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div
                                className={
                                  contactSources?.show_more
                                    ? 'show_more_data expanded'
                                    : 'show_more_data'
                                }
                              >
                                <div>
                                  <p className="description text_light">
                                    {limitType[contactSources?.limit_type]
                                      ?.value === 0 ? (
                                      <>
                                        <span className="text_light">ALL</span>
                                      </>
                                    ) : limitType[contactSources?.limit_type]
                                        ?.value === 1 ? (
                                      <>
                                        <span className="text_light">
                                          {contactSources?.venue_restricted?.map(
                                            item => item?.internal_name,
                                          )}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text_primary">
                                          EXCEPT :{' '}
                                        </span>
                                        <span className="text_light">
                                          {contactSources?.venue_restricted?.map(
                                            item => item?.internal_name,
                                          )}
                                        </span>
                                      </>
                                    )}
                                  </p>
                                </div>
                                <span
                                  className="show_more text_primary"
                                  onClick={() =>
                                    expandHandleChange(
                                      contactSources._id,
                                      !contactSources.show_more,
                                      'inActive',
                                    )
                                  }
                                >
                                  {(contactSources?.limit_type == 1 &&
                                    contactSources?.venue_restricted?.length >
                                      0) ||
                                  (contactSources?.limit_type == 2 &&
                                    contactSources?.venue_restricted?.length >
                                      0)
                                    ? contactSources?.show_more === false
                                      ? 'Show More'
                                      : 'Show Less'
                                    : ''}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <ul className="action_wrap">
                                <li>
                                  <Link
                                    to={`/contact-sources/add-edit-contact-sources/${contactSources._id}`}
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
                                      suspendContactSources(contactSources)
                                    }
                                  >
                                    Activate
                                  </button>
                                </li>
                                <li>
                                  <button
                                    type="button"
                                    className="btn_border small"
                                    onClick={() => OpenDelete(contactSources)}
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
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveContactSourcesList.flatMap(i => i.group_data)
                            ?.length,
                        )}{' '}
                        of{' '}
                        {
                          inActiveContactSourcesList.flatMap(i => i.group_data)
                            ?.length
                        }{' '}
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
        onClickDelete={deleteContactSourcesAccount}
        name="Are you sure you want to delete this source? Note: this cannot be undone"
      />
    </div>
  );
}
