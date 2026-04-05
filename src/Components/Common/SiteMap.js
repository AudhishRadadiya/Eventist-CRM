import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteMap() {
  return (
    <div className="sitemap_wrap">
      <ul>
        <h4>Home</h4>
        <li>
          <Link to="/">Home</Link>
        </li>
        <h4 className="mt-3">Parties</h4>
        <li>
          <Link to="/parties">Parties</Link>
        </li>
        <li>
          <Link to="/event-dashboard">Event Dashboard</Link>
        </li>
        <li>
          <Link to="/exclusive-only">Exclusive Only</Link>
        </li>
        <li>
          <Link to="/create-new-booking">Create New Booking</Link>
        </li>
        <li>
          <Link to="/location-event-data">Location Event Data</Link>
        </li>
        <h4 className="mt-3">Booking</h4>
        <li>
          <Link to="/bookings">Bookings</Link>
        </li>
        <li>
          <Link to="/edit-bookings">Edit Bookings</Link>
        </li>
        <li>
          <Link to="/add-payment">Add Payment</Link>
        </li>
        <li>
          <Link to="/send-new-email">Send New Email</Link>
        </li>
        <li>
          <Link to="/send-new-letter">Send New Letter</Link>
        </li>
        <h4 className="mt-3">Enquiries</h4>
        <li>
          <Link to="/enquiries">Enquiries</Link>
        </li>
        <li>
          <Link to="/edit-enquiries">Edit Enquiries</Link>
        </li>
        <h4 className="mt-3">Contact</h4>
        <li>
          <Link to="/contact">Contacts</Link>
        </li>
        <li>
          <Link to="/contact/edit-contact">Edit Contacts</Link>
        </li>
        <li>
          <Link to="/contact/account">Contact Account</Link>
        </li>
        <li>
          <Link to="/contact/account/add-account">Add Account</Link>
        </li>
        <li>
          <Link to="/contact/account/lookup">Lookup</Link>
        </li>
        <h4 className="mt-3">Reports</h4>
        <li>
          <Link to="/reports/business-report">Business Report</Link>
        </li>
        <li>
          <Link to="/reports/invoices-report">Invoices Report</Link>
        </li>
        <li>
          <Link to="/reports/online-payments-report">
            Online Payments Report
          </Link>
        </li>
        <li>
          <Link to="/reports/payments-report">Payments Report</Link>
        </li>
        <li>
          <Link to="/reports/debtors-report">Debtors Report</Link>
        </li>
        <li>
          <Link to="/reports/deposits-report">Deposits Report</Link>
        </li>
        <li>
          <Link to="/reports/exchequer-report">Exchequer Report</Link>
        </li>
        <li>
          <Link to="/reports/transactions-export">Transactions Export</Link>
        </li>
        <li>
          <Link to="/reports/booking-notes-report">Booking Notes Report</Link>
        </li>
        <li>
          <Link to="/reports/coupons-report">Coupons Report</Link>
        </li>
        <li>
          <Link to="/reports/dietrequirements-report">
            Dietrequirements Report
          </Link>
        </li>
        <li>
          <Link to="/reports/drinks-report">Drinks Report</Link>
        </li>
        <li>
          <Link to="/reports/tracking-report">Tracking Report</Link>
        </li>
        <li>
          <Link to="/reports/party-feedback-report">Party Feedback Report</Link>
        </li>
        <li>
          <Link to="/reports/party-numbers-report">Party Numbers Report</Link>
        </li>
        <li>
          <Link to="/reports/requirements-report">Requirements Report</Link>
        </li>
        <li>
          <Link to="/reports/contact-sources-report">
            Contact Sources Report
          </Link>
        </li>
        <li>
          <Link to="/reports/drinks-sundries-totals-report">
            Drinks Sundries Totals Report
          </Link>
        </li>
        <li>
          <Link to="/reports/monthly-revenue-report">
            Monthly Revenue Report
          </Link>
        </li>
        <li>
          <Link to="/reports/event-numbers-comparison-totals">
            Event Numbers Comparison Totals
          </Link>
        </li>
        <li>
          <Link to="/reports/comparison-type-report">
            Comparison Type Report
          </Link>
        </li>
        <li>
          <Link to="/reports/event-numbers-comparison-report">
            Event Numbers Comparison Report
          </Link>
        </li>
        <li>
          <Link to="/reports/products-order-summary">
            Products Order Summary
          </Link>
        </li>
        <li>
          <Link to="/reports/ticket-revenue-report">Ticket Revenue Report</Link>
        </li>
        <li>
          <Link to="/reports/total-bookings-by-user">
            Total Bookings by User
          </Link>
        </li>
        <h4 className="mt-3">Admin</h4>
        <h5 className="mt-3">Events</h5>
        <li>
          <Link to="/admin/events/parties">Events / Parties</Link>
        </li>
        <li>
          <Link to="/admin/events/parties/add-parties">
            Add New Events / Parties
          </Link>
        </li>
        <li>
          <Link to="/admin/events/venues">Venues</Link>
        </li>
        <li>
          <Link to="/admin/events/venues/add-edit-venues">Add New Venues</Link>
        </li>
        <li>
          <Link to="/admin/events/themes">Themes</Link>
        </li>
        <li>
          <Link to="/admin/events/themes">Add New Theme</Link>
        </li>
        <li>
          <Link to="/admin/products">Products</Link>
        </li>
        <li>
          <Link to="/admin/products/add-edit-products">Add New Product</Link>
        </li>

        <li>
          <Link to="/coupons">Coupons</Link>
        </li>
        <li>
          <Link to="/coupons/add-edit-coupons">Edit Coupons</Link>
        </li>
        <li>
          <Link to="/sales-rules">Sales Rules</Link>
        </li>
        <li>
          <Link to="/sales-rules/add-edit-sales-rules">Edit Sales Rules</Link>
        </li>
        <li>
          <Link to="/events-status">Events Statuses</Link>
        </li>
        <li>
          <Link to="/events-status/add-edit-event-status">
            Edit Events Statuses
          </Link>
        </li>
        <li>
          <Link to="/availability-status">Availability Status</Link>
        </li>
        <li>
          <Link to="/availability-status/add-edit-availability-status">
            Edit Availability Status
          </Link>
        </li>
        <h5 className="mt-3">Financial</h5>
        <li>
          <Link to="/billable-items">Billable Items</Link>
        </li>
        <li>
          <Link to="/billable-items/add-edit-billable-items">
            Add New Bilable Item
          </Link>
        </li>
        <li>
          <Link to="/payment-options">Payment Options</Link>
        </li>
        <li>
          <Link to="/payment-options/add-edit-payment-options">
            Add New Payment Option
          </Link>
        </li>
        <li>
          <Link to="/tax-codes">Tax Codes</Link>
        </li>
        <li>
          <Link to="/tax-codes/add-edit-tax-codes">Add New Tax Code</Link>
        </li>
        <li>
          <Link to="/sales-rules">Sales Rules</Link>
        </li>
        <li>
          <Link to="/sales-rules/add-edit-sales-rules">
            Add New Sales Rules
          </Link>
        </li>
        <h5 className="mt-3">Mail</h5>
        <li>
          <Link to="/transactional-emails">Transactional Email</Link>
        </li>
        <li>
          <Link to="/transactional-emails/add-edit-transactional-emails">
            Add New Transactional Email
          </Link>
        </li>
        <li>
          <Link to="/mail-assets">Mail Assets</Link>
        </li>
        <li>
          <Link to="/mail-assets/add-edit-mail-assets">Add New Mail Asset</Link>
        </li>
        <li>
          <Link to="/letters">Letters</Link>
        </li>
        <li>
          <Link to="/letters/add-edit-letters">Add New Letter</Link>
        </li>
        <h5 className="mt-3">Pages</h5>
        <li>
          <Link to="/pages">Pages</Link>
        </li>
        <li>
          <Link to="/pages/add-edit-pages">Add New Page</Link>
        </li>
        <h5 className="mt-3">Contact Sources</h5>
        <li>
          <Link to="/contact-sources">Contact Sources</Link>
        </li>
        <li>
          <Link to="/contact-sources/add-edit-contact-sources">
            Add New Sourse
          </Link>
        </li>
        <li>
          <Link to="/categories-sources">Sources Categories</Link>
        </li>
        <li>
          <Link to="/categories-sources/add-edit-sources-categories">
            Add New Sources Category
          </Link>
        </li>
        <h5 className="mt-3">FAQs</h5>
        <li>
          <Link to="/faqs">FAQs</Link>
        </li>
        <li>
          <Link to="/faqs/add-edit-faqs">Add New FAQ</Link>
        </li>
        <li>
          <Link to="/faqs-categories">FAQ Categories</Link>
        </li>
        <li>
          <Link to="/faqs-categories/add-edit-faqs-categories">
            Add New FAQ Categories
          </Link>
        </li>
        <h5 className="mt-3">System</h5>
        <li>
          <Link to="/admin/system">System</Link>
        </li>
        <li>
          <Link to="/admin/note-types">Note Types</Link>
        </li>
        <li>
          <Link to="/admin/note-types/add-edit-note-types">
            Add New Note Type
          </Link>
        </li>
        <h4 className="mt-3">Main Admin</h4>
        <li>
          <Link to="/security">Security</Link>
        </li>
        <li>
          <Link to="/security/addeditsecurity">Add User</Link>
        </li>
      </ul>
    </div>
  );
}
