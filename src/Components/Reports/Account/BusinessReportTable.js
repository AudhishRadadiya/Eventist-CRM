import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBusinessReportList } from 'store/reducers/Report/accountReport.slice';
import Loader from 'Components/Common/Loader';
import moment from 'moment';
import { zeroRoundTo } from 'utils/common';

export default function BusinessReportTable({
  reportData,
  eventName,
  selectedDate,
}) {
  const dispatch = useDispatch();
  const { accountReportLoading, businessReportList } = useSelector(
    ({ accountReport }) => accountReport,
  );
  const [searchParams] = useSearchParams();
  const [businessListData, setBusinessListData] = useState({
    incomeData: [],
    outputData: [],
  });
  let BusinessData = Object.fromEntries([...searchParams]);

  useEffect(() => {
    if (Object.keys(BusinessData).length > 0) {
      dispatch(
        getBusinessReportList({
          event_id: BusinessData?.event_id,
          start_date:
            BusinessData?.start_date !== ''
              ? moment(new Date(BusinessData?.start_date)).format('YYYY-MM-DD')
              : '',
          end_date: moment(new Date(BusinessData?.end_date)).format(
            'YYYY-MM-DD',
          ),
          year: BusinessData?.year,
        }),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (Object.entries(businessReportList)?.length > 0) {
      let incomeData = Object.entries(
        businessReportList?.groupedData?.income,
      ).map(item => {
        const businessData = item[1]?.map(item2 => {
          return {
            itemName: item2?.itemName,
            amount: item2?.amount,
          };
        });
        return {
          date: item[0],
          fullDate: item[1][0].date,
          businessData: businessData,
        };
      });

      const incomeTableRowData = incomeData[0]?.businessData;
      let finalIncomeData = [];
      for (let index = 0; index < incomeTableRowData?.length; index++) {
        const element = incomeTableRowData[index];
        let data1234 = incomeData?.map(item => {
          let itemObj = item?.businessData?.find(
            obj => obj?.itemName === element?.itemName,
          );
          if (itemObj) {
            return {
              date: item?.date,
              fullDate: item?.fullDate,
              amount: itemObj?.amount,
            };
          }
        });
        finalIncomeData.push({
          itemName: element?.itemName,
          dateWisedata: data1234,
          itemTotalAmount: element?.amount,
        });
      }
      let outputData = Object.entries(
        businessReportList?.groupedData?.output,
      ).map(item => {
        const businessData = item[1]?.map(item2 => {
          return {
            itemName: item2?.itemName,
            amount: item2?.amount,
          };
        });
        return {
          date: item[0],
          fullDate: item[1][0].date,
          businessData: businessData,
        };
      });
      const outputTableRowData = outputData[0]?.businessData;
      let finalOutputData = [];
      for (let index = 0; index < outputTableRowData?.length; index++) {
        const element = outputTableRowData[index];
        let data1234 = outputData?.map(item => {
          let itemObj = item?.businessData?.find(
            obj => obj?.itemName === element?.itemName,
          );
          if (itemObj) {
            return {
              date: item?.date,
              fullDate: item?.fullDate,
              amount: itemObj?.amount,
            };
          }
        });
        finalOutputData.push({
          itemName: element?.itemName,
          dateWisedata: data1234,
          itemTotalAmount: element?.amount,
        });
      }
      setBusinessListData({
        outputData: finalOutputData,
        incomeData: finalIncomeData,
      });
    }
  }, [businessReportList]);
  return (
    <>
      {accountReportLoading && <Loader />}

      <div className="d-flex">
        <h4>Business Done Report - {eventName}</h4>
      </div>
      <h5>
        Week Ending:{' '}
        {selectedDate
          ? selectedDate
          : moment(new Date(BusinessData?.end_date)).format('DD/MM/YYYY')}
      </h5>
      {businessReportList?.groupedData && (
        <div className="table_main_Wrapper mb-3">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {Object.keys(businessReportList?.groupedData?.income)?.map(
                    (item, i) => {
                      if (item === 'TOTAL') return null;
                      return (
                        <TableCell>
                          {moment(item).format('DD-MMM-YYYY')}
                        </TableCell>
                      );
                    },
                  )}
                  <TableCell>TOTAL</TableCell>;
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className="full_row">
                  <TableCell colSpan={17}>Income</TableCell>
                </TableRow>
                {businessListData?.incomeData?.map((item, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{item?.itemName}</TableCell>
                      {item?.dateWisedata?.map(dd => {
                        if (dd.fullDate === 'TOTAL') return null;
                        return <TableCell>{zeroRoundTo(dd?.amount)}</TableCell>;
                      })}
                      <TableCell>
                        {zeroRoundTo(item?.itemTotalAmount)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell>Totals</TableCell>
                  {Object.keys(
                    businessReportList?.groupedData?.TOTALS?.income,
                  )?.map((item, i) => {
                    if (item === 'TOTAL') return null;
                    return (
                      <TableCell>
                        <h5>
                          {businessReportList?.groupedData?.TOTALS?.income[
                            item
                          ]?.toFixed(2)}
                        </h5>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <h5>
                      {businessReportList?.groupedData?.TOTALS?.income[
                        'TOTAL'
                      ]?.toFixed(2)}
                    </h5>
                  </TableCell>
                </TableRow>

                <TableRow className="full_row">
                  <TableCell colSpan={17}>Output</TableCell>
                </TableRow>
                {businessListData?.outputData?.map((item, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{item?.itemName}</TableCell>
                      {item?.dateWisedata?.map(dd => {
                        if (dd.fullDate === 'TOTAL') return null;
                        return <TableCell>{zeroRoundTo(dd?.amount)}</TableCell>;
                      })}
                      <TableCell>
                        {zeroRoundTo(item?.itemTotalAmount)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell>Totals</TableCell>
                  {Object.keys(
                    businessReportList?.groupedData?.TOTALS?.output,
                  )?.map((item, i) => {
                    if (item === 'TOTAL') return null;
                    return (
                      <TableCell>
                        <h5>
                          {businessReportList?.groupedData?.TOTALS?.output[
                            item
                          ]?.toFixed(2)}
                        </h5>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <h5>
                      {businessReportList?.groupedData?.TOTALS?.output[
                        'TOTAL'
                      ]?.toFixed(2)}
                    </h5>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <Row className="justify-content-end">
        <Col xl={4} xs={5}>
          {businessReportList?.groupedData && (
            <div className="table_main_Wrapper mb-3">
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Bal F/WD</TableCell>
                      <TableCell>Plus</TableCell>
                      <TableCell>Less</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Debtors</TableCell>
                      <TableCell>
                        {businessReportList?.groupedData?.TOTALS?.debtors?.BF?.toFixed(
                          2,
                        )}
                      </TableCell>
                      <TableCell>
                        {businessReportList?.groupedData?.TOTALS?.debtors?.PLUS?.toFixed(
                          2,
                        )}
                      </TableCell>
                      <TableCell>
                        {businessReportList?.groupedData?.TOTALS?.debtors?.LESS?.toFixed(
                          2,
                        )}
                      </TableCell>
                      <TableCell>
                        {businessReportList?.groupedData?.TOTALS?.debtors?.TOTAL?.toFixed(
                          2,
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Deposits</TableCell>
                      <TableCell>
                        {businessReportList?.groupedData?.TOTALS?.deposits?.BF?.toFixed(
                          2,
                        )}
                      </TableCell>
                      <TableCell>
                        {businessReportList?.groupedData?.TOTALS?.deposits?.PLUS?.toFixed(
                          2,
                        )}
                      </TableCell>
                      <TableCell>
                        {businessReportList?.groupedData?.TOTALS?.deposits?.LESS?.toFixed(
                          2,
                        )}
                      </TableCell>
                      <TableCell>
                        {businessReportList?.groupedData?.TOTALS?.deposits?.TOTAL?.toFixed(
                          2,
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}
