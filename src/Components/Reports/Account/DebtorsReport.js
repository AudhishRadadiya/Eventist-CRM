import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
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
import DebtorsReportTable from './DebtorsReportTable';
import { useDispatch, useSelector } from 'react-redux';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import Loader from 'Components/Common/Loader';
import { getDebortReportList } from 'store/reducers/Report/accountReport.slice';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import ReportHeader from 'Components/Common/ReportHeader';
import { exportDebortsPDF } from 'utils/useExportPDF';
import { showMessage } from 'store/reducers/common.slice';
import { zeroRoundTo } from 'utils/common';
import PdfPopup from 'Components/Common/pdfPopup';

export default function DebtorsReport() {
  const dispatch = useDispatch();

  const [reportData, setReportData] = useState({
    start_date: '',
    end_date: new Date(),
    event_id: 'All',
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [removeRow, setRemoveRow] = useState(false);

  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { accountReportLoading, debortReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const navigate = useNavigate();

  const totalCount = (data, key) => {
    return data.reduce((sum, cuurent) => {
      if (Object.keys(cuurent).includes(key)) {
        return sum + Number(cuurent[key]);
      } else {
        return sum;
      }
    }, 0);
  };
  useEffect(() => {
    dispatch(getEventListData());
    if (Object.keys(reportParamData).length) {
      setSelectedDate(
        moment(new Date(reportParamData?.end_date)).format('DD/MM/YYYY'),
      );
      setReportData({
        event_id:
          reportParamData.event_id === 'All' ? '' : reportParamData.event_id,
        start_date: reportParamData?.start_date,
        end_date: reportParamData?.end_date,
      });
      dispatch(
        getDebortReportList({
          event_id:
            reportParamData.event_id === 'All' ? '' : reportParamData.event_id,
          start_date:
            reportParamData.start_date !== ''
              ? moment(new Date(reportParamData?.start_date)).format(
                  'YYYY-MM-DD',
                )
              : '',
          end_date: moment(new Date(reportParamData?.end_date)).format(
            'YYYY-MM-DD',
          ),
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
  const downloadexcel = () => {
    const workbook = new ExcelJS.Workbook();
    const momentFormat = 'DD/MM/YYYY HH:mm:ss';
    let date = new Date();
    workbook.created = date;
    workbook.modified = date;
    const worksheet = workbook.addWorksheet('My Sheet', {});
    worksheet.getRow(1).values = ['Created', moment(date).format(momentFormat)];
    worksheet.getRow(2).values = [
      'Event Date',
      'Event',
      'Booking Ref',
      'PO Ref',
      'Name',
      'Notes',
      'Total',
    ];

    worksheet.getRow(2).font = {
      bold: true,
    };

    worksheet.columns = [
      { key: 'date', width: 17 },
      { key: 'event_name', width: 17 },
      { key: 'ref_number', width: 17 },
      { key: 'agent_ref_po_no', width: 17 },
      { key: 'firstname', width: 17 },
      { key: 'notes', width: 17 },
      { key: 'amount', width: 17 },
    ];

    debortReportList?.forEach(data => {
      worksheet.addRow({
        date: moment(data.date).format('DD/MM/YYYY'),
        event_name: data.event_name,
        ref_number: data.ref_number,
        agent_ref_po_no: data.agent_ref_po_no,
        firstname: `${data.firstname ? data.firstname : ''} ${
          data.surname ? data.surname : ''
        } `,

        notes: data?.notes
          ? data.notes?.map(
              item =>
                `${moment(item?.hold_date).format('DD/MM/YYYY')} - ${
                  item?.subject
                }`,
            )
          : '',
        amount: zeroRoundTo(data?.amount),
      });
    });

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `Debtors_Report_${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
      );
    });
  };

  const runReport = () => {
    if (!reportData?.end_date) {
      dispatch(showMessage({ message: 'End Date Is Required.' }));
      return null;
    }
    navigate(
      `/reports/debtors-report?event_id=${reportData.event_id}&start_date=${
        reportData?.start_date &&
        new Date(reportData?.start_date)?.toISOString()
      }&end_date=${
        reportData?.end_date && new Date(reportData?.end_date)?.toISOString()
      }&page=1`,
    );

    setSelectedDate(
      moment(new Date(reportData?.end_date)).format('DD/MM/YYYY'),
    );
    dispatch(
      getDebortReportList({
        event_id: reportData.event_id === 'All' ? '' : reportData.event_id,
        start_date:
          reportData.start_date !== ''
            ? moment(new Date(reportData?.start_date)).format('YYYY-MM-DD')
            : '',
        end_date: moment(new Date(reportData?.end_date)).format('YYYY-MM-DD'),
      }),
    );
    setIsReportCheck(true);
  };

  const handlePdf = async () => {
    const data = await exportDebortsPDF({
      debortReportList,
      date: reportData?.end_date,
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
          <Typography>Debtors Report</Typography>
        </Breadcrumbs>
      </div>

      <ReportHeader name="Debtors Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Debtors List</h4>
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
                              start_date: null,
                              end_date: new Date(),
                            });
                            setIsReportCheck(false);
                            navigate(`/reports/debtors-report`);
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
                            navigate(`/reports/debtors-report`);
                          }
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
                            navigate(`/reports/debtors-report`);
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
          <ul className="pdf_link_wrap bg-white my-3 d-flex align-items-center p-0">
            {debortReportList && debortReportList.length > 0 && (
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
            <Row className="align-items-center mb-3">
              <Col className="text-end">
                <Button
                  className="btn_primary small"
                  onClick={() => {
                    setRemoveRow(!removeRow);
                  }}
                >
                  {removeRow === false ? 'Remove Rows Below £5' : 'UNDO'}
                </Button>
              </Col>
            </Row>

            <ul className="pdf_link_wrap my-3 d-flex">
              <li className="me-3">
                <Link
                  to={`/reports/print/debtors?print=true&event_id=${
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
                  <div className="pdf_icon">
                    <img onClick={handlePdf} src={PdfIcon} alt="pdf Icon" />
                  </div>
                  <div className="pdf_text">
                    <p onClick={handlePdf}>View as PDF</p>
                  </div>
                </Link>
              </li>
            </ul>

            <DebtorsReportTable
              removeRow={removeRow}
              setRemoveRow={setRemoveRow}
              eventName={eventName()}
              reportData={reportData}
              selectedDate={selectedDate}
            />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
