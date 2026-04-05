import React, { lazy, useEffect } from 'react';
// import { NotFoundPage } from 'app/pages/NotFoundPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import SiteMap from 'Components/Common/SiteMap';
import PrivateRouter from './PrivateRouter';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UnProtectedRoute from './UnProtectedRoute.config';
// import TicketRevenueReportTable from 'Components/Reports/Sales/TicketRevenueReportTable';

const EditBooking = lazy(() => import('Components/Bookings/Editbooking'));
const Guestlist = lazy(() => import('Components/Bookings/GuestList/Guestlist'));
const DirectoryBrowser = lazy(() =>
  import('Components/Bookings/DirectoryBrowser'),
);
const Invoices = lazy(() => import('Components/Bookings/Invoices'));
const InvoicesBill = lazy(() => import('Components/Bookings/InvoicesBill'));
const BookingETicket = lazy(() => import('Components/Bookings/BookingETicket'));
const BookingBillableItems = lazy(() =>
  import('Components/Bookings/BillableItems/BookingBillableItems'),
);
const AddBookingProduct = lazy(() =>
  import('Components/Bookings/BillableItems/AddBookingProduct'),
);
const HomePage = lazy(() => import('Components/Home/index'));
const Coupons = lazy(() => import('Components/Admin/Events/Coupons/index'));
const SalesRules = lazy(() =>
  import('Components/Admin/Events/SalesRules/index'),
);
const EventsStatus = lazy(() =>
  import('Components/Admin/Events/EventsStatuses/index'),
);
const AvailabilityStatus = lazy(() =>
  import('Components/Admin/Events/AvailabilityStatus/index'),
);
const ExclusiveOnly = lazy(() => import('Components/Parties/ExclusiveOnly'));
const CreateNewBooking = lazy(() =>
  import('Components/Parties/CreateNewBooking'),
);
const LocationEventData = lazy(() =>
  import('Components/Parties/LocationEventData'),
);
const AddEditCoupons = lazy(() =>
  import('Components/Admin/Events/Coupons/AddEditCoupons'),
);
const AddEditSalesRules = lazy(() =>
  import('Components/Admin/Events/SalesRules/AddEditSalesRules.js'),
);
const AddEditEventsStatus = lazy(() =>
  import('Components/Admin/Events/EventsStatuses/AddEditEventsStatus'),
);
const AddEditAvailabilityStatus = lazy(() =>
  import(
    'Components/Admin/Events/AvailabilityStatus/AddEditAvailabilityStatus'
  ),
);
const BillableItems = lazy(() =>
  import('Components/Admin/Financial/BillableItems/index'),
);
const AddEditBillableItem = lazy(() =>
  import('Components/Admin/Financial/BillableItems/AddEditBillableItem'),
);
const PaymentOptions = lazy(() =>
  import('Components/Admin/Financial/PaymentOptions/index'),
);
const AddEditPaymentOption = lazy(() =>
  import('Components/Admin/Financial/PaymentOptions/AddEditPaymentOption.js'),
);
const TaxCodes = lazy(() =>
  import('Components/Admin/Financial/TaxCodes/index'),
);
const AddEditTaxCode = lazy(() =>
  import('Components/Admin/Financial/TaxCodes/AddEditTaxCode.js'),
);
const TransactionalEmails = lazy(() =>
  import('Components/Admin/Mail/TransactionalEmails/index'),
);
const AddEditTransactionalEmails = lazy(() =>
  import(
    'Components/Admin/Mail/TransactionalEmails/AddEditTransactionalEmails'
  ),
);
const MailAssets = lazy(() => import('Components/Admin/Mail/MailAssets/index'));
const AddEditMailAsset = lazy(() =>
  import('Components/Admin/Mail/MailAssets/AddEditMailAsset'),
);
const Letters = lazy(() => import('Components/Admin/Mail/Letters/index'));
const AddEditLetter = lazy(() =>
  import('Components/Admin/Mail/Letters/AddEditLetter'),
);
const Pages = lazy(() => import('Components/Admin/Pages/index'));
const AddEditPage = lazy(() => import('Components/Admin/Pages/AddEditPage'));
const ContactSources = lazy(() =>
  import('Components/Admin/ContactSources/index'),
);
const AddEditContactSources = lazy(() =>
  import('Components/Admin/ContactSources/AddEditContactSources'),
);
const CategoriesSources = lazy(() =>
  import('Components/Admin/ContactSources/SourcesCategories/index'),
);
const AddEditSourcesCategories = lazy(() =>
  import(
    'Components/Admin/ContactSources/SourcesCategories/AddEditSourcesCategories'
  ),
);
const Faqs = lazy(() => import('Components/Admin/Faqs/index'));
const AddEditFaqs = lazy(() => import('Components/Admin/Faqs/AddEditFaqs'));
const FaqCategories = lazy(() =>
  import('Components/Admin/Faqs/FaqCategories/index'),
);
const AddEditFaqCategories = lazy(() =>
  import('Components/Admin/Faqs/FaqCategories/AddEditFaqCategories'),
);
const EditSystem = lazy(() => import('Components/Admin/System/EditSystem'));
const NoteTypes = lazy(() => import('Components/Admin/System/NoteTypes/index'));
const AddEditNoteType = lazy(() =>
  import('Components/Admin/System/NoteTypes/AddEditNoteType'),
);
const Parties = lazy(() => import('Components/Parties/Index'));
const EventParties = lazy(() => import('Components/Admin/Events/Parties'));
const EditParties = lazy(() =>
  import('Components/Admin/Events/Parties/EditParties'),
);
const AddParties = lazy(() =>
  import('Components/Admin/Events/Parties/AddParties'),
);
const EditEventDate = lazy(() =>
  import('Components/Admin/Events/Parties/EditEventDate'),
);
const Venues = lazy(() => import('Components/Admin/Events/Venues/index'));
const AddEditVenues = lazy(() =>
  import('Components/Admin/Events/Venues/AddEditVenues'),
);
const Themes = lazy(() => import('Components/Admin/Events/Themes/index'));
const AddEditThemes = lazy(() =>
  import('Components/Admin/Events/Themes/AddEditThemes'),
);
const Security = lazy(() => import('Components/Security/index'));
const AddEditSecurity = lazy(() =>
  import('Components/Security/AddEditSecurity'),
);
const Products = lazy(() => import('Components/Admin/Events/Products/index'));
const AddEditProducts = lazy(() =>
  import('Components/Admin/Events/Products/AddEditProducts'),
);
const ProductsCategories = lazy(() =>
  import('Components/Admin/Events/Products/ProductsCategories/index'),
);
const AddProductsCategories = lazy(() =>
  import(
    'Components/Admin/Events/Products/ProductsCategories/AddProductsCategories'
  ),
);
const Bookings = lazy(() => import('Components/Bookings/index'));
const MyBooking = lazy(() => import('Components/MyBooking/index'));
const AddPayment = lazy(() => import('Components/Bookings/AddPayment'));
const SendNewEmail = lazy(() => import('Components/Bookings/SendNewEmail'));
const SendNewLetter = lazy(() => import('Components/Bookings/SendNewLetter'));
const Enquiries = lazy(() => import('Components/Enquiries/Index'));
const EditEnquiries = lazy(() => import('Components/Enquiries/EditEnquiries'));
const Contact = lazy(() => import('Components/Contacts/index'));
const Account = lazy(() => import('Components/Contacts/Account/index'));
const EditContact = lazy(() => import('Components/Contacts/EditContact'));
const AddContact = lazy(() => import('Components/Contacts/AddContact'));
const AddAccount = lazy(() => import('Components/Contacts/Account/AddAccount'));
const Lookup = lazy(() => import('Components/Contacts/Account/Lookup'));
const BusinessReport = lazy(() =>
  import('Components/Reports/Account/BusinessReport'),
);
const InvoicesReport = lazy(() =>
  import('Components/Reports/Account/InvoicesReport'),
);
const PrintInvoicesReport = lazy(() =>
  import('Components/Reports/Account/InvoiceReportTable'),
);
const OnlinePaymentsReport = lazy(() =>
  import('Components/Reports/Account/OnlinePaymentsReport'),
);
const PrintOnlinePaymentsReport = lazy(() =>
  import('Components/Reports/Account/OnlinePaymentReportTable'),
);
const PaymentsReport = lazy(() =>
  import('Components/Reports/Account/PaymentsReport'),
);
const PrintPaymentsReport = lazy(() =>
  import('Components/Reports/Account/PaymentReportTable'),
);
const DebtorsReport = lazy(() =>
  import('Components/Reports/Account/DebtorsReport'),
);
const DepositsReport = lazy(() =>
  import('Components/Reports/Account/DepositsReport'),
);
const ExchequerReport = lazy(() =>
  import('Components/Reports/Account/ExchequerReport'),
);
const TransactionsExport = lazy(() =>
  import('Components/Reports/Account/TransactionsExport'),
);
const BookingNotesReport = lazy(() =>
  import('Components/Reports/OPS/BookingNotesReport'),
);
const BookingNotesReportTable = lazy(() =>
  import('Components/Reports/OPS/BookingNotesReportTable'),
);
const CouponsReport = lazy(() =>
  import('Components/Reports/OPS/CouponsReport'),
);
const CouponsReportTable = lazy(() =>
  import('Components/Reports/OPS/CouponsReportTable'),
);
const DietrequirementsReport = lazy(() =>
  import('Components/Reports/OPS/DietrequirementsReport'),
);
const DietrequirementsReportTable = lazy(() =>
  import('Components/Reports/OPS/DietrequirementsReportTable'),
);
const DrinksReport = lazy(() => import('Components/Reports/OPS/DrinksReport'));
const DrinksReportTable = lazy(() =>
  import('Components/Reports/OPS/DrinkReportTable'),
);
const TrackingReport = lazy(() =>
  import('Components/Reports/OPS/TrackingReport'),
);
const TrackingReportTable = lazy(() =>
  import('Components/Reports/OPS/TrackingReportTable'),
);
const PartyFeedbackReport = lazy(() =>
  import('Components/Reports/OPS/PartyFeedbackReport'),
);
const PartyFeedbackReportTable = lazy(() =>
  import('Components/Reports/OPS/PartyFeedbackReportTable'),
);
const PartyNumbersReport = lazy(() =>
  import('Components/Reports/OPS/PartyNumbersReport'),
);

const RequirementsReport = lazy(() =>
  import('Components/Reports/OPS/RequirementsReport'),
);
const RequirementsReportTable = lazy(() =>
  import('Components/Reports/OPS/RequirementsReportTable'),
);
const ContactSourcesReport = lazy(() =>
  import('Components/Reports/Sales/ContactSourcesReport'),
);
const ContactSourcesReportTable = lazy(() =>
  import('Components/Reports/Sales/ContactSourceReportTable'),
);
const DrinksSundriesReport = lazy(() =>
  import('Components/Reports/Sales/DrinksSundriesReport'),
);
const MonthlyRevenueReport = lazy(() =>
  import('Components/Reports/Sales/MonthlyRevenueReport'),
);
const MonthlyRevenueReportTable = lazy(() =>
  import('Components/Reports/Sales/MonthlyRevenueReportTable'),
);
const EventNumbersComparisonTotal = lazy(() =>
  import('Components/Reports/Sales/EventNumbersComparisonTotal'),
);

const EventNumbersComparisonTotalTable = lazy(() =>
  import('Components/Reports/Sales/EventNumbersComparisonTotalTable'),
);

const ComparisonTypeReport = lazy(() =>
  import('Components/Reports/Sales/ComparisonTypeReport'),
);

const ComparisonTypeReportTable = lazy(() =>
  import('Components/Reports/Sales/ComparisonTypeReportTable'),
);
const EventNumbersComparisonReport = lazy(() =>
  import('Components/Reports/Sales/EventNumbersComparison'),
);
const EventNumbersComparisonReportTable = lazy(() =>
  import('Components/Reports/Sales/EventNumbersComparisonTable'),
);
const ProductsOrderSummary = lazy(() =>
  import('Components/Reports/Sales/ProductsOrderSummary'),
);
const ProductsOrderSummaryTable = lazy(() =>
  import('Components/Reports/Sales/ProductsOrderSummaryTable'),
);
const TicketRevenueReport = lazy(() =>
  import('Components/Reports/Sales/TicketRevenueReport'),
);
const TicketRevenueReportTable = lazy(() =>
  import('Components/Reports/Sales/TicketRevenueReportTable'),
);
const TotalBookingsbyUser = lazy(() =>
  import('Components/Reports/Sales/TotalBookingsbyUser'),
);
const TotalBookingsbyUserReportTable = lazy(() =>
  import('Components/Reports/Sales/TotalBookingsByUserTable'),
);
const PrintBusinessReport = lazy(() =>
  import('Components/Reports/Account/BusinessReportTable'),
);
const PrintDebtorsReport = lazy(() =>
  import('Components/Reports/Account/DebtorsReportTable'),
);
const PrintDepositeReport = lazy(() =>
  import('Components/Reports/Account/DepositeReportTable'),
);
const PrintExchaquerReportTable = lazy(() =>
  import('Components/Reports/Account/ExchaquerReportTable'),
);
const PrintTransactionExportTable = lazy(() =>
  import('Components/Reports/Account/TransactionExportReportTable'),
);

const AccessDenied = lazy(() => import('Components/Common/AccessDenied'));
const Login = lazy(() => import('Components/Login/Login'));
const AbondartCart = lazy(() => import('Components/AbandadCart/AbandadCart'));
const HistoricalBooking = lazy(() =>
  import('Components/Bookings/HistoricalBooking'),
);

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  }, [navigate]);
};
export default function Index() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <UnProtectedRoute>
              <Login />
            </UnProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRouter>
              <HomePage />
            </PrivateRouter>
          }
        />
        <Route
          path="/sitemap"
          element={
            <PrivateRouter>
              <SiteMap />
            </PrivateRouter>
          }
        />
        <Route
          path="/parties"
          element={
            <PrivateRouter>
              <Parties />
            </PrivateRouter>
          }
        />
        <Route
          path="/coupons"
          element={
            <PrivateRouter>
              <Coupons />
            </PrivateRouter>
          }
        />
        <Route
          path="/sales-rules"
          element={
            <PrivateRouter>
              <SalesRules />
            </PrivateRouter>
          }
        />
        <Route
          path="/events-status"
          element={
            <PrivateRouter>
              <EventsStatus />
            </PrivateRouter>
          }
        />
        <Route
          path="/availability-status"
          element={
            <PrivateRouter>
              <AvailabilityStatus />
            </PrivateRouter>
          }
        />
        <Route
          path="/create-new-booking"
          element={
            <PrivateRouter>
              <CreateNewBooking />
            </PrivateRouter>
          }
        />
        <Route
          path="/create-new-booking/:eventDateId"
          element={
            <PrivateRouter>
              <CreateNewBooking />
            </PrivateRouter>
          }
        />
        {/*without id with LocationEventData is dummy rote, no needed */}
        <Route
          path="/location-event-data"
          element={
            <PrivateRouter>
              <LocationEventData />
            </PrivateRouter>
          }
        />
        <Route
          path="/location-event-data/:year"
          element={
            <PrivateRouter>
              <LocationEventData />
            </PrivateRouter>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRouter>
              <Bookings />
            </PrivateRouter>
          }
        />
        <Route
          path="/my-booking"
          element={
            <PrivateRouter>
              <MyBooking />
            </PrivateRouter>
          }
        />
        <Route
          path="/abandad_cart"
          element={
            <PrivateRouter>
              <AbondartCart />
            </PrivateRouter>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <PrivateRouter>
              <Bookings />
            </PrivateRouter>
          }
        />
        <Route
          path="/edit-bookings/:bookingId"
          element={
            <PrivateRouter>
              <EditBooking />
            </PrivateRouter>
          }
        />
        <Route
          path="/edit-bookings/guest-list/:bookingId"
          element={
            <PrivateRouter>
              <Guestlist />
            </PrivateRouter>
          }
        />
        <Route
          path="/historical-booking/:contactId"
          element={
            <PrivateRouter>
              <HistoricalBooking />
            </PrivateRouter>
          }
        />
        <Route
          path="/etickets/tickets/:bookingId"
          element={
            <PrivateRouter state={false}>
              <DirectoryBrowser />
            </PrivateRouter>
          }
        />
        <Route
          path="/edit-bookings/invoices/:bookingId"
          element={
            <PrivateRouter>
              <Invoices />
            </PrivateRouter>
          }
        />
        <Route
          path="/edit-bookings/invoices/print/:invoiceId"
          element={
            <PrivateRouter state={false}>
              <InvoicesBill />
            </PrivateRouter>
          }
        />
        <Route
          path="/edit-bookings/booking-e-ticket/:id"
          element={
            <PrivateRouter>
              <BookingETicket />
            </PrivateRouter>
          }
        />
        <Route
          path="/edit-bookings/booking-billable-items/:bookingId"
          element={
            <PrivateRouter>
              <BookingBillableItems />
            </PrivateRouter>
          }
        />
        <Route
          path="/edit-bookings/add-booking-product/:bookingId"
          element={
            <PrivateRouter>
              <AddBookingProduct />
            </PrivateRouter>
          }
        />
        <Route
          path="/coupons/add-edit-coupons/:couponId"
          element={
            <PrivateRouter>
              <AddEditCoupons />
            </PrivateRouter>
          }
        />
        <Route
          path="/coupons/add-edit-coupons"
          element={
            <PrivateRouter>
              <AddEditCoupons />
            </PrivateRouter>
          }
        />
        <Route
          path="/sales-rules/add-edit-sales-rules"
          element={
            <PrivateRouter>
              <AddEditSalesRules />
            </PrivateRouter>
          }
        />
        <Route
          path="/sales-rules/add-edit-sales-rules/:salesRulesId"
          element={
            <PrivateRouter>
              <AddEditSalesRules />
            </PrivateRouter>
          }
        />
        <Route
          path="/events-status/add-edit-event-status"
          element={
            <PrivateRouter>
              <AddEditEventsStatus />
            </PrivateRouter>
          }
        />
        <Route
          path="/events-status/add-edit-event-status/:eventStatusesId"
          element={
            <PrivateRouter>
              <AddEditEventsStatus />
            </PrivateRouter>
          }
        />
        <Route
          path="/availability-status/add-edit-availability-status"
          element={
            <PrivateRouter>
              <AddEditAvailabilityStatus />
            </PrivateRouter>
          }
        />
        <Route
          path="/availability-status/add-edit-availability-status/:availabilityStatusId"
          element={
            <PrivateRouter>
              <AddEditAvailabilityStatus />
            </PrivateRouter>
          }
        />
        <Route
          path="/billable-items"
          element={
            <PrivateRouter>
              <BillableItems />
            </PrivateRouter>
          }
        />
        <Route
          path="/billable-items/add-edit-billable-items"
          element={
            <PrivateRouter>
              <AddEditBillableItem />
            </PrivateRouter>
          }
        />
        <Route
          path="/billable-items/add-edit-billable-items/:billableItemsId"
          element={
            <PrivateRouter>
              <AddEditBillableItem />
            </PrivateRouter>
          }
        />
        <Route
          path="/payment-options"
          element={
            <PrivateRouter>
              <PaymentOptions />
            </PrivateRouter>
          }
        />
        <Route
          path="/payment-options/add-edit-payment-options"
          element={
            <PrivateRouter>
              <AddEditPaymentOption />
            </PrivateRouter>
          }
        />
        <Route
          path="/payment-options/add-edit-payment-options/:paymentOptionsId"
          element={
            <PrivateRouter>
              <AddEditPaymentOption />
            </PrivateRouter>
          }
        />
        <Route
          path="/tax-codes"
          element={
            <PrivateRouter>
              <TaxCodes />
            </PrivateRouter>
          }
        />
        <Route
          path="/tax-codes/add-edit-tax-codes"
          element={
            <PrivateRouter>
              <AddEditTaxCode />
            </PrivateRouter>
          }
        />
        <Route
          path="/tax-codes/add-edit-tax-codes/:taxCodesId"
          element={
            <PrivateRouter>
              <AddEditTaxCode />
            </PrivateRouter>
          }
        />
        <Route
          path="/transactional-emails"
          element={
            <PrivateRouter>
              <TransactionalEmails />
            </PrivateRouter>
          }
        />
        <Route
          path="/transactional-emails/add-edit-transactional-emails"
          element={
            <PrivateRouter>
              <AddEditTransactionalEmails />
            </PrivateRouter>
          }
        />
        <Route
          path="/transactional-emails/add-edit-transactional-emails/:trandactionalEmailId"
          element={
            <PrivateRouter>
              <AddEditTransactionalEmails />
            </PrivateRouter>
          }
        />
        <Route
          path="/mail-assets"
          element={
            <PrivateRouter>
              <MailAssets />
            </PrivateRouter>
          }
        />
        <Route
          path="/mail-assets/add-edit-mail-assets/:mailAssestId"
          element={
            <PrivateRouter>
              <AddEditMailAsset />
            </PrivateRouter>
          }
        />
        <Route
          path="/mail-assets/add-edit-mail-assets"
          element={
            <PrivateRouter>
              <AddEditMailAsset />
            </PrivateRouter>
          }
        />
        <Route
          path="/letters"
          element={
            <PrivateRouter>
              <Letters />
            </PrivateRouter>
          }
        />
        <Route
          path="/letters/add-edit-letters"
          element={
            <PrivateRouter>
              <AddEditLetter />
            </PrivateRouter>
          }
        />
        <Route
          path="/letters/add-edit-letters/:letterId"
          element={
            <PrivateRouter>
              <AddEditLetter />
            </PrivateRouter>
          }
        />
        <Route
          path="/pages"
          element={
            <PrivateRouter>
              <Pages />
            </PrivateRouter>
          }
        />
        <Route
          path="/pages/add-edit-pages/:pagesId"
          element={
            <PrivateRouter>
              <AddEditPage />
            </PrivateRouter>
          }
        />
        <Route
          path="/pages/add-edit-pages"
          element={
            <PrivateRouter>
              <AddEditPage />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact-sources"
          element={
            <PrivateRouter>
              <ContactSources />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact-sources/add-edit-contact-sources/:contactsourceId"
          element={
            <PrivateRouter>
              <AddEditContactSources />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact-sources/add-edit-contact-sources"
          element={
            <PrivateRouter>
              <AddEditContactSources />
            </PrivateRouter>
          }
        />
        <Route
          path="/categories-sources"
          element={
            <PrivateRouter>
              <CategoriesSources />
            </PrivateRouter>
          }
        />
        <Route
          path="/categories-sources/add-edit-sources-categories/:sourceCategoryId"
          element={
            <PrivateRouter>
              <AddEditSourcesCategories />
            </PrivateRouter>
          }
        />
        <Route
          path="/categories-sources/add-edit-sources-categories"
          element={
            <PrivateRouter>
              <AddEditSourcesCategories />
            </PrivateRouter>
          }
        />
        <Route
          path="/faqs"
          element={
            <PrivateRouter>
              <Faqs />
            </PrivateRouter>
          }
        />
        <Route
          path="/faqs/add-edit-faqs/:faqId"
          element={
            <PrivateRouter>
              <AddEditFaqs />
            </PrivateRouter>
          }
        />
        <Route
          path="/faqs/add-edit-faqs"
          element={
            <PrivateRouter>
              <AddEditFaqs />
            </PrivateRouter>
          }
        />
        <Route
          path="/faqs-categories"
          element={
            <PrivateRouter>
              <FaqCategories />
            </PrivateRouter>
          }
        />
        <Route
          path="/faqs-categories/add-edit-faqs-categories/:faqCategoryId"
          element={
            <PrivateRouter>
              <AddEditFaqCategories />
            </PrivateRouter>
          }
        />
        <Route
          path="/faqs-categories/add-edit-faqs-categories"
          element={
            <PrivateRouter>
              <AddEditFaqCategories />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/system"
          element={
            <PrivateRouter>
              <EditSystem />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/note-types"
          element={
            <PrivateRouter>
              <NoteTypes />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/note-types/add-edit-note-types"
          element={
            <PrivateRouter>
              <AddEditNoteType />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/note-types/add-edit-note-types/:noteTypesId"
          element={
            <PrivateRouter>
              <AddEditNoteType />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/parties"
          element={
            <PrivateRouter>
              <EventParties />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/parties/edit-parties/:eventId"
          element={
            <PrivateRouter>
              <EditParties />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/parties/add-parties"
          element={
            <PrivateRouter>
              <AddParties />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/parties/edit-parties/edit-date/:eventDateId"
          element={
            <PrivateRouter>
              <EditEventDate />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/venues"
          element={
            <PrivateRouter>
              <Venues />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/venues/add-edit-venues/:venueId"
          element={
            <PrivateRouter>
              <AddEditVenues />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/venues/add-edit-venues"
          element={
            <PrivateRouter>
              <AddEditVenues />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/themes"
          element={
            <PrivateRouter>
              <Themes />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/add-edit-themes/:themeId"
          element={
            <PrivateRouter>
              <AddEditThemes />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/events/add-edit-themes"
          element={
            <PrivateRouter>
              <AddEditThemes />
            </PrivateRouter>
          }
        />
        <Route
          path="/security"
          element={
            <PrivateRouter>
              <Security />
            </PrivateRouter>
          }
        />
        <Route
          path="/security/addeditsecurity/:userId"
          element={
            <PrivateRouter>
              <AddEditSecurity />
            </PrivateRouter>
          }
        />
        <Route
          path="/security/addeditsecurity"
          element={
            <PrivateRouter>
              <AddEditSecurity />
            </PrivateRouter>
          }
        />

        <Route
          path="/admin/products"
          element={
            <PrivateRouter>
              <Products />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/products/add-edit-products/:productId"
          element={
            <PrivateRouter>
              <AddEditProducts />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/products/add-edit-products"
          element={
            <PrivateRouter>
              <AddEditProducts />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/products/products-categories"
          element={
            <PrivateRouter>
              <ProductsCategories />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/products/add-edit-products-categories/:productCategoryId"
          element={
            <PrivateRouter>
              <AddProductsCategories />
            </PrivateRouter>
          }
        />
        <Route
          path="/admin/products/add-edit-products-categories"
          element={
            <PrivateRouter>
              <AddProductsCategories />
            </PrivateRouter>
          }
        />

        <Route
          path="/add-payment"
          element={
            <PrivateRouter>
              <AddPayment />
            </PrivateRouter>
          }
        />
        <Route
          path="/add-payment/:bookingId"
          element={
            <PrivateRouter>
              <AddPayment />
            </PrivateRouter>
          }
        />
        {/*dummy route, New email create route, no need */}

        <Route
          path="/send-new-email/"
          element={
            <PrivateRouter>
              <SendNewEmail />
            </PrivateRouter>
          }
        />
        <Route
          path="/send-new-email/:id"
          element={
            <PrivateRouter>
              <SendNewEmail />
            </PrivateRouter>
          }
        />
        {/*dummy route, New letter create route, no need */}
        <Route
          path="/send-new-letter"
          element={
            <PrivateRouter>
              <SendNewLetter />
            </PrivateRouter>
          }
        />
        <Route
          path="/send-new-letter/:id"
          element={
            <PrivateRouter>
              <SendNewLetter />
            </PrivateRouter>
          }
        />
        <Route
          path="/enquiries"
          element={
            <PrivateRouter>
              <Enquiries />
            </PrivateRouter>
          }
        />
        <Route
          path="/enquiries/:id"
          element={
            <PrivateRouter>
              <Enquiries />
            </PrivateRouter>
          }
        />
        <Route
          path="/edit-enquiries/:bookingId"
          element={
            <PrivateRouter>
              <EditEnquiries />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact"
          element={
            <PrivateRouter>
              <Contact />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact/account"
          element={
            <PrivateRouter>
              <Account />
            </PrivateRouter>
          }
        />
        {/* temporary route delete whenever complete project */}
        <Route
          path="/contact/edit-contact"
          element={
            <PrivateRouter>
              <EditContact />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact/edit-contact/:contactId"
          element={
            <PrivateRouter>
              <EditContact />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact/add-contact"
          element={
            <PrivateRouter>
              <AddContact />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact/account/add-account/:accountId"
          element={
            <PrivateRouter>
              <AddAccount />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact/account/add-account"
          element={
            <PrivateRouter>
              <AddAccount />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact/account/lookup/:lookupId"
          element={
            <PrivateRouter>
              <Lookup />
            </PrivateRouter>
          }
        />
        <Route
          path="/contact/account/lookup"
          element={
            <PrivateRouter>
              <Lookup />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/business-report"
          element={
            <PrivateRouter>
              <BusinessReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/invoices-report"
          element={
            <PrivateRouter>
              <InvoicesReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/invoices-report"
          element={
            <PrivateRouter state={false}>
              <PrintInvoicesReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/online-payments-report"
          element={
            <PrivateRouter>
              <OnlinePaymentsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/online-payments-report"
          element={
            <PrivateRouter state={false}>
              <PrintOnlinePaymentsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/payments-report"
          element={
            <PrivateRouter>
              <PaymentsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/payments"
          element={
            <PrivateRouter state={false}>
              <PrintPaymentsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/debtors-report"
          element={
            <PrivateRouter>
              <DebtorsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/deposits-report"
          element={
            <PrivateRouter>
              <DepositsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/exchequer-report"
          element={
            <PrivateRouter>
              <ExchequerReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/transactions-export"
          element={
            <PrivateRouter>
              <TransactionsExport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/booking-notes-report"
          element={
            <PrivateRouter>
              <BookingNotesReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/booking-notes-report"
          element={
            <PrivateRouter state={false}>
              <BookingNotesReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/coupons-report"
          element={
            <PrivateRouter>
              <CouponsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/coupons-report"
          element={
            <PrivateRouter state={false}>
              <CouponsReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/dietrequirements-report"
          element={
            <PrivateRouter>
              <DietrequirementsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/diet-requirements"
          element={
            <PrivateRouter state={false}>
              <DietrequirementsReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/drinks-report"
          element={
            <PrivateRouter>
              <DrinksReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/drinks-report"
          element={
            <PrivateRouter state={false}>
              <DrinksReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/tracking-report"
          element={
            <PrivateRouter>
              <TrackingReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/tracking-report"
          element={
            <PrivateRouter state={false}>
              <TrackingReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/party-feedback-report"
          element={
            <PrivateRouter>
              <PartyFeedbackReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/party-feedback-report"
          element={
            <PrivateRouter state={false}>
              <PartyFeedbackReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/party-numbers-report"
          element={
            <PrivateRouter>
              <PartyNumbersReport />
            </PrivateRouter>
          }
        />

        <Route
          path="/reports/requirements-report"
          element={
            <PrivateRouter>
              <RequirementsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/requirements-report"
          element={
            <PrivateRouter state={false}>
              <RequirementsReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/contact-sources-report"
          element={
            <PrivateRouter>
              <ContactSourcesReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/contact-source"
          element={
            <PrivateRouter state={false}>
              <ContactSourcesReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/drinks-sundries-totals-report"
          element={
            <PrivateRouter>
              <DrinksSundriesReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/monthly-revenue-report"
          element={
            <PrivateRouter>
              <MonthlyRevenueReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/monthly-revenue-report"
          element={
            <PrivateRouter state={false}>
              <MonthlyRevenueReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/event-numbers-comparison-totals"
          element={
            <PrivateRouter>
              <EventNumbersComparisonTotal />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/event-numbers-comparison-totals"
          element={
            <PrivateRouter state={false}>
              <EventNumbersComparisonTotalTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/comparison-type-report"
          element={
            <PrivateRouter>
              <ComparisonTypeReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/comparison-type-report"
          element={
            <PrivateRouter state={false}>
              <ComparisonTypeReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/event-numbers-comparison-report"
          element={
            <PrivateRouter>
              <EventNumbersComparisonReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/event-numbers-comparison-report"
          element={
            <PrivateRouter state={false}>
              <EventNumbersComparisonReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/products-order-summary"
          element={
            <PrivateRouter>
              <ProductsOrderSummary />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/products-order-summary"
          element={
            <PrivateRouter state={false}>
              <ProductsOrderSummaryTable />
            </PrivateRouter>
          }
        />

        <Route
          path="/reports/ticket-revenue-report"
          element={
            <PrivateRouter>
              <TicketRevenueReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/ticket-revenue-report"
          element={
            <PrivateRouter state={false}>
              <TicketRevenueReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/total-bookings-by-user"
          element={
            <PrivateRouter>
              <TotalBookingsbyUser />
            </PrivateRouter>
          }
        />

        <Route
          path="/reports/print/total-bookings-by-user"
          element={
            <PrivateRouter state={false}>
              <TotalBookingsbyUserReportTable />
            </PrivateRouter>
          }
        />

        <Route
          path="/reports/print/business"
          element={
            <PrivateRouter state={false}>
              <PrintBusinessReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/online-payment"
          element={
            <PrivateRouter state={false}>
              <PrintBusinessReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/debtors"
          element={
            <PrivateRouter state={false}>
              <PrintDebtorsReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/deposite"
          element={
            <PrivateRouter state={false}>
              <PrintDepositeReport />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/exchequer"
          element={
            <PrivateRouter state={false}>
              <PrintExchaquerReportTable />
            </PrivateRouter>
          }
        />
        <Route
          path="/reports/print/transaction-export"
          element={
            <PrivateRouter state={false}>
              <PrintTransactionExportTable />
            </PrivateRouter>
          }
        />

        <Route path="*" element={<NotFound />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </>
  );
}
