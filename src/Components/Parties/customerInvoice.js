import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoInvoice from '../../Assets/Img/logoInvoice.jpg';
import _ from 'lodash';
import moment from 'moment';

const headStyles = {
  fillColor: '#454545',
  textColor: [255, 255, 255],
  fontSize: 8,
  padding: 0,
};

export const customerInvoice = data => {
  let doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.width;

  const headersTotal = [
    [
      'Event Date ',
      'Business Price* Excluding VAT',
      'Consumer Price Including VAT',
      'Status',
    ],
  ];
  const bodyData = data?.customerData?.map(
    item =>
      !item?.is_active === false && [
        moment(item?.date).format('dddd Do MMM YYYY'),
        moment(item?.date) > moment(new Date())
          ? `£${item?.price_net?.toFixed(2)}`
          : '',
        moment(item?.date) > moment(new Date())
          ? `£${item?.price_gross?.toFixed(2)}`
          : '',
        `This event has already taken place.`,
      ],
  );

  const title = data?.customerData?.map(data => {
    return data?.event_name;
  });
  doc.setFontSize(15);
  doc.setTextColor(45);

  doc.setFont('times', 'bold');
  doc.text('DATES & PRICES', 40, 165);

  doc.setFontSize(12);
  doc.text(title, 40, 193);
  doc.setFont('times', 'normal');
  doc.text(`Publish Date:`, 410, 193);
  doc.setFont('times', 'bold');
  doc.text(moment(new Date()).format('Do MMM YYYY'), 480, 193);
  var image = new Image();
  image.src = logoInvoice;
  doc.addImage(image, 'JPEG', 20, 60, 150, 50);
  doc.setFontSize(10);
  doc.setTextColor(40);

  doc.setFont('times', 'bold');
  doc.text('Eventist Group Ltd', pageWidth - 150, 60);

  doc.setFont('times', 'noraml');
  doc.text('Units 2-4 Trade City', pageWidth - 150, 72);
  doc.text('Avro Way', pageWidth - 150, 84);
  doc.text('Brooklands Industrial Estate', pageWidth - 150, 96);
  doc.text('Weybridge', pageWidth - 150, 108);
  doc.text('SURREY', pageWidth - 150, 120);
  doc.text('KT13 0YF', pageWidth - 150, 132);

  doc.autoTable({
    startY: 198,
    headStyles: headStyles,
    head: headersTotal,
    body: bodyData,
    pageBreak: 'avoid',
  });

  let finalY = doc.lastAutoTable.finalY;
  doc.setFont('times', 'bold');
  doc.text('Which price do I pay? ', 40, finalY + 70, 'left');

  doc.setFont('times', 'normal');
  doc.text(
    'If you are a private individual you will pay the prices listed under the"Consumer Price" (including VAT) column.',
    40,
    finalY + 90,
  );
  const splitSecondeText = doc.splitTextToSize(
    'If you are a business (VAT registered), you will initially pay the consumer price higher price but will then re-claim the VAT, therefore it is the price listed under the "Business Price" column that your company will end up having paid.',
    pageWidth - 80,
  );
  doc.text(splitSecondeText, 40, finalY + 110);

  // const splitThirdText = doc.splitTextToSize(
  //   '*VAT charged at the standard rate of 5% for all transactions completed before 01/10/21 and 12.5% for all transactions thereafter this year',
  //   pageWidth - 80,
  // );
  // doc.text(splitThirdText, 40, finalY + 140);

  doc.setFont('times', 'bold');
  doc.text(
    'All prices are per person and consumer pricing includes VAT at the current rate',
    40,
    finalY + 142,
  );
  doc.setFont('times', 'normal');
  doc.text(
    'Our famous Mixed Group Event nights are open to groups of as few as 10 guests.',
    40,
    finalY + 160,
  );

  const splitThirdText = doc.splitTextToSize(
    'Exclusive Sole-Use Nights, available to groups of 300+ Guests, who can privately hire the entire venue, (the prices shown are a starting price based on booking the venue at full capacity).',
    pageWidth - 80,
  );
  doc.text(splitThirdText, 40, finalY + 175);
  doc.text(
    'All dates are subject to availability & all details are subject to change.',
    40,
    finalY + 203,
  );

  doc.setFont('times', 'bold');
  doc.text(
    'All deposits are non refundable upon cancellation.',
    40,
    finalY + 217,
  );

  doc.setFont('times', 'normal');

  doc.setTextColor(255, 0, 0);

  doc.text('NOTE :', 40, finalY + 240);
  doc.setTextColor(0, 0, 0);

  const splitNote = doc.splitTextToSize(
    `${'              '}These dates and prices are correct at the time of publish ${moment(
      new Date(),
    ).format(
      'YYYY-MM-DD HH:mm:ss',
    )} but change frequently so please ensure you check at ${'                                          '} for the latest dates and prices.`,
    pageWidth - 80,
  );
  doc.text(splitNote, 40, finalY + 239.5);

  doc.setTextColor('#0d6efd');
  doc.textWithLink(
    `www.bestpartiesever.com`,
    pageWidth - 502.2,
    finalY + 251.5,
    'left',
    {
      url: 'http://ec2-16-171-40-243.eu-north-1.compute.amazonaws.com:3001',
    },
  );
  doc.output('dataurlnewwindow', {
    filename: `Eventist`,
    title: 'Eventist',
  });
};
