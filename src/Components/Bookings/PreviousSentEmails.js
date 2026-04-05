import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmailListData } from 'store/reducers/Enquiry/LegacyNotes/enquiriesLegacyNotes.slice';
import useSortable from 'utils/useSortable';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import CheckIcon from '../../Assets/Img/check-green.svg';
import CrossIcon from '../../Assets/Img/cross-red.svg';
import PendingIcon from '../../Assets/Img/pending.svg';

export default function PreviousSentEmails({
  pages,
  id,
  search,
  state,
  reportParamData,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emailLegacyNotesList } = useSelector(
    ({ enquiriesLegacyNotes }) => enquiriesLegacyNotes,
  );
  useEffect(() => {
    if (pages === 'enquiries') {
      dispatch(
        getEmailListData({
          ref_type: 2,
          ref_id: id,
          booking_id: id,
        }),
      );
    } else if (pages === 'booking') {
      dispatch(
        getEmailListData({
          ref_type: 3,
          ref_id: id,
          booking_id: id,
        }),
      );
    } else if (reportParamData?.contact == 'true') {
      dispatch(
        getEmailListData({
          ref_type: 1,
          ref_id: state?.enq_id,
        }),
      );
    } else if (reportParamData?.enquiries === 'true') {
      dispatch(
        getEmailListData({
          ref_type: 2,
          ref_id: id,
          booking_id: id,
          // ref_id: state?.enq_id,
        }),
      );
    } else if (reportParamData?.booking === 'true') {
      dispatch(
        getEmailListData({
          ref_type:
            reportParamData?.payment_receipt_deposit ===
            'payment_receipt_deposit'
              ? 7
              : reportParamData?.etickets_new === 'etickets_new'
              ? 5
              : 3,
          ref_id:
            reportParamData?.payment_receipt_deposit ===
            'payment_receipt_deposit'
              ? state?.invoiceId
              : reportParamData?.etickets_new === 'etickets_new'
              ? state?.eTicket_id
              : id,
          booking_id: id,
          // ref_id:
          //   reportParamData?.payment_receipt_deposit ===
          //   'payment_receipt_deposit'
          //     ? state?.invoiceId
          //     : reportParamData?.etickets_new === 'etickets_new'
          //     ? state?.eTicket_id
          //     : state?.enq_id,
        }),
      );
    } else if (reportParamData?.eticket === 'true') {
      dispatch(
        getEmailListData({
          ref_type: reportParamData?.etickets_new === 'etickets_new' ? 5 : '',
          ref_id:
            reportParamData?.etickets_new === 'etickets_new'
              ? state?.eTicket_id
              : '',
          booking_id: id,
        }),
      );
    } else if (reportParamData?.payment === 'true') {
      dispatch(
        getEmailListData({
          ref_type: 7,
          ref_id: state?.invoiceId || state?.enq_id,
          booking_id: id,
        }),
      );
    } else if (
      reportParamData?.type === 'invoice' ||
      reportParamData?.type === 'credit'
    ) {
      dispatch(
        getEmailListData({
          ref_type: 4,
          // ref_id: state?.enq_id,
          ref_id: state?.invoiceId,
          booking_id: id,
        }),
      );
    }
    // else if (reportParamData?.etickets_new === 'etickets_new') {
    //   dispatch(
    //     getEmailListData({
    //       ref_type: 5,
    //       ref_id: state?.eTicket_id,
    //     }),
    //   );
    // }
  }, [dispatch, pages, state, id]);

  const { itemsInActive, requestSortInActive } =
    useSortable(emailLegacyNotesList);
  return (
    <div className="table_main_Wrapper p-2">
      {itemsInActive?.length ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="text_primary m-0">Previous Sent Emails</h5>
            <span>(Most Recent at the top)</span>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>View</TableCell>
                  <TableCell>Sent Time</TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('sent_to')}>
                      Sent To
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('type')}>
                      Type
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('from_name')}>
                      From
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('subject')}>
                      Subject
                    </span>
                  </TableCell>
                  <TableCell>
                    <span onClick={() => requestSortInActive('sent_by')}>
                      Sent By
                    </span>
                  </TableCell>
                  <TableCell>Sent OK</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsInActive?.map(element => {
                  return (
                    <TableRow
                      key={element?._id}
                      className={
                        state?.enq_id === element?._id ? 'bg_highlight' : ''
                      }
                    >
                      <TableCell>
                        {pages && (
                          <SearchOutlinedIcon
                            className="cursor-pointer"
                            // onClick={() => {
                            //   navigate(
                            //     `/send-new-email/${`${element?._id}?${pages}=true`}`,
                            //     {
                            //       state: { enq_id: id },
                            //     },
                            //   );
                            // }}
                            onClick={() => {
                              if (pages === 'booking') {
                                navigate(
                                  `/send-new-email/${id}?${pages}=true&booking_confirmation=web_booking_confirmation`,
                                  {
                                    state: {
                                      enq_id: `${element?._id}`,
                                      email_subject: element?.subject,
                                    },
                                  },
                                );
                              } else if (pages == 'enquiries') {
                                navigate(
                                  `/send-new-email/${id}?${pages}=true&booking_confirmation=web_booking_confirmation`,
                                  {
                                    // state: { enq_id: `${id}` },
                                    state: {
                                      enq_id: `${element?._id}`,
                                      email_subject: element?.subject,
                                    },
                                  },
                                );
                              } else if (
                                reportParamData?.booking_confirmation ===
                                'booking_confirmation'
                              ) {
                                navigate(
                                  `/send-new-email/${id}?${pages}=true&booking_confirmation=web_booking_confirmation`,
                                  {
                                    state: { enq_id: `${id}` },
                                  },
                                );
                              }
                              document
                                .getElementsByClassName('main_content')[0]
                                .scrollTo({
                                  top: 0,
                                  behavior: 'smooth',
                                });
                            }}
                          />
                        )}
                        {search && (
                          <SearchOutlinedIcon
                            className="cursor-pointer"
                            onClick={() => {
                              navigate(`/send-new-email/${id + search}`, {
                                state: {
                                  enq_id: element?._id,
                                  invoiceId:
                                    reportParamData?.payment === 'true' ||
                                    reportParamData?.type === 'invoice' ||
                                    reportParamData?.type === 'credit'
                                      ? element?.ref_id
                                      : reportParamData?.type === 'invoice' ||
                                        reportParamData?.type === 'credit'
                                      ? element?.ref_id
                                      : null,
                                  email_subject: element?.subject,
                                },
                              });
                              document
                                .getElementsByClassName('main_content')[0]
                                .scrollTo({
                                  top: 0,
                                  behavior: 'smooth',
                                });
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {/* {moment(element?.created_at).format(
                          ' DD/MM/YY h:mm:ss',
                        )} */}
                        {moment(element?.sent_time)?.format(
                          ' DD/MM/YY h:mm:ss',
                        )}
                      </TableCell>
                      <TableCell>{element?.sent_to}</TableCell>
                      <TableCell>{element?.type}</TableCell>
                      <TableCell>
                        {element?.from_name}{' '}
                        <span className="d-block">({element?.from_email})</span>
                      </TableCell>
                      <TableCell>
                        <p className="description">{element?.subject}</p>
                      </TableCell>
                      <TableCell>{element?.sent_by}</TableCell>
                      <TableCell>
                        {element?.sent_ok ? (
                          <img src={CheckIcon} alt="Check Icon" />
                        ) : element?.mail_accepted && !element?.mail_error ? (
                          <img src={PendingIcon} alt="Pending Icon" />
                        ) : !element?.mail_error ? (
                          <img src={CrossIcon} alt="Cross Icon" />
                        ) : (
                          <img src={CrossIcon} alt="Cross Icon" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        'There are currently no previous emails listed as sent against this booking'
      )}
    </div>
  );
}
