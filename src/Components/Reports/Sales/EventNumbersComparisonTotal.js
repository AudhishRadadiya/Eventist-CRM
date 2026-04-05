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

import ReportHeader from 'Components/Common/ReportHeader';
import EventNumbersComparisonTotalTable from './EventNumbersComparisonTotalTable';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEventNumbersComparisonTotals,
  getSalesWeekNumbers,
} from 'store/reducers/Report/salesReport.slice';
import Loader from 'Components/Common/Loader';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import PdfPopup from 'Components/Common/pdfPopup';

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};
export default function EventNumbersComparison() {
  const dispatch = useDispatch();
  const { salesWeekNumberList, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );
  const [pdfLoader, setPdfLoader] = useState(false);
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [reportData, setReportData] = useState({
    compare_year: new Date().getFullYear(),
    with_year: new Date().getFullYear() - 1,
    week_number: '',
  });
  let weekDetails = salesWeekNumberList?.filter(
    i => i.label === reportData?.week_number,
  )[0];

  const weekOptions = salesWeekNumberList?.map(week => ({
    label: week?.label,
    value: week?.label,
  }));

  const handleChange = e => {
    const { name, value } = e.target;
    setReportData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateReport = () => {
    let payload = {
      compare_year: reportData?.compare_year,
      with_year: reportData?.with_year,
      week_number: moment(weekDetails?.date, 'DD.MM.YYYY').format('YYYY-MM-DD'),
    };
    dispatch(getEventNumbersComparisonTotals(payload));
    setIsReportCheck(true);
  };

  // useEffect(() => {
  //   if (weekOptions[0]?.value) {
  //     setReportData(prevState => ({
  //       ...prevState,
  //       week_number: weekOptions[0]?.value,
  //     }));
  //   }
  // }, [weekOptions[0]?.value]);

  useEffect(() => {
    if (salesWeekNumberList.length) {
      let weekData = salesWeekNumberList.find(
        _ => _.week1 === new Date().getWeek(),
      );
      setReportData(prevState => ({
        ...prevState,
        week_number: weekData.label,
      }));
    }
  }, [salesWeekNumberList]);

  useEffect(() => {
    dispatch(
      getSalesWeekNumbers({
        compare_year: reportData?.compare_year,
      }),
    );
  }, [reportData?.compare_year]);

  const generatePDF = () => {
    setPdfLoader(true);
    const inputElement = document.getElementById(
      'content-comparison-total-report',
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
          precision: 16, // Set a higher precision
          dpi: 300, // Set a higher DPI
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
        // setPdfLoader(false);
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        const pdfFileName = 'your-pdf-filename.pdf';
        downloadLink.download = pdfFileName;
        downloadLink.click();
        URL.revokeObjectURL(url);
        setPdfLoader(false);
      });
    }
  };
  return (
    <div className="inner_wrapper">
      {salesContactSourcesLoading && pdfLoader && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Event Numbers Comparison Totals</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Comparison Totals Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Event Numbers Comparison Totals</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <h5>Select Event:</h5>
          <div className="event_number_filter_wrap">
            <ul className="mb-0 me-3">
              <li>
                <div className="form-group inline combine_select mb-0">
                  <span className="label white_space_nowrap">
                    Compare Year:
                  </span>
                  <FormGroup className="w-auto">
                    <FormControl className="event_select">
                      <Select
                        labelId="compare_year-label"
                        id="compare_year"
                        name="compare_year"
                        value={reportData?.compare_year}
                        onChange={handleChange}
                        defaultValue="Select"
                        className="select_wrap "
                      >
                        {yearsFiveYearsInThePastOneYearInTheCurrent?.map(
                          item => {
                            return (
                              <MenuItem value={item} key={item}>
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
                  <span className="label white_space_nowrap">With Year:</span>
                  <FormGroup className="w-auto">
                    <FormControl className="event_select">
                      <Select
                        labelId="with_year-label"
                        id="with_year"
                        name="with_year"
                        value={reportData?.with_year}
                        onChange={handleChange}
                        defaultValue="Select"
                        className="select_wrap "
                      >
                        {yearsFiveYearsInThePastOneYearInThePreviews?.map(
                          item => {
                            return (
                              <MenuItem value={item} key={item}>
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
                  <span className="label white_space_nowrap">Week Number:</span>
                  <FormGroup className="w-auto">
                    <FormControl className="event_select">
                      <Select
                        labelId="week_number-label"
                        id="week_number"
                        name="week_number"
                        value={reportData?.week_number}
                        onChange={handleChange}
                        defaultValue="Select"
                        className="select_wrap "
                      >
                        {weekOptions?.map((item, index) => {
                          return (
                            <MenuItem value={item?.value} key={index}>
                              {item?.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </FormGroup>
                </div>
              </li>
            </ul>
            <Button
              className="btn_primary small mb-0"
              onClick={handleCreateReport}
            >
              {' '}
              Create Report{' '}
            </Button>
            <span className="text_small text_light ms-2">
              (This may take a minute)
            </span>
          </div>
        </div>
        {isReportCheck && (
          <>
            <ul className="pdf_link_wrap my-3 d-flex">
              <li className="me-3">
                <Link
                  to={`/reports/print/event-numbers-comparison-totals?compare_year=${reportData.compare_year}&with_year=${reportData?.with_year}&week_number=${weekDetails?.date}&week=${weekDetails?.week2}&label=${weekDetails?.label}`}
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
                <Link>
                  <div className="pdf_icon">
                    <img src={PdfIcon} alt="pdf Icon" />
                  </div>
                  <div className="pdf_text">
                    <p onClick={generatePDF}>View as PDF</p>
                  </div>
                </Link>
              </li>
            </ul>
            <EventNumbersComparisonTotalTable
              week={weekDetails}
              date={reportData}
            />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
