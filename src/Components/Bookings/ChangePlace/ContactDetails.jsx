import moment from 'moment';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { addTax, toMoney } from 'utils/common';
import { contactTypes } from 'utils/FieldValues';

export const ContactDetail = memo(({ label, value, child }) => {
  return (
    <li>
      <label>{label}:</label>
      <div className="right_content">
        <p className="m-0">
          <>
            {value ?? '-'}
            {child}
          </>
        </p>
      </div>
    </li>
  );
});
const ContactDetails = () => {
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);

  return (
    <div className="popup_content_inner">
      <ul>
        <ContactDetail
          label={'Contact Name'}
          value={
            enquirieDetail?.contact?.title +
            ` ` +
            enquirieDetail?.contact?.first_name +
            ` ` +
            enquirieDetail?.contact?.surname +
            ` `
          }
        />
        <ContactDetail
          label={'Contact Account'}
          value={
            enquirieDetail?.contact?.account?.type
              ? contactTypes[enquirieDetail?.contact?.account?.type]?.name
              : '-'
          }
        />
        <ContactDetail
          label={'Event'}
          value={enquirieDetail?.event_info?.internal_name}
        />
        <ContactDetail
          label={'Event Date'}
          value={moment(enquirieDetail?.event_info?.event_date?.date).format(
            'ddd Do MMM YYYY',
          )}
        />
        <ContactDetail
          label={'Provisional Places'}
          value={enquirieDetail?.booking_info?.provisional_places}
        />
        <ContactDetail
          label={'Confirmed Places'}
          value={enquirieDetail?.booking_info?.confirmed_places}
        />
        <ContactDetail
          label={'Available Places'}
          value={enquirieDetail?.booking_info?.places}
          child={
            <span className="text_light">
              {enquirieDetail?.booking_info?.overbook_maximum
                ? '(' + enquirieDetail?.booking_info?.overbook_maximum + ')'
                : ''}
            </span>
          }
        />
        <ContactDetail
          label={'Tickets Price'}
          value={`£${toMoney(enquirieDetail?.event_info?.ticket_price)}`}
          child={
            <span className="text_light">
              {' '}
              / £
              {toMoney(
                addTax(
                  enquirieDetail?.event_info?.ticket_price,
                  enquirieDetail?.event_info?.tax_code?.percentage,
                ),
              )}
            </span>
          }
        />
      </ul>
    </div>
  );
};

export default memo(ContactDetails);
