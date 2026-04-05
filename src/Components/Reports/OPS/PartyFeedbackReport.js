import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getPartyFeedback } from 'store/reducers/Report/opsReport.slice';
import PartyFeedbackReportTable from './PartyFeedbackReportTable';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Loader from 'Components/Common/Loader';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReportHeader from 'Components/Common/ReportHeader';
import PdfPopup from 'Components/Common/pdfPopup';

export default function PartyFeedbackReport() {
  const dispatch = useDispatch();
  const { partyFeedbackList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const [pdfLoader, setPdfLoader] = useState(false);
  const runReport = () => {
    dispatch(getPartyFeedback());
    setIsReportCheck(true);
  };

  const downloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const momentFormat = 'DD/MM/YYYY HH:mm:ss';
    let date = new Date();
    workbook.created = date;
    workbook.modified = date;
    const worksheet = workbook.addWorksheet('My Sheet', {});
    worksheet.getRow(1).values = ['Created', moment(date).format(momentFormat)];
    if (Object.keys(partyFeedbackList).length > 0) {
      worksheet.getRow(2).values = [
        'Name',
        'Booking Reference',
        'Email',
        'Company Name',
        'Telephone',
        'Venue',
        'Party Date',
        'Guest Or Organiser',
        'Number of Guests',
        'Star Rating',
        'Venue Rating',
        'Cloakroom Rating',
        'Toilet Rating',
        'Security Rating',
        'Bar Service Rating',
        'Meal Quality Rating',
        'Entertainment Rating',
        'Casino Rating',
        'Dodgems Rating',
        'Staff Rating',
        'Coffee Rating',
        'Canapes Rating',
        'Cheese Rating',
        'Tokens Rating',
        'Other Rating',
        'Improvements',
        'Comments',
        'Updated',
        'Anything',
        'Good news',
        'Specific issue',
        'Complaint',
        'Resolved',
        'Manager Details',
        'What else',
        'org name',
        'On call',
        'Case resolved',
        'Compensation',
        'Opt in',
      ];

      worksheet.getRow(2).font = {
        bold: true,
      };

      worksheet.columns = [
        { key: 'firstname', width: 17 },
        { key: 'bookingid', width: 17 },
        { key: 'email', width: 17 },
        { key: 'company', width: 17 },
        { key: 'telephone', width: 17 },
        { key: 'party_venue', width: 17 },
        { key: 'party_date', width: 17 },
        { key: 'party_guest', width: 17 },
        { key: 'total_guests', width: 17 },
        { key: 'preparty', width: 17 },
        { key: 'venue', width: 17 },
        { key: 'cloakroom', width: 17 },
        { key: 'toilets', width: 17 },
        { key: 'security', width: 17 },
        { key: 'barservice', width: 17 },
        { key: 'mealquality', width: 17 },
        { key: 'entertainment', width: 17 },
        { key: 'casino', width: 17 },
        { key: 'dodgems', width: 17 },
        { key: 'staff', width: 17 },
        { key: 'coffee', width: 17 },
        { key: 'canapes', width: 17 },
        { key: 'cheese', width: 17 },
        { key: 'tokens', width: 17 },
        { key: 'other', width: 17 },
        { key: 'improvements', width: 17 },
        { key: 'comments', width: 17 },
        { key: 'updated', width: 17 },
        { key: 'anything', width: 17 },
        { key: 'goodnews', width: 17 },
        { key: 'specific_issue', width: 17 },
        { key: 'complaint', width: 17 },
        { key: 'resolve', width: 17 },
        { key: 'manager', width: 17 },
        { key: 'whatelse', width: 17 },
        { key: 'orgname', width: 17 },
        { key: 'call', width: 17 },
        { key: 'case', width: 17 },
        { key: 'comp', width: 17 },
        { key: 'optin', width: 17 },
      ];

      partyFeedbackList?.forEach(data => {
        worksheet.addRow({
          firstname: data.firstname + ' ' + data?.lastname,
          bookingid: data.bookingid,
          email: data.email,
          company: data.company,
          telephone: data.telephone,
          party_venue: data.party_venue,
          party_date: moment(data?.party_date).format('YYYY-MM-DD hh:mm:ss'),
          party_guest: data.party_guest,
          total_guests: data.total_guests,
          preparty: data.preparty,
          venue: data.venue,
          cloakroom: data.cloakroom,
          toilets: data.toilets,
          security: data.security,
          barservice: data.barservice,
          mealquality: data.mealquality,
          entertainment: data.entertainment,
          casino: data.casino,
          dodgems: data.dodgems,
          staff: data.staff,
          coffee: data.coffee,
          canapes: data.canapes,
          cheese: data.cheese,
          tokens: data.tokens,
          other: data.other,
          improvements: data.improvements,
          comments: data.comments,
          updated: moment(data?.updated).format('YYYY-MM-DD hh:mm:ss'),
          anything: data.anything,
          goodnews: data.goodnews,
          specific_issue: data.specific_issue,
          complaint: data.complaint,
          resolve: data.resolve,
          manager: data.manager,
          whatelse: data.whatelse,
          orgname: data.orgname,
          call: data.call,
          case: data.case,
          comp: data.comp,
          optin: data.optin,
        });
      });
    }

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `Partyfeedback_Report_${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
      );
    });
  };

  const handleDownloadClick = () => {
    downloadExcel();
  };

  const generatePDF = () => {
    setPdfLoader(true);
    const inputElement = document.getElementById('party-feedback-report');

    if (inputElement) {
      html2canvas(inputElement).then(canvas => {
        const pageWidth = 290;
        const pageHeight = 295;
        const aspectRatio = canvas.width / canvas.height;
        const pdf = new jsPDF({
          orientation: aspectRatio > 1 ? 'l' : 'p',
          unit: 'mm',
          format: [pageWidth, pageHeight],
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth;
        const imgHeight = imgWidth / aspectRatio;
        const marginTop = 0;
        const marginBottom = 5;

        const totalPages = Math.ceil(
          (imgHeight + marginTop + marginBottom) / pageHeight,
        );

        for (let page = 1; page <= totalPages; page++) {
          if (page > 1) {
            pdf.addPage();
          }

          const offsetY = -pageHeight * (page - 1) - marginTop;
          pdf.addImage(imgData, 'PNG', 0, offsetY, imgWidth, imgHeight);

          if (page === totalPages) {
            break;
          }
        }

        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        setPdfLoader(false);
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = 'your-pdf-filename.pdf';
        downloadLink.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  return (
    <div className="inner_wrapper">
      {(pdfLoader || opsReportLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Party Feedback Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Party Feedback Report" />

      <div className="report_wrap_mian">
        <h4 className="fw_600">Party Feedback Report</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <Row className="align-items-center mb-2">
            <Col>
              <Button className="btn_primary small" onClick={runReport}>
                Run Report
              </Button>
            </Col>
          </Row>
          {isReportCheck && (
            <>
              <ul className="pdf_link_wrap mt-2 d-inline-flex align-items-center py-2 px-3 bg_gray_box">
                <li className="me-3">
                  <h5 className="m-0">Download the Report:</h5>
                </li>
                <li className="me-3">
                  <Link onClick={handleDownloadClick}>
                    <div className="pdf_icon">
                      <img src={ExcelIcon} alt="Print Icon" />
                    </div>
                    <div className="pdf_text">
                      <p>Download Excel File</p>
                    </div>
                  </Link>
                </li>
                <li className="me-3">
                  <p className="m-0">
                    - Created:{' '}
                    {moment(new Date()).format('MMMM DD YYYY HH:MM:SS')}
                  </p>
                </li>
              </ul>
            </>
          )}
        </div>

        <ul className="pdf_link_wrap my-3 d-flex">
          <li className="me-3">
            <Link to={'/reports/print/party-feedback-report'} target="_blank">
              <div className="pdf_icon">
                <img src={PrintIcon} alt="Print Icon" />
              </div>
              <div className="pdf_text">
                <p>Printable View</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="">
              <div className="pdf_icon">
                <img src={PdfIcon} alt="pdf Icon" />
              </div>
              <div className="pdf_text">
                <p onClick={generatePDF}>View as PDF</p>
              </div>
            </Link>
          </li>
        </ul>
        {partyFeedbackList?.length > 0 ? (
          <PartyFeedbackReportTable />
        ) : (
          <p className="text_light">
            There is no Party feedback for the timeframe specified
          </p>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
