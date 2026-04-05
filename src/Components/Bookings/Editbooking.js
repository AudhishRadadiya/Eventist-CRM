import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Button, Col, Row } from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Proactive from './Proactive';
import Reactive from './Reactive';
import { useDispatch, useSelector } from 'react-redux';
import { getUserListData } from 'store/reducers/User/user.slice';
import { getContactSourcesListDataActive } from 'store/reducers/Admin/Events/ContactSources/contactSources.slice';
import Loader from 'Components/Common/Loader';
import PdfIcon from '../../Assets/Img/pdf-icon.svg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  getEnquiriesData,
  setEnquirieDetail,
  updateEnquiries,
} from 'store/reducers/Enquiry/enquiries.slice';
import HoldDate from './HoldDate/HoldDate';
import CancelledPopup from './Notification/CancelledPopup';
import ETktInvoiceStatusPopup from './Notification/ETktInvoiceStatusPopup';

export default function EditBooking() {
  const { bookingId } = useParams();
  const { enquirieLoading, enquirieDetail } = useSelector(
    ({ enquiries }) => enquiries,
  );
  const { userPermissionDetail } = useSelector(({ user }) => user);
  const { activeUserList } = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const [value, setValue] = useState(enquirieDetail?.is_pro_active ? '1' : '2');
  const [ownerSelect, setOwnerSelect] = useState('');
  const [ownerStatus, setOwnerStatus] = useState(false);
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [pdfLoader, setPdfLoader] = useState(false);

  useEffect(() => {
    dispatch(getUserListData());
    dispatch(
      getContactSourcesListDataActive({
        is_active: true,
      }),
    );
    return () => {
      dispatch(setEnquirieDetail({}));
    };
  }, []);

  useEffect(() => {
    dispatch(getEnquiriesData(bookingId));
  }, [bookingId]);

  useEffect(() => {
    if (Object.keys(enquirieDetail).length && !enquirieDetail?.is_booking) {
      navigate(`/edit-enquiries/${bookingId}`);
    }
    setOwnerSelect(enquirieDetail.owner ? enquirieDetail.owner : '');
  }, [enquirieDetail]);

  const handleUpdateBooking = () => {
    dispatch(
      updateEnquiries({
        _id: enquirieDetail?._id,
        owner: ownerSelect === 'select' ? '' : ownerSelect,
      }),
    );
    setOwnerStatus(true);
  };
  const handleChange = (event, newValue) => setValue(newValue);

  const generatePDF = () => {
    setPdfLoader(true);
    const inputElement = document.getElementById('edit-booking-pdf-view-show');

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
        window.open(url);
        setPdfLoader(false);
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
      {(pdfLoader || enquirieLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link to="/bookings">Bookings</Link>
          <Typography>Edit booking</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <div className="d-flex justify-content-between">
          <h1>Edit booking</h1>
          {state?.reportName && <h1>Comes From {state?.reportName} </h1>}
        </div>
      </div>
      {enquirieDetail?.exclusive_booking && (
        <div className="exclusive_booking_wrap">
          <p>Exclusive Booking</p>
        </div>
      )}
      <div id="edit-booking-pdf-view-show">
        <TabContext value={value}>
          <div className="edit_booking_top_wrap bg_white_box">
            <Row className="align-items-center">
              <Col xxl={7} className="mb-2 mb-xxl-0">
                <div className="d-flex align-items-center">
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Proactive" value="1" />
                    <Tab label="Reactive" value="2" />
                  </TabList>
                  <div className="owner_select d-flex">
                    <div className="form-group inline mb-0">
                      <span className="label">Owner:</span>
                      <FormControl fullWidth>
                        <Select
                          labelId="Enquiries-label"
                          id="Enquiries"
                          value={ownerSelect}
                          onChange={event => setOwnerSelect(event.target.value)}
                          defaultValue="Select"
                          className="select_wrap"
                          disabled={
                            userPermissionDetail?.admin &&
                            userPermissionDetail?.assign
                              ? false
                              : true
                          }
                        >
                          <MenuItem value="Select" disabled>
                            Select
                          </MenuItem>
                          {activeUserList?.map(item => {
                            return (
                              <MenuItem value={item?._id} key={item?._id}>
                                {item?.public_name} ({item?.username})
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    {userPermissionDetail?.admin &&
                      userPermissionDetail?.assign && (
                        <Button
                          className="btn_border small ms-3"
                          onClick={handleUpdateBooking}
                        >
                          {ownerStatus ? 'Updated' : 'Save'}
                        </Button>
                      )}
                  </div>
                </div>
              </Col>

              {enquirieDetail?.booking_info?.provisional_places > 0 && (
                <HoldDate />
              )}
            </Row>
          </div>
          <ETktInvoiceStatusPopup />
          <CancelledPopup enquirieDetail={enquirieDetail} />
          {(Boolean(enquirieDetail?.is_payment) ||
            Boolean(enquirieDetail?.is_invoice)) &&
            enquirieDetail?.booking_info?.confirmed_places <= 0 &&
            enquirieDetail?.booking_info?.provisional_places <= 0 && (
              <div className="contact_alert_Wrap py-2 my-2">
                APPEARS TO HAVE BEEN CANCELLED - Places are at Zero
              </div>
            )}
          <div className="edit_booking_main_wrap">
            <TabPanel value="1">
              <Proactive pages="booking" />
            </TabPanel>
            <TabPanel value="2">
              <Reactive pages="booking" />
            </TabPanel>
          </div>
        </TabContext>
      </div>
      <div className="pdf_icon" onClick={generatePDF}>
        <img src={PdfIcon} alt="pdf icon" />
      </div>
    </div>
  );
}
