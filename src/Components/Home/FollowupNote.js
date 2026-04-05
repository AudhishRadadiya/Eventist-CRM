import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, Col, Row, Stack, Table } from 'react-bootstrap';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Pagination, TableBody, TableCell } from '@mui/material';
import EditIcon from '../../Assets/Img/edit.svg';
import TrashIcon from '../../Assets/Img/trash.svg';
import { FormControl, MenuItem, Paper, Select } from '@mui/material';

import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import {
  deleteEnquiryNote,
  updateEnquiryNote,
} from 'store/reducers/Enquiry/Note/enquiryNote.slice';
import DataNotFound from 'Components/Common/DataNotFound';
import { getFollowupNote } from 'store/reducers/Admin/System/noteTypes.slice';
import Loader from 'Components/Common/Loader';

export default function FollowupNote() {
  const { followup_note } = useSelector(({ noteTypes }) => noteTypes);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState('5');
  const [followNoteData, setFollowNoteData] = useState([]);

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    if (followup_note.length) setFollowNoteData(followup_note);
  }, [followup_note]);
  const OpenDelete = note => {
    setDeleteId(note);
    setDeletePopup(true);
  };
  const deleteNote = () => {
    dispatch(
      deleteEnquiryNote({
        _id: deleteId,
      }),
    );
  };
  const onCompleteClick = async note => {
    const payload = {
      enquiry_id: note.enquiry_id,
      action: note.action._id,
      correspondance: note.correspondance._id,
      loaded_by: note.loaded_by,
      reminder_for: note.reminder_for,
      reminder_complete: true,
    };
    await dispatch(
      updateEnquiryNote({
        _id: note._id,
        note: payload,
      }),
    );
    await dispatch(getFollowupNote());
  };

  const onEditClick = note => {
    navigate(`/edit-bookings/${note.enquiry_id}`, {
      state: {
        note: note,
        isOpenNoteModal: true,
      },
    });
  };
  const handleSearch = useCallback(
    (search = '') => {
      const searchRegex = new RegExp(search, 'i');
      let list;
      if (search.trim()) {
        list = followup_note.filter(
          _ =>
            searchRegex.test(_.reminder_for_name.toLowerCase()) ||
            searchRegex.test(_.subject.toLowerCase()),
        );
      } else {
        list = [...followup_note];
      }
      setFollowNoteData(list);
    },
    [followup_note],
  );
  const currentDataObj = useMemo(() => {
    let noteData =
      followNoteData?.length > 0 ? [...followNoteData.values()] : [];
    let totalPages = 0;
    if (noteData?.length > 0) {
      noteData = noteData?.slice(
        0 +
          (currentPage *
            (pageLimit === 'All' ? followup_note.length : pageLimit) -
            (pageLimit === 'All' ? followup_note.length : pageLimit)),
        currentPage * (pageLimit === 'All' ? followup_note.length : pageLimit),
      );
      totalPages = Math.ceil(
        followNoteData.length /
          (pageLimit === 'All' ? followup_note.length : pageLimit),
      );
    }
    return { data: noteData || [], totalRows: totalPages || 0 };
  }, [currentPage, pageLimit, followNoteData]);

  if (followup_note.length === 0) return null;
  return (
    <div className="note_table_wrap p-2 pt-3">
      <h3>Notes/Actions to Follow Up</h3>
      <div className="parties_table_Wrap">
        <Row className="align-items-center mb-3 justify-content-between">
          <Col xs={4}>
            <div className="d-flex align-items-center">
              <span className="label me-2">Show:</span>
              <FormControl fullWidth>
                <Select
                  labelId="Year-label"
                  id="Year-select"
                  name="year"
                  value={pageLimit}
                  onChange={e => {
                    setPageLimit(e.target.value);
                    setCurrentPage(1);
                  }}
                  defaultValue="Select One"
                  className="select_wrap"
                >
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="20">20</MenuItem>
                  <MenuItem value={'All'}>All</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Col>
          <Col xs={3}>
            <div className="search_wrapper_common">
              <input
                type="search"
                placeholder="Search"
                className="form-control"
                onChange={e => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                  handleSearch(e.target.value);
                }}
              />
              <button className="btn_primary small">
                <SearchOutlinedIcon />
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <div className="table_main_Wrapper mb-3">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Reminder for me</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentDataObj?.data?.length > 0 &&
                currentDataObj?.data.map(note => {
                  let styleCss = {
                    textDecoration: note?.is_void ? 'line-through' : 'none',
                    backgroundColor: note?.is_void ? '#ffdddd ' : 'white',
                  };
                  return (
                    <>
                      <TableRow>
                        <TableCell
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title={note?.action?.icon}
                        >
                          <i className={`fa fa-${note?.action?.icon} me-2`}></i>
                        </TableCell>
                        <TableCell style={styleCss}>
                          <div
                            className={
                              note?.show_more
                                ? 'show_more_data expanded'
                                : 'show_more_data'
                            }
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                            }}
                          >
                            <span
                              className={
                                (new Date(note?.hold_date) !== '' ||
                                  new Date(note?.hold_date) !== null) &&
                                new Date(note?.hold_date) > new Date()
                                  ? 'text_success'
                                  : 'text_danger'
                              }
                            >
                              {note.hold_date !== '' &&
                                note.hold_date !== null &&
                                '+ HOLD : ' +
                                  moment(note?.hold_date).format(
                                    'ddd Do MMMM YYYY',
                                  )}
                            </span>
                            <span
                              className="description"
                              style={{
                                display: 'inline-block',
                                whiteSpace: 'normal',
                              }}
                            >
                              {note?.subject !== ''
                                ? ' - ' + note.subject
                                : ' '}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={styleCss}>
                          {note?.reminder_for_name
                            ? note?.reminder_for_name
                            : '-'}
                        </TableCell>
                        <TableCell
                          data-toggle="tooltip"
                          data-placement="bottom"
                        >
                          {moment(note?.reminder_time).format(
                            'hh:mmA - ddd Do MMM YYYY',
                          )}
                        </TableCell>
                        <TableCell
                          data-toggle="tooltip"
                          data-placement="bottom"
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                            }}
                          >
                            <Button
                              className="btn_edit"
                              onClick={() => onEditClick(note)}
                            >
                              <img src={EditIcon} alt="Edit Icon" />
                            </Button>
                            <Button
                              className="btn_delete"
                              onClick={() => {
                                OpenDelete(note?._id);
                              }}
                            >
                              <img
                                src={TrashIcon}
                                style={{ height: '18px', width: '18px' }}
                                alt="Delete Icon"
                              />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell
                          data-toggle="tooltip"
                          data-placement="bottom"
                        >
                          <Button
                            className="btn_border small"
                            onClick={() => onCompleteClick(note)}
                          >
                            Complete
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="table_pagination_wrap">
        {currentDataObj?.data?.length > 0 ? (
          <Row className="g-0 align-items-center my-2">
            <Col sm={6}>
              <div className="total_entry">
                <p className="m-0">
                  Showing{' '}
                  {(currentPage - 1) *
                    Number(
                      pageLimit === 'All' ? followup_note.length : pageLimit,
                    ) +
                    1}{' '}
                  to{' '}
                  {currentPage * pageLimit === 'All'
                    ? followup_note.length
                    : pageLimit < followNoteData?.length
                    ? currentPage * pageLimit === 'All'
                      ? followup_note.length
                      : pageLimit
                    : followNoteData?.length}{' '}
                  of {followNoteData?.length} entries{' '}
                  {searchText &&
                    `(filtered from ${followNoteData.length} total entries)`}
                </p>
              </div>
            </Col>
            <Col sm={6}>
              <div className="pagination_wrap">
                <Stack spacing={2}>
                  <Pagination
                    count={currentDataObj?.totalRows}
                    page={currentPage}
                    onChange={(e, page) => {
                      setCurrentPage(page);
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
      <DeletePopupModal
        CloseDelete={() => {
          setDeletePopup(false);
        }}
        deletePopup={deletePopup}
        onClickDelete={deleteNote}
        name="Are you sure you want to delete this Note? Note: this cannot be undone"
      />
    </div>
  );
}
