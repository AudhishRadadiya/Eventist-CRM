import React, { useEffect, useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  csvDataGetGlobalSearch,
  getGlobalSearch,
} from 'store/reducers/SearchPanel/globalSearch.slice';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import useSortable from 'utils/useSortable';
import DataNotFound from './DataNotFound';
import { Col, Row, Stack } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Loader from './Loader';
import ExcelIcon from '../../Assets/Img/excel-icon.svg';
import EyeIcon from '../../Assets/Img/eye.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

let pageSize = 10;

const SearchResult = ({ result, searchData, keys }) => {
  const dispatch = useDispatch();
  const { globalSearchData, globalSearchLoading, mainSearchLoading } =
    useSelector(({ globalSearch }) => globalSearch);

  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;
  const [tableSearchData, setTableSearchData] = useState('');

  const updatedObject = {
    ...(searchData?.data ? searchData?.data : result?.data),
  };

  const checked = globalSearchData;

  const checkData = globalSearchData?.globalData;

  const checkTotalData = globalSearchData?.totalPages;

  const checkTotal = globalSearchData?.total;

  const activeCurrentData = useMemo(() => {
    if (Object.entries(checked).length > 0) {
      return checkData;
    } else {
      return [];
    }
  }, [checkData, checked]);
  const handlePageStartIndex = (page, limit) => {
    let startIndex = (page - 1) * limit;
    return startIndex;
  };

  const handlePageChange = page => {
    dispatch(
      getGlobalSearch({
        start: handlePageStartIndex(page, pageSize),
        limit: pageSize,
        data: updatedObject,
      }),
    );
  };
  const handleTableSearch = e => {
    e.preventDefault();
    updatedObject.ref_no = tableSearchData;
    dispatch(
      getGlobalSearch({
        start: 0,
        limit: pageSize,
        data: updatedObject,
      }),
    );
  };

  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);
  const downloadCsv = async () => {
    const { payload } = await dispatch(
      csvDataGetGlobalSearch({
        ...searchData,
        data: { ...searchData?.data, for_csv: true },
      }),
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet', {});
    const data = payload;
    if (data?.length > 0) {
      worksheet.getRow(1).values = [
        'Ref',
        'Event',
        'Name',
        'Contact No.',
        'Email Primary',
        'Company',
        'Balance',
        'Office Notes',
        'Public Notes',
        'Enquired',
        'Provisional',
        'Confirmed',
        'Date',
        'Booking/Enquiry',
        'Assigned ',
        'Total paid',
        'Discount',
        'Last contacted',
        'Venue Notes',
      ];

      worksheet.getRow(1).font = {
        bold: true,
      };

      worksheet.columns = [
        { key: 'ref_no', width: 17 },
        { key: 'event', width: 17 },
        { key: 'name', width: 17 },
        { key: 'contact_no', width: 17 },
        { key: 'email_primary', width: 17 },
        { key: 'company', width: 17 },
        { key: 'balance', width: 17 },
        { key: 'office_notes', width: 17 },
        { key: 'public_notes', width: 17 },
        { key: 'enquired', width: 17 },
        { key: 'provisional', width: 17 },
        { key: 'confirmed', width: 17 },
        { key: 'date', width: 17 },
        { key: 'booking_type', width: 17 },
        { key: 'assigned_to', width: 17 },
        { key: 'paid', width: 17 },
        { key: 'discount', width: 17 },
        { key: 'last_contacted', width: 17 },
        { key: 'venue_notes', width: 17 },
      ];

      data?.forEach(data => {
        worksheet.addRow({
          ref_no: data?.ref_no,
          event: data?.event,
          name: data?.name,
          contact_no: data?.contact_no,
          email_primary: data?.email_primary,
          company: data?.company,
          balance: data?.balance,
          office_notes: data?.office_notes,
          public_notes: data?.public_notes,
          enquired: data?.enquired,
          provisional: data?.provisional,
          confirmed: data?.confirmed,
          date: data?.date && moment(data?.date).format('ddd Do MMM YYYY'),
          booking_type: data?.booking_type,
          assigned_to: data?.assigned_to,
          paid: data?.paid,
          discount: `${data?.discount}%`,
          last_contacted: data?.last_contacted,
          venue_notes: data?.venue_notes,
        });
      });
    }
    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
      saveAs(blob, `Search_${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
    });
  };

  useEffect(() => {
    dispatch(getGlobalSearch(searchData));

    setCurrentPage({ activeCurrentPage: 1 });
  }, [dispatch, keys, searchData]);

  return (
    <>
      <div className="search_result_main_wrap">
        {(globalSearchLoading || mainSearchLoading) && <Loader />}
        {searchData && (
          <div className="breadcrumb_wrap">
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/">
                <img src={HomeBreadcrumbs} alt="Home Icon" />
              </Link>
              <Typography>Search Result</Typography>
            </Breadcrumbs>
          </div>
        )}
        <div className="parties_table_Wrap">
          <Row className="align-items-center mb-3">
            <Col xs={12}>
              <form onSubmit={handleTableSearch}>
                <div className="search_wrapper_common">
                  <input
                    type="search"
                    placeholder="Search"
                    className="form-control"
                    value={tableSearchData}
                    onChange={e => setTableSearchData(e.target.value)}
                  />
                  <button
                    className="btn_primary small"
                    type="submit"
                    // onClick={handleTableSearch}
                  >
                    <SearchOutlinedIcon />
                  </button>
                </div>
              </form>
            </Col>
          </Row>
        </div>
        <div className="search_result_wrap px-2">
          <div className="table_main_Wrapper">
            <div>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <span onClick={() => requestSortActive('ref_no')}>
                          Ref
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('name')}>
                          Name
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('contact_no')}>
                          Contact No.
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          onClick={() => requestSortActive('email_primary')}
                        >
                          Email Primary
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('company')}>
                          Company
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('event')}>
                          Event
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('date')}>
                          Date of Party
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('enquired')}>
                          Enquiry
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('provisional')}>
                          Provisional
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('confirmed')}>
                          Confirmed
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('office_notes')}>
                          Office Notes
                        </span>
                      </TableCell>
                      <TableCell>Action</TableCell>

                      {/* <TableCell>
                        <span onClick={() => requestSortActive('balance')}>
                          Balance
                        </span>
                      </TableCell>

                      <TableCell>
                        <span onClick={() => requestSortActive('public_notes')}>
                          Public Notes
                        </span>
                      </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemsActive?.map((item, index) => {
                      return (
                        <TableRow
                          key={index}
                          className={
                            item?.is_cancelled
                              ? 'bg_highlight line-through'
                              : item?.booking_type === 'Enquiry'
                              ? 'bg_blue'
                              : item?.booking_type === 'Booking'
                              ? ''
                              : ''
                          }
                        >
                          <TableCell>
                            <Link
                              to={
                                item?.is_booking
                                  ? `/edit-bookings/${item?._id}`
                                  : `/edit-enquiries/${item?._id}`
                              }
                            >
                              {item?.ref_no}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link
                              to={
                                item?.is_booking
                                  ? `/edit-bookings/${item?._id}`
                                  : `/edit-enquiries/${item?._id}`
                              }
                            >
                              {item?.name}
                            </Link>
                          </TableCell>
                          <TableCell>{item?.contact_no}</TableCell>
                          <TableCell>{item?.email_primary}</TableCell>
                          <TableCell>{item?.company}</TableCell>
                          <TableCell>{item?.event}</TableCell>
                          <TableCell>
                            {item?.date &&
                              moment(item?.date).format('ddd Do MMM YYYY')}
                          </TableCell>
                          <TableCell>
                            {item?.enquired ? item?.enquired : '-'}
                          </TableCell>
                          <TableCell>{item?.provisional}</TableCell>
                          <TableCell>{item?.confirmed}</TableCell>
                          <TableCell
                            dangerouslySetInnerHTML={{
                              __html: item?.office_notes,
                            }}
                            style={{ whiteSpace: 'pre-line' }}
                          ></TableCell>

                          <TableCell>
                            <Link
                              to={
                                item?.is_booking
                                  ? `/edit-bookings/${item?._id}`
                                  : `/edit-enquiries/${item?._id}`
                              }
                            >
                              <img src={EyeIcon} alt="Eye Icon" />
                            </Link>
                          </TableCell>
                          {/* <TableCell>£{item?.balance?.toFixed(2)}</TableCell> */}
                          {/* <TableCell>{item?.balance}</TableCell> */}

                          {/* <TableCell>{item?.public_notes}</TableCell> */}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
        <div className="table_pagination_wrap">
          {itemsActive?.length ? (
            <Row className="g-0 align-items-center my-2">
              <Col sm={6}>
                <div className="total_entry">
                  <p className="m-0">
                    Showing {activeIndexOfFirstItem + 1} to{' '}
                    {activeIndexOfFirstItem + checkData?.length} of {checkTotal}{' '}
                    entries
                  </p>
                </div>
              </Col>
              <Col sm={6}>
                <div className="pagination_wrap">
                  <Stack spacing={2}>
                    <Pagination
                      count={checkTotalData}
                      page={currentPage.activeCurrentPage}
                      onChange={(e, page) => {
                        setCurrentPage({
                          ...currentPage,
                          activeCurrentPage: page,
                        });
                        handlePageChange(page);
                      }}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          ) : (
            <DataNotFound />
          )}
        </div>
        {itemsActive?.length > 0 && (
          <ul className="pdf_link_wrap bg-white my-3 d-flex align-items-center p-0">
            <li className="me-3">
              <span
                className="d-flex align-items-center cursor-pointer"
                onClick={downloadCsv}
              >
                <div className="pdf_icon">
                  <img src={ExcelIcon} alt="Print Icon" />
                </div>
                <div className="pdf_text">
                  <p className="mb-0 ms-2">Download .CSV</p>
                </div>
              </span>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default SearchResult;
