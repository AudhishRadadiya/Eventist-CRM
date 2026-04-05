import { useEffect, useState, useMemo, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductListData,
  setIsProductUpdated,
  updateProduct,
} from 'store/reducers/Admin/Events/ProductCategory/product.slice';
import Loader from 'Components/Common/Loader';
import { getTotalPages } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import _ from 'lodash';
import useGroupSortable from 'utils/useGroupSortable';
import {
  getAllPageData2,
  getPageListData2,
} from '../../../../utils/gropingPagination';
import { FormControl, MenuItem, Select } from '@mui/material';
import { yearsArray } from 'utils/FieldValues';
import { Col, Row } from 'react-bootstrap';
import useGroupSortableAll from 'utils/useGroupSortableAll';

let pageSize = 10;

export default function EventParties() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [year, setYear] = useState('');

  const {
    activeProductList,
    inActiveProductList,
    isProductUpdated,
    productLoading,
  } = useSelector(({ product }) => product);
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

  const [activeAccountListArray, setActiveAccountListArray] = useState([]);
  const [inActiveAccountListArray, setInActiveAccountListArray] = useState([]);

  const [activeAllPageData, setActiveAllPageData] = useState([]);
  const [inActiveAllPageData, setInActiveAllPageData] = useState([]);

  useEffect(() => {
    if (activeProductList?.length > 0) {
      let dummyList = [];
      activeProductList.map(i => {
        dummyList.push({ catName: i.product_category, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData });
          return { ...groupData };
        });
        return dummyList;
      });
      setActiveAccountListArray(dummyList);
    }
  }, [activeProductList]);

  useEffect(() => {
    if (inActiveProductList?.length > 0) {
      let dummyList = [];
      inActiveProductList.map(i => {
        dummyList.push({ catName: i.product_category, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData });
          return { ...groupData };
        });
        return dummyList;
      });
      setInActiveAccountListArray(dummyList);
    }
  }, [inActiveProductList]);

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeProductList.flatMap(i => i.group_data),
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeProductList]);

  const totalInActiveRecordPage = useMemo(() => {
    const totalInActiveRecordCount = getTotalPages(
      inActiveProductList.flatMap(i => i.group_data),
      pageSize,
    );
    return totalInActiveRecordCount;
  }, [inActiveProductList]);

  const setCurrentPageHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  useEffect(() => {
    if (activeAccountListArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        activeAccountListArray,
        currentPage.activeCurrentPage,
        pageSize,
        totalActiveRecordPage,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
      setActiveAllPageData(currentDataList);
    }
  }, [activeAccountListArray, totalActiveRecordPage]);

  useEffect(() => {
    if (inActiveAccountListArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        inActiveAccountListArray,
        currentPage.inActiveCurrentPage,
        pageSize,
        totalInActiveRecordPage,
        setCurrentPageHandler,
        'inActiveCurrentPage',
      );
      setInActiveAllPageData(currentDataList);
    }
  }, [inActiveAccountListArray, totalInActiveRecordPage]);

  const { itemsActive, requestSortActive } = useGroupSortableAll(
    activeAccountListArray,
  );
  const { itemsInActive, requestSortInActive } = useGroupSortableAll(
    inActiveAccountListArray,
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
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }

    const yearData =
      Object.keys(params).length === 0 ? new Date().getFullYear() : params.year;
    setYear(yearData);
    dispatch(
      getProductListData({
        year: yearData === 'All' ? '' : yearData,
      }),
    );
  }, [location.search]);

  useEffect(() => {
    if (isProductUpdated) {
      dispatch(getProductListData());
      dispatch(setIsProductUpdated(false));
    }
  }, [dispatch, isProductUpdated]);

  const suspendProduct = product => {
    dispatch(
      updateProduct({
        _id: product._id,
        product: {
          ...product,
          category: product?.category,
          is_active: !product.is_active,
        },
      }),
    );
  };
  const OpenDelete = value => {
    setDeleteId(value);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };
  const deleteProductAccount = () => {
    let data = { ...deleteId };
    delete data['newAdd_to_kpis_report'];
    delete data['newrules'];
    dispatch(
      updateProduct({
        _id: deleteId._id,
        product: {
          ...deleteId,
          category: deleteId?.category,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };

  return (
    <div className="inner_wrapper">
      {productLoading && <Loader />}
      <div className="product_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events </Typography>
            <Typography>Products </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row className="align-items-center">
            <Col xs={3}>
              <h1>Event Products</h1>
            </Col>
            <Col>
              <div className="top_filter_wrap">
                <ul>
                  <li>
                    <div className="form-group inline mb-0 justify-content-end">
                      <span className="label">Year:</span>
                      <FormControl>
                        <Select
                          labelId="Year-label"
                          id="Year-select"
                          name="year"
                          value={year}
                          onChange={e => {
                            navigate(`/admin/products?year=${e.target.value}`);
                            // dispatch(
                            //   getProductListData({
                            //     year:
                            //       e.target.value === 'All'
                            //         ? ''
                            //         : e.target.value,
                            //   }),
                            // );
                          }}
                          defaultValue={new Date().getFullYear()}
                          className="select_wrap"
                        >
                          <MenuItem value="All">All year</MenuItem>
                          {yearsArray.map(item => {
                            return (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="product_wrap">
          <Link
            to="/admin/products/add-edit-products"
            className="btn_primary small mb-3"
          >
            Add New Product
          </Link>
          <h4>Current Products</h4>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper product_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('years')}>
                        Year
                      </span>
                    </TableCell>
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
                      <span onClick={() => requestSortActive('gross_price')}>
                        Price
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('is_exclusive')}>
                        Exclusive
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('bill_as')}>
                        Bill As
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortActive('add_to_kpis_report')}
                      >
                        KPL
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('newrules')}>
                        Rules
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map((product, index) => {
                    return (
                      <Fragment key={index}>
                        {product?.is_cat ? (
                          <TableRow className="full_row">
                            <TableCell colSpan={10}>
                              {product?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <Fragment>
                            {product?.catName && (
                              <TableRow>
                                <TableCell>{product?.catName}</TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>
                                <p className="w_300">
                                  {product?.years?.join(', ')}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p className="w_300">{product?.sku}</p>
                              </TableCell>
                              <TableCell>
                                <p className="w_300">
                                  {product?.internal_name}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p className="w_300">{product?.public_name}</p>
                              </TableCell>
                              <TableCell>
                                {`£${product?.gross_price} `}

                                {!product?.tax_code_data ||
                                product?.gross_price == 0 ||
                                product?.tax_code_data?.percentage == 0
                                  ? ''
                                  : `(£${product?.net_price?.toFixed(
                                      2,
                                    )} exl. tax @${product?.tax_code_data?.percentage?.toFixed(
                                      2,
                                    )}%)                                
                              `}
                              </TableCell>
                              <TableCell>
                                {product?.is_exclusive ? 'Yes' : 'No'}
                              </TableCell>
                              <TableCell>
                                {product?.billable_item_data?.internal_name
                                  ? product?.billable_item_data?.internal_name
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {product?.newAdd_to_kpis_report}
                              </TableCell>
                              <TableCell>
                                <p className="description">
                                  {product?.newrules?.length > 0
                                    ? product?.newrules?.join(', ')
                                    : '-'}
                                </p>
                              </TableCell>
                              <TableCell>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      to={`/admin/products/add-edit-products/${product._id}`}
                                      className="btn_edit"
                                    >
                                      <img src={EditIcon} alt="Edit Icon" />
                                    </Link>
                                  </li>
                                  {product?.product_in_use ? (
                                    <li>
                                      <Link
                                        to={`/reports/products-order-summary?productId=${product?._id}`}
                                        className="btn_success"
                                      >
                                        Product in use
                                      </Link>
                                    </li>
                                  ) : (
                                    <>
                                      <li>
                                        <button
                                          type="button"
                                          className="btn_warning"
                                          onClick={() => {
                                            let userObject = { ...product };
                                            delete userObject[
                                              'newAdd_to_kpis_report'
                                            ];
                                            delete userObject['newrules'];
                                            suspendProduct(product);
                                          }}
                                        >
                                          Suspend
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          type="button"
                                          className="btn_border small"
                                          onClick={() => OpenDelete(product)}
                                        >
                                          Delete
                                        </button>
                                      </li>
                                    </>
                                  )}
                                  <li>
                                    <Link
                                      to={`/admin/products/add-edit-products/${product._id}?clone=true`}
                                      className="btn_gray "
                                    >
                                      Clone
                                    </Link>
                                  </li>
                                </ul>
                              </TableCell>
                            </TableRow>
                          </Fragment>
                        )}
                      </Fragment>
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
                          activeProductList.flatMap(i => i.group_data)?.length,
                        )}{' '}
                        of{' '}
                        {activeProductList.flatMap(i => i.group_data)?.length}{' '}
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
          <div className="table_main_Wrapper product_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortInActive('years')}>
                        Year
                      </span>
                    </TableCell>
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
                      <span onClick={() => requestSortInActive('gross_price')}>
                        Price
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('is_exclusive')}>
                        Exclusive
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('bill_as')}>
                        Bill As
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortInActive('add_to_kpis_report')
                        }
                      >
                        KPL
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('newrules')}>
                        Rules
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map((product, index) => {
                    return (
                      <Fragment key={index}>
                        {product?.is_cat ? (
                          <TableRow className="full_row">
                            <TableCell colSpan={10}>
                              {product?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <Fragment>
                            {product?.catName && (
                              <TableRow>
                                <TableCell>{product?.catName}</TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>
                                <p className="w_300">
                                  {product?.years?.join(', ')}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p className="w_300">{product?.sku}</p>
                              </TableCell>
                              <TableCell>
                                <p className="w_300">
                                  {product?.internal_name}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p className="w_300">{product?.public_name}</p>
                              </TableCell>
                              <TableCell>
                                {' '}
                                {`£${product?.gross_price} `}
                                {!product?.tax_code_data ||
                                product?.gross_price == 0 ||
                                product?.tax_code_data?.percentage == 0
                                  ? ''
                                  : `(£${product?.net_price?.toFixed(
                                      2,
                                    )} exl. tax @${product?.tax_code_data?.percentage?.toFixed(
                                      2,
                                    )}%)                                
`}
                              </TableCell>
                              <TableCell>
                                {product?.is_exclusive ? 'Yes' : 'No'}
                              </TableCell>
                              <TableCell>
                                {product?.billable_item_data?.internal_name}
                              </TableCell>
                              <TableCell>
                                {product?.newAdd_to_kpis_report}
                              </TableCell>
                              <TableCell>
                                {product?.newrules?.join(', ')}
                              </TableCell>
                              <TableCell>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      to={`/admin/products/add-edit-products/${product._id}`}
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
                                        let userObject = { ...product };
                                        delete userObject[
                                          'newAdd_to_kpis_report'
                                        ];
                                        delete userObject['newrules'];
                                        suspendProduct(product);
                                      }}
                                    >
                                      Activate
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type="button"
                                      className="btn_border small"
                                      onClick={() => OpenDelete(product)}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                  <li>
                                    <Link
                                      to={`/admin/products/add-edit-products/${product._id}?clone=true`}
                                      className="btn_gray"
                                    >
                                      Clone
                                    </Link>
                                  </li>
                                </ul>
                              </TableCell>
                            </TableRow>
                          </Fragment>
                        )}
                      </Fragment>
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
                          inActiveProductList.flatMap(i => i.group_data)
                            ?.length,
                        )}{' '}
                        of{' '}
                        {inActiveProductList.flatMap(i => i.group_data)?.length}{' '}
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
        onClickDelete={deleteProductAccount}
        name="Are you sure you want to delete this product? Note: this cannot be undone"
      />
    </div>
  );
}
