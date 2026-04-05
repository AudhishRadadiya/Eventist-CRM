import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import EditIcon from '../../Assets/Img/edit.svg';
import knifeIcon from '../../Assets/Img/knife.svg';
import WebFill from '../../Assets/Img/web-fill.svg';
import venueFill from '../../Assets/Img/venue-fill.svg';
import EyeIcon from '../../Assets/Img/eye.svg';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getNoteTypesListData } from 'store/reducers/Admin/System/noteTypes.slice';
import {
  getEnquiryNoteData,
  getEnquiryNoteListData,
  deleteEnquiryNote,
  getTrackableProductsData,
  getTrackedHistoryData,
} from 'store/reducers/Enquiry/Note/enquiryNote.slice';
import Loader from 'Components/Common/Loader';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import useSortable from 'utils/useSortable';
import { getPaginationData, getTotalPages } from 'utils/common';
import { Pagination, Stack } from '@mui/material';
import DataNotFound from 'Components/Common/DataNotFound';
import { directionNoteList } from 'utils/FieldValues';
import NoteItemModal from './NoteModal';
import ShowMoreHandler from 'Components/Common/ShowMoreHandler';
import ShowMoreInitializer from 'Components/Common/ShowMoreInitializer';
import { useLocation } from 'react-router-dom';

let pageSize = 10;
let trackNoteTypeId = '64e59bb10f8d4b72e7f633af';
let postNoteTypeId = '64e59bb10f8d4b72e7f633b7';

export default function Note({ id: bookingId, enquirieDetail }) {
  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState('Select');
  const [selectedCorres, setSelectedCorres] = useState('Contact');
  const [searchData, setSearchData] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const [open, setOpen] = useState({
    isOpenUsingAction: '',
    isAdd: '',
    openModel: false,
    data: '',
  });
  const [actionTypeList, setActionTypeList] = useState({
    activeTypeMainData: [],
    quickLinkData: [],
    notQuickLinkData: [],
  });
  const [correspondenceTypeList, setCorrespondenceTypeList] = useState({
    activeTypeMainData: [],
    quickLinkData: [],
    notQuickLinkData: [],
  });
  const [selectedActionData, setSelectedActionData] = useState({});
  const [selectedCorrespondanceData, setSelectedCorrespondanceData] = useState(
    {},
  );

  const location = useLocation();

  // const [dataExpand, setDataExpand] = useState({
  //   actionDataExpand: false,
  //   correspondanceDataExpand: false,
  // });
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
  });

  const [totalItemsOutstanding, setTotalItemsOutstanding] = useState(0);
  const [totalItemsOversent, setTotalItemsOversent] = useState(0);

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const [noteListData, setNoteListData] = useState([]);
  const [check, setCheck] = useState([]);
  const { activeNoteTypesList } = useSelector(({ noteTypes }) => noteTypes);
  const {
    enquiryNoteList,
    enquiryNoteLoading,
    isEnquiryNoteCreated,
    isEnquiryNoteUpdated,
    isEnquiryNoteDeleted,
    noteTrackableProductDetail: trackableProducts,
    noteTrackableHistoryDetail: trackedHistory,
  } = useSelector(({ enquiryNotes }) => enquiryNotes);

  const visibilityNoteList = [
    {
      visibilityValue: 'Venue',
      lableIcon: venueFill,
      labelName: 'Venue',
    },
    {
      visibilityValue: 'Public',
      lableIcon: WebFill,
      labelName: 'Public (online)',
    },
    {
      visibilityValue: 'Dietary',
      lableIcon: knifeIcon,
      labelName: 'Dietary',
    },
  ];

  useEffect(() => {
    if (bookingId) {
      dispatch(getTrackableProductsData({ booking_id: bookingId }));
      dispatch(getTrackedHistoryData({ booking_id: bookingId }));
      dispatch(getEnquiryNoteListData({ _id: bookingId }));
      dispatch(getNoteTypesListData());
    }
  }, [bookingId]);
  useEffect(() => {
    if (location?.state?.isOpenNoteModal) {
      dispatch(getEnquiryNoteData({ _id: location?.state?.note?._id }));
      handleClickOpen(false, false, true);
    }
  }, []);
  useEffect(() => {
    let areTrackables = 'N';
    let showPostButton = 'N';

    if (
      trackableProducts?.length &&
      Array.isArray(trackedHistory) &&
      activeNoteTypesList.length
    ) {
      areTrackables = 'Y';

      let numberShown = 0;
      let totalOverSent = 0;
      let totalOutstanding = 0;

      trackableProducts?.forEach((x = {}) => {
        const { product_track_multiplier, qty, product_id } = x;
        let trackedQty = 0;
        let numberRequired = 0;

        if (product_track_multiplier > 1) {
          numberRequired = qty * product_track_multiplier;
        } else {
          numberRequired = qty;
        }

        if (trackedHistory?.length) {
          trackedHistory?.forEach(y => {
            if (product_id === y?.tracked_product_id) {
              trackedQty += y?.qty;
            }
          });
        }

        const totReq = numberRequired - trackedQty;
        if (totReq === 0) {
        } else {
          totalOutstanding += totReq;
          numberShown++;
        }
      });

      if (trackedHistory.length) {
        trackedHistory?.forEach(x => {
          const trackedQuant = parseInt(x?.qty);
          // trackable product exists as product assigned to booking
          const prodAssignedToBooking = trackableProducts?.find(
            tp => tp?.product_id === x?.tracked_product_id,
          );
          if (prodAssignedToBooking) {
            // Check the amount counted is not more than needed
            const bookingQuant = parseInt(
              prodAssignedToBooking.qty *
                (prodAssignedToBooking.product_track_multiplier || 1),
            );

            if (trackedQuant > bookingQuant) {
              totalOverSent += trackedQuant - bookingQuant;
              areTrackables = 'Y';
            }
          } else {
            // This tracked product is not on the booking - may have been removed
            // Mark as oversend
            totalOverSent += trackedQuant;
            areTrackables = 'Y';
          }
        });
      }

      setTotalItemsOversent(totalOverSent);
      setTotalItemsOutstanding(totalOutstanding);

      if (numberShown === 0 && totalOverSent === 0) {
        showPostButton = 'Y';
        areTrackables = 'N';
      }
    }

    if (activeNoteTypesList.length) {
      let actions = activeNoteTypesList?.[0]?.group_data;
      let corres = activeNoteTypesList?.[1]?.group_data;

      if (areTrackables === 'N') {
        actions = actions?.filter(x => x?._id !== trackNoteTypeId);
        corres = corres?.filter(x => x?._id !== trackNoteTypeId);
      }
      if (showPostButton === 'N') {
        actions = actions?.filter(x => x?._id !== postNoteTypeId);
        corres = corres?.filter(x => x?._id !== postNoteTypeId);
      }

      const actionLink = actions?.filter(x => x.is_quicklink);
      const actionNotLink = actions?.filter(x => !x.is_quicklink);
      const corresLink = corres?.filter(x => x.is_quicklink);
      const corresNotLink = corres?.filter(x => !x.is_quicklink);

      setActionTypeList({
        activeTypeMainData: activeNoteTypesList?.[0],
        quickLinkData: actionLink,
        notQuickLinkData: actionNotLink,
      });
      setCorrespondenceTypeList({
        activeTypeMainData: activeNoteTypesList?.[1],
        quickLinkData: corresLink,
        notQuickLinkData: corresNotLink,
      });
    }
  }, [
    dispatch,
    bookingId,
    trackedHistory,
    trackableProducts,
    activeNoteTypesList,
  ]);

  const handleActionChange = event => {
    setSelectedAction(event.target.value);
  };

  const handleCorresChange = event => {
    setSelectedCorres(event.target.value);
  };

  const handleClickOpen = (isActionValue, isAddValue, openModelValue, data) => {
    setOpen({
      isOpenUsingAction: isActionValue,
      isAdd: isAddValue,
      openModel: openModelValue,
      data: data,
    });
  };

  const handleClose = () => {
    setOpen({
      isOpenUsingAction: '',
      isAdd: '',
      openModel: false,
    });
    // setNoteList(initialValuesAddNotes);
  };

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

  const visibilityIcon = (item, visibilityName) => {
    let newVisibilityData = [];
    if (item === 0) {
      newVisibilityData.push('Venue');
    } else if (item === 1) {
      newVisibilityData.push('Public');
    } else if (item === 2) {
      newVisibilityData.push('Dietary');
    } else if (item === 3) {
      newVisibilityData.push('Venue');
      newVisibilityData.push('Public');
      newVisibilityData.push('Dietary');
    } else {
      newVisibilityData = [];
    }
    if (newVisibilityData?.length > 0) {
      if (visibilityName === 'Venue') {
        let newVisibility = visibilityNoteList?.filter(
          data => data?.visibilityValue === visibilityName,
        );
        if (newVisibility?.length > 0 && newVisibilityData.includes('Venue')) {
          return (
            <>
              <img
                src={newVisibility[0]?.lableIcon}
                alt="Chat icon"
                className="me-2  icon_grayscale"
              />
            </>
          );
        } else {
          return '';
        }
      }
      if (visibilityName === 'Public') {
        let newVisibility = visibilityNoteList?.filter(
          data => data.visibilityValue === visibilityName,
        );
        if (newVisibility?.length > 0 && newVisibilityData.includes('Public')) {
          return (
            <img
              src={newVisibility[0]?.lableIcon}
              alt="Chat icon"
              className="me-2 icon_grayscale"
            />
          );
        } else {
          return '';
        }
      }
      if (visibilityName === 'Dietary') {
        let newVisibility = visibilityNoteList?.filter(
          data => data.visibilityValue === visibilityName,
        );
        if (
          newVisibility?.length > 0 &&
          newVisibilityData.includes('Dietary')
        ) {
          return (
            <img
              src={newVisibility[0]?.lableIcon}
              alt="Chat icon"
              className="me-2 icon_grayscale"
            />
          );
        } else {
          return '';
        }
      }
    }
  };

  useEffect(() => {
    if (isEnquiryNoteCreated || isEnquiryNoteUpdated || isEnquiryNoteDeleted) {
      dispatch(getEnquiryNoteListData({ _id: bookingId }));
      handleClose();
    }
  }, [
    isEnquiryNoteCreated,
    isEnquiryNoteUpdated,
    isEnquiryNoteDeleted,
    dispatch,
    bookingId,
  ]);

  const OpenDelete = note => {
    setDeleteId(note);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteNote = () => {
    dispatch(
      deleteEnquiryNote({
        _id: deleteId,
      }),
    );
  };

  const setCurrentNoteHandler = useCallback(
    key => {
      setCurrentPage({
        ...currentPage,
        [key]: currentPage[key] - 1,
      });
    },
    [currentPage],
  );

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(noteListData, pageSize);
    return totalActiveRecordCount;
  }, [noteListData]);

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      noteListData,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentNoteHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [
    noteListData,
    currentPage.activeCurrentPage,
    totalActiveRecordPage,
    setCurrentNoteHandler,
  ]);

  useEffect(() => {
    let noteListArray = [];
    enquiryNoteList.map(i => {
      noteListArray.push({ ...i, user_name: i?.user?.name });
      return noteListArray;
    });

    setNoteListData(noteListArray);
  }, [enquiryNoteList]);

  const Search = nameKey => {
    const includeColumns = ['subject', 'user?.name'];
    const lowercasedValue = nameKey.toLowerCase().trim();
    if (lowercasedValue === '') setNoteListData(enquiryNoteList);
    else {
      const filteredData = enquiryNoteList?.filter(item => {
        return includeColumns.some(key => {
          const value = key === 'user?.name' ? item.user?.name : item[key];
          return (
            value && value.toString().toLowerCase().includes(lowercasedValue)
          );
        });
      });
      setNoteListData(filteredData);
    }
  };

  const { itemsActive, requestSortActive } = useSortable(check);

  return (
    <>
      <div className="card_wrapper mb-4">
        {enquiryNoteLoading && <Loader />}
        <div
          className={`card_header d-flex align-items-center justify-content-between py-2 px-3 ${
            window.location.pathname.includes('edit-enquiries') ? 'enquiry' : ''
          }`}
        >
          <h4 className="m-0 py-1 text_white">Notes</h4>
        </div>
        {enquirieDetail?.event_info?.event_date?._id &&
          !enquirieDetail?.open_for_bookings && (
            <div className="px-2 mt-1">
              <ul>
                <li>
                  <label className="fw_500">
                    This{' '}
                    {enquirieDetail?.is_booking
                      ? 'enquiry is for a '
                      : 'booking is on a '}
                    closed night
                  </label>
                </li>
              </ul>
            </div>
          )}

        {totalItemsOutstanding > 0 && (
          <div className="px-2 mt-1">
            <ul>
              <li>
                <label className="fw_500">
                  There are{' '}
                  <span className="text_primary mx-1">
                    {totalItemsOutstanding}
                  </span>
                  trackable items that need counting & posting
                </label>
              </li>
            </ul>
          </div>
        )}

        {totalItemsOversent > 0 && (
          <div className="px-2 mt-1">
            <ul>
              <li>
                <label className="fw_500">
                  There are{' '}
                  <span className="text_primary mx-1">
                    {totalItemsOversent}
                  </span>
                  trackable items that need REMOVING
                </label>
              </li>
            </ul>
          </div>
        )}

        <div className="card_body">
          <div className="note_top_button_wrap p-2 pb-3">
            <Row>
              <Col lg={5} className="mb-2 mb-lg-0">
                <ul className="d-flex flex-wrap">
                  <li className="me-3 mb-1">
                    <FormControl>
                      <Select
                        labelId="Enquiries-label"
                        id="Enquiries"
                        value={selectedAction}
                        onChange={handleActionChange}
                        defaultValue="Select"
                        className="select_wrap"
                      >
                        <MenuItem value="Select">--Action--</MenuItem>
                        {actionTypeList?.notQuickLinkData?.map(data => {
                          return (
                            <MenuItem
                              key={data?._id}
                              value={data?._id}
                              onClick={() => {
                                setSelectedActionData(data);
                                setSelectedCorrespondanceData(
                                  correspondenceTypeList?.activeTypeMainData
                                    .group_data[0],
                                );
                                handleClickOpen(true, true, true);
                                // setDataExpand({
                                //   ...dataExpand,
                                //   actionDataExpand: false,
                                // });
                              }}
                            >
                              {data?.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </li>
                  {actionTypeList?.quickLinkData
                    ?.filter(data => {
                      // Exclude "Tracked Items" and "Post Items" based on conditions
                      if (
                        (trackedHistory.length === 0 &&
                          data.name === 'Tracked Items') ||
                        (trackableProducts.length === 0 &&
                          data.name === 'Post Items')
                      ) {
                        return false;
                      }
                      return true;
                    })
                    ?.map(data => {
                      return (
                        <li className="me-3  mb-1" key={data?._id}>
                          <Button
                            className="btn_border small"
                            onClick={() => {
                              setSelectedActionData(data);
                              setSelectedCorrespondanceData(
                                correspondenceTypeList?.activeTypeMainData
                                  .group_data[0],
                              );
                              handleClickOpen(true, true, true, data);
                              // setDataExpand({
                              //   ...dataExpand,
                              //   actionDataExpand: false,
                              // });
                            }}
                          >
                            <i className={`fa fa-${data?.icon} me-2`}></i>
                            {data?.name}
                          </Button>
                        </li>
                      );
                    })}
                </ul>
              </Col>
              <Col lg={7}>
                <ul className="d-flex justify-content-end flex-wrap">
                  {correspondenceTypeList?.quickLinkData?.map(data => {
                    return (
                      <li className="ms-3  mb-1" key={data?._id}>
                        <Button
                          className="btn_border small"
                          onClick={() => {
                            setSelectedCorrespondanceData(data);
                            setSelectedActionData(
                              actionTypeList?.activeTypeMainData.group_data[0],
                            );
                            handleClickOpen(false, true, true);
                            // setDataExpand({
                            //   ...dataExpand,
                            //   correspondanceDataExpand: false,
                            // });
                          }}
                        >
                          <i className={`fa fa-${data?.icon} me-2`}></i>
                          {data?.name}
                        </Button>
                      </li>
                    );
                  })}

                  <li className="ms-3">
                    <FormControl>
                      <Select
                        labelId="Enquiries2-label"
                        id="Enquiries2"
                        value={selectedCorres}
                        onChange={handleCorresChange}
                        defaultValue="Contact"
                        className="select_wrap"
                      >
                        {/* remove default -- contact -- as per client requirement */}
                        <MenuItem value="Contact">--Contact--</MenuItem>
                        {correspondenceTypeList?.notQuickLinkData?.map(data => {
                          return (
                            <MenuItem
                              key={data?._id}
                              value={data?._id}
                              onClick={() => {
                                setSelectedCorrespondanceData(data);
                                setSelectedActionData(
                                  actionTypeList?.activeTypeMainData
                                    .group_data[0],
                                );
                                handleClickOpen(false, true, true);
                                // setDataExpand({
                                //   ...dataExpand,
                                //   correspondanceDataExpand: false,
                                // });
                              }}
                            >
                              {data?.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
          <div className="note_table_wrap p-2 pt-3">
            <div className="parties_table_Wrap">
              <Row className="align-items-center mb-3 justify-content-end">
                <Col xs={3}>
                  <div className="search_wrapper_common">
                    <input
                      type="search"
                      value={searchData}
                      onChange={e => {
                        setSearchData(e.target.value);
                      }}
                      placeholder="Search"
                      className="form-control"
                    />
                    <button
                      className="btn_primary small"
                      onClick={() => {
                        Search(searchData);
                      }}
                    >
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
                      <TableCell>
                        <span onClick={() => requestSortActive('subject')}>
                          Subject
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('user_name')}>
                          User
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('date')}>
                          Date & Time
                        </span>
                      </TableCell>
                      <TableCell>Act.</TableCell>
                      <TableCell>Cor.</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>Public</TableCell>
                      <TableCell>Venue</TableCell>
                      <TableCell>Dietary</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemsActive?.map(note => {
                      let styleCss = {
                        textDecoration: note?.is_void ? 'line-through' : 'none',
                        backgroundColor: note?.is_void ? '#ffdddd ' : 'white',
                      };
                      return (
                        <TableRow key={note?._id}>
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
                              {/* <ShowMoreHandler
                                check={check}
                                setCheck={setCheck}
                                _id={note._id}
                                toggle={note.show_more}
                                elementData={note?.subject}
                              /> */}
                            </div>
                          </TableCell>
                          <TableCell style={styleCss}>
                            {note?.user ? note?.user?.name : '-'}
                          </TableCell>
                          <TableCell style={styleCss}>
                            {note?.date
                              ? moment(note?.date).format(
                                  'h:mm a - ddd Do MMMM YYYY',
                                )
                              : ''}
                          </TableCell>
                          <TableCell
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={note?.action?.icon}
                            style={styleCss}
                          >
                            <i
                              className={`fa fa-${note?.action?.icon} me-2`}
                            ></i>
                          </TableCell>
                          <TableCell
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={note?.correspondance?.icon}
                            style={styleCss}
                          >
                            <i
                              className={`fa fa-${note?.correspondance?.icon} me-2`}
                            ></i>
                          </TableCell>
                          <TableCell
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={directionNoteList
                              ?.filter(
                                data =>
                                  data?.directionValue === note?.direction,
                              )
                              .map(data => data?.labelName)
                              .join('')}
                            style={styleCss}
                          >
                            {directionIcon(note?.direction)
                              ? directionIcon(note?.direction)
                              : ''}
                          </TableCell>
                          <TableCell
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={
                              visibilityIcon(note?.visibility, 'Public')
                                ? 'Public'
                                : ''
                            }
                            style={styleCss}
                          >
                            {visibilityIcon(note?.visibility, 'Public')
                              ? visibilityIcon(note?.visibility, 'Public')
                              : ''}
                          </TableCell>
                          <TableCell
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={
                              visibilityIcon(note?.visibility, 'Venue')
                                ? 'Venue'
                                : ''
                            }
                            style={styleCss}
                          >
                            {visibilityIcon(note?.visibility, 'Venue')
                              ? visibilityIcon(note?.visibility, 'Venue')
                              : ''}
                          </TableCell>
                          <TableCell
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title={
                              visibilityIcon(note?.visibility, 'Dietary')
                                ? 'Dietary'
                                : ''
                            }
                            style={styleCss}
                          >
                            {visibilityIcon(note?.visibility, 'Dietary')
                              ? visibilityIcon(note?.visibility, 'Dietary')
                              : ''}
                          </TableCell>
                          <TableCell style={styleCss}>
                            <ul className="action_wrap">
                              <li>
                                <Button
                                  className="btn_edit"
                                  onClick={() => {
                                    dispatch(
                                      getEnquiryNoteData({ _id: note?._id }),
                                    );
                                    handleClickOpen(false, false, true);
                                    // setDataExpand({
                                    //   correspondanceDataExpand: false,
                                    //   actionDataExpand: false,
                                    // });
                                  }}
                                >
                                  {note?.is_void ? (
                                    <img src={EyeIcon} alt="View Icon" />
                                  ) : (
                                    <img src={EditIcon} alt="Edit Icon" />
                                  )}
                                </Button>
                              </li>
                              <li>
                                <Button
                                  className="btn_border small"
                                  onClick={() => {
                                    OpenDelete(note?._id);
                                  }}
                                >
                                  Delete
                                </Button>
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
                {itemsActive?.length > 0 ? (
                  <Row className="g-0 align-items-center my-2">
                    <Col sm={6}>
                      <div className="total_entry">
                        <p className="m-0">
                          Showing {activeIndexOfFirstItem + 1} to{' '}
                          {Math.min(
                            activeIndexOfLastItem,
                            noteListData?.length,
                          )}{' '}
                          of {noteListData?.length} entries
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
          </div>
        </div>
      </div>
      {open?.openModel && (
        <NoteItemModal
          open={open}
          bookingId={bookingId}
          handleClose={handleClose}
          selectedActionData={selectedActionData}
          selectedCorrespondanceData={selectedCorrespondanceData}
          actionTypeList={actionTypeList}
          correspondenceTypeList={correspondenceTypeList}
          visibilityNoteList={visibilityNoteList}
          trackNoteTypeId={trackNoteTypeId}
          postNoteTypeId={postNoteTypeId}
          // noteList={noteList}
          // setNoteList={setNoteList}
        />
      )}

      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteNote}
        name="Are you sure you want to delete this Note? Note: this cannot be undone"
      />

      <ShowMoreInitializer data={activeCurrentData} setState={setCheck} />
    </>
  );
}
