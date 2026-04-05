import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getstoreErrorListData,
  setIsStoreErrorUpdated,
} from 'store/reducers/Dashboard/Dashboard.slice';
import Loader from 'Components/Common/Loader';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { getUserListData } from 'store/reducers/User/user.slice';
import { resetWatchlist } from 'store/reducers/Admin/Events/WatchList/watchlist.slice';
import WatchList from './WatchList';
import { getFollowupNote } from 'store/reducers/Admin/System/noteTypes.slice';
import FollowupNote from './FollowupNote';
import SystemError from './SystemError';

export default function HomePage() {
  const dispatch = useDispatch();
  const { watchListLoading } = useSelector(({ watchlist }) => watchlist);
  const { enquiryNoteLoading } = useSelector(
    ({ enquiryNotes }) => enquiryNotes,
  );
  const { storeErrorLoading, isStoreUpdateError } = useSelector(
    ({ storeError }) => storeError,
  );

  useEffect(() => {
    dispatch(getstoreErrorListData());
    dispatch(getEventListData());
    dispatch(getUserListData());
    dispatch(getFollowupNote());
    return () => {
      dispatch(resetWatchlist());
    };
  }, []);

  useEffect(() => {
    if (isStoreUpdateError) {
      dispatch(getstoreErrorListData());
      dispatch(setIsStoreErrorUpdated(false));
    }
  }, [isStoreUpdateError]);

  return (
    <div className="inner_wrapper">
      {(storeErrorLoading || watchListLoading || enquiryNoteLoading) && (
        <Loader />
      )}
      <div className="page_title">
        <h1>Dashboard</h1>
      </div>
      <WatchList />
      <SystemError />
      <FollowupNote />
    </div>
  );
}
