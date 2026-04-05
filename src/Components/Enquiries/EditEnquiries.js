import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Typography,
  Breadcrumbs,
  Tab,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Proactive from '../Bookings/Proactive';
import Reactive from '../Bookings/Reactive';
import {
  getEnquiriesData,
  setEnquirieDetail,
  updateEnquiries,
} from 'store/reducers/Enquiry/enquiries.slice';
import { getUserListData } from 'store/reducers/User/user.slice';
import { getContactSourcesListDataActive } from 'store/reducers/Admin/Events/ContactSources/contactSources.slice';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import Loader from 'Components/Common/Loader';
import CancelledPopup from 'Components/Bookings/Notification/CancelledPopup';

export default function EditEnquiries() {
  const { bookingId } = useParams();
  const { enquirieDetail, enquirieLoading } = useSelector(
    ({ enquiries }) => enquiries,
  );
  const { activeUserList } = useSelector(({ user }) => user);
  const [value, setValue] = useState('1');
  const [ownerSelect, setOwnerSelect] = useState('');
  const [ownerStatus, setOwnerStatus] = useState(false);
  const { state } = useLocation();
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => setValue(newValue);

  useEffect(() => {
    dispatch(getEnquiriesData(bookingId));
    dispatch(getUserListData());
    return () => {
      dispatch(setEnquirieDetail({}));
    };
  }, []);

  useEffect(() => {
    dispatch(
      getContactSourcesListDataActive({
        is_active: true,
      }),
    );
  }, []);

  useEffect(() => {
    setOwnerSelect(enquirieDetail?.owner ?? '');
  }, [enquirieDetail]);

  const handleUpdateEnquiries = () => {
    dispatch(
      updateEnquiries({
        _id: enquirieDetail?._id,
        owner: ownerSelect === 'select' ? '' : ownerSelect,
      }),
    );
    setOwnerStatus(true);
  };

  return (
    <div className="inner_wrapper">
      {enquirieLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link to="/enquiries">Enquiries</Link>
          <Typography>Edit Enquiries</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <div className="d-flex justify-content-between">
          <h1>Edit Enquiries</h1>
          {state?.reportName && <h1>Comes From {state?.reportName} </h1>}
        </div>
      </div>
      <TabContext value={value}>
        <div className="edit_booking_top_wrap bg_white_box">
          <Row className="align-items-center">
            <Col xxl={6} className="mb-2 mb-xxl-0">
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
                  <Button
                    className="btn_border small ms-3"
                    onClick={handleUpdateEnquiries}
                  >
                    {ownerStatus ? 'Updated' : 'Save'}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <CancelledPopup enquirieDetail={enquirieDetail} />
        <div className="edit_booking_main_wrap">
          <TabPanel value="1">
            <Proactive pages="enquiries" />
          </TabPanel>
          <TabPanel value="2">
            <Reactive pages="enquiries" />
          </TabPanel>
        </div>
      </TabContext>
    </div>
  );
}
