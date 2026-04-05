import { useCallback, useEffect, useState } from 'react';
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
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import {
  getDietaryRequirements,
  getEventDate,
} from 'store/reducers/Report/opsReport.slice';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import DietrequirementsReportTable from './DietrequirementsReportTable';
import { exportDietReqPDF } from 'utils/useExportPDF';
import ReportHeader from 'Components/Common/ReportHeader';
import PdfPopup from 'Components/Common/pdfPopup';

export default function DietrequirementsReport() {
  const dispatch = useDispatch();

  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { dietaryRequirementList, opsReportLoading, eventDateList } =
    useSelector(({ opsReport }) => opsReport);
  const navigate = useNavigate();

  const [runReportCheck, setRunReportCheck] = useState(false);
  const [reportData, setReportData] = useState({
    event_date: '',
    event_id: '',
  });

  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (activeEventList.length) {
      setReportData({
        ...reportData,
        event_id: reportParamData?.event_id ?? activeEventList[0]?._id,
      });
    }
  }, [activeEventList]);

  useEffect(() => {
    if (Object.keys(reportParamData).length) {
      if (reportParamData?.event_id) {
        if (reportParamData?.event_date) {
          dispatch(
            getDietaryRequirements({
              event_id: reportParamData?.event_id,
              event_date: reportParamData?.event_date,
            }),
          );
          setIsReportCheck(true);
          setRunReportCheck(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    setReportData({
      ...reportData,
      event_date: reportParamData?.event_date ?? eventDateList[0]?._id,
    });
  }, [eventDateList]);

  useEffect(() => {
    dispatch(getEventListData());
  }, []);

  useEffect(() => {
    if (reportData.event_id) {
      dispatch(getEventDate(reportData.event_id));
    }
  }, [reportData.event_id]);

  const eventDateOptions = useCallback(() => {
    if (eventDateList?.length > 0) {
      const sortedData = [...(eventDateList ?? [])].sort((a, b) => {
        return new Date(a?.date) - new Date(b?.date);
      });

      return sortedData?.map((item, index) => {
        return (
          <MenuItem key={index} value={item?._id}>
            {moment(item?.date).format('dddd Do MMMM YYYY')}
          </MenuItem>
        );
      });
    }
  }, [eventDateList]);

  const eventName = activeEventList?.filter(
    item => item._id === reportData.event_id,
  );

  const eventDate =
    eventDateList?.length > 0 &&
    eventDateList?.filter(item => item._id === reportData.event_date);

  const runReport = () => {
    navigate(
      `/reports/dietrequirements-report?event_id=${reportData?.event_id}&event_date=${reportData.event_date}`,
    );
    if (runReportCheck !== true) {
      setRunReportCheck(true);
    } else {
      dispatch(
        getDietaryRequirements({
          event_id: reportData?.event_id,
          event_date: reportData.event_date,
        }),
      );
      setIsReportCheck(true);
    }
  };

  const handlePdf = async () => {
    const data = await exportDietReqPDF({
      dietaryRequirementList,
      event_date: eventDate,
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
          <Typography>Diet Requirements Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Diet Requirements Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Dietary Requirements</h4>
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
                            navigate(`/reports/dietrequirements-report`);
                            setRunReportCheck(true);
                          }}
                          className="select_wrap "
                        >
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
                    <span className="label">Event Date:</span>
                    {runReportCheck && (
                      <FormGroup className="flex-row flex-nowrap">
                        <FormControl className="event_select">
                          <Select
                            labelId="Enquiries-label"
                            id="Enquiries"
                            value={reportData.event_date}
                            onChange={e => {
                              setReportData({
                                ...reportData,
                                event_date: e.target.value,
                              });
                              setRunReportCheck(true);
                            }}
                            defaultValue="Select"
                            className="select_wrap "
                          >
                            {/* {eventDateList?.length > 0 &&
                              eventDateList?.map((item, index) => {
                                return (
                                  <MenuItem key={index} value={item?._id}>
                                    {moment(item?.date).format(
                                      'dddd Do MMMM YYYY',
                                    )}
                                  </MenuItem>
                                );
                              })} */}
                            {eventDateOptions()}
                          </Select>
                        </FormControl>
                      </FormGroup>
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
        {isReportCheck ? (
          <>
            <ul className="pdf_link_wrap my-3 d-flex">
              <li className="me-3">
                <Link
                  to={`/reports/print/diet-requirements?event_id=${reportData.event_id}&event_date=${reportData?.event_date}&dateList=${eventDate[0]?.date}`}
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
            <DietrequirementsReportTable
              reportData={reportData}
              eventName={eventName}
              eventDate={eventDate}
            />
          </>
        ) : (
          ''
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
