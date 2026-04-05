import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import { Button, Col, Row } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import ExchaquerReportTable from './ExchaquerReportTable';
import { useDispatch, useSelector } from 'react-redux';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import Loader from 'Components/Common/Loader';
import ReportHeader from 'Components/Common/ReportHeader';
import { yearsArray } from 'utils/FieldValues';
import { getExchequerReportList } from 'store/reducers/Report/accountReport.slice';
import { exportExchaquerPDF } from 'utils/useExportPDF';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toRound } from 'utils/common';
import PdfPopup from 'Components/Common/pdfPopup';
export default function ExchequerReport() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  let params = Object.fromEntries([...searchParams]);

  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { accountReportLoading, exchaquerReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );

  const [reportData, setReportData] = useState({
    year: new Date().getFullYear(),
    event_id: '',
    start_date: new Date(),
    end_date: new Date(),
  });
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [eventListData, setEventListData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    dispatch(getEventListData());
  }, []);

  const eventName = activeEventList?.filter(
    item => item._id === reportData.event_id,
  );
  useEffect(() => {
    let eventData = activeEventList?.filter(
      item => reportData?.year === item?.year,
    );
    if (eventData?.length > 0) {
      setReportData({ ...reportData, event_id: eventData[0]._id });
    } else {
      setReportData({ ...reportData, event_id: '' });
    }
    setEventListData(eventData);
  }, [reportData?.year, activeEventList]);

  const runReport = () => {
    dispatch(
      getExchequerReportList({
        year: reportData?.year,
        event_id: reportData.event_id,
        start_date: moment(new Date(reportData?.start_date)).format(
          'YYYY-MM-DD',
        ),
        end_date: moment(new Date(reportData?.end_date)).format('YYYY-MM-DD'),
      }),
    );
    setIsReportCheck(true);
  };

  useEffect(() => {
    if (Object?.keys(params)?.length > 0) {
      setIsReportCheck(true);
      setReportData({
        year: reportData?.year,
        event_id: params?.report_event,
        start_date: moment(params?.report_end_date)
          .startOf('week')
          .format('YYYY-MM-DD'),
        end_date: params?.report_end_date,
      });
    }
  }, []);

  const downloadexcel = () => {
    const workbook = new ExcelJS.Workbook();
    const momentFormat = 'DD/MM/YYYY HH:mm:ss';
    let date = new Date();
    workbook.created = date;
    workbook.modified = date;
    const worksheet = workbook.addWorksheet('My Sheet', {});
    worksheet.getRow(1).values = ['Created', moment(date).format(momentFormat)];
    worksheet.getRow(2).values = [
      `Business Done Report - ${
        eventName[0]?.public_name
      } - Week Ending : ${moment(date).format('DD/MM/YYYY')}`,
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
    ];

    worksheet.getRow(2).font = {
      bold: true,
    };

    worksheet.columns = [
      { key: 'cost_centre', width: 17 },
      { key: 'cost_centre_2', width: 17 },
      { key: 'end_date', width: 17 },
      { key: 'CASH01', width: 17 },
      { key: 'sri', width: 17 },
      { key: 'payment_option', width: 17 },
      { key: 'gl_code', width: 17 },
      { key: 'type', width: 17 },
      { key: 's_and_z', width: 17 },
      { key: 'hundred', width: 17 },
      { key: 'cost_centre_3', width: 17 },
      { key: 'total', width: 17 },
      { key: 'payment_created_at', width: 17 },
      { key: 'e_and_i', width: 17 },
      { key: 'Y_and_N', width: 17 },
    ];

    exchaquerReportList?.forEach(item => {
      Object.keys(item).forEach(paymentMethod => {
        const data = item[paymentMethod];
        if (data.hasOwnProperty('payment_option')) {
          worksheet.addRow({
            payment_method: paymentMethod,
            cost_centre: data?.cost_centre,
            cost_centre_2: data?.cost_centre_2,
            end_date: data?.end_date,
            CASH01: data?.CASH01,
            sri: data?.sri,
            payment_option: data?.payment_option,
            gl_code: data?.gl_code || 0,
            type: data?.type,
            s_and_z: data?.s_and_z,
            hundred: data?.hundred,
            cost_centre_3: data?.cost_centre_3,
            total: data?.total?.toFixed(2),
            payment_created_at: data?.payment_created_at,
            e_and_i: data?.e_and_i,
            Y_and_N: data?.Y_and_N,
          });
        }
      });
    });

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `Exchequer_Report_${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
      );
    });
  };

  const handlePdf = async () => {
    const data = await exportExchaquerPDF({
      exchaquerReportList,
      date: reportData?.end_date,
      event: eventName,
    });
    setPdfUrl(data);
  };
  return (
    <div className="inner_wrapper">
      {(eventLoading || accountReportLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Exchequer Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Exchequer Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Exchequer Data Export</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap">
          <h5>Select Event:</h5>
          <Row className="align-items-center mb-2">
            <Col className="w-auto">
              <ul>
                <li>
                  <div className="form-group inline combine_select mb-0">
                    <span className="label">Venue:</span>
                    <FormGroup className="flex-row flex-nowrap">
                      <FormControl className="yaer_select">
                        <Select
                          labelId="Enquiries-label"
                          id="Enquiries"
                          value={reportData.year}
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              year: e.target.value,
                            });
                          }}
                          className="select_wrap"
                        >
                          {yearsArray.map(item => {
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
                          id="event_id"
                          value={reportData.event_id}
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              event_id: e.target.value,
                            });
                          }}
                          className="select_wrap"
                        >
                          {eventListData?.length > 0 ? (
                            eventListData?.map((item, index) => {
                              return (
                                <MenuItem key={index} value={item?._id}>
                                  {item?.internal_name}
                                </MenuItem>
                              );
                            })
                          ) : (
                            <MenuItem disabled selected>
                              No Event
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </div>
                </li>
                <li>
                  <div className="form-group inline date_picker mb-0">
                    <span className="label">Start Date:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={reportData.start_date}
                        inputFormat="DD-MM-YYYY"
                        onChange={e => {
                          if (!isNaN(new Date(e).getTime()))
                            setReportData({
                              ...reportData,
                              start_date: e,
                            });
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
                        value={reportData.end_date}
                        inputFormat="DD-MM-YYYY"
                        onChange={e => {
                          if (!isNaN(new Date(e).getTime()))
                            setReportData({
                              ...reportData,
                              end_date: e,
                            });
                        }}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
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
          <ul className="pdf_link_wrap bg-white my-3 d-flex align-items-center p-0">
            {exchaquerReportList && exchaquerReportList?.length > 0 && (
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
                  to={`/reports/print/exchequer?event_id=${
                    reportData.event_id
                  }&year=${reportData?.year}&end_date=${
                    reportData?.end_date &&
                    new Date(reportData?.end_date)?.toISOString()
                  }&start_date=${
                    reportData?.start_date &&
                    new Date(reportData?.start_date)?.toISOString()
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
                    <img onClick={handlePdf} src={PdfIcon} alt="Pdf Icon" />
                  </div>
                  <div className="pdf_text">
                    <p onClick={handlePdf}>View as PDF</p>
                  </div>
                </Link>
              </li>
            </ul>
            <ExchaquerReportTable
              reportData={reportData}
              eventName={eventName}
            />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
