import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getDietaryRequirements } from 'store/reducers/Report/opsReport.slice';
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

export default function DietrequirementsReportTable({ eventName, eventDate }) {
  const dispatch = useDispatch();
  const { dietaryRequirementList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );
  const { eventDetail } = useSelector(({ parties }) => parties);

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(reportParamData).length > 0) {
        dispatch(getEventData(reportParamData?.event_id));
        dispatch(
          getDietaryRequirements({
            event_id: reportParamData?.event_id,
            event_date: reportParamData.event_date,
          }),
        );
      }
  }, []);
  return (
    <>
      {opsReportLoading && <Loader />}
      {dietaryRequirementList?.dietary?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Dietary Requirements Summary for :{' '}
            {reportParamData?.dateList
              ? moment(reportParamData?.dateList).format('DD/MM/YYYY')
              : moment(new Date(eventDate[0]?.date)).format('DD/MM/YYYY')}
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
                    <TableCell>Company/Contact Name</TableCell>
                    <TableCell>Dairy Free</TableCell>
                    <TableCell>Gluten Free</TableCell>
                    <TableCell>Halal</TableCell>
                    <TableCell>Nut Allergy</TableCell>
                    <TableCell>Vegan</TableCell>
                    <TableCell>Vegetarian</TableCell>
                    <TableCell>Wheelchair User</TableCell>
                    <TableCell>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dietaryRequirementList?.dietary?.length > 0 ? (
                    dietaryRequirementList?.dietary?.map((item, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            <Link
                              to={`/edit-bookings/${item?.booking_id}`}
                              state={{
                                reportName:
                                  'Dietary Requirements Summary Report',
                              }}
                            >
                              {item?.ref_number}
                            </Link>
                          </TableCell>
                          <TableCell>{item?.company_or_contact_name}</TableCell>
                          <TableCell>{item?.['Dairy Free']}</TableCell>
                          <TableCell>{item?.['Gluten Free']}</TableCell>
                          <TableCell>{item?.['Halal']}</TableCell>
                          <TableCell>{item?.['Nut Allergy']}</TableCell>
                          <TableCell>{item?.['Vegan']}</TableCell>
                          <TableCell>{item?.['Vegetarian']}</TableCell>
                          <TableCell>{item?.['Wheelchair User']}</TableCell>
                          <TableCell>{item?.['note']}</TableCell>
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
          <h4 className="fw_600">Totals</h4>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Requirement Name</TableCell>
                    <TableCell> Total Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dietaryRequirementList?.total?.length > 0 ? (
                    dietaryRequirementList?.total?.map(item => {
                      return (
                        <TableRow key={item?._id}>
                          <TableCell>{item?.req_name}</TableCell>
                          <TableCell>{item?.qty}</TableCell>
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
        'There are no coupons items for the timeframe specified'
      )}
    </>
  );
}
