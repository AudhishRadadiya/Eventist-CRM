import React, { useEffect } from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getComparisonDetailReport } from 'store/reducers/Report/salesReport.slice';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import _ from 'lodash';
import { DuplicateAndCloneEvent } from 'Components/Admin/Events/Parties/EditParties/DuplicateAndCloneEvent';
const EventNumbersComparisonTable = ({ with_year, compare_year }) => {
  const dispatch = useDispatch();
  const { salesContactSourcesLoading, salesComparisonDetailReport } =
    useSelector(({ salesReport }) => salesReport);
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (Object.keys(reportParamData).length > 0)
      dispatch(
        getComparisonDetailReport({
          event_id:
            reportParamData?.event_id === 'All'
              ? ''
              : reportParamData?.event_id,
          with_year: Number(reportParamData?.with_year),
          compare_year: Number(reportParamData?.compare_year),
        }),
      );
  }, [dispatch]);
  return (
    <>
      {salesContactSourcesLoading && <Loader />}
      <div id="content-comparison-details-report">
        <h4 className="fw_600">
          Numbers Comparison{' '}
          {reportParamData?.compare_year
            ? reportParamData?.compare_year
            : compare_year}
          <span className="fw_500 d-block mt-1">
            Compared to{' '}
            {reportParamData?.with_year
              ? reportParamData?.with_year
              : with_year}
          </span>
        </h4>
        {salesComparisonDetailReport?.map((items, index) => {
          return (
            <div className="table_design_two table_with_two_row mb-3">
              <h3>{items?.alt_event_name}</h3>
              <h4>Compared to {items?.event_name}</h4>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3}>
                        Created: {moment(new Date()).format('Do MMM YYYY')}{' '}
                      </TableCell>
                      <TableCell colSpan={items?.data.length}>
                        Event Dates{' '}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} rowSpan={2}>
                        <span className="d-block">Week #</span>
                      </TableCell>
                      <TableCell>
                        <span className="d-block">-</span>
                      </TableCell>
                      {Object.keys(items?.data[0]?.conf).map((i, index) => {
                        return (
                          <TableCell rowSpan={2}>
                            {moment(i).format('DD/MM')}
                          </TableCell>
                        );
                      })}
                      <TableCell rowSpan={2}>
                        Totals{' '}
                        {reportParamData?.compare_year
                          ? String(reportParamData?.compare_year)?.substring(2)
                          : String(compare_year)?.substring(2)}
                      </TableCell>
                      <TableCell rowSpan={2}>
                        Totals{' '}
                        {reportParamData?.compare_year
                          ? String(reportParamData?.compare_year)?.substring(2)
                          : String(compare_year)?.substring(2)}
                      </TableCell>
                      <TableCell rowSpan={2}>
                        Totals{' '}
                        {reportParamData?.with_year
                          ? String(reportParamData?.with_year)?.substring(2)
                          : String(with_year)?.substring(2)}
                      </TableCell>
                      <TableCell rowSpan={2}>
                        Totals{' '}
                        {reportParamData?.with_year
                          ? String(reportParamData?.with_year)?.substring(2)
                          : String(with_year)?.substring(2)}
                      </TableCell>
                      <TableCell rowSpan={2}>
                        {reportParamData?.with_year
                          ? String(reportParamData?.with_year)?.substring(2)
                          : String(with_year)?.substring(2)}
                        -
                        {reportParamData?.compare_year
                          ? String(reportParamData?.compare_year)?.substring(2)
                          : String(compare_year)?.substring(2)}
                        %
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {items?.data.map((item, index) => {
                    return (
                      <TableBody>
                        <TableRow className="row_span_row_first" key={index}>
                          <TableCell rowSpan={2}>{item?.week}</TableCell>
                          <TableCell rowSpan={2}>{item?.date}</TableCell>
                          <TableCell>Prov</TableCell>
                          {Object.values(item?.prov).map((prov, index) => {
                            return <TableCell>{prov}</TableCell>;
                          })}
                          <TableCell> {item?.compare_prov_total}</TableCell>
                          <TableCell rowSpan={2}>
                            {item?.compare_total}
                          </TableCell>
                          <TableCell>{item?.with_prov_total}</TableCell>
                          <TableCell rowSpan={2}>{item?.with_total}</TableCell>
                          <TableCell rowSpan={2}>
                            {item.perc_diff + `%`}
                          </TableCell>
                        </TableRow>
                        <TableRow className="row_span_row_last">
                          <TableCell>Conf</TableCell>
                          {Object.values(item?.conf).map((conf, index) => {
                            return <TableCell>{conf}</TableCell>;
                          })}
                          <TableCell>{item?.compare_conf_total}</TableCell>
                          <TableCell>{item?.with_conf_total}</TableCell>
                        </TableRow>
                      </TableBody>
                    );
                  })}
                </Table>
              </TableContainer>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default EventNumbersComparisonTable;
