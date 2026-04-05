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
import { getTotalPages, getPaginationData, suspendHandler } from 'utils/common';
import { Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import {
  getTransactionalMailListData,
  setIsTransactionalMailUpdated,
  updatetTransactionalMail,
} from 'store/reducers/Admin/Mail/mail.slice';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import useSortable from 'utils/useSortable';
import DataNotFound from 'Components/Common/DataNotFound';

let pageSize = 10;

const getAvailability = type => {
  switch (type) {
    case 0:
      return 'Booking';
    case 1:
      return 'Payment';
    case 2:
      return 'Web';
    case 3:
      return 'Contact';
    case 4:
      return 'Billables';
    case 5:
      return 'Invoice';
    case 6:
      return 'Anywhere';
    default:
      return null;
  }
};

export default function TransactionalEmails() {
  const dispatch = useDispatch();

  const {
    activeTransactionalMailList,
    inActiveTransactionalMailList,
    transactionMailLoading,
    isTransactionalMailUpdated,
  } = useSelector(({ transactionalMail }) => transactionalMail);

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
    dispatch(getTransactionalMailListData());
  }, [dispatch]);

  useEffect(() => {
    if (isTransactionalMailUpdated) {
      dispatch(getTransactionalMailListData());
      dispatch(setIsTransactionalMailUpdated(false));
    }
  }, [dispatch, isTransactionalMailUpdated]);

  const OpenDelete = value => {
    setDeleteId(value);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteTransactionalMailAccount = () => {
    let data = { ...deleteId };
    delete data['newAvailability'];
    dispatch(
      updatetTransactionalMail({
        _id: data._id,
        transactionalMail: {
          ...data,
          deleted: !data.deleted,
        },
      }),
    );
  };

  const setCurrentTransactionMailHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeTransactionalMailList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeTransactionalMailList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveTransactionalMailList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveTransactionalMailList]);

  const { itemsActive, requestSortActive } = useSortable(
    activeTransactionalMailList,
  );
  const { itemsInActive, requestSortInActive } = useSortable(
    inActiveTransactionalMailList,
  );

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentTransactionMailHandler,
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
      setCurrentTransactionMailHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage.inActiveCurrentPage]);

  return (
    <div className="inner_wrapper">
      {transactionMailLoading && <Loader />}
      <div className="transactional_mails_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Mail</Typography>
            <Typography>Transactional Emails</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Event Transactional Emails</h1>
        </div>
        <div className="transactional_mails_wrap">
          <Link
            to="/transactional-emails/add-edit-transactional-emails"
            className="btn_primary small mb-3"
          >
            Add New Email Templates
          </Link>
          <h4>Current Email Templates</h4>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper transactional_mails_active_table vertical_top mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('sku')}>SKU</span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('subject')}>
                        Subject
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('description')}>
                        Desciption
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('availability')}>
                        Availability
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(transactionalMail => {
                    return (
                      <TableRow>
                        <TableCell>{transactionalMail?.sku}</TableCell>
                        <TableCell>
                          <p className="description">
                            {transactionalMail?.name}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="description">
                            {transactionalMail.subject}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="description">
                            {transactionalMail.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="description">
                            {getAvailability(transactionalMail?.availability)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/transactional-emails/add-edit-transactional-emails/${transactionalMail._id}`}
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
                                  let data = { ...transactionalMail };
                                  delete data['newAvailability'];
                                  suspendHandler(
                                    data,
                                    dispatch,
                                    updatetTransactionalMail,
                                    'transactionalMail',
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
                                  OpenDelete(transactionalMail);
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
                          activeTransactionalMailList?.length,
                        )}{' '}
                        of {activeTransactionalMailList?.length} entries
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
          <div className="table_main_Wrapper transactional_mails_inactive_table mb-3">
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
                      <span onClick={() => requestSortInActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('subject')}>
                        Subject
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('description')}>
                        Desciption
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('availability')}>
                        Availability
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(transactionalMail => {
                    return (
                      <TableRow>
                        <TableCell>{transactionalMail.sku}</TableCell>
                        <TableCell>
                          <p className="description">
                            {transactionalMail.name}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="description">
                            {transactionalMail.subject}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="description">
                            {transactionalMail.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="description">
                            {getAvailability(transactionalMail?.availability)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/transactional-emails/add-edit-transactional-emails/${transactionalMail._id}`}
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
                                  let data = { ...transactionalMail };
                                  delete data['newAvailability'];
                                  suspendHandler(
                                    data,
                                    dispatch,
                                    updatetTransactionalMail,
                                    'transactionalMail',
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
                                  OpenDelete(transactionalMail);
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
              {inActiveCurrentData?.length ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveTransactionalMailList?.length,
                        )}{' '}
                        of {inActiveTransactionalMailList?.length} entries
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
        onClickDelete={deleteTransactionalMailAccount}
        name="Are you sure you want to delete this email template? Note: this cannot be undone"
      />
    </div>
  );
}
