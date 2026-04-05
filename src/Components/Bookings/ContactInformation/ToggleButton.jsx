import { memo } from 'react';

const switchesProps = { inputProps: { 'aria-label': 'Switch demo' } };
import CrossIcon from '../../../Assets/Img/cross-red.svg';
import CheckIcon from '../../../Assets/Img/check-green.svg';
import { Switch } from '@mui/material';
export const ToggleButton = memo(
  ({ label, switchState, onSwitchChange, name }) => {
    return (
      <li>
        <label className="fw_500">{label}:</label>
        <div className="right_content">
          <div className="d-flex align-items-center justify-content-between">
            <img src={switchState ? CheckIcon : CrossIcon} alt="Status Icon" />
            <Switch
              {...switchesProps}
              checked={switchState}
              onChange={onSwitchChange}
              name={name}
            />
          </div>
        </div>
      </li>
    );
  },
);
