import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '../../Assets/Img/edit.svg';
import PdfIcon from '../../Assets/Img/pdf-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  eventCustomerCopy,
  setEnquiresList,
  yearEnquiresList,
} from 'store/reducers/Enquiry/Parties/enquireParties.slice';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import { partiesInternalUseOnlyPDF } from 'utils/useExportPDF';
import DataNotFound from 'Components/Common/DataNotFound';
import { updateEventDate } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { checkUserPermissions, getTotalPages } from 'utils/common';
import { getAllPageData2, getPageListData2 } from 'utils/gropingPagination';
import useGroupSortable from 'utils/useGroupSortable';
import { Pagination, Stack, TextareaAutosize, Tooltip } from '@mui/material';
import UnAssignEnquiries from './UnAssignEnquiries';

const pageSize = 50;

export default function EventDashboard({
  searchVenue,
  exclusive,
  handleExclusive,
  year,
}) {
  const id = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { yearPartiesLoading, yearPartiesList, isUpdateEventDateUpdated } =
    useSelector(({ enquireParties }) => enquireParties);

  const [finalData, setFinalData] = useState([]);
  const [dummyFinalData, setDummyFinalData] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const [exclusiveArray, setExclusiveArray] = useState([]);
  const [activeAllPageData, setActiveAllPageData] = useState([]);

  const { userPermissionDetail } = useSelector(({ user }) => user);
  useEffect(() => {
    if (finalData?.length > 0) {
      let dummyList = [];
      finalData.map(i => {
        dummyList.push({ catName: i.event_name, is_cat: true });
        i?.group_data.map(groupData => {
          dummyList.push({ ...groupData, show_more: false });
          return { ...groupData, show_more: false };
        });
        return dummyList;
      });
      setExclusiveArray(dummyList);
    }
  }, [finalData]);

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      finalData.flatMap(i => i.group_data),
      pageSize,
    );
    return totalActiveRecordCount;
  }, [finalData]);

  const setCurrentPageHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  useEffect(() => {
    if (exclusiveArray?.length > 0) {
      let currentDataList = [];
      currentDataList = getAllPageData2(
        exclusiveArray,
        currentPage.activeCurrentPage,
        pageSize,
        totalActiveRecordPage,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
      setActiveAllPageData(currentDataList);
    }
  }, [exclusiveArray, totalActiveRecordPage]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = [];
    if (activeAllPageData?.length > 0) {
      currentDataList = getPageListData2(
        exclusiveArray,
        activeAllPageData,
        currentPage.activeCurrentPage,
        totalActiveRecordPage,
        setCurrentPageHandler,
        'activeCurrentPage',
      );
    }
    return currentDataList;
  }, [activeAllPageData, exclusiveArray, currentPage]);

  const { itemsActive, requestSortActive } = useGroupSortable(
    currentPage.activeCurrentPage,
    activeCurrentData,
  );

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  useEffect(() => {
    const editYearData = yearPartiesList.map(data => {
      let Final = data?.group_data.map(item => ({
        ...item,
        is_edit: false,
      }));
      return { ...data, group_data: Final };
    });
    setFinalData(editYearData);
  }, [yearPartiesList]);

  const searchParams = new URLSearchParams(location.search);
  const params = {};
  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  useEffect(() => {
    if (!exclusive) {
      dispatch(
        yearEnquiresList({
          year: params.hasOwnProperty('year')
            ? Number(params.year)
            : id.year
            ? Number(id.year)
            : searchVenue?.year,
          event_id: params.hasOwnProperty('event_id')
            ? params.event_id
            : id.year
            ? ''
            : searchVenue?._id,
          search: searchValue,
          is_exclusive: id.year ? !exclusive : exclusive,
        }),
      );
    } else {
      const duplicate = JSON.parse(JSON.stringify(yearPartiesList));
      const newData = duplicate.map(rec => {
        const filter = rec.group_data.filter(item => {
          if (item.isExclusive) {
            return item;
          }
        });
        return Object.assign(rec, { group_data: filter });
      });
      dispatch(setEnquiresList(newData));
    }
    setCurrentPage({
      activeCurrentPage: 1,
      inActiveCurrentPage: 1,
    });
  }, [exclusive, location.search]);

  useEffect(() => {
    if (isUpdateEventDateUpdated) {
      dispatch(
        yearEnquiresList({
          year: searchVenue?.year,
          event_id: searchVenue?._id,
          search: '',
          is_exclusive: exclusive,
        }),
      );
    }
  }, [isUpdateEventDateUpdated]);

  useEffect(() => {
    if (!searchVenue && year) {
      dispatch(
        yearEnquiresList({
          year: Number(year),
          event_id: '',
          search: '',
          is_exclusive: false,
        }),
      );
    }
  }, [searchVenue, year]);

  const handleStatusDescription = (id, value, name) => {
    let tempListData = finalData?.map(item => {
      let newData = item?.group_data.map(ii => {
        if (ii?._id === id) {
          return {
            ...ii,
            is_edit: value,
          };
        } else {
          return {
            ...ii,
            is_edit: false,
          };
        }
      });
      return { ...item, group_data: newData };
    });
    if (name === 'Close') {
      setFinalData(dummyFinalData);
    } else {
      setFinalData(tempListData);
    }
  };
  const handleInputChange = (id, event) => {
    let tempListData = finalData?.map(item => {
      let newData = item?.group_data.map(ii => {
        if (ii?._id === id) {
          return {
            ...ii,
            status_description: event.target.value,
          };
        } else {
          return {
            ...ii,
          };
        }
      });
      return { ...item, group_data: newData };
    });
    setFinalData(tempListData);
  };

  return (
    <div className="inner_wrapper">
      {yearPartiesLoading && <Loader />}

      <div className="parties_table_Wrap">
        <Row className="align-items-center mb-3">
          <Col xs={9}>
            {finalData.length > 0 ? (
              <div
                className={`${
                  exclusive ? 'btn_border small' : 'btn_primary small'
                }`}
                onClick={() => handleExclusive(!exclusive)}
              >
                Exclusives Only
              </div>
            ) : (
              ''
            )}
          </Col>
          <Col xs={3}>
            <div className="search_wrapper_common">
              <input
                type="search"
                placeholder="Search"
                className="form-control"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <button className="btn_primary small">
                <SearchOutlinedIcon
                  onClick={() => {
                    //id.year conditon for all evnet with particulare year
                    dispatch(
                      yearEnquiresList({
                        year: id.year ? Number(id.year) : searchVenue?.year,
                        event_id: id.year ? '' : searchVenue?._id,
                        search: searchValue,
                        is_exclusive: id.year ? false : exclusive,
                      }),
                    );
                  }}
                />
              </button>
            </div>
          </Col>
        </Row>

        <div className="table_main_Wrapper mb-4">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span onClick={() => requestSortActive('date')}>Date</span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('price_net')}>
                      Price Net
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('price_gross')}>
                      Price Gross
                    </span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('hold')}>HOLD</span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('available')}>
                      Available
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortActive('enquired')}>
                      Enquired
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
                  <TableCell>Status</TableCell>
                  <TableCell>Status Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsActive?.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {item?.is_cat ? (
                        <TableRow className="full_row">
                          <TableCell colSpan={11}>{item?.catName}</TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {item?.catName && ( // Check if catName exists
                            <TableRow>
                              <TableCell>{item?.catName}</TableCell>
                            </TableRow>
                          )}
                          <TableRow
                            className={!item?.is_active ? 'disable_row' : ''}
                          >
                            <TableCell className="total_available_wrap">
                              <SearchOutlinedIcon
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  +item?.enquired > 0 &&
                                  +item?.provisional === 0 &&
                                  +item?.confirmed === 0
                                    ? navigate(
                                        `/enquiries/${
                                          item?.date
                                            ? moment(item?.date).format(
                                                'YYYY-MM-DD',
                                              )
                                            : 'Invalid Date'
                                        }?date=true&eventid=${item?.event_id}`,
                                      )
                                    : navigate(
                                        `/bookings/?contactid=${
                                          item?._id
                                        }&parties=true&year=${searchVenue?.year.toString()}&event=${
                                          item?.event_id
                                        }`,
                                        {
                                          state: {
                                            event_date: item?.date,
                                            event_name:
                                              location?.state?.event_sku,
                                          },
                                        },
                                      );
                                }}
                              />
                              {moment(item?.date).format('ddd Do MMM')}
                            </TableCell>
                            <TableCell>
                              £{item?.price_net?.toFixed(2)}
                            </TableCell>
                            <Tooltip
                              title={`Inc: vat ${
                                item?.tax_code?.percentage
                                  ? item?.tax_code?.percentage % 1 === 0
                                    ? item?.tax_code?.percentage
                                    : item?.tax_code?.percentage?.toFixed(2)
                                  : '0'
                              }%`}
                            >
                              <TableCell className="total_available_wrap">
                                £{item?.price_gross?.toFixed(2)}
                              </TableCell>
                            </Tooltip>
                            <TableCell>
                              {checkUserPermissions(
                                userPermissionDetail?.admin,
                                userPermissionDetail?.minplaces,
                              ) && (
                                <>
                                  {item?.is_active ? (
                                    <Link
                                      to={`/create-new-booking/${item?._id}`}
                                      className="btn_border small"
                                    >
                                      Book / Enquire
                                    </Link>
                                  ) : (
                                    ''
                                  )}
                                </>
                              )}
                            </TableCell>
                            <TableCell className="total_available_wrap">
                              <>
                                <Tooltip
                                  title={`Percentege Left: ${item?.precent_left}%`}
                                >
                                  <span className="hold_day text_primary">
                                    {item?.hold}
                                  </span>
                                </Tooltip>
                                <span> Days</span>
                              </>
                            </TableCell>
                            <TableCell className="total_available_wrap">
                              {item?.available}
                              <Tooltip
                                title={`Overbooking Capacity: ${item?.total_place}`}
                              >
                                <span className="total_available text_light">
                                  /{item?.places}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              className={
                                item?.enquired > 0 ? 'total_available_wrap' : ''
                              }
                            >
                              {item?.enquired === 0 ? (
                                item?.enquired
                              ) : (
                                <span
                                  style={{
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    if (
                                      item?.enquired > 0 &&
                                      item?.provisional === 0 &&
                                      item?.confirmed === 0
                                    )
                                      navigate(
                                        `/enquiries/${
                                          item?.date
                                            ? moment(item?.date).format(
                                                'YYYY-MM-DD',
                                              )
                                            : 'Invalid Date'
                                        }?date=true&eventid=${item?.event_id}`,
                                      );
                                    else
                                      navigate(
                                        `/enquiries/${item?._id}?parties=true&from_dashboard_ev_dates=true`,
                                        {
                                          state: {
                                            event: item?.event_id,
                                          },
                                        },
                                      );
                                  }}
                                >
                                  {item?.enquired}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{item?.provisional}</TableCell>
                            <TableCell>{item?.confirmed}</TableCell>
                            <Tooltip title={item?.statusText || item?.status}>
                              <TableCell
                                style={{
                                  color: `${
                                    item?.status_data?.colour ? '#fff' : '#000'
                                  }`,
                                  background: `${
                                    item?.status_data?.colour ?? ''
                                  }`,
                                }}
                              >
                                <div className="status_wrap">
                                  <span>
                                    {item?.statusText || item?.status}
                                  </span>
                                </div>
                              </TableCell>
                            </Tooltip>
                            <TableCell>
                              <ul className="edit_wrap">
                                <li>
                                  {!item?.is_edit && (
                                    <img
                                      src={EditIcon}
                                      alt="Edit Icon"
                                      onClick={() => {
                                        setDummyFinalData(finalData);
                                        handleStatusDescription(
                                          item?._id,
                                          true,
                                          'Edit',
                                        );
                                      }}
                                    />
                                  )}
                                </li>
                                <li className="d-flex align-items-center">
                                  {item?.is_edit ? (
                                    <>
                                      <div className="form_group Status_Description">
                                        <TextareaAutosize
                                          className="form-control"
                                          value={item?.status_description}
                                          onChange={event =>
                                            handleInputChange(item._id, event)
                                          }
                                        />
                                      </div>
                                      <button
                                        className="btn_border small mx-2"
                                        onClick={() => {
                                          handleStatusDescription(
                                            item?._id,
                                            false,
                                            'Close',
                                          );
                                        }}
                                      >
                                        Close
                                      </button>
                                      <button
                                        className="btn_primary small mx-2"
                                        onClick={() => {
                                          dispatch(
                                            updateEventDate({
                                              _id: item?._id,
                                              date: {
                                                internal_status_notes:
                                                  item?.status_description,
                                              },
                                            }),
                                          );
                                          handleStatusDescription(
                                            item?._id,
                                            false,
                                            'Update',
                                          );
                                        }}
                                      >
                                        Update
                                      </button>
                                    </>
                                  ) : (
                                    <p className="w_400">
                                      {item?.status_description}
                                    </p>
                                  )}
                                </li>
                                <li></li>
                              </ul>
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="table_pagination_wrap">
            {itemsActive?.length > 0 ? (
              <Row className="g-0 align-items-center my-2">
                <Col sm={6}>
                  <p className="m-0">
                    Showing {activeIndexOfFirstItem + 1} to{' '}
                    {Math.min(
                      activeIndexOfLastItem,
                      finalData.flatMap(i => i.group_data)?.length,
                    )}{' '}
                    of {finalData.flatMap(i => i.group_data)?.length} entries
                  </p>
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
              <DataNotFound />
            )}
          </div>
        </div>
      </div>
      <UnAssignEnquiries />

      {!(!searchVenue && year) && finalData.length > 0 ? (
        <div className="years_number_Wrap mb-3 d-flex justify-content-between">
          <ul className="pdf_link_wrap rtl_dir">
            <li
              onClick={() => {
                dispatch(
                  eventCustomerCopy({
                    event_id: params?.event_id,
                    formCrmbo: true,
                  }),
                ).then(action => {
                  if (eventCustomerCopy.fulfilled.match(action)) {
                    const data = action.payload;
                    window.open(data, '_blank');
                  }
                });
              }}
            >
              <Link to={location.pathname + location?.search}>
                <div className="pdf_icon">
                  <img src={PdfIcon} alt="pdf icon" />
                </div>
                <div className="pdf_text">
                  <p>CUSTOMER COPY:</p>
                </div>
              </Link>
            </li>
          </ul>
          <ul className="pdf_link_wrap rtl_dir">
            <li
              onClick={() => {
                partiesInternalUseOnlyPDF({ yearPartiesList });
              }}
            >
              <Link to={location.pathname + location?.search}>
                <div className="pdf_icon">
                  <img src={PdfIcon} alt="pdf icon" />
                </div>
                <div className="pdf_text">
                  <p>INTERNAL USE ONLY:</p>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
