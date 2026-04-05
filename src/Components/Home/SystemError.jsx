import React, { useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useGroupSortable from 'utils/useGroupSortable';
import { getAllPageData2, getPageListData2 } from 'utils/gropingPagination';
import { getTotalPages } from 'utils/common';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { DialogContent, Pagination, Stack, TextField } from '@mui/material';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Button } from 'react-bootstrap';
import { updateStoreError } from 'store/reducers/Dashboard/Dashboard.slice';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';
let pageSize = 10;

export default function SystemError() {
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
  });
  const [activeAllPageData, setActiveAllPageData] = useState([]);
  const { storeErrorData } = useSelector(({ storeError }) => storeError);
  const [noteData, setNoteData] = useState('');
  const [open, setOpen] = useState(false);
  const [places, setPlaces] = useState({
    active: {},
  });
  const dispatch = useDispatch();
  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(storeErrorData, pageSize);
    return totalActiveRecordCount;
  }, [storeErrorData]);
  useEffect(() => {
    if (storeErrorData?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        storeErrorData,
        currentPage.activeCurrentPage,
        pageSize,
        totalActiveRecordPage,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
      setActiveAllPageData(currentDataList);
    }
  }, [storeErrorData, totalActiveRecordPage]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = [];
    if (activeAllPageData?.length > 0) {
      currentDataList = getPageListData2(
        storeErrorData,
        activeAllPageData,
        currentPage.activeCurrentPage,
        totalActiveRecordPage,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
    }
    return currentDataList;
  }, [activeAllPageData, storeErrorData, currentPage]);
  const { itemsActive, requestSortActive } = useGroupSortable(
    currentPage.activeCurrentPage,
    activeCurrentData,
  );

  const setCurrentPageHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const handleClickOpen = item => {
    setNoteData(item?.tech);
    setOpen(true);
  };

  const handleInputChange = (e, index, name) => {
    const { value } = e.target;
    setPlaces(prevPlaces => {
      return {
        ...prevPlaces,
        [name]: {
          ...prevPlaces[name],
          [index]: {
            ...prevPlaces[name][index],
            place: value,
            errorMessage: '',
          },
        },
      };
    });
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="system_error_wrap">
        <div className="p-2">
          <h5>System Errors</h5>
          <p>Great! There are currently no unresolved errors logged</p>
        </div>
        {itemsActive?.length > 0 ? (
          <div className="table_main_Wrapper vertical_top">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('error_date')}>
                        Error Time
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('function')}>
                        Error
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('details')}>
                        Details
                      </span>
                    </TableCell>
                    <TableCell>Technical Info</TableCell>
                    <TableCell>Resolution Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsActive?.length > 0 &&
                    itemsActive?.map((item, itemIndex) => {
                      return (
                        <TableRow key={itemIndex}>
                          <TableCell>
                            {moment(item?.error_date).format('L h:mm:ss')}
                          </TableCell>
                          <TableCell>{item?.function}</TableCell>
                          <TableCell>
                            <span className="w_200">{item?.details}</span>
                          </TableCell>
                          <TableCell>
                            <Link onClick={() => handleClickOpen(item)}>
                              Show/Hide Info
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="resolution_note_wrap">
                              <Row className="g-0">
                                <Col>
                                  <TextField
                                    id="resolution_note"
                                    multiline
                                    value={
                                      places?.active[
                                        activeIndexOfFirstItem + 1 + itemIndex
                                      ]?.place || ''
                                    }
                                    onChange={e =>
                                      handleInputChange(
                                        e,
                                        activeIndexOfFirstItem + 1 + itemIndex,
                                        'active',
                                      )
                                    }
                                    rows={3}
                                    variant="outlined"
                                  />
                                  <div className="d-block">
                                    <Button
                                      className="btn_border small mt-2"
                                      onClick={() => {
                                        dispatch(
                                          updateStoreError({
                                            resolved_note: {
                                              note: places['active'][
                                                activeIndexOfFirstItem +
                                                  1 +
                                                  itemIndex
                                              ]?.place,
                                            },
                                            _id: item?._id,
                                          }),
                                        );
                                      }}
                                    >
                                      Mark as Resolved
                                    </Button>
                                  </div>
                                </Col>
                                <Col className="ps-3">
                                  Resolution Notes:{' '}
                                  <span>{item?.resolved_note}</span>
                                </Col>
                              </Row>
                            </div>
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
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          activeIndexOfLastItem,
                          storeErrorData?.length,
                        )}{' '}
                        of {storeErrorData?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalActiveRecordPage}
                          page={currentPage.activeCurrentPage}
                          onChange={(e, page) => {
                            setCurrentPage({
                              ...currentPage,
                              activeCurrentPage: page,
                            });
                          }}
                        />
                      </Stack>
                    </div>
                  </Col>
                </Row>
              ) : (
                ''
              )}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <BootstrapDialog
        aria-labelledby="customized-dialog2-title"
        open={open}
        className="small_popup system_error_note_popup"
      >
        <BootstrapDialogTitle
          id="customized-dialog2-title"
          onClose={handleClose}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <code>{noteData}</code>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
