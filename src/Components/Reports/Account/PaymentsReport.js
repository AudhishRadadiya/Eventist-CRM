import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import ReportHeader from 'Components/Common/ReportHeader';
import PaymentReportTable from './PaymentReportTable';
import { getDailyPaymentReportList } from 'store/reducers/Report/accountReport.slice';
import { exportDailyPaymentPDF } from 'utils/useExportPDF';
import moment from 'moment';
import { showMessage } from 'store/reducers/common.slice';
import PdfPopup from 'Components/Common/pdfPopup';

export default function PaymentsReport() {
  const dispatch = useDispatch();
  const [reportData, setReportData] = useState({
    event_id: 'All',
    date: new Date(),
  });
  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { accountReportLoading, dailyPaymentReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );
  const navigate = useNavigate();
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (Object.keys(reportParamData).length > 0) {
      setReportData({
        ...reportData,
        event_id: reportParamData.event_id,
        date: reportParamData?.date,
      });
      dispatch(
        getDailyPaymentReportList({
          event_id:
            reportParamData.event_id === 'All' ? '' : reportParamData.event_id,
          date: moment(new Date(reportParamData?.date)).format('YYYY-MM-DD'),
        }),
      );
      setIsReportCheck(true);
    }
  }, []);
  useEffect(() => {
    dispatch(getEventListData());
  }, []);

  const eventName = () => {
    if (reportData.event_id === 'All') {
      return 'All';
    } else {
      let newData = activeEventList?.filter(
        item => item._id === reportData.event_id,
      );
      return newData[0]?.internal_name;
    }
  };

  const runReport = () => {
    if (!reportData?.date) {
      dispatch(showMessage({ message: 'Date Is Required.' }));
      return null;
    }
    navigate(
      `/reports/payments-report?&event_id=${reportData.event_id}&date=${
        reportData?.date && new Date(reportData?.date)?.toISOString()
      }`,
    );
    dispatch(
      getDailyPaymentReportList({
        event_id: reportData.event_id === 'All' ? '' : reportData.event_id,
        date: moment(new Date(reportData?.date)).format('YYYY-MM-DD'),
        year: reportData?.year,
      }),
    );
    setIsReportCheck(true);
  };

  const handlePdf = async () => {
    const data = await exportDailyPaymentPDF({
      dailyPaymentReportList,
      date: reportData?.date,
      event: eventName(),
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
          <Typography>Payments Report</Typography>
        </Breadcrumbs>
      </div>

      <ReportHeader name="Payments Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Daily Payments Report</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap">
          <h5>Select Event:</h5>
          <Row className="align-items-center mb-2">
            <Col className="w-auto" xs={5}>
              <ul>
                <li>
                  <div className="form-group inline combine_select mb-0">
                    <span className="label">Venue:</span>
                    <FormGroup className="flex-row flex-nowrap">
                      <FormControl className="event_select">
                        <Select
                          labelId="Enquiries-label"
                          id="Enquiries"
                          value={
                            !reportData.event_id ? 'All' : reportData.event_id
                          }
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              event_id: e.target.value,
                              date: new Date(),
                            });
                            navigate(`/reports/payments-report`);
                          }}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          <MenuItem value="All">All Venue</MenuItem>
                          {activeEventList?.map((item, index) => {
                            return (
                              <MenuItem key={index} value={item?._id}>
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={reportData.date}
                        inputFormat="DD-MM-YYYY"
                        onChange={e => {
                          if (!isNaN(new Date(e).getTime()))
                            setReportData({
                              ...reportData,
                              date: e,
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
                  to={`/reports/print/payments?&event_id=${
                    reportData.event_id
                  }&date=${
                    reportData?.date &&
                    new Date(reportData?.date)?.toISOString()
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

            <PaymentReportTable
              reportData={reportData}
              eventName={eventName()}
            />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
