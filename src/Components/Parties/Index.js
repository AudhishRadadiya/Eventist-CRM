import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import PdfIcon from '../../Assets/Img/pdf-icon.svg';
import EventDashboard from './EventDashboard';
import { useDispatch, useSelector } from 'react-redux';
import { withoutEventEnquiresList } from 'store/reducers/Enquiry/Parties/enquireParties.slice';
import Loader from 'Components/Common/Loader';
import { yearsArray } from 'utils/FieldValues';
import UnAssignEnquiries from './UnAssignEnquiries';
import EventsList from './EventsList';

export default function Parties() {
  const { year } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { withoutEventPartiesList, withoutEventPartiesLoading } = useSelector(
    ({ enquireParties }) => enquireParties,
  );
  const [searchVenue, setSearchVenue] = useState('');
  const [exclusive, setExclusive] = useState(false);
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const params = {};
    for (const [key, value] of searchParams) params[key] = value;
    if (Object?.keys(params)?.length > 0) setSearchVenue(params);
    else setSearchVenue(''); // Reset the TABLE data if query params null
    dispatch(
      withoutEventEnquiresList({
        event_id: params?.event_id ? params?.event_id : '',
        search: '',
        date: false,
      }),
    );
  }, [location.search]);

  const handleExclusive = flag => setExclusive(flag);

  return (
    <div className="inner_wrapper">
      {withoutEventPartiesLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          {!(searchVenue || year) ? (
            <Typography>Parties</Typography>
          ) : (
            <Link to="/parties" onClick={() => setSearchVenue('')}>
              Parties
            </Link>
          )}
          {(searchVenue || year) && <Typography>Event Dashboard</Typography>}
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <h1>Events Dashboard</h1>
      </div>
      <div className="parties_main_wrap parties_main_flex_wrap">
        <div className="parties_left_main_wrap">
          <EventsList handleExclusive={handleExclusive} />
        </div>
        <div className="parties_right_main_wrap">
          {searchVenue || year ? (
            <EventDashboard
              searchVenue={searchVenue}
              withoutEventPartiesList={withoutEventPartiesList}
              year={year}
              exclusive={exclusive}
              handleExclusive={handleExclusive}
            />
          ) : (
            <>
              <UnAssignEnquiries />
              <div className="years_number_Wrap mb-3">
                <h4 className="fw_600">This Years' Numbers</h4>
                <p>Click the PDF icon to view as PDF</p>
                <ul className="pdf_link_wrap">
                  <li>
                    <Link to={`/location-event-data/All`} target="_blank">
                      <div className="pdf_icon">
                        <img src={PdfIcon} alt="pdf icon" />
                      </div>
                      <div className="pdf_text">
                        <p>View booking numbers for all events here</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="years_number_Wrap mb-3">
                <h4 className="fw_600">Previous Years' Numbers</h4>
                <p>Click the PDF icon to view as PDF</p>
                <ul className="pdf_link_wrap">
                  {yearsArray
                    ?.slice(0)
                    .reverse()
                    .map((preYear, index) => {
                      return (
                        <li key={index}>
                          <Link
                            to={`/location-event-data/${preYear}`}
                            target="_blank"
                          >
                            <div className="pdf_icon">
                              <img src={PdfIcon} alt="pdf icon" />
                            </div>
                            <div className="pdf_text">
                              <p>
                                View booking numbers for all events from{' '}
                                {preYear}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
