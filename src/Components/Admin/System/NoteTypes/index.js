import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Breadcrumbs,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Paper,
} from '@mui/material';

import Loader from 'Components/Common/Loader';
import { suspendHandler } from 'utils/common';
import useGroupSortable from 'utils/useGroupSortable';
import DeletePopupModal from 'Components/Common/DeletePopupModal';
import {
  getNoteTypesListData,
  setIsNoteTypesUpdated,
  updateNoteTypes,
} from 'store/reducers/Admin/System/noteTypes.slice';

import EditIcon from '../../../../Assets/Img/edit.svg';
import HomeBreadcrumbs from '../../../../Assets/Img/home-breadcrumbs.svg';

export default function NoteTypes() {
  const dispatch = useDispatch();
  const {
    activeNoteTypesList,
    inActiveNoteTypesList,
    noteTypesLoading,
    isNoteTypesUpdated,
  } = useSelector(({ noteTypes }) => noteTypes);

  const [deleteId, setDeleteId] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);

  const OpenDelete = data => {
    setDeleteId(data);
    setDeletePopup(true);
  };
  const CloseDelete = () => {
    setDeletePopup(false);
  };

  const deleteNoteTypesAccount = () => {
    dispatch(
      updateNoteTypes({
        _id: deleteId?._id,
        noteTypes: {
          ...deleteId,
          deleted: !deleteId?.deleted,
        },
      }),
    );
  };

  useEffect(() => {
    dispatch(getNoteTypesListData());
  }, [dispatch]);

  useEffect(() => {
    if (isNoteTypesUpdated) {
      dispatch(getNoteTypesListData());
      dispatch(setIsNoteTypesUpdated(false));
    }
  }, [isNoteTypesUpdated, dispatch]);

  return (
    <div className="inner_wrapper">
      {noteTypesLoading && <Loader />}
      <div className="notetype_main_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Typography>
              <b>Admin</b>
            </Typography>
            <Link to="/admin/system">System</Link>
            <Typography>Note Types</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <h1>Current Note Types</h1>
        </div>
        <Link
          to="/admin/note-types/add-edit-note-types"
          className="btn_primary small mb-3"
        >
          Add New Note Type
        </Link>

        <h5 className="text_primary">Active :</h5>
        <div className="table_main_Wrapper notetype_active_table mb-3">
          <TableContainer component={Paper}>
            <Table aria-label="simple table" className="my-table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell>Internal Name</TableCell>
                  <TableCell>Quick Link</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell sx={{ width: '10%' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeNoteTypesList?.map((elementTypes, index) => (
                  <React.Fragment key={index}>
                    <TableRow className="full_row">
                      <TableCell colSpan={7}>
                        {elementTypes?.type === '1'
                          ? 'Action'
                          : 'Correspondence'}
                      </TableCell>
                    </TableRow>
                    {elementTypes?.group_data?.map(element => (
                      <React.Fragment key={element?._id}>
                        <TableRow>
                          <TableCell>
                            {!!element?.item_id !== '' ? element?.item_id : '-'}
                          </TableCell>
                          <TableCell>
                            <i
                              className={`fa - solid  fa-${element?.icon} fa-xl`}
                              style={{
                                color: `${element?.icon_colour}`,
                              }}
                            ></i>
                          </TableCell>
                          <TableCell>{element?.name}</TableCell>
                          <TableCell>
                            {!!element?.is_quicklink ? 'Yes' : 'No'}
                          </TableCell>
                          <TableCell>{element?.order}</TableCell>
                          <TableCell>
                            <ul className="action_wrap">
                              <li>
                                <Link
                                  to={`/admin/note-types/add-edit-note-types/${element?._id}`}
                                  className="btn_edit"
                                >
                                  <img src={EditIcon} alt="Edit Icon" />
                                </Link>
                              </li>
                              {element?.locked ? (
                                <li>
                                  <span className="text_light">(Locked)</span>
                                </li>
                              ) : (
                                <>
                                  <li>
                                    <button
                                      type="button"
                                      className="btn_warning"
                                      onClick={() => {
                                        suspendHandler(
                                          element,
                                          dispatch,
                                          updateNoteTypes,
                                          'noteTypes',
                                        );
                                      }}
                                    >
                                      Suspend
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type="button"
                                      className="btn_border small"
                                      onClick={() => {
                                        OpenDelete(element);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                </>
                              )}
                            </ul>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <h5 className="text_primary">Inactive :</h5>
        <div className="table_main_Wrapper notetype_inactive_table mb-3">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell>Internal Name</TableCell>
                  <TableCell>Quick Link</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell sx={{ width: '10%' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inActiveNoteTypesList?.map((elementTypes, index) => (
                  <React.Fragment key={index}>
                    <TableRow className="full_row">
                      <TableCell colSpan={7}>
                        {elementTypes?.type === '1'
                          ? 'Action'
                          : 'Correspondence'}
                      </TableCell>
                    </TableRow>
                    {elementTypes?.group_data?.map(element => (
                      <TableRow key={element?._id}>
                        <TableCell>
                          {!!element?.item_id !== '' ? element?.item_id : '-'}
                        </TableCell>
                        <TableCell>
                          <i
                            className={`fa-solid fa-${element?.icon} fa-xl`}
                            style={{ color: `${element?.icon_colour}` }}
                          ></i>
                        </TableCell>
                        <TableCell>{element?.name}</TableCell>
                        <TableCell>
                          {!!element?.is_quicklink ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell>{element?.order}</TableCell>
                        <TableCell>
                          <ul className="action_wrap">
                            <li>
                              <Link
                                to={`/admin/note-types/add-edit-note-types/${element?._id}`}
                                className="btn_edit"
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </Link>
                            </li>
                            {element?.locked ? (
                              <li>
                                <span className="text_light">(Locked)</span>
                              </li>
                            ) : (
                              <>
                                <li>
                                  <button
                                    type="button"
                                    className="btn_info"
                                    onClick={() => {
                                      suspendHandler(
                                        element,
                                        dispatch,
                                        updateNoteTypes,
                                        'noteTypes',
                                      );
                                    }}
                                  >
                                    Activate
                                  </button>
                                </li>
                                <li>
                                  <button
                                    type="button"
                                    className="btn_border small"
                                    onClick={() => {
                                      OpenDelete(element);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </li>
                              </>
                            )}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <DeletePopupModal
        CloseDelete={CloseDelete}
        deletePopup={deletePopup}
        onClickDelete={deleteNoteTypesAccount}
        name="Are you sure you want to delete this note type? Note: this cannot be undone - all notes marked as this type will be set to a generic note"
      />
    </div>
  );
}
