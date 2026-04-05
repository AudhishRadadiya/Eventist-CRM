import { useState, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../Assets/Img/logo-light.svg';
import HomeIcon from '../../Assets/Img/home.svg';
import UserIcon from '../../Assets/Img/user-icon.svg';
import LockIcon from '../../Assets/Img/lock-red.svg';
import EnvelopesBulkIcon from '../../Assets/Img/envelopes-bulk.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { showMessage } from 'store/reducers/common.slice';
import { useDispatch, useSelector } from 'react-redux';
import RemoveCookies from 'hooks/RemoveCookies';
import { clearData } from 'store/reducers/SearchPanel/globalSearch.slice';
import { setIsUserLogin } from 'store/reducers/User/auth.slice';

export default function Header({ setRoute, setSearchHeaderData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

  const handleItemClick = () => {
    // Close the dropdown
    dropdownRef.current.click();
  };

  const { userPermissionDetail } = useSelector(({ user }) => user);

  return (
    <header>
      {expanded && (
        <span
          className="overlay_wrapper"
          onClick={() => setExpanded(false)}
        ></span>
      )}
      <Row className="align-items-center">
        <Col xxl={6} xs={4}>
          <div className="left_menu">
            <div className="logo_wrap">
              <Link to="/">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>
            <div className="menu_wrap">
              <Navbar expand="xxl" collapseOnSelect expanded={expanded}>
                <Navbar.Toggle
                  aria-controls="basic-navbar-nav"
                  onClick={() => setExpanded(expanded ? false : 'expanded')}
                />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto main_navbar">
                    <ul>
                      <li>
                        <Link
                          to="/"
                          as={Link}
                          onClick={() => setExpanded(false)}
                          className={location.pathname === '/' && 'active'}
                        >
                          <img src={HomeIcon} alt="Home Icon" />
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          to="/abandad_cart"
                          as={Link}
                          className={
                            location.pathname === '/abandad_cart'
                              ? 'active'
                              : ''
                          }
                        >
                          <img
                            src={EnvelopesBulkIcon}
                            alt="Envelopes Bulk Icon"
                          />
                        </Link>
                      </li> */}
                      <li>
                        <Link
                          onClick={() => setExpanded(false)}
                          to="/parties"
                          className={
                            (location.pathname === '/parties' ||
                              location.pathname === '/event-dashboard' ||
                              location.pathname === '/exclusive-only' ||
                              location.pathname === '/create-new-booking' ||
                              location.pathname.includes(
                                '/location-event-data',
                              )) &&
                            'active'
                          }
                        >
                          Parties
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => setExpanded(false)}
                          to="/bookings"
                          className={
                            (location.pathname === '/bookings' ||
                              location.pathname === '/edit-bookings' ||
                              location.pathname === '/add-payment' ||
                              location.pathname === '/send-new-email' ||
                              location.pathname === '/send-new-letter') &&
                            'active'
                          }
                        >
                          Bookings
                        </Link>
                      </li>
                      <li className="has-children">
                        <Link
                          to="/contact"
                          onClick={() => setExpanded(false)}
                          className={
                            (location.pathname === '/contact' ||
                              location.pathname === '/contact/add-contact' ||
                              location.pathname === '/contact/edit-contact' ||
                              location.pathname === '/contact/account' ||
                              location.pathname ===
                                '/contact/account/add-account' ||
                              location.pathname ===
                                '/contact/account/lookup') &&
                            'active'
                          }
                        >
                          Contacts
                        </Link>
                        {userPermissionDetail?.contacts &&
                          userPermissionDetail?.admin && (
                            <ul className="sub-menu">
                              <li>
                                <Link to="/contact/account">Account</Link>
                              </li>
                            </ul>
                          )}
                      </li>
                      {userPermissionDetail?.contacts &&
                        userPermissionDetail?.admin && (
                          <li className="mobile_show">
                            <Link
                              to="/contact/account"
                              onClick={() => setExpanded(false)}
                            >
                              Contacts Account
                            </Link>
                          </li>
                        )}
                      {userPermissionDetail?.admin &&
                        userPermissionDetail?.reports && (
                          <li>
                            <NavDropdown
                              title="Reports"
                              id="Reports-dropdown"
                              autoClose={true}
                              className={
                                (location.pathname ===
                                  '/reports/business-report' ||
                                  location.pathname ===
                                    '/reports/invoices-report' ||
                                  location.pathname ===
                                    '/reports/online-payments-report' ||
                                  location.pathname ===
                                    '/reports/payments-report' ||
                                  location.pathname ===
                                    '/reports/debtors-report' ||
                                  location.pathname ===
                                    '/reports/deposits-report' ||
                                  location.pathname ===
                                    '/reports/exchequer-report' ||
                                  location.pathname ===
                                    '/reports/transactions-export' ||
                                  location.pathname ===
                                    '/reports/booking-notes-report' ||
                                  location.pathname ===
                                    '/reports/coupons-report' ||
                                  location.pathname ===
                                    '/reports/dietrequirements-report' ||
                                  location.pathname ===
                                    '/reports/drinks-report' ||
                                  location.pathname ===
                                    '/reports/tracking-report' ||
                                  location.pathname ===
                                    '/reports/party-feedback-report' ||
                                  location.pathname ===
                                    '/reports/party-numbers-report' ||
                                  location.pathname ===
                                    '/reports/requirements-report' ||
                                  location.pathname ===
                                    '/reports/drinks-sundries-totals-report' ||
                                  location.pathname ===
                                    '/reports/contact-sources-report' ||
                                  location.pathname ===
                                    '/reports/monthly-revenue-report' ||
                                  location.pathname ===
                                    '/reports/event-numbers-comparison-totals' ||
                                  location.pathname ===
                                    '/reports/comparison-type-report' ||
                                  location.pathname ===
                                    '/reports/event-numbers-comparison-report' ||
                                  location.pathname ===
                                    '/reports/products-order-summary' ||
                                  location.pathname ===
                                    '/reports/ticket-revenue-report' ||
                                  location.pathname ===
                                    '/reports/total-bookings-by-user') &&
                                'active'
                              }
                            >
                              <Row>
                                <Col xxl={4}>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/business-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/business-report' && 'active'
                                    }
                                  >
                                    ACCOUNTS: Business Done
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/invoices-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/invoices-report' && 'active'
                                    }
                                  >
                                    ACCOUNTS: Daily Invoices
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/online-payments-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/online-payments-report' &&
                                      'active'
                                    }
                                  >
                                    ACCOUNTS: Daily Online Payment Totals
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/payments-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/payments-report' && 'active'
                                    }
                                  >
                                    ACCOUNTS: Daily Payments
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/debtors-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/debtors-report' && 'active'
                                    }
                                  >
                                    ACCOUNTS: Debtors
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/deposits-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/deposits-report' && 'active'
                                    }
                                  >
                                    ACCOUNTS: Deposits List
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/exchequer-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/exchequer-report' && 'active'
                                    }
                                  >
                                    ACCOUNTS: Exchequer Data
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/transactions-export"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/transactions-export' &&
                                      'active'
                                    }
                                  >
                                    ACCOUNTS: Transactions Export
                                  </NavDropdown.Item>
                                </Col>
                                <Col xxl={4}>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/booking-notes-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/booking-notes-report' &&
                                      'active'
                                    }
                                  >
                                    OPS: Booking Notes
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/coupons-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/coupons-report' && 'active'
                                    }
                                  >
                                    OPS: Coupons
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/dietrequirements-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/dietrequirements-report' &&
                                      'active'
                                    }
                                  >
                                    OPS: Dietary Requirements
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/drinks-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/drinks-report' && 'active'
                                    }
                                  >
                                    OPS: Drinks Order Summary
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/tracking-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/tracking-report' && 'active'
                                    }
                                  >
                                    OPS: Item Tracking
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/party-feedback-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/party-feedback-report' &&
                                      'active'
                                    }
                                  >
                                    OPS: Party Feedback
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/party-numbers-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/party-numbers-report' &&
                                      'active'
                                    }
                                  >
                                    OPS: Party Numbers
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/requirements-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/requirements-report' &&
                                      'active'
                                    }
                                  >
                                    OPS: Special Requirements
                                  </NavDropdown.Item>
                                </Col>
                                <Col xxl={4}>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/contact-sources-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/contact-sources-report' &&
                                      'active'
                                    }
                                  >
                                    SALES: Contact Sources
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/drinks-sundries-totals-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/drinks-sundries-totals-report' &&
                                      'active'
                                    }
                                  >
                                    SALES: Drinks & Dodgems KPIs
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/monthly-revenue-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/monthly-revenue-report' &&
                                      'active'
                                    }
                                  >
                                    SALES: Monthly Revenue
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/event-numbers-comparison-totals"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/event-numbers-comparison-totals' &&
                                      'active'
                                    }
                                  >
                                    SALES: Number Comparison Totals
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/comparison-type-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/comparison-type-report' &&
                                      'active'
                                    }
                                  >
                                    SALES: Number Comparison by Type
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/event-numbers-comparison-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/event-numbers-comparison-report' &&
                                      'active'
                                    }
                                  >
                                    SALES: Number Comparisons
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/products-order-summary"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/products-order-summary' &&
                                      'active'
                                    }
                                  >
                                    SALES: Product Sales Report
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/ticket-revenue-report"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/ticket-revenue-report' &&
                                      'active'
                                    }
                                  >
                                    SALES: Ticket Revenue
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    as={Link}
                                    to="/reports/total-bookings-by-user"
                                    onClick={() => setExpanded(false)}
                                    className={
                                      location.pathname ===
                                        '/reports/total-bookings-by-user' &&
                                      'active'
                                    }
                                  >
                                    SALES: Total Bookings By User
                                  </NavDropdown.Item>
                                </Col>
                              </Row>
                            </NavDropdown>
                          </li>
                        )}
                      <li>
                        <Link
                          to="/enquiries"
                          onClick={() => setExpanded(false)}
                          // className="btn_border small"
                          className={
                            location.pathname === '/enquiries' ||
                            location.pathname === '/edit-enquiries'
                              ? 'btn_primary small'
                              : 'btn_border small'
                          }
                        >
                          Enquiries
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contact"
                          onClick={() => setExpanded(false)}
                          className="btn_border small"
                        >
                          Search & Add New Enquiry
                        </Link>
                      </li>
                    </ul>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
          </div>
        </Col>
        <Col xxl={6} xs={8}>
          <div className="right_menu">
            <ul>
              <li>
                CRMBO v1.5: <span>Best Parties Ever</span>
              </li>
              <li>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    dispatch(clearData());
                    setRoute(true);
                    setSearchHeaderData({
                      start: 0,
                      limit: 10,
                      data: {
                        ref_no: searchValue.trim(),
                        enquiries: 'both',
                        search_ref: true,
                        include: 'cancelled_booking',
                        year: {
                          eq: '',
                          ne: '',
                          gt: '',
                          gte: '',
                          lt: '',
                          lte: '',
                          multiple: [],
                        },
                        theme: '',
                        location: '',
                        places_is: 'provisional',
                        places: {
                          eq: '',
                          ne: '',
                          gt: '',
                          gte: '',
                          lt: '',
                          lte: '',
                          multiple: [],
                        },
                        method: '',
                        invoiced: '',
                        e_ticket_send: '',
                        billable_items_ordered: '',
                        results_order: 'ref_no',
                        asd_dsd: 1,
                        first_confirmed_date: {
                          eq: '',
                          ne: '',
                          gt: '',
                          gte: '',
                          lt: '',
                          lte: '',
                          multiple: [],
                        },
                        days_left: {
                          eq: '',
                          ne: '',
                          gt: '',
                          gte: '',
                          lt: '',
                          lte: '',
                          multiple: [],
                        },
                        due: {
                          eq: '',
                          ne: '',
                          gt: '',
                          gte: '',
                          lt: '',
                          lte: '',
                          multiple: [],
                        },
                        paid: {
                          eq: '',
                          ne: '',
                          gt: '',
                          gte: '',
                          lt: '',
                          lte: '',
                          multiple: [],
                        },
                        paid_is: 'group_payment',
                        contact_type: {
                          eq: '',
                          ne: '',
                          multiple: [],
                        },
                        created_by: [],
                        last_updated_by: [],
                        showSQL: false,
                        showData: false,
                      },
                    });
                  }}
                >
                  <div className="search_wrap">
                    <input
                      type="search"
                      placeholder="Search"
                      className="form-control"
                      value={searchValue}
                      onChange={event => setSearchValue(event.target.value)}
                    />
                    <button
                      className="btn_primary small"
                      type="submit"
                      // onClick={() => {
                      //   dispatch(clearData());
                      //   setRoute(true);
                      //   setSearchHeaderData({
                      //     start: 0,
                      //     limit: 10,
                      //     data: {
                      //       ref_no: +searchValue.trim(),
                      //       enquiries: 'both',
                      //       search_ref: true,
                      //       include: '',
                      //       year: {
                      //         eq: '',
                      //         ne: '',
                      //         gt: '',
                      //         gte: '',
                      //         lt: '',
                      //         lte: '',
                      //         multiple: [],
                      //       },
                      //       theme: '',
                      //       location: '',
                      //       places_is: 'provisional',
                      //       places: {
                      //         eq: '',
                      //         ne: '',
                      //         gt: '',
                      //         gte: '',
                      //         lt: '',
                      //         lte: '',
                      //         multiple: [],
                      //       },
                      //       method: '',
                      //       invoiced: '',
                      //       e_ticket_send: '',
                      //       billable_items_ordered: '',
                      //       results_order: 'ref_no',
                      //       asd_dsd: 1,
                      //       first_confirmed_date: {
                      //         eq: '',
                      //         ne: '',
                      //         gt: '',
                      //         gte: '',
                      //         lt: '',
                      //         lte: '',
                      //         multiple: [],
                      //       },
                      //       days_left: {
                      //         eq: '',
                      //         ne: '',
                      //         gt: '',
                      //         gte: '',
                      //         lt: '',
                      //         lte: '',
                      //         multiple: [],
                      //       },
                      //       due: {
                      //         eq: '',
                      //         ne: '',
                      //         gt: '',
                      //         gte: '',
                      //         lt: '',
                      //         lte: '',
                      //         multiple: [],
                      //       },
                      //       paid: {
                      //         eq: '',
                      //         ne: '',
                      //         gt: '',
                      //         gte: '',
                      //         lt: '',
                      //         lte: '',
                      //         multiple: [],
                      //       },
                      //       paid_is: 'group_payment',
                      //       contact_type: {
                      //         eq: '',
                      //         ne: '',
                      //         multiple: [],
                      //       },
                      //       created_by: [],
                      //       last_updated_by: [],
                      //       showSQL: false,
                      //       showData: false,
                      //     },
                      //   });
                      // }}
                    >
                      <SearchOutlinedIcon />
                    </button>
                  </div>
                </form>
              </li>
              <li>
                <Link
                  to="/my-booking"
                  className={
                    location.pathname === '/my-booking' ? 'active' : ''
                  }
                >
                  My Bookings
                </Link>
              </li>

              {userPermissionDetail?.admin && (
                <li className="nav-item dropdown">
                  <Link
                    to=""
                    data-bs-toggle="dropdown"
                    ref={dropdownRef}
                    className={
                      location.pathname === '/admin/events/parties' ||
                      location.pathname ===
                        '/admin/events/parties/add-parties' ||
                      location.pathname === '/admin/events/venues' ||
                      location.pathname ===
                        '/admin/events/venues/add-edit-venues' ||
                      location.pathname === '/admin/events/themes' ||
                      location.pathname === '/admin/events/add-edit-themes' ||
                      location.pathname === '/admin/products' ||
                      location.pathname ===
                        '/admin/products/add-edit-products' ||
                      location.pathname ===
                        '/admin/products/products-categories' ||
                      location.pathname ===
                        '/admin/products/add-edit-products-categories' ||
                      location.pathname === '/coupons' ||
                      location.pathname === '/coupons/add-edit-coupons' ||
                      location.pathname === '/sales-rules' ||
                      location.pathname ===
                        '/sales-rules/add-edit-sales-rules' ||
                      location.pathname === '/events-status' ||
                      location.pathname ===
                        '/events-status/add-edit-event-status' ||
                      location.pathname === '/availability-status' ||
                      location.pathname ===
                        '/availability-status/add-edit-availability-status' ||
                      location.pathname === '/billable-items' ||
                      location.pathname ===
                        '/billable-items/add-edit-billable-items' ||
                      location.pathname === '/payment-options' ||
                      location.pathname ===
                        '/payment-options/add-edit-payment-options' ||
                      location.pathname === '/tax-codes' ||
                      location.pathname === '/tax-codes/add-edit-tax-codes' ||
                      location.pathname === '/sales-rules' ||
                      location.pathname ===
                        '/sales-rules/add-edit-sales-rules' ||
                      location.pathname === '/transactional-emails' ||
                      location.pathname ===
                        '/transactional-emails/add-edit-transactional-emails' ||
                      location.pathname === '/mail-assets' ||
                      location.pathname ===
                        '/mail-assets/add-edit-mail-assets' ||
                      location.pathname === '/letters' ||
                      location.pathname === '/letters/add-edit-letters' ||
                      location.pathname === '/pages' ||
                      location.pathname === '/pages/add-edit-pages' ||
                      location.pathname === '/contact-sources' ||
                      location.pathname ===
                        '/contact-sources/add-edit-contact-sources' ||
                      location.pathname === '/categories-sources' ||
                      location.pathname ===
                        '/categories-sources/add-edit-sources-categories' ||
                      location.pathname === '/faqs' ||
                      location.pathname === '/faqs/add-edit-faqs' ||
                      location.pathname === '/faqs-categories' ||
                      location.pathname ===
                        '/faqs-categories/add-edit-faqs-categories' ||
                      location.pathname === '/admin/system' ||
                      location.pathname === '/admin/note-types' ||
                      location.pathname ===
                        '/admin/note-types/add-edit-note-types'
                        ? 'nav-link  dropdown-toggle active'
                        : 'nav-link  dropdown-toggle '
                    }
                  >
                    Admin
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-right">
                    <li>
                      <Link
                        to="/admin/events/parties"
                        className={
                          location.pathname === '/admin/events/parties' ||
                          location.pathname ===
                            '/admin/events/parties/add-parties' ||
                          location.pathname === '/admin/events/venues' ||
                          location.pathname ===
                            '/admin/events/venues/add-edit-venues' ||
                          location.pathname === '/admin/events/themes' ||
                          location.pathname ===
                            '/admin/events/add-edit-themes' ||
                          location.pathname === '/admin/products' ||
                          location.pathname ===
                            '/admin/products/add-edit-products' ||
                          location.pathname ===
                            '/admin/products/products-categories' ||
                          location.pathname ===
                            '/admin/products/add-edit-products-categories' ||
                          location.pathname === '/coupons' ||
                          location.pathname === '/coupons/add-edit-coupons' ||
                          location.pathname === '/sales-rules' ||
                          location.pathname ===
                            '/sales-rules/add-edit-sales-rules' ||
                          location.pathname === '/events-status' ||
                          location.pathname ===
                            '/events-status/add-edit-event-status' ||
                          location.pathname === '/availability-status' ||
                          location.pathname ===
                            '/availability-status/add-edit-availability-status'
                            ? 'dropdown-item active'
                            : 'dropdown-item '
                        }
                        onClick={handleItemClick}
                      >
                        Events
                      </Link>
                      <ul className="submenu submenu-left dropdown-menu">
                        <li>
                          <Link
                            to="/admin/events/parties"
                            className={
                              location.pathname === '/admin/events/parties' ||
                              location.pathname ===
                                '/admin/events/parties/add-parties'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Parties
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/events/venues"
                            className={
                              location.pathname === '/admin/events/venues' ||
                              location.pathname ===
                                '/admin/events/venues/add-edit-venues'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Venues
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/events/themes"
                            className={
                              location.pathname === '/admin/events/themes' ||
                              location.pathname ===
                                '/admin/events/add-edit-themes'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Themes
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/products"
                            className={
                              location.pathname === '/admin/products' ||
                              location.pathname ===
                                '/admin/products/add-edit-products' ||
                              location.pathname ===
                                '/admin/products/products-categories' ||
                              location.pathname ===
                                '/admin/products/add-edit-products-categories'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Products
                          </Link>
                          <ul className="submenu submenu-left dropdown-menu">
                            <li>
                              <Link
                                to="/admin/products/products-categories"
                                className={
                                  location.pathname ===
                                    '/admin/products/products-categories' ||
                                  location.pathname ===
                                    '/admin/products/add-edit-products-categories'
                                    ? 'dropdown-item active'
                                    : 'dropdown-item '
                                }
                                onClick={handleItemClick}
                              >
                                Category
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link
                            to="/coupons"
                            className={
                              location.pathname === '/coupons' ||
                              location.pathname === '/coupons/add-edit-coupons'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Coupons
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/sales-rules"
                            className={
                              location.pathname === '/sales-rules' ||
                              location.pathname ===
                                '/sales-rules/add-edit-sales-rules'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Sales Rules
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/events-status"
                            className={
                              location.pathname === '/events-status' ||
                              location.pathname ===
                                '/events-status/add-edit-event-status'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Event Statuses
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/availability-status"
                            className={
                              location.pathname === '/availability-status' ||
                              location.pathname ===
                                '/availability-status/add-edit-availability-status'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Availability Statuses
                          </Link>
                        </li>
                      </ul>
                    </li>
                    {userPermissionDetail?.dev && (
                      <li>
                        <Link
                          to="/billable-items"
                          className={
                            location.pathname === '/billable-items' ||
                            location.pathname ===
                              '/billable-items/add-edit-billable-items' ||
                            location.pathname === '/payment-options' ||
                            location.pathname ===
                              '/payment-options/add-edit-payment-options' ||
                            location.pathname === '/tax-codes' ||
                            location.pathname ===
                              '/tax-codes/add-edit-tax-codes' ||
                            location.pathname === '/sales-rules' ||
                            location.pathname ===
                              '/sales-rules/add-edit-sales-rules'
                              ? 'dropdown-item active'
                              : 'dropdown-item '
                          }
                          onClick={handleItemClick}
                        >
                          Financial
                        </Link>
                        <ul className="submenu submenu-left dropdown-menu">
                          <li>
                            <Link
                              to="/billable-items"
                              className={
                                location.pathname === '/billable-items' ||
                                location.pathname ===
                                  '/billable-items/add-edit-billable-items'
                                  ? 'dropdown-item active'
                                  : 'dropdown-item '
                              }
                              onClick={handleItemClick}
                            >
                              Billable Item Types
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/payment-options"
                              className={
                                location.pathname === '/payment-options' ||
                                location.pathname ===
                                  '/payment-options/add-edit-payment-options'
                                  ? 'dropdown-item active'
                                  : 'dropdown-item '
                              }
                              onClick={handleItemClick}
                            >
                              Payment Options
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/tax-codes"
                              className={
                                location.pathname === '/tax-codes' ||
                                location.pathname ===
                                  '/tax-codes/add-edit-tax-codes'
                                  ? 'dropdown-item active'
                                  : 'dropdown-item '
                              }
                              onClick={handleItemClick}
                            >
                              Tax Codes
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/sales-rules"
                              className={
                                location.pathname === '/sales-rules' ||
                                location.pathname ===
                                  '/sales-rules/add-edit-sales-rules'
                                  ? 'dropdown-item active'
                                  : 'dropdown-item '
                              }
                              onClick={handleItemClick}
                            >
                              Sales Rules
                            </Link>
                          </li>
                        </ul>
                      </li>
                    )}
                    <li>
                      <Link
                        to="/transactional-emails"
                        className={
                          location.pathname === '/transactional-emails' ||
                          location.pathname ===
                            '/transactional-emails/add-edit-transactional-emails' ||
                          location.pathname === '/mail-assets' ||
                          location.pathname ===
                            '/mail-assets/add-edit-mail-assets' ||
                          location.pathname === '/letters' ||
                          location.pathname === '/letters/add-edit-letters'
                            ? 'dropdown-item active'
                            : 'dropdown-item '
                        }
                        onClick={handleItemClick}
                      >
                        Mail
                      </Link>
                      <ul className="submenu submenu-left dropdown-menu">
                        <li>
                          <Link
                            to="/transactional-emails"
                            className={
                              location.pathname === '/transactional-emails' ||
                              location.pathname ===
                                '/transactional-emails/add-edit-transactional-emails'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Transactional Emails
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/mail-assets"
                            className={
                              location.pathname === '/mail-assets' ||
                              location.pathname ===
                                '/mail-assets/add-edit-mail-assets'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Mail Assets
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/letters"
                            className={
                              location.pathname === '/letters' ||
                              location.pathname === '/letters/add-edit-letters'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Letters
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/pages"
                        className={
                          location.pathname === '/pages' ||
                          location.pathname === '/pages/add-edit-pages'
                            ? 'dropdown-item active'
                            : 'dropdown-item '
                        }
                        onClick={handleItemClick}
                      >
                        Pages
                      </Link>
                    </li>
                    {userPermissionDetail?.dev && (
                      <>
                        <li>
                          <Link
                            to="/contact-sources"
                            className={
                              location.pathname === '/contact-sources' ||
                              location.pathname ===
                                '/contact-sources/add-edit-contact-sources' ||
                              location.pathname === '/categories-sources' ||
                              location.pathname ===
                                '/categories-sources/add-edit-sources-categories'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            Contact Sources
                          </Link>
                          <ul className="submenu submenu-left dropdown-menu">
                            <li>
                              <Link
                                to="/categories-sources"
                                className={
                                  location.pathname === '/categories-sources' ||
                                  location.pathname ===
                                    '/categories-sources/add-edit-sources-categories'
                                    ? 'dropdown-item active'
                                    : 'dropdown-item '
                                }
                                onClick={handleItemClick}
                              >
                                Sources Categories
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link
                            to="/faqs"
                            className={
                              location.pathname === '/faqs' ||
                              location.pathname === '/faqs/add-edit-faqs' ||
                              location.pathname === '/faqs-categories' ||
                              location.pathname ===
                                '/faqs-categories/add-edit-faqs-categories'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            FAQs
                          </Link>
                          <ul className="submenu submenu-left dropdown-menu">
                            <li>
                              <Link
                                to="/faqs-categories"
                                className={
                                  location.pathname === '/faqs-categories' ||
                                  location.pathname ===
                                    '/faqs-categories/add-edit-faqs-categories'
                                    ? 'dropdown-item active'
                                    : 'dropdown-item '
                                }
                                onClick={handleItemClick}
                              >
                                FAQs Categories
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link
                            to="/admin/system"
                            className={
                              location.pathname === '/admin/system' ||
                              location.pathname === '/admin/note-types' ||
                              location.pathname ===
                                '/admin/note-types/add-edit-note-types'
                                ? 'dropdown-item active'
                                : 'dropdown-item '
                            }
                            onClick={handleItemClick}
                          >
                            System
                          </Link>
                          <ul className="submenu submenu-left dropdown-menu">
                            <li>
                              <Link
                                to="/admin/note-types"
                                className={
                                  location.pathname === '/admin/note-types' ||
                                  location.pathname ===
                                    '/admin/note-types/add-edit-note-types'
                                    ? 'dropdown-item active'
                                    : 'dropdown-item '
                                }
                                onClick={handleItemClick}
                              >
                                Note Types
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </>
                    )}
                  </ul>
                </li>
              )}
              {userPermissionDetail?.super && (
                <li className="px-2">
                  <Link
                    to="/security"
                    className={
                      location.pathname === '/security' ||
                      location.pathname === '/security/addeditsecurity'
                        ? 'active'
                        : ''
                    }
                  >
                    <img src={LockIcon} alt="Lock Icon" className="lock_img" />
                  </Link>
                </li>
              )}
              <li className="nav-item dropdown">
                <Link
                  to=""
                  className="nav-link  dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <img src={UserIcon} alt="User Icon" />
                </Link>
                <ul className="dropdown-menu dropdown-menu-right">
                  <li
                    className="dropdown-item"
                    onClick={() => {
                      RemoveCookies('UserSessionCRM');
                      RemoveCookies('TokenCRM');
                      dispatch(setIsUserLogin(false));
                      setTimeout(() => {
                        dispatch(
                          showMessage({
                            message: 'Logged out Successfully',
                            varient: 'success',
                          }),
                        );
                        navigate('/login', { state: { prevRoute: location } });
                      }, 1000);
                    }}
                  >
                    Sign Out
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </header>
  );
}
