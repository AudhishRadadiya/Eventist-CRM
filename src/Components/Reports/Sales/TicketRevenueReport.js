import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import { Button, Col, Row } from 'react-bootstrap';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { getTicketRevenueReport } from 'store/reducers/Report/salesReport.slice';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { yearsPrevious } from 'utils/FieldValues';
import Loader from 'Components/Common/Loader';
import ReportHeader from 'Components/Common/ReportHeader';
import TicketRevenueReportTable from './TicketRevenueReportTable';
// import { exportTicketRevenueReportPDF } from 'utils/useExportPDF';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PdfPopup from 'Components/Common/pdfPopup';

export default function TicketRevenueReport() {
  const dispatch = useDispatch();

  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );

  const { salesTicketRevenueReport, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );

  const [reportData, setReportData] = useState({
    select_year: new Date().getFullYear(),
    event_id: '',
  });

  const [isReportCheck, setIsReportCheck] = useState(false);

  const [eventListData, setEventListData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getEventListData());
    if (Object.keys(reportParamData).length) {
      setReportData({
        select_year: Number(reportParamData.select_year),
        event_id: reportParamData?.event_id,
      });
      dispatch(
        getTicketRevenueReport({
          select_year: Number(reportParamData.select_year),
          event_id: reportParamData?.event_id,
        }),
      );
      setIsReportCheck(true);
    }
  }, []);

  const runReport = () => {
    navigate(
      `/reports/ticket-revenue-report?event_id=${reportData.event_id}&select_year=${reportData?.select_year}`,
    );
    dispatch(
      getTicketRevenueReport({
        select_year: Number(reportData.select_year),
        event_id: reportData?.event_id,
      }),
    );
    setIsReportCheck(true);
  };

  useEffect(() => {
    let eventData = activeEventList?.filter(
      item => reportData?.select_year === item?.year,
    );
    if (eventData?.length > 0) {
      setReportData({
        ...reportData,
        event_id: reportParamData?.event_id ?? eventData[0]._id,
      });
    }
    setEventListData(eventData);
  }, [reportData?.select_year, activeEventList]);

  const downloadexcel = () => {
    const workbook = new ExcelJS.Workbook();
    const momentFormat = 'DD/MM/YYYY HH:mm:ss';
    let date = new Date();
    workbook.created = date;
    workbook.modified = date;
    const worksheet = workbook.addWorksheet('My Sheet', {});
    worksheet.getRow(1).values = ['Created', moment(date).format(momentFormat)];
    worksheet.getRow(2).values = [
      'Event',
      'Booking Ref',
      'Event Date',
      'Price',
      'Places',
      'Gross',
      'Discount Percent',
      'Discount Amount',
      'Ticket Total',
      'Ticket Billables',
      'Sub Total',
    ];

    worksheet.getRow(2).font = {
      bold: true,
    };

    worksheet.columns = [
      { key: 'ev_internal_name', width: 17 },
      { key: 'ref_no', width: 17 },
      { key: 'date_date', width: 17 },
      { key: 'Price', width: 17 },
      { key: 'Places', width: 17 },
      { key: 'Gross', width: 17 },
      { key: 'Discount_Percent', width: 17 },
      { key: 'Discount_Amount', width: 17 },
      { key: 'Net', width: 17 },
      { key: 'Ticket_Billables', width: 17 },
      { key: 'SubTotal', width: 17 },
    ];

    salesTicketRevenueReport?.forEach(elem => {
      elem?.data?.forEach(item => {
        item?.data?.forEach(itemData => {
          worksheet.addRow({
            ev_internal_name: itemData?.ev_internal_name,
            ref_no: itemData?.ref_no,
            date_date: itemData?.date_date
              ? moment(itemData?.date_date).format('DD/MM/YYYY')
              : '',
            Price: itemData?.Price?.toFixed(2),
            Places: itemData?.Places,
            Gross: itemData?.Gross?.toFixed(2),
            Discount_Percent: itemData?.Discount_Percent,
            Discount_Amount: itemData?.Discount_Amount?.toFixed(2),
            Net: itemData?.Net?.toFixed(2),
            Ticket_Billables: itemData?.Ticket_Billables,
            SubTotal: itemData?.SubTotal?.toFixed(2),
          });
        });
      });
    });

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `Ticketrevenue_Report_${moment(new Date()).format('DD/MM/YYYY')}.xlsx`,
      );
    });
  };
  const [pdfLoader, setPdfLoader] = useState(false);
  const generatePDF = () => {
    setPdfLoader(true);
    const inputElement = document.getElementById(
      'content-ticket-revenue-report',
    );

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
      {(eventLoading || salesContactSourcesLoading) && <Loader />}
      {pdfLoader && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Ticket Revenue Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Ticket Revenue Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Ticket Revenue Report</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap">
          <h5>Select Event:</h5>
          <Row className="align-items-center mb-2">
            <Col className="w-auto col-8">
              <ul>
                <li>
                  <div className="form-group inline combine_select mb-0">
                    <span className="label">Venue:</span>
                    <FormGroup className="flex-row flex-nowrap">
                      <FormControl className="yaer_select">
                        <Select
                          labelId="Enquiries-label"
                          id="Enquiries"
                          value={reportData.select_year}
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              select_year: e.target.value,
                            });
                            navigate('/reports/ticket-revenue-report');
                          }}
                          defaultValue="Select"
                          className="select_wrap"
                        >
                          {yearsPrevious?.map(item => {
                            return (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <FormControl className="event_select">
                        <Select
                          labelId="Enquiries-label"
                          id="Enquiries"
                          value={reportData.event_id}
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              event_id: e.target.value,
                            });
                            navigate('/reports/ticket-revenue-report');
                          }}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          {eventListData?.map(item => {
                            return (
                              <MenuItem key={item?._id} value={item?._id}>
                                {item?.internal_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </div>
                </li>
              </ul>
            </Col>
            <Col>
              <Button className="btn_primary small" onClick={runReport}>
                Run Report
              </Button>
            </Col>
          </Row>

          {isReportCheck === false && (
            <p className="m-0 text_light">
              Please select an event in order to run the report
            </p>
          )}

          {isReportCheck && (
            <>
              <ul className="pdf_link_wrap bg-white my-3 d-flex align-items-center p-0">
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
                <li className="me-3">
                  <p className="m-0">
                    - Created:{' '}
                    {moment(new Date()).format('MMMM DD YYYY HH:MM:SS')}
                  </p>
                </li>
              </ul>
              <ul className="pdf_link_wrap my-3 d-flex">
                <li className="me-3">
                  <Link
                    to={`/reports/print/ticket-revenue-report?event_id=${reportData.event_id}&select_year=${reportData?.select_year}`}
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
                      <img src={PdfIcon} alt="Pdf Icon" />
                    </div>
                    <div className="pdf_text">
                      <p onClick={generatePDF}>View as PDF</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
        <TicketRevenueReportTable />
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
