import { useEffect, useMemo, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
} from '@mui/material';
import Loader from 'Components/Common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getEventNumbersComparisonTotals } from 'store/reducers/Report/salesReport.slice';
import moment from 'moment';
import { zeroRoundTo } from 'utils/common';

const EventNumbersComparisonTotalTable = ({ week, date }) => {
  const dispatch = useDispatch();

  const { salesContactSourcesLoading, salesComparisonTotalsReport } =
    useSelector(({ salesReport }) => salesReport);

  const [searchParams] = useSearchParams();
  let comparisonTotalsReportData = Object.fromEntries([...searchParams]);
  useEffect(() => {
    if (Object.keys(comparisonTotalsReportData).length > 0) {
      let payload = {
        compare_year: Number(comparisonTotalsReportData?.compare_year),
        with_year: Number(comparisonTotalsReportData?.with_year),
        week_number: moment(
          comparisonTotalsReportData?.week_number,
          'YY.MM.DD',
        ).format('YYYY-MM-DD'),
      };
      dispatch(getEventNumbersComparisonTotals(payload));
    }
  }, [dispatch]);
  return (
    <>
      {salesContactSourcesLoading && <Loader />}
      <div id="content-comparison-total-report">
        <h4 className="fw_600">
          Total Numbers Comparison:
          {comparisonTotalsReportData?.week_number
            ? comparisonTotalsReportData?.week
            : week && week?.week2}
          &nbsp; Weeks
          <span className="fw_500 d-block">
            For week #
            {comparisonTotalsReportData?.label
              ? comparisonTotalsReportData?.label
              : week?.label}
          </span>
        </h4>
        <div className="table_design_two mb-3">
          {salesComparisonTotalsReport?.dataArray?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2}>
                      Created: {moment(new Date()).format('Do MMM YYYY')}
                    </TableCell>
                    <TableCell colSpan={4}>
                      {(date && date.compare_year) ||
                        comparisonTotalsReportData.compare_year}
                    </TableCell>
                    <TableCell colSpan={4}>
                      {(date && date.with_year) ||
                        comparisonTotalsReportData.with_year}
                    </TableCell>
                    <TableCell colSpan={4}>
                      {(date && date.compare_year.toString().slice(-2)) ||
                        comparisonTotalsReportData.compare_year
                          .toString()
                          .slice(-2)}
                      -
                      {(date && date.with_year.toString().slice(-2)) ||
                        comparisonTotalsReportData.with_year
                          .toString()
                          .slice(-2)}{' '}
                      +/- Places
                    </TableCell>
                    <TableCell colSpan={4}>
                      {(date && date.compare_year.toString().slice(-2)) ||
                        comparisonTotalsReportData.compare_year
                          .toString()
                          .slice(-2)}
                      -
                      {(date && date.with_year.toString().slice(-2)) ||
                        comparisonTotalsReportData.with_year
                          .toString()
                          .slice(-2)}{' '}
                      +/- Revenue
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>#</TableCell>
                    <TableCell># TOTAL</TableCell>
                    <TableCell>£</TableCell>
                    <TableCell>£ TOTAL</TableCell>
                    <TableCell>#</TableCell>
                    <TableCell># TOTAL</TableCell>
                    <TableCell>£</TableCell>
                    <TableCell>£ TOTAL</TableCell>
                    <TableCell>#</TableCell>
                    <TableCell>%</TableCell>
                    <TableCell colSpan={2}>TOTAL: # | %</TableCell>
                    <TableCell>£</TableCell>
                    <TableCell>%</TableCell>
                    <TableCell colSpan={2}>TOTAL: £ | %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesComparisonTotalsReport.dataArray?.map((item, index) => {
                    const altVenue = item?.data.find(_ => _.is_com);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {item?.Venue_Name}{' '}
                          {altVenue?.Alt_Venue ? (
                            <>
                              <br />
                              (Compared to {altVenue.Alt_Venue})
                            </>
                          ) : (
                            ''
                          )}{' '}
                        </TableCell>
                        <TableCell>
                          <span className="d-block text_light">
                            Provisional
                          </span>
                          <span className="d-block text_light">Confirmed</span>
                        </TableCell>
                        <TableCell>
                          <span className="d-block text_light">
                            {item?.data[0].is_com
                              ? item?.data[0].Prov
                              : item?.data[1] && item?.data[1].Prov}
                          </span>
                          <span className="d-block text_light">
                            {item?.data[0].is_com
                              ? item?.data[0].Conf
                              : item?.data[1] && item?.data[1].Conf}
                          </span>
                        </TableCell>
                        <TableCell>
                          {item?.data[0].is_com
                            ? item?.data[0]?.Total
                            : item?.data[1] && item?.data[1]?.Total}
                        </TableCell>
                        <TableCell>
                          <span className="d-block text_light">
                            {/* {' '}
                          £{item?.Prov_Rev?.toFixed(2)}{' '} */}
                            {item?.data[0].is_com
                              ? `£` +
                                (+item?.data[0].Prov_Rev)?.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  },
                                )
                              : item?.data[1] &&
                                `£` +
                                  (+item?.data[1].Prov_Rev)?.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    },
                                  )}
                          </span>
                          <span className="d-block text_light">
                            {item?.data[0].is_com
                              ? `£` +
                                (+item?.data[0].Conf_Rev)?.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  },
                                )
                              : item?.data[1] &&
                                `£` +
                                  (+item?.data[1].Conf_Rev)?.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    },
                                  )}
                          </span>
                        </TableCell>
                        <TableCell>
                          {' '}
                          {item?.data[0].is_com
                            ? `£` +
                              (+item?.data[0].Total_Rev)?.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )
                            : item?.data[1] &&
                              `£` +
                                (+item?.data[1].Total_Rev)?.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  },
                                )}
                        </TableCell>
                        <TableCell>
                          <span className="d-block text_light">
                            {' '}
                            {item?.data[0].is_com === false
                              ? item?.data[0].Prov
                              : item?.data[1] && item?.data[1].Prov}
                          </span>
                          <span className="d-block text_light">
                            {' '}
                            {item?.data[0].is_com === false
                              ? item?.data[0].Conf
                              : item?.data[1] && item?.data[1].Conf}
                          </span>
                        </TableCell>
                        <TableCell>
                          {item?.data[0].is_com === false
                            ? item?.data[0]?.Total
                            : item?.data[1] && item?.data[1]?.Total}
                        </TableCell>
                        <TableCell>
                          <span className="d-block text_light">
                            {' '}
                            {item?.data[0].is_com === false
                              ? `£` +
                                (+item?.data[0].Prov_Rev)?.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  },
                                )
                              : item?.data[1] &&
                                `£` +
                                  (+item?.data[1].Prov_Rev)?.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    },
                                  )}
                          </span>
                          <span className="d-block text_light">
                            {item?.data[0].is_com === false
                              ? `£` +
                                (+item?.data[0].Conf_Rev)?.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  },
                                )
                              : item?.data[1] &&
                                `£` +
                                  (+item?.data[1].Conf_Rev)?.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    },
                                  )}
                          </span>
                        </TableCell>
                        <TableCell>
                          {' '}
                          {item?.data[0].is_com === false
                            ? `£` +
                              (+item.data[0].Total_Rev)?.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )
                            : item?.data[1] &&
                              `£` +
                                (+item.data[1].Total_Rev)?.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  },
                                )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`d-block ${
                              +item.diff_prov_places < 0
                                ? 'text_primary'
                                : +item.diff_prov_places > 0
                                ? 'text_green'
                                : 'text_light'
                            }`}
                          >
                            {item.diff_prov_places}
                          </span>
                          <span
                            className={`d-block ${
                              +item.diff_conf_places < 0
                                ? 'text_primary'
                                : +item.diff_conf_places > 0
                                ? 'text_green'
                                : 'text_light'
                            }`}
                          >
                            {' '}
                            {item.diff_conf_places}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`d-block ${
                              +item.diff_perc_prov_places < 0
                                ? 'text_primary'
                                : +item.diff_perc_prov_places > 0
                                ? 'text_green'
                                : 'text_light'
                            }`}
                          >
                            {item.diff_perc_prov_places + `%`}
                          </span>
                          <span
                            className={`d-block ${
                              +item.diff_perc_conf_places < 0
                                ? 'text_primary'
                                : +item.diff_perc_conf_places > 0
                                ? 'text_green'
                                : 'text_light'
                            }`}
                          >
                            {item.diff_perc_conf_places + `%`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              +item.diff_total_places < 0
                                ? 'text_primary'
                                : +item.diff_total_places > 0
                                ? 'text_green'
                                : 'text_light'
                            }
                          >
                            {item.diff_total_places}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              +item.diff_perc_total_places < 0
                                ? 'text_primary'
                                : +item.diff_perc_total_places > 0
                                ? 'text_green'
                                : 'text_light'
                            }
                          >
                            {item.diff_perc_total_places + `%`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`d-block ${
                              +item.diff_prov_rev < 0
                                ? 'text_primary'
                                : +item.diff_prov_rev > 0
                                ? 'text_green'
                                : 'text_light'
                            }`}
                          >
                            {`£` +
                              (+item.diff_prov_rev)?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </span>
                          <span
                            className={`d-block ${
                              +item.diff_conf_rev < 0
                                ? 'text_primary'
                                : +item.diff_conf_rev > 0
                                ? 'text_green'
                                : 'text_light'
                            }`}
                          >
                            {`£` +
                              (+item.diff_conf_rev)?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`d-block ${
                              +item.diff_perc_prov_rev < 0
                                ? 'text_primary'
                                : +item.diff_perc_prov_rev > 0
                                ? 'text_green'
                                : 'text_light'
                            }`}
                          >
                            {item.diff_perc_prov_rev + `%`}
                          </span>
                          <span
                            className={`d-block ${
                              +item.diff_perc_conf_rev < 0
                                ? 'text_primary'
                                : +item.diff_perc_conf_rev > 0
                                ? 'text_green'
                                : 'text_light'
                            }`}
                          >
                            {item.diff_perc_conf_rev + `%`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              +item.diff_total_rev < 0
                                ? 'text_primary'
                                : +item.diff_total_rev > 0
                                ? 'text_green'
                                : 'text_light'
                            }
                          >
                            {`£` +
                              (+item.diff_total_rev)?.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              +item.diff_perc_total_rev < 0
                                ? 'text_primary'
                                : +item.diff_perc_total_rev > 0
                                ? 'text_green'
                                : 'text_light'
                            }
                          >
                            {item.diff_perc_total_rev + `%`}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableHead>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>
                      <span className="d-block text_light">Provisional</span>
                      <span className="d-block text_light">Confirmed</span>
                    </TableCell>
                    {/* <TableCell>
                  {salesComparisonTotalsReport?.totals?.}
                </TableCell> */}
                    <TableCell>
                      <span className="d-block text_light">
                        {salesComparisonTotalsReport?.totals?.comp_prov}
                      </span>
                      <span className="d-block text_light">
                        {salesComparisonTotalsReport?.totals?.comp_conf}
                      </span>
                    </TableCell>
                    <TableCell>
                      {salesComparisonTotalsReport?.totals?.comp_total}
                    </TableCell>
                    <TableCell>
                      <span className="d-block text_light">
                        {`£` +
                          (+salesComparisonTotalsReport?.totals
                            ?.comp_prov_rev)?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </span>
                      <span className="d-block text_light">
                        {`£` +
                          (+salesComparisonTotalsReport?.totals
                            ?.comp_conf_rev)?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {`£` +
                        (+salesComparisonTotalsReport?.totals
                          ?.comp_total_rev)?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </TableCell>
                    <TableCell>
                      <span className="d-block text_light">
                        {salesComparisonTotalsReport?.totals?.with_prov}
                      </span>
                      <span className="d-block text_light">
                        {salesComparisonTotalsReport?.totals?.with_conf}
                      </span>
                    </TableCell>
                    <TableCell>
                      {salesComparisonTotalsReport?.totals?.with_total}
                    </TableCell>
                    <TableCell>
                      <span className="d-block text_light">
                        {`£` +
                          (+salesComparisonTotalsReport?.totals
                            ?.with_prov_rev)?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </span>
                      <span className="d-block text_light">
                        {`£` +
                          (+salesComparisonTotalsReport?.totals
                            ?.with_conf_rev)?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {`£` +
                        (+salesComparisonTotalsReport?.totals
                          ?.with_total_rev)?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals
                            ?.diff_prov_places < 0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_prov_places > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {salesComparisonTotalsReport?.totals?.diff_prov_places}
                      </span>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals
                            ?.diff_conf_places < 0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_conf_places > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {salesComparisonTotalsReport?.totals?.diff_conf_places}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals
                            ?.diff_perc_prov_places < 0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_perc_prov_places > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {salesComparisonTotalsReport?.totals
                          ?.diff_perc_prov_places + `%`}
                      </span>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals
                            ?.diff_perc_conf_places < 0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_perc_conf_places > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {salesComparisonTotalsReport?.totals
                          ?.diff_perc_conf_places + `%`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          +salesComparisonTotalsReport?.totals
                            ?.diff_total_places < 0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_total_places > 0
                            ? 'text_green'
                            : 'text_light'
                        }
                      >
                        {salesComparisonTotalsReport?.totals?.diff_total_places}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          +salesComparisonTotalsReport?.totals
                            ?.diff_perc_total_places < 0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_perc_total_places > 0
                            ? 'text_green'
                            : 'text_light'
                        }
                      >
                        {salesComparisonTotalsReport?.totals
                          ?.diff_perc_total_places + `%`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals?.diff_prov_rev <
                          0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_prov_rev > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {`£` +
                          (+salesComparisonTotalsReport?.totals
                            ?.diff_prov_rev)?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </span>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals?.diff_conf_rev <
                          0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_conf_rev > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {`£` +
                          (+salesComparisonTotalsReport?.totals
                            ?.diff_conf_rev)?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals
                            ?.diff_perc_prov_rev < 0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_perc_prov_rev > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {salesComparisonTotalsReport?.totals
                          ?.diff_perc_prov_rev + `%`}
                      </span>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals
                            ?.diff_perc_conf_rev < 0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_perc_conf_rev > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {salesComparisonTotalsReport?.totals
                          ?.diff_perc_conf_rev + `%`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals?.diff_total_rev <
                          0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_total_rev > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {`£` +
                          (+salesComparisonTotalsReport?.totals
                            ?.diff_total_rev)?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`d-block ${
                          +salesComparisonTotalsReport?.totals
                            ?.diff_perc_total_rev < 0
                            ? 'text_primary'
                            : +salesComparisonTotalsReport?.totals
                                ?.diff_perc_total_rev > 0
                            ? 'text_green'
                            : 'text_light'
                        }`}
                      >
                        {salesComparisonTotalsReport?.totals
                          ?.diff_perc_total_rev + `%`}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          ) : (
            'There are no Comparison Totals Report'
          )}
        </div>
      </div>
    </>
  );
};

export default EventNumbersComparisonTotalTable;
