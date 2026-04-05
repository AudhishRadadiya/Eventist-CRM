import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { useEffect, useMemo, useState } from 'react';
import { getTransactionExportReportList } from 'store/reducers/Report/accountReport.slice';
import {
  getPaginationData,
  getTotalPages,
  totalCount,
  zeroRoundTo,
} from 'utils/common';
import useSortable from 'utils/useSortable';
import { getEventData } from 'store/reducers/Admin/Events/Parties/parties.slice';

let pageSize = 10;
export default function TransactionExportReportTable({
  reportData,
  eventName,
}) {
  const { accountReportLoading, transactionExportReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );

  const { eventDetail } = useSelector(({ parties }) => parties);

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  // const isPrint = new URLSearchParams(searchParams).get('print') === 'true';
  let reportParamData = Object.fromEntries([...searchParams]);

  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;
  const navigate = useNavigate();

  useEffect(() => {
    if (
      typeof reportParamData?.event_id === 'string' &&
      reportParamData?.event_id.length > 5
    ) {
      dispatch(getEventData(reportParamData?.event_id));
    }
  }, [reportParamData?.event_id]);

  useEffect(() => {
    if (window.location.pathname.includes('/print')) {
      if (Object.keys(reportParamData).length > 0) {
        dispatch(
          getTransactionExportReportList({
            event_id:
              reportParamData.event_id === 'All'
                ? ''
                : reportParamData.event_id,
            start_date: moment(new Date(reportParamData?.start_date)).format(
              'YYYY-MM-DD',
            ),
            end_date: moment(new Date(reportParamData?.end_date)).format(
              'YYYY-MM-DD',
            ),
          }),
        );
      }
    } else if (Object.keys(reportParamData).length) {
      if (reportParamData.page) {
        setCurrentPage({ activeCurrentPage: +reportParamData.page });
      }
    }
  }, []);

  const setCurrentNoteHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      transactionExportReportList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [transactionExportReportList]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      transactionExportReportList,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentNoteHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [transactionExportReportList, currentPage.activeCurrentPage]);

  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);

  return (
    <>
      {accountReportLoading && <Loader />}
      {transactionExportReportList?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Transactions Up To :{' '}
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
                      <span onClick={() => requestSortActive('date')}>
                        Payment Time
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('date')}>
                        Payment ID
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
                        Contact Firstname
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('surname')}>
                        Contact Surname
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('company_name')}>
                        Contact Company
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('type')}>
                        Transaction Type
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('method')}>
                        Payment Method
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('amount')}>
                        Payment Amount
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('surcharge')}>
                        Payment Surcharge
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('total')}>
                        Payment Total
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('info')}>
                        Payment Info
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('notes')}>
                        Payment Notes
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {moment(new Date()).format('YYYY-MM-DD')}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {totalCount(itemsActive, 'amount')?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {totalCount(itemsActive, 'surcharge')?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {totalCount(itemsActive, 'total')?.toFixed(2)}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  {itemsActive &&
                    itemsActive?.length > 0 &&
                    itemsActive?.map((data, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            {moment(data?.date).format('YYYY-MM-DD HH:mm:ss')}
                          </TableCell>
                          <TableCell>{data?.payment_id}</TableCell>
                          <TableCell>{data?.event}</TableCell>
                          <TableCell>
                            <Link
                              to={`/edit-bookings/${data?.booking_id}`}
                              state={{
                                reportName: 'Transactions Export Report',
                              }}
                            >
                              {data?.ref_number}
                            </Link>
                          </TableCell>
                          <TableCell>{data?.firstname}</TableCell>
                          <TableCell>{data?.surname}</TableCell>
                          <TableCell>{data?.company_name}</TableCell>
                          <TableCell>
                            {data?.type === 1 ? 'Deposit' : 'Balance'}
                          </TableCell>
                          <TableCell>{data?.method}</TableCell>
                          <TableCell>{zeroRoundTo(data?.amount)}</TableCell>
                          <TableCell>{data?.surcharge?.toFixed(2)}</TableCell>
                          <TableCell>{zeroRoundTo(data?.total)}</TableCell>
                          <TableCell>{data?.info}</TableCell>
                          <TableCell>{data?.notes}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            {/* {!isPrint && ( */}
            <div className="table_pagination_wrap">
              <Row className="g-0 align-items-center my-2">
                <Col sm={6}>
                  <div className="total_entry">
                    <p className="m-0">
                      Showing {activeIndexOfFirstItem + 1} to{' '}
                      {Math.min(
                        activeIndexOfLastItem,
                        transactionExportReportList?.length,
                      )}{' '}
                      of {transactionExportReportList?.length} entries
                    </p>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="pagination_wrap">
                    <Stack spacing={2}>
                      <Pagination
                        count={totalActiveRecordPage}
                        page={currentPage.activeCurrentPage}
                        onChange={(e, page) => {
                          setCurrentPage({
                            ...currentPage,
                            activeCurrentPage: page,
                          });
                          navigate(
                            `/reports/transactions-export?event_id=${
                              reportParamData.event_id
                            }&start_date=${
                              reportParamData?.start_date &&
                              new Date(
                                reportParamData?.start_date,
                              )?.toISOString()
                            }&end_date=${
                              reportParamData?.end_date &&
                              new Date(reportParamData?.end_date)?.toISOString()
                            }&page=${page}`,
                          );
                        }}
                      />
                    </Stack>
                  </div>
                </Col>
              </Row>
            </div>
            {/* )} */}
          </div>
        </>
      ) : (
        'There are no transactions export for the timeframe specified'
      )}
    </>
  );
}
