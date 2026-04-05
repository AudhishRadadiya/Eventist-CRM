import { useEffect, useMemo, useState } from 'react';
import {
  Pagination,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import moment from 'moment';
import { Col, Row, Stack, Table } from 'react-bootstrap';
import { getPaginationData, getTotalPages } from 'utils/common';
import useSortable from 'utils/useSortable';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import { directionNoteList } from 'utils/FieldValues';
import DataNotFound from 'Components/Common/DataNotFound';

const pageSize = 5;

export const BookingNoteTable = ({ noteData }) => {
  const [searchBookNotes, setSearchBookNotes] = useState('');

  const [noteListData, setNoteListData] = useState([]);
  const [currentPage, setCurrentPage] = useState({
    noteCurrentPage: 1,
  });

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
  }, [noteListData, currentPage.noteCurrentPage]);

  const includeColumns = ['subject', 'user?.name'];

  function Search(nameKey) {
    const lowercasedValue = nameKey.toLowerCase().trim();
    if (lowercasedValue === '') setNoteListData(noteData);
    else {
      const filteredData = noteData.filter(item => {
        return includeColumns.some(key => {
          const value = key === 'user?.name' ? item.user?.name : item[key];
          return (
            value && value.toString().toLowerCase().includes(lowercasedValue)
          );
        });
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

  useEffect(() => {
    let noteListArray = [];
    noteData.map(i => {
      noteListArray.push({ ...i, user_name: i?.user?.name });
      return noteListArray;
    });

    setNoteListData(noteListArray);
  }, [noteData]);

  return (
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
                <span onClick={() => requestSortActive('user_name')}>User</span>
              </TableCell>
              <TableCell>
                <span onClick={() => requestSortActive('date')}>
                  Date & Time
                </span>
              </TableCell>
              <TableCell>Act.</TableCell>
              <TableCell>Cor.</TableCell>
              <TableCell>Dir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsActive?.map(noteData => {
              return (
                <TableRow key={noteData?._id}>
                  <TableCell>
                    <span className="description_Wrapper">
                      {noteData?.subject ? noteData?.subject : ''}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="user_wrapper">
                      {noteData?.user ? noteData?.user?.name : ''}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="date_wrapper">
                      {noteData?.date
                        ? moment(noteData?.date).format('LLLL')
                        : '-'}
                    </span>
                  </TableCell>
                  <TableCell
                    align="center"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={noteData?.action?.icon}
                  >
                    <i
                      className={`fa fa-${noteData?.action?.icon} fa-xl`}
                      style={{
                        color: noteData?.action?.icon_colour,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={noteData?.correspondance?.icon}
                  >
                    <i
                      className={`fa fa-${noteData?.correspondance?.icon} fa-xl`}
                      style={{
                        color: noteData?.correspondance?.icon_colour,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={directionNoteList
                      ?.filter(
                        data => data?.directionValue === noteData?.direction,
                      )
                      .map(data => data?.labelName)
                      .join('')}
                  >
                    {/* <img src={DirectionIcon} alt="Direction icon" /> */}
                    {directionIcon(noteData?.direction)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="table_pagination_wrap">
        {itemsActive?.length > 0 ? (
          <Row className="g-0 align-items-center my-2">
            <Col sm={6}>
              <div className="total_entry">
                <p className="m-0">
                  Showing 1 to {totalNoteRecordPage} of {itemsActive?.length}{' '}
                  entries
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
  );
};
