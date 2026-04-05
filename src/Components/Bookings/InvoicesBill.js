import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getInvoiceData } from 'store/reducers/Booking/invoice.slice';
import Loader from 'Components/Common/Loader';

export default function InvoicesBill() {
  const dispatch = useDispatch();
  const { invoiceId } = useParams();

  const { invoiceDetail, invoiceLoading } = useSelector(
    ({ invoice }) => invoice,
  );

  useEffect(() => {
    dispatch(
      getInvoiceData({
        invoiceId: invoiceId,
      }),
    );
  }, [dispatch, invoiceId]);

  return (
    <>
      {invoiceLoading && <Loader />}
      <div
        style={{
          margin: 0,
          padding: 0,
        }}
        dangerouslySetInnerHTML={{ __html: invoiceDetail }}
      />
    </>
  );
}
