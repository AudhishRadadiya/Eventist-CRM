import moment from 'moment';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const TransferredFromList = () => {
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  const [transferFromBox, setTransferFromBox] = useState(false);

  return (
    <>
      {enquirieDetail?.transferred_from?.length ? (
        <li className="align-items-start">
          <label className="fw_500">Transferred From:</label>
          <div className="right_content">
            <ul className={transferFromBox ? 'transfer-show' : 'transfer-hide'}>
              {enquirieDetail?.transferred_from?.map(item => {
                return (
                  <li>
                    <Link
                      className="text_decoration"
                      to={`/contact/edit-contact/${item?.contact?._id}`}
                    >
                      {item?.contact?.first_name + ' ' + item?.contact?.surname}
                    </Link>{' '}
                    ({item.account_name}) -
                    <span className="text_light">
                      {moment(item?.transferred_at).format(
                        'ddd Do MMM YYYY h:mm:ss',
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
            <span
              className="cursor-pointer text_primary"
              onClick={() => setTransferFromBox(!transferFromBox)}
            >
              {enquirieDetail?.transferred_from?.length > 1
                ? !transferFromBox
                  ? 'Show More '
                  : 'Show Less'
                : ''}
            </span>
          </div>
        </li>
      ) : null}
    </>
  );
};

export default memo(
  TransferredFromList,
  (prev, next) =>
    prev?.enquirieDetail?.transferred_from?.length ===
    next?.enquirieDetail?.transferred_from?.length,
);
