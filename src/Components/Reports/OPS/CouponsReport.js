import { useEffect, useState } from 'react';
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
import ReportHeader from 'Components/Common/ReportHeader';
import { getCouponsReport } from 'store/reducers/Report/opsReport.slice';
import Loader from 'Components/Common/Loader';
import { getUniqueYears } from 'utils/FieldValues';
import CouponsReportTable from './CouponsReportTable';
import { exportCouponReportPDF } from 'utils/useExportPDF';
import moment from 'moment';
import { getCouponListData } from 'store/reducers/Admin/Events/Coupon/Coupons/coupon.slice';
import PdfPopup from 'Components/Common/pdfPopup';

export default function CouponsReport() {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  // const { activeEventList, eventLoading } = useSelector(
  //   ({ parties }) => parties,
  // );
  const { activeCouponList, couponLoading } = useSelector(
    ({ coupon }) => coupon,
  );
  const { couponsReportList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );

  const uniqueYears = getUniqueYears(activeCouponList);

  const [reportData, setReportData] = useState({
    start_date: new Date(),
    coupon_id: 'All',
    year: new Date().getFullYear(),
  });
  const [pdfUrl, setPdfUrl] = useState('');
  const [isReportCheck, setIsReportCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCouponListData());
    if (Object.keys(reportParamData).length) {
      setReportData({
        coupon_id:
          reportParamData?.coupon_id === 'All'
            ? ''
            : reportParamData?.coupon_id,
        start_date: moment(new Date(reportParamData?.event_date)).format(
          'YYYY-MM-DD',
        ),
        year: reportParamData?.year,
      });

      dispatch(
        getCouponsReport({
          coupon_id:
            reportParamData?.coupon_id === 'All'
              ? ''
              : reportParamData?.coupon_id,
          start_date: moment(new Date(reportParamData?.event_date)).format(
            'YYYY-MM-DD',
          ),
          year: +reportParamData?.year,
        }),
      );
      setIsReportCheck(true);
    }
  }, []);

  const runReport = () => {
    navigate(
      `/reports/coupons-report?coupon_id=${reportData.coupon_id}&event_date=${
        reportData?.start_date &&
        new Date(reportData?.start_date)?.toISOString()
      }&year=${reportData?.year}&page=1`,
    );
    dispatch(
      getCouponsReport({
        coupon_id: reportData.coupon_id === 'All' ? '' : reportData.coupon_id,
        start_date: moment(new Date(reportData?.start_date)).format(
          'YYYY-MM-DD',
        ),
        year: reportData?.year,
      }),
    );
    setIsReportCheck(true);
  };

  const handlePdf = async () => {
    const data = await exportCouponReportPDF({
      couponsReportList,
    });
    setPdfUrl(data);
  };

  return (
    <div className="inner_wrapper">
      {(couponLoading || opsReportLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Coupons Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Coupons Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Coupons Status Report</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap">
          {/* changes event to coupon as per jenish and hardik bhai */}
          <h5>Select Coupon:</h5>
          <Row className="align-items-center mb-2">
            <Col className="w-auto" xs={5}>
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
                            navigate(`/reports/coupons-report`);
                          }}
                          defaultValue="Select"
                          className="select_wrap"
                        >
                          {uniqueYears
                            ?.sort((a, b) => a - b)
                            ?.map(item => {
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
                          value={
                            !reportData.coupon_id ? 'All' : reportData.coupon_id
                          }
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              coupon_id: e.target.value,
                            });
                            navigate(`/reports/coupons-report`);
                          }}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          <MenuItem value="All">Run all coupons</MenuItem>
                          {activeCouponList
                            ?.filter(item => {
                              return item?.year == reportData?.year;
                            })
                            ?.map((item, index) => {
                              return (
                                <MenuItem key={index} value={item?._id}>
                                  {item?.sku} - {item?.internal_name}
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
                        value={reportData.start_date}
                        inputFormat="DD-MM-YYYY"
                        onChange={newValue => {
                          if (!isNaN(new Date(newValue).getTime())) {
                            setReportData({
                              ...reportData,
                              start_date: newValue,
                            });
                            navigate(`/reports/coupons-report`);
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
              Please select a coupon and date in order to run the report
            </p>
          )}
        </div>
        {isReportCheck && (
          <>
            <ul className="pdf_link_wrap my-3 d-flex">
              <li className="me-3">
                <Link
                  to={`/reports/print/coupons-report?coupon_id=${
                    reportData.coupon_id
                  }&event_date=${
                    reportData?.start_date &&
                    new Date(reportData?.start_date)?.toISOString()
                  }&year=${reportData?.year}`}
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
            <CouponsReportTable data={couponsReportList} />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
