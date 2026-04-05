import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import EditIcon from '../../../../Assets/Img/edit.svg';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import { Col, Row } from 'react-bootstrap';
import { getTotalPages, getPaginationData, suspendHandler } from 'utils/common';
import { Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {
  getLettersListData,
  updateLetter,
  setIsLetterUpdated,
} from 'store/reducers/Admin/Mail/letters.slice';
import { useDispatch, useSelector } from 'react-redux';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import Loader from 'Components/Common/Loader';
import useSortable from 'utils/useSortable';
import DataNotFound from 'Components/Common/DataNotFound';
import useSortableAll from 'utils/useSortableAll';
let pageSize = 10;

export default function Letters() {
  const dispatch = useDispatch();
  const {
    activeLetterList,
    inActiveLetterList,
    letterLoading,
    isLetterUpdated,
  } = useSelector(({ letter }) => letter);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const inActiveIndexOfLastItem = currentPage.inActiveCurrentPage * pageSize;
  const inActiveIndexOfFirstItem = inActiveIndexOfLastItem - pageSize;

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(activeLetterList, pageSize);
    return totalActiveRecordCount;
  }, [activeLetterList]);
  const setCurrentTransactionMailHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(inActiveLetterList, pageSize);
    return totalActiveRecordCount;
  }, [inActiveLetterList]);

  const { itemsActive, requestSortActive } = useSortableAll(activeLetterList);
  const { itemsInActive, requestSortInActive } =
    useSortableAll(inActiveLetterList);

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentTransactionMailHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [itemsActive, currentPage.activeCurrentPage]);

  const inActiveCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsInActive,
      currentPage.inActiveCurrentPage,
      pageSize,
      totalInActiveRecordPage,
      setCurrentTransactionMailHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage.inActiveCurrentPage]);

  const OpenDelete = letter => {
    setDeleteId(letter);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };
  useEffect(() => {
    if (isLetterUpdated) {
      dispatch(getLettersListData());
      dispatch(setIsLetterUpdated(false));
    }
  }, [dispatch, isLetterUpdated]);
  useEffect(() => {
    dispatch(getLettersListData());
  }, [dispatch]);

  const deleteMailAsset = letter => {
    dispatch(
      updateLetter({
        _id: deleteId._id,
        letter: {
          ...deleteId,
          deleted: !deleteId.deleted,
        },
      }),
    );
  };

  const getAvailability = type => {
    switch (type) {
      case 0:
        return 'Booking';
      case 1:
        return 'Payment';
      case 2:
        return 'Web';
      case 3:
        return 'Contact';
      case 4:
        return 'Billables';
      case 5:
        return 'Invoice';
      case 6:
        return 'Anywhere';
      default:
        return null;
    }
  };
  return (
    <div className="inner_wrapper">
      {letterLoading && <Loader />}
      <div className="letter_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Mail</Typography>
            <Typography>Letters</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Event Letters</h1>
        </div>
        <div className="letter_wrap">
          <Link
            to="/letters/add-edit-letters"
            className="btn_primary small mb-3"
          >
            Add New Letter Template
          </Link>
          <h4>Current Letter Templates</h4>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper letter_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('sku')}>SKU</span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('years')}>
                        Subject
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('description')}>
                        Desciption
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('availability')}>
                        Availability
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData.map(letter => {
                    return (
                      <TableRow key={letter?._id}>
                        <TableCell>{letter.sku}</TableCell>
                        <TableCell>{letter.name}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <p className="w_400">{letter.description}</p>
                        </TableCell>
                        <TableCell>
                          {getAvailability(letter.availability)}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/letters/add-edit-letters/${letter._id}`}
                                className="btn_edit"
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </Link>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_warning"
                                onClick={() =>
                                  suspendHandler(
                                    letter,
                                    dispatch,
                                    updateLetter,
                                    'letter',
                                  )
                                }
                              >
                                Suspend
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_border small"
                                onClick={() => {
                                  OpenDelete(letter);
                                }}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="table_pagination_wrap">
              {activeCurrentData?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          activeIndexOfLastItem,
                          activeLetterList?.length,
                        )}{' '}
                        of {activeLetterList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalActiveRecordPage}
                          page={currentPage.activeCurrentPage}
                          onChange={(e, page) =>
                            setCurrentPage({
                              ...currentPage,
                              activeCurrentPage: page,
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

          <h5 className="text_primary">Inactive :</h5>
          <div className="table_main_Wrapper letter_active_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortInActive('sku')}>
                        SKU
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('years')}>
                        Subject
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('description')}>
                        Desciption
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('availability')}>
                        Availability
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData.map(letter => {
                    return (
                      <TableRow key={letter?._id}>
                        <TableCell>{letter.sku}</TableCell>
                        <TableCell>{letter.name}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <p className="w_400">{letter.description}</p>
                        </TableCell>
                        <TableCell>
                          {getAvailability(letter.availability)}
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/letters/add-edit-letters/${letter._id}`}
                                className="btn_edit"
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </Link>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_info"
                                onClick={() =>
                                  suspendHandler(
                                    letter,
                                    dispatch,
                                    updateLetter,
                                    'letter',
                                  )
                                }
                              >
                                Activate
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_border small"
                                onClick={() => {
                                  OpenDelete(letter);
                                }}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="table_pagination_wrap">
              {inActiveCurrentData?.length ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveLetterList?.length,
                        )}{' '}
                        of {inActiveLetterList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalInActiveRecordPage}
                          page={currentPage.inActiveCurrentPage}
                          onChange={(e, page) =>
                            setCurrentPage({
                              ...currentPage,
                              inActiveCurrentPage: page,
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
      </div>
      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteMailAsset}
        name="Are you sure you want to delete this letter template? Note: this cannot be undone"
      />
    </div>
  );
}
