import React, { useState, useEffect, useMemo, Fragment } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import PlusIcon from '../../Assets/Img/plus.svg';
import EyeIcon from '../../Assets/Img/eye.svg';
import EditIcon from '../../Assets/Img/edit.svg';
import CheckIcon from '../../Assets/Img/check-green.svg';
import CrossIcon from '../../Assets/Img/cross-red.svg';
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
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {
  getContactListData,
  updateContact,
  setIsContactUpdated,
} from '../../store/reducers/Contact/contact.slice';
import { useDispatch, useSelector } from 'react-redux';
import { checkEmail, getTotalPages } from 'utils/common';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import DataNotFound from 'Components/Common/DataNotFound';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import { getAllPageData2, getPageListData2 } from 'utils/gropingPagination';
import useGroupSortable from 'utils/useGroupSortable';
import { numberRegex } from 'utils/common';
import ShowMoreInitializer from 'Components/Common/ShowMoreInitializer';
import ShowMoreHandler from 'Components/Common/ShowMoreHandler';

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
let pageSize = 10;
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

export default function Contact() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const {
    activeContactList,
    inactiveContactList,
    contactListLoading,
    isContactUpdated,
  } = useSelector(({ contact }) => contact);

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  const [searchBusinessOrPartyNameQuery, setSearchBusinessOrPartyNameQuery] =
    useState('');
  const [searchContactNameQuery, setSearchContactNameQuery] = useState('');
  const [searchContactEmailQuery, setSearchContactEmailQuery] = useState('');
  const [searchAccountPostCodeQuery, setSearchAccountPostCodeQuery] =
    useState('');
  const [searchMax, setSearchMax] = useState('');
  const [searchStartFrom, setSearchStartFrom] = useState('');
  const [searchNotes, setSearchNotes] = useState('');
  const [searchInclude, setSearchInclude] = useState('');

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
  // const [check, setCheck] = useState([]);
  const [searchTrigger, setSearchTrigger] = useState(0); // New state to trigger useEffect

  useEffect(() => {
    if (isContactUpdated) {
      dispatch(getContactListData());
      dispatch(setIsContactUpdated(false));
    }
  }, [dispatch, isContactUpdated]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    setSearchBusinessOrPartyNameQuery(params?.company_name || '');
    setSearchContactNameQuery(params?.contact_name || '');
    setSearchContactEmailQuery(params?.email_primary || '');
    setSearchAccountPostCodeQuery(params?.post_code || '');
    setSearchMax(params?.max || '');
    setSearchStartFrom(params?.startfrom || '');
    setSearchInclude(params?.include);
    setSearchNotes(params?.notes || '');
    dispatch(
      getContactListData({
        company_name: searchBusinessOrPartyNameQuery.trim(),
        contact_name: searchContactNameQuery.trim(),
        email_primary: reportParamData?.email || searchContactEmailQuery.trim(),
        post_code: searchAccountPostCodeQuery.trim(),
        limit: searchMax.trim(),
        start: searchStartFrom.trim(),
        notes: searchNotes.trim(),
        include_inactive_and_deleted: Boolean(searchInclude),
        ...params,
      }),
    );
  }, [location.search, searchTrigger]);
  const handleSearch = () => {
    navigate(
      `/contact?company_name=${searchBusinessOrPartyNameQuery?.trim()}&contact_name=${searchContactNameQuery?.trim()}&email_primary=${
        reportParamData?.email || searchContactEmailQuery.trim()
      }&post_code=${searchAccountPostCodeQuery.trim()}&max=${searchMax?.trim()}&startfrom=${searchStartFrom?.trim()}&include=${searchInclude}&notes=${searchNotes?.trim()}`,
    );
    setSearchTrigger(prev => prev + 1);
  };

  // useEffect(() => {
  //   if (reportParamData?.email) {
  //     dispatch(
  //       getContactListData({
  //         email_primary: reportParamData?.email,
  //       }),
  //     );
  //   } else {
  //     dispatch(getContactListData());
  //   }
  // }, [reportParamData?.email]);

  useEffect(() => {
    if (activeContactList?.length > 0) {
      let dummyList = [];
      activeContactList.map(i => {
        dummyList.push({ catName: i.year, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData });
          return { ...groupData };
        });
        return dummyList;
      });
      setActiveAccountListArray(dummyList);
    }
  }, [activeContactList]);

  useEffect(() => {
    if (inactiveContactList?.length > 0) {
      let dummyList = [];
      inactiveContactList.map(i => {
        dummyList.push({ catName: i.year, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData });
          return { ...groupData };
        });
        return dummyList;
      });
      setInActiveAccountListArray(dummyList);
    }
  }, [inactiveContactList]);

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      activeContactList?.flatMap(i => i.group_data),
      pageSize,
    );
    return totalActiveRecordCount;
  }, [activeContactList]);

  const totalInActiveRecordPage = useMemo(() => {
    const totalInActiveRecordCount = getTotalPages(
      inactiveContactList?.flatMap(i => i.group_data),
      pageSize,
    );
    return totalInActiveRecordCount;
  }, [inactiveContactList]);

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

  const activeCurrentData = useMemo(() => {
    let currentDataList = [];
    if (activeAllPageData?.length > 0) {
      currentDataList = getPageListData2(
        activeAccountListArray,
        activeAllPageData,
        currentPage.activeCurrentPage,
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
    // check,
    activeCurrentData,
  );
  const { itemsInActive, requestSortInActive } = useGroupSortable(
    currentPage.inActiveCurrentPage,
    inActiveCurrentData,
  );

  const showResultHandle = () => {
    setShowResult(!showResult);
  };

  const OpenDelete = contact => {
    setDeleteId(contact);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };
  const deleteContact = () => {
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

  const suspendContact = contact => {
    dispatch(
      updateContact({
        _id: contact._id,
        contact: {
          ...contact,
          is_active: !contact.is_active,
        },
      }),
    );
  };

  return (
    <div className="inner_wrapper">
      {contactListLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Contacts</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <Row>
          <Col xs={9}>
            <h1>Contacts</h1>
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
                        onChange={e =>
                          setSearchContactNameQuery(e.target.value)
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
                        placeholder="Enter a contact email"
                        inputProps={{ 'aria-label': 'search' }}
                        className="w-100"
                        value={
                          reportParamData?.email || searchContactEmailQuery
                        }
                        onChange={e =>
                          setSearchContactEmailQuery(e.target.value)
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
                          <Col xxl={3} xs={4}>
                            <Row className="align-items-center">
                              <Col>
                                <span className="label">
                                  Max Results (default 50):
                                </span>
                              </Col>
                              <Col>
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
                                      onKeyDown={e => {
                                        numberRegex(e);
                                      }}
                                      inputProps={{
                                        min: 0,
                                        step: 'any',
                                      }}
                                      placeholder="Max"
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
                          <Col xxl={3} xs={4}>
                            <Row className="align-items-center">
                              <Col>
                                <span className="label">
                                  Start From (default 0):
                                </span>
                              </Col>
                              <Col>
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
                          <Col xxl={3} xs={4}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    value={searchInclude}
                                    onChange={e =>
                                      setSearchInclude(e.target.checked)
                                    }
                                  />
                                }
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
        <button
          className="btn_primary small"
          onClick={() =>
            navigate('/contact/add-contact', {
              state: {
                email: reportParamData?.email || searchContactEmailQuery,
                name: searchContactNameQuery,
              },
            })
          }
        >
          Add New Contact /Enquiry
        </button>
        <div className="current_contact_wrap mt-3">
          <h4 className="fw_600">Current Contacts</h4>
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
                  {itemsActive.map((contact, index) => {
                    return (
                      <Fragment key={index}>
                        {contact?.is_cat ? (
                          <TableRow className="full_row">
                            <TableCell colSpan={9}>
                              Registered:{contact?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <Fragment>
                            {contact?.catName && (
                              <TableRow>
                                <TableCell>{contact?.catName}</TableCell>
                              </TableRow>
                            )}
                            <TableRow
                              className={contact?.deleted && `bg_highlight`}
                            >
                              <TableCell>
                                {contact?.has_enquiries && (
                                  <Link
                                    className="view_btn"
                                    to={`/enquiries/${contact._id}?contact=true`}
                                  >
                                    <img src={EyeIcon} alt="" />
                                  </Link>
                                )}
                              </TableCell>
                              <TableCell>
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {contact?.first_name +
                                      ' ' +
                                      contact?.surname}
                                  </del>
                                ) : (
                                  <Link
                                    to={`/contact/edit-contact/${contact._id}`}
                                    className="text_decoration"
                                  >
                                    {contact?.first_name +
                                      ' ' +
                                      contact?.surname}
                                  </Link>
                                )}
                              </TableCell>
                              <TableCell>
                                <span>
                                  {checkEmail(contact?.email_primary) ? (
                                    <img src={CheckIcon} alt="checkIcon" />
                                  ) : (
                                    <img src={CrossIcon} alt="CrossIcons" />
                                  )}
                                </span>{' '}
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {contact?.email_primary}
                                  </del>
                                ) : (
                                  <span>{contact?.email_primary}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {contact?.company_name}
                                  </del>
                                ) : (
                                  <span>{contact?.company_name}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {moment(contact?.updated_at).format(
                                      ' DD-MM-YY h:mm:ss',
                                    )}
                                  </del>
                                ) : (
                                  <span>
                                    {moment(contact?.updated_at).format(
                                      ' DD-MM-YY h:mm:ss',
                                    )}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {contact?.updated_by_name}
                                  </del>
                                ) : (
                                  <span>{contact?.updated_by_name}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {/* <div
                                  className={
                                    contact?.show_more 
                                      ? 'show_more_data expanded'
                                      : 'show_more_data'
                                  }
                                >
                                  <p className="description">
                                    {contact?.notes}
                                  </p>
                                  <ShowMoreHandler
                                    check={check}
                                    setCheck={setCheck}
                                    _id={contact._id}
                                    toggle={contact.show_more}
                                    elementData={contact?.notes}
                                  />
                                </div> */}
                                <div className="show_more_data">
                                  <p className="description">
                                    {contact?.notes}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {contact?.has_bookings && (
                                  <Link
                                    className="view_btn"
                                    to={`/bookings/?contactid=${contact._id}&contact=true`}
                                  >
                                    <img src={EyeIcon} alt="" />
                                  </Link>
                                )}
                              </TableCell>
                              <TableCell>
                                <ul className="action_wrap">
                                  <li>
                                    <Link
                                      className="btn_edit"
                                      state={{
                                        booking: 'contact',
                                      }} // Add state here for contact update
                                      to={`/contact/edit-contact/${contact._id}`}
                                    >
                                      <img src={EditIcon} alt="Edit" />
                                    </Link>
                                  </li>
                                  <li>
                                    <Button
                                      className="btn_warning"
                                      onClick={() => suspendContact(contact)}
                                    >
                                      Suspend
                                    </Button>
                                  </li>
                                  {!contact?.has_bookings &&
                                    !contact?.has_enquiries && (
                                      <li>
                                        <Button
                                          className="btn_border small"
                                          onClick={() => OpenDelete(contact)}
                                        >
                                          Delete
                                        </Button>
                                      </li>
                                    )}
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
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          activeIndexOfLastItem,
                          activeContactList?.flatMap(i => i.group_data)?.length,
                        )}{' '}
                        of{' '}
                        {activeContactList?.flatMap(i => i.group_data)?.length}{' '}
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
        </div>
        <div className="current_contact_wrap mt-3">
          {/* <h4 className="fw_600">Current Contacts</h4> */}
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
                      <span onClick={() => requestSortInActive('updated_at')}>
                        Updated at
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('updated_by_name')}
                      >
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
                  {itemsInActive.map((contact, index) => {
                    return (
                      <Fragment key={index}>
                        {contact?.is_cat ? (
                          <TableRow className="full_row">
                            <TableCell colSpan={9}>
                              Registered:{contact?.catName}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <Fragment>
                            {contact?.catName && (
                              <TableRow>
                                <TableCell>{contact?.catName}</TableCell>
                              </TableRow>
                            )}
                            <TableRow
                              className={contact?.deleted && `bg_highlight`}
                            >
                              <TableCell>
                                {contact?.has_enquiries && (
                                  <Link
                                    className="view_btn"
                                    to={`/enquiries/${contact._id}?contact=true`}
                                  >
                                    <img src={EyeIcon} alt="" />
                                  </Link>
                                )}
                              </TableCell>
                              <TableCell>
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {contact?.first_name +
                                      ' ' +
                                      contact?.surname}
                                  </del>
                                ) : (
                                  <Link
                                    to={`/contact/edit-contact/${contact._id}`}
                                    className="text_decoration"
                                  >
                                    {contact?.first_name +
                                      ' ' +
                                      contact?.surname}
                                  </Link>
                                )}
                              </TableCell>
                              <TableCell>
                                <span>
                                  {checkEmail(contact?.email_primary) ? (
                                    <img src={CheckIcon} alt="checkIcon" />
                                  ) : (
                                    <img src={CrossIcon} alt="CrossIcons" />
                                  )}
                                </span>{' '}
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {contact?.email_primary}
                                  </del>
                                ) : (
                                  <span>{contact?.email_primary}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {contact?.company_name}
                                  </del>
                                ) : (
                                  <span>{contact?.company_name}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {moment(contact?.updated_at).format(
                                      ' DD-MM-YY h:mm:ss',
                                    )}
                                  </del>
                                ) : (
                                  <span>
                                    {moment(contact?.updated_at).format(
                                      ' DD-MM-YY h:mm:ss',
                                    )}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {' '}
                                {contact?.deleted ? (
                                  <del className="m-0">
                                    {contact?.updated_by_name}
                                  </del>
                                ) : (
                                  <span>{contact?.updated_by_name}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {contact?.deleted ? (
                                  <del className="m-0">{contact?.notes}</del>
                                ) : (
                                  <span>{contact?.notes}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {contact?.has_bookings && (
                                  <Link
                                    className="view_btn"
                                    to={`/bookings/?contactid=${contact._id}`}
                                  >
                                    <img src={EyeIcon} alt="" />
                                  </Link>
                                )}
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
                                      Activate
                                    </Button>
                                  </li>
                                  {!contact?.has_bookings &&
                                    !contact?.has_enquiries && (
                                      <li>
                                        <Button
                                          className="btn_border small"
                                          onClick={() => OpenDelete(contact)}
                                        >
                                          Delete
                                        </Button>
                                      </li>
                                    )}
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
                        {' '}
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inactiveContactList?.flatMap(i => i.group_data)
                            ?.length,
                        )}{' '}
                        of{' '}
                        {
                          inactiveContactList?.flatMap(i => i.group_data)
                            ?.length
                        }{' '}
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
        onClickDelete={deleteContact}
        name={
          !deleteId?.deleted
            ? 'Are you sure you want to delete this contact? Note: this cannot be undone'
            : 'Are you sure you want to remove this contact from all future searches? Note: this cannot be undone from within'
        }
      />
      {/* <ShowMoreInitializer data={activeCurrentData} setState={setCheck} /> */}
    </div>
  );
}
