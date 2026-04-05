import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { withoutEventEnquiresList } from 'store/reducers/Enquiry/Parties/enquireParties.slice';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import { getPaginationData, getTotalPages } from 'utils/common';
import useSortable from 'utils/useSortable';
import DataNotFound from 'Components/Common/DataNotFound';

const pageSize = 10;

export default function UnAssignEnquiries() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { withoutEventPartiesList } = useSelector(
    ({ enquireParties }) => enquireParties,
  );
  const [noVenueSearch, setNoVenueSearch] = useState('');
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
  });
  const searchParams = new URLSearchParams(location.search);
  let paramObj = Object.fromEntries([...searchParams]);
  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const setCurrentPartiesHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      withoutEventPartiesList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [withoutEventPartiesList]);
  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      withoutEventPartiesList,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentPartiesHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [withoutEventPartiesList, currentPage.activeCurrentPage]);

  const { itemsActive, requestSortActive } = useSortable(activeCurrentData);

  return (
    <>
      <div className="parties_table_Wrap">
        <Row className="align-items-center mb-3">
          <Col xs={9}>
            <h4 className="fw_600 m-0">
              {paramObj?.eventId
                ? 'Unassigned Enquiries for'
                : 'Enquiries with no venue assigned'}
            </h4>
          </Col>
          <Col xs={3}>
            <div className="search_wrapper_common">
              <input
                type="search"
                placeholder="Search"
                className="form-control"
                value={noVenueSearch}
                onChange={e => setNoVenueSearch(e.target.value)}
              />
              <button
                className="btn_primary small"
                onClick={() =>
                  dispatch(
                    withoutEventEnquiresList({
                      event_id: paramObj ? paramObj?.event_id : '',
                      search: noVenueSearch,
                      date: false,
                    }),
                  )
                }
              >
                <SearchOutlinedIcon />
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <div className="table_main_Wrapper vertical_top mb-3">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <span onClick={() => requestSortActive('created_at')}>
                    Date
                  </span>
                </TableCell>
                <TableCell>
                  <span onClick={() => requestSortActive('places')}>
                    Enquired
                  </span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsActive?.map((elem, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {elem?.created_at
                        ? moment(elem?.created_at).format('ddd Do MMM YYYY')
                        : 'No Date Specified'}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/enquiries/${
                          elem?.created_at
                            ? moment(elem?.created_at).format('YYYY-MM-DD')
                            : 'Invalid Date'
                        }?date=true${
                          paramObj?.event_id
                            ? `&eventid=${paramObj.event_id}`
                            : ''
                        }`}
                      >
                        {elem?.places}
                      </Link>
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
                      withoutEventPartiesList?.length,
                    )}{' '}
                    of {withoutEventPartiesList?.length} entries
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
    </>
  );
}
