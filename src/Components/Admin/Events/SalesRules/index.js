import { useState, useEffect, useMemo } from 'react';
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

import { optionsRule } from './AddEditSalesRules';
import {
  getSalesRulesListData,
  setIsSalesRulesUpdated,
  updateSalesRules,
} from 'store/reducers/Admin/Events/salesRules.slice';
import useSortable from 'utils/useSortable';
import Loader from 'Components/Common/Loader';
import DataNotFound from 'Components/Common/DataNotFound';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import DeletePopupModal from 'Components/Common/DeletePopupModal';

import EditIcon from '../../../../Assets/Img/edit.svg';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import useSortableAll from 'utils/useSortableAll';

let pageSize = 10;

export default function SalesRules() {
  const dispatch = useDispatch();
  const {
    activeSalesRulesList,
    inActiveSalesRulesList,
    isSalesRulesUpdated,
    salesRulesLoading,
  } = useSelector(({ salesRules }) => salesRules);

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

  const deleteSalesRulesAccount = () => {
    dispatch(
      updateSalesRules({
        _id: deleteId?._id,
        salesrules: { ...deleteId, deleted: !deleteId?.deleted },
      }),
    );
  };

  const setCurrentSalesRulesHandler = key => {
    setCurrentPage({ ...currentPage, [key]: currentPage[key] - 1 });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeSalesRulesList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeSalesRulesList]);

  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveSalesRulesList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveSalesRulesList]);

  const { itemsActive, requestSortActive } =
    useSortableAll(activeSalesRulesList);
  const { itemsInActive, requestSortInActive } = useSortableAll(
    inActiveSalesRulesList,
  );

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage?.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentSalesRulesHandler,
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
      setCurrentSalesRulesHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage?.inActiveCurrentPage]);

  useEffect(() => {
    dispatch(getSalesRulesListData());
  }, [dispatch]);

  useEffect(() => {
    if (isSalesRulesUpdated) {
      dispatch(getSalesRulesListData());
      dispatch(setIsSalesRulesUpdated(false));
    }
  }, [isSalesRulesUpdated, dispatch]);

  return (
    <div className="inner_wrapper">
      {salesRulesLoading && <Loader />}
      <div className="salesrules_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Financial</Typography>
            <Typography>Sales Rules</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Event Sales Rules</h1>
        </div>
        <div className="salesrules_wrap">
          <Link
            to="/sales-rules/add-edit-sales-rules"
            className="btn_primary small mb-3"
          >
            Add New Sales Rule
          </Link>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper salesrule_active_table mb-3">
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
                      <span onClick={() => requestSortActive('rule')}>
                        Rule
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(elementSales => {
                    return (
                      <TableRow key={elementSales?._id}>
                        <TableCell>{elementSales?.sku}</TableCell>
                        <TableCell>{elementSales?.public_name}</TableCell>
                        <TableCell>
                          <p className="w_400">
                            {!!elementSales?.description
                              ? elementSales?.description
                              : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {optionsRule[elementSales?.rule]?.value}
                          {parseInt(elementSales?.round) === 1
                            ? ' (round down)'
                            : parseInt(elementSales?.round) === 2
                            ? ' (round to closest)'
                            : !parseInt(elementSales?.round)
                            ? ' (round up)'
                            : ''}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/sales-rules/add-edit-sales-rules/${elementSales?._id}`}
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
                                    elementSales,
                                    dispatch,
                                    updateSalesRules,
                                    'salesrules',
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
                                  OpenDelete(elementSales);
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
                          activeSalesRulesList?.length,
                        )}{' '}
                        of {activeSalesRulesList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalActiveRecordPage}
                          page={currentPage?.activeCurrentPage}
                          onChange={(e, Page) => {
                            setCurrentPage({
                              ...currentPage,
                              activeCurrentPage: Page,
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
          <div className="table_main_Wrapper salesrule_inactive_table mb-3">
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
                      <span onClick={() => requestSortInActive('rule')}>
                        Rule
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(elementSales => {
                    return (
                      <TableRow key={elementSales?._id}>
                        <TableCell>{elementSales?.sku}</TableCell>
                        <TableCell>{elementSales?.public_name}</TableCell>
                        <TableCell>
                          <p className="w_400">
                            {!!elementSales?.description
                              ? elementSales?.description
                              : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {optionsRule[elementSales?.rule]?.value}
                          {parseInt(elementSales?.round) === 1
                            ? ' (round down)'
                            : parseInt(elementSales?.round) === 2
                            ? ' (round to closest)'
                            : !parseInt(elementSales?.round)
                            ? ' (round up)'
                            : ''}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/sales-rules/add-edit-sales-rules/${elementSales?._id}`}
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
                                    elementSales,
                                    dispatch,
                                    updateSalesRules,
                                    'salesrules',
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
                                  OpenDelete(elementSales);
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
                          inActiveSalesRulesList?.length,
                        )}{' '}
                        of {inActiveSalesRulesList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalInActiveRecordPage}
                          page={currentPage?.inActiveCurrentPage}
                          onChange={(e, Page) => {
                            setCurrentPage({
                              ...currentPage,
                              inActiveCurrentPage: Page,
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
        onClickDelete={deleteSalesRulesAccount}
        name="Are you sure you want to delete this tax code? Note: this cannot be undone"
      />
    </div>
  );
}
