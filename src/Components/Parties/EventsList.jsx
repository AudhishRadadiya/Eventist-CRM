import React, { useCallback, useEffect, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventListData } from 'store/reducers/Admin/Events/Parties/parties.slice';

export default function EventsList({ handleExclusive }) {
  const [eventsSearch, setEventsSearch] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { activeEventList } = useSelector(({ parties }) => parties);

  const [events, setEvents] = useState([]);
  useEffect(() => {
    dispatch(getEventListData());
  }, []);

  useEffect(() => {
    setEvents(activeEventList);
  }, [activeEventList]);

  const eventFilter = useCallback(() => {
    let filtered = activeEventList;
    if (eventsSearch?.trim()) {
      // Only filter if eventsSearch is not blank
      filtered = activeEventList?.filter(
        item =>
          item?.internal_name
            ?.toLowerCase()
            ?.includes(eventsSearch?.toLowerCase()), // Assuming 'internal_name' is the property to search for
      );
    }
    setEvents(filtered);
  }, [activeEventList, eventsSearch]);
  const searchParams = new URLSearchParams(location.search);
  let paramObj = Object.fromEntries([...searchParams]);
  return (
    <div className="parties_left_inner_wrap bg_white_box p-3">
      <div className="search_wrapper_common mb-3">
        <input
          type="search"
          placeholder="Search"
          className="form-control"
          value={eventsSearch}
          onChange={e => setEventsSearch(e.target.value)}
        />
        <button className="btn_primary small" onClick={eventFilter}>
          <SearchOutlinedIcon />
        </button>
      </div>
      <ul>
        {events?.map((event, i) => {
          return (
            <li
              className={paramObj.event_id === event?._id ? 'true' : 'false'}
              key={event?._id}
              onClick={() => {
                handleExclusive(false);
                navigate(
                  `/parties?event_id=${event?._id ? event._id : ''}&year=${
                    event?.year ? event.year : ''
                  }&internalName=${
                    event?.internal_name ? event.internal_name : ''
                  }
              `,
                  {
                    state: {
                      event_sku: event?.sku,
                    },
                  },
                );
              }}
            >
              <span className="text_light">{event?.year} : </span>
              {event?.internal_name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
