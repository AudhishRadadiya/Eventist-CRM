import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PlusIcon from '../../../Assets/Img/plus.svg';
import EyeIcon from '../../../Assets/Img/eye.svg';
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
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { getLookupAccount } from 'store/reducers/Contact/account.slice';
import moment from 'moment';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { getTotalPages, numberRegex } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import useGroupSortable from 'utils/useGroupSortable';
import {
  getContactListData,
  setIsContactUpdated,
  updateContact,
} from 'store/reducers/Contact/contact.slice';
import Loader from 'Components/Common/Loader';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import { getAllPageData2, getPageListData2 } from 'utils/gropingPagination';

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

const pageSize = 10;
export default function Lookup() {
  const dispatch = useDispatch();
  const { lookupId } = useParams();

  const [searchBusinessOrPartyNameQuery, setSearchBusinessOrPartyNameQuery] =
    useState('');
  const [searchContactNameQuery, setSearchContactNameQuery] = useState('');
  const [searchContactEmailQuery, setSearchContactEmailQuery] = useState('');
  const [searchAccountPostCodeQuery, setSearchAccountPostCodeQuery] =
    useState('');
  const [searchMax, setSearchMax] = useState('');
  const [searchStartFrom, setSearchStartFrom] = useState('');
  const [searchNotes, setSearchNotes] = useState('');

  const [listStatus, setListStatus] = useState(false);
  const [showResult, setShowResult] = useState(false);

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

  const { lookupAccountDetail, accountLoading } = useSelector(
    ({ account }) => account,
  );
  const {
    activeContactList,
    inactiveContactList,
    isContactUpdated,
    contactListLoading,
  } = useSelector(({ contact }) => contact);

  const [activeContactListArray, setActiveContactListArray] = useState([]);
  const [inActiveContactListArray, setInActiveContactListArray] = useState([]);

  const [activeAllPageData, setActiveAllPageData] = useState([]);
  const [inActiveAllPageData, setInActiveAllPageData] = useState([]);

  let activeListData = listStatus
    ? activeContactList
    : Array.isArray(lookupAccountDetail?.active)
    ? lookupAccountDetail?.active
    : [];

  let inActiveListData = listStatus
    ? inactiveContactList
    : Array.isArray(lookupAccountDetail?.inactive)
    ? lookupAccountDetail?.inactive
    : [];

  const showResultHandle = () => {
    setShowResult(!showResult);
  };

  const suspendContact = contact => {
    dispatch(
      updateContact({
        _id: contact?._id,
        contact: {
          ...contact,
          is_active: !contact?.is_active,
        },
      }),
    );
  };

  const setCurrentPageHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordAccount = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeListData?.flatMap(i => i?.group_data),
      pageSize,
    );

    return totalActiveRecordCount;
  }, [activeListData]);

  const totalInActiveRecordAccount = useMemo(() => {
    const totalInActiveRecordCount = getTotalPages(
      inActiveListData?.flatMap(i => i?.group_data),
      pageSize,
    );
    return totalInActiveRecordCount;
  }, [inActiveListData]);

  useEffect(() => {
    if (activeContactListArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        activeContactListArray,
        currentPage.activeCurrentPage,
        pageSize,
        totalActiveRecordAccount,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
      setActiveAllPageData(currentDataList);
    }
  }, [activeContactListArray, totalActiveRecordAccount]);

  useEffect(() => {
    if (inActiveContactListArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        inActiveContactListArray,
        currentPage.inActiveCurrentPage,
        pageSize,
        totalInActiveRecordAccount,
        setCurrentPageHandler,
        'inActiveCurrentPage',
      );
      setInActiveAllPageData(currentDataList);
    }
  }, [inActiveContactListArray, totalInActiveRecordAccount]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = [];
    if (activeAllPageData?.length > 0) {
      currentDataList = getPageListData2(
        activeContactListArray,
        activeAllPageData,
        currentPage.activeCurrentPage,
        totalActiveRecordAccount,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
    }
    return currentDataList;
  }, [activeAllPageData, activeContactListArray, currentPage]);

  const inActiveCurrentData = useMemo(() => {
    let currentDataList = [];
    if (inActiveAllPageData?.length > 0) {
      currentDataList = getPageListData2(
        inActiveContactListArray,
        inActiveAllPageData,
        currentPage.inActiveCurrentPage,
        totalInActiveRecordAccount,
        setCurrentPageHandler,
        'inActiveCurrentPage',
      );
    }
    return currentDataList;
  }, [inActiveAllPageData, inActiveContactListArray, currentPage]);

  let myActiveCurrentData = activeCurrentData ? activeCurrentData : [];

  const { itemsActive, requestSortActive } = useGroupSortable(
    currentPage.activeCurrentPage,
    myActiveCurrentData,
  );

  let myInActiveCurrentData = inActiveCurrentData ? inActiveCurrentData : [];
  const { itemsInActive, requestSortInActive } = useGroupSortable(
    currentPage.inActiveCurrentPage,
    myInActiveCurrentData,
  );

  const handleSearch = () => {
    dispatch(
      getContactListData({
        company_name: searchBusinessOrPartyNameQuery.trim(),
        contact_name: searchContactNameQuery.trim(),
        email_primary: searchContactEmailQuery.trim(),
        post_code: searchAccountPostCodeQuery.trim(),
        limit: searchMax.trim(),
        start: searchStartFrom.trim(),
        notes: searchNotes.trim(),
      }),
    );
    setListStatus(true);
  };

  useEffect(() => {
    if (lookupId) {
      dispatch(getLookupAccount(lookupId));
    }
  }, [dispatch, lookupId]);

  useEffect(() => {
    if (isContactUpdated) {
      dispatch(getLookupAccount(lookupId));
      dispatch(setIsContactUpdated(false));
    }
  }, [dispatch, isContactUpdated]);

  const OpenDelete = ele => {
    setDeleteId(ele);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteLookupAccount = () => {
    dispatch(
      updateContact({
        _id: deleteId._id,
        contact: {
          ...deleteId,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };

  useEffect(() => {
    if (activeListData?.length > 0) {
      let dummyList = [];
      activeListData.map(i => {
        dummyList.push({ catName: i.year, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData });
          return { ...groupData };
        });
        return dummyList;
      });
      setActiveContactListArray(dummyList);
    }
  }, [activeListData]);

  useEffect(() => {
    if (inActiveListData?.length > 0) {
      let dummyList = [];
      inActiveListData.map(i => {
        dummyList.push({ catName: i.year, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData });
          return { ...groupData };
        });
        return dummyList;
      });
      setInActiveContactListArray(dummyList);
    }
  }, [inActiveListData]);

  return (
    <div className="inner_wrapper">
      {(accountLoading && <Loader />) || (contactListLoading && <Loader />)}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link to="/contact">Contacts</Link>
          <Link to="/contact/account">Account</Link>
          <Typography>Contact Account</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <Row>
          <Col xs={9}>
            <h1>Contacts Accounts</h1>
          </Col>
        </Row>
      </div>
      <div className="contact_wrapper">
        <h4 className="fw_500">Search Contacts</h4>
        <div className="table_main_Wrapper mb-3">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '3%' }}></TableCell>
                  <TableCell sx={{ width: '18%' }}>
                    Business / Party Name
                  </TableCell>
                  <TableCell sx={{ width: '18%' }}>Contact Name</TableCell>
                  <TableCell sx={{ width: '18%' }}>Contact Email</TableCell>
                  <TableCell>Account Postcode</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div
                      className={
                        showResult
                          ? 'collapse_wrap cursor-pointer active'
                          : 'collapse_wrap cursor-pointer'
                      }
                      onClick={() => showResultHandle()}
                    >
                      <img src={PlusIcon} alt="Plus Icon" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Search className="search_with_icon">
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Enter a business or party name"
                        inputProps={{ 'aria-label': 'search' }}
                        className="w-100"
                        value={searchBusinessOrPartyNameQuery}
                        onChange={e => {
                          setSearchBusinessOrPartyNameQuery(e.target.value);
                        }}
                      />
                    </Search>
                  </TableCell>
                  <TableCell>
                    <Search className="search_with_icon">
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Enter a contact name"
                        inputProps={{ 'aria-label': 'search' }}
                        className="w-100"
                        value={searchContactNameQuery}
                        onChange={e => {
                          setSearchContactNameQuery(e.target.value);
                        }}
                      />
                    </Search>
                  </TableCell>
                  <TableCell>
                    <Search className="search_with_icon">
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Enter a contact email"
                        inputProps={{ 'aria-label': 'search' }}
                        className="w-100"
                        value={searchContactEmailQuery}
                        onChange={e => {
                          setSearchContactEmailQuery(e.target.value);
                        }}
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
                          placeholder="Enter a account postcode"
                          inputProps={{ 'aria-label': 'search' }}
                          className="w-100"
                          value={searchAccountPostCodeQuery}
                          onChange={e => {
                            setSearchAccountPostCodeQuery(e.target.value);
                          }}
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
                {showResult && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="p-2">
                        <h5>Show Results</h5>
                        <Row className="align-items-center mb-3">
                          <Col xs={3}>
                            <Row className="align-items-center">
                              <Col xs={6}>
                                <span className="label">
                                  Max Results (default 50):
                                </span>
                              </Col>
                              <Col xs={6}>
                                <FormGroup>
                                  <FormControl
                                    fullWidth
                                    className="small_select"
                                  >
                                    <TextField
                                      id="MaxResults"
                                      type="number"
                                      onWheel={e => e.target.blur()}
                                      variant="outlined"
                                      className="input_wrap"
                                      placeholder="Max"
                                      onKeyDown={e => {
                                        numberRegex(e);
                                      }}
                                      inputProps={{
                                        min: 0,
                                        step: 'any',
                                      }}
                                      value={searchMax}
                                      onChange={e => {
                                        setSearchMax(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={3}>
                            <Row className="align-items-center">
                              <Col xs={6}>
                                <span className="label">
                                  Start From (default 0):
                                </span>
                              </Col>
                              <Col xs={6}>
                                <FormGroup>
                                  <FormControl
                                    fullWidth
                                    className="small_select"
                                  >
                                    <TextField
                                      id="StartFrom"
                                      type="number"
                                      onWheel={e => e.target.blur()}
                                      variant="outlined"
                                      className="input_wrap"
                                      placeholder="Max"
                                      onKeyDown={e => {
                                        numberRegex(e);
                                      }}
                                      inputProps={{
                                        min: 0,
                                        step: 'any',
                                      }}
                                      value={searchStartFrom}
                                      onChange={e => {
                                        setSearchStartFrom(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={3}>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Include Inactive and Delete:"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={8}>
                            <h5>Search Notes</h5>
                            <p>
                              You can also search for contacts which contain
                              certain text within the contact notes field. To do
                              so just enter your search text below and click the
                              magnifyng glass to the right:
                            </p>
                            <FormGroup>
                              <FormControl fullWidth className="small_select">
                                <TextField
                                  id="resolution_note"
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  placeholder="Add"
                                  value={searchNotes}
                                  onChange={e => {
                                    setSearchNotes(e.target.value);
                                  }}
                                />
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <p>Please ^ Lookup ^ Existing Contacts Before Adding New Ones</p>
        <Link to="/contact/add-contact" className="btn_primary small">
          Add New Contact /Enquiry
        </Link>
        <div className="current_contact_wrap mt-3">
          <Row>
            <Col xs={6}>
              <h4 className="fw_600">Current Contacts</h4>
            </Col>
            <Col xs={6} className="text-end">
              <Link
                to={`/bookings/?contactid=${lookupId}&account=true`}
                className="btn_border small"
              >
                View Bookings for this Account
              </Link>
            </Col>
          </Row>

          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Enquiries</TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('first_name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('email_primary')}>
                        Email
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('company_name')}>
                        Company Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('updated_at')}>
                        Updated at
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortActive('updated_by_name')}
                      >
                        Updated by
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('notes')}>
                        Contact Notes
                      </span>
                    </TableCell>
                    <TableCell>Booking</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {itemsActive?.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        {item?.is_cat ? (
                          <TableRow className="full_row">
                            <TableCell colSpan={9}>
                              Registered: {item?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {item?.catName && (
                              <TableRow className="full_row">
                                <TableCell colSpan={9}>
                                  Registered: {item?.catName}
                                </TableCell>
                              </TableRow>
                            )}

                            <TableRow>
                              <TableCell>-</TableCell>
                              <TableCell>
                                <Link
                                  to={`/contact/edit-contact/${item._id}`}
                                  className="text_decoration"
                                >
                                  {item?.first_name + ' ' + item?.surname}
                                </Link>
                              </TableCell>
                              <TableCell>
                                {!!item?.email_primary
                                  ? item?.email_primary
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {!!item?.company_name
                                  ? item?.company_name
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {' '}
                                {!!item?.updated_at
                                  ? moment(item?.updated_at).format(
                                      ' DD-MM-YY h:mm:ss',
                                    )
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {!!item?.updated_by_name
                                  ? item?.updated_by_name
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {!!item?.notes ? item?.notes : '-'}
                              </TableCell>
                              <TableCell>
                                <Link className="view_btn" to="">
                                  <img src={EyeIcon} alt="" />
                                </Link>
                              </TableCell>
                              <TableCell>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      className="btn_edit"
                                      to={`/contact/edit-contact/${item._id}`}
                                    >
                                      <img src={EditIcon} alt="" />
                                    </Link>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_warning"
                                      onClick={() => suspendContact(item)}
                                    >
                                      Suspend
                                    </Button>
                                  </li>
                                  {item?.can_delete && (
                                    <li>
                                      <button
                                        type="button"
                                        className="btn_border small"
                                        onClick={() => OpenDelete(item)}
                                      >
                                        Delete
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="table_pagination_wrap">
              {itemsActive.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          activeIndexOfLastItem,
                          activeListData?.flatMap(i => i.group_data)?.length,
                        )}{' '}
                        of {activeListData?.flatMap(i => i.group_data)?.length}{' '}
                        entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalActiveRecordAccount}
                          page={currentPage.activeCurrentPage}
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
        </div>
        <div className="current_contact_wrap mt-3">
          <h5 className="text_primary">Inactive :</h5>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Enquiries</TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('first_name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('email_primary')}
                      >
                        Email
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('company_name')}>
                        Company Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('updated_by_name')}
                      >
                        Updated at
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('info')}>
                        Updated by
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('notes')}>
                        Contact Notes
                      </span>
                    </TableCell>
                    <TableCell>Booking</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsInActive?.map((contact, index) => {
                    return (
                      <React.Fragment key={index}>
                        {contact?.is_cat ? (
                          <TableRow className="full_row" key={index}>
                            <TableCell colSpan={9}>
                              Registered: {contact?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {contact?.catName && (
                              <TableRow className="full_row">
                                <TableCell colSpan={9}>
                                  Registered: {contact?.catName}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>-</TableCell>
                              <TableCell>
                                <Link
                                  to={`/contact/edit-contact/${contact._id}`}
                                  className="text_decoration"
                                >
                                  {contact?.first_name + ' ' + contact?.surname}
                                </Link>
                              </TableCell>
                              <TableCell>
                                {!!contact?.email_primary
                                  ? contact?.email_primary
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {!!contact?.company_name
                                  ? contact?.company_name
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {!!contact?.updated_at
                                  ? moment(contact?.updated_at).format(
                                      ' DD-MM-YY h:mm:ss',
                                    )
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {!!contact?.updated_by_name
                                  ? contact?.updated_by_name
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {!!contact?.notes ? contact?.notes : '-'}
                              </TableCell>
                              <TableCell>
                                <Link className="view_btn" to="">
                                  <img src={EyeIcon} alt="" />
                                </Link>
                              </TableCell>
                              <TableCell>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      className="btn_edit"
                                      to={`/contact/edit-contact/${contact._id}`}
                                    >
                                      <img src={EditIcon} alt="Edit" />
                                    </Link>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_info"
                                      onClick={() => suspendContact(contact)}
                                    >
                                      Active
                                    </Button>
                                  </li>
                                  {contact?.can_delete && (
                                    <li>
                                      <button
                                        type="button"
                                        className="btn_border small"
                                        onClick={() => OpenDelete(contact)}
                                      >
                                        Delete
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="table_pagination_wrap">
              {itemsInActive.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveListData?.flatMap(i => i.group_data)?.length,
                        )}{' '}
                        of{' '}
                        {inActiveListData?.flatMap(i => i.group_data)?.length}{' '}
                        entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalInActiveRecordAccount}
                          page={currentPage.inActiveCurrentPage}
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
        onClickDelete={deleteLookupAccount}
        name="Are you sure you want to delete this contact? Note: this cannot be undone"
      />
    </div>
  );
}
