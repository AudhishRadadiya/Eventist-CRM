import WatchList from 'Components/Home/WatchList';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';
export default function MyBooking() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEventListData());
  }, []);
  return (
    <div className="inner_wrapper">
      <div className="page_title">
        <h1>Current Bookings</h1>
      </div>
      <WatchList />
    </div>
  );
}
