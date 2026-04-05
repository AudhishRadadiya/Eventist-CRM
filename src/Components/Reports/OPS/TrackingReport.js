import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import { Button, Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getItemTracking } from 'store/reducers/Report/opsReport.slice';
import Loader from 'Components/Common/Loader';
import ReportHeader from 'Components/Common/ReportHeader';
import TrackingReportTable from './TrackingReportTable';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { exportItemTrackingPDF } from 'utils/useExportPDF';
import PdfPopup from 'Components/Common/pdfPopup';

export default function TrackingReport() {
  const dispatch = useDispatch();

  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { itemTrackingList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );

  const [reportData, setReportData] = useState({
    event_id: 'All',
  });

  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getEventListData());
    if (Object.keys(reportParamData).length) {
      setReportData({
        event_id:
          reportParamData?.event_id === 'All' ? '' : reportParamData?.event_id,
      });
      dispatch(
        getItemTracking({
          event_id:
            reportParamData?.event_id === 'All'
              ? ''
              : reportParamData?.event_id,
        }),
      );
    }
    setIsReportCheck(true);
  }, []);

  const runReport = () => {
    navigate(`/reports/tracking-report?event_id=${reportData.event_id}`);
    dispatch(
      getItemTracking({
        event_id: reportData.event_id === 'All' ? '' : reportData.event_id,
      }),
    );
    setIsReportCheck(true);
  };

  const downloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const momentFormat = 'DD/MM/YYYY HH:mm:ss';
    let date = new Date();
    workbook.created = date;
    workbook.modified = date;
    const worksheet = workbook.addWorksheet('My Sheet', {});
    worksheet.getRow(1).values = ['Created', moment(date).format(momentFormat)];
    if (Object.keys(itemTrackingList).length > 0) {
      worksheet.getRow(2).values = [
        'Booking',
        'Event Date',
        'Venue',
        'Name',
        'Company/Contact Name',
        'PO / Agent Ref',
        'Balance Due',
        'Items Required',
        'Items Picked',
        'Items Sent',
      ];

      worksheet.getRow(2).font = {
        bold: true,
      };

      worksheet.columns = [
        { key: '_id', width: 17 },
        { key: 'date', width: 17 },
        { key: 'event', width: 17 },
        { key: 'name', width: 17 },
        { key: 'company_name', width: 17 },
        { key: 'agent_ref_po_no', width: 17 },
        { key: 'balance_due', width: 17 },
        { key: 'items_required', width: 17 },
        { key: 'items_picked', width: 17 },
        { key: 'items_sent', width: 17 },
      ];

      itemTrackingList?.forEach(data => {
        worksheet.addRow({
          _id: JSON.stringify(data.booking),
          date: moment(data.date).format('DD/MM/YYYY'),
          event: data.event,
          name: data.name,
          company_name: data.company_name,
          agent_ref_po_no: data.agent_ref_po_no,
          balance_due: data.balance_due?.toFixed(2),
          items_required: data.items_required,
          items_picked: data.items_picked,
          items_sent: data.items_sent,
        });
      });
    }

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `Tracking_Report_${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
      );
    });
  };

  const handlePdf = async () => {
    const data = await exportItemTrackingPDF({
      itemTrackingList,
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
          <Typography>Tracking Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Tracking Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Item Tracking Report</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <h5>Select Event:</h5>
          <Row className="align-items-center mb-2">
            <Col className="w-auto col-4">
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
                            navigate(`/reports/tracking-report`);
                          }}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          <MenuItem value="All">Run all event venues</MenuItem>
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
              Please select an event to run the report
            </p>
          )}

          {isReportCheck && (
            <>
              <ul className="pdf_link_wrap bg-white my-3 d-flex align-items-center p-0">
                <li className="me-3">
                  <h5 className="m-0">Download the Report:</h5>
                </li>
                <li className="me-3">
                  <span
                    className="d-flex align-items-center cursor-pointer"
                    onClick={() => {
                      downloadExcel();
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
                <li className="me-3">
                  <p className="m-0">
                    - Created:{' '}
                    {moment(new Date()).format('MMMM DD YYYY HH:MM:SS')}
                  </p>
                </li>
              </ul>
              <ul className="pdf_link_wrap my-3 d-flex">
                <li className="me-3">
                  <Link
                    to={`/reports/print/tracking-report?event_id=${reportData.event_id}`}
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
            </>
          )}
        </div>
        <TrackingReportTable />
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
