import { memo } from 'react';
import { useSelector } from 'react-redux';
import {
  addTax,
  applyDiscount,
  formatNumberWithCommas,
  toMoney,
} from 'utils/common';

const TicketPrice = () => {
  const { bookingPaymentInfoData } = useSelector(
    ({ bookingPayment }) => bookingPayment,
  );
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  return (
    <li>
      <label className="fw_500">Ticket price (inc discount):</label>
      <div className="right_content">
        <p className="m-0">
          £
          {formatNumberWithCommas(
            toMoney(
              bookingPaymentInfoData?.discount
                ? applyDiscount(
                    enquirieDetail?.event_info?.ticket_price,
                    bookingPaymentInfoData.discount,
                  )?.toFixed(2)
                : enquirieDetail?.event_info?.ticket_price,
            ),
          )}
          <span className="text_light">
            {' '}
            / £
            {formatNumberWithCommas(
              toMoney(
                addTax(
                  bookingPaymentInfoData?.discount
                    ? applyDiscount(
                        enquirieDetail?.event_info?.ticket_price,
                        bookingPaymentInfoData.discount,
                      )
                    : enquirieDetail?.event_info?.ticket_price,
                  enquirieDetail?.event_info?.tax_code?.percentage,
                ),
              ),
            )}{' '}
            {enquirieDetail?.event_info?.tax_code?.public_name ||
            enquirieDetail?.event_info?.tax_code?.percentage
              ? '@'
              : ''}
            {enquirieDetail?.event_info?.tax_code?.percentage
              ? enquirieDetail?.event_info?.tax_code?.percentage % 1 === 0
                ? `${enquirieDetail?.event_info?.tax_code?.percentage}%`
                : `${enquirieDetail?.event_info?.tax_code?.percentage?.toFixed(
                    2,
                  )}%`
              : ''}{' '}
            {enquirieDetail?.event_info?.tax_code?.public_name}
          </span>
        </p>
      </div>
    </li>
  );
};

export default memo(TicketPrice);
