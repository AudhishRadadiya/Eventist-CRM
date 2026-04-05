import { memo } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { cancelResons } from 'utils/FieldValues';

const CancelledPopup = () => {
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  if (!enquirieDetail?.is_cancelled) return null;
  return (
    <>
      <div className="contact_alert_Wrap py-2 my-2">
        THIS BOOKING IS CANCELLED - by {enquirieDetail?.cancel_user} on{' '}
        {enquirieDetail?.cancel_time
          ? moment(enquirieDetail?.cancel_time).format('ddd Do MMM YYYY')
          : ''}
      </div>
      <div className="bg_gray_box px-3 py-2 d-block">
        <p className="mb-1">
          CANCELLATION REASON:{' '}
          {
            cancelResons.find(
              item => item?.value === parseFloat(enquirieDetail?.reason),
            )?.label
          }
        </p>
        <p className="mb-1">DETAILS: {enquirieDetail?.cancel_notes}</p>
      </div>
    </>
  );
};

export default memo(
  CancelledPopup,
  (prev, next) =>
    prev?.enquirieDetail?.is_cancelled === next?.enquirieDetail?.is_cancelled,
);
