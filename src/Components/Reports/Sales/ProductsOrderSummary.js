import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import PrintIcon from '../../../Assets/Img/print-icon.svg';
import PdfIcon from '../../../Assets/Img/pdf-icon.svg';
import { Button, Col, Row } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExcelIcon from '../../../Assets/Img/excel-icon.svg';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { yearsPrevious } from 'utils/FieldValues';
import ReportHeader from 'Components/Common/ReportHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getProductsReport } from 'store/reducers/Report/salesReport.slice';
import { ListItemText, OutlinedInput } from '@mui/material';
import { getProductListData } from 'store/reducers/Admin/Events/ProductCategory/product.slice';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import ProductsOrderSummaryTable from './ProductsOrderSummaryTable';
import { exportProductOrderReportPDF } from 'utils/useExportPDF';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import PdfPopup from 'Components/Common/pdfPopup';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const reportTypeList = [
  {
    id: 1,
    name: 'Totals',
  },
  {
    id: 0,
    name: 'Booking',
  },
  { id: 2, name: 'Both' },
];

export default function ProductsOrderSummary() {
  const dispatch = useDispatch();
  const { salesProductReport, salesContactSourcesLoading } = useSelector(
    ({ salesReport }) => salesReport,
  );
  const { activeEventList } = useSelector(({ parties }) => parties);
  const { activeProductList } = useSelector(({ product }) => product);

  const [searchParams] = useSearchParams();
  const isProductId = new URLSearchParams(searchParams).get('productId');

  const [isReportCheck, setIsReportCheck] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [reportData, setReportData] = useState({
    select_year: new Date().getFullYear(),
    product_ids: [],
    report_type: 0,
    event_id: 'All',
    split_totals_by_venue: false,
    start_date: new Date(),
    end_date: new Date(),
  });

  useEffect(() => {
    setReportData({
      ...reportData,
      event_id: activeEventList[0]?._id,
    });
  }, [activeEventList]);

  const [activeAccountListArray, setActiveAccountListArray] = useState([]);

  useEffect(() => {
    dispatch(getEventListData());
    dispatch(getProductListData());
  }, []);

  const handleRunReport = () => {
    dispatch(
      getProductsReport({
        select_year: reportData?.select_year,
        product_ids: reportData?.product_ids,
        report_type: reportData?.report_type,
        event_id: reportData?.event_id === 'Select' ? '' : reportData.event_id,
        split_totals_by_venue: reportData?.split_totals_by_venue,
        start_date: moment(new Date(reportData?.start_date)).format(
          'YYYY-MM-DD',
        ),
        end_date: moment(new Date(reportData?.end_date)).format('YYYY-MM-DD'),
      }),
    );
    setIsReportCheck(true);
    localStorage.setItem('stateData', JSON.stringify(reportData));
  };

  useEffect(() => {
    if (activeProductList?.length > 0) {
      let dummyList = [];
      activeProductList.map(i => {
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData });
          return { ...groupData };
        });
        return dummyList;
      });
      setActiveAccountListArray(dummyList);
    }
  }, [activeProductList]);

  const handleChange = e => {
    const { name, value } = e.target;

    setReportData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const productOptions = activeAccountListArray?.map(product => ({
    label: `${product?.internal_name} - ${product?.public_name}`,
    value: product?._id,
    years: product?.years,
  }));

  useEffect(() => {
    if (isProductId) {
      setReportData({
        ...reportData,
        product_ids: [isProductId],
        select_year: new Date().getFullYear(),
        report_type: 2,
      });
    } else {
      setReportData({ ...reportData, product_ids: [] });
    }
  }, [isProductId]);

  const handleSelectAll = () => {
    if (reportData.product_ids.length === productOptions.length) {
      setReportData({
        ...reportData,
        product_ids: [],
      });
    } else {
      setReportData({
        ...reportData,
        product_ids: productOptions.map(item => item.value),
      });
    }
  };

  const downloadexcel = () => {
    const workbook = new ExcelJS.Workbook();
    const momentFormat = 'DD/MM/YYYY HH:mm:ss';
    let date = new Date();
    workbook.created = date;
    workbook.modified = date;
    const worksheet = workbook.addWorksheet('My Sheet', {});
    worksheet.getRow(1).values = ['Created', moment(date).format(momentFormat)];

    if (!(salesProductReport?.product_order?.length === 0)) {
      worksheet.getRow(2).values = [
        'Booking',
        'Venue',
        'Event Date',
        'Company/Contact Name',
        'Quantity',
        'Product Name',
        'Bin#',
      ];

      worksheet.getRow(2).font = {
        bold: true,
      };

      worksheet.columns = [
        { key: 'booking_ref', width: 17 },
        { key: 'event_name', width: 17 },
        { key: 'event_date', width: 17 },
        { key: 'contact', width: 17 },
        { key: 'quantity', width: 17 },
        { key: 'product', width: 17 },
        { key: 'bin_id', width: 17 },
      ];

      salesProductReport?.product_order?.forEach(data => {
        worksheet.addRow({
          booking_ref: data.booking_ref,
          event_name: data.event_name,
          event_date: moment(data.event_date).format('DD/MM/YYYY'),
          contact: data.contact,
          quantity: data.quantity,
          product: data.product,
          bin_id: data.bin_id,
        });
      });
    }
    if (!(salesProductReport?.result?.length === 0)) {
      worksheet.addRow();
      const getRow2Values = ['Venue', 'Quantity', 'Product Name', 'Bin#'];
      worksheet.addRow(getRow2Values);
      worksheet.columns = [
        { key: 'event_name', width: 17 },
        { key: 'Quantity', width: 17 },
        { key: 'Product_name', width: 17 },
        { key: 'bin', width: 17 },
      ];
      salesProductReport?.result?.forEach(elem => {
        worksheet.addRow({
          event_name: elem?.event_name,
          Quantity: elem?.quantity,
          Product_name: elem?.product,
          bin: elem?.bin_id,
        });
      });
    }

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(
        blob,
        `Product_Order_Summary_Report_${moment(new Date()).format(
          'DD-MM-YYYY',
        )}.xlsx`,
      );
    });
  };

  const handlePdf = async () => {
    const data = await exportProductOrderReportPDF({
      salesProductReport,
    });
    setPdfUrl(data);
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
          <Typography>Products Order Summary</Typography>
        </Breadcrumbs>
      </div>
      <ReportHeader name="Products Report" />
      <div className="report_wrap_mian">
        <h4 className="fw_600">Products Order Summary</h4>
        <h5 className="text_primary">Run Report For :</h5>
        <div className="bg_white_box p-3 report_filter_wrap mb-3">
          <div className="product_order_wrapper">
            <div className="bg_gray_box p-2 mb-2">
              <Row>
                <Col xs={4}>
                  <div className="form-group inline date_picker mb-0">
                    <span className="label">Select Year:</span>
                    <FormGroup className="flex-row flex-nowrap">
                      <FormControl className="event_select">
                        <Select
                          labelId="select_year-label"
                          id="select_year"
                          name="select_year"
                          value={reportData?.select_year}
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
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="form-group inline date_picker mb-0">
                    <span className="label">Report Type:</span>
                    <FormGroup className="flex-row flex-nowrap">
                      <FormControl className="event_select">
                        <Select
                          labelId="Enquiries-label"
                          id="Enquiries"
                          name="report_type"
                          value={reportData?.report_type}
                          onChange={handleChange}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          <MenuItem value="Select">Select</MenuItem>
                          {reportTypeList?.map((item, index) => {
                            return (
                              <MenuItem key={item?.id} value={item?.id}>
                                {item?.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="form-group inline align-items-start date_picker venue_select_wrap mb-0">
                    <span className="label mt-2">Venue:</span>
                    <FormGroup className="flex-column flex-nowrap">
                      <FormControl className="event_select mb-2">
                        <Select
                          labelId="event_id-label"
                          id="event_id"
                          name="event_id"
                          value={reportData?.event_id}
                          onChange={handleChange}
                          defaultValue="Select"
                          className="select_wrap "
                        >
                          <MenuItem value="Select">Select</MenuItem>
                          {activeEventList?.map(item => {
                            return (
                              <MenuItem value={item?._id} key={item?._id}>
                                {item?.internal_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="split_totals_by_venue"
                            checked={reportData?.split_totals_by_venue}
                            onChange={e =>
                              setReportData(prevState => ({
                                ...prevState,
                                split_totals_by_venue: e.target.checked,
                              }))
                            }
                          />
                        }
                        label="Split totals by venue"
                        className="mb-0"
                      />
                    </FormGroup>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="bg_gray_box p-2">
              <Row>
                <Col md={4}>
                  <div className="form-group inline label_big mb-0">
                    <span className="label">Select Product:</span>
                    <FormGroup className="input_wrap">
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          className="Multiselect_checkbox"
                          multiple
                          name="product_ids"
                          value={reportData?.product_ids}
                          onChange={handleChange}
                          input={<OutlinedInput />}
                          renderValue={selected => {
                            if (selected?.length <= 3) {
                              return productOptions
                                .filter(item => selected?.includes(item.value))
                                .map(item => item.label);
                            } else if (
                              selected.length === productOptions.length
                            ) {
                              return 'All Selected';
                            } else {
                              return `${reportData?.product_ids?.length} of ${activeAccountListArray?.length} selected`;
                            }
                          }}
                          MenuProps={MenuProps}
                        >
                          <MenuItem onClick={handleSelectAll}>
                            <Checkbox
                              checked={
                                reportData.product_ids.length ===
                                productOptions.length
                              }
                            />
                            <ListItemText primary={'[Select All]'} />
                          </MenuItem>
                          {productOptions.map(item => {
                            return (
                              item?.years?.includes(
                                reportData?.select_year,
                              ) && (
                                <MenuItem key={item?.value} value={item?.value}>
                                  <Checkbox
                                    checked={
                                      reportData?.product_ids.indexOf(
                                        item?.value,
                                      ) > -1
                                    }
                                  />
                                  <ListItemText primary={item?.label} />
                                </MenuItem>
                              )
                            );
                          })}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="form-group inline date_picker mb-0">
                    <span className="label">Start Date:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={reportData?.start_date}
                        inputFormat="DD-MM-YYYY"
                        onChange={newValue => {
                          if (!isNaN(new Date(newValue).getTime()))
                            setReportData(prevState => ({
                              ...prevState,
                              start_date: moment(newValue?.toDate()).format(
                                'YYYY-MM-DD',
                              ),
                            }));
                        }}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="form-group inline date_picker mb-0">
                    <span className="label">End Date:</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={reportData?.end_date}
                        inputFormat="DD-MM-YYYY"
                        onChange={newValue => {
                          setReportData(prevState => ({
                            ...prevState,
                            end_date: moment(newValue?.toDate()).format(
                              'YYYY-MM-DD',
                            ),
                          }));
                        }}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <Button className="btn_primary small mt-3" onClick={handleRunReport}>
            Run Report
          </Button>

          {isReportCheck === false && (
            <p className="m-0 text_light">
              Please select a Product and date in order to run the report
            </p>
          )}
          {isReportCheck && (
            <>
              <ul className="pdf_link_wrap bg-white my-3 d-flex align-items-center p-0">
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
              </ul>
              <ul className="pdf_link_wrap my-3 d-flex">
                <li className="me-3">
                  <button
                    className="d-flex align-items-center"
                    onClick={() => {
                      localStorage.setItem(
                        'stateData',
                        JSON.stringify(reportData),
                        window.open(
                          '/reports/print/products-order-summary',
                          '_blank',
                        ),
                      );
                    }}
                  >
                    <div className="pdf_icon">
                      <img src={PrintIcon} alt="Print Icon" />
                    </div>
                    <span className="pdf_text">
                      <p>Printable View</p>
                    </span>
                  </button>
                  {/* </Link> */}
                </li>
                <li>
                  <Link to="">
                    <div className="pdf_icon">
                      <img onClick={handlePdf} src={PdfIcon} alt="Pdf Icon" />
                    </div>
                    <div className="pdf_text">
                      <p onClick={handlePdf}>View as PDF</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      <ProductsOrderSummaryTable
        salesProductReportData={salesProductReport}
        isLocalStorageGetData={true}
      />
      <PdfPopup url={pdfUrl} onPdfPopupClose={() => setPdfUrl('')} />
    </div>
  );
}
