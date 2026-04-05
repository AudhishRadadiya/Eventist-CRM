import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import _ from 'lodash';
import { monthsTypes } from './FieldValues';
import { toMoney, zeroRoundTo } from './common';

const headStyles = {
  fillColor: '#454545',
  textColor: [255, 255, 255],
  fontSize: 8,
  padding: 0,
};
const marginLeft = 40;

// OPS all Report module
export const exportBookingNotesReportPDF = ({ bookingNotesList, event_id }) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });
  if (bookingNotesList?.length === 0) {
    doc.setFontSize(12);
    const title =
      'There are no booking notes items for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    doc.setFontSize(12);
    const title = `Booking Notes for: ${
      event_id[0]?.internal_name.replace(',', ' -') + ' ' + event_id[0]?.year
    }`;

    const headers = [
      'Booking',
      'Event Date',
      'Name',
      'Company/Contact Name',
      'Places P/C',
      'Booking Notes',
      'PO / Agent Ref',
      'Venue Notes',
      'Public Notes',
    ];

    const data = bookingNotesList?.reduce((accumulator, elt) => {
      return accumulator.concat(
        elt?.data.map(item => [
          item?.booking_ref,
          moment(elt?.event_date).format('ddd DD/MM/YYYY'),
          item?.name,
          item?.company_name,
          item?.places,
          item?.booking_notes,
          item?.po_agent_ref,
          item?.venue_notes,
          item?.public_notes,
        ]),
      );
    }, []);
    doc.text(title, 40, 20);
    if (data) {
      doc.autoTable({
        startY: 50,
        head: [headers],
        body: data,
      });
    }
  }

  doc.setProperties({
    title: `Booking Note - ${event_id[0]?.internal_name.replace(',', ' -')}`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: 'Booking Notes Report',
  //   title: 'Booking Notes Report',
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};

export const exportCouponReportPDF = ({ couponsReportList }) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });
  if (couponsReportList?.length === 0) {
    doc.setFontSize(12);
    const title = 'There are no coupon items for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    doc.setFontSize(12);
    const title = `Total Coupons Used: ${couponsReportList?.length}`;

    const headers = [
      [
        'Coupon',
        'Booking Ref',
        'Party Date',
        'Party',
        'Prov Places',
        'Conf Places ',
        'End Date',
        'Deposit Required By Date',
        'Accepted Date',
        'Processed Date',
      ],
    ];

    const data = couponsReportList?.map(elt => [
      elt?.coupon_name,
      elt?.booking_ref,
      moment(elt?.party_date).format('DD/MM/YYYY'),
      elt?.party,
      elt?.provisional_places,
      elt?.confirmed_places,
      moment(elt?.end_date).format('DD/MM/YYYY'),
      moment(elt?.deposits_required_by).format('DD/MM/YYYY'),
      moment(elt?.accepted_date).format('DD/MM/YYYY'),
      moment(elt?.processed_Date).format('DD/MM/YYYY'),
    ]);

    doc.text(title, 40, 20);
    doc.autoTable({
      startY: 50,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }

  doc.setProperties({
    title: 'Coupon Report - ',
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Coupon Report`,
  //   title: 'Coupon Report',
  // });
  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};

export const exportDietReqPDF = ({
  dietaryRequirementList,
  event_date,
  event_id,
}) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });
  if (dietaryRequirementList?.dietary?.length === 0) {
    doc.setFontSize(12);
    const title = 'There are no diet requirements for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    doc.setFontSize(12);
    const title = `Dietary Requirements Summary for: ${moment(
      new Date(event_date[0]?.date),
    ).format('DD/MM/YYYY')}`;

    const titleAt = `At: ${event_id[0]?.internal_name.replace(',', ' -')}`;
    const headers = [
      [
        'Booking',
        'Company/Contact Name',
        'Dairy Free',
        'Gluten Free',
        'Halal',
        'Nut Allergy',
        'Vegan',
        'Vegetarian',
        'Wheelchair User',
        'note',
      ],
    ];
    const headersTotal = [['Requirement Name', 'Quantity']];
    const data = dietaryRequirementList?.dietary?.map(elt => [
      elt?.ref_number,
      elt?.company_or_contact_name,
      elt?.['Dairy Free'],
      elt?.['Gluten Free'],
      elt?.Halal,
      elt?.['Nut Allergy'],
      elt?.Vegan,
      elt?.Vegetarian,
      elt?.['Wheelchair User'],
      elt?.note,
    ]);

    const dataTotal = dietaryRequirementList?.total?.map(elt => [
      elt?.req_name,
      elt?.qty,
    ]);

    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);
    doc.autoTable({
      startY: 50,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
    let finalY = doc?.lastAutoTable?.finalY ? doc?.lastAutoTable?.finalY : 10;
    doc.text('Totals', marginLeft, finalY + 20);

    doc.autoTable({
      startY: finalY + 30,
      headStyles: headStyles,
      head: headersTotal,
      body: dataTotal,
    });
  }

  doc.setProperties({
    title: `Diet Requirements - ${event_id[0]?.internal_name.replace(
      ',',
      ' -',
    )}`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Diet Requirements - ${event_id[0]?.internal_name}`,
  //   title: `Diet Requirements - ${event_id[0]?.internal_name}`,
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};

export const exportDrinkOrderPDF = ({
  drinksOrderList,
  event_date,
  event_id,
  eventDateShow,
}) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });

  if (drinksOrderList?.drinks?.length === 0) {
    doc.setFontSize(12);
    const title =
      'There are no drinks or products ordered for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    doc.setFontSize(12);

    const title = `Drinks Order Summary for: ${
      event_date === 'All'
        ? 'All Nights'
        : event_date === 'future'
        ? 'All Future Nights'
        : moment(eventDateShow[0]?.date).format('DD/MM/YYYY')
    }`;

    const titleAt = `At: ${event_id[0]?.internal_name.replace(',', ' -')}`;

    const headers = [
      [
        'Booking',
        'Party Date',
        'Company/Contact Name',
        'Quantity',
        'Product Name',
        'Bin#',
      ],
    ];
    const headersTotal = [
      ['Product Type', 'Product Name', 'Total Quantity', 'Total Cost', 'Bin#'],
    ];
    const data = drinksOrderList?.drinks?.map(elt => [
      elt?.booking,
      moment(elt?.party_date).format('DD/MM/YYYY'),
      elt?.Company_ContactName,
      elt?.quantity,
      elt?.product_name,
      elt?.bin_id,
    ]);

    const dataTotal = drinksOrderList?.total
      ?.filter(
        elt =>
          elt.product_type !== 'Extras' &&
          !elt.product_name.includes('Dodgems Tokens'),
      )
      ?.map(elt => [
        elt?.product_type,
        elt?.product_name,
        elt?.quantity,
        elt?.total_cost ? '£ ' + elt?.total_cost?.toFixed(2) : '',
        elt?.bin_id,
      ]);

    const costTotal = drinksOrderList?.total
      ?.filter(
        elt =>
          elt.product_type !== 'Extras' &&
          !elt.product_name.includes('Dodgems Tokens'),
      )
      ?.reduce((sum, item) => {
        return sum + item.total_cost;
      }, 0);

    const totalRow = [
      '',
      '',
      '',
      costTotal ? '£ ' + toMoney(costTotal) : '',
      '',
    ];

    dataTotal.push(totalRow);

    const extraDataTotal = drinksOrderList?.total
      ?.filter(
        elt =>
          elt.product_type === 'Extras' ||
          elt.product_name.includes('Dodgems Tokens'),
      )
      ?.map(elt => [
        elt?.product_type,
        elt?.product_name,
        elt?.quantity,
        elt?.total_cost ? '£ ' + elt?.total_cost?.toFixed(2) : '',
        elt?.bin_id,
      ]);

    const extraCostTotal = drinksOrderList?.total
      ?.filter(
        elt =>
          elt.product_type === 'Extras' ||
          elt.product_name.includes('Dodgems Tokens'),
      )
      ?.reduce((sum, item) => {
        return sum + item.total_cost;
      }, 0);

    const totalExtraRow = [
      '',
      '',
      '',
      extraCostTotal ? '£ ' + toMoney(extraCostTotal) : '',
      '',
    ];
    extraDataTotal.push(totalExtraRow);
    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);

    doc.autoTable({
      startY: 50,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
    let finalY = doc?.lastAutoTable?.finalY ? doc?.lastAutoTable?.finalY : 10;
    doc.text('Totals', marginLeft, finalY + 20);

    doc.autoTable({
      startY: finalY + 30,
      headStyles: headStyles,
      head: headersTotal,
      body: dataTotal,
    });

    if (extraDataTotal.length > 0) {
      let finalY1 = doc?.lastAutoTable?.finalY
        ? doc?.lastAutoTable?.finalY
        : 10;
      doc.text('Totals', marginLeft, finalY + 20);

      doc.text('Extra Products', marginLeft, finalY1 + 20);
      doc.autoTable({
        startY: finalY1 + 30,
        headStyles: headStyles,
        head: headersTotal,
        body: extraDataTotal,
      });
    }
  }
  doc.setProperties({
    title: `Drinks Report -`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Drinks Report -`,
  //   title: 'Drinks Report -',
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};

export const exportItemTrackingPDF = ({ itemTrackingList }) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });

  if (itemTrackingList?.length === 0) {
    doc.setFontSize(12);
    const title = 'There are no tracking items for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    doc.setFontSize(12);
    const title = 'Items tracking report';
    const headers = [
      [
        'Booking',
        'Event Date',
        'Venue',
        'Name',
        'Company/Contact Name',
        'PO / Agent Ref',
        'Balance Due',
        'Items Required',
        'Items Picked ',
        'Items Sent',
      ],
    ];

    const data = itemTrackingList?.map(elt => [
      elt?.booking,
      moment(elt?.date).format('DD/MM/YYYY'),
      elt?.event,
      elt?.name,
      elt?.company_name,
      elt?.agent_ref_po_no,
      elt?.balance_due?.toFixed(2),
      elt?.items_required,
      elt?.items_picked,
      elt?.items_sent,
    ]);

    doc.text(title, 40, 20);
    doc.autoTable({
      startY: 30,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }
  doc.setProperties({
    title: 'Tracking - ',
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Tracking`,
  //   title: 'Tracking',
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};

export const exportSpecialReqPDF = ({
  specialRequirementList,
  event_date_id,
  event_id,
}) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });

  if (specialRequirementList?.length === undefined) {
    doc.setFontSize(12);
    const title =
      'There are no special requirements for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    doc.setFontSize(12);
    const title = `Special Requirements for: ${moment(event_date_id).format(
      'DD/MM/YYYY',
    )}`;
    const titleAt = `At: ${event_id[0]?.internal_name.replace(',', ' -')}`;

    const headers = [
      [
        'Booking',
        'Name',
        'Company/Contact Name',
        'PO / Agent Ref',
        'Venue Notes',
        'Public Notes',
      ],
    ];
    const data = specialRequirementList?.map(elt => [
      elt?.booking,
      elt?.name,
      elt?.company_name,
      elt?.po_agent_ref,
      elt?.venue,
      elt?.public,
    ]);

    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);
    doc.autoTable({
      startY: 50,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }

  doc.setProperties({
    title: `Special Requirements - ${event_id[0]?.internal_name.replace(
      ',',
      ' -',
    )}`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Special Requirements - ${event_id[0]?.internal_name}`,
  //   title: `Special Requirements - ${event_id[0]?.internal_name}`,
  // });
  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
// --------------------

//  --- start account all report ----
// const handleNotes = note => {
//   let notes = [];
//   note?.length > 0
//     ? note?.map(
//         data =>
//           data?.hold_date &&
//           data.subject &&
//           notes?.push(
//             `${moment(data?.hold_date).format('DD/MM/YYYY')} - ${
//               data?.subject
//             } \n`,
//           ),
//       )
//     : notes?.push(
//         `${moment(note[0]?.hold_date).format('DD/MM/YYYY')} - ${
//           note[0]?.subject
//         }`,
//       );

//   return notes;
// };

export const exportDebortsPDF = ({ date, event, debortReportList }) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });
  doc.setFontSize(12);
  if (debortReportList?.length <= 0) {
    const title = 'There are no debtors for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    const title = `Debtors Up To : ${moment(new Date(date)).format(
      'DD/MM/YYYY',
    )}`;
    const titleAt = `At: ${event.replace(',', ' -')}`;
    const headers = [
      [
        'Event Date ',
        'Event',
        'Booking Ref',
        'PO Ref',
        'Name ',
        'Notes',
        'Total',
      ],
    ];

    const data = debortReportList?.map(elt => [
      moment(elt?.date).format('DD/MM/YYYY'),
      elt?.event_name,
      elt?.ref_number,
      elt?.agent_ref_po_no,
      elt?.firstname || elt?.surname ? elt?.firstname + ' ' + elt?.surname : '',
      elt?.notes,
      zeroRoundTo(elt?.amount),
    ]);
    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);
    doc.autoTable({
      theme: 'grid',
      startY: 50,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }
  doc.setProperties({
    title: `Debtors List - ${event.replace(',', ' -')}`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Debtors List - ${event.replace(',', ' -')}`,
  //   title: `Debtors List - ${event.replace(',', ' -')}`,
  // });
  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
export const exportTransactionExportPDF = ({
  date,
  event,
  transactionExportReportList,
}) => {
  let doc = new jsPDF({ orientation: 'l', unit: 'pt', format: [792, 1224] });
  doc.setFontSize(12);
  if (transactionExportReportList?.length <= 0) {
    const title = 'There are no transactions for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    const title = `Transactions Up To : ${moment(new Date(date)).format(
      'DD/MM/YYYY',
    )}`;
    const titleAt = `For: ${event.replace(',', ' -')}`;
    const headers = [
      [
        'Payment Time',
        'Payment ID',
        'Event',
        'Booking Ref',
        'Contact Firstname',
        'Contact Surname',
        'Contact Company',
        'Transaction Type',
        'Payment Method',
        'Payment Amount',
        'Payment Surcharge',
        'Payment Total',
        'Payment Info',
        'Payment Notes',
      ],
    ];

    const data = transactionExportReportList?.map(elt => [
      moment(elt.date).format('YYYY-MM-DD HH:mm:ss'),
      elt?.payment_id,
      elt?.event_name,
      elt?.ref_number,
      elt?.firstname,
      elt?.surname,
      elt?.company_name,
      elt.type === 1 ? 'Deposit' : 'Balance',
      elt?.method,
      zeroRoundTo(elt?.amount),
      elt?.surcharge?.toFixed(2),
      elt?.total?.toFixed(2),
      elt?.info,
      elt?.notes,
    ]);

    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);
    doc.autoTable({
      theme: 'grid',
      startY: 50,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }
  doc.setProperties({
    title: `Transactions Export - ${event.replace(',', ' -')}`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Transactions Export - ${event.replace(',', ' -')}`,
  //   title: `Transactions Export - ${event.replace(',', ' -')}`,
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
export const exportDepositPDF = ({ date, event, depositReportList }) => {
  let doc = new jsPDF({ orientation: 'l', unit: 'pt', format: [792, 1224] });
  doc.setFontSize(12);
  if (depositReportList?.length <= 0) {
    const title = 'There are no deposit for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    const title = `Deposits Received up to : ${moment(new Date(date)).format(
      'DD/MM/YYYY',
    )}`;

    const titleAt = `For: ${event.replace(',', ' -')}`;
    const headers = [
      [
        'Event Date',
        'Event',
        'Booking Ref',
        'Name',
        'Company/Contact Name',
        'Total',
      ],
    ];

    const data = depositReportList?.map(elt => [
      moment(elt.event_date).format('DD/MM/YYYY'),
      elt?.event,
      elt?.ref_number,
      elt?.firstname,
      elt?.company_name,
      elt?.total?.toFixed(2),
    ]);

    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);
    doc.autoTable({
      theme: 'grid',
      startY: 50,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }
  doc.setProperties({
    title: `Deposits List -`,
  });
  // doc.output('dataurlnewwindow', {
  //   filename: `Deposits List -`,
  //   title: `Deposits List -`,
  // });
  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};

export const exportOnlinePaymentPDF = ({ dailyOnlinePaymentReportList }) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });
  if (dailyOnlinePaymentReportList?.paymentData?.length <= 0) {
    doc.setFontSize(12);
    const title = 'There are no online payment for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    doc.setFontSize(10);
    const headers = [
      [
        'PID',
        'Booking Ref',
        'Event',
        'Name',
        'Company/Contact Name',
        'Type',
        'Online Payment (Combined)',
        ...dailyOnlinePaymentReportList?.methodsName?.map(
          headerItem => headerItem?.internal_name,
        ),
        'Notes',
        'Time',
      ],
    ];

    const data = dailyOnlinePaymentReportList?.paymentData?.map(data => [
      data?.pid,
      data?.booking_ref,
      data?.event_name,
      data?.name,
      data?.company_name,
      data.type,
      data?.online_payment,
      ...dailyOnlinePaymentReportList?.methodsName?.map(
        method => data[method.internal_name],
      ),
      data?.notes,
      `${moment(data?.created_at).format('DD/MM/YYYY')} ${moment(
        data?.created_at,
      ).format('h:mm:ss')}`,
    ]);

    doc.autoTable({
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }

  doc.setProperties({
    title: `Daily Online Payment Totals`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Daily Online Payment Totals`,
  //   title: 'Daily Online Payment Totals',
  // });
  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
export const exportBusinessPDF = ({
  date,
  businessListData,
  businessReportList,
}) => {
  let doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [1000, 1224],
  });
  doc.setFontSize(12);
  if (businessReportList?.length <= 0) {
    const title = 'There are no payment for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    const title = 'Business Done Report';
    let header = [];
    header.push('');
    let newData = Object.keys(businessReportList?.groupedData?.income)?.map(
      (item, i) => {
        header.push(item);
      },
    );
    const titleAt = `Week Ending: ${moment(new Date(date)).format(
      'DD/MM/YYYY',
    )}`;
    const headers = [header];

    let incomeData = businessListData?.incomeData?.map(i1 => {
      const finalObj = [];
      let finalObj1 = { content: i1?.itemName };
      let mapped = i1?.dateWisedata?.map(item => ({ content: item.amount }));
      finalObj.push(finalObj1, ...mapped);
      return finalObj;
    });
    let outputData = businessListData?.outputData?.map(i1 => {
      const finalOutPutObj = [];
      let finalObjOutput1 = { content: i1?.itemName };
      let mapped = i1?.dateWisedata?.map(item => ({ content: item.amount }));
      finalOutPutObj.push(finalObjOutput1, ...mapped);
      return finalOutPutObj;
    });
    let data = [];
    data.push([
      {
        content: 'income',
        colSpan: headers[0]?.length,
        styles: { halign: 'center', fontStyle: 'bold' },
      },
    ]);

    let newData1 = incomeData?.map((item, i) => {
      data.push(item);
    });
    data.push([
      {
        content: 'output',
        colSpan: headers[0]?.length,
        styles: { halign: 'center', fontStyle: 'bold' },
      },
    ]);
    let newDataOutput = outputData?.map((item, i) => {
      data.push(item);
    });
    const finalData = data;
    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);
    doc.autoTable({
      startY: 50,
      styles: { overflow: 'linebreak', columnWidth: 'wrap' },
      headStyles: headStyles,
      head: headers,
      body: finalData,
    });
  }

  doc.setProperties({
    title: `Business Done Report -`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Business Done Report -`,
  //   title: 'Business Done Report -',
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
export const exportDailyPaymentPDF = ({
  date,
  event,
  dailyPaymentReportList,
}) => {
  let doc = new jsPDF({ orientation: 'l', unit: 'pt', format: [792, 1224] });
  doc.setFontSize(12);
  if (dailyPaymentReportList?.paymentData?.length <= 0) {
    const title = 'There are no payment for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    const title = `Payments Received : ${moment(new Date(date)).format(
      'DD/MM/YYYY',
    )}`;

    const titleAt = `For: ${event.replace(',', ' -')}`;
    const headers = [
      [
        'PID',
        'Booking Ref',
        'Event',
        'Name',
        'Company/Contact Name',
        'Type',
        'Online Payment (Combined)',
        ...dailyPaymentReportList?.methodsName?.map(
          headerItem => headerItem?.internal_name,
        ),
        'Notes',
        'Time',
      ],
    ];
    const data1 = ['', '', '', '', '', ''];
    data1.push(dailyPaymentReportList?.methodTotals.totalPayment);
    const newData = dailyPaymentReportList?.methodsName?.map(method => {
      return dailyPaymentReportList?.methodTotals[method.internal_name];
    });
    const temp = data1.concat(newData);
    const data = dailyPaymentReportList?.paymentData?.map(data => [
      data?.pid,
      data?.booking_ref,
      data?.event_name,
      data?.name,
      data?.company_name,
      data.type,
      data?.online_payment,
      ...dailyPaymentReportList?.methodsName?.map(
        method => data[method.internal_name],
      ),
      data?.notes,
      `${moment(data?.created_at).format('DD/MM/YYYY')} ${moment(
        data?.created_at,
      ).format('h:mm:ss')}`,
    ]);
    data.push(temp);
    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);
    doc.autoTable({
      startY: 50,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }
  doc.setProperties({
    title: `Daily Payments Report`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Daily Payments Report -`,
  //   title: 'Daily Payments Report -',
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
export const exportDailyInvoiceReportPDF = ({
  dailyInvoiceReportList,
  event,
}) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [680, 680],
  });

  doc.setFontSize(12);

  const columnData = [
    {
      title: 'Event Date',
      dataKey: 'event_date',
    },
    {
      title: 'Invoice #',
      dataKey: 'invoice_no',
    },
    {
      title: 'Type',
      dataKey: 'type',
    },
    {
      title: 'Scope',
      dataKey: 'scop',
    },
    {
      title: 'Name',
      dataKey: 'name',
    },
    {
      title: 'Company/Contact Name',
      dataKey: 'company_name',
    },
    {
      title: 'Cancellation Charge',
      dataKey: 'cancellation_charge',
    },
    {
      title: 'Retained Depts',
      dataKey: 'retained_depts',
    },
    {
      title: 'Balance',
      dataKey: 'balance',
    },
    {
      title: 'Total',
      dataKey: 'total',
    },
  ];
  const col = columnData;
  dailyInvoiceReportList?.forEach(i1 => {
    let data = i1?.invoice_data?.map(iii => {
      let finalObj = {};
      Object.entries(
        _.pick(iii, [
          'event_date',
          'invoice_no',
          'type',
          'scop',
          'name',
          'company_name',
          'cancellation_charge',
          'retained_depts',
          'balance',
          'total',
        ]),
      ).forEach(itemData => {
        let newObj1 = {};
        newObj1.content = itemData[1];
        newObj1.content = newObj1.content !== null ? newObj1.content : '';
        if (itemData[0] === 'event_date') {
          newObj1.content = moment(itemData[1]).format('DD/MM/YYYY');
        }
        if (itemData[0] === 'balance') {
          newObj1.styles =
            itemData[1] >= 0
              ? { textColor: [0, 0, 0] }
              : { textColor: [245, 54, 92] };
        }
        if (itemData[0] === 'cancellation_charge') {
          newObj1.styles =
            itemData[1] >= 0
              ? { textColor: [0, 0, 0] }
              : { textColor: [245, 54, 92] };
        }
        if (itemData[0] === 'retained_depts') {
          newObj1.styles =
            itemData[1] >= 0
              ? { textColor: [0, 0, 0] }
              : { textColor: [245, 54, 92] };
        }
        if (itemData[0] === 'total') {
          newObj1.styles =
            itemData[1] >= 0
              ? { textColor: [0, 0, 0] }
              : { textColor: [245, 54, 92] };
        }
        finalObj[itemData[0]] = newObj1;
      });
      return finalObj;
    });
    let totalData = [
      [
        {
          content: moment(i1?.total?.event_date).format('DD/MM/YYYY'),
        },
        { content: '-' },
        { content: '-' },
        { content: '-' },
        { content: '-' },
        { content: '-' },
        {
          content: i1?.total_cancellation,
          styles:
            i1?.total_cancellation >= 0
              ? { textColor: [0, 0, 0] }
              : { textColor: [245, 54, 92] },
        },
        {
          content: i1?.total_retained,
          styles:
            i1?.total_retained >= 0
              ? { textColor: [0, 0, 0] }
              : { textColor: [245, 54, 92] },
        },
        {
          content: i1?.total_balance,
          styles:
            i1?.total_balance >= 0
              ? { textColor: [0, 0, 0] }
              : { textColor: [245, 54, 92] },
        },
        {
          content: i1?.overall_total?.toFixed(2),
          styles:
            i1?.overall_total >= 0
              ? { textColor: [0, 0, 0] }
              : { textColor: [245, 54, 92] },
        },
      ],
    ];
    let finalData = [...totalData, ...data];
    let finalY = doc?.lastAutoTable?.finalY ? doc?.lastAutoTable?.finalY : 10;
    doc.autoTable({
      startY: finalY + 35,
      headStyles: headStyles,
      columns: col,
      body: finalData,
    });
  });
  doc.setProperties({
    title: `Daily Payments Report -`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Daily Payments Report -`,
  //   title: 'Daily Payments Report -',
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
export const exportExchaquerPDF = ({ date, event, exchaquerReportList }) => {
  let doc = new jsPDF({ orientation: 'l', unit: 'pt', format: [792, 1224] });
  doc.setFontSize(12);
  if (exchaquerReportList?.length <= 0) {
    const title = 'There are no exchaquer for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    const title = `Exchaquer Data - ${event[0]?.internal_name.replace(
      ',',
      ' -',
    )}`;
    const titleAt = `Week Ending :${moment(date).format('DD/MM/YYYY')}`;
    const headers = [
      [
        {
          content: `Business Done Report - test123 - Week Ending : ${moment(
            date,
          ).format('DD/MM/YYYY')}`,
        },
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    ];

    const data = exchaquerReportList?.map(item => [
      item?.cost_centre,
      item?.cost_centre_2,
      item?.end_date,
      item?.CASH01,
      item?.sri,
      item?.payment_option,
      item?.gl_code,
      item?.type,
      item?.s_and_z,
      item?.hundred,
      item?.cost_centre_3,
      item?.total?.toFixed(2),
      item?.payment_created_at,
      item?.e_and_i,
      item?.Y_and_N,
    ]);
    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 50);
    doc.autoTable({
      startY: 70,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }
  doc.setProperties({
    title: `Exchequer Data -`,
  });
  // doc.output('dataurlnewwindow', {
  //   filename: `Exchequer Data -`,
  //   title: 'Exchequer Data -',
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
//  ----- end -------

// ------- sale all reports ------------
export const exportSalesContactSourcesReportPDF = props => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 1224], // Custom size in points (1 inch = 72 points)
  });

  if (props?.salesContactSourcesList?.items?.length === 0) {
    doc.setFontSize(12);
    const title =
      'There are no contact sources report for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    doc.setFontSize(12);
    const title = `Contact Sources Report from: ${moment(
      props?.start_date,
    ).format('DD/MM/YYYY')}  To : ${moment(props?.end_date).format(
      'DD/MM/YYYY',
    )}`;

    const titleAt = 'At:all';
    const titleFor = 'For Contact Source : all';
    const headers = [
      [
        'Contact ID',
        'Contact Created',
        'Booking ID',
        'Date Booked',
        'Primary Venue',
        'Booked Venue',
        'Event Date',
        'Company/Contact Name',
        'Contact Source Category',
        'Contact Source',
      ],
    ];
    const headersTotal = [
      ['Quantity', 'Contact Source Category	', 'Contact Source'],
    ];
    const data = props?.salesContactSourcesList?.items?.map(elt => [
      elt?._id,
      moment(elt?.contact_created).format('YYYY-MM-DD h:mm:ss'),
      elt?.booking_ref,
      moment(elt?.booking_created).format('YYYY-MM-DD h:mm:ss'),
      '',
      elt?.event,
      elt?.event_date
        ? moment(elt?.event_date).format('YYYY-MM-DD h:mm:ss')
        : '',
      elt?.Company_Contact_Name,
      elt?.source_category,
      elt?.contact_source,
    ]);

    const dataTotal = props?.salesContactSourcesList?.totals?.map(elt => [
      elt?.quantity,
      elt?.source_cat_name,
      elt?.source_name,
    ]);

    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);
    doc.text(titleFor, marginLeft, 60);
    doc.autoTable({
      startY: 70,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
    let finalY = doc.lastAutoTable.finalY;
    doc.text('Totals', marginLeft, finalY + 20);

    doc.autoTable({
      startY: finalY + 30,
      headStyles: headStyles,
      head: headersTotal,
      body: dataTotal,
    });
  }
  doc.setProperties({
    title: `Contact Sources -`,
  });
  // doc.output('dataurlnewwindow', {
  //   filename: `Contact Sources -`,
  //   title: 'Contact Sources -',
  // });
  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};

export const exportMonthlyRevenueReportPDF = props => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 1224], // Custom size in points (1 inch = 72 points)
  });

  let currentY = 20;

  if (props?.salesMonthlyRevenueList?.length === 0) {
    doc.setFontSize(12);
    const title =
      'There are no Monthly Revenue Reports for the specified timeframe.';
    doc.text(title, 40, currentY);
  } else {
    doc.setFontSize(12);

    props.salesMonthlyRevenueList.forEach((monthlyRevenue, index) => {
      const title = `Revenue invoiced in ${
        monthsTypes[props?.reportData?.months - 1]?.name
      } ${props?.reportData?.years} for: ${
        monthsTypes[monthlyRevenue.month - 1]?.name
      } ${monthlyRevenue.year}`;

      const headers = [
        [
          'Company/Contact Name',
          'Event',
          'Booking Ref',
          'Invoice Number',
          'Invoice Date',
          'Event Date',
          'Event Month',
          'Event Year',
          'Amount Ex Vat',
          'Amount Inc Vat',
        ],
      ];

      const data = monthlyRevenue.data?.map(elt => [
        elt?.company_contact_name,
        elt?.event,
        elt?.booking_ref,
        elt?.invoice_no,
        moment(elt?.invoice_date).format('DD/MM/YYYY'),
        moment(elt?.event_date).format('DD/MM/YYYY'),
        monthsTypes[elt?.month - 1]?.name,
        elt?.event_year,
        elt?.net?.toFixed(2),
        elt?.total?.toFixed(2),
      ]);

      doc.text(title, 40, currentY);
      currentY += 20;

      doc.autoTable({
        startY: currentY,
        headStyles: headStyles,
        head: headers,
        body: data,
      });

      currentY = doc.autoTable.previous.finalY + 20;

      const totalNet = `Monthly Amount (ex Vat) : £${monthlyRevenue?.totalNet?.toFixed(
        2,
      )}`;
      const totalvat = `Monthly Amount (inc Vat) : £${monthlyRevenue?.totalvat?.toFixed(
        2,
      )}`;

      doc.text(totalNet, 40, currentY);
      currentY += 20;
      doc.text(totalvat, 40, currentY);
      currentY += 40;
    });
  }

  doc.setProperties({
    title: 'Balance Due -',
  });

  // doc.output('dataurlnewwindow', {
  //   filename: 'Balance Due -',
  //   title: 'Balance Due -',
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};

// export const exportComparisonTotalsReportPDF = ({
//   salesComparisonTotalsReport,
//   weekDetails,
// }) => {
//   const doc = new jsPDF({
//     orientation: 'l',
//     unit: 'pt',
//     format: [792, 1224], // Custom size in points (1 inch = 72 points)
//   });

//   if (Object.keys(salesComparisonTotalsReport || {}).length === 0) {
//     doc.setFontSize(12);
//     const title = 'There are no coupon items for the timeframe specified';
//     doc.text(title, 40, 20);
//   } else {
//     doc.setFontSize(12);

//     const title = `Total Numbers Comparison: ${weekDetails?.week2} Weeks`;
//     const titleAt = `For week #${weekDetails?.label}`;

//     const headers = [
//       [
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: 'Created: 26th Jan 2023',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: '2023',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: '2020',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: '20-23 +/- Places',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//         {
//           content: '20-23 +/- Revenue',
//           colSpan: 1,
//         },
//         {
//           content: '',
//           colSpan: 1,
//         },
//       ],
//       [
//         {
//           content: '-',
//         },
//         {
//           content: '-',
//         },
//         {
//           content: '#',
//         },
//         {
//           content: '# TOTAL',
//         },
//         {
//           content: '£',
//         },
//         {
//           content: '£ TOTAL',
//         },
//         {
//           content: '#',
//         },
//         {
//           content: '# TOTAL',
//         },
//         {
//           content: '£',
//         },
//         {
//           content: '£ TOTAL',
//         },
//         {
//           content: '#',
//         },
//         {
//           content: '%',
//         },
//         {
//           content: 'TOTAL: # | %',
//         },
//         {
//           content: '£',
//         },
//         {
//           content: '%',
//         },
//         {
//           content: 'TOTAL: £ | %',
//         },
//       ],
//     ];

//     const data = salesComparisonTotalsReport?.data?.map(elt => [
//       elt?.venue,
//       'Provisional\nConfirmed',
//       elt?.total_provisional_places + ' \n' + elt?.total_confirmed_places,
//       elt?.total_place,
//       '£ 0' + '\n' + '£' + elt?.price_confirmed,
//       '£' + elt?.price_confirmed,
//       '0' + '\n' + '0',
//       '0',
//       '£ 0' + '\n' + '£ 0',
//       '£ 0',
//       '0' + '\n' + '0',
//       '0 %' + '\n' + '0 %',
//       '0 %' + '     ' + '0 %',
//       '0 %' + '\n' + ' 0 %',
//       '£ 0.00',
//       '	0%',
//     ]);

//     doc.text(title, 40, 20);
//     doc.text(titleAt, marginLeft, 40);
//     doc.autoTable({
//       theme: 'grid',
//       startY: 50,
//       headStyles: headStyles,
//       head: headers,
//       body: data,
//     });
//   }
//   doc.setProperties({
//     title: `Comparison Totals -`,
//   });
//   doc.output('dataurlnewwindow', {
//     filename: `Comparison Totals -`,
//     title: 'Comparison Totals -',
//   });
// };

// export const exportTicketRevenueReportPDF = ({ salesTicketRevenueReport }) => {
//   const doc = new jsPDF({
//     orientation: 'l',
//     unit: 'pt',
//     format: [680, 680],
//   });
//   const pageWidth = doc.internal.pageSize.width;

//   doc.setFontSize(12);

//   const columnData = [
//     {
//       title: 'Event',
//       dataKey: 'event_name',
//     },
//     {
//       title: 'Booking Ref',
//       dataKey: 'ref_no',
//     },
//     {
//       title: 'Event Date',
//       dataKey: 'event_date',
//     },
//     {
//       title: 'Price',
//       dataKey: 'price',
//     },
//     {
//       title: 'Places',
//       dataKey: 'places',
//     },
//     {
//       title: 'Gross',
//       dataKey: 'gross',
//     },
//     {
//       title: 'Discount Percent',
//       dataKey: 'discount_percent',
//     },
//     {
//       title: 'Discount Percent',
//       dataKey: 'discount_amount',
//     },
//     {
//       title: 'Net',
//       dataKey: 'net',
//     },
//     {
//       title: 'Ticket Billables',
//       dataKey: 'ticket_billable',
//     },
//     {
//       title: 'Sub Total',
//       dataKey: 'sub_total',
//     },
//   ];
//   const col = columnData;
//   salesTicketRevenueReport?.data?.forEach(i1 => {
//     const title = `${i1?.event_name} - ${moment(i1?.event_date).format(
//       'DD/MM/YYYY',
//     )}`;
//     if (i1?.data || i1?.total) {
//       let data = i1?.data?.map(iii => {
//         let finalObj = {};
//         Object.entries(
//           _.pick(iii, [
//             'event_name',
//             'ref_no',
//             'event_date',
//             'price',
//             'places ',
//             'gross',
//             'discount_percent',
//             'discount_amount',
//             'net',
//             'ticket_billable',
//             'sub_total',
//           ]),
//         ).forEach(itemData => {
//           let newObj1 = {};
//           newObj1.content = itemData[1];
//           if (itemData[0] === 'event_date') {
//             newObj1.content = moment(itemData[1]).format('DD/MM/YYYY');
//           }
//           finalObj[itemData[0]] = newObj1;
//         });
//         return finalObj;
//       });

//       let totalData = [
//         [
//           i1?.total?.event_name,
//           i1?.total?.booking_ref,
//           moment(i1?.total?.event_date).format('DD/MM/YYYY'),
//           i1?.total?.price,
//           i1?.total?.places,
//           i1?.total?.gross,
//           i1?.total?.discount_percent,
//           i1?.total?.discount_amount,
//           i1?.total?.net,
//           i1?.total?.ticket_billable,
//           i1?.total?.sub_total,
//         ],
//       ];
//       let finalData = [...data, ...totalData];

//       doc.text(title, 40, 33);
//       doc.autoTable({
//         headStyles: headStyles,
//         columns: col,
//         body: finalData,
//       });
//     } else {
//       const grandTotal = [
//         [
//           i1?.event_name,
//           i1?.booking_ref,
//           moment(i1?.event_date).format('DD/MM/YYYY'),
//           i1?.price,
//           i1?.places,
//           i1?.gross,
//           i1?.discount_percent,
//           i1?.discount_amount,
//           i1?.net,
//           i1?.ticket_billable,
//           i1?.sub_total,
//         ],
//       ];
//       let finalY = doc?.lastAutoTable?.finalY ? doc?.lastAutoTable?.finalY : 10;

//       doc.text(title, pageWidth / 2 - 117, finalY + 14, 'right');
//       doc.autoTable({
//         headStyles: headStyles,
//         columns: col,
//         body: grandTotal,
//       });
//     }
//   });

//   doc.setProperties({
//     title: `Ticket Revenue -`,
//   });

//   doc.output('dataurlnewwindow', {
//     filename: `Ticket Revenue -`,
//     title: 'Ticket Revenue -',
//   });
// };
export const exportProductOrderReportPDF = ({ salesProductReport }) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });
  const storedData = JSON.parse(localStorage.getItem('stateData'));

  if (
    salesProductReport?.product_order.length === 0 &&
    salesProductReport?.result.length === 0
  ) {
    doc.setFontSize(12);
    const title =
      'There are no Products Order Summary Report for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    doc.setFontSize(12);
    const title = `Products Report from :- ${moment(
      storedData?.start_date,
    ).format('DD/MM/YYYY')}  To  ${moment(
      new Date(storedData?.end_date),
    ).format('DD/MM/YYYY')}`;
    const titleAt = `At: All`;
    const productHeaders = [
      [
        'Booking',
        'Venue',
        'Event Date',
        'Company/Contact Name',
        'Quantity',
        'Product Name',
        'Bin#',
      ],
    ];
    const totalHeaders = [['Venue', 'Quantity', 'Product Name', 'Bin#']];
    const productData = salesProductReport?.product_order?.map(elt => [
      elt?.booking_ref,
      elt?.event_name,
      moment(elt?.event_date).format('DD/MM/YYYY'),
      elt?.contact,
      elt?.quantity,
      elt?.product,
      elt?.bin_id,
    ]);

    const totalData = salesProductReport?.result?.map(elt => [
      elt?.event_name,
      elt?.quantity,
      elt?.product,
      elt?.bin_id,
    ]);

    doc.text(title, 40, 20);
    doc.text(titleAt, marginLeft, 40);
    doc.autoTable({
      startY: 50,
      headStyles: headStyles,
      head: productHeaders,
      body: productData,
    });
    let finalY = doc.lastAutoTable.finalY;
    doc.text('Totals', marginLeft, finalY + 20);

    doc.autoTable({
      startY: finalY + 30,
      headStyles: headStyles,
      head: totalHeaders,
      body: totalData,
    });
  }
  doc.setProperties({
    title: `Products -`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Products -`,
  //   title: 'Products -',
  // });
  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
// -----parties internal use only--------
export const partiesInternalUseOnlyPDF = props => {
  let doc = new jsPDF('p', 'pt', 'a4');
  doc.setFontSize(12);

  // const title = props?.yearPartiesList?.map(data => {
  //   return data?.event_name;
  // });
  const title = 'INTERNAL USE ONLY';
  const headers = [
    [
      'Date',
      'Price Net	',
      'Price Gross	',
      'HOLD',
      'Available',
      'Enquired',
      'Provisional',
      'Confirmed',
      'Status',
      'Status Description',
    ],
  ];
  const data = props?.yearPartiesList[0]?.group_data?.map(item => [
    moment(item?.date).format('ddd Do MMM'),
    `£${item?.price_net?.toFixed(2)}`,
    `£${item?.price_gross?.toFixed(2)}`,
    `${+item?.hold > 1 ? item?.hold + ' Days' : item?.hold + ' Day'}`,
    `${item?.available}/${item?.total_place}`,
    item?.enquired,
    item?.provisional,
    item?.confirmed,
    item?.statusText ? item?.statusText : item?.status,
    item?.status_description,
    item?._id,
    item?.status_data.colour,
    item?.is_active,
  ]);
  let MainTitle = [
    {
      content: props?.yearPartiesList[0]?.event_name,
      colSpan: headers[0]?.length,
      styles: { halign: 'center', fontStyle: 'bold' },
    },
  ];
  doc.autoTable({
    startY: 50,
    headStyles: headStyles,
    head: headers,
    body: [MainTitle, ...data],
    willDrawCell: data => {
      if (data.cell.section === 'body' && data.row.raw.length === 1) {
        doc.setTextColor('');
      }
      if (
        data.cell.section === 'body' &&
        data.row.raw.length > 1 &&
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(data.column.dataKey) &&
        data.row.raw[12]
      )
        doc.setTextColor('#212121');
      else if (
        data.cell.section === 'body' &&
        !data.row.raw[12] &&
        data.row.raw.length > 1 &&
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(data.column.dataKey)
      )
        doc.setTextColor('#8a8c8e');
      if (
        data.cell.section === 'body' &&
        data.column.dataKey === 5 &&
        data.row.raw[5].toString() > 0
      ) {
        doc.textWithLink(
          data.row.raw[5].toString(),
          data.cell.x + 2,
          data.cell.y + 10,
          {
            // url: `http://ec2-16-171-40-243.eu-north-1.compute.amazonaws.com:3000/enquiries`,
            url: `${process.env.REACT_APP_API_URL}enquiries/${data.row.raw[10]}?parties=true&from_dashboard_ev_dates=true`,
          },
        );
        doc.setTextColor('#0d48d4');
        // data.cell.text = [' ']; // just to avoid printing the url
      }
      if (
        data.cell.section === 'body' &&
        data.column.dataKey === 8 &&
        data.row.raw[11]
      ) {
        doc.setFillColor(data.row.raw[11]);
        doc.setTextColor('#fff');
      }
    },
  });

  doc.setProperties({
    title: `Event Info for -`,
  });

  doc.output('dataurlnewwindow', {
    filename: `Event Info for: ${title}`,
    title: `Event Info for: ${title}`,
  });
};
// -----------------
export const exportTotalBookingByUserPDF = ({
  startDate,
  endDate,
  salesTotalBookingsByUser,
}) => {
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'pt',
    format: [792, 824],
  });
  doc.setFontSize(12);
  if (salesTotalBookingsByUser?.length <= 0) {
    const title = 'There are no debtors for the timeframe specified';
    doc.text(title, 40, 20);
  } else {
    const title = `Total Booking By User from : ${moment(
      new Date(startDate),
    ).format('DD/MM/YYYY')} To :${moment(new Date(endDate)).format(
      'DD/MM/YYYY',
    )} `;

    const headers = [
      [
        'User',
        'Total Bookings',
        'Enquired Places',
        'Provisional Places',
        'Confirmed Places',
        'Places Fall-off',
        'Own Booking Notes',
        'Total Notes Made',
      ],
    ];

    const data = salesTotalBookingsByUser?.map(elt => [
      elt?.User,
      elt?.Total_Bookings,
      elt?.Enquired_Places,
      elt?.Provisional_Places,
      elt?.Confirmed_Places,
      elt?.Places_falloff,
      elt?.Notes_Added,
      elt?.Total_Notes_Added,
    ]);
    doc.text(title, 40, 20);
    doc.autoTable({
      theme: 'grid',
      startY: 50,
      headStyles: headStyles,
      head: headers,
      body: data,
    });
  }
  doc.setProperties({
    title: `Total Booking by User List`,
  });

  // doc.output('dataurlnewwindow', {
  //   filename: `Total Booking by User List`,
  //   title: `Total Booking by User List`,
  // });

  const pdfDataUrl = doc.output('datauristring');
  return pdfDataUrl;
};
