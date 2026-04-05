import { combineReducers } from '@reduxjs/toolkit';
import auth from './reducers/User/auth.slice';
import common from './reducers/common.slice';
import user from './reducers/User/user.slice';
import parties from './reducers/Admin/Events/Parties/parties.slice';
import venue from './reducers/Admin/Events/venue.slice';
import theme from './reducers/Admin/Events/theme.slice';
import salesRules from './reducers/Admin/Events/salesRules.slice';
import eventStatuses from './reducers/Admin/Events/eventStatuses.slice';
import productCategory from './reducers/Admin/Events/ProductCategory/productCategory.slice';
import product from './reducers/Admin/Events/ProductCategory/product.slice';
import coupon from './reducers/Admin/Events/Coupon/Coupons/coupon.slice';
import availabilityStatus from './reducers/Admin/Events/availabilityStatus.slice';
import pages from './reducers/Admin/Events/pages.slice';
import transactionalMail from './reducers/Admin/Mail/mail.slice';
import uploadImage from './reducers/UploadImage/uploadImage.slice';
import contactSources from './reducers/Admin/Events/ContactSources/contactSources.slice';
import sourceCategory from './reducers/Admin/Events/ContactSources/sourceCategory.slice';
import billableItems from './reducers/Admin/Financial/billableItems.slice';
import paymentOptions from './reducers/Admin/Financial/paymentOptions.slice';
import mailAssets from './reducers/Admin/Mail/mailAssets.slice';
import letter from './reducers/Admin/Mail/letters.slice';
import taxCodes from './reducers/Admin/Financial/taxCodes.slice';
import faqCategories from './reducers/Admin/FAQs/faqCategories.slice';
import faq from './reducers/Admin/FAQs/faq.slice';
import noteTypes from './reducers/Admin/System/noteTypes.slice';
import system from './reducers/Admin/System/system.slice';
import existingFileSlice from './reducers/UploadImage/existingFile.slice';
import eventAlternate from './reducers/Admin/Mail/eventAlternativeAsset.slice';
import contact from './reducers/Contact/contact.slice';
import account from './reducers/Contact/account.slice';
import enquiries from './reducers/Enquiry/enquiries.slice';
import googlePlace from './reducers/Contact/googlePlaceApi.slice';
import enquiryNotes from './reducers/Enquiry/Note/enquiryNote.slice';
import mail from './reducers/mail/mail.slice';
import letterSlice from './reducers/letter/letter.slice';
import booking from './reducers/Booking/booking.slice';
import bookingCoupon from './reducers/Booking/bookingCoupon.slice';
import bookingGuest from './reducers/Booking/bookingGuest.slice';
import invoice from './reducers/Booking/invoice.slice';
import changePlace from './reducers/Booking/changePlace.slice';
import bookingPayment from './reducers/Booking/bookingPayment.slice';
import enquiriesLegacyNotes from './reducers/Enquiry/LegacyNotes/enquiriesLegacyNotes.slice';
import enquiriesEvent from './reducers/Enquiry/Event/enquiriesEvent.slice';
import bookingBillableItems from './reducers/Booking/bookingBillableItems.slice';
import accountReport from './reducers/Report/accountReport.slice';
import opsReport from './reducers/Report/opsReport.slice';
import salesReport from './reducers/Report/salesReport.slice';
import enquireParties from './reducers/Enquiry/Parties/enquireParties.slice';
import globalSearch from './reducers/SearchPanel/globalSearch.slice';
import eTicket from './reducers/Booking/eTicket.slice';
import storeError from './reducers/Dashboard/Dashboard.slice';
import bookingHistorical from './reducers/Booking/bookingHistorical.slice';
import watchlist from './reducers/Admin/Events/WatchList/watchlist.slice';
import bookingCart from './reducers/Booking/bookingCart.slice';

export function createReducer(injectedReducers) {
  return combineReducers({
    ...injectedReducers,
    auth,
    common,
    parties,
    user,
    venue,
    theme,
    salesRules,
    eventStatuses,
    productCategory,
    product,
    coupon,
    availabilityStatus,
    pages,
    transactionalMail,
    uploadImage,
    contactSources,
    sourceCategory,
    billableItems,
    paymentOptions,
    mailAssets,
    letter,
    taxCodes,
    faqCategories,
    faq,
    noteTypes,
    system,
    existingFileSlice,
    eventAlternate,
    contact,
    account,
    enquiries,
    googlePlace,
    enquiryNotes,
    mail,
    letterSlice,
    booking,
    bookingCoupon,
    bookingGuest,
    invoice,
    changePlace,
    enquiriesLegacyNotes,
    enquiriesEvent,
    bookingPayment,
    bookingBillableItems,
    accountReport,
    opsReport,
    salesReport,
    enquireParties,
    globalSearch,
    eTicket,
    storeError,
    bookingHistorical,
    watchlist,
    bookingCart,
  });
}
