import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../../common.slice';

const initialState = {
  activeNoteTypesList: [],
  inActiveNoteTypesList: [],
  followup_note: [],
  noteTypesLoading: false,
  isNoteTypesUpdated: false,
  noteTypesDetail: {},
};

export const getNoteTypesListData = createAsyncThunk(
  'admin/get-note-type-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/note_type/list')
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data.data).length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);
export const getFollowupNote = createAsyncThunk(
  'admin/followup_note',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/followup_note')
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data.data).length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const createNoteTypes = createAsyncThunk(
  'admin/create-note-types',
  (noteTypes, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/note_type/create', noteTypes)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            resolve(res.data);
          } else {
            dispatch(showMessage({ message: res.data.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const getNoteTypesData = createAsyncThunk(
  'admin/get-note-types',
  (id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/note_type/${id}`)
        .then(res => {
          if (res.data.err === 0) {
            if (Object.keys(res.data.data).length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            dispatch(showMessage({ message: res.data.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const updateNoteTypes = createAsyncThunk(
  'admin/update-note-Types',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, noteTypes } = props;
      axios
        .put(`admin/note_type/update/${_id}`, noteTypes)
        .then(res => {
          if (res.data.err === 0) {
            dispatch(
              showMessage({ message: res.data.msg, varient: 'success' }),
            );
            resolve(res.data.data);
          } else {
            dispatch(showMessage({ message: res.data.msg }));
            reject();
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);

export const noteTypesSlice = createSlice({
  name: 'note_types',
  initialState,
  reducers: {
    setNoteTypesLoading: (state, action) => {
      state.noteTypesLoading = action.payload;
    },
    setIsNoteTypesUpdated: (state, action) => {
      state.isNoteTypesUpdated = action.payload;
    },
    setNoteTypesDetail: (state, action) => {
      state.noteTypesDetail = action.payload;
    },
  },
  extraReducers: {
    [getNoteTypesListData.pending]: state => {
      state.noteTypesLoading = true;
    },
    [getNoteTypesListData.rejected]: state => {
      state.activeNoteTypesList = [];
      state.inActiveNoteTypesList = [];
      state.noteTypesLoading = false;
    },
    [getNoteTypesListData.fulfilled]: (state, action) => {
      state.activeNoteTypesList = action.payload.active || [];
      state.inActiveNoteTypesList = action.payload.inactive || [];
      state.noteTypesLoading = false;
    },
    [getFollowupNote.pending]: state => {
      state.noteTypesLoading = true;
    },
    [getFollowupNote.rejected]: state => {
      state.followup_note = [];
      state.noteTypesLoading = false;
    },
    [getFollowupNote.fulfilled]: (state, action) => {
      state.followup_note = action.payload || [];
      state.noteTypesLoading = false;
    },
    [createNoteTypes.pending]: state => {
      state.isNoteTypesUpdated = false;
      state.noteTypesLoading = true;
    },
    [createNoteTypes.rejected]: state => {
      state.isNoteTypesUpdated = false;
      state.noteTypesLoading = false;
    },
    [createNoteTypes.fulfilled]: state => {
      state.isNoteTypesUpdated = true;
      state.noteTypesLoading = false;
    },
    [getNoteTypesData.pending]: state => {
      state.noteTypesLoading = true;
      state.noteTypesDetail = {};
    },
    [getNoteTypesData.rejected]: state => {
      state.noteTypesLoading = false;
      state.noteTypesDetail = {};
    },
    [getNoteTypesData.fulfilled]: (state, action) => {
      state.noteTypesLoading = false;
      state.noteTypesDetail = action.payload;
    },
    [updateNoteTypes.pending]: state => {
      state.isNoteTypesUpdated = false;
      state.noteTypesLoading = true;
    },
    [updateNoteTypes.rejected]: state => {
      state.isNoteTypesUpdated = false;
      state.noteTypesLoading = false;
    },
    [updateNoteTypes.fulfilled]: state => {
      state.isNoteTypesUpdated = true;
      state.noteTypesLoading = false;
    },
  },
});

export const {
  setNoteTypesLoading,
  setIsNoteTypesUpdated,
  setNoteTypesDetail,
} = noteTypesSlice.actions;

export default noteTypesSlice.reducer;
