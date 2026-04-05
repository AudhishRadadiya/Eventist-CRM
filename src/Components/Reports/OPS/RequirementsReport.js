import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import { Button, Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEventData,
  getEventListData,
} from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getSpecialRequirements } from 'store/reducers/Report/opsReport.slice';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import ReportHeader from 'Components/Common/ReportHeader';
import { exportSpecialReqPDF } from 'utils/useExportPDF';
import RequirementsReportTable from './RequirementsReportTable';
import PdfPopup from 'Components/Common/pdfPopup';

export default function RequirementsReport() {
  const dispatch = useDispatch();

  const { activeEventList, eventDateDetail, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { specialRequirementList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );

  const [dateData, setDateData] = useState('');
  const [runReportCheck, setRunReportCheck] = useState(false);
  const [reportData, setReportData] = useState({
    event_date_id: '',
    event_id: '',
  });
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const navigate = useNavigate();

  useEffect(() => {
    setReportData({
      ...reportData,
      event_id: reportParamData?.event_id ?? activeEventList[0]?._id,
    });
    if (activeEventList[0]?._id) {
      dispatch(
        getEventData(reportParamData?.event_id ?? activeEventList[0]?._id),
      );
    }
  }, [activeEventList]);

  useEffect(() => {
    setReportData({
      ...reportData,
      event_date_id: reportParamData?.event_date_id ?? eventDateDetail[0]?._id,
    });
  }, [eventDateDetail]);

  useEffect(() => {
    dispatch(getEventListData());
    if (Object.keys(reportParamData).length) {
      dispatch(
        getSpecialRequirements({
          event_id: reportParamData?.event_id,
          event_date_id: reportParamData?.event_date_id,
        }),
      );
      setRunReportCheck(true);
      setIsReportCheck(true);
    }
  }, []);

  const eventName = activeEventList?.filter(
    item => item._id === reportData.event_id,
  );

  const runReport = () => {
    navigate(
      `/reports/requirements-report?event_id=${reportData.event_id}&event_date_id=${reportData?.event_date_id}&event_date=${dateData}`,
    );
    if (runReportCheck !== true) {
      setRunReportCheck(true);
    } else {
      dispatch(
        getSpecialRequirements({
          event_id: reportData.event_id,
          event_date_id: reportData.event_date_id,
        }),
      );
      setIsReportCheck(true);
    }
  };

  const handlePdf = async () => {
    const data = await exportSpecialReqPDF({
      specialRequirementList,
      event_date_id: dateData,
      event_id: eventName,
    });
    setPdfUrl(data);
  };

  return (
    <div className="inner_wrapper">
      {(eventLoading || opsReportLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Requirements Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Requirements Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Special Requirements Report</h4>
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
                          value={reportData.event_id}
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              event_id: e.target.value,
                            });
                            setRunReportCheck(true);
                            navigate('/reports/requirements-report');
                          }}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          {activeEventList?.map((item, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={item?._id}
                                onClick={() => {
                                  dispatch(getEventData(item?._id));
                                }}
                              >
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
                    <span className="label">Event Date:</span>
                    {runReportCheck && (
                      <FormControl fullWidth>
                        <Select
                          labelId="Event-label"
                          id="Event-select"
                          value={reportData.event_date_id}
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              event_date_id: e.target.value,
                            });
                            navigate('/reports/requirements-report');
                          }}
                          className="select_wrap"
                        >
                          {eventDateDetail?.map((item, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={item?._id}
                                onClick={() => setDateData(item?.date)}
                              >
                                {moment(item?.date).format('dddd Do MMMM YYYY')}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    )}
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
                  to={`/reports/print/requirements-report?event_id=${reportData.event_id}&event_date_id=${reportData?.event_date_id}&event_date=${dateData}`}
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
            <RequirementsReportTable
              dateData={dateData}
              eventName={eventName}
            />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
