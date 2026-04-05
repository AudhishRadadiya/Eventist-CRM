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
import { useEffect, useMemo, useState } from 'react';
import { getDebortReportList } from 'store/reducers/Report/accountReport.slice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'Components/Common/Loader';
import { getPaginationData, getTotalPages, zeroRoundTo } from 'utils/common';
import useSortable from 'utils/useSortable';
import { getEventData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import _ from 'lodash';

let pageSize = 10;

export default function DebtorsReportTable({
  removeRow,
  setRemoveRow,
  reportData,
  eventName,
  selectedDate,
}) {
  const dispatch = useDispatch();

  const { debortReportLoading, debortReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );

  const { eventDetail } = useSelector(({ parties }) => parties);

  const [searchParams] = useSearchParams();

  const [sortConfig, setSortConfig] = useState(null);

  const isPrint = new URLSearchParams(searchParams).get('print') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    let sortableItems = [...DebtorsListData];
    if (sortConfig !== null) {
      sortableItems = _.orderBy(
        sortableItems,
        [sortConfig?.key],
        sortConfig?.direction,
      );

      setDebtorsData(sortableItems);
    }
  }, [sortConfig]);

  let reportParamData = Object.fromEntries([...searchParams]);

  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const [DebtorsListData, setDebtorsData] = useState([]);

  useEffect(() => {
    if (window.location.pathname.includes('/print')) {
      if (Object.keys(reportParamData).length > 0) {
        if (
          typeof reportParamData?.event_id === 'string' &&
          reportParamData?.event_id.length > 5
        ) {
          dispatch(getEventData(reportParamData?.event_id));
        }
        dispatch(
          getDebortReportList({
            event_id:
              reportParamData.event_id === 'All'
                ? ''
                : reportParamData.event_id,
            start_date:
              reportParamData.start_date !== ''
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
    } else if (Object.keys(reportParamData).length) {
      if (reportParamData.page) {
        setCurrentPage({ activeCurrentPage: +reportParamData.page });
      }
    }
  }, []);

  useEffect(() => {
    if (debortReportList?.length > 0) {
      setDebtorsData(debortReportList);
    }
  }, [debortReportList]);
  useEffect(() => {
    if (removeRow && debortReportList?.length > 0) {
      let newData = debortReportList?.filter(data => data?.amount > 5);
      setDebtorsData(newData);
    } else {
      setDebtorsData(debortReportList);
    }
  }, [removeRow, debortReportList]);
  const setCurrentNoteHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };
  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(debortReportList, pageSize);
    return totalActiveRecordCount;
  }, [debortReportList]);
  const activeCurrentData = useMemo(() => {
    const pageShow = isPrint ? DebtorsListData.length : pageSize;
    let currentDataList = getPaginationData(
      DebtorsListData,
      currentPage.activeCurrentPage,
      pageShow,
      totalActiveRecordPage,
      setCurrentNoteHandler,
      'activeCurrentPage',
    );

    return currentDataList;
  }, [DebtorsListData, currentPage.activeCurrentPage]);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  const { itemsActive } = useSortable(activeCurrentData);

  return (
    <>
      {debortReportLoading && <Loader />}
      {debortReportList?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Debtors Up To: :{' '}
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
                      <span onClick={() => requestSort('date')}>
                        Event Date
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSort('event_name')}>
                        Event
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSort('ref_number')}>
                        Booking Ref
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSort('agent_ref_po_no')}>
                        PO Ref
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSort('firstname')}>Name</span>
                    </TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>
                      <span onClick={() => requestSort('amount')}>Total</span>
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
                            {data?._id
                              ? moment(data?.date).format('DD/MM/YYYY')
                              : selectedDate}
                          </TableCell>
                          <TableCell>{data?.event_name}</TableCell>
                          {data?.ref_number ? (
                            <TableCell>
                              <Link
                                to={`/edit-bookings/${data?.booking_id}`}
                                state={{
                                  reportName: 'Debtors  Report',
                                }}
                              >
                                {data?.ref_number}{' '}
                              </Link>
                            </TableCell>
                          ) : (
                            <TableCell>{''}</TableCell>
                          )}
                          <TableCell>{data?.agent_ref_po_no}</TableCell>
                          <TableCell>
                            {data?.firstname || data?.surname
                              ? data?.firstname + ' ' + data?.surname
                              : ''}
                          </TableCell>
                          <TableCell>
                            <p className="description">
                              {/* {data?.notes?.length > 0
                                ? handleNotes(data?.notes)
                                : '-'} */}
                              {data?.notes ? data?.notes : ''}
                            </p>
                          </TableCell>
                          <TableCell>{zeroRoundTo(data?.amount)}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            {!isPrint && (
              <div className="table_pagination_wrap">
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          activeIndexOfLastItem,
                          debortReportList?.length,
                        )}{' '}
                        of {debortReportList?.length} entries
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
                              `/reports/debtors-report?event_id=${
                                reportParamData.event_id
                              }&start_date=${
                                reportParamData?.start_date &&
                                new Date(
                                  reportParamData?.start_date,
                                )?.toISOString()
                              }&end_date=${
                                reportParamData?.end_date &&
                                new Date(
                                  reportParamData?.end_date,
                                )?.toISOString()
                              }&page=${page}`,
                            );
                            setRemoveRow(false);
                          }}
                        />
                      </Stack>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </>
      ) : (
        'There are no debtors for the timeframe specified'
      )}
    </>
  );
}
