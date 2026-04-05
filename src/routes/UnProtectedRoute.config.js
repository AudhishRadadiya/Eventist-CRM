import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSessionValue } from 'utils/common';

export default function UnProtectedRoute({ children, ...rest }) {
  const location = useLocation();

  return !getSessionValue() ? (
    children
  ) : (
    <Navigate
      to={
        location?.state?.prevRoute?.pathname
          ? location.state.prevRoute.pathname
          : '/'
      }
    />
  );
}
