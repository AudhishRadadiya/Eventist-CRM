import { useCallback, useState } from 'react';
import { Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { FormControl, TextField } from '@mui/material';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { updateETicketInfo } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { ckEditorUploadImage } from 'store/reducers/UploadImage/uploadImage.slice';

export const ETicketInfo = ({ dispatch, eventDetail }) => {
  const [eTicItineraryStatus, setETicItineraryStatus] = useState(false);
  const [eTicAlternativeItineraryStatus, setETicAlternativeItineraryStatus] =
    useState(false);
  const [eTicTimesStatus, setETicTimesStatus] = useState(false);
  const [eTicAlternativeTimesStatus, setETicketAlternativeTimesStatus] =
    useState(false);
  const [eTicketUsefullInformation, setETicketUsefullInformation] =
    useState(false);
  const [partyOverviewTextStatus, setPartyOverviewTextStatus] = useState(false);
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
    <div className="event_eticket_wrap">
      <div className="card_wrapper mb-4">
        <div className="card_header py-2 px-3">
          <h4 className="m-0 py-1 text_white">eTicket Information</h4>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            eticket_itinerary: eventDetail?.event_e_ticket_data
              ?.eticket_itinerary
              ? eventDetail?.event_e_ticket_data?.eticket_itinerary
              : '',
            eticket_alternative_itinerary: eventDetail?.event_e_ticket_data
              ?.eticket_alternative_itinerary
              ? eventDetail?.event_e_ticket_data?.eticket_alternative_itinerary
              : '',
            rules_alternative_itinerary: eventDetail?.event_e_ticket_data
              ?.rules_alternative_itinerary
              ? eventDetail?.event_e_ticket_data?.rules_alternative_itinerary
              : '',
            eticket_times: eventDetail?.event_e_ticket_data?.eticket_times
              ? eventDetail?.event_e_ticket_data?.eticket_times
              : '',
            eticket_alternative_times: eventDetail?.event_e_ticket_data
              ?.eticket_alternative_times
              ? eventDetail?.event_e_ticket_data?.eticket_alternative_times
              : '',
            rules_alternative_times: eventDetail?.event_e_ticket_data
              ?.rules_alternative_times
              ? eventDetail?.event_e_ticket_data?.rules_alternative_times
              : '',
            eticket_useful_info: eventDetail?.event_e_ticket_data
              ?.eticket_useful_info
              ? eventDetail?.event_e_ticket_data?.eticket_useful_info
              : '',
            eticket_satnav_postcode: eventDetail?.event_e_ticket_data
              ?.eticket_satnav_postcode
              ? eventDetail?.event_e_ticket_data?.eticket_satnav_postcode
              : '',
            eticket_map_image_url: eventDetail?.event_e_ticket_data
              ?.eticket_map_image_url
              ? eventDetail?.event_e_ticket_data?.eticket_map_image_url
              : '',
            eticket_map_info: eventDetail?.event_e_ticket_data?.eticket_map_info
              ? eventDetail?.event_e_ticket_data?.eticket_map_info
              : '',
          }}
          onSubmit={values => {
            dispatch(
              updateETicketInfo({
                _id: eventDetail?._id,
                eTicketInfo: values,
              }),
            );
          }}
        >
          {({ handleSubmit, handleChange, values, getFieldProps }) => (
            <Form onSubmit={handleSubmit}>
              <div className="card_body admin_card_body">
                <h5 className="text_primary my-2 ps-2">
                  {eventDetail?.internal_name ?? ''}
                </h5>
                <ul>
                  <li>
                    <Row>
                      <Col xs={12}>
                        <div className="card_content_left">
                          <label>
                            eTicket Itinerary
                            <span
                              className="d-block fw_400"
                              onClick={() => {
                                setETicItineraryStatus(!eTicItineraryStatus);
                              }}
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {eTicItineraryStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter ETicket Itinerary"
                                  {...getFieldProps('eticket_itinerary')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.eticket_itinerary}
                                onChange={(event, editor) => {
                                  handleChange('eticket_itinerary')(
                                    editor?.getData(),
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
                          )}
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={12}>
                        <div className="card_content_left">
                          <label>
                            eTicket Alternative Itinerary
                            <span
                              className="d-block fw_400"
                              onClick={() => {
                                setETicAlternativeItineraryStatus(
                                  !eTicAlternativeItineraryStatus,
                                );
                              }}
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {eTicAlternativeItineraryStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter  eTicket Alternative Itinerary"
                                  {...getFieldProps(
                                    'eticket_alternative_itinerary',
                                  )}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.eticket_alternative_itinerary}
                                onChange={(event, editor) => {
                                  handleChange('eticket_alternative_itinerary')(
                                    editor?.getData(),
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
                          )}
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={12}>
                        <div className="card_content_left">
                          <label>
                            Rules for Alternative Itinerary
                            <span className="d-block fw_400">
                              Please enter day names, date values in the format
                              month-number_day-number (e.g. 12_03 for the 3rd
                              December) or booking ID - please separate each
                              with a comma.
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          <FormControl fullWidth>
                            <TextField
                              id="description"
                              multiline
                              rows={2}
                              type="text"
                              variant="outlined"
                              {...getFieldProps('rules_alternative_itinerary')}
                            />
                          </FormControl>
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={12}>
                        <div className="card_content_left">
                          <label>
                            eTicket Times
                            <span
                              className="d-block fw_400"
                              onClick={() => {
                                setETicTimesStatus(!eTicTimesStatus);
                              }}
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {eTicTimesStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter eTicket Times"
                                  {...getFieldProps('eticket_times')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.eticket_times}
                                onChange={(event, editor) => {
                                  handleChange('eticket_times')(
                                    editor?.getData(),
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
                          )}
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={12}>
                        <div className="card_content_left">
                          <label>
                            eTicket Alternative Times
                            <span
                              className="d-block fw_400"
                              onClick={() => {
                                setETicketAlternativeTimesStatus(
                                  !eTicAlternativeTimesStatus,
                                );
                              }}
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {eTicAlternativeTimesStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter eTicket Alternative Times"
                                  {...getFieldProps(
                                    'eticket_alternative_times',
                                  )}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.eticket_alternative_times}
                                onChange={(event, editor) => {
                                  handleChange('eticket_alternative_times')(
                                    editor?.getData(),
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
                          )}
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={12}>
                        <div className="card_content_left">
                          <label>
                            Rules for Alternative Times
                            <span className="d-block fw_400">
                              Please enter day names, date values in the format
                              month-number_day-number (e.g. 12_03 for the 3rd
                              December) or booking ID - please separate each
                              with a comma.
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          <FormControl fullWidth>
                            <TextField
                              id="description"
                              multiline
                              rows={2}
                              type="text"
                              variant="outlined"
                              {...getFieldProps('rules_alternative_times')}
                            />
                          </FormControl>
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={12}>
                        <div className="card_content_left">
                          <label>
                            eTicket Useful Information
                            <span
                              className="d-block fw_400"
                              onClick={() => {
                                setETicketUsefullInformation(
                                  !eTicketUsefullInformation,
                                );
                              }}
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {eTicketUsefullInformation ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter eTicket Alternative Times"
                                  {...getFieldProps('eticket_useful_info')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.eticket_useful_info}
                                onChange={(event, editor) => {
                                  handleChange('eticket_useful_info')(
                                    editor?.getData(),
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
                          )}
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={3}>
                        <div className="card_content_left">
                          <label>eTicket Satnav Postcode</label>
                        </div>
                      </Col>
                      <Col xs={9}>
                        <div className="card_content_right">
                          <FormControl fullWidth>
                            <TextField
                              id="postcode"
                              type="text"
                              variant="outlined"
                              {...getFieldProps('eticket_satnav_postcode')}
                            />
                          </FormControl>
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={3}>
                        <div className="card_content_left">
                          <label>eTicket Map Image URL</label>
                        </div>
                      </Col>
                      <Col xs={9}>
                        <div className="card_content_right">
                          <FormControl fullWidth>
                            <TextField
                              id="ticketMap"
                              type="url"
                              variant="outlined"
                              {...getFieldProps('eticket_map_image_url')}
                            />
                          </FormControl>
                        </div>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col xs={12}>
                        <div className="card_content_left">
                          <label>
                            Party Overview Text - Third Block
                            <span
                              className="d-block fw_400"
                              onClick={() => {
                                setPartyOverviewTextStatus(
                                  !partyOverviewTextStatus,
                                );
                              }}
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {partyOverviewTextStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter  Party Overview Text - Third Block"
                                  {...getFieldProps('eticket_map_info')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.eticket_map_info}
                                onChange={(event, editor) => {
                                  handleChange('eticket_map_info')(
                                    editor?.getData(),
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
                          )}
                        </div>
                      </Col>
                    </Row>
                  </li>
                </ul>
                <div className="card_footer admin_card_footer mb-2">
                  <button type="submit" className="btn_primary small">
                    Save eTicket Info
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
