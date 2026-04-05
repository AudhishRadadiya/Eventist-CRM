import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ErrorMessage, Form, Formik } from 'formik';
import { createEvent } from 'store/reducers/Admin/Events/Parties/parties.slice';
import * as Yup from 'yup';

export const DuplicateAndCloneEvent = ({
  eventInitialEvent,
  dispatch,
  yearsArray,
  activeVenueList,
  activeThemeList,
  activeTaxCodesList,
  activeSalesRulesList,
}) => {
  const [initialState, setInitialState] = useState(eventInitialEvent);
  useEffect(() => {
    const match = eventInitialEvent?.sku.match(/(\d{4})/);
    // If a year is found, increment it
    if (match && match.length > 1) {
      const year = parseInt(match[1]);
      const updatedYear = year + 1;
      // Replace the old year with the updated one
      setInitialState({
        ...eventInitialEvent,
        sku: eventInitialEvent?.sku.replace(year, updatedYear),
        year: +eventInitialEvent?.year + 1,
        show_online: 0,
        is_active: false,
      });
    } else {
      setInitialState({
        ...eventInitialEvent,
        year: +eventInitialEvent?.year + 1,
        show_online: 0,
        is_active: false,
      });
    }
  }, [eventInitialEvent?.sku]);
  const editPartiesSchema = Yup.object().shape({
    sku: Yup.string()
      .test('SKU already exist', 'Please use different SKU', function (value) {
        return eventInitialEvent?.sku !== value;
      })
      .matches(/^[^\s]/, 'SKU cannot include leading spaces')
      .required('SKU is a required field'),
    internal_name: Yup.string()
      .required('Internal name is a required field')
      .matches(/^[^\s]/, 'Internal name cannot include leading spaces'),
    public_name: Yup.string()
      .required('Public name is a required field')
      .matches(/^[^\s]/, 'Public name cannot include leading spaces'),
    booking_unique_id: Yup.string()
      .matches(/^[^\s]/, 'Booking id cannot include leading spaces')
      .required('Booking unique id is a required field'),
    year: Yup.string().required('Year is a required field'),
    venue_id: Yup.string().required('Venue is a required field'),
    theme_id: Yup.string().required('Theme is a required field'),
    tax_code: Yup.string().required('Tax Code is a required field'),
  });
  return (
    <div className="event_duplicate_wrap">
      <div className="card_wrapper mb-4">
        <div className="card_header py-2 px-3">
          <h4 className="m-0 py-1 text_white">Duplicate/Clone Event</h4>
        </div>
        <div className="card_body admin_card_body">
          <h6 className="fw_500 ps-2 my-2">
            This will clone this event as a new event but will not clone dates
            or products
          </h6>
          <Formik
            enableReinitialize={true}
            initialValues={initialState}
            validationSchema={editPartiesSchema}
            onSubmit={values => {
              const data = {
                ...values,
                total_places: Number(values.total_places),
                overbook_maximum: Number(values.overbook_maximum),
                minimum_places_exclusive: Number(
                  values.minimum_places_exclusive,
                ),
                price_per_head: Number(values.price_per_head),
                deposit_per_head: Number(values.deposit_per_head),
                sales_target: Number(values.sales_target),
              };
              dispatch(createEvent(data));
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
                <div className="bg_gray_box p-2">
                  <Row className="align-items-center">
                    <Col xl={4}>
                      <div className="card_content_left">
                        <label className="mb-xl-0 mb-2">
                          New Content
                          <span className="d-block fw_400">
                            (Enter any new content to be used for the new event
                            - this will override the cloned values)
                          </span>
                        </label>
                      </div>
                    </Col>
                    <Col xl={8}>
                      <ul>
                        <li className="mb-2">
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  New SKU
                                  <sup className="text_primary">*</sup>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl fullWidth className="">
                                  <TextField
                                    {...getFieldProps('sku')}
                                    variant="outlined"
                                  />
                                </FormControl>
                              </div>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="sku" />
                              </span>
                            </Col>
                          </Row>
                        </li>
                        <li className="mb-2">
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>New Cost Centre</label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl fullWidth className="">
                                  <TextField
                                    {...getFieldProps('cost_centre')}
                                    variant="outlined"
                                  />
                                </FormControl>
                              </div>
                            </Col>
                          </Row>
                        </li>
                        <li className="mb-2">
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  New Booking Unique ID
                                  <sup className="text_primary">*</sup>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl fullWidth className="">
                                  <TextField
                                    {...getFieldProps('booking_unique_id')}
                                    variant="outlined"
                                  />
                                </FormControl>
                              </div>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="booking_unique_id" />
                              </span>
                            </Col>
                          </Row>
                        </li>
                        <li className="mb-2">
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  Event Year
                                  <sup className="text_primary">*</sup>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <Select
                                    labelId="year"
                                    id="year"
                                    name="year"
                                    value={values.year}
                                    onChange={handleChange}
                                    displayEmpty
                                    defaultValue="SelectOne"
                                    className="input_wrap select_wrap"
                                  >
                                    <MenuItem value="" disabled>
                                      Select One
                                    </MenuItem>
                                    {yearsArray.map(item => {
                                      return (
                                        <MenuItem key={item} value={item}>
                                          {item}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              </div>
                            </Col>
                          </Row>
                        </li>
                        <li className="mb-2">
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  New Internal Name
                                  <sup className="text_primary">*</sup>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl fullWidth className="">
                                  <TextField
                                    {...getFieldProps('internal_name')}
                                    variant="outlined"
                                  />
                                </FormControl>
                              </div>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="internal_name" />
                              </span>
                            </Col>
                          </Row>
                        </li>
                        <li className="mb-2">
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  New Public Name
                                  <sup className="text_primary">*</sup>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl fullWidth className="">
                                  <TextField
                                    {...getFieldProps('public_name')}
                                    variant="outlined"
                                  />
                                </FormControl>
                              </div>
                              <span className="d-block text-danger text_small">
                                <ErrorMessage name="public_name" />
                              </span>
                            </Col>
                          </Row>
                        </li>
                        <li className="mb-2">
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  Set Venue
                                  <sup className="text_primary">*</sup>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <Select
                                    labelId="venue_id"
                                    id="venue_id"
                                    name="venue_id"
                                    value={values.venue_id}
                                    onChange={handleChange}
                                    className="input_wrap select_wrap"
                                    displayEmpty
                                  >
                                    <MenuItem value="" disabled>
                                      Select
                                    </MenuItem>
                                    {activeVenueList?.map(item => {
                                      return (
                                        <MenuItem key={item} value={item?._id}>
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
                        <li className="mb-2">
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  Set Theme
                                  <sup className="text_primary">*</sup>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <Select
                                    labelId="theme_id"
                                    id="theme_id"
                                    name="theme_id"
                                    value={values.theme_id}
                                    onChange={handleChange}
                                    className="input_wrap select_wrap"
                                    displayEmpty
                                  >
                                    <MenuItem value="" disabled>
                                      Select
                                    </MenuItem>
                                    {activeThemeList?.map(item => {
                                      return (
                                        <MenuItem key={item} value={item?._id}>
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
                        <li className="mb-2">
                          <Row className="align-items-center">
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  Default Options
                                  <span className="d-block fw_400">
                                    (for each new date added)
                                  </span>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <ul>
                                  <li className="mb-2">
                                    <div className="d-flex align-items-center">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <TextField
                                          type="number"
                                          onWheel={e => e.target.blur()}
                                          placeholder="Enter a Number"
                                          inputProps={{
                                            min: 0,
                                            step: 'any',
                                          }}
                                          onBlurCapture={() => {
                                            setFieldValue(
                                              'total_places',
                                              values.total_places &&
                                                Number(values.total_places),
                                            );
                                          }}
                                          {...getFieldProps('total_places')}
                                          variant="outlined"
                                        />
                                      </FormControl>
                                      <span className="mx-1 text_small">
                                        Places
                                      </span>
                                    </div>
                                  </li>
                                  <li className="mb-2">
                                    <div className="d-flex align-items-center">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <TextField
                                          type="number"
                                          onWheel={e => e.target.blur()}
                                          placeholder="Enter a Number"
                                          inputProps={{
                                            min: 0,
                                            step: 'any',
                                          }}
                                          onBlurCapture={() => {
                                            setFieldValue(
                                              'overbook_maximum',
                                              values.overbook_maximum &&
                                                Number(values.overbook_maximum),
                                            );
                                          }}
                                          {...getFieldProps('overbook_maximum')}
                                          variant="outlined"
                                        />
                                      </FormControl>
                                      <span className="mx-1 text_small">
                                        Overbook Maximum
                                      </span>
                                    </div>
                                  </li>
                                  <li className="mb-2">
                                    <div className="d-flex align-items-center">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <TextField
                                          type="number"
                                          onWheel={e => e.target.blur()}
                                          placeholder="Enter a Number"
                                          inputProps={{
                                            min: 0,
                                            step: 'any',
                                          }}
                                          onBlurCapture={() => {
                                            setFieldValue(
                                              'minimum_places_exclusive',
                                              values.minimum_places_exclusive &&
                                                Number(
                                                  values.minimum_places_exclusive,
                                                ),
                                            );
                                          }}
                                          {...getFieldProps(
                                            'minimum_places_exclusive',
                                          )}
                                          variant="outlined"
                                        />
                                      </FormControl>
                                      <span className="mx-1 text_small">
                                        Minimum Places for Exclusive
                                      </span>
                                    </div>
                                  </li>
                                  <li className="mb-2">
                                    <div className="d-flex align-items-center">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <TextField
                                          type="number"
                                          onWheel={e => e.target.blur()}
                                          placeholder="Enter a Number"
                                          inputProps={{
                                            min: 0,
                                            step: 'any',
                                          }}
                                          onBlurCapture={() => {
                                            setFieldValue(
                                              'price_per_head',
                                              values.price_per_head &&
                                                Number(
                                                  values.price_per_head,
                                                ).toFixed(2),
                                            );
                                          }}
                                          {...getFieldProps('price_per_head')}
                                          variant="outlined"
                                        />
                                      </FormControl>
                                      <span className="mx-1 text_small">
                                        Price Per Head (excl. tax)
                                      </span>
                                    </div>
                                  </li>
                                  <li className="mb-2">
                                    <div className="d-flex align-items-center">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <TextField
                                          type="number"
                                          onWheel={e => e.target.blur()}
                                          placeholder="Enter a Number"
                                          inputProps={{
                                            min: 0,
                                            step: 'any',
                                          }}
                                          onBlurCapture={() => {
                                            setFieldValue(
                                              'deposit_per_head',
                                              values.deposit_per_head &&
                                                Number(
                                                  values.deposit_per_head,
                                                ).toFixed(2),
                                            );
                                          }}
                                          {...getFieldProps('deposit_per_head')}
                                          variant="outlined"
                                        />
                                      </FormControl>
                                      <span className="mx-1 text_small">
                                        Deposit Per Head (excl. tax)
                                      </span>
                                    </div>
                                  </li>
                                  <li className="mb-2">
                                    <div className="d-flex align-items-center">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <Select
                                          labelId="taxRate-label"
                                          id="tax_code"
                                          name="tax_code"
                                          value={values.tax_code}
                                          onChange={handleChange}
                                          className="select_wrap"
                                          displayEmpty
                                        >
                                          <MenuItem value="" disabled>
                                            Select Category
                                          </MenuItem>
                                          {activeTaxCodesList?.map(
                                            (item, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={item?._id}
                                                >
                                                  {item?.public_name}
                                                </MenuItem>
                                              );
                                            },
                                          )}
                                        </Select>
                                      </FormControl>
                                      <span className="mx-1 text_small">
                                        Tax Code
                                        <sup className="text_primary">*</sup>
                                      </span>
                                      <span className="d-block text-danger text_small">
                                        <ErrorMessage name="tax_code" />
                                      </span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="d-flex align-items-center">
                                      <FormControl
                                        fullWidth
                                        className="main_input_wrap"
                                      >
                                        <Select
                                          labelId="priceRule-label"
                                          id="price_rule"
                                          name="price_rule"
                                          value={values.price_rule}
                                          onChange={handleChange}
                                          className="select_wrap"
                                          displayEmpty
                                        >
                                          <MenuItem value="">
                                            — Use default —
                                          </MenuItem>
                                          {activeSalesRulesList?.map(
                                            (item, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={item?._id}
                                                >
                                                  {item?.public_name}
                                                </MenuItem>
                                              );
                                            },
                                          )}
                                        </Select>
                                      </FormControl>
                                      <span className="mx-1 text_small">
                                        Price Rule
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </Col>
                          </Row>
                        </li>
                        <li className="mb-2">
                          <Row className="align-items-center">
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>
                                  Sales Target (Places)
                                  <span className="d-block fw_400">
                                    Please enter the total target amount of
                                    places for this event.
                                  </span>
                                </label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl
                                  fullWidth
                                  className="main_input_wrap"
                                >
                                  <TextField
                                    type="number"
                                    onWheel={e => e.target.blur()}
                                    placeholder="Enter a Number"
                                    inputProps={{ min: 0, step: 'any' }}
                                    onBlurCapture={() => {
                                      setFieldValue(
                                        'sales_target',
                                        values.sales_target &&
                                          Number(values.sales_target).toFixed(
                                            2,
                                          ),
                                      );
                                    }}
                                    {...getFieldProps('sales_target')}
                                    variant="outlined"
                                  />
                                </FormControl>
                              </div>
                            </Col>
                          </Row>
                        </li>
                        <li className="mb-2">
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>Show Online</label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <FormControl>
                                  <RadioGroup
                                    row
                                    aria-labelledby="ShowOnline-label"
                                    name="radio-buttons-group"
                                    className="custom_radio"
                                    defaultValue={values.show_online}
                                    value={values.show_online}
                                    onChange={e =>
                                      setFieldValue(
                                        'show_online',
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <FormControlLabel
                                      value={0}
                                      control={<Radio />}
                                      label="Yes"
                                    />
                                    <FormControlLabel
                                      value={1}
                                      control={<Radio />}
                                      label="No"
                                    />
                                    <FormControlLabel
                                      value={2}
                                      control={<Radio />}
                                      label="Show for BPE office only"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </div>
                            </Col>
                          </Row>
                        </li>
                        <li>
                          <Row>
                            <Col xs={3}>
                              <div className="card_content_left">
                                <label>Active</label>
                              </div>
                            </Col>
                            <Col xs={9}>
                              <div className="card_content_right">
                                <span className="text_small d-block">
                                  BE CAREFUL SETTING CLONED EVENTS TO ACTIVE AS
                                  THESE CAN IMMEDIATELY SHOW TO OFFICE AND
                                  POSSIBLY WEBSITE USERS
                                </span>
                                <FormControl>
                                  <RadioGroup
                                    row
                                    aria-labelledby="active-label"
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
                      </ul>
                    </Col>
                  </Row>
                </div>
                <div className="card_footer admin_card_footer mb-2">
                  <button type="submit" className="btn_primary small">
                    Clone Event
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
