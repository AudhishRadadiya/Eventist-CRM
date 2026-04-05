import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import { Button } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  yearsFiveYearsInThePastOneYearInTheCurrent,
  yearsFiveYearsInThePastOneYearInThePreviews,
} from 'utils/FieldValues';
import EventNumbersComparisonTable from './EventNumbersComparisonTable';
import ReportHeader from 'Components/Common/ReportHeader';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { useDispatch, useSelector } from 'react-redux';
import { getComparisonDetailReport } from 'store/reducers/Report/salesReport.slice';
import Loader from 'Components/Common/Loader';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PdfPopup from 'Components/Common/pdfPopup';

export default function EventNumbersComparisonReport() {
  const dispatch = useDispatch();

  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );

  const { salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );
  const [pdfLoader, setPdfLoader] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [reportData, setReportData] = useState({
    compare_year: new Date().getFullYear(),
    with_year: new Date().getFullYear() - 1,
    event_id: 'All',
  });

  const [isReportCheck, setIsReportCheck] = useState(false);

  useEffect(() => {
    dispatch(getEventListData());
  }, []);

  const runReport = () => {
    dispatch(
      getComparisonDetailReport({
        event_id: reportData.event_id === 'All' ? '' : reportData.event_id,
        with_year: reportData?.with_year,
        compare_year: reportData?.compare_year,
      }),
    );
    setIsReportCheck(true);
  };

  const generatePDF = () => {
    setPdfLoader(true);
    const inputElement = document.getElementById(
      'content-comparison-details-report',
    );

    if (inputElement) {
      html2canvas(inputElement).then(canvas => {
        const pageWidth = 290;
        const pageHeight = 295;
        const aspectRatio = canvas.width / canvas.height;

        const pdf = new jsPDF({
          orientation: aspectRatio > 1 ? 'l' : 'p',
          unit: 'mm',
          format: [pageWidth, pageHeight],
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth;
        const imgHeight = imgWidth / aspectRatio;
        const marginTop = 0;
        const marginBottom = 5;

        const totalPages = Math.ceil(
          (imgHeight + marginTop + marginBottom) / pageHeight,
        );

        for (let page = 1; page <= totalPages; page++) {
          if (page > 1) {
            pdf.addPage();
          }

          const offsetY = -pageHeight * (page - 1) - marginTop;
          pdf.addImage(imgData, 'PNG', 0, offsetY, imgWidth, imgHeight);

          if (page === totalPages) {
            break;
          }
        }

        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        setPdfLoader(false);
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = 'your-pdf-filename.pdf';
        downloadLink.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  return (
    <div className="inner_wrapper">
      {eventLoading || salesContactSourcesLoading || (pdfLoader && <Loader />)}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Event Numbers Comparison Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Comparison Detail Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Event Numbers Comparison Report</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <div className="event_number_comp_report">
            <ul className="mb-2">
              <li>
                <div className="form-group inline date_picker mb-0">
                  <span className="text_small white_space_nowrap me-2">
                    Compare Year:
                  </span>
                  <FormGroup className="flex-row flex-nowrap">
                    <FormControl className="event_select">
                      <Select
                        labelId="compare_year-label"
                        id="compare_year"
                        value={reportData?.compare_year}
                        onChange={e => {
                          setReportData({
                            ...reportData,
                            compare_year: e.target.value,
                          });
                        }}
                        defaultValue="Select"
                        className="select_wrap "
                      >
                        {yearsFiveYearsInThePastOneYearInTheCurrent.map(
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
                  </FormGroup>
                </div>
              </li>
              <li>
                <div className="form-group inline date_picker mb-0">
                  <span className="label">With Year:</span>
                  <FormGroup className="flex-row flex-nowrap">
                    <FormControl className="event_select">
                      <Select
                        labelId="with_year-label"
                        id="with_year"
                        name="with_year"
                        value={reportData?.with_year}
                        onChange={e => {
                          setReportData({
                            ...reportData,
                            with_year: e.target.value,
                          });
                        }}
                        defaultValue="Select"
                        className="select_wrap "
                      >
                        {yearsFiveYearsInThePastOneYearInThePreviews.map(
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
                  </FormGroup>
                </div>
              </li>
            </ul>
            <h5>Select Coupon:</h5>
            <ul className="mb-2">
              <li>
                <div className="form-group inline combine_select mb-0">
                  <span className="label">Venue:</span>
                  <FormGroup className="flex-row flex-nowrap">
                    <FormControl className="event_select">
                      <Select
                        labelId="event_id-label"
                        id="event_id"
                        name="event_id"
                        value={
                          !reportData.event_id ? 'All' : reportData.event_id
                        }
                        onChange={e => {
                          setReportData({
                            ...reportData,
                            event_id: e.target.value,
                          });
                        }}
                        defaultValue="Select"
                        className="select_wrap "
                      >
                        <MenuItem value="All">Run all event venues</MenuItem>
                        {activeEventList?.map(item => {
                          return (
                            <MenuItem value={item?._id} key={item?._id}>
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
            <Button className="btn_primary small" onClick={runReport}>
              Create Report
            </Button>
            <span className="text_small text_light ms-2">
              (This may take a minute)
            </span>
          </div>
          {isReportCheck === false && (
            <p className="mb-0 mt-2 text_light">
              Please select an event and date in order to run the report
            </p>
          )}
        </div>
        {isReportCheck && (
          <>
            <ul className="pdf_link_wrap my-3 d-flex">
              <li className="me-3">
                <Link
                  to={`/reports/print/event-numbers-comparison-report?&compare_year=${reportData.compare_year}&with_year=${reportData?.with_year}&event_id=${reportData?.event_id}`}
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
              <li className="me-3">
                <Link to="">
                  <div className="pdf_icon">
                    <img src={PdfIcon} alt="pdf Icon" />
                  </div>
                  <div className="pdf_text">
                    <p onClick={generatePDF}>View as PDF</p>
                  </div>
                </Link>
              </li>
            </ul>
            <EventNumbersComparisonTable
              with_year={reportData?.with_year}
              compare_year={reportData?.compare_year}
            />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
