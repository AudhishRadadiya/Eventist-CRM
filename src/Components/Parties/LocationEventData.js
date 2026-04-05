import React, { useEffect, useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import LockIcon from '../../Assets/Img/lock.svg';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { yearEnquiresList } from 'store/reducers/Enquiry/Parties/enquireParties.slice';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import DataNotFound from 'Components/Common/DataNotFound';
import { Tooltip } from '@mui/material';

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
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'transparent',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '0',
}));

export default function LocationEventData() {
  const { year } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { yearPartiesList, yearPartiesLoading } = useSelector(
    ({ enquireParties }) => enquireParties,
  );

  const [expanded, setExpanded] = useState('');

  useEffect(() => {
    setExpanded(yearPartiesList[0]?.event_name);
  }, [yearPartiesList]);

  useEffect(() => {
    dispatch(
      yearEnquiresList({
        year: year === 'All' ? '' : Number(year),
        event_id: '',
        search: '',
        is_exclusive: false,
      }),
    );
  }, [dispatch, year]);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="inner_wrapper">
      {yearPartiesLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link to="/parties">Parties</Link>
          <Link to={`/parties`}>Event Dashboard</Link>
          <Typography>Location Event Data</Typography>
        </Breadcrumbs>
      </div>
      <div className="location_event_data_wrap">
        {yearPartiesList?.length > 0 ? (
          yearPartiesList?.map((data, index) => {
            return (
              <Accordion
                key={index}
                expanded={expanded === data?.event_name}
                onChange={handleChange(data?.event_name)}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <Typography>{`${data?.event_name} - ${year}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="table_main_Wrapper">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Price Net</TableCell>
                            <TableCell>Price Gross</TableCell>
                            <TableCell>HOLD</TableCell>
                            <TableCell>Available</TableCell>
                            <TableCell>Enquired</TableCell>
                            <TableCell>Provisional</TableCell>
                            <TableCell>Confirmed</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Status Description</TableCell>
                          </TableRow>
                          <TableRow className="full_row ">
                            <TableCell
                              colSpan={10}
                            >{`${data?.event_name} - ${year}`}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data?.group_data?.map((item, index) => {
                            return (
                              <TableRow
                                key={index}
                                className={
                                  !item?.is_active ? 'disable_row' : ''
                                }
                              >
                                <TableCell>
                                  {moment(item?.date).format('ddd Do MMM')}
                                </TableCell>
                                <TableCell>
                                  £{item?.price_net?.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  £{item?.price_gross?.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  {item?.hold == 0 ? (
                                    <>
                                      <span className="hold_day text_primary">
                                        {item?.hold}
                                      </span>
                                      <span> Days</span>
                                    </>
                                  ) : (
                                    item?.hold
                                  )}
                                </TableCell>
                                <TableCell className="total_available_wrap">
                                  {item?.available}
                                  <Tooltip
                                    title={`Overbooking Capacity: ${item?.total_place}`}
                                  >
                                    <span className="total_available text_light">
                                      /{item?.places}
                                    </span>
                                  </Tooltip>
                                </TableCell>

                                <TableCell>
                                  {item?.enquired === 0 ? (
                                    item?.enquired
                                  ) : (
                                    <span
                                      style={{
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => {
                                        navigate(
                                          `/enquiries/${item?._id}?parties=true&from_dashboard_ev_dates=true`,
                                          {
                                            state: {
                                              year: year,
                                              event: data?._id,
                                              // event_date: item?.date,
                                            },
                                          },
                                        );
                                      }}
                                    >
                                      {item?.enquired}
                                    </span>
                                  )}
                                </TableCell>

                                <TableCell>{item?.provisional}</TableCell>
                                <TableCell>{item?.confirmed}</TableCell>
                                <TableCell>
                                  <div
                                    className="d-flex align-items-center justify-content-between"
                                    style={{ color: `${item?.status_colour}` }}
                                  >
                                    {item?.status}
                                    <img src={LockIcon} alt="Lock Icon" />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="edit_wrap">
                                    {/* <img src={EditIcon} alt="Edit Icon" /> */}
                                    <span>{item?.status_description}</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <DataNotFound />
        )}
      </div>
    </div>
  );
}
