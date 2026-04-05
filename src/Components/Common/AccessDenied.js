import React from 'react';
import DeniedImg from '../../Assets/Img/Access_Denied.svg';

export default function AccessDenied() {
  return (
    <div>
      <div className="access_denied_text text-center">
        <img src={DeniedImg} alt="access-denied" />
        <h3 className="mt-5">Access Denied</h3>
        <p>
          Sorry, but you do not have permission to access the requested page. If
          you think this is a mistake, please contact the administrator or
          return to the previous page.
        </p>
      </div>
    </div>
  );
}
