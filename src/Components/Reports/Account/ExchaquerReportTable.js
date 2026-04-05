import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import DataNotFound from 'Components/Common/DataNotFound';
import { getExchequerReportList } from 'store/reducers/Report/accountReport.slice';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { zeroRoundTo } from 'utils/common';

export default function ExchaquerReportTable({ eventName, reportData }) {
  const dispatch = useDispatch();

  const { accountReportLoading, exchaquerReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );

  const { activeEventList } = useSelector(({ parties }) => parties);
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (Object.keys(reportParamData).length > 0) {
      dispatch(getEventListData());
      dispatch(
        getExchequerReportList({
          year: new Date().getFullYear(),
          event_id: reportParamData.report_event,
          start_date: moment(reportParamData?.report_end_date)
            .startOf('week')
            .format('YYYY-MM-DD'),
          end_date: reportParamData?.report_end_date,
        }),
      );
    }
  }, []);

  const eventNameDetail = activeEventList?.filter(
    item => item._id === reportParamData?.event_id,
  );

  return (
    <>
      {accountReportLoading && <Loader />}
      {exchaquerReportList?.length > 0 ? (
        <>
          <h4>
            Exchequer Data -{' '}
            {reportParamData?.event_id
              ? eventNameDetail[0]?.internal_name
              : eventName[0]?.internal_name}
          </h4>
          <h5>
            Week Ending:{' '}
            {reportParamData?.end_date
              ? moment(reportParamData?.end_date).format('DD/MM/YYYY')
              : moment(new Date(reportData.end_date)).format('DD/MM/YYYY')}
          </h5>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={14} className="text-center">
                      Business Done Report -{' '}
                      {reportParamData?.event_id
                        ? eventNameDetail[0]?.internal_name
                        : eventName[0]?.internal_name}{' '}
                      - Week Ending:{' '}
                      {reportParamData?.end_date
                        ? moment(reportParamData?.end_date).format('DD/MM/YYYY')
                        : moment(new Date(reportData.end_date)).format(
                            'DD/MM/YYYY',
                          )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {exchaquerReportList?.length > 0 ? (
                    exchaquerReportList?.map((items, i) => {
                      return Object.values(items)?.map(item => {
                        if (item?.cost_centre)
                          return (
                            <TableRow key={i}>
                              <TableCell>{item?.cost_centre}</TableCell>
                              <TableCell>{item?.cost_centre_2}</TableCell>
                              <TableCell>{item?.end_date}</TableCell>
                              <TableCell>{item?.CASH01}</TableCell>
                              <TableCell>{item?.sri}</TableCell>
                              <TableCell>{item?.payment_option}</TableCell>
                              <TableCell>{item?.gl_code}</TableCell>
                              <TableCell>{item?.type}</TableCell>
                              <TableCell>{item?.s_and_z}</TableCell>
                              <TableCell>{item?.hundred}</TableCell>
                              <TableCell>{item?.cost_centre_3}</TableCell>
                              <TableCell>{zeroRoundTo(item?.total)}</TableCell>
                              <TableCell>{item?.payment_created_at}</TableCell>
                              <TableCell>{item?.e_and_i}</TableCell>
                              <TableCell>{item?.Y_and_N}</TableCell>
                            </TableRow>
                          );
                      });
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
        'There are no exchequer data for the timeframe specified'
      )}
    </>
  );
}
