import React, { useState, Suspense, useEffect } from 'react';
import Header from 'Components/Common/Header';
import { Navigate, useLocation } from 'react-router-dom';
import SearchPanel from 'Components/Common/SearchPanel';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Loader from 'Components/Common/Loader';
import { useSelector } from 'react-redux';
import SearchResult from 'Components/Common/SearchResult';
import { getSessionValue } from 'utils/common';

export default function PrivateRouter({ children, state }) {
  const { isLoader } = useSelector(({ auth }) => auth);

  const [searchToggle, setSearchToggle] = useState(true);
  const [route, setRoute] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [searchHeaderData, setSearchHeaderData] = useState(null);

  const location = useLocation();

  const searchToggleHandle = () => {
    setSearchToggle(!searchToggle);
  };

  useEffect(() => {
    setRoute(false);
  }, [location]);
  if (!getSessionValue()) {
    return (
      <Navigate
        // exact
        to={'/login'}
        state={{ prevRoute: location }}
      />
    );
  }
  return (
    <>
      {!isLoader && (
        <div className="main_wrapper">
          {state === false ? (
            ''
          ) : (
            <Header
              setRoute={setRoute}
              setSearchHeaderData={setSearchHeaderData}
            />
          )}
          <div
            className={
              state === false
                ? searchToggle
                  ? 'dashboard_content  bg-white mt-0 h-100'
                  : 'dashboard_content search_hide'
                : 'dashboard_content'
            }
          >
            <div
              className={
                state === false || searchToggle === false
                  ? 'main_content w-100'
                  : 'main_content'
              }
            >
              {state === false ? (
                ''
              ) : (
                <div
                  className="search_toggle_btn"
                  onClick={() => searchToggleHandle(false)}
                >
                  Filter <FilterAltOutlinedIcon />
                </div>
              )}

              <Suspense fallback={<Loader />}>
                {route
                  ? (Object.entries(searchData)?.length > 0 ||
                      Object.entries(searchHeaderData)?.length > 0) && (
                      <SearchResult
                        searchData={
                          searchHeaderData ? searchHeaderData : searchData
                        }
                        keys={searchHeaderData ? 1 : 2}
                      />
                    )
                  : children}
              </Suspense>
            </div>
            {state === false ? (
              ''
            ) : (
              <div
                className={searchToggle ? 'search_panel' : 'search_panel hide'}
              >
                <SearchPanel
                  setRoute={setRoute}
                  setSearchData={setSearchData}
                  setSearchHeaderData={setSearchHeaderData}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
