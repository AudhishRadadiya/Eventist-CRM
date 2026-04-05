import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PdfIcon from '../../Assets/Img/pdf-icon.svg';
import Logo from '../../Assets/Img/bpe_summary_bottom_logo.png';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Col, Row } from 'react-bootstrap';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { getBookingPartyETicketList } from 'store/reducers/Booking/bookingGuest.slice';
import { useDispatch, useSelector } from 'react-redux';
import useSortable from 'utils/useSortable';
import { getPaginationData, getTotalPages } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import moment from 'moment';
import Loader from 'Components/Common/Loader';

const pageSize = 5;

export default function DirectoryBrowser() {
  const { bookingId } = useParams();
  const dispatch = useDispatch();

  const { bookingPartyETicketList, bookingGuestLoading } = useSelector(
    ({ bookingGuest }) => bookingGuest,
  );

  const [searchPartyETicket, setSearchPartyETicket] = useState('');
  const [partyETicketData, setPartyETicketData] = useState([]);
  const [currentPage, setCurrentPage] = useState({
    noteCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.noteCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingPartyETicketList(bookingId));
    }
  }, [bookingId]);

  useEffect(() => {
    setPartyETicketData(
      Array.isArray(bookingPartyETicketList) ? bookingPartyETicketList : [],
    );
  }, [bookingPartyETicketList]);

  const setCurrentNoteHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalNoteRecordPage = useMemo(() => {
    const totalNoteRecordCount = getTotalPages(partyETicketData, pageSize);
    return totalNoteRecordCount;
  }, [partyETicketData]);

  const noteCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      partyETicketData,
      currentPage.noteCurrentPage,
      pageSize,
      totalNoteRecordPage,
      setCurrentNoteHandler,
      'noteCurrentPage',
    );
    return currentDataList;
  }, [partyETicketData, currentPage?.noteCurrentPage]);

  const includeColumns = ['file', 'size', 'lastModified'];

  function Search(nameKey) {
    const lowercasedValue = nameKey.toLowerCase().trim();
    if (lowercasedValue === '') setPartyETicketData(bookingPartyETicketList);
    else {
      const filteredData = bookingPartyETicketList?.filter(item => {
        return includeColumns.some(key => {
          const value = key === 'file' ? item.file : item[key];
          return (
            value && value.toString().toLowerCase().includes(lowercasedValue)
          );
        });
      });
      setPartyETicketData(filteredData);
    }
  }

  const { itemsActive, requestSortActive } = useSortable(noteCurrentData);

  return (
    <div>
      {bookingGuestLoading && <Loader />}
      <div className="Directory_logo text-center">
        <img src={Logo} alt="Logo icon" />
      </div>
      <h2 className="text-center d-block">Party eTickets</h2>
      <div className="table_main_Wrapper vertical_top">
        <Row className="justify-content-end">
          <Col xs={2}>
            <div className="search_wrapper_common">
              <input
                type="text"
                placeholder="Search"
                className="form-control"
                onChange={e => setSearchPartyETicket(e.target.value)}
              />
              <button
                className="btn_primary small"
                onClick={() => {
                  Search(searchPartyETicket);
                }}
              >
                <SearchOutlinedIcon />
              </button>
            </div>
          </Col>
        </Row>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <span onClick={() => requestSortActive('file')}>File </span>
                </TableCell>
                <TableCell className="text-end">
                  <span onClick={() => requestSortActive('size')}>Size</span>
                </TableCell>
                <TableCell className="text-end">
                  <span onClick={() => requestSortActive('lastModified')}>
                    Last Modified
                  </span>
                </TableCell>
              </TableRow>
            </TableHead>
            {itemsActive?.map((itemData, itemIndex) => {
              return (
                <TableBody key={itemIndex}>
                  <TableRow>
                    <TableCell>
                      <div
                        className="pdf_table_wrapper"
                        onClick={() => {
                          window.open(itemData?.file, '_blank');
                        }}
                      >
                        <div className="pdf_icon">
                          <img src={PdfIcon} alt="pdf icon" />
                        </div>
                        <div>
                          <Link>{itemData?.file}</Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-end">{itemData?.size}</TableCell>
                    <TableCell className="text-end">
                      {itemData?.lastModified
                        ? moment(itemData?.lastModified).format(
                            'MMM Do YYYY [at] h:mma',
                          )
                        : ''}
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          </Table>
        </TableContainer>

        <div className="table_pagination_wrap">
          {itemsActive?.length > 0 ? (
            <Row className="g-0 align-items-center my-2">
              <Col sm={6}>
                <div className="total_entry">
                  <p className="m-0">
                    Showing {activeIndexOfFirstItem + 1} to{' '}
                    {Math.min(activeIndexOfLastItem, partyETicketData?.length)}{' '}
                    of {partyETicketData?.length} entries
                  </p>
                </div>
              </Col>
              <Col sm={6}>
                <div className="pagination_wrap">
                  <Stack spacing={2}>
                    <Pagination
                      count={totalNoteRecordPage}
                      page={currentPage.noteCurrentPage}
                      onChange={(e, page) =>
                        setCurrentPage({
                          ...currentPage,
                          noteCurrentPage: page,
                        })
                      }
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          ) : (
            <DataNotFound />
          )}
        </div>
      </div>
    </div>
  );
}
