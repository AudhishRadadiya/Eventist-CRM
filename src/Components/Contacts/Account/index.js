import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import EditIcon from '../../../Assets/Img/edit.svg';
import { Col, Row } from 'react-bootstrap';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Button } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalPages } from 'utils/common';
import Loader from 'Components/Common/Loader';
import {
  getAccountListData,
  setIsAccountUpdated,
  updateAccount,
} from 'store/reducers/Contact/account.slice';
import DataNotFound from 'Components/Common/DataNotFound';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import ClosePopupModal from 'Components/Common/ClosePopupModal';
import useGroupSortable from 'utils/useGroupSortable';
import { getAllPageData2, getPageListData2 } from 'utils/gropingPagination';

const pageSize = 10;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border: '1px solid #DADDDF',
  maxWidth: '285px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 0,
  marginLeft: 0,
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '12px',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
}));

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    activeAccountList,
    inActiveAccountList,
    isAccountUpdated,
    accountLoading,
    activeAllAccountList,
    inActiveAllAccountList,
  } = useSelector(({ account }) => account);

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [closePopup, setClosePopup] = useState(false);
  const [closeId, setCloseId] = useState('');
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const [searchAccountNameOrHandleQuery, setSearchAccountNameOrHandleQuery] =
    useState('');
  const [searchAccountAddressQuery, setSearchAccountAddressQuery] =
    useState('');
  const [searchAccountPostCodeQuery, setSearchAccountPostCodeQuery] =
    useState('');

  const [activeAccountListArray, setActiveAccountListArray] = useState([]);
  const [inActiveAccountListArray, setInActiveAccountListArray] = useState([]);

  const [activeAllPageData, setActiveAllPageData] = useState([]);
  const [inActiveAllPageData, setInActiveAllPageData] = useState([]);
  const handlePageStartIndex = (page, limit) => {
    let startIndex = (page - 1) * limit + 1;
    return startIndex;
  };

  const handlePageChange = (page, data) => {
    const getAccountData = isActive => {
      return dispatch(
        getAccountListData({
          start: handlePageStartIndex(page, pageSize),
          limit: pageSize,
          group: true,
          is_active: isActive,
        }),
      );
    };
    getAccountData(data);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    if (Object.keys(params).length > 0) {
      setSearchAccountNameOrHandleQuery(params?.name);
      setSearchAccountAddressQuery(params?.address_line_1);
      setSearchAccountPostCodeQuery(params?.postcode);
      const commonSearchData = {
        start: 0,
        limit: pageSize,
        group: true,
        name: searchAccountNameOrHandleQuery || '',
        address_line_1: searchAccountAddressQuery || '',
        postcode: searchAccountPostCodeQuery || '',
        ...params,
      };

      dispatch(getAccountListData({ ...commonSearchData, is_active: true }));
      dispatch(getAccountListData({ ...commonSearchData, is_active: false }));
    }
  }, [location.search]);

  useEffect(() => {
    const getAccountData = (currentPages, isActive) => {
      return dispatch(
        getAccountListData({
          start: handlePageStartIndex(currentPages, pageSize),
          limit: pageSize,
          group: true,
          is_active: isActive,
        }),
      );
    };

    getAccountData(currentPage?.activeCurrentPage, true);
    getAccountData(currentPage?.inActiveCurrentPage, false);
  }, [
    currentPage?.activeCurrentPage,
    currentPage?.inActiveCurrentPage,
    dispatch,
  ]);

  useEffect(() => {
    if (isAccountUpdated) {
      const getAccountData = isActive => {
        return dispatch(
          getAccountListData({
            start: 0,
            limit: pageSize,
            group: true,
            is_active: isActive,
          }),
        );
      };

      getAccountData(true);
      getAccountData(false);

      dispatch(setIsAccountUpdated(false));
    }
  }, [dispatch, isAccountUpdated]);

  const OpenDelete = account => {
    setDeleteId(account);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const OpenClose = account => {
    setCloseId(account);
    setClosePopup(true);
  };

  const CloseClose = () => {
    setClosePopup(false);
  };

  const deleteAccount = () => {
    dispatch(
      updateAccount({
        _id: deleteId._id,
        account: {
          ...deleteId,
          // category: deleteId?.category,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };

  const suspendAccount = account => {
    dispatch(
      updateAccount({
        _id: account._id,
        account: {
          ...account,
          // account_category: account?.account_category_id,
          is_active: !account.is_active,
        },
      }),
    );
  };

  const closeAccount = () => {
    dispatch(
      updateAccount({
        _id: closeId._id,
        account: {
          ...closeId,
          is_close: !closeId.is_close,
        },
      }),
    );
  };

  useEffect(() => {
    if (activeAccountList?.length > 0) {
      let dummyList = [];
      activeAccountList.map(i => {
        dummyList.push({ catName: i.year, is_cat: true });
        i?.data.map(data => {
          dummyList.push({ ...data });
          return { ...data };
        });
        return dummyList;
      });
      setActiveAccountListArray(dummyList);
    }
  }, [activeAccountList]);

  useEffect(() => {
    if (inActiveAccountList?.length > 0) {
      let dummyList = [];
      inActiveAccountList.map(i => {
        dummyList.push({ catName: i.year, is_cat: true });
        i?.data.map(data => {
          dummyList.push({ ...data });
          return { ...data };
        });
        return dummyList;
      });
      setInActiveAccountListArray(dummyList);
    }
  }, [inActiveAccountList]);

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeAccountList.flatMap(i => i.data),
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeAccountList]);

  const totalInActiveRecordPage = useMemo(() => {
    const totalInActiveRecordCount = getTotalPages(
      inActiveAccountList.flatMap(i => i.data),
      pageSize,
    );
    return totalInActiveRecordCount;
  }, [inActiveAccountList]);

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
        activeAllAccountList?.totalPages,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
      setActiveAllPageData(currentDataList);
    }
  }, [activeAccountListArray, activeAllAccountList?.totalPages]);

  useEffect(() => {
    if (inActiveAccountListArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        inActiveAccountListArray,
        currentPage.inActiveCurrentPage,
        pageSize,
        inActiveAllAccountList?.totalPages,
        setCurrentPageHandler,
        'inActiveCurrentPage',
      );
      setInActiveAllPageData(currentDataList);
    }
  }, [inActiveAccountListArray, inActiveAllAccountList?.totalPages]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = [];
    if (activeAllPageData?.length > 0) {
      currentDataList = getPageListData2(
        activeAccountListArray,
        activeAllPageData,
        currentPage?.activeCurrentPage,
        totalActiveRecordPage,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
    }
    return currentDataList;
  }, [activeAllPageData, activeAccountListArray, currentPage]);

  const inActiveCurrentData = useMemo(() => {
    let currentDataList = [];
    if (inActiveAllPageData?.length > 0) {
      currentDataList = getPageListData2(
        inActiveAccountListArray,
        inActiveAllPageData,
        currentPage.inActiveCurrentPage,
        totalInActiveRecordPage,
        setCurrentPageHandler,
        'inActiveCurrentPage',
      );
    }
    return currentDataList;
  }, [inActiveAllPageData, inActiveAccountListArray, currentPage]);

  const { itemsActive, requestSortActive } = useGroupSortable(
    currentPage.activeCurrentPage,
    activeCurrentData,
  );

  const { itemsInActive, requestSortInActive } = useGroupSortable(
    currentPage.inActiveCurrentPage,
    inActiveCurrentData,
  );

  const handleSearch = () => {
    navigate(
      `/contact/account?name=${searchAccountNameOrHandleQuery?.trim()}&address_line_1=${searchAccountAddressQuery?.trim()}&postcode=${searchAccountPostCodeQuery?.trim()}`,
    );
  };

  return (
    <>
      <div className="inner_wrapper">
        {accountLoading && <Loader />}
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Link to="/contact">Contacts</Link>
            <Typography>Account</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row>
            <Col xs={9}>
              <h1>Contacts Accounts</h1>
            </Col>
          </Row>
        </div>
        <div className="account_add_wrap mb-4">
          <Link to="/contact/account/add-account" className="btn_primary small">
            Add New Account
          </Link>
        </div>
        <div className="account_wrapper">
          <h4 className="fw_600">Search Contacts</h4>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '18%' }}>
                      Account Name / Handle
                    </TableCell>
                    <TableCell sx={{ width: '18%' }}>Account Address</TableCell>
                    <TableCell>Account Postcode</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Search className="search_with_icon">
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Enter a Account Name or Handle"
                          inputProps={{ 'aria-label': 'search' }}
                          className="w-100"
                          value={searchAccountNameOrHandleQuery}
                          onChange={e =>
                            setSearchAccountNameOrHandleQuery(e.target.value)
                          }
                        />
                      </Search>
                    </TableCell>
                    <TableCell>
                      <Search className="search_with_icon">
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Enter a Account Address"
                          inputProps={{ 'aria-label': 'search' }}
                          className="w-100"
                          value={searchAccountAddressQuery}
                          onChange={e =>
                            setSearchAccountAddressQuery(e.target.value)
                          }
                        />
                      </Search>
                    </TableCell>
                    <TableCell>
                      <div className="d-flex">
                        <Search className="search_with_icon">
                          <SearchIconWrapper>
                            <SearchIcon />
                          </SearchIconWrapper>
                          <StyledInputBase
                            placeholder="Enter a Account Postcode"
                            inputProps={{ 'aria-label': 'search' }}
                            className="w-100"
                            value={searchAccountPostCodeQuery}
                            onChange={e =>
                              setSearchAccountPostCodeQuery(e.target.value)
                            }
                          />
                        </Search>
                        <Button
                          className="btn_primary small ms-3"
                          onClick={handleSearch}
                        >
                          Search
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <h4 className="fw_600">Current Contacts</h4>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Find Contacts</TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('name')}>
                        Account Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('handle')}>
                        Account Handle
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('type')}>
                        Type
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('internal_notes')}>
                        Internal Notes
                      </span>
                    </TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsActive?.map((account, index) => {
                    return (
                      <Fragment key={index}>
                        {account?.is_cat ? (
                          <TableRow className="full_row">
                            <TableCell colSpan={6}>
                              Registered:{account?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <Fragment>
                            {account?.catName && (
                              <TableRow>
                                <TableCell>{account?.catName}</TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>
                                <Link
                                  to={`/contact/account/lookup/${account?._id}`}
                                  className="btn_border small"
                                >
                                  Lookup
                                </Link>
                              </TableCell>
                              <TableCell>{account?.name}</TableCell>
                              <TableCell>
                                <span className="account_handle_wrap">
                                  {account?.handle}
                                </span>
                              </TableCell>
                              <TableCell>{account?.newAccountType}</TableCell>
                              <TableCell>
                                <span className="internal_note_wrapper">
                                  {account?.internal_notes}
                                </span>
                              </TableCell>
                              <TableCell>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      to={`/contact/account/add-account/${account?._id}`}
                                      className="btn_edit"
                                    >
                                      <img src={EditIcon} alt="Edit Icon" />
                                    </Link>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_warning"
                                      onClick={() => suspendAccount(account)}
                                    >
                                      Suspend
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_gray"
                                      onClick={() => OpenClose(account)}
                                    >
                                      Close
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_border small"
                                      onClick={() => OpenDelete(account)}
                                    >
                                      Delete
                                    </Button>
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
              {itemsActive?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeAllAccountList?.pageStartIndex} to{' '}
                        {activeAllAccountList?.pageStartIndex +
                          activeAccountList?.flatMap(i => i.data).length -
                          1}{' '}
                        of {activeAllAccountList?.total} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={activeAllAccountList?.totalPages}
                          page={activeAllAccountList?.currentPage}
                          onChange={(e, page) => {
                            handlePageChange(page, true);
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
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Find Contacts</TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('name')}>
                        Account Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('handle')}>
                        Account Handle
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('type')}>
                        Type
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('internal_notes')}
                      >
                        Internal Notes
                      </span>
                    </TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsInActive?.map((account, index) => {
                    return (
                      <Fragment key={index}>
                        {account?.is_cat ? (
                          <TableRow className="full_row">
                            <TableCell colSpan={6}>
                              Registered:{account?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <Fragment>
                            {account?.catName && (
                              <TableRow>
                                <TableCell>{account?.catName}</TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>
                                <Link
                                  to={`/contact/account/lookup/${account?._id}`}
                                  className="btn_border small"
                                >
                                  Lookup
                                </Link>
                              </TableCell>
                              <TableCell>{account?.name}</TableCell>
                              <TableCell>
                                <span className="account_handle_wrap">
                                  {account?.handle}
                                </span>
                              </TableCell>
                              <TableCell>{account?.newAccountType}</TableCell>
                              <TableCell>
                                <span className="internal_note_wrapper">
                                  {account?.internal_notes}
                                </span>
                              </TableCell>
                              <TableCell>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      to={`/contact/account/add-account/${account?._id}`}
                                      className="btn_edit"
                                    >
                                      <img src={EditIcon} alt="Edit Icon" />
                                    </Link>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_info"
                                      onClick={() => suspendAccount(account)}
                                    >
                                      Activate
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_gray"
                                      onClick={() => OpenClose(account)}
                                    >
                                      Close
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_border small"
                                      onClick={() => OpenDelete(account)}
                                    >
                                      Delete
                                    </Button>
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
              {itemsInActive?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {inActiveAllAccountList?.pageStartIndex} to{' '}
                        {inActiveAllAccountList?.pageStartIndex +
                          inActiveAccountList?.flatMap(i => i.data).length -
                          1}{' '}
                        of {inActiveAllAccountList?.total} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={inActiveAllAccountList?.totalPages}
                          page={inActiveAllAccountList?.currentPage}
                          onChange={(e, page) => {
                            handlePageChange(page, false);
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
        onClickDelete={deleteAccount}
        name="Are you sure you want to delete this account AND SET ALL ITS CONTACTS INACTIVE? Note: this cannot be undone"
      />
      <ClosePopupModal
        CloseClose={CloseClose}
        closePopup={closePopup}
        onClickClose={closeAccount}
      />
    </>
  );
}
