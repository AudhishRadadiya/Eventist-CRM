import { memo, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getHoldDate } from 'store/reducers/Enquiry/enquiries.slice';

const HoldDate = () => {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const { holdDate } = useSelector(({ enquiries }) => enquiries);

  useEffect(() => {
    dispatch(getHoldDate(bookingId));
  }, []);

  return (
    <Col xxl={5} className="mb-2 mb-xxl-0">
      <div className="right_booking_detail">
        <ul>
          <li
            className={
              +holdDate?.overdue_by > 0
                ? 'due'
                : holdDate?.overdue_by < 0
                ? 'overdue'
                : holdDate?.overdue_by === 0
                ? 'today'
                : ''
            }
          >
            Hold Period:{' '}
            <span>
              {holdDate?.hold_period
                ? holdDate?.hold_period + ' Days'
                : '0 Days'}
            </span>
          </li>
          <li
            className={
              +holdDate?.overdue_by > 0
                ? 'due'
                : holdDate?.overdue_by < 0
                ? 'overdue'
                : holdDate?.overdue_by === 0
                ? 'today'
                : ''
            }
          >
            Percentage Left:{' '}
            <span>
              {holdDate?.percentage_left
                ? holdDate?.percentage_left + '%'
                : '0'}
            </span>
          </li>
          <li
            className={
              +holdDate?.overdue_by > 0
                ? 'due'
                : holdDate?.overdue_by < 0
                ? 'overdue'
                : holdDate?.overdue_by === 0
                ? 'today'
                : ''
            }
          >
            Places Left:{' '}
            <span>
              {holdDate?.places_left ? holdDate?.places_left : 0}/
              {holdDate?.total_places ? holdDate?.total_places : 0}
            </span>
          </li>
          <li
            className={
              +holdDate?.overdue_by > 0
                ? 'due'
                : holdDate?.overdue_by < 0
                ? 'overdue'
                : holdDate?.overdue_by === 0
                ? 'today'
                : ''
            }
          >
            {+holdDate?.overdue_by > 0
              ? 'Due in'
              : holdDate?.overdue_by < 0
              ? 'Overdue By'
              : holdDate?.overdue_by === 0
              ? 'Due '
              : ''}{' '}
            <span>{holdDate?.overdue_by ? holdDate?.overdue_by : ''}</span>
            {+holdDate?.overdue_by > 0
              ? ' days'
              : holdDate?.overdue_by < 0
              ? ' DAYS'
              : holdDate?.overdue_by === 0
              ? ' TODAY'
              : ''}
          </li>
        </ul>
      </div>
    </Col>
  );
};

export default memo(HoldDate);
