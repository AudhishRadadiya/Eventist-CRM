import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCouponsReport } from 'store/reducers/Report/opsReport.slice';
import moment from 'moment';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Loader from 'Components/Common/Loader';
import { Col, Row } from 'react-bootstrap';
import { getPaginationData, getTotalPages } from 'utils/common';
import useSortable from 'utils/useSortable';

let pageSize = 10;

export default function CouponsReportTable({ eventName, reportData, data }) {
  const dispatch = useDispatch();

  const { couponsReportList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );

  const [searchParams] = useSearchParams();
  const isPrint = new URLSearchParams(searchParams).get('print') === 'true';
  let reportParamData = Object.fromEntries([...searchParams]);

  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const [couponListData, setCouponListData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.length > 0 || couponsReportList?.length > 0) {
      setCouponListData(data || couponsReportList);
    }
  }, [couponsReportList, data]);

  useEffect(() => {
    if (window.location.pathname.includes('/print')) {
      if (Object.keys(reportParamData).length > 0)
        dispatch(
          getCouponsReport({
            coupon_id:
              reportParamData?.coupon_id === 'All'
                ? ''
                : reportParamData?.coupon_id,
            start_date: moment(new Date(reportParamData?.event_date)).format(
              'YYYY-MM-DD',
            ),
            year: reportParamData?.year,
          }),
        );
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
      couponsReportList || data,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [couponsReportList, data]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      couponListData,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentNoteHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [couponListData, currentPage.activeCurrentPage]);

  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);

  return (
    <>
      {opsReportLoading && <Loader />}
      {couponsReportList?.length > 0 || couponsReportList?.length > 0 ? (
        <>
          <h4 className="fw_600">
            Total Coupons Used {data?.length || couponsReportList?.length}
          </h4>
          <div className="table_main_Wrapper mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('coupon_name')}>
                        Coupon
                      </span>
                    </TableCell>
                    <TableCell>Booking Ref</TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('party_date')}>
                        Party Date
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('party')}>
                        Party
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortActive('provisional_places')}
                      >
                        Prov Places
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortActive('confirmed_places')}
                      >
                        Conf Places
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('end_date')}>
                        End Date
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          requestSortActive('deposits_required_by')
                        }
                      >
                        Deposit Required By Date
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('accepted_date')}>
                        Accepted Date
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('processed_date')}>
                        Processed Date
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsActive &&
                    itemsActive?.length > 0 &&
                    itemsActive?.map((data, i) => {
                      return (
                        <TableRow>
                          <TableCell>{data?.coupon_name}</TableCell>
                          <TableCell>
                            <Link
                              to={`/edit-bookings/${data?.booking_id}`}
                              state={{
                                reportName: 'Coupons Status Report',
                              }}
                            >
                              {data?.booking_ref}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {data?.party_date
                              ? moment(data?.party_date).format('DD/MM/YYYY')
                              : ''}
                          </TableCell>
                          <TableCell>{data?.party}</TableCell>
                          <TableCell>{data?.provisional_places}</TableCell>
                          <TableCell>
                            <span className="text_success">
                              {data?.confirmed_places}
                            </span>
                          </TableCell>
                          <TableCell>
                            {data?.end_date
                              ? moment(data?.end_date).format('DD/MM/YYYY')
                              : ''}
                          </TableCell>
                          <TableCell>
                            {data?.deposits_required_by
                              ? moment(data?.deposits_required_by).format(
                                  'DD/MM/YYYY',
                                )
                              : ''}
                          </TableCell>
                          <TableCell>
                            {data?.accepted_date
                              ? moment(data?.accepted_date).format('DD/MM/YYYY')
                              : ''}
                          </TableCell>
                          <TableCell>
                            {data?.processed_date
                              ? moment(data?.processed_date).format(
                                  'DD/MM/YYYY',
                                )
                              : ''}
                          </TableCell>
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
                          data?.length || couponsReportList?.length,
                        )}{' '}
                        of {data?.length || couponsReportList?.length} entries
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
                              `/reports/coupons-report?coupon_id=${reportParamData.coupon_id}&event_date=${reportParamData?.event_date}&year=${reportParamData?.year}&page=${page}`,
                            );
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
        'There are no coupons items for the timeframe specified'
      )}
    </>
  );
}
