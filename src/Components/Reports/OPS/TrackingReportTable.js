import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getItemTracking } from 'store/reducers/Report/opsReport.slice';
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
import { zeroRoundTo } from 'utils/common';

export default function TrackingReportTable() {
  const dispatch = useDispatch();
  const { itemTrackingList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );

  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(reportParamData).length > 0)
        dispatch(
          getItemTracking({
            event_id:
              reportParamData?.event_id === 'All'
                ? ''
                : reportParamData?.event_id,
          }),
        );
  }, [dispatch]);

  return (
    <>
      {opsReportLoading && <Loader />}
      {itemTrackingList?.length > 0 ? (
        <>
          <h4 className="fw_600">Items Tracking Report</h4>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Booking#</TableCell>
                    <TableCell>Event Date</TableCell>
                    <TableCell>Venue</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Company/Contact Name</TableCell>
                    <TableCell>PO / Agent Ref</TableCell>
                    <TableCell>Balance Due</TableCell>
                    <TableCell>Items Required</TableCell>
                    <TableCell>Items Picked</TableCell>
                    <TableCell>Items Sent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemTrackingList?.length > 0 ? (
                    itemTrackingList?.map((item, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            <Link
                              to={`/edit-bookings/${item?._id}`}
                              state={{
                                reportName: 'Tracking Report',
                              }}
                            >
                              {item?.booking}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {moment(item?.date).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell>{item?.event}</TableCell>
                          <TableCell>{item?.name}</TableCell>
                          <TableCell>{item?.company_name}</TableCell>
                          <TableCell>{item?.agent_ref_po_no}</TableCell>
                          <TableCell>
                            <Link
                              to={`/edit-bookings/${item?._id}`}
                              state={{
                                reportName: 'Tracking Report',
                              }}
                              className={
                                item?.balance_due >= 1 ? 'text-danger' : ''
                              }
                            >
                              {zeroRoundTo(item?.balance_due)}
                            </Link>
                          </TableCell>
                          <TableCell>{item?.items_required}</TableCell>
                          <TableCell>{item?.items_picked}</TableCell>
                          <TableCell>{item?.items_sent}</TableCell>
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
        'There are no tracking items for the timeframe specified'
      )}
    </>
  );
}
