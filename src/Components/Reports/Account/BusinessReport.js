import { useEffect, useState } from 'react';
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
import BusinessReportTable from './BusinessReportTable';
import { yearsThreeYearsInThePastOneYearInTheFuture } from 'utils/FieldValues';
import { useDispatch, useSelector } from 'react-redux';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import Loader from 'Components/Common/Loader';
import ReportHeader from 'Components/Common/ReportHeader';
import { getBusinessReportList } from 'store/reducers/Report/accountReport.slice';
import { exportBusinessPDF } from 'utils/useExportPDF';
import moment from 'moment';
import { showMessage } from 'store/reducers/common.slice';
import PdfPopup from 'Components/Common/pdfPopup';

export default function BusinessReport() {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const [eventName, setEventName] = useState('');
  const [reportData, setReportData] = useState({
    start_date: reportParamData?.start_date || '',
    end_date: reportParamData?.end_date || new Date(),
    event_id: '',
    year: reportParamData?.year || new Date().getFullYear(),
  });
  const [selectedDate, setSelectedDate] = useState(reportData.end_date);
  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { accountReportLoading, businessReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );
  const [businessListData, setBusinessListData] = useState({
    incomeData: [],
    outputData: [],
  });
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [active, setActive] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    dispatch(getEventListData());
  }, []);

  useEffect(() => {
    if (
      yearsThreeYearsInThePastOneYearInTheFuture?.length > 0 &&
      activeEventList?.length > 0
    ) {
      let finalyear = new Date().getFullYear();
      let activeArray = activeEventList?.filter(
        itemValue =>
          itemValue?.year ===
          (+reportData?.year || +reportParamData?.year || +finalyear),
      );
      setReportData({
        ...reportData,
        event_id: reportParamData?.event_id || activeArray[0]?._id || '',
        year: reportData?.year || reportParamData?.year || finalyear,
      });
      setActive(activeArray);
    }
  }, [activeEventList]);

  useEffect(() => {
    if (Object.entries(businessReportList)?.length > 0) {
      let incomeData = Object.entries(
        businessReportList?.groupedData?.income,
      ).map(item => {
        const businessData = item[1]?.map(item2 => {
          return {
            itemName: item2?.itemName,
            amount: item2?.amount,
          };
        });
        return {
          date: item[0],
          fullDate: item[1][0].date,
          businessData: businessData,
        };
      });

      const incomeTableRowData = incomeData[0]?.businessData;
      let finalIncomeData = [];
      for (let index = 0; index < incomeTableRowData?.length; index++) {
        const element = incomeTableRowData[index];
        let data1234 = incomeData?.map(item => {
          let itemObj = item?.businessData?.find(
            obj => obj?.itemName === element?.itemName,
          );
          if (itemObj) {
            return {
              date: item?.date,
              fullDate: item?.fullDate,
              amount: itemObj?.amount,
            };
          }
        });
        finalIncomeData.push({
          itemName: element?.itemName,
          dateWisedata: data1234,
        });
      }
      let outputData = Object.entries(
        businessReportList?.groupedData?.output,
      ).map(item => {
        const businessData = item[1]?.map(item2 => {
          return {
            itemName: item2?.itemName,
            amount: item2?.amount,
          };
        });
        return {
          date: item[0],
          fullDate: item[1][0].date,
          businessData: businessData,
        };
      });
      const outputTableRowData = outputData[0]?.businessData;
      let finalOutputData = [];
      for (let index = 0; index < outputTableRowData?.length; index++) {
        const element = outputTableRowData[index];
        let data1234 = outputData?.map(item => {
          let itemObj = item?.businessData?.find(
            obj => obj?.itemName === element?.itemName,
          );
          if (itemObj) {
            return {
              date: item?.date,
              fullDate: item?.fullDate,
              amount: itemObj?.amount,
            };
          }
        });
        finalOutputData.push({
          itemName: element?.itemName,
          dateWisedata: data1234,
        });
      }
      setBusinessListData({
        outputData: finalOutputData,
        incomeData: finalIncomeData,
      });
    }
  }, [businessReportList]);

  const runReport = () => {
    if (!reportData?.end_date) {
      dispatch(showMessage({ message: 'End Date Is Required.' }));
      return false;
    }
    if (
      (reportData?.start_date &&
        !moment(new Date(reportData?.start_date)).isValid()) ||
      !moment(new Date(reportData?.end_date)).isValid()
    ) {
      return false;
    }
    setSelectedDate(
      reportData?.end_date
        ? moment(new Date(reportData?.end_date)).format('DD/MM/YYYY')
        : moment().format('DD/MM/YYYY'),
    );
    dispatch(
      getBusinessReportList({
        event_id: reportData.event_id,
        start_date:
          reportData?.start_date !== ''
            ? moment(new Date(reportData?.start_date)).format('YYYY-MM-DD')
            : '',
        end_date: reportData?.end_date
          ? moment(new Date(reportData?.end_date)).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        year: reportData?.year,
      }),
    );
    const event = active.find(_ => _._id === reportData.event_id).internal_name;
    setEventName(event);
    setIsReportCheck(true);
  };

  const handlePdf = async () => {
    const data = await exportBusinessPDF({
      businessListData,
      date: reportData?.end_date,
      businessReportList,
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
          <Typography>Business Report</Typography>
        </Breadcrumbs>
      </div>

      <ReportHeader name="Business Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Business Done Report</h4>
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
                            let activeArray = activeEventList?.filter(
                              item => item?.year === e.target.value,
                            );
                            setReportData({
                              ...reportData,
                              year: e.target.value,
                              event_id:
                                activeArray[0]?._id ||
                                reportParamData?.event_id,
                              start_date: null,
                              end_date: new Date(),
                            });
                            setActive(activeArray);
                            setIsReportCheck(false);
                          }}
                          className="select_wrap"
                        >
                          {yearsThreeYearsInThePastOneYearInTheFuture.map(
                            item => {
                              return (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              );
                            },
                          )}
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
                          {active?.map((item, index) => {
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
                    <div>
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
                  to={`/reports/print/business?event_id=${
                    reportData.event_id
                  }&start_date=${
                    reportData?.start_date &&
                    new Date(reportData?.start_date)?.toISOString()
                  }&end_date=${
                    reportData?.end_date &&
                    new Date(reportData?.end_date)?.toISOString()
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
            <BusinessReportTable
              reportData={reportData}
              eventName={eventName}
              selectedDate={selectedDate}
            />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
