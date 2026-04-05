import React from 'react';

export default function PdfPopup({ url, onPdfPopupClose }) {
  return (
    <>
      {url && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <button className="close-btn" onClick={onPdfPopupClose}>
                X
              </button>
            </div>
            <div className="modal-body">
              <iframe
                src={url}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="PDF Viewer"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
