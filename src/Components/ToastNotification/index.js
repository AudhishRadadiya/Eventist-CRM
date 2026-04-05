import React from 'react';
import '../../Assets/css/ToastNotification.css';
import { useDispatch, useSelector } from 'react-redux';
import { hideMessage } from 'store/reducers/common.slice';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';

function Toast() {
  const { showMessage, message, varient } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (showMessage) {
      setTimeout(s => {
        dispatch(hideMessage());
      }, 3000);
    }
  }, [showMessage]);
  if (!showMessage) return null;
  return (
    <div id="toast_custom">
      <div className=" flex justify-center items-center " id="img">
        {varient === 'success' ? <CheckCircleOutlineIcon /> : <InfoIcon />}
      </div>
      <div id="desc">{message !== undefined && message.toString()}</div>
    </div>
  );
}
export default Toast;
