import { Tooltip } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import InfoIcon from '../../../Assets/Img/info-icon.svg';
const ChangePlaceHistory = () => {
  const { historyList } = useSelector(({ changePlace }) => changePlace);
  return (
    <div className="bg_gray_box history_wrapper p-3">
      <label className="mb-2">History</label>
      <ul>
        {historyList?.map(item => {
          return (
            <li className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <Tooltip title={item?.note}>
                  <img src={InfoIcon} alt="Info Icon" className="me-2" />
                </Tooltip>
                {item?.time}
                <span style={{ color: '#de3957' }}>
                  {item?.is_confirm ? '(CNF)' : ''}
                </span>
              </div>
              <span>
                {item?.confirm_places}{' '}
                <span className="text_light">({item?.change_places})</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default ChangePlaceHistory;
