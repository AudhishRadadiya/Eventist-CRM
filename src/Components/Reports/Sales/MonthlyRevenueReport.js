import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import { Button, Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { monthsTypes, yearsArray } from 'utils/FieldValues';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { useDispatch, useSelector } from 'react-redux';
import ReportHeader from 'Components/Common/ReportHeader';
import MonthlyRevenueReportTable from './MonthlyRevenueReportTable';
import { getMonthlyRevenue } from 'store/reducers/Report/salesReport.slice';
import Loader from 'Components/Common/Loader';
import { exportMonthlyRevenueReportPDF } from 'utils/useExportPDF';
import ExcelJS from 'exceljs';
import _ from 'lodash';
import moment from 'moment';
import { saveAs } from 'file-saver';
import PdfPopup from 'Components/Common/pdfPopup';
export default function MonthlyRevenueReport() {
  const dispatch = useDispatch();
  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { salesMonthlyRevenueList, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const navigate = useNavigate();
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const [reportData, setReportData] = useState({
    event_id: 'all',
    years: 2023,
    months: 1,
  });

  useEffect(() => {
    dispatch(getEventListData());
    if (Object.keys(reportParamData).length) {
      setReportData(reportParamData);
      dispatch(getMonthlyRevenue(reportParamData));
      setIsReportCheck(true);
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setReportData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    navigate('/reports/monthly-revenue-report');
  };
  const handleRunReport = () => {
    navigate(
      `/reports/monthly-revenue-report?event_id=${reportData?.event_id}&years=${reportData?.years}&months=${reportData?.months}`,
    );
    dispatch(getMonthlyRevenue(reportData));
    setIsReportCheck(true);
  };

  const downloadexcel = () => {
    const workbook = new ExcelJS.Workbook();
    let date = new Date();
    workbook.created = date;
    workbook.modified = date;
    const worksheet = workbook.addWorksheet('Monthly Revenue Report', {});

    salesMonthlyRevenueList.forEach(monthlyData => {
      worksheet.addRow([]); // Add an empty row for better separation

      worksheet.addRow([
        'Revenue invoiced in',
        reportData?.months === 12
          ? 'December'
          : `${monthsTypes[reportData?.months - 1]?.name} ${reportData?.years}`,
        monthlyData?.month === 12
          ? 'December'
          : `${monthsTypes[monthlyData?.month - 1]?.name} ${monthlyData?.year}`,
      ]);

      if (monthlyData?.data && monthlyData?.data.length > 0) {
        worksheet.addRow([
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
        ]);

        worksheet.getRow(worksheet.rowCount).font = {
          bold: true,
        };

        _.each(monthlyData?.data, data => {
          worksheet.addRow([
            _.get(data, 'company_contact_name', ''),
            _.get(data, 'event', ''),
            _.get(data, 'booking_ref', ''),
            _.get(data, 'invoice_no', ''),
            moment(_.get(data, 'invoice_date')).format('DD/MM/YYYY') || '',
            moment(_.get(data, 'event_date')).format('DD/MM/YYYY') || '',
            monthsTypes[_.get(data, 'month', 1) - 1]?.name || '',
            _.get(data, 'event_year', ''),
            parseFloat(_.get(data, 'net', ''))?.toFixed(2),
            parseFloat(_.get(data, 'total', ''))?.toFixed(2),
          ]);
        });

        worksheet.addRow([]);

        const totalNet = `Monthly Amount (ex Vat): £${
          monthlyData?.totalNet?.toFixed(2) || 0
        }`;
        const totalvat = `Monthly Amount (inc Vat): £${
          monthlyData?.totalvat?.toFixed(2) || 0
        }`;

        worksheet.addRow([totalNet]);
        worksheet.addRow([totalvat]);

        worksheet.addRow([]);
      }
    });

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(
        blob,
        `Monthly_Revenue_Report_${moment(new Date()).format(
          'DD-MM-YYYY',
        )}.xlsx`,
      );
    });
  };

  const handlePdf = async () => {
    const data = await exportMonthlyRevenueReportPDF({
      salesMonthlyRevenueList,
      reportData,
    });
    setPdfUrl(data);
  };

  return (
    <div className="inner_wrapper">
      {(eventLoading || salesContactSourcesLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Monthly Revenue Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Balance Due Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Monthly Revenue Report</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <h5>Select Event:</h5>
          <Row className="align-items-center mb-2">
            <Col className="w-auto">
              <ul>
                <li>
                  <div className="form-group inline combine_select mb-0">
                    <span className="label">Venue:</span>
                    <FormGroup className="flex-row flex-nowrap">
                      <FormControl className="event_select">
                        <Select
                          labelId="event_id-label"
                          id="event_id"
                          name="event_id"
                          value={reportData?.event_id}
                          onChange={handleChange}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          <MenuItem value="all">Run all event venues</MenuItem>
                          {activeEventList?.map(item => {
                            return (
                              <MenuItem value={item?._id} key={item?._id}>
                                {item?.internal_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </div>
                </li>
                <li>
                  <div className="form-group inline date_picker mb-0">
                    <span className="label">Date:</span>
                    <FormGroup className="flex-row flex-nowrap">
                      <FormControl className="event_select">
                        <Select
                          labelId="years-label"
                          id="years"
                          name="years"
                          value={reportData?.years}
                          onChange={handleChange}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          <MenuItem value="Select" disabled>
                            Select
                          </MenuItem>
                          {yearsArray?.map(item => {
                            return (
                              <MenuItem value={item} key={item}>
                                {item}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </div>
                </li>
                <li>
                  <div className="form-group date_picker mb-0">
                    <FormGroup className="flex-row flex-nowrap">
                      <FormControl className="event_select">
                        <Select
                          labelId="months-label"
                          id="months"
                          name="months"
                          value={reportData?.months}
                          onChange={handleChange}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          <MenuItem value="Select" disabled>
                            Select
                          </MenuItem>{' '}
                          {monthsTypes?.map(item => {
                            return (
                              <MenuItem value={item?.id} key={item?.id}>
                                {item?.name}
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
              <Button className="btn_primary small" onClick={handleRunReport}>
                Run Report
              </Button>
            </Col>
          </Row>
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
                  to={`/reports/print/monthly-revenue-report?event_id=${reportData?.event_id}&years=${reportData?.years}&months=${reportData?.months}`}
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
              <li className="me-3">
                <Link to="">
                  <div className="pdf_icon">
                    <img onClick={handlePdf} src={PdfIcon} alt="pdf Icon" />
                  </div>
                  <div className="pdf_text">
                    <p onClick={handlePdf}>View as PDF</p>
                  </div>
                </Link>
              </li>
              {salesMonthlyRevenueList?.length > 0 && (
                <li>
                  <Link to="">
                    <div className="pdf_icon">
                      <img src={ExcelIcon} alt="pdf Icon" />
                    </div>
                    <div
                      className="pdf_text"
                      onClick={() => {
                        downloadexcel();
                      }}
                    >
                      <p>Download .CSV</p>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
            <MonthlyRevenueReportTable reportData={reportData} />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
