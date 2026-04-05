import React, { useEffect, useMemo, useState } from 'react';
import {
  Pagination,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DataNotFound from 'Components/Common/DataNotFound';
import moment from 'moment';
import { Col, Row, Table } from 'react-bootstrap';
import { getPaginationData, getTotalPages } from 'utils/common';
import useSortable from 'utils/useSortable';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import { directionNoteList } from 'utils/FieldValues';

const pageSize = 5;

export const BookNoteTable = ({ noteData }) => {
  const [searchBookNotes, setSearchBookNotes] = useState('');
  const [noteListData, setNoteListData] = useState([]);
  const [currentPage, setCurrentPage] = useState({
    noteCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.noteCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  useEffect(() => {
    setNoteListData(noteData);
  }, [noteData]);
  const setCurrentPageHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalNoteRecordPage = useMemo(() => {
    const totalNoteRecordCount = getTotalPages(noteListData, pageSize);
    return totalNoteRecordCount;
  }, [noteListData]);

  const noteCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      noteListData,
      currentPage.noteCurrentPage,
      pageSize,
      totalNoteRecordPage,
      setCurrentPageHandler,
      'noteCurrentPage',
    );
    return currentDataList;
  }, [noteListData, currentPage?.noteCurrentPage]);

  const includeColumns = ['subject', 'user'];
  function Search(nameKey) {
    const lowercasedValue = nameKey.toLowerCase().trim();
    if (lowercasedValue === '') setNoteListData(noteData);
    else {
      const filteredData = noteData?.filter(item => {
        return Object.keys(item).some(key =>
          includeColumns?.includes(key)
            ? item[key].toString().toLowerCase().includes(lowercasedValue)
            : false,
        );
      });
      setNoteListData(filteredData);
    }
  }

  const directionIcon = item => {
    let newDirection = directionNoteList?.filter(
      data => data?.directionValue === item,
    );
    if (newDirection?.length > 0) {
      return (
        <img
          src={newDirection[0]?.lableIcon}
          alt="Chat icon"
          className="me-2 icon_grayscale"
        />
      );
    } else {
      return '';
    }
  };
  const { itemsActive, requestSortActive } = useSortable(noteCurrentData);

  return (
    <>
      {/* {noteCurrentData?.length > 0 ? ( */}
      <div className="inner_table">
        <Row className="justify-content-end mb-1">
          <Col xs={5}>
            <div className="search_wrapper_common">
              <input
                type="text"
                placeholder="Search"
                className="form-control"
                onChange={e => setSearchBookNotes(e.target.value)}
              />
              <button className="btn_primary small">
                <SearchOutlinedIcon
                  onClick={() => {
                    Search(searchBookNotes);
                  }}
                />
              </button>
            </div>
          </Col>
        </Row>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <span onClick={() => requestSortActive('subject')}>
                    Subject
                  </span>
                </TableCell>
                <TableCell>
                  <span onClick={() => requestSortActive('user')}>User</span>
                </TableCell>
                <TableCell>
                  <span onClick={() => requestSortActive('date')}>
                    Date & Time
                  </span>
                </TableCell>
                <TableCell>
                  <span>Act.</span>
                </TableCell>
                <TableCell>
                  <span>Cor.</span>
                </TableCell>
                <TableCell>
                  <span>Dir</span>
                </TableCell>
              </TableRow>
            </TableHead>
            {itemsActive?.map(noteData => {
              return (
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <span className="description_Wrapper">
                        {noteData?.subject ? noteData?.subject : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="user_wrapper">
                        {noteData?.user ? noteData?.user?.name : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="date_wrapper">
                        {noteData?.date
                          ? moment(noteData?.date).format('LLLL')
                          : '-'}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <i
                        className={`fa fa-${noteData?.action?.icon} fa-xl`}
                        style={{
                          color: noteData?.action?.icon_colour,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <i
                        className={`fa fa-${noteData?.correspondance?.icon} fa-xl`}
                        style={{
                          color: noteData?.correspondance?.icon_colour,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {/* <img src={DirectionIcon} alt="Direction icon" /> */}
                      {directionIcon(noteData?.direction)}
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
                    {Math.min(activeIndexOfLastItem, noteListData?.length)} of{' '}
                    {noteListData?.length} entries
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
      {/* ) : (
        ''
      )} */}
    </>
  );
};
