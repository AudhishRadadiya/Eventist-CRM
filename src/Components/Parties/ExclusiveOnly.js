import React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '../../Assets/Img/edit.svg';
import PdfIcon from '../../Assets/Img/pdf-icon.svg';

const filterbyVenue = [
  {
    label:
      'Ardingly, South of England Event Centre, West Sussex : Winter Secret Garden',
  },
  { label: 'Billericay, Barleylands : Electric Jungle' },
  { label: 'Hampshire : Winter Secret Garden' },
  { label: 'Knowsley Safari, Liverpool, Merseyside : Electric Jungle' },
  { label: 'Maidstone, Kent Event Centre, Kent Showground : Dream Circus' },
  { label: 'Manchester: The Glamour of Paris' },
  { label: 'Milton Keynes, Willen Lake : Dream Circus' },
  { label: 'Newcastle Racecourse : The Roaring Twenties' },
  { label: 'Nottingham, Beeston Hockey Club, Uni Blvd : The Roaring Twenties' },
  { label: 'Reading, Kings Meadow : Dream Circus' },
  {
    label: 'Southampton, Trojans Rugby Club, Eastleigh : The Roaring Twenties',
  },
  { label: 'Syon Park, West London : Burlesque' },
  { label: 'Tobacco Dock - The East Mall 2021 - ADMIN USE ONLY' },
  { label: 'Tobacco Dock - The Gallery :' },
  { label: 'Tobacco Dock - The North Dock' },
  { label: 'Windsor, Royal Windsor Racecourse : Midnight in Monte Carlo' },
];

export default function ExclusiveOnly() {
  return (
    <div className="inner_wrapper">
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link to="/parties">Parties</Link>
          <Link to="/event-dashboard">Event Dashboard</Link>
          <Typography>Exclusive Only</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <Row>
          <Col xs={9}>
            <h1>Events Dashboard</h1>
          </Col>
          <Col xs={3}>
            <div className="form-group m-0">
              <Autocomplete
                disablePortal
                id="Filter-by-Venue"
                className="select_with_search"
                // value={searchVenue}
                options={filterbyVenue}
                renderInput={params => <TextField {...params} />}
                // onChange={(event, newValue) => {
                // setSearchVenue(newValue);
                // }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className="parties_table_Wrap">
        <Row className="align-items-center mb-3">
          <Col xs={9}>
            <Link to="/exclusive-only" className="btn_border small">
              Exclusives Only
            </Link>
          </Col>
          <Col xs={3}>
            <div className="search_wrapper_common">
              <input
                type="search"
                placeholder="Search"
                className="form-control"
              />
              <button className="btn_primary small">
                <SearchOutlinedIcon />
              </button>
            </div>
          </Col>
        </Row>
        <div className="table_main_Wrapper mb-4">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span>Date</span>
                  </TableCell>
                  <TableCell>
                    <span>Price Net</span>
                  </TableCell>
                  <TableCell>
                    <span>Price Gross</span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <span>HOLD</span>
                  </TableCell>
                  <TableCell>
                    <span>Available</span>
                  </TableCell>
                  <TableCell>
                    <span>Enquired</span>
                  </TableCell>
                  <TableCell>
                    <span>Provisional</span>
                  </TableCell>
                  <TableCell>
                    <span>Confirmed</span>
                  </TableCell>
                  <TableCell>
                    <span>Status</span>
                  </TableCell>
                  <TableCell>
                    <span>Status Description</span>
                  </TableCell>
                </TableRow>
                <TableRow className="full_row">
                  <TableCell colSpan={11}>
                    Billericay, Barleylands : Electric Jungle - 2022
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <SearchOutlinedIcon /> Thu 1st Dec
                  </TableCell>
                  <TableCell>£47.50</TableCell>
                  <TableCell>£57.00</TableCell>
                  <TableCell>
                    <Link className="btn_border small" to="/create-new-booking">
                      Book / Enquire
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="hold_day text_primary">2</span> Days
                  </TableCell>
                  <TableCell>
                    312{' '}
                    <span className="total_available text_light">/ 500</span>
                  </TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>38</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>Mixed Group Night</TableCell>
                  <TableCell>
                    <div className="edit_wrap">
                      <img src={EditIcon} alt="Edit Icon" />{' '}
                      <span>Nice Event</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div className="table_pagination_wrap">
            <Row className="g-0 align-items-center my-2">
              <Col sm={6}>
                <div className="total_entry">
                  <p className="m-0">Showing 1 to 17 of 17 entries</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="parties_table_Wrap">
          <Row className="align-items-center mb-3">
            <Col xs={9}>
              <h4 className="fw_600 m-0">
                Unassigned Enquiries for Ardingly, South of England Event
                Centre, West Sussex : Winter Secret Garden
              </h4>
            </Col>
            <Col xs={3}>
              <div className="search_wrapper_common">
                <input
                  type="search"
                  placeholder="Search"
                  className="form-control"
                />
                <button className="btn_primary small">
                  <SearchOutlinedIcon />
                </button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="table_main_Wrapper vertical_top mb-4">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span>Date</span>
                  </TableCell>
                  <TableCell>
                    <span>Enquiries</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Fri 9th Dec 2022</TableCell>
                  <TableCell>
                    <Link>544</Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div className="table_pagination_wrap">
            <Row className="g-0 align-items-center my-2">
              <Col sm={6}>
                <div className="total_entry">
                  <p className="m-0">Showing 1 to 17 of 17 entries</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="years_number_Wrap mb-3 d-flex justify-content-between">
          <ul className="pdf_link_wrap rtl_dir">
            <li>
              <Link to="">
                <div className="pdf_icon">
                  <img src={PdfIcon} alt="pdf icon" />
                </div>
                <div className="pdf_text">
                  <p>CUSTOMER COPY:</p>
                </div>
              </Link>
            </li>
          </ul>
          <ul className="pdf_link_wrap rtl_dir">
            <li>
              <Link to="">
                <div className="pdf_icon">
                  <img src={PdfIcon} alt="pdf icon" />
                </div>
                <div className="pdf_text">
                  <p>INTERNAL USE ONLY:</p>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
