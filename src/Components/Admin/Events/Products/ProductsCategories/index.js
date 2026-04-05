import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../../Assets/Img/home-breadcrumbs.svg';
import EditIcon from '../../../../../Assets/Img/edit.svg';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductCategoryListData,
  setIsProductCategoryUpdated,
  updateProductCategory,
} from 'store/reducers/Admin/Events/ProductCategory/productCategory.slice';
import useSortable from 'utils/useSortable';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import Loader from 'Components/Common/Loader';
import { getTotalPages, getPaginationData, suspendHandler } from 'utils/common';
import { Pagination } from '@mui/material';
import DataNotFound from 'Components/Common/DataNotFound';
import { yearsArray } from 'utils/FieldValues';

let pageSize = 10;

export default function ProductsCategories() {
  const dispatch = useDispatch();
  const {
    isProductCategoryUpdated,
    activeProductCategoryList,
    inActiveProductCategoryList,
    productCategoryLoading,
  } = useSelector(({ productCategory }) => productCategory);

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

  const [Year, setYear] = useState('SelectYear');

  const YearhandleChange = event => {
    setYear(event.target.value);
  };

  useEffect(() => {
    dispatch(getProductCategoryListData());
  }, [dispatch]);

  useEffect(() => {
    if (isProductCategoryUpdated) {
      dispatch(getProductCategoryListData());
      dispatch(setIsProductCategoryUpdated(false));
    }
  }, [dispatch, isProductCategoryUpdated]);

  const OpenDelete = value => {
    setDeleteId(value);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };
  const deleteProductCategoryAccount = () => {
    dispatch(
      updateProductCategory({
        _id: deleteId._id,
        productCategory: {
          ...deleteId,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };

  const setCurrentProductCategoryHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeProductCategoryList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeProductCategoryList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveProductCategoryList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveProductCategoryList]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      activeProductCategoryList,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentProductCategoryHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [activeProductCategoryList, currentPage.activeCurrentPage]);

  const inActiveCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      inActiveProductCategoryList,
      currentPage.inActiveCurrentPage,
      pageSize,
      totalInActiveRecordPage,
      setCurrentProductCategoryHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [inActiveProductCategoryList, currentPage.inActiveCurrentPage]);

  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);
  const { itemsInActive, requestSortInActive } =
    useSortable(inActiveCurrentData);

  return (
    <div className="inner_wrapper">
      {productCategoryLoading && <Loader />}
      <div className="productctg_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Event</Typography>
            <Link to="/admin/products">Products</Link>
            <Typography>Category</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row>
            <Col xs={6}>
              <h1>Event Product Categories</h1>
            </Col>
            <Col xs={6}>
              <div className="d-flex align-items-center justify-content-end">
                <span className="me-2 text_small">Year:</span>
                <FormControl fullWidth className="w-25">
                  <Select
                    labelId="Year"
                    id="Year"
                    value={Year}
                    onChange={YearhandleChange}
                    defaultValue="SelectCategory"
                    className="input_wrap select_wrap"
                  >
                    <MenuItem value="SelectYear" disabled>
                      Select Year
                    </MenuItem>
                    {yearsArray?.map(item => {
                      return (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </Col>
          </Row>
        </div>
        <div className="venues_wrap">
          <Link
            to="/admin/products/add-edit-products-categories"
            className="btn_primary small mb-3"
          >
            Add New Product Category
          </Link>
          <h4>Current Product Categories</h4>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper productctg_active_table mb-3">
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
                      <span onClick={() => requestSortActive('description')}>
                        Notes
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsActive?.map(productCategory => {
                    return (
                      <TableRow key={productCategory._id}>
                        <TableCell>{productCategory?.sku}</TableCell>
                        <TableCell>{productCategory?.internal_name}</TableCell>
                        <TableCell>{productCategory?.public_name}</TableCell>
                        <TableCell>
                          {productCategory?.description
                            ? productCategory?.description
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/admin/products/add-edit-products-categories/${productCategory._id}`}
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
                                    productCategory,
                                    dispatch,
                                    updateProductCategory,
                                    'productCategory',
                                  )
                                }
                              >
                                Suspend
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_border small"
                                onClick={() => OpenDelete(productCategory)}
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
              {itemsActive?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          activeIndexOfLastItem,
                          activeProductCategoryList?.length,
                        )}{' '}
                        of {activeProductCategoryList?.length} entries
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
          <div className="table_main_Wrapper productctg_inactive_table mb-3">
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
                      <span onClick={() => requestSortInActive('description')}>
                        Notes
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsInActive?.map(productCategory => {
                    return (
                      <TableRow key={productCategory?._id}>
                        <TableCell>{productCategory?.sku}</TableCell>
                        <TableCell>{productCategory?.internal_name}</TableCell>
                        <TableCell>{productCategory?.public_name}</TableCell>
                        <TableCell>
                          {productCategory?.description
                            ? productCategory?.description
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/admin/products/add-edit-products-categories/${productCategory._id}`}
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
                                    productCategory,
                                    dispatch,
                                    updateProductCategory,
                                    'productCategory',
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
                                onClick={() => OpenDelete(productCategory)}
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
              {itemsInActive?.length ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveProductCategoryList?.length,
                        )}{' '}
                        of {inActiveProductCategoryList?.length} entries
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
        onClickDelete={deleteProductCategoryAccount}
        name="Are you sure you want to delete this product_cat? Note: this cannot be undone"
      />
    </div>
  );
}
