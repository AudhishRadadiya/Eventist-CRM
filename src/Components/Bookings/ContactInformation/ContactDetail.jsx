import { memo } from 'react';

export const ContactDetail = memo(({ label, value }) => {
  return (
    <li>
      <label className="fw_500">{label}:</label>
      <div className="right_content">
        <p className="m-0">{value ?? '-'}</p>
      </div>
    </li>
  );
});
