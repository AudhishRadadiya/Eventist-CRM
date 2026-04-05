import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  getBookingCouponListData,
  processCoupon,
  setBookingCouponDetail,
  setIsBookingCouponUpdated,
} from 'store/reducers/Booking/bookingCoupon.slice';
import EditIcon from '../../../Assets/Img/edit.svg';

import CheckIcon from '../../../Assets/Img/check-green.svg';
import CrossIcon from '../../../Assets/Img/cross-red.svg';
import HoldDate from '../../../Assets/Img/hold-date.svg';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Loader from 'Components/Common/Loader';
import AddCouponPopup from './AddCouponPopup';
import EditCouponPopup from './EditCouponPopup';
import { bookingPaymentInfo } from 'store/reducers/Booking/bookingPayment.slice';

function CouponsInfo() {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  const { userPermissionDetail } = useSelector(({ user }) => user);
  const { bookingCouponList, bookingCouponLoading, isBookingCouponUpdated } =
    useSelector(({ bookingCoupon }) => bookingCoupon);
  const [addCouponPopup, setAddCouponPopup] = useState(false);
  const [editCouponPopup, setEditCouponPopup] = useState(false);
  const prevIsBooking = useRef(null);

  useEffect(() => {
    if (Object.keys(enquirieDetail).length)
      if (enquirieDetail?.is_booking !== prevIsBooking.current) {
        dispatch(getBookingCouponListData({ _id: bookingId }));
        prevIsBooking.current = enquirieDetail?.is_booking;
      }
  }, [enquirieDetail]);

  useEffect(() => {
    if (isBookingCouponUpdated) {
      dispatch(getBookingCouponListData({ _id: bookingId }));
      dispatch(bookingPaymentInfo(bookingId));
      dispatch(setIsBookingCouponUpdated(false));
    }
  }, [isBookingCouponUpdated]);

  const OpenAddCoupon = () => setAddCouponPopup(true);

  const openEditCoupon = () => setEditCouponPopup(true);

  const closeAddCoupon = () => setAddCouponPopup(false);

  const closeEditCoupon = () => {
    setEditCouponPopup(false);
    dispatch(setBookingCouponDetail({}));
  };

  const renderProcessCoupons = useCallback(() => {
    if (enquirieDetail?.is_process_coupons) {
      if (
        userPermissionDetail?.processcoupons &&
        userPermissionDetail?.admin &&
        userPermissionDetail?.super
      ) {
        return (
          <ul className="d-flex mt-2 align-items-center justify-content-center">
            <li>
              <Button
                className="btn_primary small mx-2"
                onClick={() =>
                  dispatch(processCoupon({ booking_id: bookingId }))
                }
              >
                Process Coupons
              </Button>
            </li>
          </ul>
        );
      }
    } else return null;
  }, [enquirieDetail?.is_process_coupons]);

  return (
    <>
      <div className="card_wrapper mb-4">
        {bookingCouponLoading && <Loader />}
        <div className="card_header d-flex align-items-center justify-content-between py-2 px-3">
          <h4 className="m-0 py-1 text_white">Coupons</h4>
          <Button className="btn_border small" onClick={OpenAddCoupon}>
            Add Coupon
          </Button>
        </div>
        <div className="card_body">
          {bookingCouponList?.length > 0 ? (
            <ul>
              <li>
                <div className="no_data w-100">
                  <div className="bg_gray_box table_main_Wrapper">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Deposit Required</TableCell>
                            <TableCell>Accepted</TableCell>
                            <TableCell>
                              <span>Sku Name</span>
                            </TableCell>
                            <TableCell>
                              <span>Name</span>
                            </TableCell>
                            <TableCell>Processed</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bookingCouponList?.map(data => {
                            return (
                              <>
                                <TableRow
                                  className={
                                    data?.is_rejected && `bg_highlight`
                                  }
                                >
                                  <TableCell>
                                    <img
                                      src={HoldDate}
                                      alt="Chat icon"
                                      className="me-2 icon_grayscale"
                                      data-toggle="tooltip"
                                      data-placement="bottom"
                                      title={`Added by ${
                                        data?.created_by?.name
                                      } ${data?.created_by?.username} ${`on ${
                                        data?.created_at
                                          ? moment(
                                              // .utc(data?.created_at)
                                              data?.created_at,
                                            ).format(
                                              'dddd DD MMMM YYYY - HH:mm:ss ',
                                            )
                                          : ''
                                      }`} 
                                        `}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {data?.deposits_required_by !== null ||
                                    '' ? (
                                      data?.is_payment_paid ? (
                                        <img
                                          src={CheckIcon}
                                          alt="Check Icon"
                                          data-toggle="tooltip"
                                          data-placement="bottom"
                                          title={`paid`}
                                        />
                                      ) : (
                                        <img
                                          src={CrossIcon}
                                          alt="Cross Icon"
                                          data-toggle="tooltip"
                                          data-placement="bottom"
                                          title={`A Deposite is requied by ${moment
                                            .utc(data?.deposits_required_by)
                                            .format(
                                              'YYYY-MM-DD',
                                            )} but NOT yet paid`}
                                        />
                                      )
                                    ) : (
                                      <div
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title={`A Deposite is not required for this coupon`}
                                      >
                                        <RemoveCircleOutlineIcon fontSize="medium" />
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {data?.is_accepted ? (
                                      <img
                                        src={CheckIcon}
                                        alt="Check Icon"
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title={`Accepted by ${
                                          data?.created_by?.name
                                        } ${data?.created_by?.username} ${`on ${
                                          data?.created_at
                                            ? moment
                                                .utc(data?.created_at)
                                                .format(
                                                  'dddd DD MMMM YYYY - HH:mm:ss ',
                                                )
                                            : ''
                                        }`} 
                                        `}
                                      />
                                    ) : (
                                      <img
                                        src={CrossIcon}
                                        alt="Cross Icon "
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title={`This coupon has not been accepted yet`}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {data?.is_rejected ? (
                                      <del className="m-0">{data?.sku}</del>
                                    ) : (
                                      <p className="m-0">{data?.sku}</p>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {data?.is_rejected ? (
                                      <del className="m-0">{data?.name}</del>
                                    ) : (
                                      <p className="m-0">{data?.name}</p>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {data?.is_processed ? (
                                      <img
                                        src={CheckIcon}
                                        alt="Check Icon"
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title={`Processed by ${
                                          data?.created_by?.name
                                        } ${data?.created_by?.username} ${`on ${
                                          data?.created_at
                                            ? moment
                                                .utc(data?.created_at)
                                                .format(
                                                  'dddd DD MMMM YYYY - HH:mm:ss ',
                                                )
                                            : ''
                                        }`} 
                                      `}
                                      />
                                    ) : (
                                      <img
                                        src={CrossIcon}
                                        alt="Cross Icon"
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title={`Not Processed yet`}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {userPermissionDetail?.processcoupons &&
                                      userPermissionDetail?.admin &&
                                      userPermissionDetail?.super && (
                                        <Button
                                          className="btn_edit"
                                          onClick={() => {
                                            openEditCoupon();
                                            dispatch(
                                              setBookingCouponDetail(data),
                                            );
                                          }}
                                        >
                                          <img src={EditIcon} alt="Edit Icon" />
                                        </Button>
                                      )}
                                  </TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  {renderProcessCoupons}
                </div>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <div className="no_data">
                  <p className="m-0 py-2 text_light">No coupons assigned</p>
                </div>
              </li>
            </ul>
          )}
        </div>
      </div>
      <AddCouponPopup
        addCouponPopup={addCouponPopup}
        closeAddCoupon={closeAddCoupon}
      />
      <EditCouponPopup
        editCouponPopup={editCouponPopup}
        closeEditCoupon={closeEditCoupon}
      />
    </>
  );
}

export default memo(
  CouponsInfo,
  (prev, next) =>
    prev.enquirieDetail.is_booking === next.enquirieDetail.is_booking,
);
