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
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import DepositeReportTable from './DepositeReportTable';
import ReportHeader from 'Components/Common/ReportHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getDepositReportList } from 'store/reducers/Report/accountReport.slice';
import Loader from 'Components/Common/Loader';
import { exportDepositPDF } from 'utils/useExportPDF';
import moment from 'moment';
import DataNotFound from 'Components/Common/DataNotFound';
import axios from 'axios';
import { showMessage } from 'store/reducers/common.slice';
import PdfPopup from 'Components/Common/pdfPopup';

const pageSize = 10;

export default function DepositsReport() {
  const dispatch = useDispatch();
  const [reportData, setReportData] = useState({
    start_date: '',
    end_date: new Date(),
    event_id: 'All',
  });
  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { accountReportLoading, depositReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const navigate = useNavigate();
  const activeIndexOfLastItem = currentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  useEffect(() => {
    dispatch(getEventListData());
    if (Object.keys(reportParamData).length) {
      setReportData({
        event_id:
          reportParamData.event_id === 'All' ? '' : reportParamData.event_id,
        start_date:
          reportParamData?.start_date !== ''
            ? moment(new Date(reportParamData?.start_date)).format('YYYY-MM-DD')
            : '',
        end_date: moment(new Date(reportParamData?.end_date)).format(
          'YYYY-MM-DD',
        ),
      });
      setCurrentPage(+reportParamData.page ?? currentPage);

      dispatch(
        getDepositReportList({
          event_id:
            reportParamData.event_id === 'All' ? '' : reportParamData.event_id,
          start_date:
            reportParamData?.start_date !== ''
              ? moment(new Date(reportParamData?.start_date)).format(
                  'YYYY-MM-DD',
                )
              : '',
          end_date: moment(new Date(reportParamData?.end_date)).format(
            'YYYY-MM-DD',
          ),
          start: reportParamData.page ?? currentPage,
          limit: 10,
        }),
      );
      setIsReportCheck(true);
    }
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

  const runReport = page => {
    navigate(
      `/reports/deposits-report?event_id=${reportData.event_id}&start_date=${
        reportData?.start_date &&
        new Date(reportData?.start_date)?.toISOString()
      }&end_date=${
        reportData?.end_date && new Date(reportData?.end_date)?.toISOString()
      }&page=${page ?? currentPage}`,
    );
    dispatch(
      getDepositReportList({
        event_id: reportData.event_id === 'All' ? '' : reportData.event_id,
        start_date:
          reportData?.start_date !== ''
            ? moment(new Date(reportData?.start_date)).format('YYYY-MM-DD')
            : '',
        end_date: reportData?.end_date
          ? moment(new Date(reportData?.end_date)).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        start: page ?? currentPage,
        limit: 10,
      }),
    );
    setIsReportCheck(true);
  };

  const viewPDF = () => {
    setLoader(true);
    axios
      .post(`admin/report/deposits_list`, {
        event_id: reportData.event_id === 'All' ? '' : reportData.event_id,
        start_date:
          reportData?.start_date !== ''
            ? moment(new Date(reportData?.start_date)).format('YYYY-MM-DD')
            : '',
        end_date: moment(new Date(reportData?.end_date)).format('YYYY-MM-DD'),
      })
      .then(async res => {
        setLoader(false);
        if (res.data.err === 0) {
          if (res.data.data) {
            const data = await exportDepositPDF({
              depositReportList: res.data.data.data,
              date: reportData?.end_date,
              event: eventName(),
            });
            setPdfUrl(data);
          } else {
          }
        } else {
          dispatch(showMessage({ message: res.data.msg }));
        }
      })
      .catch(error => {
        setLoader(false);
        dispatch(showMessage({ message: error.response.data.msg }));
      });
  };

  return (
    <div className="inner_wrapper">
      {(eventLoading || accountReportLoading || loader) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Deposits Report</Typography>
        </Breadcrumbs>
      </div>

      <ReportHeader name="Deposits Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Deposits List</h4>
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
                          labelId="Enquiries-label"
                          id="Enquiries"
                          value={
                            !reportData.event_id ? 'All' : reportData.event_id
                          }
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              event_id: e.target.value,
                            });
                            setCurrentPage(1);
                            navigate(`/reports/deposits-report`);
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
                    <span className="label">Start Date:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={reportData.start_date}
                        inputFormat="DD-MM-YYYY"
                        onChange={e => {
                          if (!isNaN(new Date(e).getTime())) {
                            setReportData({
                              ...reportData,
                              start_date: e,
                            });
                            navigate(`/reports/deposits-report`);
                          }
                          setCurrentPage(1);
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
                          if (!isNaN(new Date(e).getTime())) {
                            setReportData({
                              ...reportData,
                              end_date: e,
                            });
                            navigate(`/reports/deposits-report`);
                          }
                          setCurrentPage(1);
                        }}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                </li>
              </ul>
            </Col>
            <Col>
              <Button className="btn_primary small" onClick={() => runReport()}>
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
                  to={`/reports/print/deposite?print=true&event_id=${
                    reportData.event_id
                  }&start_date=${
                    reportData?.start_date &&
                    new Date(reportData?.start_date)?.toISOString()
                  }&end_date=${
                    reportData?.end_date &&
                    new Date(reportData?.end_date)?.toISOString()
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
                  <div
                    className="pdf_icon"
                    onClick={() => {
                      viewPDF();
                    }}
                  >
                    <img src={PdfIcon} alt="pdf Icon" />
                  </div>
                  <div className="pdf_text">
                    <p
                      onClick={() => {
                        viewPDF();
                      }}
                    >
                      View as PDF
                    </p>
                  </div>
                </Link>
              </li>
            </ul>
            <DepositeReportTable
              eventName={eventName()}
              reportData={reportData}
            />
            <div className="table_pagination_wrap">
              {depositReportList.data?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {activeIndexOfFirstItem +
                          depositReportList?.data?.length -
                          1}{' '}
                        of {depositReportList?.total} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={depositReportList?.totalPages}
                          page={currentPage}
                          onChange={(e, page) => {
                            setCurrentPage(page);
                            runReport(page);
                          }}
                        />
                      </Stack>
                    </div>
                  </Col>
                </Row>
              ) : (
                <DataNotFound />
              )}
            </div>
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
