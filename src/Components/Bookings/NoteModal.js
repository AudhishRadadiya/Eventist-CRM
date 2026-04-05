import ThumbFill from '../../Assets/Img/thumb-fill.svg';
import FlagFill from '../../Assets/Img/flag-fill.svg';
import UnLockFill from '../../Assets/Img/unlock-fill.svg';
import LockFill from '../../Assets/Img/lock-fill.svg';
import HoldDate from '../../Assets/Img/hold-date.svg';
import EmailFill from '../../Assets/Img/email-fill.svg';
import DownArrow from '../../Assets/Img/down-arrow-gray.svg';
import DialogContent from '@mui/material/DialogContent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Form, Formik } from 'formik';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import {
  createEnquiryNote,
  updateEnquiryNote,
} from 'store/reducers/Enquiry/Note/enquiryNote.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUserListData } from 'store/reducers/User/user.slice';
import { Button, Col, Row } from 'react-bootstrap';
import {
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import { directionNoteList } from 'utils/FieldValues';
import Cookies from 'js-cookie';
import { fromBase64Unicode } from 'utils/common';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 19,
            top: 19,
            color: theme => theme.palette.grey[600],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function NoteItemModal({
  bookingId,
  open,
  selectedActionData,
  selectedCorrespondanceData,
  handleClose,
  actionTypeList,
  correspondenceTypeList,
  visibilityNoteList,
  trackNoteTypeId,
  postNoteTypeId,
}) {
  const UserSessionCRMCookie = Cookies.get('UserSessionCRM');
  const dispatch = useDispatch();

  const [visibilityData, setVisibilityData] = useState([]);
  const [productQuantities, setProductQuantities] = useState([]);
  const [editData, setEditData] = useState({
    action_data: {},
    correspondance_data: {},
  });
  const [dataExpand, setDataExpand] = useState({
    actionDataExpand: false,
    correspondanceDataExpand: false,
  });
  const [istracktype, setIsTrackType] = useState('N');

  const { activeNoteTypesList } = useSelector(({ noteTypes }) => noteTypes);
  const { activeUserList } = useSelector(({ user }) => user);
  const { enquiryNoteDetail } = useSelector(({ enquiryNotes }) => enquiryNotes);
  const {
    enquiryNoteList,
    noteTrackableProductDetail: trackableProducts,
    noteTrackableHistoryDetail: trackedHistory,
  } = useSelector(({ enquiryNotes }) => enquiryNotes);

  const UserSessionCRM = UserSessionCRMCookie
    ? JSON.parse(fromBase64Unicode(UserSessionCRMCookie))
    : null;

  const initialValuesAddNotes = {
    enquiry_id: '',
    action: '',
    correspondance: '',
    direction: '',
    hold_date: '',
    subject: '',
    contents: '',
    visibility: '',
    loaded_by: UserSessionCRM?._id ? UserSessionCRM?._id : '',
    timestamp: '',
    reminder_for: UserSessionCRM?._id ? UserSessionCRM?._id : '',
    reminder_time: '',
    reminder_email: false,
    reminder_calender: false,
    reminder_complete: false,
    admin_locked: false,
    flag_note_for_admin: false,
    products: [
      {
        id: '',
        value: '',
      },
    ],
  };
  const [noteList, setNoteList] = useState(initialValuesAddNotes);

  useEffect(() => {
    if (bookingId) {
      dispatch(getUserListData());
    }
  }, [dispatch, bookingId]);

  useEffect(() => {
    if (Object.values(enquiryNoteDetail)?.length > 0) {
      setNoteList({
        enquiry_id: enquiryNoteDetail?.enquiry_id,
        action: enquiryNoteDetail?.action,
        correspondance: enquiryNoteDetail?.correspondance,
        direction: enquiryNoteDetail?.direction,
        hold_date: enquiryNoteDetail?.hold_date,
        subject: enquiryNoteDetail?.subject,
        contents: enquiryNoteDetail?.contents,
        visibility: enquiryNoteDetail?.visibility || false,
        loaded_by: enquiryNoteDetail?.loaded_by,
        timestamp: enquiryNoteDetail?.timestamp,
        reminder_for: enquiryNoteDetail?.reminder_for,
        reminder_time: enquiryNoteDetail?.reminder_time || '',
        reminder_email: enquiryNoteDetail?.reminder_email || false,
        reminder_calender: enquiryNoteDetail?.reminder_calender || false,
        reminder_complete: enquiryNoteDetail?.reminder_complete || false,
        admin_locked: enquiryNoteDetail?.admin_locked,
        flag_note_for_admin: enquiryNoteDetail?.flag_note_for_admin || false,
      });

      let newVisibilityData = [];
      if (enquiryNoteDetail?.visibility === 0) {
        newVisibilityData.push('Venue');
      } else if (enquiryNoteDetail?.visibility === 1) {
        newVisibilityData.push('Public');
      } else if (enquiryNoteDetail?.visibility === 2) {
        newVisibilityData.push('Dietary');
      } else if (enquiryNoteDetail?.visibility === 3) {
        newVisibilityData.push('Venue');
        newVisibilityData.push('Public');
        newVisibilityData.push('Dietary');
      } else {
        newVisibilityData = [];
      }
      setVisibilityData(newVisibilityData);
      let newCorrespondanceData =
        correspondenceTypeList?.activeTypeMainData.group_data?.filter(
          data => data._id === enquiryNoteDetail?.correspondance,
        );
      let newActionData =
        actionTypeList?.activeTypeMainData?.group_data?.filter(
          data => data._id === enquiryNoteDetail?.action,
        );
      setEditData({
        ...editData,
        action_data: newActionData,
        correspondance_data: newCorrespondanceData,
      });
    }
  }, [
    actionTypeList?.activeTypeMainData?.group_data,
    correspondenceTypeList?.activeTypeMainData.group_data,
    enquiryNoteDetail,
  ]);

  useEffect(() => {
    if (
      selectedCorrespondanceData &&
      open?.openModel &&
      open?.isAdd &&
      open?.isOpenUsingAction
    ) {
      setNoteList({
        ...noteList,
        correspondance: selectedCorrespondanceData?._id,
      });
    }
    if (
      selectedActionData &&
      open?.openModel &&
      open?.isAdd &&
      open?.isOpenUsingAction === false
    ) {
      setNoteList({
        ...noteList,
        action: selectedActionData?._id,
      });
    }
  }, [selectedCorrespondanceData, selectedActionData, open]);

  useEffect(() => {
    let noteDataList = [];
    let typeDataList = [];

    if (!open.isAdd) {
      noteDataList = enquiryNoteList;
    } else {
      typeDataList = activeNoteTypesList?.[0]?.group_data;
    }
    if (noteDataList?.length > 0) {
      let filteredList = noteDataList?.filter(
        d =>
          d?.action?._id === trackNoteTypeId ||
          d?.action?._id === postNoteTypeId,
      );
      if (filteredList?.length > 0) {
        setIsTrackType('E');
      }
    } else {
      let filteredList = typeDataList?.filter(
        d => d?._id === trackNoteTypeId || d?._id === postNoteTypeId,
      );
      if (filteredList?.length > 0) {
        setIsTrackType('Y');
      }
    }
  }, [
    activeNoteTypesList,
    open,
    enquiryNoteList,
    trackNoteTypeId,
    postNoteTypeId,
  ]);

  const radioLable = (imageName, imageColor, labelText) => {
    return (
      <div className="d-flex justify-content-end align-items-center">
        <i
          className={`fa fa-${imageName} me-2`}
          style={{
            color: `${imageColor}`,
          }}
        ></i>
        {labelText}
      </div>
    );
  };

  const radioDataLable = (imageName, labelText) => {
    return (
      <div className="d-flex justify-content-end align-items-center">
        <img src={imageName} alt="Chat icon" className="me-2" />
        {labelText}
      </div>
    );
  };
  const checkboxLable = (imageName, labelText) => {
    return (
      <div className="d-flex justify-content-end align-items-center">
        <img src={imageName} alt="Chat icon" className="me-2" />
        {labelText}
      </div>
    );
  };

  return (
    <>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open?.openModel}
        className="large_popup"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {open.isAdd ? 'Add' : 'Edit'} Booking Note
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <Formik
              enableReinitialize={true}
              initialValues={noteList}
              onSubmit={values => {
                let newVisibility =
                  visibilityData?.includes('Venue') &&
                  visibilityData?.includes('Public') &&
                  visibilityData?.includes('Dietary') &&
                  visibilityData?.length === 3
                    ? 3
                    : visibilityData?.includes('Venue')
                    ? 0
                    : visibilityData?.includes('Public')
                    ? 1
                    : visibilityData?.includes('Dietary')
                    ? 2
                    : '';
                let note = {
                  ...values,
                  action:
                    values?.action === ''
                      ? selectedActionData?._id
                      : values?.action,
                  correspondance:
                    values?.correspondance === ''
                      ? selectedCorrespondanceData?._id
                      : values?.correspondance,
                  visibility: newVisibility,
                  direction: Number(values.direction),
                  admin_locked: Boolean(values.admin_locked),
                  enquiry_id: bookingId,
                  products: productQuantities,
                };
                if (open?.isAdd) {
                  dispatch(createEnquiryNote(note));
                } else {
                  dispatch(
                    updateEnquiryNote({
                      _id: enquiryNoteDetail?._id,
                      note: note,
                    }),
                  );
                }
              }}
            >
              {({
                handleSubmit,
                handleChange,
                setFieldValue,
                values,
                getFieldProps,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col xs={8}>
                      <div className="popup_content_inner">
                        <ul>
                          <li>
                            <label>Action</label>
                            <div className="right_content arrow_toggle_wrap radio_group_wrap">
                              <FormControl className="Radio_with_image">
                                <RadioGroup
                                  row
                                  aria-labelledby="action-group-label"
                                  name="action-group"
                                >
                                  {open?.openModel &&
                                    open?.isAdd === false &&
                                    open?.isOpenUsingAction === false &&
                                    dataExpand.actionDataExpand === false && (
                                      <FormControlLabel
                                        value={editData.action_data[0]?._id}
                                        name="action"
                                        control={<Radio />}
                                        checked={
                                          values.action ===
                                          editData.action_data[0]?._id
                                        }
                                        label={radioLable(
                                          editData.action_data[0]?.icon,
                                          editData.action_data[0]?.icon_colour,
                                          editData.action_data[0]?.name,
                                        )}
                                        onChange={handleChange}
                                      />
                                    )}
                                  {open?.openModel &&
                                    open?.isOpenUsingAction &&
                                    open?.isAdd &&
                                    dataExpand.actionDataExpand === false && (
                                      <FormControlLabel
                                        value={selectedActionData?._id}
                                        name="action"
                                        checked={selectedActionData?._id !== ''}
                                        control={<Radio />}
                                        label={radioLable(
                                          selectedActionData?.icon,
                                          selectedActionData?.icon_colour,
                                          selectedActionData?.name,
                                        )}
                                        onChange={handleChange}
                                      />
                                    )}
                                  {((open?.openModel &&
                                    open?.isOpenUsingAction &&
                                    open?.isAdd &&
                                    dataExpand.actionDataExpand) ||
                                    (open?.openModel &&
                                      open?.isOpenUsingAction === false &&
                                      open?.isAdd)) &&
                                    actionTypeList?.activeTypeMainData.group_data?.map(
                                      data => {
                                        return (
                                          <FormControlLabel
                                            value={data?._id}
                                            name="action"
                                            checked={values.action === data._id}
                                            control={<Radio />}
                                            label={radioLable(
                                              data?.icon,
                                              data?.icon_colour,
                                              data?.name,
                                            )}
                                            onChange={handleChange}
                                          />
                                        );
                                      },
                                    )}
                                </RadioGroup>
                              </FormControl>
                              {open?.openModel &&
                                open?.isOpenUsingAction &&
                                open?.isAdd &&
                                dataExpand.actionDataExpand !== true && (
                                  <span className="arrow_toggle">
                                    <img
                                      src={DownArrow}
                                      alt="Arrow Icon"
                                      onClick={() => {
                                        setFieldValue(
                                          'action',
                                          selectedActionData?._id,
                                        );
                                        setDataExpand({
                                          ...dataExpand,
                                          actionDataExpand: true,
                                        });
                                      }}
                                    />
                                  </span>
                                )}
                              <FormControl className="Radio_with_image">
                                <RadioGroup
                                  row
                                  aria-labelledby="action2-group-label"
                                  name="action-group"
                                >
                                  {open?.openModel &&
                                    open?.isOpenUsingAction === false &&
                                    open?.isAdd === false &&
                                    dataExpand.actionDataExpand &&
                                    actionTypeList?.activeTypeMainData.group_data?.map(
                                      data => {
                                        return (
                                          <FormControlLabel
                                            key={`actions_${data?._id}`}
                                            value={data?._id}
                                            name="action"
                                            checked={
                                              values.action === data?._id
                                            }
                                            control={<Radio />}
                                            label={radioLable(
                                              data?.icon,
                                              data?.icon_colour,
                                              data?.name,
                                            )}
                                            onChange={handleChange}
                                          />
                                        );
                                      },
                                    )}
                                </RadioGroup>
                              </FormControl>
                              {open?.openModel &&
                                open?.isOpenUsingAction === false &&
                                open?.isAdd === false &&
                                dataExpand.actionDataExpand !== true && (
                                  <span className="arrow_toggle">
                                    <img
                                      src={DownArrow}
                                      alt="Arrow Icon"
                                      onClick={() => {
                                        setFieldValue(
                                          'action',
                                          editData.action_data[0]?._id,
                                        );
                                        setDataExpand({
                                          ...dataExpand,
                                          actionDataExpand: true,
                                        });
                                      }}
                                    />
                                  </span>
                                )}
                            </div>
                          </li>
                          <li>
                            <label>Correspondance</label>
                            <div className="right_content arrow_toggle_wrap radio_group_wrap">
                              <FormControl className="Radio_with_image">
                                <RadioGroup
                                  row
                                  aria-labelledby="Correspondance-group-label"
                                  name="Correspondance-group"
                                >
                                  {open?.openModel &&
                                    open?.isAdd === false &&
                                    open?.isOpenUsingAction === false &&
                                    dataExpand.correspondanceDataExpand !==
                                      true && (
                                      <FormControlLabel
                                        value={
                                          editData.correspondance_data[0]?._id
                                        }
                                        checked={
                                          values.correspondance ===
                                          editData.correspondance_data[0]?._id
                                        }
                                        name="correspondance"
                                        control={<Radio />}
                                        label={radioLable(
                                          editData.correspondance_data[0]?.icon,
                                          editData.correspondance_data[0]
                                            ?.icon_colour,
                                          editData.correspondance_data[0]?.name,
                                        )}
                                        onChange={handleChange}
                                      />
                                    )}

                                  {open?.openModel &&
                                    open?.isAdd &&
                                    open?.isOpenUsingAction === false &&
                                    dataExpand.correspondanceDataExpand !==
                                      true && (
                                      <FormControlLabel
                                        value={selectedCorrespondanceData?._id}
                                        checked={
                                          selectedCorrespondanceData?._id !== ''
                                        }
                                        name="correspondance"
                                        control={<Radio />}
                                        label={radioLable(
                                          selectedCorrespondanceData?.icon,
                                          selectedCorrespondanceData?.icon_colour,
                                          selectedCorrespondanceData?.name,
                                        )}
                                        onChange={handleChange}
                                      />
                                    )}

                                  {((open?.openModel &&
                                    open?.isAdd &&
                                    open?.isOpenUsingAction === false &&
                                    dataExpand.correspondanceDataExpand ===
                                      true) ||
                                    (open?.openModel &&
                                      open?.isAdd &&
                                      open?.isOpenUsingAction)) &&
                                    correspondenceTypeList?.activeTypeMainData.group_data?.map(
                                      data => {
                                        return (
                                          <FormControlLabel
                                            key={`corres_${data?._id}`}
                                            value={data?._id}
                                            checked={
                                              values.correspondance ===
                                              data?._id
                                            }
                                            name="correspondance"
                                            control={<Radio />}
                                            label={radioLable(
                                              data?.icon,
                                              data?.icon_colour,
                                              data?.name,
                                            )}
                                            onChange={handleChange}
                                          />
                                        );
                                      },
                                    )}
                                </RadioGroup>
                              </FormControl>
                              <FormControl className="Radio_with_image">
                                <RadioGroup
                                  row
                                  aria-labelledby="Correspondance2-group-label"
                                  name="correspondance-group"
                                >
                                  {open?.openModel &&
                                    open?.isOpenUsingAction === false &&
                                    open?.isAdd === false &&
                                    dataExpand.correspondanceDataExpand ===
                                      true &&
                                    correspondenceTypeList?.activeTypeMainData.group_data?.map(
                                      data => {
                                        return (
                                          <FormControlLabel
                                            key={`corres_2_${data?._id}`}
                                            value={data?._id}
                                            checked={
                                              values.correspondance ===
                                              data?._id
                                            }
                                            name="correspondance"
                                            control={<Radio />}
                                            label={radioLable(
                                              data?.icon,
                                              data?.icon_colour,
                                              data?.name,
                                            )}
                                            onChange={handleChange}
                                          />
                                        );
                                      },
                                    )}
                                </RadioGroup>
                              </FormControl>
                              {open?.openModel &&
                                open?.isOpenUsingAction === false &&
                                open?.isAdd &&
                                dataExpand.correspondanceDataExpand !==
                                  true && (
                                  <span className="arrow_toggle">
                                    <img
                                      src={DownArrow}
                                      alt="Arrow Icon"
                                      onClick={() => {
                                        setFieldValue(
                                          'correspondance',
                                          selectedCorrespondanceData?._id,
                                        );
                                        setDataExpand({
                                          ...dataExpand,
                                          correspondanceDataExpand: true,
                                        });
                                      }}
                                    />
                                  </span>
                                )}
                              {open?.openModel &&
                                open?.isOpenUsingAction === false &&
                                open?.isAdd === false &&
                                dataExpand.correspondanceDataExpand !==
                                  true && (
                                  <span className="arrow_toggle">
                                    <img
                                      src={DownArrow}
                                      alt="Arrow Icon"
                                      onClick={() => {
                                        setFieldValue(
                                          'correspondance',
                                          editData.correspondance_data[0]?._id,
                                        );
                                        setDataExpand({
                                          ...dataExpand,
                                          correspondanceDataExpand: true,
                                        });
                                      }}
                                    />
                                  </span>
                                )}
                            </div>
                          </li>
                          <li>
                            <label>Direction</label>
                            <div className="right_content">
                              <FormControl className="Radio_with_image">
                                <RadioGroup
                                  row
                                  aria-labelledby="Direction-group-label"
                                  name="direction"
                                  value={values.direction}
                                  // onChange={handleChange}
                                  onChange={e => {
                                    setFieldValue('direction', e.target.value);
                                  }}
                                >
                                  {directionNoteList?.map(data => {
                                    return (
                                      <FormControlLabel
                                        key={`directions_${data?.directionValue}`}
                                        value={data?.directionValue}
                                        control={<Radio />}
                                        label={radioDataLable(
                                          data?.lableIcon,
                                          data?.labelName,
                                        )}
                                      />
                                    );
                                  })}
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </li>
                          <li>
                            <label>Note Hold Date:</label>
                            <div className="right_content">
                              <div className="date_picker w-25">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    name="hold_date"
                                    value={values?.hold_date}
                                    inputFormat="DD-MM-YYYY"
                                    onChange={date =>
                                      setFieldValue('hold_date', date)
                                    }
                                    // minDate={new Date()}
                                    renderInput={params => (
                                      <TextField {...params} />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                            </div>
                          </li>
                          <li>
                            <label>Note Subject:</label>
                            <div className="right_content">
                              <FormGroup className="input_wrap">
                                <FormControl fullWidth className="small_select">
                                  <TextField
                                    id="Discount"
                                    type="text"
                                    variant="outlined"
                                    className="input_wrap"
                                    name="subject"
                                    value={values.subject}
                                    {...getFieldProps('subject')}
                                  />
                                </FormControl>
                              </FormGroup>
                            </div>
                          </li>
                          <li className="align-items-start">
                            <label>Note Contents:</label>
                            <div className="right_content">
                              <FormGroup className="input_wrap">
                                <FormControl fullWidth>
                                  <TextField
                                    id="NoteContents"
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    name="contents"
                                    value={values.contents}
                                    {...getFieldProps('contents')}
                                  />
                                </FormControl>
                              </FormGroup>
                            </div>
                          </li>
                          {open?.data?.name === 'Tracked Item' && (
                            <li className="align-items-start">
                              <label>Trackable Items:</label>
                              <div className="right_content">
                                <TableContainer
                                  component={Paper}
                                  style={{ marginLeft: '0' }}
                                >
                                  <Table
                                    sx={{ minWidth: 650 }}
                                    aria-label="simple table"
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>
                                          <span>Product</span>
                                        </TableCell>
                                        <TableCell>
                                          <span>Qty to Send</span>
                                        </TableCell>
                                        <TableCell>
                                          <span>Qty Required</span>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {istracktype === 'E'
                                        ? trackedHistory &&
                                          trackedHistory?.map(
                                            (trackItem, trackIndex) => (
                                              <TableRow key={trackIndex}>
                                                <TableCell>
                                                  {
                                                    trackItem?.product
                                                      ?.internal_name
                                                  }
                                                </TableCell>
                                                <TableCell>
                                                  <FormGroup className="input_wrap">
                                                    <FormControl
                                                      fullWidth
                                                      className="small_select"
                                                    >
                                                      <TextField
                                                        id={`products[${trackIndex}].qty`}
                                                        name={`products[${trackIndex}].qty`}
                                                        type="number"
                                                        onWheel={e =>
                                                          e.target.blur()
                                                        }
                                                        variant="outlined"
                                                        className="input_wrap"
                                                        value={
                                                          values.products[
                                                            trackIndex
                                                          ]?.qty !== undefined
                                                            ? values.products[
                                                                trackIndex
                                                              ]?.qty
                                                            : trackItem?.qty ||
                                                              ''
                                                        }
                                                        onChange={e => {
                                                          handleChange(e);
                                                          const newQuantities =
                                                            [
                                                              ...productQuantities,
                                                            ];
                                                          newQuantities[
                                                            trackIndex
                                                          ] = {
                                                            id: trackItem
                                                              ?.product?._id,
                                                            value: Number(
                                                              e.target.value,
                                                            ),
                                                          };

                                                          setProductQuantities(
                                                            newQuantities,
                                                          );
                                                        }}
                                                      />
                                                    </FormControl>
                                                  </FormGroup>
                                                </TableCell>
                                                <TableCell>
                                                  {/* {numberRequired} */}
                                                </TableCell>
                                              </TableRow>
                                            ),
                                          )
                                        : trackableProducts &&
                                          trackableProducts?.map(
                                            (trackItem, trackIndex) => (
                                              <TableRow key={trackIndex}>
                                                <TableCell>
                                                  {
                                                    trackItem?.product
                                                      ?.internal_name
                                                  }
                                                </TableCell>
                                                <TableCell>
                                                  <FormGroup className="input_wrap">
                                                    <FormControl
                                                      fullWidth
                                                      className="small_select"
                                                    >
                                                      <TextField
                                                        id={`products[${trackIndex}].qty`}
                                                        name={`products[${trackIndex}].qty`}
                                                        type="number"
                                                        onWheel={e =>
                                                          e.target.blur()
                                                        }
                                                        variant="outlined"
                                                        className="input_wrap"
                                                        value={
                                                          values.products[
                                                            trackIndex
                                                          ]?.qty !== undefined
                                                            ? values.products[
                                                                trackIndex
                                                              ]?.qty
                                                            : trackItem?.qty ||
                                                              ''
                                                        }
                                                        onChange={e => {
                                                          handleChange(e);
                                                          const newQuantities =
                                                            [
                                                              ...productQuantities,
                                                            ];
                                                          newQuantities[
                                                            trackIndex
                                                          ] = {
                                                            id: trackItem
                                                              ?.product?._id,
                                                            value: Number(
                                                              e.target.value,
                                                            ),
                                                          };

                                                          setProductQuantities(
                                                            newQuantities,
                                                          );
                                                        }}
                                                      />
                                                    </FormControl>
                                                  </FormGroup>
                                                </TableCell>
                                                <TableCell>
                                                  {/* {numberRequired} */}
                                                </TableCell>
                                              </TableRow>
                                            ),
                                          )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                            </li>
                          )}
                          {open?.data?.name === 'Post Items' && (
                            <li className="align-items-start">
                              <label>Items to Post:</label>
                              <div className="right_content">
                                <TableContainer
                                  component={Paper}
                                  style={{ marginLeft: '0' }}
                                >
                                  <Table
                                    sx={{ minWidth: 650 }}
                                    aria-label="simple table"
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>
                                          <span>Product</span>
                                        </TableCell>
                                        <TableCell>
                                          <span>Qty Sent</span>
                                        </TableCell>
                                        <TableCell>
                                          <span>Date</span>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {trackableProducts &&
                                        trackableProducts?.map(
                                          (productItem, i) => {
                                            return (
                                              <TableRow key={i}>
                                                <TableCell>
                                                  {/* {
                                                    productItem?.product
                                                      ?.internal_name
                                                  } */}
                                                  {productItem?.product_name}
                                                </TableCell>
                                                <TableCell>
                                                  {productItem?.qty}
                                                </TableCell>
                                                <TableCell>
                                                  {moment(
                                                    productItem?.updated_at,
                                                  ).format(
                                                    'YYYY-MM-DD HH:mm:ss',
                                                  )}
                                                </TableCell>
                                              </TableRow>
                                            );
                                          },
                                        )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="popup_content_inner">
                        <ul>
                          <li>
                            <label>Visibility</label>
                            <div className="right_content">
                              <FormGroup
                                className="checkbox_with_img"
                                name="visibility"
                                value={values.visibility}
                                onChange={e => {
                                  if (e.target.checked) {
                                    if (
                                      !visibilityData?.includes(e.target.value)
                                    )
                                      setVisibilityData([
                                        ...visibilityData,
                                        e.target.value,
                                      ]);
                                  } else {
                                    let dummyList = visibilityData?.filter(
                                      data => data !== e.target.value,
                                    );
                                    setVisibilityData(dummyList);
                                  }
                                }}
                              >
                                {visibilityNoteList?.map(data => {
                                  const isChecked =
                                    (selectedActionData.name === 'Dietaries' ||
                                      selectedActionData.name ===
                                        'Early Arrival') &&
                                    data.visibilityValue === 'Venue';
                                  return (
                                    <FormControlLabel
                                      key={`visibilityValue_${data?.visibilityValue}`}
                                      control={
                                        <Checkbox
                                          value={data.visibilityValue}
                                        />
                                      }
                                      label={checkboxLable(
                                        data?.lableIcon,
                                        data?.labelName,
                                      )}
                                      // old
                                      // checked={visibilityData.includes(
                                      //   data.visibilityValue,
                                      // )}
                                      // new
                                      checked={
                                        isChecked ||
                                        visibilityData.includes(
                                          data.visibilityValue,
                                        )
                                      }
                                    />
                                  );
                                })}
                              </FormGroup>
                            </div>
                          </li>
                          <li>
                            <label>Loaded By:</label>
                            <div className="right_content">
                              <FormControl fullWidth>
                                <Select
                                  labelId="Enquiries-label"
                                  id="Enquiries"
                                  name="loaded_by"
                                  value={values.loaded_by}
                                  onChange={handleChange}
                                  defaultValue="Select"
                                  className="select_wrap"
                                  // disabled as per click up task requirement
                                  disabled
                                >
                                  {activeUserList?.map(user => {
                                    return (
                                      <MenuItem
                                        value={user?._id}
                                        key={`user_${user?._id}`}
                                      >
                                        {user?.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                          </li>
                          <li>
                            <label>Timestamp:</label>
                            <div className="right_content">
                              <div className="date_picker w-50">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DateTimePicker
                                    name="timestamp"
                                    inputFormat="DD-MM-YYYY hh:mm a"
                                    value={values.timestamp}
                                    onChange={date =>
                                      setFieldValue('timestamp', date)
                                    }
                                    minDate={new Date()}
                                    renderInput={props => (
                                      <TextField {...props} />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                            </div>
                          </li>
                          <li>
                            <label>Reminder for:</label>
                            <div className="right_content">
                              <FormControl fullWidth>
                                <Select
                                  labelId="Enquiries-label"
                                  id="Enquiries"
                                  name="reminder_for"
                                  value={values.reminder_for}
                                  onChange={handleChange}
                                  defaultValue="Select"
                                  className="select_wrap"
                                >
                                  {activeUserList?.map(user => {
                                    return (
                                      <MenuItem
                                        value={user?._id}
                                        key={`user1_${user?._id}`}
                                      >
                                        {user?.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </div>
                          </li>
                          <li>
                            <label>Reminder Time:</label>
                            <div className="right_content">
                              <div className="date_picker w-50">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DateTimePicker
                                    name="reminder_time"
                                    inputFormat="DD-MM-YYYY hh:mm a"
                                    value={values.reminder_time}
                                    onChange={date =>
                                      setFieldValue('reminder_time', date)
                                    }
                                    minDate={new Date()}
                                    renderInput={props => (
                                      <TextField {...props} />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                            </div>
                          </li>
                          <li>
                            <label>Reminder Email</label>
                            <div className="right_content">
                              <FormGroup className="checkbox_with_img">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="reminder_email"
                                      checked={values.reminder_email}
                                      onClick={handleChange}
                                    />
                                  }
                                  label={checkboxLable(EmailFill, 'Email')}
                                />
                              </FormGroup>
                            </div>
                          </li>
                          <li>
                            <label>Reminder Calender</label>
                            <div className="right_content">
                              <FormGroup className="checkbox_with_img">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="reminder_calender"
                                      checked={values.reminder_calender}
                                      onClick={handleChange}
                                    />
                                  }
                                  label={checkboxLable(HoldDate, 'Calender')}
                                />
                              </FormGroup>
                            </div>
                          </li>
                          <li>
                            <label>Reminder Complete</label>
                            <div className="right_content">
                              <FormGroup className="checkbox_with_img">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="reminder_complete"
                                      checked={values.reminder_complete}
                                      onClick={handleChange}
                                    />
                                  }
                                  label={checkboxLable(ThumbFill, 'Complete')}
                                />
                              </FormGroup>
                            </div>
                          </li>
                          <li>
                            <label>Admin Locked?</label>
                            <div className="right_content">
                              <FormControl className="Radio_with_image">
                                <RadioGroup
                                  row
                                  aria-labelledby="AdminLocked-group-label"
                                  name="admin_locked"
                                  value={values?.admin_locked}
                                  // onChange={handleChange}
                                  onChange={() =>
                                    setFieldValue(
                                      'admin_locked',
                                      !values.admin_locked,
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label={radioDataLable(
                                      UnLockFill,
                                      'Unlocked',
                                    )}
                                  />
                                  <FormControlLabel
                                    value={true}
                                    control={<Radio />}
                                    label={radioDataLable(LockFill, 'Locked')}
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </li>
                          <li>
                            <label>Flag Note For Admin?</label>
                            <div className="right_content">
                              <FormGroup className="checkbox_with_img">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="flag_note_for_admin"
                                      checked={values.flag_note_for_admin}
                                      onClick={handleChange}
                                    />
                                  }
                                  label={checkboxLable(FlagFill, 'Flagged')}
                                />
                              </FormGroup>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="modal_button">
                        <ul className="d-flex mt-3">
                          <li>
                            <Button className="btn_primary small" type="submit">
                              {open.isAdd ? 'Add' : 'Update'}
                            </Button>
                          </li>
                          <li>
                            <Button
                              type="button"
                              className="btn_border small ms-3"
                              onClick={handleClose}
                            >
                              Cancel
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
