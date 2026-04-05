import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPartyFeedback } from 'store/reducers/Report/opsReport.slice';
import moment from 'moment';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Loader from 'Components/Common/Loader';
import DataNotFound from 'Components/Common/DataNotFound';

export default function PartyFeedbackReportTable() {
  const dispatch = useDispatch();
  const { partyFeedbackList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );
  const location = useLocation();

  useEffect(() => {
    if (location?.pathname?.includes('print')) {
      dispatch(getPartyFeedback());
    }
  }, [dispatch, location]);

  return (
    <>
      {opsReportLoading && <Loader />}
      <div className="table_main_Wrapper mb-3" id="party-feedback-report">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Booking Reference</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Telephone</TableCell>
                <TableCell>Venue</TableCell>
                <TableCell>Party Date</TableCell>
                <TableCell>Guest Or Organiser </TableCell>
                <TableCell>Number of Guests</TableCell>
                <TableCell>Star Rating</TableCell>
                <TableCell>Venue Rating</TableCell>
                <TableCell>Cloakroom Rating</TableCell>
                <TableCell>Toilet Rating</TableCell>
                <TableCell>Security Rating</TableCell>
                <TableCell>Bar Service Rating</TableCell>
                <TableCell>Meal Quality Rating</TableCell>
                <TableCell>Entertainment Rating</TableCell>
                <TableCell>Casino Rating </TableCell>
                <TableCell>Dodgems Rating</TableCell>
                <TableCell>Staff Rating</TableCell>
                <TableCell>Coffee Rating</TableCell>
                <TableCell>Canapes Rating</TableCell>
                <TableCell>Cheese Rating</TableCell>
                <TableCell>Tokens Rating</TableCell>
                <TableCell>Other Rating </TableCell>
                <TableCell>Improvements</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell>Anything</TableCell>
                <TableCell>Good news</TableCell>
                <TableCell>Specific issue</TableCell>
                <TableCell>Complaint</TableCell>
                <TableCell>Resolved</TableCell>
                <TableCell>Manager Details</TableCell>
                <TableCell>What else</TableCell>
                <TableCell>org name</TableCell>
                <TableCell>On call</TableCell>
                <TableCell>Case resolved</TableCell>
                <TableCell>Compensation</TableCell>
                <TableCell>Opt in</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partyFeedbackList?.length > 0 ? (
                partyFeedbackList?.map((item, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        {item?.firstname + ' ' + item?.lastname}
                      </TableCell>
                      <TableCell>{item?.bookingid}</TableCell>
                      <TableCell>{item?.email}</TableCell>
                      <TableCell>{item?.company}</TableCell>
                      <TableCell>{item?.telephone}</TableCell>
                      <TableCell>{item?.party_venue}</TableCell>
                      <TableCell>
                        {moment(item?.party_date).format('YYYY-MM-DD hh:mm:ss')}
                      </TableCell>
                      <TableCell>{item?.party_guest}</TableCell>
                      <TableCell>{item?.total_guests}</TableCell>
                      <TableCell>{item?.preparty}</TableCell>
                      <TableCell>{item?.venue}</TableCell>
                      <TableCell>{item?.cloakroom}</TableCell>
                      <TableCell>{item?.toilets}</TableCell>
                      <TableCell>{item?.security}</TableCell>
                      <TableCell>{item?.barservice}</TableCell>
                      <TableCell>{item?.mealquality}</TableCell>
                      <TableCell>{item?.entertainment}</TableCell>
                      <TableCell>{item?.casino}</TableCell>
                      <TableCell>{item?.dodgems}</TableCell>
                      <TableCell>{item?.staff}</TableCell>
                      <TableCell>{item?.coffee}</TableCell>
                      <TableCell>{item?.canapes}</TableCell>
                      <TableCell>{item?.cheese}</TableCell>
                      <TableCell>{item?.tokens}</TableCell>
                      <TableCell>{item?.other}</TableCell>
                      <TableCell>{item?.improvements}</TableCell>
                      <TableCell>{item?.comments}</TableCell>
                      <TableCell>
                        {moment(item?.updated).format('YYYY-MM-DD hh:mm:ss')}
                      </TableCell>
                      <TableCell>{item?.anything}</TableCell>
                      <TableCell>{item?.goodnews}</TableCell>
                      <TableCell>{item?.specific_issue}</TableCell>
                      <TableCell>{item?.complaint}</TableCell>
                      <TableCell>{item?.resolve}</TableCell>
                      <TableCell>{item?.manager}</TableCell>
                      <TableCell>{item?.whatelse}</TableCell>
                      <TableCell>{item?.orgname}</TableCell>
                      <TableCell>{item?.call}</TableCell>
                      <TableCell>{item?.case}</TableCell>
                      <TableCell>{item?.comp}</TableCell>
                      <TableCell>{item?.optin}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <DataNotFound />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
