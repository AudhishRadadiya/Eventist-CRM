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
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import {
  getPaymentOptionsListData,
  setIsPaymentOptionsUpdated,
  updatePaymentOptions,
} from 'store/reducers/Admin/Financial/paymentOptions.slice';

import EditIcon from '../../../../Assets/Img/edit.svg';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import useSortableAll from 'utils/useSortableAll';

let pageSize = 10;

export default function PaymentOptions() {
  const dispatch = useDispatch();
  const {
    paymentOptionsLoading,
    activePaymentOptionsList,
    inActivePaymentOptionsList,
    isPaymentOptionsUpdated,
  } = useSelector(({ paymentOptions }) => paymentOptions);

  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

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

  const deletePaymentOptionsAccount = () => {
    dispatch(
      updatePaymentOptions({
        _id: deleteId?._id,
        paymentOption: {
          ...deleteId,
          deleted: !deleteId?.deleted,
        },
      }),
    );
  };

  const setCurrentPaymentOptionsHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activePaymentOptionsList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activePaymentOptionsList]);

  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActivePaymentOptionsList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActivePaymentOptionsList]);

  const { itemsActive, requestSortActive } = useSortableAll(
    activePaymentOptionsList,
  );
  const { itemsInActive, requestSortInActive } = useSortableAll(
    inActivePaymentOptionsList,
  );

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage?.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentPaymentOptionsHandler,
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
      setCurrentPaymentOptionsHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage?.inActiveCurrentPage]);

  useEffect(() => {
    dispatch(getPaymentOptionsListData());
  }, [dispatch]);

  useEffect(() => {
    if (isPaymentOptionsUpdated) {
      dispatch(getPaymentOptionsListData());
      dispatch(setIsPaymentOptionsUpdated(false));
    }
  }, [dispatch, isPaymentOptionsUpdated]);

  return (
    <div className="inner_wrapper">
      {paymentOptionsLoading && <Loader />}
      <div className="paymentoption_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Financial</Typography>
            <Typography>Payment Options</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Current Payment Options</h1>
        </div>
        <div className="paymentoption_wrap">
          <Link
            to="/payment-options/add-edit-payment-options"
            className="btn_primary small mb-3"
          >
            Add New Payment Option
          </Link>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper paymentoption_active_table mb-3">
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
                    <TableCell>
                      <span
                        onClick={() => requestSortActive('payment_channel')}
                      >
                        Channel
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('order')}>
                        Order
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(elementPayment => (
                    <TableRow key={elementPayment?._id}>
                      <TableCell>{elementPayment?.sku}</TableCell>
                      <TableCell>{elementPayment?.internal_name}</TableCell>
                      <TableCell>{elementPayment?.public_name}</TableCell>
                      <TableCell>
                        {!!elementPayment?.payment_channel
                          ? elementPayment?.payment_channel
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {!!elementPayment?.order ? elementPayment?.order : '0'}
                      </TableCell>
                      <TableCell>
                        <ul className="action_wrap">
                          <li>
                            <Link
                              to={`/payment-options/add-edit-payment-options/${elementPayment?._id}`}
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
                                  elementPayment,
                                  dispatch,
                                  updatePaymentOptions,
                                  'paymentOption',
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
                                OpenDelete(elementPayment);
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
              {activeCurrentData?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          activeIndexOfLastItem,
                          activePaymentOptionsList?.length,
                        )}{' '}
                        of {activePaymentOptionsList.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalActiveRecordPage}
                          page={currentPage?.activeCurrentPage}
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
          <div className="table_main_Wrapper paymentoption_inactive_table mb-3">
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
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('payment_channel')}
                      >
                        Channel
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('order')}>
                        Order
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(elementPayment => (
                    <TableRow key={elementPayment?._id}>
                      <TableCell>{elementPayment?.sku}</TableCell>
                      <TableCell>{elementPayment?.internal_name}</TableCell>
                      <TableCell>{elementPayment?.public_name}</TableCell>
                      <TableCell>
                        {!!elementPayment?.payment_channel
                          ? elementPayment?.payment_channel
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {!!elementPayment?.order ? elementPayment?.order : '-'}
                      </TableCell>
                      <TableCell>
                        <ul className="action_wrap">
                          <li>
                            <Link
                              to={`/payment-options/add-edit-payment-options/${elementPayment?._id}`}
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
                                  elementPayment,
                                  dispatch,
                                  updatePaymentOptions,
                                  'paymentOption',
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
                                OpenDelete(elementPayment);
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
                          inActivePaymentOptionsList?.length,
                        )}{' '}
                        of {inActivePaymentOptionsList?.length} entries
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
        onClickDelete={deletePaymentOptionsAccount}
        name="Are you sure you want to delete this payment option? Note: this cannot be undone"
      />
    </div>
  );
}
