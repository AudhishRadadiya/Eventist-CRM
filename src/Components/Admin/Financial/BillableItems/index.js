import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import useSortable from 'utils/useSortable';
import { useDispatch, useSelector } from 'react-redux';
import {
  Breadcrumbs,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Table,
  Stack,
  Paper,
  Pagination,
} from '@mui/material';

import Loader from 'Components/Common/Loader';
import DataNotFound from 'Components/Common/DataNotFound';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import {
  getBillableItemsListData,
  updateBillableItems,
  setIsBillableItemsUpdated,
} from 'store/reducers/Admin/Financial/billableItems.slice';

import EditIcon from '../../../../Assets/Img/edit.svg';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import useSortableAll from 'utils/useSortableAll';

let pageSize = 10;

export default function BillableItems() {
  const dispatch = useDispatch();
  const {
    activeBillableItemsList,
    inActiveBillableItemsList,
    billableItemsLoading,
    isBillableItemsUpdated,
  } = useSelector(({ billableItems }) => billableItems);
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const inActiveIndexOfLastItem = currentPage.inActiveCurrentPage * pageSize;
  const inActiveIndexOfFirstItem = inActiveIndexOfLastItem - pageSize;

  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);

  const OpenDelete = data => {
    setDeleteId(data);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteBillableAccount = () => {
    dispatch(
      updateBillableItems({
        _id: deleteId?._id,
        billableItems: {
          ...deleteId,
          deleted: !deleteId?.deleted,
        },
      }),
    );
  };
  const setCurrentBillableItemsHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeBillableItemsList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeBillableItemsList]);

  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveBillableItemsList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveBillableItemsList]);

  const { itemsActive, requestSortActive } = useSortableAll(
    activeBillableItemsList,
  );
  const { itemsInActive, requestSortInActive } = useSortableAll(
    inActiveBillableItemsList,
  );

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage?.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentBillableItemsHandler,
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
      setCurrentBillableItemsHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage?.inActiveCurrentPage]);

  useEffect(() => {
    dispatch(getBillableItemsListData());
  }, [dispatch]);

  useEffect(() => {
    if (isBillableItemsUpdated) {
      dispatch(getBillableItemsListData());
      dispatch(setIsBillableItemsUpdated(false));
    }
  }, [dispatch, isBillableItemsUpdated]);

  return (
    <div className="inner_wrapper">
      {billableItemsLoading && <Loader />}
      <div className="billable_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Financial</Typography>
            <Typography>Billable Items Types</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Event Billable Items</h1>
        </div>
        <div className="billable_wrap">
          <Link
            to="/billable-items/add-edit-billable-items"
            className="btn_primary small mb-3"
          >
            Add New Billable Item
          </Link>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper billable_active_table mb-3">
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
                      <span onClick={() => requestSortActive('tax_rate')}>
                        Tax Rate
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
                  {activeCurrentData?.map(elementBillable => {
                    return (
                      <TableRow key={elementBillable?._id}>
                        <TableCell>{elementBillable?.sku}</TableCell>
                        <TableCell>{elementBillable?.internal_name}</TableCell>
                        <TableCell>{elementBillable?.public_name}</TableCell>
                        <TableCell>
                          <span className="text_light">
                            {!!elementBillable?.tax_codes?.public_name
                              ? elementBillable?.tax_codes?.public_name
                              : '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {!!elementBillable?.order
                            ? elementBillable?.order
                            : '0'}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/billable-items/add-edit-billable-items/${elementBillable?._id}`}
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
                                    elementBillable,
                                    dispatch,
                                    updateBillableItems,
                                    'billableItems',
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
                                  OpenDelete(elementBillable);
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
                          activeBillableItemsList?.length,
                        )}{' '}
                        of {activeBillableItemsList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalActiveRecordPage}
                          page={currentPage?.activeCurrentPage}
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
          <div className="table_main_Wrapper parties_inactive_table mb-3">
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
                      <span onClick={() => requestSortInActive('tax_rate')}>
                        Tax Rate
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
                  {inActiveCurrentData?.map(elementBillable => {
                    return (
                      <TableRow key={elementBillable?._id}>
                        <TableCell>{elementBillable?.sku}</TableCell>
                        <TableCell>{elementBillable?.internal_name}</TableCell>
                        <TableCell>{elementBillable?.public_name}</TableCell>
                        <TableCell>
                          <span className="text_light">
                            {!!elementBillable?.tax_codes?.public_name
                              ? elementBillable?.tax_codes?.public_name
                              : '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {!!elementBillable?.order
                            ? elementBillable?.order
                            : '0'}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/billable-items/add-edit-billable-items/${elementBillable?._id}`}
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
                                    elementBillable,
                                    dispatch,
                                    updateBillableItems,
                                    'billableItems',
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
                                  OpenDelete(elementBillable);
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
              {inActiveCurrentData?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveBillableItemsList?.length,
                        )}{' '}
                        of {inActiveBillableItemsList?.length} entries
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
        onClickDelete={deleteBillableAccount}
        name="Are you sure you want to delete this billable item? Note: this cannot be undone"
      />
    </div>
  );
}
