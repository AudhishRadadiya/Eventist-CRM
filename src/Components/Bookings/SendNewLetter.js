import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeBreadcrumbs from '../../Assets/Img/home-breadcrumbs.svg';
import RefreshIcon from '../../Assets/Img/refresh.svg';
import { Button, Col, Row } from 'react-bootstrap';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Form, Formik } from 'formik';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { ckEditorUploadImage } from 'store/reducers/UploadImage/uploadImage.slice';
import { createLetter } from 'store/reducers/letter/letter.slice';
import jsPDF from 'jspdf';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { getLettersListData } from 'store/reducers/Admin/Mail/letters.slice';
import html2pdf from 'html2pdf.js';
import { dynamicMailTemplate } from 'store/reducers/mail/mail.slice';
import Loader from 'Components/Common/Loader';

export default function SendNewLetter() {
  const dispatch = useDispatch();
  const editorRef = useRef();
  const renderRef = useRef();
  const navigate = useNavigate();

  const { activeLetterList } = useSelector(({ letter }) => letter);
  const { dynamicContent, mailListLoading } = useSelector(({ mail }) => mail);
  const [selectedItem, setSelectedItem] = useState('');
  const [downloadLetter, setDownloadLetter] = useState(false);

  const { id } = useParams();
  const { search } = useLocation();
  const [searchParams] = useSearchParams();
  let reportParamData = Object.fromEntries([...searchParams]);

  const letterInitialValues = {
    paper_tamplate: 0,
    letter_content_id: '',
    email_body: '',
    ref_type: 1,
    ref_id: id,
  };
  const [initialLetter, setInitialLetter] = useState(letterInitialValues);

  useEffect(() => {
    if (Object.keys(activeLetterList)?.length > 0) {
      setInitialLetter({
        ...initialLetter,
        letter_content_id: activeLetterList[0]?._id,
        email_body: activeLetterList[0]?.contents || '',
      });
      setSelectedItem({ contents: activeLetterList[0]?.contents });
      fetchLetterContent(reportParamData?.contactid, activeLetterList[0]?._id);
    }
  }, [activeLetterList]);

  useEffect(() => {
    dispatch(getLettersListData());
  }, [dispatch]);

  const OpenDelete = () => {
    setDownloadLetter(true);
  };
  const CloseDelete = () => {
    setDownloadLetter(false);
  };

  const fetchLetterContent = (contactId, templateId) => {
    dispatch(
      dynamicMailTemplate({
        contact_id: contactId,
        template_id: templateId,
        is_letter: true,
      }),
    );
  };

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

  const pdfDownloadHandler = async () => {
    const editorData = editorRef.current.editor.getData();
    const pdfContent = `
        <html>
          <body>
            ${editorData}
          </body>
        </html>
      `;

    const pdf = html2pdf()
      .set({
        margin: 0.5,
        filename: selectedItem?.name
          ? selectedItem?.name
          : activeLetterList[0]?.name,
        image: { type: 'jpeg', quality: 0.98, width: '10px' },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
      })
      .from(pdfContent)
      .outputPdf();

    const blob = await pdf.output('blob');
    const url = URL.createObjectURL(blob);

    const newTab = window.open();
    newTab.document.title = 'Letter PDF';
    newTab.location.href = url;

    CloseDelete();
  };
  return (
    <div className="inner_wrapper">
      {mailListLoading && <Loader />}
      <div className="breadcrumb_wrap">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">
            <img src={HomeBreadcrumbs} alt="Home Icon" />
          </Link>
          <Link
            to={
              reportParamData?.contact === 'true'
                ? `/contact`
                : reportParamData?.booking === 'true'
                ? `/bookings`
                : `/enquiries`
            }
          >
            {reportParamData?.contact === 'true'
              ? `Contact`
              : reportParamData?.enquiries === 'true'
              ? `Enquiries`
              : `Booking`}
          </Link>
          <Link
            to={
              reportParamData?.contact === 'true'
                ? `/contact/edit-contact/${id}`
                : reportParamData?.enquiries === 'true'
                ? `/edit-enquiries/${id}`
                : `/edit-bookings/${id}`
            }
          >
            Edit
            {reportParamData?.contact === 'true'
              ? ` Contact`
              : reportParamData?.enquiries === 'true'
              ? ` Enquiries`
              : ` Booking`}
          </Link>
          <Typography>Send New Letter</Typography>
        </Breadcrumbs>
      </div>
      <div className="page_title">
        <Row className="align-items-center">
          <Col xs={3}>
            <h1>
              Edit
              {reportParamData?.contact == 'true'
                ? ` Contact`
                : reportParamData?.enquiries === 'true'
                ? ` Enquiries`
                : ` Booking`}
            </h1>
          </Col>
          <Col xs={9}>
            <div className="text-end">
              <Link
                // to={
                //   search === '?contact=true'
                //     ? `/contact/edit-contact/${id}`
                //     : search === '?booking=true'
                //     ? `/edit-bookings/${id}`
                //     : `/edit-enquiries/${id}`
                // }
                onClick={() => navigate(-1)}
                className="btn_border small"
              >
                Back to
                {reportParamData?.contact == 'true'
                  ? ` Contact`
                  : reportParamData?.enquiries === 'true'
                  ? ` Enquiries`
                  : ` Booking`}
              </Link>
            </div>
          </Col>
        </Row>
      </div>
      <div className="send_new_main_wrap bg_white_box p-3 mb-3">
        <Row>
          <Col xxl={8}>
            <h2>Send New Letter</h2>
            <Formik
              enableReinitialize={true}
              initialValues={initialLetter}
              onSubmit={values => {
                let data = {
                  ...values,
                  paper_tamplate: Number(values.paper_tamplate),
                };
                dispatch(createLetter(data));
              }}
            >
              {({ handleSubmit, values, setFieldValue, handleChange }) => (
                <Form onSubmit={handleSubmit}>
                  <ul>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={2}>
                          <lable className="text_small fw_500">
                            Paper Template:
                          </lable>
                        </Col>
                        <Col>
                          <Row className="align-items-center">
                            <Col xs={6}>
                              <FormControl fullWidth className="input_wrap">
                                <Select
                                  labelId="PaperTemplate-label"
                                  id="PaperTemplate-select"
                                  className="select_wrap"
                                  name="paper_tamplate"
                                  // value={values.paper_tamplates}
                                  onChange={handleChange}
                                  defaultValue="0"
                                >
                                  <MenuItem value="0">
                                    Brochure 2019 A4
                                  </MenuItem>
                                  <MenuItem value="1">Headed A4</MenuItem>
                                  <MenuItem value="2">
                                    Blank A4 Portrait
                                  </MenuItem>
                                  <MenuItem value="3">
                                    Blank A4 Landscape
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-center">
                        <Col xs={2}>
                          <lable className="text_small fw_500">
                            Letter Contents:
                          </lable>
                        </Col>
                        <Col>
                          <Row className="align-items-center">
                            <Col xs={6}>
                              <FormControl fullWidth className="input_wrap">
                                <Select
                                  labelId="Method-label"
                                  id="Method-select"
                                  name="letter_content_id"
                                  value={values.letter_content_id}
                                  // value={selectedLetterId}
                                  onChange={e => {
                                    const selectedItem = activeLetterList.find(
                                      item => item._id === e.target.value,
                                    );
                                    setSelectedItem(selectedItem);
                                    // setSelectedLetterId(e.target.value);
                                    setFieldValue(
                                      'letter_content_id',
                                      e.target.value,
                                    );
                                  }}
                                  className="select_wrap"
                                >
                                  <MenuItem value="select" disabled>
                                    Select
                                  </MenuItem>
                                  {activeLetterList?.map(item => {
                                    return (
                                      <MenuItem value={item._id} key={item._id}>
                                        {item?.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </Col>
                            <Col xs={6}>
                              <Button
                                className="btn_refresh"
                                onClick={e => {
                                  fetchLetterContent(
                                    reportParamData?.contactid,
                                    values.letter_content_id,
                                  );
                                }}
                              >
                                <img src={RefreshIcon} alt="Refresh button" />
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </li>
                    <li className="bg_gray_box px-3 py-2 mb-2">
                      <Row className="align-items-start">
                        <Col xs={2}>
                          <lable className="text_small fw_500">
                            Email Body:
                          </lable>
                        </Col>

                        <Col>
                          <Col>
                            <div className="testId" ref={renderRef}>
                              <CKEditor
                                editor={ClassicEditor}
                                data={
                                  dynamicContent?.email_contents
                                    ?.filledTemplate || values?.email_body
                                }
                                name="email_body"
                                ref={editorRef}
                                onChange={(event, editor) => {
                                  handleChange('email_body')(editor?.getData());
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
                        </Col>
                      </Row>
                    </li>
                  </ul>
                  <Button
                    className="btn_border small"
                    type="submit"
                    onClick={OpenDelete}
                  >
                    Create Letter
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
      <Dialog
        aria-labelledby="CancelBooking-title"
        open={downloadLetter}
        className="delete_popup"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {CloseDelete ? (
            <IconButton
              aria-label="close"
              onClick={CloseDelete}
              sx={{
                position: 'absolute',
                right: 19,
                top: 19,
                color: color => color.palette.grey[600],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="delete_popup_wrap download_popup_wrap">
              <DownloadIcon />
              <h2 className="mb-3">Download Letter</h2>
              <p>
                Your letter was successfully created - you can download it here:{' '}
                <Link
                  to=""
                  className="text_primary"
                  onClick={pdfDownloadHandler}
                >
                  {selectedItem?.name
                    ? selectedItem?.name
                    : activeLetterList[0]?.name}
                  .pdf
                </Link>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
