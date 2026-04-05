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
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getComparisonTypeReport } from 'store/reducers/Report/salesReport.slice';

const ComparisonTypeReportTable = ({ week }) => {
  const dispatch = useDispatch();

  const { salesContactSourcesLoading, salesComparisonTypeReport } = useSelector(
    ({ salesReport }) => salesReport,
  );

  const [searchParams] = useSearchParams();
  let comparisonTotalsReportData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (Object.keys(comparisonTotalsReportData).length > 0) {
      let payload = {
        type: Number(comparisonTotalsReportData?.type),
        year: Number(comparisonTotalsReportData?.year),
        week_number_date: moment(
          comparisonTotalsReportData?.week_number_date,
          'M.D.YYYY',
        ).format('YYYY-MM-DD'),
      };
      dispatch(getComparisonTypeReport(payload));
    }
  }, [dispatch]);

  let eventData;
  salesComparisonTypeReport?.updatedEventData?.map(item => {
    eventData = item;
  });

  let totalData;
  salesComparisonTypeReport?.totals?.map(item => {
    totalData = item;
  });

  return (
    <>
      {salesContactSourcesLoading && <Loader />}
      <div id="content-comparison-type-report">
        <h4 className="fw_600">
          Event Numbers Comparison by Booking Type: Week{' '}
          {comparisonTotalsReportData?.week1
            ? comparisonTotalsReportData?.week1
            : week?.week1}{' '}
          /{' '}
          {comparisonTotalsReportData?.week2
            ? comparisonTotalsReportData?.week2
            : week?.week2}{' '}
          Weeks
          <span className="fw_500 d-block">
            For week #
            {comparisonTotalsReportData?.label
              ? comparisonTotalsReportData?.label
              : week?.label}
          </span>
        </h4>
        {salesComparisonTypeReport?.updatedEventData?.length > 0 ? (
          <>
            <div className="table_design_two mb-3">
              <TableContainer component={Paper} id="content-to-convert">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        Created: {moment(new Date()).format('Do MMM YYYY')}
                      </TableCell>
                      <TableCell colSpan={4}>Bookings</TableCell>
                      <TableCell colSpan={4}>Places</TableCell>
                      <TableCell colSpan={4}>Potential Revenue</TableCell>
                      <TableCell colSpan={4}>Targets</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Venue</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>
                        {eventData?.past_year ? eventData?.past_year : 0}
                      </TableCell>
                      <TableCell>
                        {eventData?.curr_year ? eventData?.curr_year : 0}
                      </TableCell>
                      <TableCell>+/-</TableCell>
                      <TableCell>%</TableCell>
                      <TableCell>
                        {eventData?.past_year ? eventData?.past_year : 0}
                      </TableCell>
                      <TableCell>
                        {eventData?.curr_year ? eventData?.curr_year : 0}
                      </TableCell>
                      <TableCell>+/-</TableCell>
                      <TableCell>%</TableCell>
                      <TableCell>
                        {eventData?.past_year ? eventData?.past_year : 0}
                      </TableCell>
                      <TableCell>
                        {eventData?.curr_year ? eventData?.curr_year : 0}
                      </TableCell>
                      <TableCell>+/-</TableCell>
                      <TableCell>%</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Target</TableCell>
                      <TableCell>+/-</TableCell>
                      <TableCell>%</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {salesComparisonTypeReport?.updatedEventData?.map(item => (
                      <>
                        {item.venueData.map((detail, index) => (
                          <TableRow key={index}>
                            {index === 0 && (
                              <TableCell rowSpan={item.venueData.length}>
                                {item.Venue}
                              </TableCell>
                            )}
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color: detail?.type === 'TOTAL' ? 'white' : '',
                              }}
                            >
                              {detail?.type}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color: detail?.type === 'TOTAL' ? 'white' : '',
                              }}
                            >
                              {detail?.bookingYear1}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color: detail?.type === 'TOTAL' ? 'white' : '',
                              }}
                            >
                              {detail?.bookingYear2}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color:
                                  detail?.type === 'TOTAL' &&
                                  +detail?.bookingChange > 0
                                    ? 'green'
                                    : detail?.type === 'TOTAL' &&
                                      +detail?.bookingChange < 0
                                    ? 'red'
                                    : detail?.type !== 'TOTAL'
                                    ? ''
                                    : 'white',
                              }}
                            >
                              {detail?.bookingChange}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color:
                                  detail?.type === 'TOTAL' &&
                                  +detail?.bookingChangePert > 0
                                    ? 'green'
                                    : detail?.type === 'TOTAL' &&
                                      +detail?.bookingChangePert < 0
                                    ? 'red'
                                    : detail?.type !== 'TOTAL'
                                    ? ''
                                    : 'white',
                              }}
                            >
                              {detail?.bookingChangePert
                                ? detail?.bookingChangePert
                                : 0}
                              %
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color: detail?.type === 'TOTAL' ? 'white' : '',
                              }}
                            >
                              {detail?.placeYear1}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color: detail?.type === 'TOTAL' ? 'white' : '',
                              }}
                            >
                              {detail?.placeYear2}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color:
                                  detail?.type === 'TOTAL' &&
                                  +detail?.bookingChangePert > 0
                                    ? 'green'
                                    : detail?.type === 'TOTAL' &&
                                      +detail?.bookingChangePert < 0
                                    ? 'red'
                                    : detail?.type !== 'TOTAL'
                                    ? ''
                                    : 'white',
                              }}
                            >
                              {detail?.placeChange}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color:
                                  detail?.type === 'TOTAL' &&
                                  +detail?.bookingChangePert > 0
                                    ? 'green'
                                    : detail?.type === 'TOTAL' &&
                                      +detail?.bookingChangePert < 0
                                    ? 'red'
                                    : detail?.type !== 'TOTAL'
                                    ? ''
                                    : 'white',
                              }}
                            >
                              {detail?.placeChangePert
                                ? detail?.placeChangePert
                                : 0}
                              %
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color: detail?.type === 'TOTAL' ? 'white' : '',
                              }}
                            >
                              £{detail?.revYear1?.toFixed(2)}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color: detail?.type === 'TOTAL' ? 'white' : '',
                              }}
                            >
                              £{detail?.revYear2?.toFixed(2)}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color:
                                  detail?.type === 'TOTAL' &&
                                  +detail?.bookingChangePert > 0
                                    ? 'green'
                                    : detail?.type === 'TOTAL' &&
                                      +detail?.bookingChangePert < 0
                                    ? 'red'
                                    : detail?.type !== 'TOTAL'
                                    ? ''
                                    : 'white',
                              }}
                            >
                              £{detail?.revChange}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  detail?.type === 'TOTAL' ? '#454545' : '',
                                color:
                                  detail?.type === 'TOTAL' &&
                                  +detail?.bookingChangePert > 0
                                    ? 'green'
                                    : detail?.type === 'TOTAL' &&
                                      +detail?.bookingChangePert < 0
                                    ? 'red'
                                    : detail?.type !== 'TOTAL'
                                    ? ''
                                    : 'white',
                              }}
                            >
                              {detail?.revChangePert
                                ? detail?.revChangePert
                                : 0}
                              %
                            </TableCell>
                            {index === 0 && (
                              <TableCell rowSpan={item.venueData.length}>
                                {item.owner}
                              </TableCell>
                            )}
                            {index === 0 && (
                              <TableCell rowSpan={item.venueData.length}>
                                {item.target}
                              </TableCell>
                            )}
                            {index === 0 && (
                              <TableCell rowSpan={item.venueData.length}>
                                <div>
                                  <span className="d-block">
                                    {item.targetChange}
                                  </span>
                                </div>
                                {item.targetChange}
                              </TableCell>
                            )}
                            {index === 0 && (
                              <TableCell rowSpan={item.venueData.length}>
                                <div className="d-flex flex-column">
                                  <div className="d-block">
                                    {item?.targetChangePer
                                      ? item?.targetChangePer
                                      : 0}
                                    %
                                  </div>
                                  <div className="d-block mt-auto">
                                    {item?.targetChangePerTotal
                                      ? item?.targetChangePerTotal
                                      : 0}
                                    %
                                  </div>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <h4 className="fw_600">Totals</h4>
            <div className="table_design_two mb-3">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell colSpan={4}>Bookings</TableCell>
                      <TableCell colSpan={4}>Places</TableCell>
                      <TableCell colSpan={4}>Potential Revenue</TableCell>
                      <TableCell colSpan={4}>Targets</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>
                        {totalData?.past_year ? totalData?.past_year : 0}
                      </TableCell>
                      <TableCell>
                        {totalData?.curr_year ? totalData?.curr_year : '-'}
                      </TableCell>
                      <TableCell>+/-</TableCell>
                      <TableCell>%</TableCell>
                      <TableCell>
                        {totalData?.past_year ? totalData?.past_year : '-'}
                      </TableCell>
                      <TableCell>
                        {totalData?.curr_year ? totalData?.curr_year : '-'}
                      </TableCell>
                      <TableCell>+/-</TableCell>
                      <TableCell>%</TableCell>
                      <TableCell>
                        {totalData?.past_year ? totalData?.past_year : '-'}
                      </TableCell>
                      <TableCell>
                        {totalData?.curr_year ? totalData?.curr_year : '-'}
                      </TableCell>
                      <TableCell>+/-</TableCell>
                      <TableCell>%</TableCell>
                      <TableCell>Target</TableCell>
                      <TableCell>+/- CONFIRMED</TableCell>
                      <TableCell>% CONFIRMED</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesComparisonTypeReport?.totals?.map(
                      (totalItem, totalIndex) => {
                        return (
                          <TableRow key={totalIndex}>
                            <TableCell>
                              {totalItem?.type ? totalItem?.type : 0}
                            </TableCell>
                            <TableCell>
                              {totalItem?.bookingYear1
                                ? totalItem?.bookingYear1
                                : 0}
                            </TableCell>
                            <TableCell>
                              {totalItem?.bookingYear2
                                ? totalItem?.bookingYear2
                                : 0}
                            </TableCell>
                            <TableCell>
                              {totalItem?.bookingChange
                                ? totalItem?.bookingChange
                                : 0}
                            </TableCell>
                            <TableCell>
                              {totalItem?.bookingChangePert
                                ? totalItem?.bookingChangePert
                                : 0}
                              %
                            </TableCell>
                            <TableCell>
                              {totalItem?.placeYear1
                                ? totalItem?.placeYear1
                                : 0}
                            </TableCell>
                            <TableCell>
                              {totalItem?.placeYear2
                                ? totalItem?.placeYear2
                                : 0}
                            </TableCell>
                            <TableCell>
                              {totalItem?.placeChange
                                ? totalItem?.placeChange
                                : 0}
                            </TableCell>
                            <TableCell>
                              {totalItem?.placeChangePert
                                ? totalItem?.placeChangePert
                                : 0}
                              %
                            </TableCell>
                            <TableCell>
                              £
                              {totalItem?.revYear1
                                ? totalItem?.revYear1?.toFixed(2)
                                : 0}
                            </TableCell>
                            <TableCell>
                              £
                              {totalItem?.revYear2
                                ? totalItem?.revYear2?.toFixed(2)
                                : 0}
                            </TableCell>
                            <TableCell>
                              £
                              {totalItem?.revChange
                                ? totalItem?.revChange?.toFixed(2)
                                : 0}
                            </TableCell>
                            <TableCell>
                              {totalItem?.revChangePert
                                ? totalItem?.revChangePert?.toFixed(2)
                                : 0}
                              %
                            </TableCell>
                            <TableCell>
                              {totalItem?.target ? totalItem?.target : 0}
                            </TableCell>
                            <TableCell>
                              {totalItem?.confirmedChanges
                                ? totalItem?.confirmedChanges
                                : 0}{' '}
                              <div className="charges_wrapper text-center">
                                {totalItem?.is_owner_item && 'Mixed'}
                                <span className="d-block">
                                  {totalItem?.is_owner_item
                                    ? totalItem?.mixed
                                    : ''}
                                </span>
                              </div>
                              <div className="exclusive_wrap text-center">
                                {totalItem?.is_owner_item && '+EXCLUSIVE'}
                                <span className="d-block">
                                  {totalItem?.is_owner_item
                                    ? totalItem?.exclusive
                                    : ''}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {totalItem?.confirmedChangesPer
                                ? totalItem?.confirmedChangesPer + '%'
                                : ''}

                              <div className="charges_wrapper text-center">
                                {totalItem?.is_owner_item && 'Mixed'}
                                <span className="d-block">
                                  {totalItem?.is_owner_item
                                    ? totalItem?.mixedPer + '%'
                                    : ''}
                                </span>
                              </div>
                              <div className="exclusive_wrap text-center">
                                {totalItem?.is_owner_item && '+EXCLUSIVE'}
                                <span className="d-block">
                                  {totalItem?.is_owner_item
                                    ? totalItem?.exclusivePer + '%'
                                    : ''}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        ) : (
          'No data available for selected week'
        )}
      </div>
    </>
  );
};

export default ComparisonTypeReportTable;
