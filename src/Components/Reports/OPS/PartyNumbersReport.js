import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import { Button, Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { yearsPrevious } from 'utils/FieldValues';
import { useDispatch, useSelector } from 'react-redux';
import { getPartyNumber } from 'store/reducers/Report/opsReport.slice';
import Loader from 'Components/Common/Loader';
import ReportHeader from 'Components/Common/ReportHeader';
import {
  getEventStatusesListData,
  setActiveEventStatusesList,
} from 'store/reducers/Admin/Events/eventStatuses.slice';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import convert from 'color-convert';

export default function PartyNumbersReport() {
  const dispatch = useDispatch();
  const { partyNumberList, opsReportLoading } = useSelector(
    ({ opsReport }) => opsReport,
  );
  const { activeEventStatusesList, contactSourcesLoading } = useSelector(
    ({ eventStatuses }) => eventStatuses,
  );
  const [reportData, setReportData] = useState({
    year: new Date().getFullYear(),
    status: [],
  });
  const [isReportCheck, setIsReportCheck] = useState(false);
  useEffect(() => {
    dispatch(getEventStatusesListData());
  }, []);
  const runReport = () => {
    const selectedStatuses = activeEventStatusesList.filter(
      status => status.show_on_party_numbers_report,
    );
    const selectedStatusIds = selectedStatuses.map(status => status._id);
    dispatch(
      getPartyNumber({
        year: reportData?.year,
        status: selectedStatusIds,
      }),
    );
    setIsReportCheck(true);
  };

  const mappedData = [];
  for (const eventKey in partyNumberList?.dates) {
    const event = partyNumberList?.dates[eventKey];
    for (const dateKey in event) {
      const eventData = event[dateKey];
      const mappedEvent = {
        _id: eventData?._id,
        date: eventData?.date,
        open_for_bookings: eventData?.open_for_bookings,
        event_sku: eventData?.event_sku,
        loc_internal_name: eventData?.loc_internal_name,
        status_id: eventData?.status_id,
        status_name: eventData?.status_name,
        status_color: eventData?.status_color,
        status_show_on_report: eventData?.status_show_on_report,
        status_active: eventData?.status_active,
        status_deleted: eventData?.status_deleted,
        total_confirmed: eventData?.total_confirmed,
        total_provisional: eventData?.total_provisional,
      };
      mappedData.push(mappedEvent);
    }
  }

  function lightenColor(hex, percent) {
    const f = parseInt(hex?.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16;
    const G = (f >> 8) & 0x00ff;
    const B = f & 0x0000ff;
    return (
      '#' +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1)
    );
  }

  const downloadExcel = () => {
    try {
      if (mappedData.length > 0) {
        const workbook = new ExcelJS.Workbook();
        const momentFormat = 'DD/MM/YYYY HH:mm:ss';
        let date = new Date();
        workbook.created = date;
        workbook.modified = date;
        const worksheet = workbook.addWorksheet('My Sheet', {});
        let dateArray = Array.from(new Set(mappedData?.map(i => i?.date)));
        dateArray.sort((a, b) => new Date(a) - new Date(b));
        let datesArray = dateArray?.map(i => moment(i).format('DD MMM'));
        datesArray.sort((a, b) => new Date(a) - new Date(b));
        let daysArray = dateArray?.map(i => moment(i).format('ddd'));

        const columns = [
          { key: '', width: 3 },
          { key: 'event_sku', width: 17 },
        ];
        // Create objects based on date array
        const dateColumns = datesArray.map(date => ({
          key: date,
          width: 17,
        }));

        // Add date columns to the columns array
        columns.push(...dateColumns);
        // Add remaining columns
        columns.push(
          { key: 'total', width: 17 },
          { key: 'overall', width: 17 },
        );

        worksheet.columns = columns;
        let rowData = [];

        Object.keys(partyNumberList.dates).map((partyEvent, eventIndex) => {
          let e = [];
          let c = [];
          e.push('P');
          e.push(partyEvent);
          dateArray.map(d => {
            for (let key of Object.keys(partyNumberList.dates[partyEvent])) {
              const element = partyNumberList.dates[partyEvent][key];
              if (element.date === d) {
                return e.push(
                  element.total_provisional ? element.total_provisional : '',
                );
              }
            }
            return e.push('');
          });
          const total_provisional = Object.values(
            partyNumberList.dates[partyEvent],
          ).reduce((total, item) => total + item.total_provisional, 0);

          e.push(total_provisional);
          rowData.push(e);

          c.push('C');
          c.push(partyEvent);
          dateArray.map(d => {
            for (let key of Object.keys(partyNumberList.dates[partyEvent])) {
              const element = partyNumberList.dates[partyEvent][key];
              if (element.date === d) {
                return c.push(
                  element.total_confirmed ? element.total_confirmed : '',
                );
              }
            }
            return c.push('');
          });
          const total_confirmed = Object.values(
            partyNumberList.dates[partyEvent],
          ).reduce((total, item) => total + item.total_confirmed, 0);

          c.push(total_confirmed);
          rowData.push(c);
        });

        // Function to chunk the array into groups of 12
        const chunkArray = (arr, size) => {
          return arr.reduce((acc, _, i) => {
            if (i % size === 0) {
              acc.push(arr.slice(i, i + size));
            }
            return acc;
          }, []);
        };

        // Chunk the dates array into groups of 12
        const chunks = chunkArray(rowData, 12);

        const colorNameToHex = colorName => {
          if (!convert.keyword.rgb(colorName)) return colorName;
          const rgbColor = convert.keyword.rgb(colorName);
          const hexColor = convert.rgb.hex(rgbColor);
          return `#${hexColor}`;
        };
        let _row = 1;
        chunks.map((item, index) => {
          // show date and day row
          worksheet.getRow(_row).values = [
            '',
            index === 0 ? 'Created' : '',
            ...datesArray,
            'TOTALS',
            'Overall',
          ];
          worksheet.getRow(_row).font = {
            bold: true,
          };
          _row = _row + 1;

          worksheet.getRow(_row).values = [
            '',
            index === 0 ? moment(date).format(momentFormat) : '',
            ...daysArray,
          ];
          worksheet.getRow(_row).font = {
            bold: true,
          };

          _row = _row + item.length;
          item.map(eventData => {
            worksheet
              .addRow(eventData)
              .eachCell({ includeEmpty: true }, (cell, colNumber) => {
                cell._column.height = 200;
                if (
                  cell._value.model.value === 'C' ||
                  (cell._column._number === 2 && cell._row._number % 2 === 0)
                ) {
                  const lightenedColor = colorNameToHex('yellow');
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: lightenedColor?.replace('#', '') },
                  };
                  cell.border = {
                    top: { style: 'hair', color: { argb: 'DDDDDD' } },
                    left: { style: 'hair', color: { argb: 'DDDDDD' } },
                    bottom: { style: 'hair', color: { argb: 'DDDDDD' } },
                    right: { style: 'hair', color: { argb: 'DDDDDD' } },
                  };
                }
              });
          });
          _row = _row + 1;
        });
        const setTotalSection = (row, value) => {
          worksheet.getRow(_row).values = value;
          worksheet
            .getRow(row)
            .eachCell({ includeEmpty: true }, (cell, colNumber) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4EB04B' },
              };
              cell.border = {
                top: { style: 'hair', color: { argb: 'DDDDDD' } },
                left: { style: 'hair', color: { argb: 'DDDDDD' } },
                bottom: { style: 'hair', color: { argb: 'DDDDDD' } },
                right: { style: 'hair', color: { argb: 'DDDDDD' } },
              };
            });
          _row = _row + 1;
        };

        let provRow = ['', `Prov's Per Day`];
        let confRow = ['', `Conf's Per Day`];
        let totalPerRow = ['', `Total Per Day`];

        datesArray.map(date => {
          let filterDate = mappedData.filter(
            (item, index) => moment(item.date).format('DD MMM') === date,
          );
          provRow.push(
            filterDate.length
              ? filterDate.reduce(
                  (total, item) => total + item.total_provisional,
                  0,
                )
              : 0,
          );
          confRow.push(
            filterDate.length
              ? filterDate.reduce(
                  (total, item) => total + item.total_confirmed,
                  0,
                )
              : 0,
          );
          totalPerRow.push(
            filterDate.reduce(
              (total, item) =>
                total + (item.total_provisional + item.total_confirmed),
              0,
            ),
          );
        });

        const totalP = mappedData.reduce(
          (total, item) => total + item.total_provisional,
          0,
        );
        const totalC = mappedData.reduce(
          (total, item) => total + item.total_confirmed,
          0,
        );
        const finalTotal = mappedData.reduce(
          (total, item) =>
            total + (item.total_confirmed + item.total_provisional),
          0,
        );
        provRow.push(totalP);
        confRow.push(totalC);
        totalPerRow.push(finalTotal);
        provRow.push(totalP);
        confRow.push(totalC);
        totalPerRow.push(finalTotal);
        let bottomTotal = [];
        bottomTotal.push(provRow);
        bottomTotal.push(confRow);
        bottomTotal.push(totalPerRow);

        // Set bottom total section
        setTotalSection(_row, provRow);
        setTotalSection(_row, confRow);
        setTotalSection(_row, totalPerRow);

        // Set bottom
        worksheet.getRow(_row).values = ['', '', ...datesArray, ''];
        worksheet.getRow(_row).font = {
          bold: true,
        };
        _row = _row + 1;

        worksheet.getRow(_row).values = ['', '', ...daysArray];
        worksheet.mergeCells(
          _row - 1,
          4 + datesArray.length,
          _row,
          4 + datesArray.length,
        );
        worksheet.getCell(_row, 4 + datesArray.length).value = finalTotal;
        // worksheet.getCell(_row, 4 + datesArray.length).font.size = 20;
        worksheet.getRow(_row).font = {
          bold: true,
        };

        const eventList = [];
        Object.keys(partyNumberList.dates).map((partyEvent, eventIndex) => {
          const array = Object.keys(partyNumberList.dates[partyEvent]).map(
            key => partyNumberList.dates[partyEvent][key],
          );
          eventList.push({
            bookingType: 'P',
            eventName: partyEvent,
            dates: array,
          });
          eventList.push({
            bookingType: 'C',
            eventName: partyEvent,
            dates: array,
          });
        });
        const chunksArray = chunkArray(eventList, 12);
        // Set color
        let _colorRow = 1;
        let _Coulmn = 1;
        chunksArray.map((item, index) => {
          _colorRow = _colorRow + 2;
          _Coulmn = _Coulmn + 2;
          item.map((partyEvent, eventIndex) => {
            worksheet
              .getRow(_colorRow)
              .eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (dateArray.length + 2 <= cell._column._number) return false;
                if (cell._column._number > 2) {
                  const columnLetter = cell.address.replace(/[0-9]/g, '');
                  const c1Cell = worksheet.getCell(`${columnLetter}1`);
                  const colDate = partyEvent.dates.find(item => {
                    if (
                      moment(item.date).format('DD MMM') ===
                      c1Cell._value.model.value
                    ) {
                      return item;
                    }
                  });
                  let showOnReport = false; // default to not show as has manual selection
                  if (colDate) {
                    if (colDate.status_id && colDate.status_show_on_report)
                      showOnReport = true;
                    // Set Cell Background Colour based on internal status
                    if (
                      showOnReport &&
                      colDate.status_color &&
                      colDate.status_active &&
                      !colDate.status_deleted
                    ) {
                      const lightenedColor = colorNameToHex(
                        colDate.status_color,
                      );
                      cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: lightenedColor?.replace('#', '') },
                      };
                      cell.border = {
                        top: { style: 'hair', color: { argb: 'DDDDDD' } },
                        left: { style: 'hair', color: { argb: 'DDDDDD' } },
                        bottom: { style: 'hair', color: { argb: 'DDDDDD' } },
                        right: { style: 'hair', color: { argb: 'DDDDDD' } },
                      };
                      cell.note = colDate.status_name;
                    } else if (
                      !colDate.open_for_bookings &&
                      colDate.total_provisional <= 0
                    ) {
                      // Grey out date if it is exclusive and empty
                      const lightenedColor = colorNameToHex('#DDDDDD');
                      cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: lightenedColor?.replace('#', '') },
                      };
                    }
                  }
                }
                return false;
              });

            _colorRow = _colorRow + 1;

            // over all column
            const overAll_column = worksheet.getCell(
              _Coulmn,
              4 + datesArray.length,
            );
            if (overAll_column._row._number % 2 !== 0) {
              worksheet.mergeCells(
                overAll_column._row._number,
                overAll_column._column._number,
                overAll_column._row._number + 1,
                overAll_column._column._number,
              );
              const total = partyEvent.dates.reduce(
                (total, item) =>
                  total + (item.total_provisional + item.total_confirmed),
                0,
              );
              worksheet.getCell(overAll_column._address).value = total;
              _Coulmn = _Coulmn + 1;
            } else {
              _Coulmn = _Coulmn + 1;

              return false;
            }
          });
        });

        workbook.xlsx.writeBuffer().then(function (buffer) {
          const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
          saveAs(
            blob,
            `Party_Numbers_${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
          );
        });
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadClick = () => {
    downloadExcel();
  };
  const handelChange = (item, index) => {
    const updatedData = activeEventStatusesList.map((status, i) => {
      if (i === index) {
        return {
          ...status,
          show_on_party_numbers_report: !status.show_on_party_numbers_report,
        };
      }
      return status;
    });
    dispatch(setActiveEventStatusesList(updatedData));
  };

  return (
    <div className="inner_wrapper">
      {(contactSourcesLoading || opsReportLoading) && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Party Numbers Report</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Party Numbers Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Event Numbers Export</h4>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <Row>
            <Col xl={6} lg={7}>
              <ul className="d-block bg-white p-0">
                <li className="bg_gray_box px-3 py-2 mb-2">
                  <Row className="align-items-center">
                    <Col xs={4}>
                      <lable className="text_small fw_500">Select Year:</lable>
                    </Col>
                    <Col xs={8}>
                      <div className="form-group mb-0">
                        <FormGroup className="w-100">
                          <FormControl className="event_select">
                            <Select
                              labelId="Enquiries-label"
                              id="Enquiries"
                              value={reportData.year}
                              onChange={e => {
                                setReportData({
                                  ...reportData,
                                  year: e.target.value,
                                });
                              }}
                              defaultValue="Select"
                              className="select_wrap "
                            >
                              <MenuItem value="Select" disabled>
                                Select
                              </MenuItem>
                              {yearsPrevious.map(item => {
                                return (
                                  <MenuItem key={item} value={item}>
                                    {item}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </div>
                    </Col>
                  </Row>
                </li>
                <li className="bg_gray_box px-3 py-2 mb-2">
                  <Row>
                    <Col xs={4}>
                      <label className="text_small fw_500">
                        Include Statuses:
                      </label>
                    </Col>
                    <Col xs={8}>
                      {activeEventStatusesList?.map((item, i) => {
                        return (
                          <div className="form-group checkbox_wrap" key={i}>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                name="status"
                                className="mb-2"
                                style={{
                                  color: `${item?.colour}`,
                                }}
                                value={item?._id}
                                label={item?.name}
                                checked={item?.show_on_party_numbers_report}
                                onChange={() => handelChange(item, i)}
                              />
                            </FormGroup>
                          </div>
                        );
                      })}
                    </Col>
                  </Row>
                </li>
                <li className="bg_gray_box px-3 py-2 mb-2">
                  <Row className="align-items-center">
                    <Col xs={4}>
                      <lable className="text_small fw_500">
                        Re-run the Report:
                      </lable>
                    </Col>
                    <Col xs={8}>
                      <Button className="btn_primary small" onClick={runReport}>
                        Run Report
                      </Button>
                      <span className="text_small ms-3">
                        (This may take a minute)
                      </span>
                    </Col>
                  </Row>
                </li>
              </ul>
            </Col>
          </Row>
          {isReportCheck === false && (
            <p className="m-0 text_light">
              Please select a Include Statuses to run the report
            </p>
          )}
          {isReportCheck && (
            <>
              <ul className="pdf_link_wrap mt-3 bg-white d-inline-flex align-items-center p-0">
                <li className="me-3">
                  <h5 className="m-0">Download the Report:</h5>
                </li>
                <li className="me-3">
                  <Link onClick={handleDownloadClick}>
                    <div className="pdf_icon">
                      <img src={ExcelIcon} alt="Print Icon" />
                    </div>
                    <div className="pdf_text">
                      <p>Download Excel File</p>
                    </div>
                  </Link>
                </li>
                <li className="me-3">
                  <p className="m-0">
                    - Created:{' '}
                    {moment(new Date()).format('MMMM DD YYYY HH:MM:SS')}
                  </p>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
