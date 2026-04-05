import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { updateEventAutomation } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getSystemData } from 'store/reducers/Admin/System/system.slice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Automation = ({ dispatch, eventDetail }) => {
  const automationData = eventDetail?.automation_data;
  const { systemDetail } = useSelector(({ system }) => system);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSystemData());
  }, [dispatch]);

  return (
    <div className="event_automation_wrap">
      <div className="card_wrapper mb-4">
        <div className="card_header py-2 px-3">
          <h4 className="m-0 py-1 text_white">Automation</h4>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            etickets:
              eventDetail === null
                ? 2
                : automationData
                ? automationData?.etickets
                : '',
            auto_invoicing:
              eventDetail === null
                ? 2
                : automationData
                ? automationData?.auto_invoicing
                : '',
            provisional_hold_chase:
              eventDetail === null
                ? 2
                : automationData
                ? automationData?.provisional_hold_chase
                : '',
            exchequer_report:
              eventDetail === null
                ? 2
                : automationData
                ? automationData?.exchequer_report
                : '',
            after_party_feedback:
              eventDetail === null
                ? 2
                : automationData
                ? automationData?.after_party_feedback
                : '',
            drinks_balance_reminders:
              eventDetail === null
                ? 2
                : automationData
                ? automationData?.drinks_balance_reminders
                : '',
            nightly_reports_business_done:
              eventDetail === null
                ? 2
                : automationData
                ? automationData?.nightly_reports_business_done
                : '',
          }}
          onSubmit={values => {
            if (eventDetail) {
              dispatch(
                updateEventAutomation({
                  _id: eventDetail ? eventDetail?._id : null,
                  eventAutomation: values,
                }),
              );
            } else {
              navigate('/admin/events/parties');
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
                <h5 className="text_primary my-2 ps-2">
                  {eventDetail?.internal_name ?? ''}
                </h5>
                <div className="bg_gray_box p-2">
                  <Row className="align-items-center">
                    <Col xl={4}>
                      <div className="card_content_left">
                        <label className="mb-xl-0 mb-2">
                          Event automation overrides
                          <span className="d-block fw_400">
                            (Turn automatic CRMBO tasks on and off)
                          </span>
                        </label>
                      </div>
                    </Col>
                    <Col xl={8}>
                      <Row>
                        <Col xs={6}>
                          <label className="d-block text_small">eTickets</label>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="eTickets-label"
                              name="radio-buttons-group"
                              className="custom_radio mb-3"
                              defaultValue={values?.etickets}
                              value={values.etickets}
                              onChange={e => {
                                setFieldValue('etickets', e.target.value);
                              }}
                            >
                              <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label={`SYSTEM DEFAULT (${
                                  eventDetail === null ||
                                  systemDetail?.automatic_etickets
                                    ? 'On'
                                    : 'Off'
                                })`}
                              />
                              <FormControlLabel
                                value={1}
                                control={<Radio />}
                                label="ON"
                              />
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="OFF"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Col>
                        <Col xs={6}>
                          <label className="d-block text_small">
                            Exchequer Report
                          </label>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="report-label"
                              name="radio-buttons-group"
                              className="custom_radio mb-3"
                              defaultValue={values?.exchequer_report}
                              value={values.exchequer_report}
                              onChange={e => {
                                setFieldValue(
                                  'exchequer_report',
                                  e.target.value,
                                );
                              }}
                            >
                              <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label={`SYSTEM DEFAULT (${
                                  eventDetail === null ||
                                  systemDetail?.automatic_exchequer
                                    ? 'On'
                                    : 'Off'
                                })`}
                              />
                              <FormControlLabel
                                value={1}
                                control={<Radio />}
                                label="ON"
                              />
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="OFF"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Col>
                        <Col xs={6}>
                          <label className="d-block text_small">
                            Auto Invoicing
                          </label>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="invoicing-label"
                              name="radio-buttons-group"
                              className="custom_radio mb-3"
                              defaultValue={values?.auto_invoicing}
                              value={values.auto_invoicing}
                              onChange={e => {
                                setFieldValue('auto_invoicing', e.target.value);
                              }}
                            >
                              <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label={`SYSTEM DEFAULT (${
                                  eventDetail === null ||
                                  systemDetail?.automatic_invoice
                                    ? 'On'
                                    : 'Off'
                                })`}
                              />
                              <FormControlLabel
                                value={1}
                                control={<Radio />}
                                label="ON"
                              />
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="OFF"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Col>
                        <Col xs={6}>
                          <label className="d-block text_small">
                            After Party Feedback
                          </label>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="feedback-label"
                              name="radio-buttons-group"
                              className="custom_radio mb-3"
                              defaultValue={values?.after_party_feedback}
                              value={values.after_party_feedback}
                              onChange={e => {
                                setFieldValue(
                                  'after_party_feedback',
                                  e.target.value,
                                );
                              }}
                            >
                              <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label={`SYSTEM DEFAULT (${
                                  eventDetail === null ||
                                  systemDetail?.automatic_afterparty
                                    ? 'On'
                                    : 'Off'
                                })`}
                              />
                              <FormControlLabel
                                value={1}
                                control={<Radio />}
                                label="ON"
                              />
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="OFF"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Col>
                        <Col xs={6}>
                          <label className="d-block text_small">
                            Provisional Hold Chase
                          </label>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="provisional-label"
                              name="radio-buttons-group"
                              className="custom_radio mb-3"
                              defaultValue={values?.provisional_hold_chase}
                              value={values?.provisional_hold_chase}
                              onChange={e => {
                                setFieldValue(
                                  'provisional_hold_chase',
                                  e.target.value,
                                );
                              }}
                            >
                              <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label={`SYSTEM DEFAULT (${
                                  eventDetail === null ||
                                  systemDetail?.automatic_provisional_hold
                                    ? 'On'
                                    : 'Off'
                                })`}
                              />
                              <FormControlLabel
                                value={1}
                                control={<Radio />}
                                label="ON"
                              />
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="OFF"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Col>
                        <Col xs={6}>
                          <label className="d-block text_small">
                            Drinks/Balance Reminders
                          </label>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="balance-label"
                              name="radio-buttons-group"
                              className="custom_radio mb-3"
                              defaultValue={values?.drinks_balance_reminders}
                              value={values.drinks_balance_reminders}
                              onChange={e => {
                                setFieldValue(
                                  'drinks_balance_reminders',
                                  e.target.value,
                                );
                              }}
                            >
                              <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label={`SYSTEM DEFAULT (${
                                  eventDetail === null ||
                                  systemDetail?.automatic_drinks_reminders
                                    ? 'On'
                                    : 'Off'
                                })`}
                              />
                              <FormControlLabel
                                value={1}
                                control={<Radio />}
                                label="ON"
                              />
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="OFF"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Col>
                        <Col xs={6}>
                          <label className="d-block text_small">
                            Nightly Reports (Business Done etc):
                          </label>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="balance-label"
                              name="radio-buttons-group"
                              className="custom_radio mb-3"
                              defaultValue={
                                values?.nightly_reports_business_done
                              }
                              value={values.nightly_reports_business_done}
                              onChange={e => {
                                setFieldValue(
                                  'nightly_reports_business_done',
                                  e.target.value,
                                );
                              }}
                            >
                              <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label={`SYSTEM DEFAULT (${
                                  eventDetail === null ||
                                  systemDetail?.automatic_reports
                                    ? 'On'
                                    : 'Off'
                                })`}
                              />
                              <FormControlLabel
                                value={1}
                                control={<Radio />}
                                label="ON"
                              />
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="OFF"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <div className="card_footer admin_card_footer mb-2">
                  <button type="submit" className="btn_primary small">
                    Save Automation Overrides
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
