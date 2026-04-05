import { useCallback, useState } from 'react';
import { Form, Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { TextField, FormControl, Select, MenuItem } from '@mui/material';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { updateEventBDE } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { ckEditorUploadImage } from 'store/reducers/UploadImage/uploadImage.slice';

export const EventInfoBPE = ({
  dispatch,
  eventDetail,
  optionsSurvivorBreakfastAt,
}) => {
  const [introDescriptionTextStatus, setIntroDescriptionTextStatus] =
    useState(false);

  const [firstBlockStatus, setFirstBlockStatus] = useState(false);
  const [secondBlockStatus, setSecondBlockStatus] = useState(false);
  const [thirdBlockStatus, setThirdBlockStatus] = useState(false);
  const [entertainmentStatus, setEntertainmentStatus] = useState(false);
  const [priceIncludeStatus, setPriceIncludeStatus] = useState(false);
  const [itineraryTextStatus, setItineraryTextStatus] = useState(false);
  const [menuTextStatus, setMenuTextStatus] = useState(false);
  const [drinkSectionStatus, setdrinkSectionStatus] = useState(false);
  const [datePriceStatus, setDatePriceStatus] = useState(false);
  const [venuePageStatus, setVenuePageStatus] = useState(false);
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
    <div className="event_info_wrap">
      <div className="card_wrapper mb-4">
        <div className="card_header py-2 px-3">
          <h4 className="m-0 py-1 text_white">Event Info for BPE.com</h4>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            text_top_bar: eventDetail?.event_bpe_data?.text_top_bar
              ? eventDetail?.event_bpe_data?.text_top_bar
              : '',
            seo_meta_title: eventDetail?.event_bpe_data?.seo_meta_title
              ? eventDetail?.event_bpe_data?.seo_meta_title
              : '',
            seo_meta_description: eventDetail?.event_bpe_data
              ?.seo_meta_description
              ? eventDetail?.event_bpe_data?.seo_meta_description
              : '',
            custom_2nd_level_background: eventDetail?.event_bpe_data
              ?.custom_2nd_level_background
              ? eventDetail?.event_bpe_data?.custom_2nd_level_background
              : '',
            custom_class_for_section: eventDetail?.event_bpe_data
              ?.custom_class_for_section
              ? eventDetail?.event_bpe_data?.custom_class_for_section
              : '',
            survivor_breakfast_at: eventDetail?.event_bpe_data
              ?.survivor_breakfast_at
              ? eventDetail?.event_bpe_data?.survivor_breakfast_at
              : '',
            intro_description_text: eventDetail?.event_bpe_data
              ?.intro_description_text
              ? eventDetail?.event_bpe_data?.intro_description_text
              : '',
            party_overview_text_1st: eventDetail?.event_bpe_data
              ?.party_overview_text_1st
              ? eventDetail?.event_bpe_data?.party_overview_text_1st
              : '',
            party_overview_text_2nd: eventDetail?.event_bpe_data
              ?.party_overview_text_2nd
              ? eventDetail?.event_bpe_data?.party_overview_text_2nd
              : '',
            party_overview_text_3rd: eventDetail?.event_bpe_data
              ?.party_overview_text_3rd
              ? eventDetail?.event_bpe_data?.party_overview_text_3rd
              : '',
            entertainment_intro_text: eventDetail?.event_bpe_data
              ?.entertainment_intro_text
              ? eventDetail?.event_bpe_data?.entertainment_intro_text
              : '',
            price_includes_text: eventDetail?.event_bpe_data
              ?.price_includes_text
              ? eventDetail?.event_bpe_data?.price_includes_text
              : '',
            itinerary_text: eventDetail?.event_bpe_data?.itinerary_text
              ? eventDetail?.event_bpe_data?.itinerary_text
              : '',
            menu_text: eventDetail?.event_bpe_data?.menu_text
              ? eventDetail?.event_bpe_data?.menu_text
              : '',
            drinks_section_text: eventDetail?.event_bpe_data
              ?.drinks_section_text
              ? eventDetail?.event_bpe_data?.drinks_section_text
              : '',
            dates_prices_text: eventDetail?.event_bpe_data?.dates_prices_text
              ? eventDetail?.event_bpe_data?.dates_prices_text
              : '',
            venue_page_text: eventDetail?.event_bpe_data?.venue_page_text
              ? eventDetail?.event_bpe_data?.venue_page_text
              : '',
          }}
          onSubmit={values => {
            dispatch(
              updateEventBDE({
                _id: eventDetail?._id,
                eventBde: values,
              }),
            );
          }}
        >
          {({ handleSubmit, handleChange, values, getFieldProps }) => (
            <Form onSubmit={handleSubmit}>
              <div className="card_body admin_card_body">
                <h5 className="my-2 ps-2">
                  {eventDetail?.internal_name ?? ''}
                </h5>
                <ul>
                  <li>
                    <Row>
                      <Col xs={3}>
                        <div className="card_content_left">
                          <label>Text in Top Bar</label>
                        </div>
                      </Col>
                      <Col xs={9}>
                        <div className="card_content_right">
                          <FormControl fullWidth>
                            <TextField
                              id="topBar"
                              type="text"
                              variant="outlined"
                              {...getFieldProps('text_top_bar')}
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
                          <label>SEO Meta Title (max 60 characters)</label>
                        </div>
                      </Col>
                      <Col xs={9}>
                        <div className="card_content_right">
                          <FormControl fullWidth>
                            <TextField
                              id="SeoTitle"
                              type="text"
                              variant="outlined"
                              {...getFieldProps('seo_meta_title')}
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
                          <label>
                            SEO Meta Description (max 160 characters)
                          </label>
                        </div>
                      </Col>
                      <Col xs={9}>
                        <div className="card_content_right">
                          <FormControl fullWidth>
                            <TextField
                              id="SeoDesc"
                              type="text"
                              variant="outlined"
                              {...getFieldProps('seo_meta_description')}
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
                          <label>Custom 2nd Level Background</label>
                        </div>
                      </Col>
                      <Col xs={9}>
                        <div className="card_content_right">
                          <FormControl fullWidth>
                            <TextField
                              id="customBg"
                              type="text"
                              variant="outlined"
                              {...getFieldProps('custom_2nd_level_background')}
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
                          <label>Custom Class for section</label>
                        </div>
                      </Col>
                      <Col xs={9}>
                        <div className="card_content_right">
                          <FormControl fullWidth>
                            <TextField
                              id="customSection"
                              type="text"
                              variant="outlined"
                              {...getFieldProps('custom_class_for_section')}
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
                          <label>Survivor's Breakfast at</label>
                        </div>
                      </Col>
                      <Col xs={9}>
                        <div className="card_content_right">
                          <FormControl fullWidth className="main_input_wrap">
                            <Select
                              labelId="Breakfast"
                              id="Breakfast"
                              className="input_wrap select_wrap"
                              {...getFieldProps('survivor_breakfast_at')}
                            >
                              {optionsSurvivorBreakfastAt?.map(element => (
                                <MenuItem
                                  value={element?.value}
                                  key={element?.id}
                                >
                                  {element?.label}
                                </MenuItem>
                              ))}
                            </Select>
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
                            Intro Description Text for Website
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setIntroDescriptionTextStatus(
                                  !introDescriptionTextStatus,
                                )
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {introDescriptionTextStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Intro Description Text for Website"
                                  {...getFieldProps('intro_description_text')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.intro_description_text}
                                onChange={(event, editor) => {
                                  handleChange('intro_description_text')(
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
                            Party Overview Text - First Block
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setFirstBlockStatus(!firstBlockStatus)
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {firstBlockStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter  Party Overview Text - First Block"
                                  {...getFieldProps('party_overview_text_1st')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.party_overview_text_1st}
                                onChange={(event, editor) => {
                                  handleChange('party_overview_text_1st')(
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
                            Party Overview Text - Second Block
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setSecondBlockStatus(!secondBlockStatus)
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {secondBlockStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter  Party Overview Text - Second Block"
                                  {...getFieldProps('party_overview_text_2nd')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.party_overview_text_2nd}
                                onChange={(event, editor) => {
                                  handleChange('party_overview_text_2nd')(
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
                            Party Overview Text - Third Block
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setThirdBlockStatus(!thirdBlockStatus)
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {thirdBlockStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter  Party Overview Text - Third Block"
                                  {...getFieldProps('party_overview_text_3rd')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.party_overview_text_3rd}
                                onChange={(event, editor) => {
                                  handleChange('party_overview_text_3rd')(
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
                            Entertainment Intro Text for Website
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setEntertainmentStatus(!entertainmentStatus)
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {entertainmentStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Entertainment Intro Text for Website"
                                  {...getFieldProps('entertainment_intro_text')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.entertainment_intro_text}
                                onChange={(event, editor) => {
                                  handleChange('entertainment_intro_text')(
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
                            Price Includes Text for Website
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setPriceIncludeStatus(!priceIncludeStatus)
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {priceIncludeStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Price Includes Text for Website"
                                  {...getFieldProps('price_includes_text')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.price_includes_text}
                                onChange={(event, editor) => {
                                  handleChange('price_includes_text')(
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
                            Itinerary Text for Website
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setItineraryTextStatus(!itineraryTextStatus)
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {itineraryTextStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Itinerary Text for Website"
                                  {...getFieldProps('itinerary_text')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.itinerary_text}
                                onChange={(event, editor) => {
                                  handleChange('itinerary_text')(
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
                            Menu Text for Website
                            <span
                              className="d-block fw_400"
                              onClick={() => setMenuTextStatus(!menuTextStatus)}
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {menuTextStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Menu Text for Website"
                                  {...getFieldProps('menu_text')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.menu_text}
                                onChange={(event, editor) => {
                                  handleChange('menu_text')(editor?.getData());
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
                            Drinks Section Text for Website
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setdrinkSectionStatus(!drinkSectionStatus)
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {drinkSectionStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Drinks Section Text for Website"
                                  {...getFieldProps('drinks_section_text')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.drinks_section_text}
                                onChange={(event, editor) => {
                                  handleChange('drinks_section_text')(
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
                            Dates & Prices Text for Website
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setDatePriceStatus(!datePriceStatus)
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {datePriceStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Dates & Prices Text for Website"
                                  {...getFieldProps('dates_prices_text')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.dates_prices_text}
                                onChange={(event, editor) => {
                                  handleChange('dates_prices_text')(
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
                            Venue Page Text for Website
                            <span
                              className="d-block fw_400"
                              onClick={() =>
                                setVenuePageStatus(!venuePageStatus)
                              }
                            >
                              Toggle Editor
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="card_content_right">
                          {venuePageStatus ? (
                            <div className="card_content_right">
                              <FormControl fullWidth className="max_33">
                                <TextField
                                  multiline
                                  rows={3}
                                  placeholder="Enter Venue Page Text for Website"
                                  {...getFieldProps('venue_page_text')}
                                />
                              </FormControl>
                            </div>
                          ) : (
                            <div className="w-100">
                              <CKEditor
                                editor={ClassicEditor}
                                data={values?.venue_page_text}
                                onChange={(event, editor) => {
                                  handleChange('venue_page_text')(
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
                    Save Event Text
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
