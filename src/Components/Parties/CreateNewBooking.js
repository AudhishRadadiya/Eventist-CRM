import { useEffect, useMemo, useState, Fragment } from 'react';
import * as Yup from 'yup';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { ErrorMessage, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Breadcrumbs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  alpha,
  InputBase,
  Pagination,
  Stack,
  Checkbox,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';

import { capitalizeSentence, getTotalPages } from 'utils/common';
import { contactTypes } from 'utils/FieldValues';
import useGroupSortable from 'utils/useGroupSortable';
import { getAllPageData2, getPageListData2 } from 'utils/gropingPagination';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DataNotFound from 'Components/Common/DataNotFound';
import {
  createEnquiry,
  setIsEnquirieCreated,
} from 'store/reducers/Enquiry/enquiries.slice';
import {
  getAccountData,
  updateAccount,
} from 'store/reducers/Contact/account.slice';
import {
  getContactListData,
  setIsContactUpdated,
} from 'store/reducers/Contact/contact.slice';

import EyeIcon from '../../Assets/Img/eye.svg';
import EditIcon from '../../Assets/Img/edit.svg';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import Loader from 'Components/Common/Loader';
import {
  createInstantBooking,
  setIsInstantBookingUpdated,
} from 'store/reducers/Booking/booking.slice';
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '12px',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 19,
            top: 19,
            color: theme => theme.palette.grey[600],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
let pageSize = 10;

export default function CreateNewBooking() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { eventDateId } = useParams();
  const navigate = useNavigate();
  const { isAccountUpdated, accountDetail } = useSelector(
    ({ account }) => account,
  );
  const {
    isInstantBookingUpdated,
    CreatedInstantBookingEnquiryId,
    bookingLoading,
  } = useSelector(({ booking }) => booking);

  const { userPermissionDetail } = useSelector(({ user }) => user);
  const {
    activeContactList,
    inactiveContactList,
    isContactUpdated,
    contactListLoading,
  } = useSelector(({ contact }) => contact);
  const { activeVenueList } = useSelector(({ venue }) => venue);
  const { isEnquirieCreated, createEnquiries, enquirieLoading } = useSelector(
    ({ enquiries }) => enquiries,
  );

  // const [places, setPlaces] = useState([]);
  const [places, setPlaces] = useState({
    active: {},
    inActive: {},
  });
  const [editAccountPopup, setEditAccountPopup] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  // const [placesErrors, setPlaceErrors] = useState([]);

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const inActiveIndexOfLastItem = currentPage.inActiveCurrentPage * pageSize;
  const inActiveIndexOfFirstItem = inActiveIndexOfLastItem - pageSize;
  const [autoSentenceCase, setAutoSentenceCase] = useState(false);
  const [activeAccountListArray, setActiveAccountListArray] = useState([]);
  const [inActiveAccountListArray, setInActiveAccountListArray] = useState([]);
  const [activeAllPageData, setActiveAllPageData] = useState([]);
  const [inActiveAllPageData, setInActiveAllPageData] = useState([]);
  const [searchBusinessOrPartyNameQuery, setSearchBusinessOrPartyNameQuery] =
    useState('');
  const [searchContactNameQuery, setSearchContactNameQuery] = useState('');
  const [searchContactEmailQuery, setSearchContactEmailQuery] = useState('');
  const [searchAccountPostCodeQuery, setSearchAccountPostCodeQuery] =
    useState('');
  const [check, setCheck] = useState([]);

  const initialValuesAccount = {
    type: '',
    name: '',
    handle: '',
    address_line_1: '',
    address_line_2: '',
    address_line_3: '',
    address_line_4: '',
    city: '',
    country: '',
    postcode: '',
    primary_event_location: null,
    secondary_event_location: null,
    tertiary_event_location: null,
    invoice_account_automatically: '',
    internal_notes: '',
    public_notes: '',
    is_active: true,
    update_contact_addresses: null,
  };

  const [accountsInitialValues, setAccountInitialValues] =
    useState(initialValuesAccount);

  const addEditAccountSchema = Yup.object().shape({
    type: Yup.string().required('Type is a required field'),
    name: Yup.string()
      .matches(/^[^\s]/, 'Name cannot include leading spaces')
      .required('Name is a required field'),
    city: Yup.string().required('City is a required field'),
    country: Yup.string().required('Country is a required field'),
    postcode: Yup.string().required('PostCode is a required field'),
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    setSearchBusinessOrPartyNameQuery(params?.contact_name || '');
    setSearchContactNameQuery(params?.company_name || '');
    setSearchAccountPostCodeQuery(params?.post_code || '');

    if (Object.keys(params).length > 0) {
      dispatch(
        getContactListData({
          company_name: params?.company_name?.trim() || '',
          contact_name: params?.contact_name?.trim() || '',
          email_primary: params?.email_primary?.trim() || '',
          post_code: params?.post_code?.trim() || '',
        }),
      );
    }
  }, [location.search]);

  const handleSearch = () => {
    navigate(
      `/create-new-booking/${eventDateId}?company_name=${searchBusinessOrPartyNameQuery.trim()}&contact_name=${searchContactNameQuery.trim()}&email_primary=${searchContactEmailQuery.trim()}&post_code=${searchAccountPostCodeQuery.trim()}`,
    );
    // dispatch(
    //   getContactListData({
    //     company_name: searchBusinessOrPartyNameQuery.trim(),
    //     contact_name: searchContactNameQuery.trim(),
    //     email_primary: searchContactEmailQuery.trim(),
    //     post_code: searchAccountPostCodeQuery.trim(),
    //   }),
    // );
  };

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

  const CloseEditCoupon = () => {
    setEditAccountPopup(false);
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
    check,
  );
  const { itemsInActive, requestSortInActive } = useGroupSortable(
    currentPage.inActiveCurrentPage,
    inActiveCurrentData,
  );

  useEffect(() => {
    if (accountId) {
      setEditAccountPopup(true);
      dispatch(getAccountData(accountId));
      setAccountId('');
    }
  }, [dispatch, accountId]);

  useEffect(() => {
    if (Object.keys(accountDetail)?.length > 0) {
      setAccountInitialValues({
        type: accountDetail?.type ? accountDetail?.type : '',
        name: accountDetail?.name ? accountDetail?.name : '',
        handle: accountDetail?.handle ? accountDetail?.handle : '',
        address_line_1: accountDetail?.address_line_1
          ? accountDetail?.address_line_1
          : '',
        address_line_2: accountDetail?.address_line_2
          ? accountDetail?.address_line_2
          : '',
        address_line_3: accountDetail?.address_line_3
          ? accountDetail?.address_line_3
          : '',
        address_line_4: accountDetail?.address_line_4
          ? accountDetail?.address_line_4
          : '',
        city: accountDetail?.city ? accountDetail?.city : '',
        country: accountDetail?.country ? accountDetail?.country : '',
        postcode: accountDetail?.postcode ? accountDetail?.postcode : '',
        primary_event_location: accountDetail?.primary_event_location
          ? accountDetail?.primary_event_location
          : '',
        secondary_event_location: accountDetail?.secondary_event_location
          ? accountDetail?.secondary_event_location
          : '',
        tertiary_event_location: accountDetail?.tertiary_event_location
          ? accountDetail?.tertiary_event_location
          : '',
        invoice_account_automatically:
          accountDetail?.invoice_account_automatically
            ? accountDetail?.invoice_account_automatically
            : '',
        internal_notes: accountDetail?.internal_notes
          ? accountDetail?.internal_notes
          : '',
        public_notes: accountDetail?.public_notes
          ? accountDetail?.public_notes
          : '',
        update_contact_addresses: accountDetail?.update_contact_addresses,
        is_active: accountDetail?.is_active ? accountDetail?.is_active : false,
      });
    }
  }, [accountDetail]);

  useEffect(() => {
    if (isAccountUpdated) {
      setEditAccountPopup(false);
    }
  }, [isAccountUpdated]);
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

  useEffect(() => {
    if (isContactUpdated) {
      dispatch(getContactListData());
      dispatch(setIsContactUpdated(false));
    }
  }, [dispatch, isContactUpdated]);

  useEffect(() => {
    if (isEnquirieCreated) {
      navigate(`/edit-enquiries/${createEnquiries?.enquiry_id}`);
      dispatch(setIsEnquirieCreated(false));
    }
  }, [dispatch, isEnquirieCreated, navigate]);

  useEffect(() => {
    if (isInstantBookingUpdated) {
      navigate(`/edit-bookings/${CreatedInstantBookingEnquiryId}`);
      dispatch(setIsInstantBookingUpdated(false));
    }
  }, [dispatch, isInstantBookingUpdated, navigate]);

  const handleInputChange = (e, index, name) => {
    const { value } = e.target;
    setPlaces(prevPlaces => {
      return {
        ...prevPlaces,
        [name]: {
          ...prevPlaces[name],
          [index]: {
            ...prevPlaces[name][index],
            place: value,
            errorMessage: '',
          },
        },
      };
    });
  };

  const handleBookOrEnquiry = (
    contactId,
    eventDateId,
    actionType,
    index,
    name,
  ) => {
    if (Object.keys(places[name])?.length > 0) {
      setPlaces({
        ...places,
        [name]: {
          ...places[name],
          [index]: {
            ...places[name][index],
            errorMessage: '',
          },
        },
      });
      if (places[name][index]?.place !== '') {
        setPlaces({
          ...places,
          [name]: {
            ...places[name],
            [index]: {
              ...places[name][index],
              errorMessage: '',
            },
          },
        });
        if (actionType === 'book') {
          dispatch(
            createInstantBooking({
              contact_id: contactId,
              event_date_id: eventDateId,
              places: places[name][index]?.place,
            }),
          );
          // setPlaceErrors(prevErrors => {
          //   const updatedErrors = [...prevErrors];
          //   updatedErrors[index] = '';
          //   return updatedErrors;
          // });
        } else if (actionType === 'enquiry') {
          dispatch(
            createEnquiry({
              contact_id: contactId,
              event_date_id: eventDateId,
              places: places[name][index]?.place,
            }),
          );
        }
      }
    } else {
      setPlaces({
        ...places,
        [name]: {
          ...places[name],
          [index]: {
            errorMessage: 'Please enter a valid number of places',
            place: '',
          },
        },
      });
    }
  };

  return (
    <>
      <div className="inner_wrapper">
        {(contactListLoading || bookingLoading || enquirieLoading) && (
          <Loader />
        )}
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Link to="/parties">Parties</Link>
            <Link to="/event-dashboard">Event Dashboard</Link>
            <Typography>Create New Booking</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Create New Booking</h1>
        </div>
        <div className="add_new_booking_wrap bg_white_box p-3 mb-4">
          <h2 className="mb-4">Add New Booking</h2>
          <h3 className="mb-3">
            Has this customer/company booked or enquired in the past?
          </h3>
          <h4>Lookup Details</h4>
          <p>
            Please enter the customer email address to check if they are already
            listed:
          </p>
          <div className="email_wrap mb-3">
            <h2 className="mb-3">Email Address</h2>
            <div className="form-group">
              <div className="input_wrap">
                <input
                  type="email"
                  placeholder="Result display as you type"
                  className="form-control"
                  value={searchContactEmailQuery}
                  onChange={e => setSearchContactEmailQuery(e.target.value)}
                />
                <small>(Press Enter to search)</small>
              </div>
              <button
                className="btn_border"
                disabled={!searchContactEmailQuery}
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          <p className="m-0">
            Or you can enter part of the customers details in the correct search
            box and press Enter to lookup results. For more details click the
            magnifying glass to the far right.
          </p>
        </div>
        <div className="table_main_Wrapper vertical_top mb-4">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '20%' }}>
                    Company / Party Booking Name
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>Contact Name</TableCell>
                  <TableCell>Contact Postcode</TableCell>
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
                        placeholder="Results display as you type"
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
                        placeholder="Results display as you type"
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
                    <div className="d-flex">
                      <Search className="search_with_icon">
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Results display as you type"
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
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="create_contact_parties">
          <h2>Create New Contact</h2>
          <p>
            If you cannot find a valid account for this customer then please
            create a new contact using
          </p>
          <button
            className="btn_primary small"
            onClick={() =>
              navigate(
                `/contact/add-contact?data=${eventDateId}&email=${searchContactEmailQuery}&name=${searchContactNameQuery}`,
                {
                  state: {
                    email: searchContactEmailQuery,
                    name: searchContactNameQuery,
                    event_id: eventDateId,
                  },
                },
              )
            }
          >
            Add New Contact
          </button>
        </div>
        <div className="current_contact_wrap mt-3">
          <h4 className="fw_600">Current Contacts</h4>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Bookings</TableCell>
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
                      <span onClick={() => requestSortActive('')}>Account</span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortActive('telephone_primary')}
                      >
                        Telephone
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('post_code')}>
                        Postcode
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('notes')}>
                        Contact Notes
                      </span>
                    </TableCell>
                    <TableCell></TableCell>
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
                            <TableRow>
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
                                <Link
                                  to={`/contact/edit-contact/${contact._id}`}
                                  className="text_decoration"
                                >
                                  {contact?.first_name + ' ' + contact?.surname}
                                </Link>
                              </TableCell>
                              <TableCell>{contact?.email_primary}</TableCell>
                              <TableCell>
                                {contact?.account_id && (
                                  <button
                                    className="btn_edit"
                                    onClick={() => {
                                      setAccountId(contact?.account_id);
                                    }}
                                  >
                                    <img src={EditIcon} alt="Edit" />
                                  </button>
                                )}
                                {contact?.company_name}
                              </TableCell>
                              <TableCell>
                                {contact?.telephone_primary}
                              </TableCell>
                              <TableCell>{contact?.post_code}</TableCell>
                              <TableCell>
                                <div
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
                                </div>
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
                                    <input
                                      type="number"
                                      onWheel={e => e.target.blur()}
                                      placeholder=""
                                      className="form-control"
                                      name="places"
                                      value={
                                        places?.active[
                                          activeIndexOfFirstItem + 1 + index
                                        ]?.place || ''
                                      }
                                      onChange={e =>
                                        handleInputChange(
                                          e,
                                          activeIndexOfFirstItem + 1 + index,
                                          'active',
                                        )
                                      }
                                    />

                                    {places?.active[
                                      activeIndexOfFirstItem + 1 + index
                                    ]?.errorMessage !== '' && (
                                      <span className="d-block text-danger text_small">
                                        {
                                          places?.active[
                                            activeIndexOfFirstItem + 1 + index
                                          ]?.errorMessage
                                        }
                                      </span>
                                    )}
                                  </li>
                                  {/* {contact?.has_enquiries && eventDateId && ( */}
                                  {/* change by pratap as per santosh confined  */}
                                  {/* {!eventDateId && ( */}
                                  {(userPermissionDetail?.admin ||
                                    userPermissionDetail?.minplaces) && (
                                    <li>
                                      <button
                                        className="btn_border small"
                                        onClick={() =>
                                          handleBookOrEnquiry(
                                            contact._id,
                                            eventDateId,
                                            'book',
                                            activeIndexOfFirstItem + 1 + index,
                                            'active',
                                          )
                                        }
                                      >
                                        Book
                                      </button>
                                    </li>
                                  )}
                                  {/* )} */}
                                  <li>
                                    <button
                                      className="btn_border small"
                                      onClick={() =>
                                        handleBookOrEnquiry(
                                          contact._id,
                                          eventDateId,
                                          'enquiry',
                                          activeIndexOfFirstItem + 1 + index,
                                          'active',
                                        )
                                      }
                                    >
                                      Enquire
                                    </button>
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
          <h5 className="text_primary">inactive :</h5>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Bookings</TableCell>
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
                      <span onClick={() => requestSortInActive('')}>
                        Account
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('telephone_primary')}
                      >
                        Telephone
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('post_code')}>
                        Postcode
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('notes')}>
                        Contact Notes
                      </span>
                    </TableCell>
                    <TableCell></TableCell>
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
                            <TableRow>
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
                                <Link
                                  to={`/contact/edit-contact/${contact._id}`}
                                  className="text_decoration"
                                >
                                  {contact?.first_name + ' ' + contact?.surname}
                                </Link>
                              </TableCell>
                              <TableCell>{contact?.email_primary}</TableCell>
                              <TableCell>
                                {contact?.account_id && (
                                  <button
                                    className="btn_edit"
                                    onClick={() => {
                                      setAccountId(contact?.account_id);
                                    }}
                                  >
                                    <img src={EditIcon} alt="Edit" />
                                  </button>
                                )}
                                {contact?.company_name}
                              </TableCell>
                              <TableCell>
                                {contact?.telephone_primary}
                              </TableCell>
                              <TableCell>{contact?.post_code}</TableCell>
                              <TableCell>{contact?.notes}</TableCell>
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
                                    <input
                                      type="number"
                                      onWheel={e => e.target.blur()}
                                      placeholder=""
                                      className="form-control"
                                      name="places"
                                      onChange={e =>
                                        handleInputChange(e, index, 'inActive')
                                      }
                                    />
                                  </li>
                                  <li>
                                    <button
                                      className="btn_border small"
                                      onClick={() => {
                                        dispatch(
                                          createInstantBooking({
                                            contact_id: contact?._id,
                                            event_date_id: eventDateId,
                                            places: places[index]?.places,
                                          }),
                                        );
                                      }}
                                    >
                                      Book
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="btn_border small"
                                      onClick={() => {
                                        dispatch(
                                          createEnquiry({
                                            contact_id: contact?._id,
                                            event_date_id: eventDateId,
                                            places: places[index]?.places,
                                          }),
                                        );
                                      }}
                                    >
                                      Enquire
                                    </button>
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

      <BootstrapDialog
        aria-labelledby="CancelBooking-title"
        open={editAccountPopup}
        className="small_popup"
      >
        <BootstrapDialogTitle id="editAccount-title" onClose={CloseEditCoupon}>
          Edit Account
        </BootstrapDialogTitle>
        <Formik
          enableReinitialize={true}
          initialValues={accountsInitialValues}
          validationSchema={addEditAccountSchema}
          onSubmit={values => {
            const capitalizedObject = {
              ...values,
              name: capitalizeSentence(values?.name),
              handle: capitalizeSentence(values?.handle),
            };

            let newValues = autoSentenceCase ? capitalizedObject : values;
            if (Object.keys(accountDetail).length > 0) {
              dispatch(
                updateAccount({
                  _id: accountDetail?._id,
                  account: newValues,
                }),
              );
            }
          }}
        >
          {({
            handleSubmit,
            handleChange,
            setFieldValue,
            values,
            getFieldProps,
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="add_account_wrap bg_white_box p-3">
                <Row>
                  <Col xxl={12}>
                    <ul className="mb-4">
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Account Type
                              <span className="text_primary">*</span>:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormControl className="w-50">
                              <Select
                                labelId="Method-label"
                                id="Method-select"
                                name="type"
                                value={values?.type}
                                onChange={handleChange}
                                className="select_wrap"
                              >
                                <MenuItem value="Select" disabled>
                                  Select
                                </MenuItem>
                                {contactTypes?.map((item, index) => {
                                  return (
                                    <MenuItem value={item?.id} key={index}>
                                      {item?.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="type" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Company/Account Name
                              <span className="text_primary">*</span>:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <div className="form-group checkbox_wrap m-0">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="auto_sentence"
                                      checked={autoSentenceCase}
                                      onChange={() => {
                                        setAutoSentenceCase(!autoSentenceCase);
                                      }}
                                    />
                                  }
                                  label="Auto Sentence Case"
                                  className="mb-2"
                                />
                              </div>
                              <FormControl className="w-75">
                                <TextField
                                  id="AccountName"
                                  {...getFieldProps('name')}
                                  value={
                                    autoSentenceCase
                                      ? capitalizeSentence(values?.name)
                                      : values?.name
                                  }
                                  onChange={e => {
                                    setFieldValue('name', e.target.value);
                                    setFieldValue('handle', e.target.value);
                                  }}
                                  variant="outlined"
                                  placeholder="Enter name"
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="name" />
                              </span>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Account Handle:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl className="w-75">
                                <TextField
                                  id="AccountHandle"
                                  {...getFieldProps('handle')}
                                  value={
                                    autoSentenceCase
                                      ? capitalizeSentence(values?.handle)
                                      : values?.handle
                                  }
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                />
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                    </ul>
                    <h4 className="fw_600">Default Address Information</h4>
                    <ul className="mb-4">
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Address Line 1 :
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="AddressLine1"
                                  {...getFieldProps('address_line_1')}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                  rows={1.5}
                                  multiline
                                />
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Address Line 2 :
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="AddressLine2"
                                  {...getFieldProps('address_line_2')}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                  rows={1.5}
                                  multiline
                                />
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Address Line 3 :
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="AddressLine3"
                                  {...getFieldProps('address_line_3')}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                  rows={1.5}
                                  multiline
                                />
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Address Line 4 :
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="AddressLine4"
                                  {...getFieldProps('address_line_4')}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                  rows={1.5}
                                  multiline
                                />
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              City<span className="text_primary">*</span>:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl className="w-75">
                                <TextField
                                  id="AddressLine2"
                                  {...getFieldProps('city')}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter city name"
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="city" />
                              </span>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              County<span className="text_primary">*</span>:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl className="w-75">
                                <TextField
                                  id="AddressLine2"
                                  {...getFieldProps('country')}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter country name"
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="country" />
                              </span>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Postcode<span className="text_primary">*</span>:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl className="w-75">
                                <TextField
                                  id="AddressLine2"
                                  {...getFieldProps('postcode')}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter postcode"
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="postcode" />
                              </span>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Primary Event Location
                              <span className="text_primary">*</span>:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormControl className="w-75">
                              <Select
                                labelId="Method-label"
                                id="Method-select"
                                name="primary_event_location"
                                value={values?.primary_event_location}
                                onChange={handleChange}
                                className="select_wrap"
                              >
                                <MenuItem value="Select" disabled>
                                  Select
                                </MenuItem>
                                {activeVenueList?.map(item => {
                                  return (
                                    <MenuItem key={item?._id} value={item?._id}>
                                      {item?.sku}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Secondary Event Location
                              <span className="text_primary">*</span>:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormControl className="w-75">
                              <Select
                                labelId="Method-label"
                                id="Method-select"
                                name="secondary_event_location"
                                value={values?.secondary_event_location}
                                onChange={handleChange}
                                className="select_wrap"
                                defaultValue="Select"
                              >
                                <MenuItem value="Select" disabled>
                                  Select
                                </MenuItem>
                                {activeVenueList?.map(item => {
                                  return (
                                    <MenuItem key={item?._id} value={item?._id}>
                                      {item?.sku}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Tertiary Event Location
                              <span className="text_primary">*</span>:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormControl className="w-75">
                              <Select
                                labelId="Method-label"
                                id="Method-select"
                                name="tertiary_event_location"
                                value={values?.tertiary_event_location}
                                onChange={handleChange}
                                className="select_wrap"
                                defaultValue="Select"
                              >
                                <MenuItem value="Select" disabled>
                                  Select
                                </MenuItem>
                                {activeVenueList?.map(item => {
                                  return (
                                    <MenuItem key={item?._id} value={item?._id}>
                                      {item?.sku}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Invoice Account Automatically:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="InvoiceAccount"
                                  name="InvoiceAccount-group"
                                  className="custom_radio"
                                  defaultValue={
                                    values?.invoice_account_automatically
                                  }
                                  value={values?.invoice_account_automatically}
                                  onChange={e => {
                                    setFieldValue(
                                      'invoice_account_automatically',
                                      Number(e.target.value),
                                    );
                                  }}
                                >
                                  <FormControlLabel
                                    value={1}
                                    control={<Radio />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value={2}
                                    control={<Radio />}
                                    label="No"
                                  />
                                  <FormControlLabel
                                    value={3}
                                    control={<Radio />}
                                    label="Yes if booking has discount"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Account Internal Notes:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="AccountInternalNotes"
                                  {...getFieldProps('internal_notes')}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                  rows={1.5}
                                  multiline
                                />
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">
                              Account Public Notes:
                            </label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl>
                                <TextField
                                  id="AccountPublicNotes"
                                  {...getFieldProps('public_notes')}
                                  variant="outlined"
                                  className="input_wrap"
                                  placeholder="Enter"
                                  rows={1.5}
                                  multiline
                                />
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <li className="bg_gray_box px-3 py-2 mb-2">
                        <Row className="align-items-center">
                          <Col xs={4}>
                            <label className="text_small fw_500">Active:</label>
                          </Col>
                          <Col xs={8}>
                            <FormGroup>
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="InvoiceAccount"
                                  defaultValue="ActiveYes"
                                  name="Active-group"
                                  className="custom_radio"
                                  value={values?.is_active}
                                  onChange={() =>
                                    setFieldValue(
                                      'is_active',
                                      !values?.is_active,
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    value={true}
                                    control={<Radio />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label="No"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                    </ul>
                    <Button type="submit" className="btn_primary small">
                      Save
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          )}
        </Formik>
      </BootstrapDialog>
      <ShowMoreInitializer data={activeCurrentData} setState={setCheck} />
    </>
  );
}
