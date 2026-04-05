import { useEffect, useState, useMemo } from 'react';
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
  getCouponListData,
  setIsCouponUpdated,
  updateCoupon,
} from 'store/reducers/Admin/Events/Coupon/Coupons/coupon.slice';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import moment from 'moment';
import useSortable from 'utils/useSortable';
import Loader from 'Components/Common/Loader';
import { getPaginationData, getTotalPages, suspendHandler } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import { getAvailaleEvent } from 'store/reducers/Admin/Events/ProductCategory/product.slice';
import ShowMoreHandler from 'Components/Common/ShowMoreHandler';
import ShowMoreInitializer from 'Components/Common/ShowMoreInitializer';

let pageSize = 10;

export default function Coupons() {
  const dispatch = useDispatch();
  const [check, setCheck] = useState([]);
  const [checkInActive, setCheckInActive] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const {
    isCouponUpdated,
    activeCouponList,
    inActiveCouponList,
    couponLoading,
  } = useSelector(({ coupon }) => coupon);

  const { availableAtEvent } = useSelector(({ product }) => product);
  const [couponList, setCouponList] = useState([]);
  const [inActivecoupons, setInActiveCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });
  const [sortType, setSortType] = useState({
    ascYear: true,
    ascSKU: true,
    ascInternal_name: true,
    ascActive_from: true,
    ascExpires_after: true,
    ascPaydeposit: true,
    ascPublic_description: true,
    ascAutoProcess: true,
  });
  const [inActivesortType, setInActiveSortType] = useState({
    ascYear: true,
    ascSKU: true,
    ascInternal_name: true,
    ascActive_from: true,
    ascExpires_after: true,
    ascPaydeposit: true,
    ascPublic_description: true,
    ascAutoProcess: true,
  });
  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const inActiveIndexOfLastItem = currentPage.inActiveCurrentPage * pageSize;
  const inActiveIndexOfFirstItem = inActiveIndexOfLastItem - pageSize;

  useEffect(() => {
    dispatch(getCouponListData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAvailaleEvent());
  }, [dispatch]);

  useEffect(() => {
    if (isCouponUpdated) {
      dispatch(getCouponListData());
      dispatch(setIsCouponUpdated(false));
    }
  }, [dispatch, isCouponUpdated]);
  useEffect(() => {
    setCouponList(activeCouponList);
    setInActiveCoupons(inActiveCouponList);
  }, [activeCouponList, inActiveCouponList]);

  const OpenDelete = value => {
    setDeleteId(value);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };
  const deleteCouponAccount = () => {
    let data = { ...deleteId };
    delete data['newAvailable_at_events'];
    delete data['newCoupon_type'];

    dispatch(
      updateCoupon({
        _id: deleteId._id,
        coupon: {
          ...data,
          deleted: !data.deleted,
        },
      }),
    );
  };

  const setCurrentCouponHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(couponList, pageSize);
    return totalActiveRecordCount;
  }, [couponList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(inActivecoupons, pageSize);
    return totalActiveRecordCount;
  }, [inActivecoupons]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      couponList,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentCouponHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [couponList, currentPage.activeCurrentPage]);

  const inActiveCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      inActivecoupons,
      currentPage.inActiveCurrentPage,
      pageSize,
      totalInActiveRecordPage,
      setCurrentCouponHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [inActivecoupons, currentPage.inActiveCurrentPage]);

  const { itemsActive, requestSortActive } = useSortable(check);
  const { itemsInActive, requestSortInActive } = useSortable(checkInActive);
  return (
    <div className="inner_wrapper">
      {couponLoading && <Loader />}
      <div className="coupons_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Typography>Coupons</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Event Coupons</h1>
        </div>
        <div className="coupons_wrap">
          <Link
            to="/coupons/add-edit-coupons"
            className="btn_primary small mb-3"
          >
            Add New Coupon
          </Link>
          <h4>Current Coupons</h4>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper coupon_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span
                        onClick={() => {
                          setCouponList(
                            couponList
                              .slice()
                              .sort((a, b) =>
                                sortType.ascYear
                                  ? b.year - a.year
                                  : a.year - b.year,
                              ),
                          );
                          setSortType({
                            ...sortType,
                            ascYear: !sortType.ascYear,
                          });
                        }}
                      >
                        Year
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setCouponList(
                            couponList
                              .slice()
                              .sort((a, b) =>
                                sortType.ascSKU
                                  ? b?.sku.localeCompare(a?.sku)
                                  : a?.sku.localeCompare(b?.sku),
                              ),
                          );
                          setSortType({
                            ...sortType,
                            ascSKU: !sortType.ascSKU,
                          });
                        }}
                      >
                        SKU
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setCouponList(
                            couponList
                              .slice()
                              .sort((a, b) =>
                                sortType.ascInternal_name
                                  ? b?.internal_name.localeCompare(
                                      a?.internal_name,
                                    )
                                  : a?.internal_name.localeCompare(
                                      b?.internal_name,
                                    ),
                              ),
                          );
                          setSortType({
                            ...sortType,
                            ascInternal_name: !sortType.ascInternal_name,
                          });
                        }}
                      >
                        Internal Name
                      </span>
                    </TableCell>
                    <TableCell>Events</TableCell>
                    <TableCell
                      onClick={() => {
                        setCouponList(
                          couponList
                            .slice()
                            .sort((a, b) =>
                              sortType.ascActive_from
                                ? moment(b.active_from) - moment(a.active_from)
                                : moment(a.active_from) - moment(b.active_from),
                            ),
                        );
                        setSortType({
                          ...sortType,
                          ascActive_from: !sortType.ascActive_from,
                        });
                      }}
                    >
                      <span>Starts</span>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setCouponList(
                          couponList
                            .slice()
                            .sort((a, b) =>
                              sortType.ascExpires_after
                                ? b.year - a.year
                                : a.year - b.year,
                            ),
                        );
                        setSortType({
                          ...sortType,
                          ascExpires_after: !sortType.ascExpires_after,
                        });
                      }}
                    >
                      <span>Expires After</span>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setCouponList(
                          couponList
                            .slice()
                            .sort((a, b) =>
                              sortType.ascPaydeposit
                                ? b.year - a.year
                                : a.year - b.year,
                            ),
                        );
                        setSortType({
                          ...sortType,
                          ascPaydeposit: !sortType.ascPaydeposit,
                        });
                      }}
                    >
                      <span>Pay Deposit By</span>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setCouponList(
                          couponList
                            .slice()
                            .sort((a, b) =>
                              sortType.ascPublic_description
                                ? b?.public_description.localeCompare(
                                    a?.public_description,
                                  )
                                : a?.public_description.localeCompare(
                                    b?.public_description,
                                  ),
                            ),
                        );
                        setSortType({
                          ...sortType,
                          ascPublic_description:
                            !sortType.ascPublic_description,
                        });
                      }}
                    >
                      <span>Description</span>
                    </TableCell>
                    <TableCell
                      onClick={() => requestSortActive('internal_use_only')}
                    >
                      <span>Internal</span>
                    </TableCell>
                    <TableCell onClick={() => requestSortActive('coupon_type')}>
                      <span>Type</span>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setCouponList(
                          couponList
                            .slice()
                            .sort((a, b) =>
                              sortType.ascAutoProcess
                                ? (b.percentage_discount || 0) -
                                  (a.percentage_discount || 0)
                                : (a.percentage_discount || 0) -
                                  (b.percentage_discount || 0),
                            ),
                        );
                        setSortType({
                          ...sortType,
                          ascAutoProcess: !sortType.ascAutoProcess,
                        });
                      }}
                    >
                      <span>Auto Process</span>
                    </TableCell>
                    <TableCell>View Usage</TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsActive.map((coupon, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{coupon?.year}</TableCell>
                        <TableCell>{coupon?.sku}</TableCell>
                        <TableCell>
                          <p className="w_300">{coupon?.internal_name}</p>
                        </TableCell>
                        <TableCell>
                          {
                            availableAtEvent?.length ===
                            coupon?.newAvailable_at_events?.length ? (
                              'ALL'
                            ) : (
                              <div
                                className={
                                  coupon?.show_more
                                    ? 'show_more_data expanded'
                                    : 'show_more_data'
                                }
                              >
                                <p className="description">
                                  {coupon?.newAvailable_at_events}
                                </p>
                                <ShowMoreHandler
                                  check={check}
                                  setCheck={setCheck}
                                  _id={coupon._id}
                                  toggle={coupon.show_more}
                                  elementData={coupon?.newAvailable_at_events}
                                />
                              </div>
                            )
                            /*  coupon?.newAvailable_at_events.join(', ') */
                          }
                        </TableCell>
                        <TableCell>
                          <span className="date_wrapper">
                            {coupon?.active_from
                              ? moment(coupon?.active_from).format(
                                  'dddd Do MMM YYYY',
                                )
                              : ''}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="date_wrapper">
                            {moment(new Date()).format('YYYY/MM/DD') >
                            moment(coupon?.expires_after).format('YYYY/MM/DD')
                              ? 'Expired'
                              : moment(coupon?.expires_after).format(
                                  'dddd MMM Do YYYY',
                                )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="date_wrapper">
                            {coupon?.deposits_required_by == null
                              ? 'Any Time'
                              : moment(coupon?.deposits_required_by).format(
                                  'dddd MMM Do YYYY',
                                )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <p className="description">
                            {coupon?.public_description
                              ? coupon?.public_description
                              : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {coupon?.internal_use_only ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell>{coupon?.newCoupon_type}</TableCell>
                        <TableCell>
                          {coupon?.auto_process_coupon ? 'Yes' : 'No'}
                          {coupon?.newCoupon_type?.toLowerCase() == 'discount'
                            ? coupon?.percentage_discount == null
                              ? ' '
                              : ` / ` +
                                coupon?.percentage_discount?.toFixed(2) +
                                `%`
                            : ''}
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/reports/coupons-report?date=${coupon?.expires_after}&id=${coupon?._id}&year=${coupon?.year}&coupon=true`}
                            className="text_primary"
                          >
                            View Report
                          </Link>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/coupons/add-edit-coupons/${coupon._id}`}
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
                                  let userObject = { ...coupon };
                                  delete userObject['newAvailable_at_events'];
                                  delete userObject['newCoupon_type'];
                                  suspendHandler(
                                    userObject,
                                    dispatch,
                                    updateCoupon,
                                    'coupon',
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
                                onClick={() => OpenDelete(coupon)}
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
                          activeCouponList?.length,
                        )}{' '}
                        of {activeCouponList?.length} entries
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

          <h5 className="text_primary">inactive :</h5>
          <div className="table_main_Wrapper coupon_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span
                        onClick={() => {
                          setInActiveCoupons(
                            inActivecoupons
                              .slice()
                              .sort((a, b) =>
                                inActivesortType.ascYear
                                  ? b.year - a.year
                                  : a.year - b.year,
                              ),
                          );
                          setInActiveSortType({
                            ...inActivesortType,
                            ascYear: !inActivesortType.ascYear,
                          });
                        }}
                      >
                        Year
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setInActiveCoupons(
                            inActivecoupons
                              .slice()
                              .sort((a, b) =>
                                inActivesortType.ascSKU
                                  ? b?.sku.localeCompare(a?.sku)
                                  : a?.sku.localeCompare(b?.sku),
                              ),
                          );
                          setInActiveSortType({
                            ...inActivesortType,
                            ascSKU: !inActivesortType.ascSKU,
                          });
                        }}
                      >
                        SKU
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setInActiveCoupons(
                            inActivecoupons
                              .slice()
                              .sort((a, b) =>
                                inActivesortType.ascInternal_name
                                  ? b?.internal_name.localeCompare(
                                      a?.internal_name,
                                    )
                                  : a?.internal_name.localeCompare(
                                      b?.internal_name,
                                    ),
                              ),
                          );
                          setInActiveSortType({
                            ...inActivesortType,
                            ascInternal_name:
                              !inActivesortType.ascInternal_name,
                          });
                        }}
                      >
                        Internal Name
                      </span>
                    </TableCell>
                    <TableCell>Events</TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setInActiveCoupons(
                            inActivecoupons
                              .slice()
                              .sort((a, b) =>
                                inActivesortType.ascActive_from
                                  ? moment(b.active_from) -
                                    moment(a.active_from)
                                  : moment(a.active_from) -
                                    moment(b.active_from),
                              ),
                          );
                          setInActiveSortType({
                            ...inActivesortType,
                            ascActive_from: !inActivesortType.ascActive_from,
                          });
                        }}
                      >
                        Starts
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setInActiveCoupons(
                            inActivecoupons
                              .slice()
                              .sort((a, b) =>
                                inActivesortType.ascExpires_after
                                  ? b.year - a.year
                                  : a.year - b.year,
                              ),
                          );
                          setInActiveSortType({
                            ...inActivesortType,
                            ascExpires_after:
                              !inActivesortType.ascExpires_after,
                          });
                        }}
                      >
                        Expires After
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setInActiveCoupons(
                            inActivecoupons
                              .slice()
                              .sort((a, b) =>
                                inActivesortType.ascPaydeposit
                                  ? b.year - a.year
                                  : a.year - b.year,
                              ),
                          );
                          setInActiveSortType({
                            ...inActivesortType,
                            ascPaydeposit: !inActivesortType.ascPaydeposit,
                          });
                        }}
                      >
                        Pay Deposit By
                      </span>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setInActiveCoupons(
                          inActivecoupons
                            .slice()
                            .sort((a, b) =>
                              inActivesortType.ascPublic_description
                                ? b?.public_description.localeCompare(
                                    a?.public_description,
                                  )
                                : a?.public_description.localeCompare(
                                    b?.public_description,
                                  ),
                            ),
                        );
                        setInActiveSortType({
                          ...inActivesortType,
                          ascPublic_description:
                            !inActivesortType.ascPublic_description,
                        });
                      }}
                    >
                      <span>Description</span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('internal_use_only')}
                      >
                        Internal
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortInActive('percentage_discount')
                        }
                      >
                        Type
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setInActiveCoupons(
                            inActivecoupons
                              .slice()
                              .sort((a, b) =>
                                inActivesortType.ascAutoProcess
                                  ? (b.percentage_discount || 0) -
                                    (a.percentage_discount || 0)
                                  : (a.percentage_discount || 0) -
                                    (b.percentage_discount || 0),
                              ),
                          );
                          setInActiveSortType({
                            ...inActivesortType,
                            ascAutoProcess: !inActivesortType.ascAutoProcess,
                          });
                        }}
                      >
                        Auto Process
                      </span>
                    </TableCell>
                    <TableCell>
                      <span>View Usage</span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsInActive?.map((coupon, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{coupon?.year}</TableCell>
                        <TableCell>{coupon?.sku}</TableCell>
                        <TableCell>
                          <p className="w_300">{coupon?.internal_name}</p>
                        </TableCell>
                        <TableCell>
                          {
                            availableAtEvent.length ===
                            coupon?.newAvailable_at_events.length ? (
                              'ALL'
                            ) : (
                              <div
                                className={
                                  coupon?.show_more
                                    ? 'show_more_data expanded'
                                    : 'show_more_data'
                                }
                              >
                                <p className="description">
                                  {coupon?.newAvailable_at_events}
                                </p>
                                <ShowMoreHandler
                                  check={checkInActive}
                                  setCheck={setCheckInActive}
                                  _id={coupon._id}
                                  toggle={coupon.show_more}
                                  elementData={coupon?.newAvailable_at_events}
                                />
                              </div>
                            )
                            /* coupon?.newAvailable_at_events.join(', ')  */
                          }
                        </TableCell>
                        <TableCell>
                          <span className="date_wrapper">
                            {coupon?.active_from
                              ? moment(coupon?.active_from).format(
                                  'dddd Do MMM YYYY',
                                )
                              : ''}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="date_wrapper">
                            {moment(new Date()).format('YYYY/MM/DD') >
                            moment(coupon?.expires_after).format('YYYY/MM/DD')
                              ? 'Expired'
                              : moment(coupon?.expires_after).format(
                                  'dddd MMM Do YYYY',
                                )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="date_wrapper">
                            {coupon?.deposits_required_by == null
                              ? 'Any Time'
                              : moment(coupon?.deposits_required_by).format(
                                  'dddd MMM Do YYYY',
                                )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <p className="description">
                            {coupon?.public_description
                              ? coupon.public_description
                              : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {coupon?.internal_use_only ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell>{coupon?.newCoupon_type}</TableCell>
                        <TableCell>
                          {coupon?.auto_process_coupon ? 'Yes' : 'No'}
                          {coupon?.newCoupon_type?.toLowerCase() == 'discount'
                            ? coupon?.percentage_discount == null
                              ? ' '
                              : ` / ` +
                                coupon?.percentage_discount?.toFixed(2) +
                                `%`
                            : ''}
                        </TableCell>
                        <TableCell>
                          <Link
                            to="/reports/coupons-report"
                            className="text_primary"
                          >
                            View Report
                          </Link>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/coupons/add-edit-coupons/${coupon._id}`}
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
                                  let userObject = { ...coupon };
                                  delete userObject['newAvailable_at_events'];
                                  delete userObject['newCoupon_type'];

                                  suspendHandler(
                                    userObject,
                                    dispatch,
                                    updateCoupon,
                                    'coupon',
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
                                onClick={() => OpenDelete(coupon)}
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
                          inActiveCouponList?.length,
                        )}{' '}
                        of {inActiveCouponList?.length} entries
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
        onClickDelete={deleteCouponAccount}
        name="Are you sure you want to delete this coupon? Note: this cannot be undone"
      />
      <ShowMoreInitializer data={activeCurrentData} setState={setCheck} />
      <ShowMoreInitializer
        data={inActiveCurrentData}
        setState={setCheckInActive}
      />
    </div>
  );
}
