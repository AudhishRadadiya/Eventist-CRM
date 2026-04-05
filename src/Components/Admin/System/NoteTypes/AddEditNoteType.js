import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import { ErrorMessage, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Breadcrumbs,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import Loader from 'Components/Common/Loader';
import {
  createNoteTypes,
  getNoteTypesData,
  setIsNoteTypesUpdated,
  setNoteTypesDetail,
  updateNoteTypes,
} from 'store/reducers/Admin/System/noteTypes.slice';

import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';

export default function AddEditNoteType() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { noteTypesId } = useParams();

  const { noteTypesLoading, noteTypesDetail, isNoteTypesUpdated } = useSelector(
    ({ noteTypes }) => noteTypes,
  );

  const initialValuesNoteTypes = {
    type: 1,
    name: '',
    icon: '',
    icon_colour: '',
    is_quicklink: false,
    order: 0,
    is_active: false,
    deleted: false,
  };
  const [noteTypesInitialValues, setNoteTypesInitialValues] = useState(
    initialValuesNoteTypes,
  );

  const addEditNoteTypesSchema = Yup.object().shape({
    name: Yup.string()
      .required('Note Type Name is a required field')
      .matches(/^[^\s]/, 'Note Type Name cannot include leading spaces'),
    icon: Yup.string()
      .required('Note Type Icon is a required field')
      .matches(/^[^\s]/, 'Note Type Icon cannot include leading spaces'),
    icon_colour: Yup.string()
      .required('Note Type Icon Colour is a required field')
      .matches(/^[^\s]/, 'Note Type Icon Colour cannot include leading spaces'),
  });

  useEffect(() => {
    if (noteTypesId) {
      dispatch(getNoteTypesData(noteTypesId));
    }
  }, [noteTypesId, dispatch]);

  useEffect(() => {
    if (isNoteTypesUpdated) {
      navigate('/admin/note-types');
      dispatch(setNoteTypesDetail({}));
      dispatch(setIsNoteTypesUpdated(false));
    }
    return () => dispatch(setNoteTypesDetail({}));
  }, [isNoteTypesUpdated]);

  useEffect(() => {
    if (Object.keys(noteTypesDetail).length > 0) {
      setNoteTypesInitialValues({
        type: noteTypesDetail?.type,
        name: noteTypesDetail?.name,
        icon: noteTypesDetail?.icon,
        icon_colour: noteTypesDetail?.icon_colour,
        is_quicklink: noteTypesDetail.is_quicklink,
        order: noteTypesDetail?.order,
        is_active: noteTypesDetail?.is_active,
        deleted: noteTypesDetail?.deleted,
      });
    }
  }, [noteTypesDetail]);
  return (
    <div className="inner_wrapper">
      {noteTypesLoading && <Loader />}
      <div className="add_notetype_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/admin/system">System</Link>
            <Link to="/admin/note-types">Note Types</Link>
            <Typography>
              {!noteTypesLoading && Object.keys(noteTypesDetail)?.length === 0
                ? 'Add New Note Type'
                : 'Edit Note Type'}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>
            {!noteTypesLoading && Object.keys(noteTypesDetail)?.length === 0
              ? 'Add New Note Type'
              : 'Edit Note Type'}
          </h1>
        </div>
        <h5 className="text_primary">
          {noteTypesDetail?.name ? noteTypesDetail?.name : 'Add new Type'}:
        </h5>
        <div className="add_notetype_wrap">
          <Formik
            enableReinitialize={true}
            initialValues={noteTypesInitialValues}
            validationSchema={addEditNoteTypesSchema}
            onSubmit={values => {
              Object.keys(values).forEach(key => {
                if (typeof values[key] === 'string') {
                  values[key] = values[key].trim();
                }
              });
              if (Object.keys(noteTypesDetail)?.length > 0) {
                dispatch(
                  updateNoteTypes({
                    _id: noteTypesDetail?._id,
                    noteTypes: values,
                  }),
                );
              } else {
                dispatch(createNoteTypes(values));
              }
            }}
          >
            {({ handleSubmit, getFieldProps }) => (
              <Form onSubmit={handleSubmit}>
                <div className="card_wrapper">
                  <div className="card_body admin_card_body">
                    <ul>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Type</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  {...getFieldProps('type')}
                                >
                                  <FormControlLabel
                                    value={1}
                                    control={<Radio />}
                                    label="Action"
                                  />
                                  <FormControlLabel
                                    value={2}
                                    control={<Radio />}
                                    label="Correspondence"
                                  />
                                </RadioGroup>
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
                                Note Type Name
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
                                  id="noteName"
                                  type="text"
                                  variant="outlined"
                                  {...getFieldProps('name')}
                                  placeholder="Enter note type name"
                                />
                              </FormControl>
                            </div>
                            <span className="d-block text-danger text_small">
                              <ErrorMessage name="name" />
                            </span>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>
                                Note Type Icon
                                <sup className="text_primary">*</sup>
                              </label>
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
                                    id="noteIcon"
                                    type="text"
                                    variant="outlined"
                                    {...getFieldProps('icon')}
                                    placeholder="Enter note type icon"
                                  />
                                </FormControl>
                                <Link
                                  className="mx-1 text_small text-decoration-underline"
                                  to="https://fontawesome.com/search"
                                  target="_blank"
                                >
                                  List of Icons
                                </Link>
                              </div>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="icon" />
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
                                Note Type Icon Colour{' '}
                                <sup className="text_primary">*</sup>
                              </label>
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
                                    id="noteColor"
                                    type="text"
                                    variant="outlined"
                                    {...getFieldProps('icon_colour')}
                                    placeholder="Enter note type icon colour"
                                  />
                                </FormControl>
                                <Link
                                  className="mx-1 text_small text-decoration-underline"
                                  to="https://www.w3schools.com/colors/colors_picker.asp"
                                  target="_blank"
                                >
                                  List of Icons
                                </Link>
                              </div>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="icon_colour" />
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </li>
                      <li>
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Is a QuickLink</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  {...getFieldProps('is_quicklink')}
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
                        <Row>
                          <Col xs={5}>
                            <div className="card_content_left">
                              <label>Order</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl
                                fullWidth
                                className="main_input_wrap"
                              >
                                <TextField
                                  id="Order"
                                  type="number"
                                  onWheel={e => e.target.blur()}
                                  variant="outlined"
                                  placeholder="50"
                                  {...getFieldProps('order')}
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
                              <label>Active</label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <div className="card_content_right">
                              <FormControl>
                                <RadioGroup
                                  row
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  {...getFieldProps('is_active')}
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
                        <Row>
                          <Col xs={12}>
                            <p className="m-0">
                              You can totally remove this note type from the
                              system if it is no longer required. If you select
                              'Yes' then you will not be able to undo the delete
                              without knowing the exact ID.
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
                                  name="radio-buttons-group"
                                  className="custom_radio"
                                  {...getFieldProps('deleted')}
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
                    </ul>
                    <div className="card_footer admin_card_footer mb-2">
                      <button type="submit" className="btn_primary small">
                        {Object.keys(noteTypesDetail)?.length === 0
                          ? 'Save'
                          : 'Update'}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
