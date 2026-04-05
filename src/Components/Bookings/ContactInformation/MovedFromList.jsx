import moment from 'moment';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';

const MovedFromList = () => {
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);

  return (
    <>
      {enquirieDetail?.moved_from?.length ? (
        <li className="align-items-start">
          <label className="fw_500">Moved From:</label>
          <div className="right_content">
            <ol type="I">
              {enquirieDetail?.moved_from?.map(element => {
                return (
                  <li>
                    {element?.event_name}{' '}
                    {moment(element?.event_date).format('Do MMM YYYY')}
                    <span className="d-block text_light ps-2">
                      {moment(element?.moved_at).format(
                        'ddd D/MM/YYYY  hh:mm:ss',
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </li>
      ) : null}
    </>
  );
};

export default memo(
  MovedFromList,
  (prev, next) =>
    prev?.enquirieDetail?.moved_from?.length ===
    next?.enquirieDetail?.moved_from?.length,
);
