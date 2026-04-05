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
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';

import Loader from 'Components/Common/Loader';
import {
  getTaxCodesListData,
  setIsTaxCodesUpdated,
  updateTaxCodes,
} from 'store/reducers/Admin/Financial/taxCodes.slice';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import DataNotFound from 'Components/Common/DataNotFound';

import EditIcon from '../../../../Assets/Img/edit.svg';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import useSortableAll from 'utils/useSortableAll';

let pageSize = 10;

export default function TaxCodes() {
  const dispatch = useDispatch();
  const {
    taxCodesLoading,
    activeTaxCodesList,
    inActiveTaxCodesList,
    isTaxCodesUpdated,
  } = useSelector(({ taxCodes }) => taxCodes);
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

  const deleteTaxCodesAccount = () => {
    dispatch(
      updateTaxCodes({
        _id: deleteId?._id,
        taxCode: { ...deleteId, deleted: !deleteId?.deleted },
      }),
    );
  };

  const setCurrentTaxCodesHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(activeTaxCodesList, pageSize);
    return totalActiveRecordCount;
  }, [activeTaxCodesList]);

  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveTaxCodesList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveTaxCodesList]);

  const { itemsActive, requestSortActive } = useSortableAll(activeTaxCodesList);
  const { itemsInActive, requestSortInActive } =
    useSortableAll(inActiveTaxCodesList);

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage?.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentTaxCodesHandler,
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
      setCurrentTaxCodesHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage?.inActiveCurrentPage]);

  useEffect(() => {
    dispatch(getTaxCodesListData());
  }, [dispatch]);

  useEffect(() => {
    if (isTaxCodesUpdated) {
      dispatch(getTaxCodesListData());
      dispatch(setIsTaxCodesUpdated(false));
    }
  }, [isTaxCodesUpdated, dispatch]);

  return (
    <div className="inner_wrapper">
      {taxCodesLoading && <Loader />}
      <div className="taxcode_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Financial</Typography>
            <Typography>Tax Codes</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Current Tax Codes</h1>
        </div>
        <div className="taxcode_wrap">
          <Link
            to="/tax-codes/add-edit-tax-codes"
            className="btn_primary small mb-3"
          >
            Add New Tax Code
          </Link>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper taxcode_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('sku')}>SKU</span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('public_name')}>
                        Public Name
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      <span onClick={() => requestSortActive('description')}>
                        Description
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('percentage')}>
                        Percentage
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(elementCode => (
                    <TableRow key={elementCode?._id}>
                      <TableCell>{elementCode?.sku}</TableCell>
                      <TableCell>{elementCode?.public_name}</TableCell>
                      <TableCell>
                        <p className="w_400">
                          {!!elementCode?.description
                            ? elementCode?.description
                            : '-'}
                        </p>
                      </TableCell>
                      <TableCell>
                        {!!elementCode?.percentage
                          ? elementCode?.percentage?.toString()?.length < 2
                            ? `0${elementCode?.percentage?.toFixed(2)}%`
                            : `${elementCode?.percentage?.toFixed(2)}%`
                          : '00.00%'}
                      </TableCell>
                      <TableCell>
                        <ul className="action_wrap">
                          <li>
                            <Link
                              to={`/tax-codes/add-edit-tax-codes/${elementCode?._id}`}
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
                                  elementCode,
                                  dispatch,
                                  updateTaxCodes,
                                  'taxCode',
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
                              onClick={() => OpenDelete(elementCode)}
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
                          activeTaxCodesList?.length,
                        )}{' '}
                        of {activeTaxCodesList?.length} entries
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
                      <span onClick={() => requestSortInActive('public_name')}>
                        Public Name
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      <span onClick={() => requestSortInActive('description')}>
                        Description
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('percentage')}>
                        Percentage
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(elementCodes => {
                    return (
                      <TableRow key={elementCodes?._id}>
                        <TableCell>{elementCodes?.sku}</TableCell>
                        <TableCell>{elementCodes?.public_name}</TableCell>
                        <TableCell>
                          <p className="w_400">
                            {elementCodes?.description
                              ? elementCodes?.description
                              : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {!!elementCodes?.percentage
                            ? elementCodes?.percentage?.toString()?.length < 2
                              ? `0${elementCodes?.percentage?.toFixed(2)}%`
                              : `${elementCodes?.percentage?.toFixed(2)}%`
                            : '00.00%'}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/tax-codes/add-edit-tax-codes/${elementCodes?._id}`}
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
                                    elementCodes,
                                    dispatch,
                                    updateTaxCodes,
                                    'taxCode',
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
                                onClick={() => OpenDelete(elementCodes)}
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
                          inActiveTaxCodesList?.length,
                        )}{' '}
                        of {inActiveTaxCodesList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalInActiveRecordPage}
                          page={currentPage?.inActiveCurrentPage}
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
        onClickDelete={deleteTaxCodesAccount}
        name="Are you sure you want to delete this tax code? Note: this cannot be undone"
      />
    </div>
  );
}
