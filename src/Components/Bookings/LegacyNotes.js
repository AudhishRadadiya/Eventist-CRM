import React from 'react';
import PreviousSentEmails from './PreviousSentEmails';

const LegacyNotes = ({ enquirieDetail, pages, id }) => {
  return (
    <div>
      <div className="legacy_notes_wrap mb-3">
        <div className="card_wrapper">
          <div className="card_header d-flex align-items-center justify-content-between py-2 px-3">
            <h4 className="m-0 py-1 text_white">Legacy Notes</h4>
          </div>
          <div className="card_body">
            <div className="legacy_notes_btn_wrap text-end">
              <button type="button" className="btn_primary small">
                Clear Legacy Notes
              </button>
            </div>
            <ul className="my-2">
              {enquirieDetail?.legacy_notes?.account_internal_notes ? (
                <li>
                  <label className="fw_500">Notes on Account (internal):</label>
                  <div className="right_content">
                    <h5 className="m-0 fw_bold">
                      {enquirieDetail?.legacy_notes?.account_internal_notes}
                    </h5>
                  </div>
                </li>
              ) : (
                ''
              )}
              {enquirieDetail?.legacy_notes?.account_public_notes ? (
                <li>
                  <label className="fw_500">Notes on Account (public):</label>
                  <div className="right_content">
                    <h5 className="m-0 fw_bold">
                      {enquirieDetail?.legacy_notes?.account_public_notes}
                    </h5>
                  </div>
                </li>
              ) : (
                ''
              )}
              {enquirieDetail?.legacy_notes?.customer_notes ? (
                <li>
                  <label className="fw_500">Customer Notes:</label>
                  <div className="right_content">
                    <h5 className="m-0 fw_bold">
                      {enquirieDetail?.legacy_notes?.customer_notes}
                    </h5>
                  </div>
                </li>
              ) : (
                ''
              )}
            </ul>
            <div className="note_table_wrap p-2">
              <PreviousSentEmails pages={pages} id={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegacyNotes;
