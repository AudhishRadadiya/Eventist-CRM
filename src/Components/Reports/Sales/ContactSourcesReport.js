import { useEffect, useState } from 'react';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Breadcrumbs,
  TextField,
  FormControl,
  FormGroup,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import ContactSourceReportTable from './ContactSourceReportTable';
import { exportSalesContactSourcesReportPDF } from 'utils/useExportPDF';

import Loader from 'Components/Common/Loader';
import ReportHeader from 'Components/Common/ReportHeader';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getContactSourcesListDataActive } from 'store/reducers/Admin/Events/ContactSources/contactSources.slice';
import { getSalesContactSources } from 'store/reducers/Report/salesReport.slice';

import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PdfPopup from 'Components/Common/pdfPopup';

const contactSourcesReportType = [
  {
    id: 0,
    name: 'Contact Added',
  },
  {
    id: 1,
    name: 'New Contacts with booking',
  },
  {
    id: 2,
    name: 'Bookings',
  },
];

export default function ContactSourcesReport() {
  const dispatch = useDispatch();
  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { activeContactSourcesList, contactSourcesLoading } = useSelector(
    ({ contactSources }) => contactSources,
  );
  const { salesContactSourcesList, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );

  const [reportData, setReportData] = useState({
    event_id: 'all',
    cancelled_booking: false,
    contact_sources: 'all',
    show_type: 1,
    start_date: moment(new Date(new Date().getFullYear(), 0, 1)).format(
      'YYYY-MM-DD',
    ),
    end_date: moment(new Date()).format('YYYY-MM-DD'),
  });
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getEventListData());
    dispatch(
      getContactSourcesListDataActive({
        is_active: true,
      }),
    );
    if (Object.keys(reportParamData).length) {
      setReportData(reportParamData);
      dispatch(getSalesContactSources(reportParamData));
      setIsReportCheck(true);
    }
  }, []);

  const handleRunReport = () => {
    navigate(
      `/reports/contact-sources-report?event_id=${reportData?.event_id}&cancelled_booking=${reportData?.cancelled_booking}&contact_sources=${reportData?.contact_sources}&show_type=${reportData?.show_type}&start_date=${reportData?.start_date}&end_date=${reportData?.end_date}`,
    );
    dispatch(getSalesContactSources(reportData));
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
    if (Object.keys(salesContactSourcesList?.items || {})?.length > 0) {
      worksheet.getRow(2).values = [
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
      ];

      worksheet.getRow(2).font = {
        bold: true,
      };

      worksheet.columns = [
        { key: '_id', width: 17 },
        { key: 'contact_created', width: 17 },
        { key: 'booking_id', width: 17 },
        { key: 'booking_created', width: 17 },
        { key: 'venue', width: 17 },
        { key: 'event', width: 17 },
        { key: 'event_date', width: 17 },
        { key: 'Company_Contact_Name', width: 17 },
        { key: 'source_category', width: 17 },
        { key: 'contact_source', width: 17 },
      ];
      salesContactSourcesList?.items?.forEach(data => {
        worksheet.addRow({
          _id: data._id,
          contact_created: moment(data.contact_created).format(
            'YYYY-MM-DD h:mm:ss',
          ),
          booking_id: data.booking_ref,
          booking_created: moment(data.booking_created).format(
            'YYYY-MM-DD h:mm:ss',
          ),
          venue: data.venue,
          event: data.event,
          event_date: data.event_date
            ? moment(data.event_date).format('YYYY-MM-DD h:mm:ss')
            : '',
          Company_Contact_Name: data.Company_Contact_Name,
          source_category: data.source_category,
          contact_source: data.contact_source,
        });
      });

      worksheet.getRow(
        Object.keys(salesContactSourcesList?.items || {})?.length + 4,
      ).values = ['Totals'];
      worksheet.getRow(
        Object.keys(salesContactSourcesList?.items || {})?.length + 4,
      ).font = {
        bold: true,
      };
      worksheet.getRow(
        Object.keys(salesContactSourcesList?.items || {})?.length + 5,
      ).values = ['Quantity', 'Contact Source Category', 'Contact Source'];
      worksheet.getRow(
        Object.keys(salesContactSourcesList?.items || {})?.length + 5,
      ).font = {
        bold: true,
      };
      salesContactSourcesList?.totals?.forEach((data, index) => {
        worksheet.getRow(
          Object.keys(salesContactSourcesList?.items || {})?.length + index + 6,
        ).values = [
          JSON.stringify(data.quantity),
          data.source_cat_name,
          data.source_name,
        ];
      });
    }
    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `Contact_Source_Report_${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
      );
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setReportData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    navigate(`/reports/contact-sources-report`);
  };

  const handlePdf = async () => {
    const data = await exportSalesContactSourcesReportPDF({
      salesContactSourcesList,
      start_date: reportData?.start_date,
      end_date: reportData?.end_date,
    });
    setPdfUrl(data);
  };

  const eventName = activeEventList?.filter(
    item => item._id === reportData.event_id,
  );

  const contactSource = activeContactSourcesList
    .map(category =>
      category.group_data.find(item => item._id === reportData.contact_sources),
    )
    .find(item => item !== null);
  return (
    <div className="inner_wrapper">
      {(eventLoading ||
        salesContactSourcesLoading ||
        contactSourcesLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Contact Sources Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Contact Sources Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600 text_primary">Run Report For :</h4>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <div className="contact_source_wrapper">
            <ul className="d-block bg-white p-0 contact_filter">
              <li className="bg_gray_box px-3 py-2 mb-2">
                <Row className="align-items-center g-2">
                  <Col xs={5}>
                    <div className="form-group inline mb-0">
                      <span className="label">Venue:</span>
                      <FormGroup>
                        <FormControl className="event_select w-100">
                          <Select
                            labelId="Enquiries-label"
                            id="Enquiries"
                            name="event_id"
                            value={reportData?.event_id}
                            onChange={handleChange}
                            defaultValue="all"
                            className="select_wrap "
                          >
                            <MenuItem value="all">
                              Run all event venues
                            </MenuItem>
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
                  </Col>
                  <Col xs={7}>
                    <div className="form-group mb-0">
                      <span className="label d-inline-block mt-2">
                        Show Cancelled Bookings:
                      </span>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="ShowOnline-label"
                          defaultValue="activeYes"
                          name="cancelled_booking"
                          className="custom_radio"
                          value={reportData?.cancelled_booking}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </Col>
                </Row>
              </li>
              <li className="bg_gray_box px-3 py-2 mb-2">
                <Row className="align-items-center g-2">
                  <Col xs={5}>
                    <div className="form-group inline mb-0">
                      <span className="label">Select Contact Source:</span>
                      <FormGroup>
                        <FormControl className="event_select w-100">
                          <Select
                            labelId="Enquiries-label"
                            id="Enquiries"
                            name="contact_sources"
                            value={reportData?.contact_sources}
                            onChange={handleChange}
                            defaultValue="all"
                            className="select_wrap "
                          >
                            <MenuItem value="all">
                              Run all contact sources
                            </MenuItem>
                            {activeContactSourcesList?.map(item => {
                              return item?.group_data?.map(element => {
                                return (
                                  <MenuItem
                                    value={element?._id}
                                    key={element?._id}
                                  >
                                    {element?.name}
                                  </MenuItem>
                                );
                              });
                            })}
                          </Select>
                        </FormControl>
                      </FormGroup>
                    </div>
                  </Col>
                  <Col xs={7}>
                    <Row className="g-2">
                      <Col xs={4}>
                        <FormGroup className="w-100 ">
                          <FormControl className="event_select w-100">
                            <Select
                              labelId="Enquiries-label"
                              id="Enquiries"
                              name="show_type"
                              value={reportData?.show_type}
                              onChange={handleChange}
                              defaultValue="Select"
                              className="select_wrap "
                            >
                              <MenuItem value="Select" disabled>
                                Select
                              </MenuItem>
                              {contactSourcesReportType?.map(item => {
                                return (
                                  <MenuItem value={item?.id} key={item?.id}>
                                    {item?.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </Col>
                      <Col xs={4}>
                        <div className="form-group inline date_picker mb-0">
                          <span className="text_small me-2">
                            From&nbsp;Date:
                          </span>
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
                                navigate(`/reports/contact-sources-report`);
                              }}
                              renderInput={params => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div className="form-group inline date_picker mb-0">
                          <span className="text_small me-2">
                            End&nbsp;Date:
                          </span>
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
                                navigate(`/reports/contact-sources-report`);
                              }}
                              renderInput={params => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </li>
            </ul>
            <Button
              className="btn_primary small mt-3"
              onClick={handleRunReport}
            >
              Run Report
            </Button>
          </div>

          <ul className="pdf_link_wrap mt-3 bg-white d-inline-flex align-items-center p-0">
            <li className="me-3">
              <h5 className="m-0">Download the Report:</h5>
            </li>
            <li className="me-3">
              <Link to="">
                <div className="pdf_icon">
                  <img src={ExcelIcon} alt="Print Icon" />
                </div>
                <div
                  className="pdf_text"
                  onClick={() => {
                    downloadexcel();
                  }}
                >
                  <p>Download Excel File</p>
                </div>
              </Link>
            </li>
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
                  to={`/reports/print/contact-source?event_id=${reportData?.event_id}&cancelled_booking=${reportData?.cancelled_booking}&contact_sources=${reportData?.contact_sources}&show_type=${reportData?.show_type}&start_date=${reportData?.start_date}&end_date=${reportData?.end_date}`}
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
                    <img onClick={handlePdf} src={PdfIcon} alt="Pdf Icon" />
                  </div>
                  <div className="pdf_text">
                    <p onClick={handlePdf}>View as PDF</p>
                  </div>
                </Link>
              </li>
            </ul>
            <ContactSourceReportTable
              reportData={reportData}
              eventName={eventName}
              contactSource={contactSource}
            />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
