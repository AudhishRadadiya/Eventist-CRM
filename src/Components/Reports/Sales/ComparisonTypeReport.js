import { useEffect, useMemo, useState } from 'react';
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
import ReportHeader from 'Components/Common/ReportHeader';
import ComparisonTypeReportTable from './ComparisonTypeReportTable';
import { useDispatch, useSelector } from 'react-redux';
import {
  getComparisonTypeReport,
  getSalesWeekNumbers,
} from 'store/reducers/Report/salesReport.slice';
import Loader from 'Components/Common/Loader';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { yearsThreeYearsInThePastOneYearInTheCurrent } from 'utils/FieldValues';
import PdfPopup from 'Components/Common/pdfPopup';

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};

export default function ComparisonTypeReport() {
  const dispatch = useDispatch();

  const { salesWeekNumberList, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );

  const [pdfLoader, setPdfLoader] = useState(false);
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const [reportData, setReportData] = useState({
    year: new Date().getFullYear(),
    type: 0, // 0 for week and 1 for year
    week_number: '',
  });

  const weekDetails = useMemo(() => {
    return salesWeekNumberList?.find(i => i.label === reportData?.week_number);
  }, [reportData?.week_number]);

  const weekOptions = useMemo(() => {
    return salesWeekNumberList?.map(week => ({
      label: week?.label,
      value: week?.label,
    }));
  }, [salesWeekNumberList]);

  const handleChange = e => {
    const { name, value } = e.target;
    setReportData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateReport = () => {
    let payload = {
      type: reportData?.type,
      year: reportData?.year,
      week_number_date: weekDetails?.week1,
    };
    dispatch(getComparisonTypeReport(payload));
    setIsReportCheck(true);
  };

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
        compare_year: reportData?.year,
      }),
    );
  }, [reportData?.year]);

  const generatePDF = () => {
    setPdfLoader(true);
    const inputElement = document.getElementById(
      'content-comparison-type-report',
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
      {salesContactSourcesLoading && <Loader />}
      {pdfLoader && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Comparison Type Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Comparison Type Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Event Numbers Comparison by Booking Type</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <h5>Select Event:</h5>
          <div className="comparision_report_wrap">
            <ul className="m-0">
              <li>
                <div className="form-group inline date_picker mb-0">
                  <span className="label white_space_nowrap">Year:</span>
                  <FormGroup className="w-auto">
                    <FormControl className="event_select">
                      <Select
                        labelId="year-label"
                        id="year"
                        name="year"
                        value={reportData?.year}
                        onChange={handleChange}
                        defaultValue="Select"
                        className="select_wrap "
                      >
                        {/* <MenuItem value="Select">Select</MenuItem> */}
                        {yearsThreeYearsInThePastOneYearInTheCurrent?.map(
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
                <div className="form-group inline combine_select  mb-0">
                  <span className="label white_space_nowrap">Week Number:</span>
                  <FormGroup className="w-auto">
                    <FormControl className="event_select">
                      <Select
                        labelId="week1-label"
                        id="week1"
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
              <li>
                <div className="form-group inline date_picker mb-0">
                  <FormGroup className="w-auto">
                    <FormControl className="event_select">
                      <Select
                        labelId="week2-label"
                        id="week2"
                        name="type"
                        value={reportData?.type}
                        onChange={handleChange}
                        defaultValue="Select"
                        className="select_wrap "
                      >
                        <MenuItem value={0}>Weekly</MenuItem>
                        <MenuItem value={1}>Yearly</MenuItem>
                      </Select>
                    </FormControl>
                  </FormGroup>
                </div>
              </li>
            </ul>
            <Button
              className="btn_primary small ms-3 mb-0"
              onClick={handleCreateReport}
            >
              Create Report
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
                  to={`/reports/print/comparison-type-report?&year=${reportData.year}&type=${reportData?.type}&week_number_date=${weekDetails?.date}&week1=${weekDetails?.week1}&week2=${weekDetails?.week2}&label=${weekDetails?.label}`}
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
            <ComparisonTypeReportTable week={weekDetails} />
          </>
        )}
      </div>
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
