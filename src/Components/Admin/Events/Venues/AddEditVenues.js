import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import UploadLogo from '../../../../Assets/Img/upload-logo.svg';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button, Col, Row } from 'react-bootstrap';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileUpload from 'react-material-file-upload';
import { ErrorMessage, Form, Formik, useFormikContext } from 'formik';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  searchVenueAddress,
  createVenue,
  getVenueData,
  setIsVenueUpdated,
  setVenueDetail,
  setVenueAddress,
  updateVenue,
  getVenueListData,
} from 'store/reducers/Admin/Events/venue.slice';
import Loader from 'Components/Common/Loader';
import { createdByOption } from 'utils/FieldValues';
import {
  ckEditorUploadImage,
  setUploadImageDetail,
  uploadImage,
  setIsUploadImageUpdated,
} from 'store/reducers/UploadImage/uploadImage.slice';
import { numberRegex } from 'utils/common';
import { showMessage } from 'store/reducers/common.slice';
import { getUserListData } from 'store/reducers/User/user.slice';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';

const LogoUrl = props => {
  const dispatch = useDispatch();
  const { getUploadImage, isUploadImageUpdated } = useSelector(
    ({ uploadImage }) => uploadImage,
  );
  const { venueDetail } = useSelector(({ venue }) => venue);
  const { setFieldValue } = useFormikContext();
  React.useEffect(() => {
    if (isUploadImageUpdated) {
      setFieldValue(props.name, getUploadImage);
      dispatch(setIsUploadImageUpdated(false));
    }
  }, [isUploadImageUpdated]);

  return (
    <>
      <div className="card_content_right">
        <span className="text_small mb-1 d-block">Upload Image</span>

        <div className="d-flex file_custom_wrap flex-wrap">
          <FormControl fullWidth className="file_upload_wrap">
            <FileUpload
              name="logo_url"
              type="file"
              accept="image/*"
              onChange={e => {
                const selectedFile = e[0];
                if (
                  (selectedFile && selectedFile.type === 'image/png') ||
                  (selectedFile && selectedFile.type === 'image/jpeg') ||
                  (selectedFile && selectedFile.type === 'image/jpg')
                ) {
                  const formData = new FormData();
                  formData.append('file', selectedFile);
                  dispatch(uploadImage(formData));
                } else {
                  dispatch(
                    showMessage({
                      message: 'Invalid file type. Please select a image only.',
                    }),
                  );
                }
              }}
            />
          </FormControl>
          <div className="upload_img">
            <img
              src={
                Object.assign(getUploadImage)?.length > 0
                  ? getUploadImage
                  : venueDetail?.logo_url
                  ? venueDetail?.logo_url
                  : UploadLogo
              }
              alt="Upload Icon"
              className="h-100 w-100"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default function AddEditVenues() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { venueId } = useParams();

  const { isVenueUpdated, venueLoading, venueDetail, venueAddress } =
    useSelector(({ venue }) => venue);

  const { activeEventList, inActiveEventList } = useSelector(
    ({ parties }) => parties,
  );

  const { activeUserList } = useSelector(({ user }) => user);

  const { uploadImageLoading } = useSelector(({ uploadImage }) => uploadImage);

  const initialValuesVenue = {
    sku: '',
    tag_for_mail_templates: '',
    website_url: '',
    website_quicklink_name: '',
    internal_name: '',
    public_name: '',
    side_menu_name: '',
    catchment_area_county: '',
    venue_manager_emails: '',
    venues_sales_manager: null,
    primary_region: '',
    show_in_regions: [],
    directions_for_bpe: '',
    lookup_address: '',
    address: '',
    hotel_search_term: '',
    latitude: '',
    longitude: '',
    phone: '',
    compare_booking_numbers_to: null,
    numbers_comparison_percentage: 0,
    notes: '',
    is_active: false,
    deleted: false,
    logo_url: '',
  };

  const [venueInitialValues, setVenueInitialValues] =
    useState(initialValuesVenue);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getUserListData());
    dispatch(getEventListData());
  }, [dispatch]);

  useEffect(() => {
    // dispatch(getVenueListData());
    dispatch(getVenueListData());
    if (venueId) {
      dispatch(getVenueData(venueId));
    }
  }, [dispatch, venueId]);

  useEffect(() => {
    if (isVenueUpdated) {
      navigate('/admin/events/venues');
      dispatch(setVenueDetail({}));
      dispatch(setIsVenueUpdated(false));
    }
    return () => {
      dispatch(setVenueDetail({}));
      dispatch(setVenueAddress({}));
      dispatch(setUploadImageDetail({}));
    };
  }, [isVenueUpdated]);

  useEffect(() => {
    if (Object.keys(venueDetail)?.length > 0) {
      setVenueInitialValues({
        sku: venueDetail?.sku,
        tag_for_mail_templates: venueDetail?.tag_for_mail_templates,
        website_url: venueDetail?.website_url,
        website_quicklink_name: venueDetail?.website_quicklink_name,
        internal_name: venueDetail?.internal_name,
        public_name: venueDetail?.public_name,
        side_menu_name: venueDetail?.side_menu_name,
        catchment_area_county: venueDetail?.catchment_area_county,
        venue_manager_emails: venueDetail?.venue_manager_emails,
        venues_sales_manager: venueDetail?.venues_sales_manager,
        primary_region: venueDetail?.primary_region,
        show_in_regions: venueDetail?.show_in_regions,
        directions_for_bpe: venueDetail?.directions_for_bpe
          ? venueDetail?.directions_for_bpe
          : '',
        lookup_address: venueDetail?.lookup_address,
        address: venueDetail?.address,
        hotel_search_term: venueDetail?.hotel_search_term,
        latitude: venueDetail?.latitude,
        longitude: venueDetail?.longitude,
        phone: venueDetail?.phone,
        compare_booking_numbers_to: venueDetail?.compare_booking_numbers_to,
        numbers_comparison_percentage:
          venueDetail?.numbers_comparison_percentage,
        notes: venueDetail?.notes,
        is_active: venueDetail?.is_active ? venueDetail?.is_active : false,
        deleted: venueDetail?.deleted ? venueDetail?.deleted : false,
        logo_url: venueDetail?.logo_url ? venueDetail?.logo_url : '',
      });
    }
  }, [venueDetail]);

  useEffect(() => {
    if (Object.keys(venueAddress).length > 0) {
      const lookUpBtn = document.getElementById('lookupAddressButton');
      setAnchorEl(lookUpBtn);
      setOpen(true);
    }
  }, [venueAddress]);

  const addEditVenueSchema = Yup.object().shape({
    sku: Yup.string()
      .required('SKU is a required field')
      .matches(/^[^\s]/, 'SKU cannot include leading spaces'),
    internal_name: Yup.string()
      .required('Internal Name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public Name is a required field')
      .matches(/^[^\s]/, 'Public name cannot include leading spaces'),
    tag_for_mail_templates: Yup.string()
      .matches(/^[^\s]/, 'Tag for mail templates cannot include leading spaces')
      .required('Tag for mail templates is a required field'),
    website_url: Yup.string()
      // .matches(
      //   /^(https:\/\/|http:\/\/|www\.)([a-zA-Z0-9-]+\.)+(com|co|co\.uk|net|org|edu|gov|biz|info|io|me|tv|us|in|ac|ai|app|asia|blog|ca|cc|club|cn|dev|digital|eu|fm|global|info|it|jp|la|li|me|mx|online|pro|shop|site|tech|travel|xyz|audio|camera|center|chat|cloud|design|email|finance|fun|games|health|land|live|marketing|media|money|news|photo|store|video|world|uk|au)(\/[^\s]*)?$/,
      //   'Please enter a valid url',
      // )
      .required('Website url is a required field'),
    website_quicklink_name: Yup.string()
      .matches(/^[^\s]/, 'Website quicklink name cannot include leading spaces')
      .required('Website quicklink name is a required field'),
    side_menu_name: Yup.string()
      .matches(/^[^\s]/, 'Side menu name cannot include leading spaces')
      .required('Side menu name is a required field'),
    catchment_area_county: Yup.string()
      .matches(/^[^\s]/, 'Catchment area county cannot include leading spaces')
      .required('Catchment area county is a required field'),
    venue_manager_emails: Yup.string()
      .email('Invalid email')
      .required('Venue manager emails is a required field')
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Invalid email'),
    primary_region: Yup.string().required('Primary region is a required field'),
    show_in_regions: Yup.array()
      .min(1, 'Please select at least one show in regions')
      .required('Please select at least one show in regions'),
    latitude: Yup.string().required('Latitude is a required field'),
    longitude: Yup.string().required('Longitude is a required field'),
  });

  const handleImageUpload = useCallback(async data => {
    const res = await dispatch(ckEditorUploadImage(data));
    if (res) return res;
    else return false;
  }, []);

  const imageUploadFunc = editor => {
    editor.plugins.get('FileRepository').createUploadAdapter = loader => {
      return {
        upload: async () => {
          const formData = new FormData();
          formData.append('file', await loader?.file);
          const res = await handleImageUpload(formData);
          if (res)
            return {
              default: res.payload,
            };
        },
      };
    };
  };

  return (
    <div className="inner_wrapper">
      {(venueLoading || uploadImageLoading) && <Loader />}
      <div className="addvenues_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Typography>Events</Typography>
            <Link to="/admin/events/venues">Venues</Link>
            <Typography>
              {!venueLoading && Object.keys(venueDetail).length === 0
                ? 'Add New Venue'
                : 'Edit Venue'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!venueLoading && Object.keys(venueDetail).length === 0
              ? 'Add New Venue'
              : 'Edit Venue'}
          </h1>
        </div>
        <div className="addvenues_wrap">
          <div className="card_wrapper">
            <Formik
              enableReinitialize={true}
              initialValues={venueInitialValues}
              validationSchema={addEditVenueSchema}
              onSubmit={values => {
                const data = {
                  ...values,
                  venues_sales_manager:
                    values?.venues_sales_manager === 'All'
                      ? null
                      : values.venues_sales_manager,
                };
                if (Object.keys(venueDetail).length > 0) {
                  dispatch(
                    updateVenue({
                      _id: venueDetail._id,
                      venue: data,
                    }),
                  );
                } else {
                  dispatch(createVenue({ ...data }));
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
                  <div className="card_body admin_card_body">
                    <ul>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                SKU<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('sku')}
                                  placeholder="Enter sku"
                                  className="input_wrap"
                                />
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="sku" />
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Short Tag for Mail Templates
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('tag_for_mail_templates')}
                                  placeholder="Enter tag for mail templates"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="tag_for_mail_templates" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Website URL
                                <sup className="text_primary">*</sup>
                                <span className="d-block fw_400">
                                  (this will set the live page address so:
                                  www.bestpartiesever.com/[Website URL Here])
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('website_url')}
                                  placeholder="Enter website url"
                                  className="input_wrap"
                                  onChange={e => {
                                    const modifiedValue =
                                      e.target.value.replace(/\s/g, '-');
                                    setFieldValue('website_url', modifiedValue);
                                  }}
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="website_url" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Website quicklink name
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('website_quicklink_name')}
                                  placeholder="Enter website quicklink name"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="website_quicklink_name" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Internal Name
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('internal_name')}
                                  placeholder="Enter internal name"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="internal_name" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Public Name
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('public_name')}
                                  placeholder="Enter public name"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="public_name" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Side Menu Name
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('side_menu_name')}
                                  placeholder="Enter side menu name"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="side_menu_name" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Catchment Area/County
                                <sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('catchment_area_county')}
                                  placeholder="Enter catchment area / country"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="catchment_area_county" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Venue Manager Emails
                                <sup className="text_primary">*</sup>
                                <span className="d-block fw_400">
                                  (seperate with a ,)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('venue_manager_emails')}
                                  placeholder="Enter venue manager emails"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="venue_manager_emails" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Venue Sales Manager</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <Select
                                  labelId="salesManager-label"
                                  id="venues_sales_manager"
                                  name="venues_sales_manager"
                                  value={values.venues_sales_manager}
                                  onChange={handleChange}
                                  className="select_wrap"
                                >
                                  <MenuItem value="All">
                                    -- No Sales Manager --
                                  </MenuItem>
                                  {activeUserList?.map((item, index) => {
                                    return (
                                      <MenuItem key={index} value={item?._id}>
                                        {item?.public_name}({item?.username})
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="venues_sales_manager" />
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Primary Region
                                <sup className="text_primary">*</sup>
                                <span className="d-block fw_400">
                                  (Display under this region in the website main
                                  menu & footer)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <Select
                                  labelId="Region-label"
                                  id="primary_region"
                                  name="primary_region"
                                  value={values.primary_region}
                                  onChange={handleChange}
                                  className="select_wrap"
                                >
                                  {createdByOption.map(name => {
                                    return (
                                      <MenuItem key={name} value={name}>
                                        {name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="primary_region" />
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Show in Region/s
                                <sup className="text_primary">*</sup>
                                <span className="d-block fw_400">
                                  (Hold CTRL/CMD and click for multiple)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap "
                              >
                                <Select
                                  labelId="ShowRegion-label"
                                  name="show_in_regions"
                                  value={values.show_in_regions}
                                  onChange={handleChange}
                                  multiple
                                  displayEmpty
                                  className="Multiselect_checkbox"
                                  renderValue={selected => {
                                    if (selected.length === 0) {
                                      return 'Select Created By';
                                    }
                                    return selected.join(', ');
                                  }}
                                >
                                  <MenuItem disabled value="">
                                    Select Created By
                                  </MenuItem>
                                  {createdByOption.map(name => {
                                    return (
                                      <MenuItem key={name} value={name}>
                                        <Checkbox
                                          checked={values.show_in_regions.includes(
                                            name,
                                          )}
                                        />
                                        <ListItemText primary={name} />
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="show_in_regions" />
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Directions for BPE.com</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values.directions_for_bpe}
                                onChange={(event, editor) => {
                                  handleChange('directions_for_bpe')(
                                    editor.getData(),
                                  );
                                }}
                                className="w-50"
                                style={{
                                  borderColor: '#DADDDF',
                                  padding: '5px',
                                  borderRadius: '5px',
                                  background: '#fff',
                                }}
                                onReady={editor => {
                                  imageUploadFunc(editor);
                                }}
                              />
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Lookup Address</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <div className="lookup_address_wrap d-flex align-items-center">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <TextField
                                    {...getFieldProps('lookup_address')}
                                    placeholder="Search lookup address"
                                    className="input_wrap"
                                  />
                                </FormControl>
                                <Button
                                  className="btn_primary small ms-2"
                                  id="lookupAddressButton"
                                  onClick={() =>
                                    dispatch(
                                      searchVenueAddress({
                                        address: values.lookup_address,
                                      }),
                                    )
                                  }
                                >
                                  <SearchOutlinedIcon />
                                </Button>
                                <Popper
                                  open={open}
                                  anchorEl={anchorEl}
                                  placement="right"
                                  transition
                                >
                                  {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={350}>
                                      <Paper>
                                        <CloseIcon
                                          className="cursor-pointer"
                                          onClick={() => setOpen(false)}
                                        />
                                        {venueAddress.length > 0 &&
                                          venueAddress?.map((item, index) => {
                                            return (
                                              <Typography
                                                key={index}
                                                sx={{ p: 1 }}
                                                onClick={e => {
                                                  if (
                                                    item?.Longitude &&
                                                    item.Latitude
                                                  ) {
                                                    setFieldValue(
                                                      'longitude',
                                                      item?.Longitude,
                                                    );
                                                    setFieldValue(
                                                      'latitude',
                                                      item?.Latitude,
                                                    );
                                                  }
                                                }}
                                              >
                                                <span className="cursor-pointer">
                                                  {item.Address}
                                                </span>
                                              </Typography>
                                            );
                                          })}
                                      </Paper>
                                    </Fade>
                                  )}
                                </Popper>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Address</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('address')}
                                  placeholder="Enter address"
                                  multiline
                                  rows={2}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Hotel Search Term
                                <span className="d-block fw_400">
                                  (Usually the Postcode or City name. If left
                                  blank the customer has to fill it in
                                  themselves.)
                                </span>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  {...getFieldProps('hotel_search_term')}
                                  placeholder="Enter hotel search term"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={12}>
                            <p className="m-0">
                              Latitude and Longitude details are used to
                              automatically pinpoint the customers' closest
                              event locations. This will be prefilled by looking
                              up the address above - for manually entered
                              addresses.
                            </p>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Latitude<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  name="latitude"
                                  {...getFieldProps('latitude')}
                                  placeholder="Enter latitude"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="latitude" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Longitude<sup className="text_primary">*</sup>
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  {...getFieldProps('longitude')}
                                  placeholder="Enter longitude"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="longitude" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      {venueId ? (
                        <li>
                          <Row className="justify-content-end">
                            <Col xs={7}>
                              <div className="card_content_right">
                                <span className="text_small">
                                  <Link
                                    to={`http://maps.google.com/maps?q=${values.latitude},${values?.longitude}`}
                                    target="_blank"
                                  >
                                    Lookup Latitude/Longitude on Google Maps
                                  </Link>
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </li>
                      ) : (
                        ''
                      )}
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Phone</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  {...getFieldProps('phone')}
                                  placeholder="Enter phone number"
                                  className="input_wrap"
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Compare Booking Numbers to</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <Select
                                  labelId="compareBooking-label"
                                  id="compareBooking"
                                  name="compare_booking_numbers_to"
                                  value={values.compare_booking_numbers_to}
                                  onChange={handleChange}
                                  className="select_wrap"
                                >
                                  <MenuItem value={null}>
                                    This Location
                                  </MenuItem>
                                  {[...activeEventList, ...inActiveEventList]
                                    ?.filter(
                                      _ => new Date().getFullYear() !== _.year,
                                    )
                                    ?.map(item => {
                                      return (
                                        <MenuItem
                                          key={item?._id}
                                          value={item?._id}
                                        >
                                          {item?.sku}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Numbers Comparison Percentage</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <div className="d-flex align-items-center">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <TextField
                                    type="number"
                                    onWheel={e => e.target.blur()}
                                    onKeyDown={e => {
                                      numberRegex(e);
                                    }}
                                    inputProps={{ min: 0 }}
                                    onBlurCapture={() => {
                                      setFieldValue(
                                        'numbers_comparison_percentage',
                                        Number(
                                          values.numbers_comparison_percentage,
                                        ).toFixed(2),
                                      );
                                    }}
                                    {...getFieldProps(
                                      'numbers_comparison_percentage',
                                    )}
                                    className="input_wrap"
                                    variant="outlined"
                                  />
                                </FormControl>
                                <span className="mx-1 text_small">%</span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Active</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  value={values.is_active}
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  onChange={() =>
                                    setFieldValue(
                                      'is_active',
                                      !values.is_active,
                                    )
                                  }
                                >
                                  <FormControlLabel
                                    value={true}
                                    control={<Radio />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label="No"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Notes</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  multiline
                                  rows={2}
                                  {...getFieldProps('notes')}
                                />
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={11}>
                            <p className="m-0">
                              You can totally remove this venue from the system
                              if it is no longer required. Note: the SKU will
                              not become available again as previous bookings
                              may be referenced against it. If you select 'Yes'
                              then you will not be able to undo the delete
                              without knowing the exact sku.
                            </p>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Deleted</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  value={values.deleted}
                                  onChange={() =>
                                    setFieldValue('deleted', !values.deleted)
                                  }
                                >
                                  <FormControlLabel
                                    value={true}
                                    control={<Radio />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label="No"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row className="align-items-start">
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Logo</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <LogoUrl name="logo_url" />
                          </Col>
                        </Row>
                      </li>
                    </ul>
                    <div className="card_footer admin_card_footer mb-2">
                      <button type="submit" className="btn_primary small ">
                        Save
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
