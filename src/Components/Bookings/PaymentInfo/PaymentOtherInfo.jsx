import { useSelector } from 'react-redux';
import TicketPrice from './TicketPrice';
import { formatNumberWithCommas, zeroRoundTo } from 'utils/common';
import { memo } from 'react';

const Details = memo(({ lable, amount, child, className }) => {
  return (
    <li>
      <label className="fw_500">{lable}</label>
      <div className="right_content">
        <p className={className ?? 'm-0'}>
          <>
            £{formatNumberWithCommas(amount)}
            {child}
          </>
        </p>
      </div>
    </li>
  );
});

const PaymentOtherInfo = ({ pages, handleClickOpen }) => {
  const { bookingPaymentInfoData } = useSelector(
    ({ bookingPayment }) => bookingPayment,
  );
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  const { userPermissionDetail } = useSelector(({ user }) => user);

  return (
    <>
      <TicketPrice />
      {pages === 'booking' && (
        <>
          <Details
            amount={bookingPaymentInfoData?.billable_items_amount?.toFixed(2)}
            lable={'Billable Items:'}
          />
          <Details
            amount={bookingPaymentInfoData?.balance_due?.toFixed(2)}
            lable={'Balance Due:'}
          />
          <Details
            amount={zeroRoundTo(bookingPaymentInfoData?.amount_paid)}
            lable={'Amount Paid:'}
          />
          <Details
            amount={bookingPaymentInfoData?.deposits_received?.toFixed(2)}
            lable={'Deposits Received:'}
            className={'m-0 d-flex justify-content-between'}
            child={
              <span
                className={
                  enquirieDetail?.max_places === 0
                    ? `text_decoration`
                    : `text_decoration cursor-pointer`
                }
                onClick={
                  userPermissionDetail?.super && enquirieDetail?.max_places > 0
                    ? handleClickOpen
                    : null
                }
              >
                Max:{' '}
                {enquirieDetail?.max_places ? enquirieDetail?.max_places : '0'}
              </span>
            }
          />
          <Details
            amount={bookingPaymentInfoData?.deposits_retained?.toFixed(2)}
            lable={'Deposits Retained:'}
          />
        </>
      )}
    </>
  );
};

export default memo(PaymentOtherInfo);
