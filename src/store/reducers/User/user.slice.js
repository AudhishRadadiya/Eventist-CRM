import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '../common.slice';
const initialState = {
  activeUserList: [],
  inActiveUserList: [],
  userLoading: false,
  isUserUpdated: false,
  userDetail: {},
  userPermissionDetail: {},
};
const mergePermission = data => {
  let newArray = [];
  Object.entries(data).forEach(item => {
    if (item[1]) {
      newArray.length === 0
        ? newArray.push(item[0])
        : newArray.push(` ${item[0]}`);
    }
  });
  return newArray.toString();
};
const mergeIpHost = (data, space) => {
  let newArray = data.map(item => {
    if (space) {
      return `${item} `;
    }
    return `${item}`;
  });
  return newArray.toString();
};
export const getUserListData = createAsyncThunk(
  'admin/get-user-list',
  (user, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('admin/users/list')
        .then(res => {
          if (res.data.status === 200) {
            if (res.data.data.length > 0) {
              let activeUser = res.data.data[0].active || [];
              let inActiveUser = res.data.data[0].inactive || [];
              if (activeUser.length > 0) {
                activeUser = activeUser.filter(user => {
                  user.mergePermissions = mergePermission(user.permissions);
                  user.mergeRestricted_to_ip_host = mergeIpHost(
                    user.restricted_to_ip_host,
                  );
                  return user;
                });
              }
              if (inActiveUser.length > 0) {
                inActiveUser = inActiveUser.filter(user => {
                  user.mergePermissions = mergePermission(user.permissions);
                  user.mergeRestricted_to_ip_host = mergeIpHost(
                    user.restricted_to_ip_host,
                    true,
                  );
                  return user;
                });
              }
              resolve({ activeUser: activeUser, inActiveUser: inActiveUser });
            } else {
              resolve([]);
            }
          } else {
            reject();
            dispatch(showMessage({ message: res.data.msg }));
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);
export const getUserData = createAsyncThunk(
  'admin/get-user',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/users/${_id}`)
        .then(res => {
          if (res.data.status === 200) {
            if (Object.keys(res.data.data).length > 0) {
              let userData = res.data.data;
              userData = {
                ...userData,
                permissions: mergePermission(userData.permissions),
                restricted_to_ip_host: mergeIpHost(
                  userData.restricted_to_ip_host,
                  false,
                ),
              };
              resolve(userData);
            } else {
              resolve({});
            }
          } else {
            reject();
            dispatch(showMessage({ message: res.data.msg }));
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);
export const getUserPermissionData = createAsyncThunk(
  'admin/get-user-permission-data',
  (_id, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`admin/users/${_id}`)
        .then(res => {
          if (res.data.status === 200) {
            if (Object.keys(res.data.data).length > 0) {
              resolve(res.data.data?.permissions);
            } else {
              resolve({});
            }
          } else {
            reject();
            dispatch(showMessage({ message: res.data.msg }));
          }
        })
        .catch(error => {
          dispatch(showMessage({ message: error.response.data.msg }));
          reject(error);
        });
    });
  },
);
export const createUserSecurity = createAsyncThunk(
  'admin/create-user',
  (user, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('admin/users/create', user)
        .then(res => {
          if (res.data.status === 200) {
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

export const userAssignBooking = createAsyncThunk(
  'admin/useAssignBooking',
  (props, { dispatch }) => {
    const { id, data } = props;
    return new Promise((resolve, reject) => {
      axios
        .post(`admin/users/assign_booking/${id}`, data)
        .then(res => {
          if (res.data.status === 200) {
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
export const updateUserSecurity = createAsyncThunk(
  'admin/update-user',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { _id, user } = props;
      axios
        .put(`admin/users/update/${_id}`, user)
        .then(res => {
          if (res.data.status === 200) {
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
    setIsUserUpdated: (state, action) => {
      state.isUserUpdated = action.payload;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
  },
  extraReducers: {
    [createUserSecurity.pending]: state => {
      state.isUserUpdated = false;
      state.userLoading = true;
    },
    [createUserSecurity.rejected]: state => {
      state.isUserUpdated = false;
      state.userLoading = false;
    },
    [createUserSecurity.fulfilled]: state => {
      state.isUserUpdated = true;
      state.userLoading = false;
    },
    [updateUserSecurity.pending]: state => {
      state.isUserUpdated = false;
      state.userLoading = true;
    },
    [updateUserSecurity.rejected]: state => {
      state.isUserUpdated = false;
      state.userLoading = false;
    },
    [updateUserSecurity.fulfilled]: state => {
      state.isUserUpdated = true;
      state.userLoading = false;
    },
    [getUserData.pending]: state => {
      state.userDetail = {};
      state.userLoading = true;
    },
    [getUserData.rejected]: state => {
      state.userDetail = {};
      state.userLoading = false;
    },
    [getUserData.fulfilled]: (state, action) => {
      state.userDetail = action.payload;
      state.userLoading = false;
    },
    [getUserPermissionData.pending]: state => {
      state.userPermissionDetail = {};
      state.userLoading = true;
    },
    [getUserPermissionData.rejected]: state => {
      state.userPermissionDetail = {};
      state.userLoading = false;
    },
    [getUserPermissionData.fulfilled]: (state, action) => {
      state.userPermissionDetail = action.payload;
      state.userLoading = false;
    },
    [getUserListData.pending]: state => {
      state.activeUserList = [];
      state.inActiveUserList = [];
      state.userLoading = true;
    },
    [getUserListData.rejected]: state => {
      state.activeUserList = [];
      state.inActiveUserList = [];
      state.userLoading = false;
    },
    [getUserListData.fulfilled]: (state, action) => {
      let activeUser = [];
      let inActiveUser = [];
      if (
        (action.payload.activeUser.length ||
          action.payload.inActiveUser.length) > 0
      ) {
        activeUser = action.payload.activeUser;
        inActiveUser = action.payload.inActiveUser;
      }
      state.activeUserList = activeUser;
      state.inActiveUserList = inActiveUser;
      state.userLoading = false;
    },
    [userAssignBooking.pending]: state => {
      state.userLoading = true;
    },
    [userAssignBooking.rejected]: state => {
      state.userLoading = false;
    },
    [userAssignBooking.fulfilled]: state => {
      state.userLoading = false;
    },
  },
});

export const { setUserLoading, setIsUserUpdated, setUserDetail } =
  userSlice.actions;

export default userSlice.reducer;
