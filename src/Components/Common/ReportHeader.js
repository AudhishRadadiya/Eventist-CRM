import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const filterbyReport = [
  {
    label: 'ACCOUNTS: Business Done',
    pathname: '/reports/business-report',
  },
  { label: 'ACCOUNTS: Daily Invoices', pathname: '/reports/invoices-report' },
  {
    label: 'ACCOUNTS: Daily Online Payment Totals',
    pathname: '/reports/online-payments-report',
  },
  { label: 'ACCOUNTS: Daily Payments', pathname: '/reports/payments-report' },
  { label: 'ACCOUNTS: Debtors', pathname: '/reports/debtors-report' },
  { label: 'ACCOUNTS: Deposits List', pathname: '/reports/deposits-report' },
  { label: 'ACCOUNTS: Exchequer Data', pathname: '/reports/exchequer-report' },
  {
    label: 'ACCOUNTS: Transactions Export',
    pathname: '/reports/transactions-export',
  },
  { label: 'OPS: Booking Notes', pathname: '/reports/booking-notes-report' },
  { label: 'OPS: Coupons', pathname: '/reports/coupons-report' },
  {
    label: 'OPS: Dietary Requirements',
    pathname: '/reports/dietrequirements-report',
  },
  { label: 'OPS: Drinks Order Summary', pathname: '/reports/drinks-report' },
  { label: 'OPS: Item Tracking', pathname: '/reports/tracking-report' },
  { label: 'OPS: Party Feedback', pathname: '/reports/party-feedback-report' },
  { label: 'OPS: Party Numbers', pathname: '/reports/party-numbers-report' },
  {
    label: 'OPS: Special Requirements',
    pathname: '/reports/requirements-report',
  },
  {
    label: 'SALES: Contact Sources',
    pathname: '/reports/contact-sources-report',
  },
  {
    label: 'SALES: Drinks & Dodgems KPIs',
    pathname: '/reports/drinks-sundries-totals-report',
  },
  {
    label: 'SALES: Monthly Revenue',
    pathname: '/reports/monthly-revenue-report',
  },
  {
    label: 'SALES: Number Comparison Totals',
    pathname: '/reports/event-numbers-comparison-totals',
  },
  {
    label: 'SALES: Number Comparison by Type',
    pathname: '/reports/comparison-type-report',
  },
  {
    label: 'SALES: Number Comparisons',
    pathname: '/reports/event-numbers-comparison-report',
  },
  {
    label: 'SALES: Product Sales Report',
    pathname: '/reports/products-order-summary',
  },
  {
    label: 'SALES: Ticket Revenue',
    pathname: '/reports/ticket-revenue-report',
  },
  {
    label: 'SALES: Total Bookings By User',
    pathname: '/reports/total-bookings-by-user',
  },
];

export default function ReportHeader({ name }) {
  const [selectReport, setSelectReport] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let newData = filterbyReport.filter(
      data => data.pathname === location?.pathname,
    );
    setSelectReport(newData[0]);
  }, [location]);
  return (
    <div className="page_title">
      <Row>
        <Col xs={3}>
          <h1>{name}</h1>
        </Col>
        <Col xs={9}>
          <div className="form-group m-0 d-flex align-items-center justify-content-end">
            <label className="fw_600 me-3">
              Please select a report to run:
            </label>
            <Autocomplete
              disablePortal
              id="Select-report"
              className="select_with_search w-50 max_33"
              value={selectReport}
              options={filterbyReport}
              renderInput={params => <TextField {...params} />}
              onChange={(event, newValue) => {
                setSelectReport(newValue);
                navigate(newValue.pathname);
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
