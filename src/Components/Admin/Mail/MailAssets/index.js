import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';
import EditIcon from '../../../../Assets/Img/edit.svg';
import CheckIcon from '../../../../Assets/Img/check-green.svg';
import CrossIcon from '../../../../Assets/Img/cross-red.svg';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import { Col, Row } from 'react-bootstrap';
import { Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import PdfIcon from '../../../../Assets/Img/pdf-icon.svg';
import Close from '../../../../Assets/Img/not-connected.svg';
import {
  getMailAssetsListData,
  updateMailAsset,
  setIsMailAssetsUpdated,
  deleteMailAlternativeAsset,
  setIsMailAlternativeAssetsDeleted,
} from 'store/reducers/Admin/Mail/mailAssets.slice';
import { useDispatch, useSelector } from 'react-redux';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import Loader from 'Components/Common/Loader';
import useSortable from 'utils/useSortable';
import { getTotalPages, getPaginationData, suspendHandler } from 'utils/common';
import DataNotFound from 'Components/Common/DataNotFound';
import {
  deleteAttachment,
  getAllAttachments,
} from 'store/reducers/mail/mail.slice';
import useSortableAll from 'utils/useSortableAll';

let pageSize = 10;

export default function MailAssets() {
  const dispatch = useDispatch();
  const {
    activeMailAssetList,
    inActiveMailAssetList,
    MailAssetLoading,
    isMailAssetsUpdated,
    isMailAlternativeAssetsDeleted,
  } = useSelector(({ mailAssets }) => mailAssets);

  const { mailListLoading, getAllAttachmentsData, isDeletedAssets } =
    useSelector(({ mail }) => mail);

  const { userPermissionDetail } = useSelector(({ user }) => user);

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [currentPage, setCurrentPage] = useState({
    activeCurrentPage: 1,
    inActiveCurrentPage: 1,
  });

  const activeIndexOfLastItem = currentPage.activeCurrentPage * pageSize;
  const activeIndexOfFirstItem = activeIndexOfLastItem - pageSize;

  const inActiveIndexOfLastItem = currentPage.inActiveCurrentPage * pageSize;
  const inActiveIndexOfFirstItem = inActiveIndexOfLastItem - pageSize;

  const [assetFile, setAssetFile] = useState(false);

  useEffect(() => {
    dispatch(getMailAssetsListData());
  }, [dispatch]);

  useEffect(() => {
    if (isMailAssetsUpdated) {
      dispatch(getMailAssetsListData());
      dispatch(setIsMailAssetsUpdated(false));
    }
  }, [dispatch, isMailAssetsUpdated]);

  const OpenDelete = value => {
    setDeleteId(value);
    setDeletePopup(true);
  };

  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteMailAsset = () => {
    assetFile
      ? dispatch(deleteAttachment({ attachment_path: deleteId }))
      : dispatch(
          updateMailAsset({
            _id: deleteId._id,
            mail: {
              ...deleteId,
              deleted: !deleteId.deleted,
            },
          }),
        );
  };

  const assetFileHandleClick = event => {
    setAssetFile(true);
  };

  const setCurrentMailAssetHandler = key => {
    setCurrentPage({
      ...currentPage,
      [key]: currentPage[key] - 1,
    });
  };

  const totalActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(activeMailAssetList, pageSize);
    return totalActiveRecordCount;
  }, [activeMailAssetList]);
  const totalInActiveRecordPage = useMemo(() => {
    const totalActiveRecordCount = getTotalPages(
      inActiveMailAssetList,
      pageSize,
    );
    return totalActiveRecordCount;
  }, [inActiveMailAssetList]);

  const { itemsActive, requestSortActive } =
    useSortableAll(activeMailAssetList);
  const { itemsInActive, requestSortInActive } = useSortableAll(
    inActiveMailAssetList,
  );

  const activeCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsActive,
      currentPage.activeCurrentPage,
      pageSize,
      totalActiveRecordPage,
      setCurrentMailAssetHandler,
      'activeCurrentPage',
    );
    return currentDataList;
  }, [itemsActive, currentPage.activeCurrentPage]);

  const inActiveCurrentData = useMemo(() => {
    let currentDataList = getPaginationData(
      itemsInActive,
      currentPage.inActiveCurrentPage,
      pageSize,
      totalInActiveRecordPage,
      setCurrentMailAssetHandler,
      'inActiveCurrentPage',
    );
    return currentDataList;
  }, [itemsInActive, currentPage.inActiveCurrentPage]);

  useEffect(() => {
    if (assetFile) {
      dispatch(getAllAttachments({ is_deleted: true }));
    }
  }, [assetFile, dispatch]);

  useEffect(() => {
    if (isDeletedAssets) {
      dispatch(getAllAttachments({ is_deleted: true }));
    }
  }, [dispatch, isDeletedAssets]);

  useEffect(() => {
    if (isMailAlternativeAssetsDeleted) {
      getAllAttachments({ is_deleted: true });
      dispatch(setIsMailAlternativeAssetsDeleted(false));
    }
  }, [dispatch, isMailAlternativeAssetsDeleted]);

  return (
    <div className="inner_wrapper">
      {MailAssetLoading && <Loader />}
      {mailListLoading && <Loader />}
      <div className="mailasset_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/transactional-emails">Mail</Link>
            <Typography>Mail Assets</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Event Asset</h1>
        </div>
        <div className="mailasset_wrap">
          <Link
            to="/mail-assets/add-edit-mail-assets"
            className="btn_primary small mb-3"
          >
            Add New Mail Asset
          </Link>
          <h4>Current Mail Assets</h4>
          <h5 className="text_primary">Active :</h5>
          <div className="table_main_Wrapper mailasset_active_tablep mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortActive('years')}>
                        Year
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('sku')}>SKU</span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('email_tag')}>
                        Email Tag
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('availability')}>
                        Availability
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('type')}>
                        Type
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortActive('default_content')}
                      >
                        Default Content
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortActive('hide_online')}>
                        Hide Online
                      </span>
                    </TableCell>
                    <TableCell>Event Alts</TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCurrentData?.map(mail => {
                    return (
                      <TableRow key={mail?._id}>
                        <TableCell>
                          {mail?.years ? mail?.years : 'Any'}
                        </TableCell>
                        <TableCell>{mail?.sku}</TableCell>
                        <TableCell>{mail?.name}</TableCell>
                        <TableCell> {`[[${mail.email_tag}]]`}</TableCell>
                        <TableCell>
                          {mail?.newAvailability
                            ? mail?.newAvailability
                            : 'Anywhere'}
                        </TableCell>
                        <TableCell>
                          {mail?.type === 1
                            ? 'Text Block'
                            : mail?.type === 0
                            ? 'File Attachment'
                            : ''}
                        </TableCell>
                        <TableCell>{mail?.default_content}</TableCell>
                        <TableCell>
                          {mail?.hide_online === false ? 'No' : 'Yes'}
                        </TableCell>
                        <TableCell>
                          <span className="text_light d-flex align-items-center">
                            {mail?.event_alts?.length > 0 ? (
                              (<img
                                src={CheckIcon}
                                alt="cross Icon"
                                className="me-2"
                              />)(mail?.event_alts?.length)
                            ) : (
                              <img
                                src={CrossIcon}
                                alt="cross Icon"
                                className="me-2"
                              />
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/mail-assets/add-edit-mail-assets/${mail?._id}`}
                                className="btn_edit"
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </Link>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_warning"
                                onClick={() =>
                                  suspendHandler(
                                    mail,
                                    dispatch,
                                    updateMailAsset,
                                    'mail',
                                  )
                                }
                              >
                                Suspend
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_border small"
                                onClick={() => {
                                  OpenDelete(mail);
                                }}
                              >
                                Delete
                              </button>
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
              {activeCurrentData?.length > 0 ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {activeIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          activeIndexOfLastItem,
                          activeMailAssetList?.length,
                        )}{' '}
                        of {activeMailAssetList?.length} entries
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
          <h5 className="text_primary">Inactive :</h5>
          <div className="table_main_Wrapper mailasset_inactive_table mb-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span onClick={() => requestSortInActive('years')}>
                        Year
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('sku')}>
                        SKU
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('name')}>
                        Name
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('email_tag')}>
                        Email Tag
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('availability')}>
                        Availability
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('type')}>
                        Type
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => requestSortInActive('default_content')}
                      >
                        Default Content
                      </span>
                    </TableCell>
                    <TableCell>
                      <span onClick={() => requestSortInActive('hide_online')}>
                        Hide Online
                      </span>
                    </TableCell>
                    <TableCell>Event Alts</TableCell>
                    <TableCell sx={{ width: '10%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inActiveCurrentData?.map(mail => {
                    return (
                      <TableRow key={mail?._id}>
                        <TableCell>
                          {mail?.years ? mail?.years : 'Any'}
                        </TableCell>
                        <TableCell>{mail?.sku}</TableCell>
                        <TableCell>{mail?.name}</TableCell>
                        <TableCell>
                          {mail.email_tag ? `[[${mail.email_tag}]]` : ''}
                        </TableCell>
                        <TableCell>
                          {mail?.newAvailability
                            ? mail?.newAvailability
                            : 'Anywhere'}
                        </TableCell>
                        <TableCell>
                          {mail?.type === 1
                            ? 'Text Block'
                            : mail?.type === 0
                            ? 'File Attachment'
                            : ''}
                        </TableCell>
                        <TableCell>{mail?.default_content}</TableCell>
                        <TableCell>
                          {mail?.hide_online === false ? 'No' : 'Yes'}
                        </TableCell>
                        <TableCell>
                          <span className="text_light d-flex align-items-center">
                            <img
                              src={CheckIcon}
                              alt="check Icon"
                              className="me-2"
                            />
                            (1)
                          </span>
                        </TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/mail-assets/add-edit-mail-assets/${mail?._id}`}
                                className="btn_edit"
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </Link>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_info"
                                onClick={() =>
                                  suspendHandler(
                                    mail,
                                    dispatch,
                                    updateMailAsset,
                                    'mail',
                                  )
                                }
                              >
                                Activate
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="btn_border small"
                                onClick={() => {
                                  OpenDelete(mail);
                                }}
                              >
                                Delete
                              </button>
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
              {inActiveCurrentData?.length ? (
                <Row className="g-0 align-items-center my-2">
                  <Col sm={6}>
                    <div className="total_entry">
                      <p className="m-0">
                        Showing {inActiveIndexOfFirstItem + 1} to{' '}
                        {Math.min(
                          inActiveIndexOfLastItem,
                          inActiveMailAssetList?.length,
                        )}{' '}
                        of {inActiveMailAssetList?.length} entries
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="pagination_wrap">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalInActiveRecordPage}
                          page={currentPage.inActiveCurrentPage}
                          onChange={(e, page) =>
                            setCurrentPage({
                              ...currentPage,
                              inActiveCurrentPage: page,
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
          {userPermissionDetail?.system && (
            <div className="currentmail_wrap">
              <h4>DELETE MAIL ASSET FILES</h4>
              <p>
                If you need to delete any old mail asset files from the server
                then click the relevant file below - NOTE: This cannot be undone
                once deleted - make sure the asset is not currently in use
                against a mail asset tag.
              </p>
              <span
                className="d-block text_primary text-decoration-underline cursor-pointer mb-3"
                onClick={() => assetFileHandleClick()}
              >
                Show asset files to delete
              </span>
              {assetFile && (
                <div className="show_asset_table">
                  <ul className="pdf_link_wrap mail_asset_link_wrap">
                    {getAllAttachmentsData?.atts?.map(item => {
                      return (
                        <li className="bg_white_box" key={item?.path}>
                          <div className="d-flex align-items-center">
                            <Link to={item?.path} target="_blank">
                              <div className="pdf_icon">
                                <img src={PdfIcon} alt="pdf icon" />
                              </div>
                            </Link>
                            <div className="pdf_text">
                              <p>{item?.name}</p>
                            </div>
                          </div>
                          <div className="show_asset_table_img">
                            <span
                              className="cursor-pointer"
                              onClick={() => OpenDelete(item?.path)}
                              //need check
                            >
                              <img src={Close} alt="" />
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteMailAsset}
        name="Are you sure you want to delete this email asset? Note: this cannot be undone"
      />
    </div>
  );
}
