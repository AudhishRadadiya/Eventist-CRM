import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bookingCart } from 'store/reducers/Booking/bookingCart.slice';
import CartList from './AbandadCartList';

export default function Cart() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(bookingCart());
  }, []);

  return (
    <>
      <CartList />
    </>
  );
}
