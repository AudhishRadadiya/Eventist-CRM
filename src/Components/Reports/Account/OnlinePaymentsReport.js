import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import { Button, Col, Row } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import OnlinePaymentReportTable from './OnlinePaymentReportTable';
import ReportHeader from 'Components/Common/ReportHeader';
import { getDailyOnlinePaymentReportList } from 'store/reducers/Report/accountReport.slice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import { exportOnlinePaymentPDF } from 'utils/useExportPDF';
import { showMessage } from 'store/reducers/common.slice';
import PdfPopup from 'Components/Common/pdfPopup';

export default function OnlinePaymentsReport() {
  const dispatch = useDispatch();

  const { dailyOnlinePaymentReportList, accountReportLoading } = useSelector(
    ({ accountReport }) => accountReport,
  );

  const [date, setDate] = useState(new Date());
  const [isReportCheck, setIsReportCheck] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (Object.keys(reportParamData).length) {
      setDate(reportParamData.date);
      const dateValue = moment(new Date(reportParamData.date)).format(
        'YYYY-MM-DD',
      );
      navigate(
        `/reports/online-payments-report?date=${new Date(
          reportParamData.date,
        ).toISOString()}`,
      );
      dispatch(
        getDailyOnlinePaymentReportList({
          date: dateValue,
        }),
      );
      setIsReportCheck(true);
    }
  }, []);

  const handlePdf = async () => {
    const data = await exportOnlinePaymentPDF({
      dailyOnlinePaymentReportList,
    });
    setPdfUrl(data);
  };

  const runReport = () => {
    if (!date) {
      dispatch(showMessage({ message: 'Date Is Required.' }));
      return null;
    }
    const dateValue = moment(new Date(date)).format('YYYY-MM-DD');
    navigate(
      `/reports/online-payments-report?date=${new Date(date).toISOString()}`,
    );
    dispatch(
      getDailyOnlinePaymentReportList({
        date: dateValue,
      }),
    );
    setIsReportCheck(true);
  };

  return (
    <div className="inner_wrapper">
      {accountReportLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Online Payments Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Online Payments Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Daily Online Payment Totals</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap">
          <h5>Select Event:</h5>
          <Row className="align-items-center mb-2">
            <Col xs={3} className="w-auto">
              <ul>
                <li>
                  <div className="form-group inline date_picker mb-0">
                    <span className="label">Date:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={date}
                        inputFormat="DD-MM-YYYY"
                        onChange={newValue => {
                          if (!isNaN(new Date(newValue).getTime())) {
                            setDate(newValue);
                            navigate(`/reports/online-payments-report`);
                          }
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
              Please select date to run the report
            </p>
          )}
        </div>
        {isReportCheck && (
          <>
            <ul className="pdf_link_wrap my-3 d-flex">
              <li className="me-3">
                <Link
                  to={`/reports/print/online-payments-report?date=${
                    date && new Date(date)?.toISOString()
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

            <OnlinePaymentReportTable />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
