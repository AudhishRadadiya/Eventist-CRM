import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import ListItemText from '@mui/material/ListItemText';
import {
  billableItemsOrderedList,
  commonSelectConditionList,
  contactTypeConditionList,
  contactTypes,
  eTicketsSentList,
  enquiriesList,
  invoicedList,
  resultsOrderList,
  resultsOrderYearList,
  searchList,
  yearSelectConditionList,
  yearsArray,
} from 'utils/FieldValues';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearData,
  getGlobalSearch,
} from 'store/reducers/SearchPanel/globalSearch.slice';
import { OutlinedInput, Tooltip } from '@mui/material';
import { getThemeListData } from 'store/reducers/Admin/Events/theme.slice';
import { getVenueListData } from 'store/reducers/Admin/Events/venue.slice';
import { getPaymentOptionsListData } from 'store/reducers/Admin/Financial/paymentOptions.slice';
import { getUserListData } from '../../store/reducers/User/user.slice';
import SearchResult from './SearchResult';
import Loader from './Loader';
import GetCookies from 'hooks/GetCookies';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';

const pageSize = 10;

const Accordion = styled(props => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `0`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled(props => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '14px' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#F3F7FC',
  flexDirection: 'row',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  borderRadius: `10px`,
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '0',
}));

export default function SearchPanel({
  setRoute,
  setSearchData,
  setSearchHeaderData,
}) {
  const dispatch = useDispatch();
  const userData = GetCookies('UserSessionCRM');

  const { globalSearchLoading } = useSelector(
    ({ globalSearch }) => globalSearch,
  );

  const { activeThemeList } = useSelector(({ theme }) => theme);
  const { activeVenueList } = useSelector(({ venue }) => venue);
  const { activePaymentOptionsList } = useSelector(
    ({ paymentOptions }) => paymentOptions,
  );
  const { activeUserList } = useSelector(({ user }) => user);

  const [expanded, setExpanded] = useState('panel1');
  const [expandedInner, setExpandedInner] = useState('panel3');

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (userData) {
      dispatch(getThemeListData());
      dispatch(getVenueListData());
      dispatch(getPaymentOptionsListData());
      dispatch(getUserListData());
    }
  }, [dispatch]);

  const innerhandleChange = panel => (event, newExpanded) => {
    setExpandedInner(newExpanded ? panel : false);
  };
  const [selectAll, setSelectAll] = useState({
    name: '',
    all: false,
  });
  const [selectMultiple, setSelectMultiple] = useState({
    year: new Date().getFullYear(),
    contact_type: [],
    createdBy: [],
    last_updated_by: [],
  });
  const [betweenValue, setBetweenValue] = useState({
    places: { graterValue: '', lessValue: '' },
    first_confirmed_date: { graterValue: '', lessValue: '' },
    days_left: { graterValue: '', lessValue: '' },
    due: { graterValue: '', lessValue: '' },
    discount: { graterValue: '', lessValue: '' },
    paid: { graterValue: '', lessValue: '' },
  });
  const [result, setResult] = useState('');
  const handleChangeYear = (name, event) => {
    setSelectMultiple(prevState => ({
      ...prevState,
      [name]: event.target.value,
    }));
    setSelectAll({
      name: name,
      all:
        name === 'year'
          ? event.target.value.length === yearsArray.length
          : name === 'contact_type'
          ? event.target.value.length === contactTypes.length
          : name === 'createdBy'
          ? event.target.value.length === activeUserList.length
          : [],
    });
  };

  const handleSelectAll = name => {
    setSelectAll({ all: !selectAll.all, name: name });
    setSelectMultiple(prevState => ({
      ...prevState,
      [name]: !selectAll.all
        ? name === 'year'
          ? yearsArray
          : name === 'contact_type'
          ? contactTypes.map(item => item?.id)
          : name === 'createdBy'
          ? activeUserList?.map(activeUser => activeUser?._id)
          : (name = 'last_updated_by'
              ? activeUserList?.map(activeUser => activeUser?._id)
              : [])
        : [],
    }));
  };
  const [searchingPanel, setSearchingPanel] = useState({
    ref_no: '',
    showIn: 1,
    bookingReference: true,
    enquiries: 'both',
    include: '',
    cancelled_booking: false,
    exclusive_only: false,
    location: 'All',
    theme: 'All',
    year: {
      eq: '',
      ne: '',
      gt: '',
      gte: '',
      lt: '',
      lte: '',
      multiple: [],
    },
    yearCondition: 1,
    placesCondition: 1,
    provisional: true,
    confirmed: false,
    places_is: '',
    places: '',
    firstConfirmedDate: 1,
    first_confirmed_date: '',
    firstConfirmedDateTxt: '',
    dayLeftCondition: 1,
    days_left: '',
    dueSelect: 1,
    due: '',
    paidSelect: 1,
    paid_is: '',
    discountSelect: 1,
    discount_is: '',
    group_payment: true,
    total_paid: false,
    paid: '',
    groupPayments: false,
    totalPaid: false,
    method: 'All',
    contactTypeCondition: 1,
    contact_type: {
      eq: '',
      ne: '',
      multiple: [],
    },
    invoiced: 'All',
    eTicketsSent: 'All',
    billableItemsOrdered: 'All',
    resultsOrder: 'ref_no',
    asd_dsd: 1,
    showSQL: false,
    showData: false,
  });

  const handleSubmit = () => {
    const {
      bookingReference,
      ref_no,
      enquiries,
      provisional,
      confirmed,
      exclusive_only,
      cancelled_booking,
      group_payment,
      total_paid,
      yearCondition,
      placesCondition,
      places,
      method,
      invoiced,
      theme,
      location,
      eTicketsSent,
      billableItemsOrdered,
      resultsOrder,
      asd_dsd,
      paidSelect,
      paid,
      contactTypeCondition,
      firstConfirmedDate,
      first_confirmed_date,
      days_left,
      dayLeftCondition,
      due,
      dueSelect,
      showSQL,
      showData,
      discount,
      discountSelect,
    } = searchingPanel;
    dispatch(clearData());
    setSearchHeaderData(null);
    const data = {
      ref_no: ref_no.trim(),
      enquiries: enquiries,
      search_ref: bookingReference,
      include:
        exclusive_only && cancelled_booking
          ? 'both'
          : exclusive_only
          ? 'exclusive_only'
          : cancelled_booking
          ? 'cancelled_booking'
          : '',
      year: {
        eq:
          yearCondition === 1
            ? selectMultiple?.year
              ? selectMultiple?.year.toString()
              : ''
            : '',
        ne:
          yearCondition === 2
            ? selectMultiple?.year
              ? selectMultiple?.year.toString()
              : ''
            : '',
        gt:
          yearCondition === 3
            ? selectMultiple?.year
              ? selectMultiple?.year.toString()
              : ''
            : '',
        gte:
          yearCondition === 4
            ? selectMultiple?.year
              ? selectMultiple?.year.toString()
              : ''
            : '',
        lt:
          yearCondition === 5
            ? selectMultiple?.year
              ? selectMultiple?.year.toString()
              : ''
            : '',
        lte:
          yearCondition === 6
            ? selectMultiple?.year
              ? selectMultiple?.year.toString()
              : ''
            : '',
        multiple: yearCondition === 7 ? selectMultiple?.year : [],
      },
      theme: theme == 'All' ? '' : theme,
      location: location == 'All' ? '' : location,
      places_is:
        provisional && confirmed
          ? 'both'
          : provisional
          ? 'provisional'
          : confirmed
          ? 'confirmed'
          : '',
      places: {
        eq: placesCondition === 1 ? (places ? places.toString() : '') : '',
        ne: placesCondition === 2 ? (places ? places.toString() : '') : '',
        gt: placesCondition === 3 ? (places ? places.toString() : '') : '',
        gte: placesCondition === 4 ? (places ? places.toString() : '') : '',
        lt: placesCondition === 5 ? (places ? places.toString() : '') : '',
        lte: placesCondition === 6 ? (places ? places.toString() : '') : '',
        multiple:
          betweenValue?.places?.lessValue && betweenValue?.places?.graterValue
            ? [
                betweenValue?.places?.graterValue,
                betweenValue?.places?.lessValue,
              ]
            : [],
      },
      method: method == 'All' ? '' : method,
      invoiced: invoiced == 'All' ? '' : invoiced,
      e_ticket_send: eTicketsSent == 'All' ? '' : eTicketsSent,
      billable_items_ordered:
        billableItemsOrdered == 'All' ? '' : billableItemsOrdered,
      results_order: resultsOrder,
      asd_dsd: asd_dsd,
      first_confirmed_date: {
        eq:
          firstConfirmedDate === 1
            ? first_confirmed_date
              ? moment(new Date(first_confirmed_date)).format('YYYY-MM-DD')
              : ''
            : '',
        ne:
          firstConfirmedDate === 2
            ? first_confirmed_date
              ? moment(new Date(first_confirmed_date)).format('YYYY-MM-DD')
              : ''
            : '',
        gt:
          firstConfirmedDate === 3
            ? first_confirmed_date
              ? moment(new Date(first_confirmed_date)).format('YYYY-MM-DD')
              : ''
            : '',
        gte:
          firstConfirmedDate === 4
            ? first_confirmed_date
              ? moment(new Date(first_confirmed_date)).format('YYYY-MM-DD')
              : ''
            : '',
        lt:
          firstConfirmedDate === 5
            ? first_confirmed_date
              ? moment(new Date(first_confirmed_date)).format('YYYY-MM-DD')
              : ''
            : '',
        lte:
          firstConfirmedDate === 6
            ? first_confirmed_date
              ? moment(new Date(first_confirmed_date)).format('YYYY-MM-DD')
              : ''
            : '',
        multiple:
          betweenValue?.first_confirmed_date?.lessValue &&
          betweenValue?.first_confirmed_date?.graterValue
            ? [
                moment(
                  new Date(betweenValue?.first_confirmed_date?.graterValue),
                ).format('YYYY-MM-DD'),
                moment(
                  new Date(betweenValue?.first_confirmed_date?.lessValue),
                ).format('YYYY-MM-DD'),
              ]
            : [],
      },
      days_left: {
        eq: dayLeftCondition === 1 ? (days_left ? days_left : '') : '',
        ne: dayLeftCondition === 2 ? (days_left ? days_left : '') : '',
        gt: dayLeftCondition === 3 ? (days_left ? days_left : '') : '',
        gte: dayLeftCondition === 4 ? (days_left ? days_left : '') : '',
        lt: dayLeftCondition === 5 ? (days_left ? days_left : '') : '',
        lte: dayLeftCondition === 6 ? (days_left ? days_left : '') : '',
        multiple:
          betweenValue?.days_left?.lessValue &&
          betweenValue?.days_left?.graterValue
            ? [
                betweenValue?.days_left?.graterValue,
                betweenValue?.days_left?.lessValue,
              ]
            : [],
      },
      due: {
        eq: dueSelect === 1 ? (due ? due.toString() : '') : '',
        ne: dueSelect === 2 ? (due ? due.toString() : '') : '',
        gt: dueSelect === 3 ? (due ? due.toString() : '') : '',
        gte: dueSelect === 4 ? (due ? due.toString() : '') : '',
        lt: dueSelect === 5 ? (due ? due.toString() : '') : '',
        lte: dueSelect === 6 ? (due ? due.toString() : '') : '',
        multiple:
          betweenValue?.due?.lessValue && betweenValue?.due?.graterValue
            ? [betweenValue?.due?.graterValue, betweenValue?.due?.lessValue]
            : [],
      },
      paid: {
        eq: paidSelect === 1 ? (paid ? paid.toString() : '') : '',
        ne: paidSelect === 2 ? (paid ? paid.toString() : '') : '',
        gt: paidSelect === 3 ? (paid ? paid.toString() : '') : '',
        gte: paidSelect === 4 ? (paid ? paid.toString() : '') : '',
        lt: paidSelect === 5 ? (paid ? paid.toString() : '') : '',
        lte: paidSelect === 6 ? (paid ? paid.toString() : '') : '',
        multiple:
          betweenValue?.paid?.lessValue && betweenValue?.paid?.graterValue
            ? [betweenValue?.paid?.graterValue, betweenValue?.paid?.lessValue]
            : [],
      },
      paid_is:
        group_payment && total_paid
          ? 'both'
          : group_payment
          ? 'group_payment'
          : total_paid
          ? 'total_paid'
          : '',
      discount: {
        eq: discountSelect === 1 ? (discount ? discount.toString() : '') : '',
        ne: discountSelect === 2 ? (discount ? discount.toString() : '') : '',
        gt: discountSelect === 3 ? (discount ? discount.toString() : '') : '',
        gte: discountSelect === 4 ? (discount ? discount.toString() : '') : '',
        lt: discountSelect === 5 ? (discount ? discount.toString() : '') : '',
        lte: discountSelect === 6 ? (discount ? discount.toString() : '') : '',
        multiple:
          betweenValue?.discount?.lessValue &&
          betweenValue?.discount?.graterValue
            ? [
                betweenValue?.discount?.graterValue,
                betweenValue?.discount?.lessValue,
              ]
            : [],
      },
      contact_type: {
        eq:
          contactTypeCondition === 1 ? selectMultiple?.contact_type ?? '' : '',
        ne:
          contactTypeCondition === 2 ? selectMultiple?.contact_type ?? '' : '',
        multiple:
          contactTypeCondition === 3 ? selectMultiple?.contact_type ?? '' : [],
      },
      created_by: selectMultiple?.createdBy,
      last_updated_by: selectMultiple?.last_updated_by,
      showSQL: showSQL,
      showData: showData,
    };
    const finalData = {
      start: 0,
      limit: pageSize,
      data: data,
    };

    if (searchingPanel?.showIn == 1) {
      // setSearchData(finalData);
      setRoute(false);
      setSearchData(finalData);
      dispatch(getGlobalSearch(finalData));
      setResult(finalData);
    }

    if (searchingPanel?.showIn == 2) {
      setSearchData(finalData);
      setRoute(true);
    }
  };
  const onChange = e => {
    let Name = e.target.name;
    let Value = e.target.value;
    setSearchingPanel({ ...searchingPanel, [Name]: Value });
  };

  const betweenValueChange = (key, e) => {
    let { name, value } = e.target;
    setBetweenValue(prevState => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        [name]: value,
      },
      // first_confirmed_date: {
      //   ...prevState.first_confirmed_date,
      //   [name]: value,
      // },
      // days_left: {
      //   ...prevState.days_left,
      //   [name]: value,
      // },
      // due: {
      //   ...prevState.due,
      //   [name]: value,
      // },
      // paid: {
      //   ...prevState.paid,
      //   [name]: value,
      // },
    }));
  };
  const onChangeChecked = e => {
    const { name, checked } = e.target;
    setSearchingPanel(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };
  return (
    <>
      {globalSearchLoading && <Loader />}
      <div className="search_panel_wrapper">
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Search</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="search_panel_inner">
              <div className="search_wrapper_common mb-3 px-2">
                <input
                  type="search"
                  placeholder="Search"
                  className="form-control"
                  name="ref_no"
                  value={searchingPanel?.ref_no}
                  onChange={e => onChange(e)}
                />
                <button className="btn_primary small" onClick={handleSubmit}>
                  <SearchOutlinedIcon />
                </button>
              </div>
              <div className="form-group inline px-2">
                <span className="label">Show in:</span>
                <FormControl fullWidth>
                  <Select
                    labelId="Showin-label"
                    id="Showin-select"
                    name="showIn"
                    value={searchingPanel?.showIn}
                    onChange={e => onChange(e)}
                    defaultValue="Select"
                    className="select_wrap"
                  >
                    <MenuItem value="Select" disabled>
                      Select
                    </MenuItem>
                    {searchList?.map(item => {
                      return (
                        <MenuItem value={item?.id} key={item?.id}>
                          {item?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className="advance_filter_wrap">
                <Accordion
                  expanded={expandedInner === 'panel3'}
                  onChange={innerhandleChange('panel3')}
                >
                  <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                  >
                    <Typography>Advanced Filters</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="advance_filter_inner px-2">
                      <div className="form-group inline checkbox_wrap">
                        <span className="label">Search:</span>
                        <Tooltip title="Include bookings references">
                          <FormGroup>
                            <FormControlLabel
                              control={<Checkbox />}
                              name="bookingReference"
                              checked={searchingPanel.bookingReference}
                              onChange={e =>
                                setSearchingPanel(prevSearchingPanel => ({
                                  ...prevSearchingPanel,
                                  bookingReference: e.target.checked,
                                }))
                              }
                              label="Booking Reference Numbers"
                            />
                          </FormGroup>
                        </Tooltip>
                      </div>
                      <div className="form-group inline">
                        <span className="label">Enquiries:</span>
                        <FormControl fullWidth>
                          <Select
                            labelId="Enquiries-label"
                            id="enquiries"
                            name="enquiries"
                            value={searchingPanel?.enquiries}
                            onChange={e => onChange(e)}
                            className="select_wrap"
                          >
                            {enquiriesList?.map((item, i) => {
                              return (
                                <MenuItem value={item?.value} key={i}>
                                  {item?.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                      <div className="form-group inline checkbox_wrap">
                        <span className="label">Include:</span>
                        <FormGroup onChange={e => onChangeChecked(e)}>
                          <Tooltip title="Include cancelled bookings">
                            <FormControlLabel
                              control={<Checkbox value="cancelled_booking" />}
                              label="Cancelled Bookings/Enquiries"
                              className="mb-2"
                              name="cancelled_booking"
                              checked={searchingPanel?.cancelled_booking}
                            />
                          </Tooltip>
                          <Tooltip title="Include only exlusive bookings">
                            <FormControlLabel
                              control={<Checkbox value="exclusive_only" />}
                              label="Exclusive Only"
                              name="exclusive_only"
                              checked={searchingPanel?.exclusive_only}
                            />
                          </Tooltip>
                        </FormGroup>
                      </div>
                      <div className="form-group inline">
                        <span className="label">Location:</span>
                        <FormGroup>
                          <FormControl fullWidth>
                            <Select
                              labelId="Location-label"
                              id="Location"
                              name="location"
                              value={searchingPanel?.location}
                              onChange={e => onChange(e)}
                              defaultValue="Select Location"
                              className="select_wrap"
                            >
                              <MenuItem value="All">
                                All Location Selected
                              </MenuItem>
                              {activeVenueList?.map(item => {
                                return (
                                  <MenuItem value={item?._id} key={item?._id}>
                                    {item?.internal_name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group inline">
                        <span className="label">Theme:</span>
                        <FormGroup>
                          <FormControl fullWidth>
                            <Select
                              labelId="Theme-label"
                              id="Theme"
                              name="theme"
                              value={searchingPanel?.theme}
                              onChange={e => onChange(e)}
                              className="select_wrap"
                            >
                              <MenuItem value="All">
                                All Theme Selected
                              </MenuItem>
                              {activeThemeList?.map(item => {
                                return (
                                  <MenuItem value={item?._id} key={item?._id}>
                                    {item?.internal_name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group inline search_year_wrap">
                        <span className="label">Year:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth className="large_select">
                            <Select
                              labelId="condition-label"
                              id="condition"
                              name="yearCondition"
                              value={searchingPanel?.yearCondition || ''}
                              onChange={e => {
                                onChange(e);
                                setSelectMultiple({
                                  ...selectMultiple,
                                  year: [],
                                });
                              }}
                              defaultValue="Select Condition"
                              className="select_wrap"
                            >
                              <MenuItem value="Select Condition" disabled>
                                Select Condition
                              </MenuItem>
                              {yearSelectConditionList?.map((item, i) => {
                                return (
                                  <MenuItem value={item?.id} key={i}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            className="Multiselect_checkbox"
                            multiple={searchingPanel?.yearCondition == 7}
                            name="year"
                            value={selectMultiple?.year || []}
                            onChange={e => handleChangeYear('year', e)}
                            input={<OutlinedInput />}
                            renderValue={
                              searchingPanel?.yearCondition == 7 &&
                              (selected => {
                                if (selected.length === yearsArray.length) {
                                  return 'All';
                                }
                                return selected.join(', ');
                              })
                            }
                          >
                            {searchingPanel?.yearCondition === 7
                              ? [
                                  <MenuItem
                                    onClick={() => handleSelectAll('year')}
                                  >
                                    <Checkbox
                                      checked={
                                        selectMultiple?.year.length ===
                                        yearsArray.length
                                      }
                                    />
                                    <ListItemText primary={'Select All'} />
                                  </MenuItem>,
                                  ...yearsArray.map(year => (
                                    <MenuItem
                                      key={year}
                                      value={year.toString()}
                                    >
                                      <Checkbox
                                        checked={selectMultiple?.year?.includes(
                                          year.toString(),
                                        )}
                                      />
                                      <ListItemText primary={year} />
                                    </MenuItem>
                                  )),
                                ]
                              : yearsArray?.map(item => {
                                  return (
                                    <MenuItem key={item} value={item}>
                                      {item}
                                    </MenuItem>
                                  );
                                })}
                          </Select>
                        </FormGroup>
                      </div>
                      <div className="form-group inline align-items-start">
                        <span className="label">Places:</span>
                        <FormGroup
                          className={
                            searchingPanel?.placesCondition == 7
                              ? 'input_wrap double_field_wrap'
                              : 'input_wrap'
                          }
                        >
                          <FormControl fullWidth className="large_select">
                            <Select
                              labelId="Places-label"
                              id="Places"
                              name="placesCondition"
                              value={searchingPanel?.placesCondition}
                              onChange={e => onChange(e)}
                              defaultValue="Select Places"
                              className="select_wrap"
                            >
                              <MenuItem value="Select Places" disabled>
                                Select Places
                              </MenuItem>
                              {commonSelectConditionList?.map(item => {
                                return (
                                  <MenuItem value={item?.id} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth className="small_select">
                            {searchingPanel?.placesCondition == 7 ? (
                              <>
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="graterValue"
                                  value={betweenValue?.places?.graterValue}
                                  onChange={e =>
                                    betweenValueChange('places', e)
                                  }
                                />
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="lessValue"
                                  value={betweenValue?.places?.lessValue}
                                  onChange={e =>
                                    betweenValueChange('places', e)
                                  }
                                />
                              </>
                            ) : (
                              <TextField
                                id="outlined-basic"
                                type="number"
                                onWheel={e => e.target.blur()}
                                variant="outlined"
                                className="input_wrap"
                                name="places"
                                value={searchingPanel?.places}
                                onChange={e => onChange(e)}
                              />
                            )}
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group inline checkbox_wrap">
                        <span className="label"></span>
                        <FormGroup
                          className="inline_checkbox_wrap"
                          onChange={e => onChangeChecked(e)}
                        >
                          <Tooltip title="Include provisional places">
                            <FormControlLabel
                              control={<Checkbox value="provisional" />}
                              label="Provisional"
                              name="provisional"
                              checked={searchingPanel?.provisional}
                            />
                          </Tooltip>
                          <Tooltip title="Include confirmed places">
                            <FormControlLabel
                              control={<Checkbox value="confirmed" />}
                              label="Confirmed"
                              name="confirmed"
                              checked={searchingPanel?.confirmed}
                            />
                          </Tooltip>
                        </FormGroup>
                      </div>
                      <div className="form-group">
                        <span className="label">First Confirmed Date:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth className="large_select">
                            <Select
                              labelId="Confirmed-Date-label"
                              id="Confirmed-Date"
                              name="firstConfirmedDate"
                              value={searchingPanel?.firstConfirmedDate}
                              onChange={e => onChange(e)}
                              defaultValue="Select Date"
                              className="select_wrap"
                            >
                              <MenuItem value="Select Date" disabled>
                                Select Date
                              </MenuItem>
                              {commonSelectConditionList?.map(item => {
                                return (
                                  <MenuItem value={item?.id} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          {/* <FormControl fullWidth className="small_select">
                            {searchingPanel?.firstConfirmedDate == 7 ? (
                              <>
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  variant="outlined"
                                  className="input_wrap"
                                  name="graterValue"
                                  value={
                                    betweenValue?.first_confirmed_date
                                      ?.graterValue
                                  }
                                  onChange={e =>
                                    betweenValueChange(
                                      'first_confirmed_date',
                                      e,
                                    )
                                  }
                                />
                                <TextField
                                  id="outlined-basic"
                                  type="number"
onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="lessValue"
                                  value={
                                    betweenValue?.first_confirmed_date
                                      ?.lessValue
                                  }
                                  onChange={e =>
                                    betweenValueChange(
                                      'first_confirmed_date',
                                      e,
                                    )
                                  }
                                />
                              </>
                            ) : (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  name="expiry_date"
                                  value={searchingPanel?.first_confirmed_date}
                                  inputFormat="DD-MM-YYYY"
                                  onChange={date =>
                                    setSearchingPanel({
                                      ...searchingPanel,
                                      first_confirmed_date: date,
                                    })
                                  }
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      id="first_confirmed_date"
                                    />
                                  )}
                                  className="input_wrap"
                                />
                              </LocalizationProvider>
                            )}
                          </FormControl> */}
                        </FormGroup>
                      </div>
                      <div className="form-group inline date_picker">
                        <FormControl fullWidth className="small_select">
                          {searchingPanel?.firstConfirmedDate === 7 ? (
                            <>
                              <div className="custom_sidebar_date">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    name={'graterValue'}
                                    value={
                                      betweenValue?.first_confirmed_date
                                        ?.graterValue
                                    }
                                    inputFormat="DD-MM-YYYY"
                                    onChange={date =>
                                      setBetweenValue(prevState => ({
                                        ...prevState,
                                        first_confirmed_date: {
                                          ...prevState['first_confirmed_date'],
                                          graterValue: date,
                                        },
                                      }))
                                    }
                                    renderInput={params => (
                                      <TextField {...params} />
                                    )}
                                    className="input_wrap"
                                  />
                                </LocalizationProvider>

                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    name="lessValue"
                                    value={
                                      betweenValue?.first_confirmed_date
                                        ?.lessValue
                                    }
                                    inputFormat="DD-MM-YYYY"
                                    onChange={date =>
                                      setBetweenValue(prevState => ({
                                        ...prevState,
                                        first_confirmed_date: {
                                          ...prevState['first_confirmed_date'],
                                          lessValue: date,
                                        },
                                      }))
                                    }
                                    renderInput={params => (
                                      <TextField {...params} />
                                    )}
                                    className="input_wrap"
                                  />
                                </LocalizationProvider>
                              </div>
                            </>
                          ) : (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={searchingPanel?.first_confirmed_date}
                                inputFormat="DD-MM-YYYY"
                                onChange={date =>
                                  setSearchingPanel({
                                    ...searchingPanel,
                                    first_confirmed_date: date,
                                  })
                                }
                                renderInput={params => (
                                  <TextField {...params} />
                                )}
                                className="input_wrap"
                              />
                            </LocalizationProvider>
                          )}
                        </FormControl>
                      </div>
                      <div className="form-group inline">
                        <span className="label">Day Left:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth className="large_select">
                            <Select
                              labelId="Day-Left-label"
                              id="Day-Left"
                              name="dayLeftCondition"
                              value={searchingPanel?.dayLeftCondition}
                              onChange={e => onChange(e)}
                              defaultValue="Select Condition"
                              className="select_wrap"
                            >
                              <MenuItem value="Select Condition" disabled>
                                Select Condition
                              </MenuItem>
                              {commonSelectConditionList?.map(item => {
                                return (
                                  <MenuItem value={item?.id} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth className="small_select">
                            {searchingPanel?.dayLeftCondition == 7 ? (
                              <>
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="graterValue"
                                  value={betweenValue?.days_left?.graterValue}
                                  onChange={e =>
                                    betweenValueChange('days_left', e)
                                  }
                                />
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="lessValue"
                                  value={betweenValue?.days_left?.lessValue}
                                  onChange={e =>
                                    betweenValueChange('days_left', e)
                                  }
                                />
                              </>
                            ) : (
                              <TextField
                                id="outlined-basic"
                                type="number"
                                onWheel={e => e.target.blur()}
                                variant="outlined"
                                className="input_wrap"
                                name="days_left"
                                value={searchingPanel?.days_left}
                                onChange={e => onChange(e)}
                              />
                            )}
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group inline">
                        <span className="label">£ Due:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth className="large_select">
                            <Select
                              labelId="Due-label"
                              id="Due"
                              name="dueSelect"
                              value={searchingPanel?.dueSelect}
                              onChange={e => onChange(e)}
                              defaultValue="Select Condition"
                              className="select_wrap"
                            >
                              <MenuItem value="Select Condition" disabled>
                                Select Condition
                              </MenuItem>
                              {commonSelectConditionList?.map(item => {
                                return (
                                  <MenuItem value={item?.id} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth className="small_select">
                            {searchingPanel?.dueSelect == 7 ? (
                              <>
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="graterValue"
                                  value={betweenValue?.due?.graterValue}
                                  onChange={e => betweenValueChange('due', e)}
                                />
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="lessValue"
                                  value={betweenValue?.due?.lessValue}
                                  onChange={e => betweenValueChange('due', e)}
                                />
                              </>
                            ) : (
                              <TextField
                                id="outlined-basic"
                                type="number"
                                onWheel={e => e.target.blur()}
                                variant="outlined"
                                className="input_wrap"
                                name="due"
                                value={searchingPanel?.due}
                                onChange={e => onChange(e)}
                              />
                            )}
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group inline">
                        <span className="label">£ Paid:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth className="large_select">
                            <Select
                              labelId="Paid-label"
                              id="Paid"
                              name="paidSelect"
                              value={searchingPanel?.paidSelect}
                              onChange={e => onChange(e)}
                              defaultValue="Select Condition"
                              className="select_wrap"
                            >
                              <MenuItem value="Select Condition" disabled>
                                Select Condition
                              </MenuItem>
                              {commonSelectConditionList?.map(item => {
                                return (
                                  <MenuItem value={item?.id} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth className="small_select">
                            {searchingPanel?.paidSelect == 7 ? (
                              <>
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="graterValue"
                                  value={betweenValue?.paid?.graterValue}
                                  onChange={e => betweenValueChange('paid', e)}
                                />
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="lessValue"
                                  value={betweenValue?.paid?.lessValue}
                                  onChange={e => betweenValueChange('paid', e)}
                                />
                              </>
                            ) : (
                              <TextField
                                id="outlined-basic"
                                type="number"
                                onWheel={e => e.target.blur()}
                                variant="outlined"
                                className="input_wrap"
                                name="paid"
                                value={searchingPanel?.paid}
                                onChange={e => onChange(e)}
                              />
                            )}
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group inline checkbox_wrap m-0">
                        <span className="label"></span>
                        <FormGroup
                          className="inline_checkbox_wrap align-items-start "
                          onChange={e => onChangeChecked(e)}
                        >
                          <Tooltip title="Group Deposit and Balance payments which are automatically split by CRMBO into one payment">
                            <FormControlLabel
                              control={<Checkbox value={'group_payment'} />}
                              label="Group Payments"
                              className="mb-2"
                              name="group_payment"
                              checked={searchingPanel?.group_payment}
                            />
                          </Tooltip>
                          <Tooltip title="Search by Total Amount Paid on the booking - untick to search individual payments (Group Payments has no effect when searching total paid)">
                            <FormControlLabel
                              control={<Checkbox value={'total_paid'} />}
                              label="Total Paid"
                              name="total_paid"
                              className="mb-2"
                              checked={searchingPanel?.total_paid}
                            />
                          </Tooltip>
                        </FormGroup>
                      </div>
                      <div className="form-group inline">
                        <span className="label"></span>
                        <FormGroup className="input_wrap">
                          <span className="label">Method:</span>
                          <FormControl fullWidth>
                            <Select
                              labelId="Method-label"
                              id="Method"
                              name="method"
                              value={searchingPanel?.method}
                              onChange={e => onChange(e)}
                              defaultValue="Select Method"
                              className="select_wrap"
                            >
                              <MenuItem value="All">
                                All Method Selected
                              </MenuItem>
                              {activePaymentOptionsList?.map(item => {
                                return (
                                  <MenuItem value={item?._id} key={item?._id}>
                                    {item?.internal_name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group inline">
                        <span className="label">Discount %:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth className="large_select">
                            <Select
                              labelId="Discount-label"
                              id="Discount"
                              name="discountSelect"
                              value={searchingPanel?.discountSelect}
                              onChange={e => onChange(e)}
                              defaultValue="Select Condition"
                              className="select_wrap"
                            >
                              <MenuItem value="Select Condition" disabled>
                                Select Condition
                              </MenuItem>
                              {commonSelectConditionList?.map(item => {
                                return (
                                  <MenuItem value={item?.id} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth className="small_select">
                            {searchingPanel?.discountSelect == 7 ? (
                              <>
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="graterValue"
                                  value={betweenValue?.discount?.graterValue}
                                  onChange={e =>
                                    betweenValueChange('discount', e)
                                  }
                                />
                                <TextField
                                  id="outlined-basic"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  className="input_wrap"
                                  name="lessValue"
                                  value={betweenValue?.discount?.lessValue}
                                  onChange={e =>
                                    betweenValueChange('discount', e)
                                  }
                                />
                              </>
                            ) : (
                              <TextField
                                id="outlined-basic"
                                type="number"
                                onWheel={e => e.target.blur()}
                                variant="outlined"
                                className="input_wrap"
                                name="discount"
                                value={searchingPanel?.discount}
                                onChange={e => onChange(e)}
                              />
                            )}
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group inline align-items-start">
                        <span className="label">Contact Type:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth className="mb-2">
                            <Select
                              labelId="Contact-Type-label"
                              id="Contact-Type"
                              name="contactTypeCondition"
                              value={searchingPanel?.contactTypeCondition}
                              onChange={e => {
                                onChange(e);
                                setSelectMultiple({
                                  ...selectMultiple,
                                  contact_type: [],
                                });
                              }}
                              defaultValue="Select Condition"
                              className="select_wrap"
                            >
                              <MenuItem value="Select Condition" disabled>
                                Select Condition
                              </MenuItem>
                              {contactTypeConditionList?.map(item => {
                                return (
                                  <MenuItem value={item?.id} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth>
                            <Select
                              labelId="Contact-Type-two-label"
                              id="Contact-Type-two"
                              name="contact_type"
                              className="select_wrap"
                              multiple={
                                searchingPanel?.contactTypeCondition == 3
                              }
                              value={selectMultiple?.contact_type || []}
                              onChange={e =>
                                handleChangeYear('contact_type', e)
                              }
                              input={<OutlinedInput />}
                              renderValue={
                                searchingPanel?.contactTypeCondition == 3 &&
                                (selected => {
                                  if (selected.length === contactTypes.length) {
                                    return 'All';
                                  } else {
                                    return `${selectMultiple?.contact_type?.length} of ${contactTypes.length} selected`;
                                  }
                                })
                              }
                            >
                              {searchingPanel?.contactTypeCondition == 3
                                ? [
                                    <MenuItem
                                      onClick={() =>
                                        handleSelectAll('contact_type')
                                      }
                                    >
                                      <Checkbox
                                        checked={
                                          selectMultiple?.contact_type
                                            .length === contactTypes.length
                                        }
                                      />
                                      <ListItemText primary={'Select All'} />
                                    </MenuItem>,
                                    ...contactTypes.map((item, index) => (
                                      <MenuItem
                                        key={index}
                                        value={item?.id.toString()}
                                      >
                                        <Checkbox
                                          checked={selectMultiple?.contact_type?.includes(
                                            item?.id.toString(),
                                          )}
                                        />
                                        <ListItemText primary={item?.name} />
                                      </MenuItem>
                                    )),
                                  ]
                                : [
                                    <MenuItem value="" key="all-contact-types">
                                      All Contact Type Selected
                                    </MenuItem>,
                                    ...contactTypes?.map((item, index) => {
                                      return (
                                        <MenuItem key={index} value={item?.id}>
                                          {item?.name}
                                        </MenuItem>
                                      );
                                    }),
                                  ]}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group">
                        <span className="label">Created By:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth>
                            <Select
                              labelId="CreatedBy-label"
                              id="CreatedBy"
                              className="Multiselect_checkbox"
                              multiple
                              name="createdBy"
                              value={selectMultiple?.createdBy || []}
                              onChange={e => handleChangeYear('createdBy', e)}
                              input={<OutlinedInput />}
                              renderValue={selected => {
                                const selectedNames = selected.map(id => {
                                  const selectedItem = activeUserList?.find(
                                    item => item?._id === id,
                                  );
                                  return selectedItem
                                    ? `${selectedItem.name}`
                                    : '';
                                });
                                if (selected.length === activeUserList.length) {
                                  return 'All';
                                }
                                return selectedNames.join(', ');
                              }}
                            >
                              {[
                                <MenuItem
                                  onClick={() => handleSelectAll('createdBy')}
                                >
                                  <Checkbox
                                    checked={
                                      selectMultiple.createdBy.length ===
                                      activeUserList.length
                                    }
                                  />
                                  <ListItemText primary={'Select All'} />
                                </MenuItem>,
                                ...activeUserList?.map((item, index) => (
                                  <MenuItem key={index} value={item?._id}>
                                    <Checkbox
                                      checked={selectMultiple?.createdBy?.includes(
                                        item?._id,
                                      )}
                                    />
                                    <ListItemText
                                      primary={`${item?.name} (${item?.username})`}
                                    />
                                  </MenuItem>
                                )),
                              ]}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group">
                        <span className="label">Last Updated By:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth>
                            <Select
                              labelId="LastUpdatedBy-label"
                              id="LastUpdatedBy"
                              className="Multiselect_checkbox"
                              multiple
                              name="last_updated_by"
                              value={selectMultiple?.last_updated_by || []}
                              onChange={e =>
                                handleChangeYear('last_updated_by', e)
                              }
                              renderValue={selected => {
                                const selectedNames = selected.map(id => {
                                  const selectedItem = activeUserList?.find(
                                    item => item?._id === id,
                                  );
                                  return selectedItem
                                    ? `${selectedItem.name}`
                                    : '';
                                });
                                if (selected.length === activeUserList.length) {
                                  return 'All';
                                }
                                return selectedNames.join(', ');
                              }}
                            >
                              {[
                                <MenuItem
                                  onClick={() =>
                                    handleSelectAll('last_updated_by')
                                  }
                                >
                                  <Checkbox
                                    checked={
                                      selectMultiple.last_updated_by.length ===
                                      activeUserList.length
                                    }
                                  />
                                  <ListItemText primary={'Select All'} />
                                </MenuItem>,
                                ...activeUserList?.map((item, index) => (
                                  <MenuItem key={index} value={item?._id}>
                                    <Checkbox
                                      checked={selectMultiple?.last_updated_by?.includes(
                                        item?._id,
                                      )}
                                    />
                                    <ListItemText
                                      primary={`${item?.name} (${item?.username})`}
                                    />
                                  </MenuItem>
                                )),
                              ]}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group">
                        <span className="label">Invoiced:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth>
                            <Select
                              labelId="Invoiced-label"
                              id="Invoiced"
                              name="invoiced"
                              value={searchingPanel?.invoiced}
                              onChange={e => onChange(e)}
                              defaultValue="Select"
                              className="select_wrap"
                            >
                              <MenuItem value="All">All Invoice</MenuItem>
                              {invoicedList?.map((item, index) => {
                                return (
                                  <MenuItem value={item?.value} key={index}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group">
                        <span className="label">eTickets Sent:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth>
                            <Select
                              labelId="eTicketsSent-label"
                              id="eTicketsSent"
                              name="eTicketsSent"
                              value={searchingPanel?.eTicketsSent}
                              onChange={e => onChange(e)}
                              defaultValue="Select"
                              className="select_wrap"
                            >
                              <MenuItem value="All">All E-Tickets</MenuItem>
                              {eTicketsSentList?.map((item, index) => {
                                return (
                                  <MenuItem value={item?.value} key={index}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group">
                        <span className="label">Billable Items Ordered:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth>
                            <Select
                              labelId="Invoiced-label"
                              id="Invoiced"
                              name="billableItemsOrdered"
                              value={searchingPanel?.billableItemsOrdered}
                              onChange={e => onChange(e)}
                              defaultValue="Select"
                              className="select_wrap"
                            >
                              <MenuItem value="All">
                                All Billable Items
                              </MenuItem>
                              {billableItemsOrderedList?.map((item, index) => {
                                return (
                                  <MenuItem value={item?.value} key={index}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                      <div className="form-group">
                        <span className="label">Results Order:</span>
                        <FormGroup className="input_wrap">
                          <FormControl fullWidth className="large_select">
                            <Select
                              labelId="condition-label"
                              id="condition"
                              name="resultsOrder"
                              value={searchingPanel?.resultsOrder}
                              onChange={e => onChange(e)}
                              defaultValue="Booking Ref"
                              className="select_wrap"
                            >
                              {resultsOrderList?.map(item => {
                                return (
                                  <MenuItem value={item?.value} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth className="small_select">
                            <Select
                              labelId="asd_dsd-label"
                              id="asd_dsd"
                              name="asd_dsd"
                              value={searchingPanel?.asd_dsd}
                              onChange={e => onChange(e)}
                              className="select_wrap"
                            >
                              {resultsOrderYearList?.map(item => {
                                return (
                                  <MenuItem value={item?.value} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>{' '}
                      <div className="form-group inline align-items-start">
                        <span className="label">Dev:</span>
                        <FormGroup
                          className="inline_checkbox_wrap"
                          onChange={e => onChangeChecked(e)}
                        >
                          <FormControlLabel
                            control={<Checkbox value="showSQL" />}
                            label="Show SQL"
                            name="showSQL"
                            className="mb-2"
                            checked={searchingPanel?.showSQL}
                          />
                          <FormControlLabel
                            control={<Checkbox value="showData" />}
                            label="Show Booking Data Dump"
                            name="showData"
                            checked={searchingPanel?.showData}
                          />
                        </FormGroup>
                      </div>
                      {/* <div className="form-group inline checkbox_wrap">
                      <span className="label">Dev:</span>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Show SQL"
                          className="mb-2"
                          name="showSQL"
                          checked={searchingPanel?.showSQL}
                          onChange={e => onChangeChecked(e)}
                        />
                        <FormControlLabel
                          control={<Checkbox />}
                          label="Show Bookings Data Dump"
                          name="showBookingsDataDump"
                          checked={searchingPanel?.showBookingsDataDump}
                          onChange={e => onChangeChecked(e)}
                        />
                      </FormGroup>
                    </div> */}
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expandedInner === 'panel4'}
                  onChange={innerhandleChange('panel4')}
                >
                  <AccordionSummary
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                  >
                    <Typography>Search Results</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {(searchingPanel?.showIn === 1 ||
                      searchingPanel?.showIn === 2) && (
                      <SearchResult
                        result={result}
                        key={searchingPanel?.showIn}
                      />
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography>Saved Searches</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="save_search_wrap px-2">
              <p>I'm the content for the saved searches section.</p>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}
