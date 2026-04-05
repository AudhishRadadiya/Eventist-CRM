import React, { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDepositReportList } from 'store/reducers/Report/accountReport.slice';
import useSortable from 'utils/useSortable';
import moment from 'moment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Loader from 'Components/Common/Loader';
import { getEventData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { zeroRoundTo } from 'utils/common';

export default function DepositeReportTable({ reportData, eventName }) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { accountReportLoading, depositReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );
  const { eventDetail } = useSelector(({ parties }) => parties);

  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (
      typeof reportParamData?.event_id === 'string' &&
      reportParamData?.event_id.length > 5
    ) {
      dispatch(getEventData(reportParamData?.event_id));
    }
  }, [reportParamData?.event_id]);

  useEffect(() => {
    if (window.location.pathname.includes('/print'))
      if (Object.keys(reportParamData).length > 0) {
        dispatch(
          getDepositReportList({
            event_id:
              reportParamData.event_id === 'All'
                ? ''
                : reportParamData.event_id,
            start_date:
              reportParamData?.start_date !== ''
                ? moment(new Date(reportParamData?.start_date)).format(
                    'YYYY-MM-DD',
                  )
                : '',
            end_date: moment(new Date(reportParamData?.end_date)).format(
              'YYYY-MM-DD',
            ),
          }),
        );
      }
  }, []);
  const activeCurrentData = useMemo(() => {
    if (Object.entries(depositReportList).length > 0) {
      return depositReportList.data;
    } else {
      return [];
    }
  }, [depositReportList]);
  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);
  return (
    <>
      {accountReportLoading && <Loader />}
      {depositReportList?.data?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Deposits Received up to :{' '}
            {reportParamData?.end_date
              ? moment(reportParamData?.end_date).format('DD/MM/YYYY')
              : moment(new Date(reportData.end_date)).format('DD/MM/YYYY')}
          </h4>
          <h4 className="fw_600">
            For :{' '}
            {eventName
              ? eventName
                ? eventName
                : 'All'
              : eventDetail?.internal_name ?? 'All'}
          </h4>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('event_date')}>
                        Event Date
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('event')}>
                        Event
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('ref_number')}>
                        Booking Ref
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('firstname')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('company_name')}>
                        Company/Contact Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('date')}>
                        Total
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsActive &&
                    itemsActive?.length > 0 &&
                    itemsActive?.map((data, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            {data?.event_date
                              ? moment(data?.event_date).format('DD/MM/YYYY')
                              : ''}
                          </TableCell>
                          <TableCell>{data?.event}</TableCell>
                          <TableCell>
                            <Link
                              to={`/edit-bookings/${data?._id}`}
                              state={{
                                reportName: 'Deposits Report',
                              }}
                            >
                              {data?.ref_number}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {' '}
                            {data?.firstname
                              ? data?.firstname
                              : '' + ' ' + data?.surname
                              ? data?.surname
                              : ''}
                          </TableCell>
                          <TableCell>{data?.company_name}</TableCell>
                          <TableCell>{zeroRoundTo(data?.total)}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        'There are no deposit for the timeframe specified'
      )}
    </>
  );
}
