import { useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import { Button, Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { yearsPrevious } from 'utils/FieldValues';
import { useDispatch, useSelector } from 'react-redux';
import { getKpiReport } from 'store/reducers/Report/salesReport.slice';
import Loader from 'Components/Common/Loader';
import DrinksSundriesReportTable from './DrinksSundriesReportTable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import ReportHeader from 'Components/Common/ReportHeader';
import moment from 'moment';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import { toMoney } from 'utils/common';
import convert from 'color-convert';
export default function DrinksSundriesReport() {
  const dispatch = useDispatch();

  const [reportData, setReportData] = useState({
    year: new Date().getFullYear(),
  });

  const { salesKpiReport, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );

  //ui not geeting proper, so list of fata (table) pending...
  const handleChange = e => {
    const { name, value } = e.target;

    setReportData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRunReport = () => {
    dispatch(
      getKpiReport({
        year: reportData?.year,
      }),
    );
  };

  function getColumnLetter(index) {
    let letter = '';
    while (index > 0) {
      let remainder = index % 26;
      if (remainder === 0) {
        remainder = 26;
      }
      letter = String.fromCharCode(remainder + 64) + letter;
      index = Math.floor((index - 1) / 26);
    }
    return letter;
  }

  const downloadexcel = () => {
    const groupedBySku = salesKpiReport?.data.reduce((acc, currentValue) => {
      const { ev_sku } = currentValue;
      if (!acc[ev_sku]) {
        acc[ev_sku] = [];
      }
      acc[ev_sku].push(currentValue);
      return acc;
    }, {});

    const workbook = new ExcelJS.Workbook();
    let date = new Date();
    workbook.created = date;
    workbook.modified = date;
    const worksheet = workbook.addWorksheet('My Sheet', {});

    // worksheet.getRow(1).values = [`${reportData?.year} Product Spend KPIs`];
    worksheet.mergeCells('A1', `Z1`);
    worksheet.getCell('A1').value = `${reportData?.year} Product Spend KPIs`;
    worksheet.getCell('A1').font = { size: 20 };
    worksheet.getCell('A1').alignment = {
      horizontal: 'left',
      vertical: 'middle',
    };

    worksheet.getColumn('A').width = 30;

    worksheet.getRow(1).height = 40;

    const skuKeys = Object.keys(groupedBySku);
    const displaySku = skuKeys.map(sku =>
      sku.replace(`_2024`, '').toUpperCase(),
    );
    displaySku.forEach((_, index) => {
      const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
      worksheet.getColumn(columnLetter).width = 15; // Set the width for each column
    });
    worksheet.getRow(3).values = [...[''], ...displaySku];
    worksheet.getRow(3).width = 15;
    const colorNameToHex = colorName => {
      if (!convert.keyword.rgb(colorName)) return colorName;
      const rgbColor = convert.keyword.rgb(colorName);
      const hexColor = convert.rgb.hex(rgbColor);
      return `#${hexColor}`;
    };
    worksheet.getRow(4).values = ['Dodgems Spend Total (Net)'];
    worksheet.getRow(5).values = ['Drinks Spend Total (Net)'];
    worksheet.getRow(6).values = ['Casino Spend Total (Net)'];
    worksheet.getRow(7).values = ['Photo Booth Spend Total (Net)'];
    worksheet.getRow(8).values = ['Attendance'];
    worksheet.getRow(9).values = ['Total Spend (Net)'];

    worksheet.getRow(11).values = ['Dodgems Spend Average p/h'];
    worksheet.getRow(12).values = ['Drinks Spend Average p/h'];
    worksheet.getRow(13).values = ['Casino Spend Average p/h'];
    worksheet.getRow(14).values = ['Photo Booth Spend Average p/h'];
    worksheet.getRow(15).values = ['Total Spend Average p/h'];
    worksheet.getRow(15).height = 25;
    worksheet.getRow(15).font = {
      bold: true,
    };
    worksheet.getCell('A15').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colorNameToHex('yellow')?.replace('#', '') },
    };
    worksheet.getCell('A15').border = {
      top: { style: 'hair', color: { argb: 'DDDDDD' } },
      left: { style: 'hair', color: { argb: 'DDDDDD' } },
      bottom: { style: 'hair', color: { argb: 'DDDDDD' } },
      right: { style: 'hair', color: { argb: 'DDDDDD' } },
    };
    // count  gross price for Dodgems Spend Total (Net)
    skuKeys.forEach((sku, index) => {
      let rowNumber = 4;
      const totalPriceNetForDodgems = groupedBySku[sku].reduce((sum, item) => {
        return item.product_kpi_section === 3 ? sum + item.price_net : sum + 0;
      }, 0);
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(totalPriceNetForDodgems);
      rowNumber++;
      // count  gross price for Drinks Spend Total (Net)

      const totalPriceNetForDrink = groupedBySku[sku].reduce((sum, item) => {
        return item.product_kpi_section === 2 ? sum + item.price_net : sum + 0;
      }, 0);
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(totalPriceNetForDrink);
      rowNumber++;

      //set defualt 0 for Casino Spend Total (Net) & Photo Booth Spend Total (Net)
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(0);
      rowNumber++;
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(0);
      rowNumber++;
      //count total attendance
      const totalAttendance = groupedBySku[sku].reduce(
        (sum, item) => sum + item.attendance,
        0,
      );
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        totalAttendance.toString();
      rowNumber++;
      // total of totalPriceNetForDrink and totalPriceNetForDodgems
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(totalPriceNetForDrink + totalPriceNetForDodgems);

      rowNumber = rowNumber + 2;
      // avg of totalPriceNetForDodgems

      const avgOfDodgems = totalPriceNetForDodgems / totalAttendance;
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(avgOfDodgems);
      rowNumber++;
      // avg of totalPriceNetForDrink
      const avgOfDrink = totalPriceNetForDrink / totalAttendance;
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(avgOfDrink);
      rowNumber++;
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(0);
      rowNumber++;
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(0);
      rowNumber++;
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).value =
        '£' + toMoney(avgOfDodgems + avgOfDrink);
      worksheet.getCell(getColumnLetter(index + 2) + rowNumber).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colorNameToHex('yellow')?.replace('#', '') },
      };
    });

    const low = moment(salesKpiReport.low);
    const high = moment(salesKpiReport.high);
    const daysDifference = high.diff(low, 'days');

    const dateArray = Array.from({ length: daysDifference + 1 }, (_, index) => {
      return low.clone().add(index, 'days').format('YYYY-MM-DD');
    });

    // Initialize the result object
    const result = {};

    // Populate the result object based on the date array and SKU keys
    dateArray.forEach(date => {
      // Create an object for each date
      result[date] = {};

      // Add each SKU key to the date object
      skuKeys.forEach(sku => {
        // Find the matching data for the current SKU and date
        const matchingData = salesKpiReport?.data.filter(
          d =>
            d.ev_sku === sku &&
            moment(d.booking_date).format('YYYY-MM-DD') === date,
        );
        result[date][sku] = {};

        // If there's matching data, add it to the date object under the SKU
        if (matchingData.length > 0) {
          matchingData.map(item => {
            const { price_gross, product_kpi_section, attendance, price_net } =
              item;
            result[date][sku][product_kpi_section ?? 0] = {
              price_gross,
              product_kpi_section,
              attendance,
              price_net,
            };
          });
        } else {
          // If no data found for this SKU and date, you can choose to set defaults
          result[date][sku][0] = {
            price_gross: 0,
            product_kpi_section: 0,
            attendance: 0,
            price_net: 0,
          };
        }
      });
    });

    let currentRow = 17;
    worksheet.mergeCells(`A${currentRow}`, `Z${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = `COMBINED SALES AVERAGES`;
    worksheet.getCell(`A${currentRow}`).font = { size: 20 };
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'left',
      vertical: 'middle',
    };
    worksheet.getRow(currentRow).height = 40;
    worksheet.getRow(currentRow).width = 40;

    currentRow += 1;
    worksheet.getRow(currentRow).values = [
      ...['Dodgems Average p/h (Net)'],
      ...displaySku,
    ];

    currentRow++;
    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        if (result[date][sku].hasOwnProperty(3)) {
          const { price_gross, attendance, product_kpi_section } =
            result[date][sku][3];
          if (product_kpi_section === 3 && price_gross) {
            if (attendance) {
              worksheet.getCell(`${columnLetter}${currentRow}`).value =
                product_kpi_section === 3 && price_gross && attendance
                  ? '£' + toMoney(price_gross / attendance / 1.2)
                  : '£0.00';
            } else {
              if (result[date][sku][2]) {
                const { attendance: drinkAttendance } = result[date][sku][2];
                worksheet.getCell(`${columnLetter}${currentRow}`).value =
                  drinkAttendance
                    ? '£' + toMoney(price_gross / drinkAttendance / 1.2)
                    : '£0.00';
              } else {
                worksheet.getCell(`${columnLetter}${currentRow}`).value =
                  '£0.00';
              }
            }
          } else {
            worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
          }

          if (!price_gross) {
            worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'e2e2e2' },
            };
            worksheet.getCell(`${columnLetter}${currentRow}`).font = {
              color: { argb: 'bfbfbf' },
            };
            worksheet.getCell(`${columnLetter}${currentRow}`).font = {
              color: { argb: 'bfbfbf' },
            };
          }
        } else {
          worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
          worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'e2e2e2' },
          };
          worksheet.getCell(`${columnLetter}${currentRow}`).font = {
            color: { argb: 'bfbfbf' },
          };
          worksheet.getCell(`${columnLetter}${currentRow}`).font = {
            color: { argb: 'bfbfbf' },
          };
        }
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });

    const netTotalAttendancesRow1 = [];

    netTotalAttendancesRow1.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return sum + item.attendance;
      }, 0);
      netTotalAttendancesRow1.push(totalAttendance.toString());
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow1;
    currentRow += 1;

    // Add a new row for "Gross Totals"
    const netAvgDodgems = [];

    // First cell: "Gross Totals of Dodgems"
    netAvgDodgems.push('Net Avg Dodgems Order p/h');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      const totalPriceNetForDodgems = groupedBySku[sku].reduce((sum, item) => {
        return item.product_kpi_section === 3 ? sum + item.price_net : sum + 0;
      }, 0);
      const totalAttendance = groupedBySku[sku].reduce(
        (sum, item) => sum + item.attendance,
        0,
      );
      const avgOfDodgems = totalPriceNetForDodgems / totalAttendance;

      netAvgDodgems.push('£' + toMoney(avgOfDodgems));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = netAvgDodgems;
    netAvgDodgems.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });

    currentRow += 2;
    worksheet.getRow(currentRow).values = [
      ...['Drinks Average p/h (Net)'],
      ...displaySku,
    ];
    currentRow++;

    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)

        if (result[date][sku].hasOwnProperty(2)) {
          const { price_gross, attendance, product_kpi_section } =
            result[date][sku][2];
          if (product_kpi_section === 2 && price_gross) {
            if (attendance) {
              worksheet.getCell(`${columnLetter}${currentRow}`).value =
                product_kpi_section === 2 && price_gross && attendance
                  ? '£' + toMoney(price_gross / attendance / 1.2)
                  : '£0.00';
            } else {
              if (result[date][sku].hasOwnProperty(3)) {
                const { attendance: drinkAttendance } = result[date][sku][3];
                worksheet.getCell(`${columnLetter}${currentRow}`).value =
                  drinkAttendance
                    ? '£' + toMoney(price_gross / drinkAttendance / 1.2)
                    : '£0.00';
              } else
                worksheet.getCell(`${columnLetter}${currentRow}`).value =
                  '£0.00';
            }
          } else {
            worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
          }

          if (!price_gross) {
            worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'e2e2e2' },
            };
            worksheet.getCell(`${columnLetter}${currentRow}`).font = {
              color: { argb: 'bfbfbf' },
            };
            worksheet.getCell(`${columnLetter}${currentRow}`).font = {
              color: { argb: 'bfbfbf' },
            };
          }
        } else {
          worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
          worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'e2e2e2' },
          };
          worksheet.getCell(`${columnLetter}${currentRow}`).font = {
            color: { argb: 'bfbfbf' },
          };
          worksheet.getCell(`${columnLetter}${currentRow}`).font = {
            color: { argb: 'bfbfbf' },
          };
        }
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });
    const netTotalAttendancesRow3 = [];

    netTotalAttendancesRow3.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return sum + item.attendance;
      }, 0);
      netTotalAttendancesRow3.push(totalAttendance.toString());
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow3;

    currentRow += 1;

    // Add a new row for "Gross Totals"
    const netAvgDodgems1 = [];

    // First cell: "Gross Totals of Dodgems"
    netAvgDodgems1.push('Net Avg Drinks Order p/h');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      const totalPriceNetForDodgems = groupedBySku[sku].reduce((sum, item) => {
        return item.product_kpi_section === 2 ? sum + item.price_net : sum + 0;
      }, 0);
      const totalAttendance = groupedBySku[sku].reduce(
        (sum, item) => sum + item.attendance,
        0,
      );
      const avgOfDodgems = totalPriceNetForDodgems / totalAttendance;

      netAvgDodgems1.push('£' + toMoney(avgOfDodgems));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = netAvgDodgems1;
    netAvgDodgems1.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });

    currentRow += 2;
    worksheet.getRow(currentRow).values = [
      ...['Casino Average p/h (Net)'],
      ...displaySku,
    ];
    currentRow++;

    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
        worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'e2e2e2' },
        };
        worksheet.getCell(`${columnLetter}${currentRow}`).font = {
          color: { argb: 'bfbfbf' },
        };
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });
    const netTotalAttendancesRow4 = [];

    netTotalAttendancesRow4.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return sum + item.attendance;
      }, 0);
      netTotalAttendancesRow4.push(totalAttendance.toString());
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow4;

    currentRow += 1;

    // Add a new row for "Gross Totals"
    const netAvgDodgems2 = [];

    // First cell: "Gross Totals of Dodgems"
    netAvgDodgems2.push('Net Avg Casino Order p/h');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      netAvgDodgems2.push('£' + toMoney(0));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = netAvgDodgems2;
    netAvgDodgems2.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });

    currentRow += 2;
    worksheet.getRow(currentRow).values = [
      ...['Photos Average p/h (Net)'],
      ...displaySku,
    ];
    currentRow++;

    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
        worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'e2e2e2' },
        };
        worksheet.getCell(`${columnLetter}${currentRow}`).font = {
          color: { argb: 'bfbfbf' },
        };
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });
    const netTotalAttendancesRow5 = [];

    netTotalAttendancesRow5.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return sum + item.attendance;
      }, 0);
      netTotalAttendancesRow5.push(totalAttendance.toString());
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow5;

    currentRow += 1;

    // Add a new row for "Gross Totals"
    const netAvgDodgems3 = [];

    // First cell: "Gross Totals of Dodgems"
    netAvgDodgems3.push('Net Avg Photos Order p/h');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      netAvgDodgems3.push('£' + toMoney(0));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = netAvgDodgems3;
    netAvgDodgems3.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });
    currentRow += 2;

    worksheet.mergeCells(`A${currentRow}`, `Z${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = `ON-SITE SALES TOTALS`;
    worksheet.getCell(`A${currentRow}`).font = { size: 20 };
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'left',
      vertical: 'middle',
    };
    worksheet.getRow(currentRow).height = 40;
    worksheet.getRow(currentRow).width = 40;

    currentRow += 2;
    worksheet.getRow(currentRow).values = [
      ...['Dodgems On-Site Sales'],
      ...displaySku,
    ];
    currentRow++;

    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
        worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'e2e2e2' },
        };
        worksheet.getCell(`${columnLetter}${currentRow}`).font = {
          color: { argb: 'bfbfbf' },
        };
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });
    const attendance1 = [];

    attendance1.push('Gross Totals of Dodgems');
    skuKeys.forEach(sku => {
      attendance1.push('£0.00');
    });

    worksheet.getRow(currentRow).values = attendance1;
    attendance1.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });
    currentRow += 1;

    const netTotalDodgems = [];

    netTotalDodgems.push('Net Totals of Dodgems');
    skuKeys.forEach(sku => {
      netTotalDodgems.push('£0.00');
    });

    worksheet.getRow(currentRow).values = netTotalDodgems;
    currentRow += 1;

    const netTotalAttendancesRow6 = [];

    netTotalAttendancesRow6.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return sum + item.attendance;
      }, 0);
      netTotalAttendancesRow6.push(totalAttendance.toString());
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow6;

    currentRow += 1;

    // Add a new row for "Gross Totals"
    const netAvgDodgems4 = [];

    // First cell: "Gross Totals of Dodgems"
    netAvgDodgems4.push('Net Avg Dodgems Order p/h');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      netAvgDodgems4.push('£' + toMoney(0));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = netAvgDodgems4;
    currentRow += 2;

    worksheet.getRow(currentRow).values = [
      ...['Drinks On-Site Sales'],
      ...displaySku,
    ];
    currentRow++;

    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
        worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'e2e2e2' },
        };
        worksheet.getCell(`${columnLetter}${currentRow}`).font = {
          color: { argb: 'bfbfbf' },
        };
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });
    const attendance2 = [];

    attendance2.push('Gross Totals of Drinks');
    skuKeys.forEach(sku => {
      attendance2.push('£0.00');
    });

    worksheet.getRow(currentRow).values = attendance2;
    attendance2.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });
    currentRow += 1;

    const netTotalDrink = [];

    netTotalDrink.push('Net Totals of Drinks');
    skuKeys.forEach(sku => {
      netTotalDrink.push('£0.00');
    });

    worksheet.getRow(currentRow).values = netTotalDrink;
    currentRow += 1;

    const netTotalAttendancesRow7 = [];

    netTotalAttendancesRow7.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return sum + item.attendance;
      }, 0);
      netTotalAttendancesRow7.push(totalAttendance.toString());
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow7;

    currentRow += 1;

    // Add a new row for "Gross Totals"
    const netAvgDodgems5 = [];

    // First cell: "Gross Totals of Dodgems"
    netAvgDodgems5.push('Net Avg Drinks Order p/h');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      netAvgDodgems5.push('£' + toMoney(0));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = netAvgDodgems5;

    currentRow += 2;

    worksheet.getRow(currentRow).values = [
      ...['Casino On-Site Sales'],
      ...displaySku,
    ];
    currentRow++;

    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
        worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'e2e2e2' },
        };
        worksheet.getCell(`${columnLetter}${currentRow}`).font = {
          color: { argb: 'bfbfbf' },
        };
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });
    const attendance3 = [];

    attendance3.push('Gross Totals of Casino');
    skuKeys.forEach(sku => {
      attendance3.push('£0.00');
    });

    worksheet.getRow(currentRow).values = attendance3;
    attendance3.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });
    currentRow += 1;

    const netTotalCasino = [];

    netTotalCasino.push('Net Totals of Casino');
    skuKeys.forEach(sku => {
      netTotalCasino.push('£0.00');
    });

    worksheet.getRow(currentRow).values = netTotalCasino;
    currentRow += 1;

    const netTotalAttendancesRow8 = [];

    netTotalAttendancesRow8.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return sum + item.attendance;
      }, 0);
      netTotalAttendancesRow8.push(totalAttendance.toString());
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow8;

    currentRow += 1;

    // Add a new row for "Gross Totals"
    const netAvgDodgems6 = [];

    // First cell: "Gross Totals of Dodgems"
    netAvgDodgems6.push('Net Avg Casino Order p/h');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      netAvgDodgems6.push('£' + toMoney(0));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = netAvgDodgems6;

    currentRow += 2;

    worksheet.getRow(currentRow).values = [
      ...['Photos On-Site Sales'],
      ...displaySku,
    ];
    currentRow++;

    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
        worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'e2e2e2' },
        };
        worksheet.getCell(`${columnLetter}${currentRow}`).font = {
          color: { argb: 'bfbfbf' },
        };
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });
    const attendance4 = [];

    attendance4.push('Gross Totals of Photos');
    skuKeys.forEach(sku => {
      attendance4.push('£0.00');
    });

    worksheet.getRow(currentRow).values = attendance4;
    currentRow += 1;

    const netTotalPhoto = [];

    netTotalPhoto.push('Net Totals of Photos');
    skuKeys.forEach(sku => {
      netTotalPhoto.push('£0.00');
    });

    worksheet.getRow(currentRow).values = netTotalPhoto;
    netTotalPhoto.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });
    currentRow += 1;

    const netTotalAttendancesRow9 = [];

    netTotalAttendancesRow9.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return sum + item.attendance;
      }, 0);
      netTotalAttendancesRow9.push(totalAttendance.toString());
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow9;

    currentRow += 1;

    // Add a new row for "Gross Totals"
    const netAvgDodgems7 = [];

    // First cell: "Gross Totals of Dodgems"
    netAvgDodgems7.push('Net Avg Photos Order p/h');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      netAvgDodgems7.push('£' + toMoney(0));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = netAvgDodgems7;

    currentRow += 2;
    worksheet.mergeCells(`A${currentRow}`, `Z${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = `PREORDER SALES TOTALS`;
    worksheet.getCell(`A${currentRow}`).font = { size: 20 };
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'left',
      vertical: 'middle',
    };
    worksheet.getRow(currentRow).height = 40;
    worksheet.getRow(currentRow).width = 40;

    currentRow += 2;
    // Set price_gross and product_kpi_section in the corresponding row and column
    worksheet.getRow(currentRow).values = [
      ...['Dodgems Pre-orders'],
      ...displaySku,
    ];

    currentRow++;
    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        if (result[date][sku].hasOwnProperty(3)) {
          const { price_gross, product_kpi_section } = result[date][sku][3];
          worksheet.getCell(`${columnLetter}${currentRow}`).value =
            product_kpi_section === 3 ? '£' + toMoney(price_gross) : '£0.00';
        } else {
          worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
          worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'e2e2e2' },
          };
          worksheet.getCell(`${columnLetter}${currentRow}`).font = {
            color: { argb: 'bfbfbf' },
          };
        }
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });

    // Add a new row for "Gross Totals"
    const grossTotalsRow = [];

    // First cell: "Gross Totals of Dodgems"
    grossTotalsRow.push('Gross Totals of Dodgems');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      const totalForSku = groupedBySku[sku].reduce((sum, item) => {
        return item.product_kpi_section === 3
          ? sum + item.price_gross
          : sum + 0;
      }, 0);
      grossTotalsRow.push('£' + toMoney(totalForSku));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = grossTotalsRow;
    grossTotalsRow.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });

    currentRow += 1;

    // Add a new row for "Net Totals"
    const netTotalsRow = [];

    // First cell: "Net Totals of Dodgems"
    netTotalsRow.push('Net Totals of Dodgems');

    // For each SKU, calculate the total price_net across all dates
    skuKeys.forEach(sku => {
      const totalNetForSku = groupedBySku[sku].reduce((sum, item) => {
        return item.product_kpi_section === 3 ? sum + item.price_net : sum + 0;
      }, 0);
      netTotalsRow.push('£' + toMoney(totalNetForSku));
    });

    // Add the net totals row to the worksheet
    worksheet.getRow(currentRow).values = netTotalsRow;

    currentRow += 1;

    // Add a new row for "Net Totals"
    const netTotalAttendancesRow = [];

    netTotalAttendancesRow.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return item.product_kpi_section === 3 ? sum + item.attendance : sum + 0;
      }, 0);
      netTotalAttendancesRow.push(totalAttendance.toString());
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow;

    currentRow += 2;

    worksheet.getRow(currentRow).values = [
      ...['Drinks Pre-orders'],
      ...displaySku,
    ];

    currentRow++;
    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        if (result[date][sku].hasOwnProperty(2)) {
          const { price_gross } = result[date][sku][2];
          worksheet.getCell(`${columnLetter}${currentRow}`).value =
            '£' + toMoney(price_gross);
        } else {
          worksheet.getCell(`${columnLetter}${currentRow}`).value = '£0.00';
          worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'e2e2e2' },
          };
          worksheet.getCell(`${columnLetter}${currentRow}`).font = {
            color: { argb: 'bfbfbf' },
          };
        }
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });

    // Add a new row for "Gross Totals"
    const grossTotalsRow2 = [];

    // First cell: "Gross Totals of Dodgems"
    grossTotalsRow2.push('Gross Totals of Drinks');

    // For each SKU, calculate the total price_gross across all dates
    skuKeys.forEach(sku => {
      const totalForSku = groupedBySku[sku].reduce((sum, item) => {
        return item.product_kpi_section === 2
          ? sum + item.price_gross
          : sum + 0;
      }, 0);
      grossTotalsRow2.push('£' + toMoney(totalForSku));
    });

    // Add the gross totals row to the worksheet
    worksheet.getRow(currentRow).values = grossTotalsRow2;
    grossTotalsRow2.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });

    currentRow += 1;

    // Add a new row for "Net Totals"
    const netTotalsRow2 = [];

    // First cell: "Net Totals of Dodgems"
    netTotalsRow2.push('Net Totals of Drinks');

    // For each SKU, calculate the total price_net across all dates
    skuKeys.forEach(sku => {
      const totalNetForSku = groupedBySku[sku].reduce((sum, item) => {
        return item.product_kpi_section === 2 ? sum + item.price_net : sum + 0;
      }, 0);
      netTotalsRow2.push('£' + toMoney(totalNetForSku));
    });

    // Add the net totals row to the worksheet
    worksheet.getRow(currentRow).values = netTotalsRow2;
    currentRow += 2;

    worksheet.mergeCells(`A${currentRow}`, `Z${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = `ATTENDANCE TOTALS`;
    worksheet.getCell(`A${currentRow}`).font = { size: 20 };
    worksheet.getCell(`A${currentRow}`).alignment = {
      horizontal: 'left',
      vertical: 'middle',
    };
    worksheet.getRow(currentRow).height = 40;
    worksheet.getRow(currentRow).width = 40;
    currentRow += 2;

    worksheet.getRow(currentRow).values = [...[''], ...displaySku];
    currentRow += 1;
    Object.keys(result).forEach(date => {
      // Set the date in the first column of the current row
      worksheet.getCell(`A${currentRow}`).value = date;

      // For each SKU, set the values in the respective columns
      skuKeys.forEach((sku, index) => {
        const columnLetter = getColumnLetter(2 + index); // Start from column B (2)
        const attendances = result[date][sku];
        const attendance = Object.values(attendances).reduce(
          (sum, item) => sum + item.attendance,
          0,
        );

        worksheet.getCell(`${columnLetter}${currentRow}`).value =
          attendance ?? '0';
        if (!attendance) {
          worksheet.getCell(`${columnLetter}${currentRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'e2e2e2' },
          };
          worksheet.getCell(`${columnLetter}${currentRow}`).font = {
            color: { argb: 'bfbfbf' },
          };
        }
      });

      currentRow += 1; // Move to the next row (2 rows for each date: one for price_gross and one for product_kpi_section)
    });

    // Add a new row for "Net Totals"
    const netTotalAttendancesRow2 = [];

    netTotalAttendancesRow2.push('Attendance');
    skuKeys.forEach(sku => {
      const totalAttendance = groupedBySku[sku].reduce((sum, item) => {
        return item.attendance ? sum + item.attendance : sum + 0;
      }, 0);
      netTotalAttendancesRow2.push(totalAttendance);
    });

    worksheet.getRow(currentRow).values = netTotalAttendancesRow2;
    netTotalAttendancesRow2.forEach((_, index) => {
      const cell = worksheet.getCell(
        `${getColumnLetter(index + 1)}${currentRow}`,
      ); // Get the cell
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Set your desired color here (e.g., yellow)
      };
    });

    currentRow += 2;

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `DrinkSundries_Report_${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
      );
    });
  };

  return (
    <div className="inner_wrapper">
      {salesContactSourcesLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Typography>Reports</Typography>
          <Typography>Drinks Sundries Totals Report</Typography>
        </Breadcrumbs>
      </div>

      <ReportHeader name="Drinks Sundries Totals Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Drinks & Dodgems KPIs Export</h4>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <div className="drinks_sundries_wrap">
            <ul className="d-block bg-white p-0">
              <li className="bg_gray_box px-3 py-2 mb-2">
                <Row className="align-items-center">
                  <Col xs={4}>
                    <label className="text_small">Select Year:</label>
                  </Col>
                  <Col xs={8}>
                    <FormGroup className="w-100">
                      <FormControl className="event_select">
                        <Select
                          labelId="year-label"
                          id="year"
                          name="year"
                          value={reportData?.year}
                          onChange={handleChange}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          {yearsPrevious
                            ?.slice()
                            ?.sort((a, b) => b - a)
                            ?.map((item, index) => {
                              return (
                                <MenuItem value={item} key={index}>
                                  {item}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </Col>
                </Row>
              </li>
              <li className="bg_gray_box px-3 py-2 mb-0">
                <Row className="align-items-center">
                  <Col xs={4}>
                    <label className="text_small">Re-run the Report:</label>
                  </Col>
                  <Col xs={8}>
                    <Button
                      className="btn_primary small"
                      onClick={handleRunReport}
                    >
                      Recreate Excel File
                    </Button>
                    <span className="text_small ms-2 text_light">
                      (This may take a minute)
                    </span>
                  </Col>
                </Row>
              </li>
              <ul className="pdf_link_wrap bg-white my-3 d-flex align-items-center p-0">
                {Object.entries(salesKpiReport)?.length > 0 && (
                  <>
                    <li className="me-3">
                      <h5 className="m-0">Download the Report:</h5>
                    </li>
                    <li className="me-3">
                      <span
                        className="d-flex align-items-center cursor-pointer"
                        onClick={() => {
                          downloadexcel();
                        }}
                      >
                        <div className="pdf_icon">
                          <img src={ExcelIcon} alt="Print Icon" />
                        </div>
                        <div className="pdf_text">
                          <p className="mb-0 ms-2">Download Excel File</p>
                        </div>
                      </span>
                    </li>
                    <li className="me-3">
                      <p className="m-0">
                        - Created:{' '}
                        {moment(new Date()).format('MMMM DD YYYY HH:MM:SS')}
                      </p>
                    </li>
                  </>
                )}
              </ul>
            </ul>
          </div>
        </div>
        {/* <DrinksSundriesReportTable /> */}
      </div>
    </div>
  );
}
