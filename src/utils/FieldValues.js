import NotConnected from '../Assets/Img/not-connected.svg';
import LeftArrow from '../Assets/Img/left-arrow-red.svg';
import RightArrow from '../Assets/Img/right-arrow-green.svg';

export const createdByOption = [
  'London',
  'South East',
  'South West',
  'East',
  'East Midlands',
  'West Midlands',
  'Yorkshire and the Humber',
  'BiNorth West',
  'Wales',
  'Ireland',
  'Scotland',
];

//Event - Product

export const kpiReport = [
  {
    label: '-',
    value: 1,
  },
  {
    label: 'Drinks',
    value: 2,
  },
  {
    label: 'Dodgems',
    value: 3,
  },
];

export const availabilityList = [
  {
    label: 'Within the Bookings Section',
    value: 0,
  },
  {
    label: 'On the Transactions Screen',
    value: 1,
  },
  {
    label: ' Within the BPE.com Website',
    value: 2,
  },
  {
    label: 'Within the Contacts Section',
    value: 3,
  },
  {
    label: 'On the Billable Items Screen',
    value: 4,
  },
  {
    label: 'On the Invoicing Screen',
    value: 5,
  },
  {
    label: 'Anywhere',
    value: 6,
  },
];
//Event - Coupon
export const couponType = [
  {
    label: 'Discount',
    value: 1,
  },
  {
    label: 'Actions',
    value: 2,
  },
];

//Faq
export const limitType = [
  {
    label: 'Show to All Venues',
    value: 0,
  },
  {
    label: 'Show to Selected Venues Only',
    value: 1,
  },
  {
    label: 'Show to All Except Selected Venues',
    value: 2,
  },
];

export const statusList = [
  {
    label: '2020 Transfers with no fixed date',
    value: '2020 Transfers with no fixed date',
  },
  {
    label: 'All Inc Mixed Group Night',
    value: 'All Inc Mixed Group Night',
  },
  {
    label: ' All-inclusive House Wines, Beers & Soft Drinks- Mixed Group Party',
    value: ' All-inclusive House Wines, Beers & Soft Drinks- Mixed Group Party',
  },
  {
    label: 'Available for Exclusive Hire',
    value: 'Available for Exclusive Hire',
  },
  {
    label: 'Brand New Mixed Group Night - Now Open!',
    value: 'Brand New Mixed Group Night - Now Open!',
  },
  {
    label: 'Charity Night',
    value: 'Charity Night',
  },
  {
    label: 'Charity Party Night',
    value: 'Charity Party Night',
  },
  {
    label: 'Emergency 999 Night',
    value: 'Emergency 999 Night',
  },
  {
    label: 'Emergency Services',
    value: 'Emergency Services',
  },
  {
    label: ' Or add new status',
    value: ' Or add new status',
  },
];

export const restrictForGroup = [
  {
    label: 'Super Administrator (can perform special functions)',
    value: 'Super Administrator (can perform special functions)',
  },
  {
    label: 'Administrator (access all areas - not development)',
    value: 'Administrator (access all areas - not development)',
  },
  {
    label: 'Ability to create booking with minimum of ONE space',
    value: 'Ability to create booking with minimum of ONE space',
  },
  {
    label: 'Ability to confirm a booking without payment',
    value: 'Ability to confirm a booking without payment',
  },
  {
    label: 'Ability to manage contacts with accounts',
    value: 'Ability to manage contacts with accounts',
  },
  {
    label: 'Ability to assign bookings to other users',
    value: 'Ability to assign bookings to other users',
  },
  {
    label: 'Change Places Once Invoiced',
    value: 'Change Places Once Invoiced',
  },
  {
    label: 'Accept and Process Coupons',
    value: 'Accept and Process Coupons',
  },
  {
    label: 'Create/View reports',
    value: 'Create/View reports',
  },
  {
    label: 'System Access (can use dangerous system functions)',
    value: 'System Access (can use dangerous system functions)',
  },
  {
    label: 'Developer Access (can use development functions)',
    value: 'Developer Access (can use development functions)',
    //event -> product
  },
];

// Enquiries
export const directionNoteList = [
  {
    directionValue: 0,
    lableIcon: NotConnected,
    labelName: 'Not applicable',
  },
  {
    directionValue: 1,
    lableIcon: RightArrow,
    labelName: 'Customer contacted BPE',
  },
  {
    directionValue: 2,
    lableIcon: LeftArrow,
    labelName: 'BPE contacted Customer',
  },
];

export const monthsTypes = [
  {
    id: 1,
    name: 'January',
  },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' },
];
export const contactTypes = [
  {
    id: '0',
    name: 'internal',
  },
  {
    id: '1',
    name: 'agent',
  },
  { id: '2', name: 'company' },
  { id: '3', name: 'customer' },
];

//guest list requirement
export const requirementList = [
  {
    title: 'Dairy Free',
    is_selected: false,
  },
  {
    title: 'Gluten Free',
    is_selected: false,
  },
  {
    title: 'Halal',
    is_selected: false,
  },
  {
    title: 'Nut Allergy',
    is_selected: false,
  },
  {
    title: 'Vegan',
    is_selected: false,
  },
  {
    title: 'Vegetarian',
    is_selected: false,
  },
  {
    title: 'Wheelchair User',
    is_selected: false,
    className: 'text_primary',
  },
];

//For All Year
const currentYear = new Date().getFullYear();

export const yearsArrayCreateEvent = Array.from(
  { length: 7 },
  (_, index) => currentYear - 1 + index,
);

export const yearsArray = Array.from(
  { length: 11 },
  (_, index) => currentYear - 10 + index,
);

export function getUniqueYears(events) {
  const uniqueYears = new Set();
  events.forEach(event => {
    uniqueYears.add(event.year);
  });
  return Array.from(uniqueYears);
}

const generateYears = (pastYears, futureYears) => {
  const currentYear = new Date().getFullYear();

  const startYear = currentYear - pastYears;
  const endYear = currentYear + futureYears;

  return Array.from(
    { length: pastYears + futureYears + 1 },
    (_, index) => startYear + index,
  );
};

export const yearsThreeYearsInThePastOneYearInTheCurrent = generateYears(3, 0);

// For the second set of years
export const yearsThreeYearsInThePastOneYearInTheFuture = generateYears(3, 1);

// For the third set of years
export const yearsTwoYearsInThePastFourYearInTheFuture = generateYears(2, 4);

export const yearsFiveYearsInThePastOneYearInTheCurrent = Array.from(
  { length: 6 }, // 5 past years + current year
  (_, index) => currentYear - 5 + index,
).sort((a, b) => b - a);

export const yearsFiveYearsInThePastOneYearInThePreviews = Array.from(
  { length: 5 },
  (_, index) => currentYear - 5 + index,
).sort((a, b) => b - a);

// export const yearsThreeYearsInThePastONeYearInTheCurrent = Array.from(
//   { length: 4 }, // 3 past years +  current year
//   (_, index) => currentYear - index,
// );

// export const yearsThreeYearsInThePastOneYearInTheFuture = Array.from(
//   { length: 5 }, // 3 past years + 1 future year + current year
//   (_, index) => currentYear - 3 + index,
// );

// export const yearsTwoYearsInThePastFourYearInTheFuture = Array.from(
//   { length: 7 }, // 2 past years + 1 future year + current year
//   (_, index) => currentYear - 2 + index,
// );

export const yearsPrevious = Array.from(
  { length: 3 },
  (_, index) => currentYear - 2 + index,
);
// -------- //

//Global Search
export const searchList = [
  {
    id: 1,
    name: 'Search Result',
  },
  {
    id: 2,
    name: 'Main Window',
  },
];

export const enquiriesList = [
  {
    value: 'booking',
    name: 'Only Bookings',
  },
  {
    value: 'enquiries',
    name: 'Only Enquiries',
  },
  {
    value: 'both',
    name: 'Booking and Enquiries',
  },
];

export const yearSelectConditionList = [
  {
    id: 1,
    name: 'Is exactly (=)',
  },
  { id: 2, name: 'Is not (!=)' },
  {
    id: 3,
    name: 'Is more than ( &gt;)',
  },
  { id: 4, name: 'Equals or is more than (&gt;=)' },
  { id: 5, name: 'Is less than (&lt;)' },
  { id: 6, name: 'Equals or is less than (&lt;=)' },
  { id: 7, name: 'Multipal' },
];

export const commonSelectConditionList = [
  {
    id: 1,
    name: 'Is exactly (=)',
  },
  { id: 2, name: 'Is not (!=)' },
  {
    id: 3,
    name: 'Is more than ( &gt;)',
  },
  { id: 4, name: 'Equals or is more than (&gt;=)' },
  { id: 5, name: 'Is less than (&lt;)' },
  { id: 6, name: 'Equals or is less than (&lt;=)' },
  { id: 7, name: 'Between X and X' },
];

export const contactTypeConditionList = [
  { id: 1, name: 'Is exactly (=)' },
  { id: 2, name: 'Is not (!=)' },
  { id: 3, name: 'Multiple' },
];

export const invoicedList = [
  { value: 'yes', name: 'Yes' },
  { value: 'no', name: 'No' },
];

export const eTicketsSentList = [
  { value: 'yes', name: 'Yes' },
  { value: 'no', name: 'No' },
];
export const billableItemsOrderedList = [
  { value: 'yes', name: 'Yes' },
  { value: 'no', name: 'No' },
];

export const resultsOrderList = [
  { id: 1, name: 'Booking ref', value: 'ref_no' },
  { id: 2, name: 'Event', value: 'event' },
  { id: 3, name: 'Customer Name', value: 'name' },
  { id: 4, name: 'Company name', value: 'company' },
  { id: 5, name: 'Balance', value: 'balance' },
  { id: 6, name: 'Total Places', value: 'enquired' },
  { id: 7, name: 'provisional Places', value: 'provisional' },
  { id: 8, name: 'Confriemd Places', value: 'confirmed' },
  { id: 9, name: 'Event Data', value: 'date' },
];

export const resultsOrderYearList = [
  { id: 1, name: 'Low-Hi', value: -1 },
  { id: 2, name: 'Hi-Low', value: 1 },
];

export const eTicketBranding = [
  {
    label: 'Best Parties Ever',
    value: 0,
  },
  {
    label: 'Office Christmas',
    value: 1,
  },
  {
    label: 'Hospitality Line',
    value: 2,
  },
  {
    label: 'No Branding (removes BPE logos)',
    value: 3,
  },
];

export const optionsRule = [
  {
    id: 0,
    value: 'Minimum',
  },
  {
    id: 1,
    value: 'Maximum',
  },
  {
    id: 2,
    value: 'Multiples',
  },
  {
    id: 3,
    value: 'Equals Exactly',
  },
  {
    id: 4,
    value: 'Linked Product',
  },
  {
    id: 5,
    value: 'Vat Adjustment',
  },
];

export const optionsOfValue = [
  {
    id: 1,
    value: 'Places',
  },
];

export const cancelResons = [
  {
    label: 'Duplicate Booking/Enquiry',
    value: 0,
  },
  {
    label: 'No Response - Releasing Places',
    value: 1,
  },
  {
    label: 'Booked elsewhere',
    value: 2.1,
  },
  {
    label: 'No longer having Xmas party',
    value: 2.2,
  },
  {
    label: 'Package/Prices not acceptable',
    value: 2.3,
  },
  {
    label: 'Covid 19',
    value: 2.4,
  },
  {
    label: 'Customer Requested Cancelation - Other Reason',
    value: 2.5,
  },
  {
    label: 'Test Booking / Booking Created in Error',
    value: 3,
  },
  {
    label: 'Other - Cancelled for reason specified below',
    value: 4,
  },
];
