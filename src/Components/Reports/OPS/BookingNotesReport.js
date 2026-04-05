import React, { useEffect, useState } from 'react';
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
import { getBookingNotes } from 'store/reducers/Report/opsReport.slice';
import Loader from 'Components/Common/Loader';
import ReportHeader from 'Components/Common/ReportHeader';
import BookingNotesReportTable from './BookingNotesReportTable';
import { exportBookingNotesReportPDF } from 'utils/useExportPDF';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DataNotFound from 'Components/Common/DataNotFound';
import PdfPopup from 'Components/Common/pdfPopup';
const pageSize = 10;

export default function BookingNotesReport() {
  const dispatch = useDispatch();

  const { activeEventList, eventLoading } = useSelector(
    ({ parties }) => parties,
  );
  const { bookingNotesList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );

  const [reportData, setReportData] = useState({
    event_id: 'All',
  });
  const [isReportCheck, setIsReportCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState('');

  const activeIndexOfLastItem = currentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;
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
      setCurrentPage(+reportParamData?.page ?? currentPage);
      dispatch(
        getBookingNotes({
          event_id:
            reportParamData?.event_id === 'All'
              ? ''
              : reportParamData?.event_id,
          start: reportParamData?.page ?? currentPage,
          limit: 10,
        }),
      );
      setIsReportCheck(true);
    }
  }, []);

  const runReport = page => {
    navigate(
      `/reports/booking-notes-report?event_id=${reportData.event_id}&page=${
        page ?? currentPage
      }`,
    );
    dispatch(
      getBookingNotes({
        event_id: reportData.event_id === 'All' ? '' : reportData.event_id,
        start: page ?? currentPage,
        limit: 10,
      }),
    );
    setIsReportCheck(true);
  };

  const handlePdf = async () => {
    const data = await exportBookingNotesReportPDF({
      bookingNotesList: bookingNotesList?.data,
      event_id: eventName,
    });
    setPdfUrl(data);
  };

  const eventName = activeEventList?.filter(
    item => item._id === reportData.event_id,
  );

  return (
    <div className="inner_wrapper">
      {(eventLoading || opsReportLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Booking Notes Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Booking Notes Report" />

      <div className="report_wrap_mian">
        <h4 className="fw_600">Booking Notes Report</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
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
                          value={
                            !reportData.event_id ? 'All' : reportData.event_id
                          }
                          onChange={e => {
                            setReportData({
                              ...reportData,
                              event_id: e.target.value,
                            });
                            setCurrentPage(1);
                            navigate(`/reports/booking-notes-report`);
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
              <Button className="btn_primary small" onClick={() => runReport()}>
                Run Report
              </Button>
            </Col>
          </Row>
          {isReportCheck === false && (
            <p className="m-0 text_light">
              Please select an event to run the report
            </p>
          )}
        </div>
        {isReportCheck && (
          <>
            <ul className="pdf_link_wrap my-3 d-flex">
              <li className="me-3">
                <Link
                  to={`/reports/print/booking-notes-report?event_id=${reportData.event_id}`}
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
            <BookingNotesReportTable eventName={eventName} />
            <div className="table_pagination_wrap">
              {bookingNotesList?.data?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {+bookingNotesList?.pageEndIndex} of{' '}
                        {bookingNotesList?.total} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={bookingNotesList?.totalPages}
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
