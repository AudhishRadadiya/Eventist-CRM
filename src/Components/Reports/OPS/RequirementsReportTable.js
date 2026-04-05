import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getSpecialRequirements } from 'store/reducers/Report/opsReport.slice';
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

export default function RequirementsReportTable({ eventName, dateData }) {
  const dispatch = useDispatch();
  const { specialRequirementList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );
  const { eventDetail } = useSelector(({ parties }) => parties);

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(reportParamData).length > 0)
        dispatch(
          getSpecialRequirements({
            event_id: reportParamData?.event_id,
            event_date_id: reportParamData?.event_date_id,
          }),
        );
  }, [dispatch]);

  useEffect(() => {
    if (reportParamData?.event_id) {
      dispatch(getEventData(reportParamData?.event_id));
    }
  }, [reportParamData?.event_id]);

  return (
    <>
      {opsReportLoading && <Loader />}
      {specialRequirementList?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Drink Order summary for :{' '}
            {reportParamData?.event_date
              ? moment(reportParamData?.event_date).format('DD/MM/YYYY')
              : moment(new Date(dateData)).format('DD/MM/YYYY')}
          </h4>
          <h4 className="fw_600">
            At :{' '}
            {reportParamData?.event_id
              ? eventDetail?.internal_name
                ? eventDetail?.internal_name
                : eventName[0]?.internal_name ?? ''
              : eventName[0]?.internal_name}
          </h4>

          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Booking</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Company/Contact Name</TableCell>
                    <TableCell>PO / Agent Ref</TableCell>
                    <TableCell>Venue Notes</TableCell>
                    <TableCell>Public Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {specialRequirementList?.length > 0 ? (
                    specialRequirementList?.map((item, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            <Link
                              to={`/edit-bookings/${item?.booking_id}`}
                              state={{
                                reportName: 'Requirements Report',
                              }}
                            >
                              {item?.booking_ref}
                            </Link>
                          </TableCell>
                          <TableCell>{item?.name}</TableCell>
                          <TableCell>{item?.company_name}</TableCell>
                          <TableCell>{item?.po_agent_ref}</TableCell>
                          <TableCell>{item?.venue}</TableCell>
                          <TableCell>{item?.public}</TableCell>
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
      ) : (
        'There are no drinks or products ordered for the timeframe specified'
      )}
    </>
  );
}
