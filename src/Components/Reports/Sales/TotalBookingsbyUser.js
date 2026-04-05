import { useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import { Button, Col, Row } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalBookingsByUser } from 'store/reducers/Report/salesReport.slice';
import ReportHeader from 'Components/Common/ReportHeader';
import Loader from 'Components/Common/Loader';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import TotalBookingsByUserTable from './TotalBookingsByUserTable';
import { exportTotalBookingByUserPDF } from 'utils/useExportPDF';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import PdfPopup from 'Components/Common/pdfPopup';

export default function TotalBookingsbyUser() {
  const dispatch = useDispatch();

  const { salesTotalBookingsByUser, salesTotalBookingsByUserLoading } =
    useSelector(({ salesReport }) => salesReport);
  //ui not geeting proper, so list of fata (table) pending...
  const [reportData, setReportData] = useState({
    start_date: new Date(),
    end_date: new Date(),
  });
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const runReport = () => {
    const data = {
      start_date: moment(reportData?.start_date).format('YYYY-MM-DD'),
      end_date: moment(reportData?.end_date).format('YYYY-MM-DD'),
    };
    dispatch(getTotalBookingsByUser(data));
    setIsReportCheck(true);
  };

  const downloadexcel = () => {
    const workbook = new ExcelJS.Workbook();
    const momentFormat = 'DD/MM/YYYY HH:mm:ss';
    let date = new Date();
    workbook.created = date;
    workbook.modified = date;
    const worksheet = workbook.addWorksheet('My Sheet', {});
    worksheet.getRow(1).values = ['Created', moment(date).format(momentFormat)];
    worksheet.getRow(2).values = [
      'User',
      'Total Bookings',
      'Enquired Places',
      'Provisional Places',
      'Confirmed Places',
      'Places Fall-off',
      'Own Booking Notes',
      'Total Notes Made',
    ];

    worksheet.getRow(2).font = {
      bold: true,
    };

    worksheet.columns = [
      { key: 'User', width: 17 },
      { key: 'Total_Bookings', width: 17 },
      { key: 'Enquired_Places', width: 17 },
      { key: 'Provisional_Places', width: 17 },
      { key: 'Confirmed_Places', width: 17 },
      { key: 'Places_falloff', width: 17 },
      { key: 'Notes_Added', width: 17 },
      { key: 'Total_Notes_Added', width: 17 },
    ];

    salesTotalBookingsByUser?.forEach(data => {
      worksheet.addRow({
        User: data?.User,
        Total_Bookings: data.Total_Bookings,
        Enquired_Places: data.Enquired_Places,
        Provisional_Places: data.Provisional_Places,
        Confirmed_Places: data.Confirmed_Places,
        Places_falloff: data?.Places_falloff,
        Notes_Added: data.Notes_Added,
        Total_Notes_Added: data.Total_Notes_Added,
      });
    });

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `Total_Booking_By_User_${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
      );
    });
  };

  const handlePdf = async () => {
    const data = await exportTotalBookingByUserPDF({
      startDate: reportData?.start_date,
      endDate: reportData?.end_date,
      salesTotalBookingsByUser: salesTotalBookingsByUser,
    });
    setPdfUrl(data);
  };

  return (
    <div className="inner_wrapper">
      {salesTotalBookingsByUserLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Total Bookings by User</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Total Bookings by User" />

      <div className="report_wrap_mian">
        <h4 className="fw_600">Total Bookings By User</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap">
          <h5>Select Event:</h5>
          <Row className="align-items-center">
            <Col className="w-auto col-7">
              <ul>
                <li>
                  <div className="form-group inline date_picker mb-0">
                    <span className="label">From Date:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={reportData?.start_date}
                        inputFormat="DD-MM-YYYY"
                        onChange={newValue => {
                          setReportData(prevState => ({
                            ...prevState,
                            start_date: moment(newValue?.toDate()).format(
                              'YYYY-MM-DD',
                            ),
                          }));
                        }}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                </li>
                <li>
                  <div className="form-group inline date_picker mb-0">
                    <span className="label">End Date:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={reportData?.end_date}
                        inputFormat="DD-MM-YYYY"
                        onChange={newValue => {
                          setReportData(prevState => ({
                            ...prevState,
                            end_date: moment(newValue?.toDate()).format(
                              'YYYY-MM-DD',
                            ),
                          }));
                        }}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
          <Button className="btn_primary small mt-2 mb-3" onClick={runReport}>
            Run Report
          </Button>
          <ul className="pdf_link_wrap bg-white my-3 d-flex align-items-center p-0">
            {salesTotalBookingsByUser &&
              salesTotalBookingsByUser?.length > 0 && (
                <>
                  <li className="me-3">
                    <h5 className="m-0">Download the Report:</h5>
                  </li>
                  <li className="me-3">
                    <span
                      className="d-flex align-items-center cursor-pointer"
                      onClick={() => {
                        downloadexcel();
                      }}
                    >
                      <div className="pdf_icon">
                        <img src={ExcelIcon} alt="Print Icon" />
                      </div>
                      <div className="pdf_text">
                        <p className="mb-0 ms-2">Download Excel File</p>
                      </div>
                    </span>
                  </li>
                </>
              )}
            <li className="me-3">
              <p className="m-0">
                - Created: {moment(new Date()).format('MMMM DD YYYY HH:MM:SS')}
              </p>
            </li>
          </ul>
          {isReportCheck === false && (
            <p className="m-0 text_light">
              Please select an event and date in order to run the report
            </p>
          )}
        </div>
        {isReportCheck && (
          <>
            <ul className="pdf_link_wrap my-3 d-flex">
              <li className="me-3">
                <Link
                  to={`/reports/print/total-bookings-by-user?print=true&start_date=${
                    reportData?.start_date &&
                    new Date(reportData?.start_date)?.toISOString()
                  }&end_date=${
                    reportData?.end_date &&
                    new Date(reportData?.end_date)?.toISOString()
                  }`}
                  target="_blank"
                >
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
                    <img onClick={handlePdf} src={PdfIcon} alt="pdf Icon" />
                  </div>
                  <div className="pdf_text">
                    <p onClick={handlePdf}>View as PDF</p>
                  </div>
                </Link>
              </li>
            </ul>

            <TotalBookingsByUserTable reportData={reportData} />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
