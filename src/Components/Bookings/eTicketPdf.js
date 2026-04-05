import jsPDF from 'jspdf';
import mainBg from '../../Assets/Img/pdf-e-ticket.jpeg';
import logoInvoice from '../../Assets/Img/logoInvoice.jpg';

export const exportETicketPdf = data => {
  let doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(45);
  var image = new Image();
  image.src = mainBg;
  doc.addImage(image, 'JPEG', 0, 0, pageWidth, 280);
  doc.setFontSize(10);
  doc.setTextColor(40);
  doc.text('You are cordially invited to :', pageWidth / 2, 300, {
    align: 'center',
  });
  doc.setFontSize(18);
  doc.text('Dream Circus', pageWidth / 2, 325, {
    align: 'center',
  });
  doc.setFontSize(12);
  doc.text('Kent County Showground, Maidstone', pageWidth / 2, 350, {
    align: 'center',
  });
  doc.setFontSize(10);
  doc.setTextColor(40);
  doc.text('Friday 2nd December 2022', pageWidth / 2, 365, {
    align: 'center',
  });
  doc.setFontSize(11);
  doc.setTextColor('#63615f');
  doc.text(`Organiser's Name`, pageWidth / 2, 390, {
    align: 'center',
  });
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(`COMPANY 185259`, pageWidth / 2, 410, {
    align: 'center',
  });
  doc.setFontSize(11);
  doc.setTextColor('#63615f');
  doc.text(`Booking Reference`, pageWidth / 2, 440, {
    align: 'center',
  });
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text('633153', pageWidth / 2, 460, {
    align: 'center',
  });
  doc.setFontSize(11);
  doc.setTextColor('#63615f');
  doc.text(`Number of Guests`, pageWidth / 2, 490, {
    align: 'center',
  });
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text('10', pageWidth / 2, 510, {
    align: 'center',
  });
  doc.setFontSize(11);
  doc.setTextColor('#63615f');
  doc.text('Useful Information', 20, 550);
  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('Dress Code : ', 80, 565, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text('Smart Dress - No Jeans or Trainers.', 80, 565, 'left');

  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('Bag Search : ', 80, 580, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text(
    'Bag searches will be completed at all our venues.',
    80,
    580,
    'left',
  );
  doc.setFontSize(11);
  doc.setTextColor('#63615f');
  doc.text('Itinerary', pageWidth - 270, 550, 'left');
  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('6:45pm  ', pageWidth - 230, 565, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text('Doors Open and bar service begins', pageWidth - 230, 565, 'left');

  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('7.00pm  ', pageWidth - 230, 580, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text('Entertainment commences', pageWidth - 230, 580, 'left');

  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('7.30pm  ', pageWidth - 230, 595, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text('Canapés Served', pageWidth - 230, 595, 'left');

  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('8.15pm  ', pageWidth - 230, 610, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text('Entertainment', pageWidth - 230, 610, 'left');

  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('8.25pm  ', pageWidth - 230, 625, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text('Dinner Served', pageWidth - 230, 625, 'left');

  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('9.40pm  ', pageWidth - 230, 640, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text('Dodgems, Dancing & Casino', pageWidth - 230, 640, 'left');

  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('12.00am  ', pageWidth - 230, 655, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text(`Survivors' Breakfast`, pageWidth - 230, 655, 'left');

  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('12.15am  ', pageWidth - 230, 670, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text('Last Orders and last rides', pageWidth - 230, 670, 'left');

  doc.setTextColor(50);
  doc.setFont('times', 'bold');
  doc.text('12.30am  ', pageWidth - 230, 685, 'right');
  doc.setTextColor('#63615f');
  doc.setFont('times', 'normal');
  doc.text(`Bar closes and carriages`, pageWidth - 230, 685, 'left');
  doc.setTextColor(50);
  var splitTitle = doc.splitTextToSize(
    `Please ensure you have pre-booked your transport home. Taxi numbers will be available at the venue on the night.`,
    180,
  );
  doc.text(splitTitle, pageWidth - 275, 705, 'left');
  var logoImg = new Image();
  logoImg.src = logoInvoice;
  doc.addImage(logoImg, 'JPG', pageWidth / 2 - 40, pageHeight - 40, 70, 0);
  for (let i = 0; i < 4; i++) {
    doc.addPage();
    doc.addImage(logoImg, 'JPG', pageWidth / 2 - 100, 10, 70, 0);
    // doc.line(
    //   pageWidth / 2 - 45,
    //   pageWidth / 2 + 20,
    //   pageWidth / 2 - 45,
    //   pageWidth / 2,
    // );
    doc.line(pageWidth / 2 - 20, 10, pageWidth / 2 - 20, 40);
  }
  doc.output('dataurlnewwindow', {
    filename: `Eventist`,
    title: 'Eventist',
  });
};
