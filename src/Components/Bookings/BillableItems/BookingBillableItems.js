import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Dialog, DialogContent, TextField } from '@mui/material';
import {
  Breadcrumbs,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Table,
  Paper,
  FormControlLabel,
  FormControl,
  FormGroup,
  Checkbox,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBookingBillableItemsListData,
  updateBookingBillableItems,
} from 'store/reducers/Booking/bookingBillableItems.slice';

import HomeBreadcrumbs from '../../../Assets/Img/home-breadcrumbs.svg';
import EditIcon from '../../../Assets/Img/edit.svg';
import CheckIcon from '../../../Assets/Img/check-green.svg';
import CrossIcon from '../../../Assets/Img/cross-red.svg';
import Loader from 'Components/Common/Loader';
import { numberRegexE } from 'utils/common';
import { optionsOfValue, optionsRule } from 'utils/FieldValues';
import { seterrorMassage } from 'store/reducers/common.slice';

export default function BookingBillableItems() {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userPermissionDetail } = useSelector(({ user }) => user);
  const { errorMassage } = useSelector(({ common }) => common);
  const {
    bookingBillableItemsList,
    isBookingBillableItemsUpdated,
    bookingBillableItemsLoading,
  } = useSelector(({ bookingBillableItems }) => bookingBillableItems);

  // const [quantityStatus, setQuantityStatus] = useState();
  const [billableItemStatus, setBillableItemStatus] = useState();
  const [isChangeQty, setIsChangeQty] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  // const openModal = () => {
  //   if (errorMassage?.length > 0) {
  //     setShowErrorMsg(true);
  //   }
  // };
  useEffect(() => {
    if (errorMassage.length) {
      setShowErrorMsg(true);
    }
  }, [errorMassage]);

  const closeModal = () => {
    setShowErrorMsg(false);
    dispatch(seterrorMassage({ message: { errorMessages: [] } }));
    setBillableItemStatus(false);
  };
  const [bookingBillableItemsData, setBookingBillableItemsData] = useState({
    availableProducts: [],
    exclusiveProducts: [],
    specificProducts: [],
    bypassSalesRules: false,
  });
  const [changeBookingBillableItemsData, setChangeBookingBillableItemsData] =
    useState({
      availableProducts: [],
      exclusiveProducts: [],
      specificProducts: [],
      bypassSalesRules: false,
    });

  const countTotalQuantity = data => {
    return data?.reduce(
      (totalQty, category) =>
        totalQty +
        category?.data?.reduce(
          (categoryTotalQty, product) =>
            categoryTotalQty + Number(product?.qty),
          0,
        ),
      0,
    );
  };
  let checkZeroCondition =
    countTotalQuantity(bookingBillableItemsData?.availableProducts) +
    countTotalQuantity(bookingBillableItemsData?.exclusiveProducts) +
    countTotalQuantity(bookingBillableItemsData?.specificProducts);
  const titleBillableBooking = data => {
    return (
      <TableRow className="full_row ">
        <TableCell>
          <h4 className="text_primary">{data}</h4>
        </TableCell>
      </TableRow>
    );
  };
  let total;

  const totalSum = () => {
    let availableProductsSum = 0;
    bookingBillableItemsData?.availableProducts?.map(item =>
      item?.data?.map(
        element =>
          (availableProductsSum += Number(element?.gross_price * element?.qty)),
      ),
    );

    let exclusiveProductsSum = 0;
    bookingBillableItemsData?.exclusiveProducts?.map(item =>
      item?.data?.map(
        element =>
          (exclusiveProductsSum += Number(element?.gross_price * element?.qty)),
      ),
    );

    let specificProductsSum = 0;
    bookingBillableItemsData?.specificProducts?.map(item =>
      item?.data?.map(
        element =>
          (specificProductsSum += Number(element?.gross_price * element?.qty)),
      ),
    );

    total = availableProductsSum + exclusiveProductsSum + specificProductsSum;
    return total?.toFixed(2);
  };

  const [qtyData, setQtyData] = useState({});

  const updateQty = (itemId, newQty) => {
    // setQtyData(newQty);
    const updatedExclusiveProducts =
      bookingBillableItemsData.exclusiveProducts?.map(product => {
        const updatedExclData = product?.data?.map(item => {
          if (item._id === itemId) {
            return {
              ...item,
              qty: newQty,
            };
          }
          return item;
        });

        return {
          ...product,
          data: updatedExclData,
        };
      });
    const updatedAvailableProducts =
      bookingBillableItemsData.availableProducts?.map(product => {
        const updatedAvailData = product.data?.map(item => {
          if (item._id === itemId) {
            return {
              ...item,
              qty: newQty,
            };
          }
          return item;
        });

        return {
          ...product,
          data: updatedAvailData,
        };
      });

    const updatedSpecificProducts =
      bookingBillableItemsData.specificProducts?.map(product => {
        const updatedSpecData = product.data?.map(item => {
          if (item._id === itemId) {
            return {
              ...item,
              qty: newQty,
            };
          }
          return item;
        });

        return {
          ...product,
          data: updatedSpecData,
        };
      });
    setChangeBookingBillableItemsData(prevData => ({
      ...prevData,
      exclusiveProducts: updatedExclusiveProducts,
      availableProducts: updatedAvailableProducts,
      specificProducts: updatedSpecificProducts,
    }));
    setBookingBillableItemsData({
      ...bookingBillableItemsData,
      exclusiveProducts: updatedExclusiveProducts,
      availableProducts: updatedAvailableProducts,
      specificProducts: updatedSpecificProducts,
    });
    setIsChangeQty(true);
  };
  useEffect(() => {
    setBookingBillableItemsData({
      ...bookingBillableItemsData,
      availableProducts: bookingBillableItemsList?.available_products,
      exclusiveProducts: bookingBillableItemsList?.exclusive_products,
      specificProducts: bookingBillableItemsList?.specific_products,
    });
    setChangeBookingBillableItemsData({
      ...changeBookingBillableItemsData,
      availableProducts: bookingBillableItemsList?.available_products,
      exclusiveProducts: bookingBillableItemsList?.exclusive_products,
      specificProducts: bookingBillableItemsList?.specific_products,
    });
  }, [bookingBillableItemsList]);
  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingBillableItemsListData(bookingId));
    }
  }, [dispatch, bookingId]);
  useEffect(() => {
    bookingBillableItemsList?.is_qty === false
      ? setBillableItemStatus(false)
      : setBillableItemStatus(true);
  }, [bookingBillableItemsList?.is_qty]);

  const bodyBillableBooking = (item, categoryIndex, isSpecificProduct) => {
    return (
      <React.Fragment key={categoryIndex}>
        <TableRow className="full_row">
          <TableCell colSpan="8">
            {item?.category ? item?.category : '-'}
          </TableCell>
        </TableRow>

        {item?.data?.map((element, index) => {
          let styleCss = {
            textDecoration: element?.is_removed ? 'line-through' : 'none',
            backgroundColor: element?.is_removed ? '#ffdddd ' : 'white',
          };
          return (
            <TableRow key={index}>
              <TableCell style={styleCss}>{element?.bin_id}</TableCell>
              <TableCell style={styleCss}>
                <span className="contact_note_wrapper">
                  {element?.internal_name}
                </span>
              </TableCell>
              <TableCell style={styleCss}>
                <span className="contact_note_wrapper">
                  {element?.public_name}
                </span>
              </TableCell>
              <TableCell style={styleCss}>
                £
                {`${
                  element?.gross_price
                    ? element?.gross_price?.toFixed(2)
                    : `0.00`
                } inc ${element?.tax_code_sku} @ ${
                  element?.tax_code_percentage
                    ? element?.tax_code_percentage % 1 === 0
                      ? element?.tax_code_percentage
                      : element?.tax_code_percentage?.toFixed(2)
                    : ''
                }%`}
              </TableCell>
              <TableCell style={styleCss}>
                {isSpecificProduct ? (
                  <Link
                    to={`/admin/products/add-edit-products/${element._id}`}
                    className="btn_edit"
                  >
                    <img src={EditIcon} alt="Edit Icon" />
                  </Link>
                ) : element?.is_expire ? (
                  <Link
                    to={`/admin/products/add-edit-products/${element._id}`}
                    className="btn_edit"
                  >
                    <img src={EditIcon} alt="Edit Icon" />
                  </Link>
                ) : element?.expiry_date ? (
                  moment(element?.expiry_date).format('DD/MM/YYYY')
                ) : (
                  ''
                )}
              </TableCell>
              <TableCell style={styleCss}>
                {element?.price_rules?.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {item?.isValidRule && (
                        <div>
                          {item?.rule == optionsRule[5]?.id ? (
                            <li
                              data-toggle="tooltip"
                              data-placement="bottom"
                              title={item?.description}
                            >
                              THIS IS A VAT ADJUSTMENT AND DOES NOT AFFECT THE
                              GRAND TOTAL UNTIL THE BOOKING IS INVOICED.
                            </li>
                          ) : (
                            <li
                              data-toggle="tooltip"
                              data-placement="bottom"
                              title={item?.description}
                            >
                              {typeof item?.rule !== 'string'
                                ? optionsRule[item?.rule]?.value
                                : item?.rule}{' '}
                              of {optionsOfValue[item?.of_value]?.value}{' '}
                              {item?.of_value_sum}
                              {item?.round === 1 ? '(rounded down)' : ''}
                              {item?.round === 2 && ' (rounded to closest)'}
                              {!item?.round && ' (rounded up)'}
                              <br />
                              RECOMMENDED:{' '}
                              <Link
                                style={{
                                  padding: '2px',
                                  color: 'white',
                                  background: 'green',
                                }}
                                onClick={() =>
                                  updateQty(element?._id, item?.validQuantity)
                                }
                              >
                                {item?.validQuantity}
                              </Link>
                            </li>
                          )}
                        </div>
                      )}
                      {/* </li> */}
                    </React.Fragment>
                  );
                })}
              </TableCell>
              <TableCell style={styleCss}>
                <FormControl fullWidth className="main_input_wrap">
                  {/* {quantityStatus ? (
                    <TextField
                      type="number"
                      placeholder=""
                      className="form-control"
                      name="qty"
                      value={element?.qty}
                      onClick={() => {
                        setQuantityStatus(!quantityStatus);
                      }}
                      readOnly
                    />
                  ) : ( */}
                  <TextField
                    type="number"
                    placeholder=""
                    className="form-control"
                    name="qty"
                    value={element?.qty}
                    onKeyDown={e => {
                      numberRegexE(e);
                    }}
                    inputProps={{ min: 0, step: 'any' }}
                    onChange={e => {
                      setIsChangeQty(true);
                      setQtyData({
                        ...qtyData,
                        [element?._id]: e.target.value,
                      });
                      updateQty(element?._id, e.target.value, index);
                    }}
                    onFocus={e => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                        // setQtyData({ ...qtyData, [element?._id]: '' });
                        setQtyData({
                          ...qtyData,
                          [element?._id]: e.target.value,
                        });
                        updateQty(element?._id, ''); // Optionally, update your state accordingly
                      }
                    }}
                  />
                  {/* )} */}
                </FormControl>
              </TableCell>
              <TableCell style={styleCss}>
                {element?.qty > 0 ? (
                  <>
                    {element?.price_rules[0]?.rule === 0 && element?.qty ? (
                      element?.qty <= element?.price_rules[0]?.validQuantity ? (
                        <img src={CheckIcon} alt="Check Icon" />
                      ) : (
                        <img src={CrossIcon} alt="Cross Icon" />
                      )
                    ) : (
                      ''
                    )}
                    {element?.price_rules[0]?.rule === 1 ? (
                      element?.price_rules[0]?.validQuantity >= element?.qty ? (
                        <img src={CheckIcon} alt="Check Icon" />
                      ) : (
                        <img src={CrossIcon} alt="Cross Icon" />
                      )
                    ) : (
                      ''
                    )}
                    {element?.price_rules[0]?.rule === 3 ? (
                      element?.price_rules[0]?.validQuantity >= element?.qty ? (
                        <img src={CheckIcon} alt="Check Icon" />
                      ) : (
                        <img src={CrossIcon} alt="Cross Icon" />
                      )
                    ) : (
                      ''
                    )}
                  </>
                ) : (
                  ''
                )}
              </TableCell>
              <TableCell style={styleCss}>
                £
                {!isNaN(element?.gross_price) && !isNaN(element?.qty)
                  ? (element?.gross_price * element?.qty)?.toFixed(2)
                  : ''}
              </TableCell>
            </TableRow>
          );
        })}
      </React.Fragment>
    );
  };

  const currentBodyBillableBooking = (
    item,
    categoryIndex,
    titleCondition,
    title,
  ) => {
    return (
      <React.Fragment key={categoryIndex}>
        {item?.data.some(element => element?.qty > 0) && (
          <TableRow className="full_row" key={categoryIndex}>
            <TableCell colSpan="5">
              {item?.category ? item?.category : '-'}
            </TableCell>
          </TableRow>
        )}

        {item?.data?.map((element, index) => {
          let styleCss = {
            textDecoration: element?.is_removed ? 'line-through' : 'none',
            backgroundColor: element?.is_removed ? '#ffdddd ' : 'white',
          };
          return (
            element?.qty > 0 && (
              <>
                {/* {titleCondition?.length > 0 && titleBillableBooking(title)} */}

                <TableRow key={element?._id}>
                  <TableCell style={styleCss}>{element?.bin_id}</TableCell>
                  <TableCell style={styleCss}>
                    {element?.internal_name}
                  </TableCell>
                  <TableCell style={styleCss}>
                    £
                    {`${
                      element?.gross_price
                        ? element?.gross_price?.toFixed(2)
                        : '0.00'
                    } inc ${element?.tax_code_sku} @ ${
                      element?.tax_code_percentage
                        ? element?.tax_code_percentage % 1 === 0
                          ? element?.tax_code_percentage
                          : element?.tax_code_percentage?.toFixed(2)
                        : ''
                    }%`}
                  </TableCell>
                  <TableCell style={styleCss}>{element?.qty}</TableCell>
                  <TableCell style={styleCss}>
                    {(element?.gross_price * element?.qty)?.toFixed(2)}
                  </TableCell>
                </TableRow>
              </>
            )
          );
        })}
      </React.Fragment>
    );
  };
  const handleUpdate = async event => {
    let arrayAvailable = [];
    let arrayExclusive = [];
    let arraySpecific = [];

    changeBookingBillableItemsData?.availableProducts?.map(item =>
      item?.data?.map(element => {
        return arrayAvailable.push({
          product_id: element?._id,
          qty: Number(element?.qty),
        });
      }),
    );

    changeBookingBillableItemsData?.exclusiveProducts?.map(item =>
      item?.data?.map(element => {
        return arrayExclusive.push({
          product_id: element?._id,
          qty: Number(element?.qty),
        });
      }),
    );

    changeBookingBillableItemsData?.specificProducts?.map(item =>
      item?.data?.map(element => {
        return arraySpecific.push({
          product_id: element?._id,
          qty: Number(element?.qty),
        });
      }),
    );
    let billable_items = [
      ...arrayAvailable,
      ...arrayExclusive,
      ...arraySpecific,
    ];

    let payload = {
      billable_items: billable_items,
      bypass_sales_rules: changeBookingBillableItemsData?.bypassSalesRules,
    };
    if (event === 'update') {
      const { error } = await dispatch(
        updateBookingBillableItems({ bookingId: bookingId, booking: payload }),
      );
      // if (isBookingBillableItemsUpdated == false) {
      // await openModal();
      // }
      if (error?.message) return false;
      let totalSumCount =
        billable_items &&
        billable_items
          ?.map(i => i.qty)
          .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);

      totalSumCount === 0
        ? setBillableItemStatus(false)
        : setBillableItemStatus(true);
      if (isBookingBillableItemsUpdated) {
        navigate(`/edit-bookings/${bookingId}`);
      }
    } else {
      setBillableItemStatus(false);
    }
  };
  useEffect(() => {
    if (isBookingBillableItemsUpdated) {
      setBillableItemStatus(true);
    }
  }, [isBookingBillableItemsUpdated]);
  return (
    <div className="inner_wrapper">
      {bookingBillableItemsLoading && <Loader />}
      <div className="guest_list_wrap">
        <div className="breadcrumb_wrap">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">
              <img src={HomeBreadcrumbs} alt="Home Icon" />
            </Link>
            <Link to="/bookings">Bookings</Link>
            <Link to={`/edit-bookings/${bookingId}`}>Edit booking</Link>
            <Typography>Booking Billable Items</Typography>
          </Breadcrumbs>
        </div>
        <div className="page_title">
          <Row className="align-items-center">
            <Col xs={3}>
              <h1>Booking Billable Items</h1>
            </Col>
            <Col xs={9}>
              <div className="text-end">
                <Link
                  to={`/edit-bookings/${bookingId}`}
                  className="btn_border small"
                >
                  Back to Booking
                </Link>
              </div>
            </Col>
          </Row>
        </div>
        <div className="guest-list_top_wrap bg_white_box p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <p className="m-0">
              Places Confirmed
              <span className="btn_primary small mx-2">
                {bookingBillableItemsList?.confirmed_places}
              </span>
              Provisional Places
              <span className="btn_primary small mx-2">
                {bookingBillableItemsList?.provisional_places}
              </span>
            </p>
            {userPermissionDetail?.admin && (
              <Link
                to={`/edit-bookings/add-booking-product/${bookingId}`}
                className="btn_primary small"
              >
                Add Booking Specific Product
              </Link>
            )}
          </div>
        </div>
        <div className="guest_list_table">
          {!billableItemStatus ? (
            <div className="table_main_Wrapper guest_bottom_table  mb-3">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>BIN #</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Public Name</TableCell>
                      <TableCell>Price (Inc tax)</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Rules</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell></TableCell>
                      <TableCell>Line Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookingBillableItemsData?.availableProducts?.length > 0 &&
                      titleBillableBooking('Available Products')}
                    {bookingBillableItemsData?.availableProducts?.map(
                      (item, index) => {
                        return bodyBillableBooking(item, index, false);
                      },
                    )}
                    {bookingBillableItemsData?.exclusiveProducts?.length > 0 &&
                      titleBillableBooking('Exclusive Products')}
                    {bookingBillableItemsData?.exclusiveProducts?.map(
                      (item, index) => {
                        return bodyBillableBooking(item, index, false);
                      },
                    )}
                    {bookingBillableItemsData?.specificProducts?.length > 0 &&
                      titleBillableBooking('Specific Products')}
                    {bookingBillableItemsData?.specificProducts?.map(
                      (item, index) => {
                        return bodyBillableBooking(item, index, true);
                      },
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="full_row">
                      <TableCell colSpan="9" className="text-end">
                        <h3 className="m-0">Grand Total:</h3>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan="9" className="text-end">
                        <h4 className="m-0">£{totalSum()}</h4>
                      </TableCell>
                    </TableRow>
                    {userPermissionDetail?.admin && (
                      <TableRow className="full_row">
                        <TableCell colSpan="9" className="text-end">
                          <div className="form-group checkbox_wrap m-0">
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Bypass Sales Rules"
                                className="flex-row-reverse booking_billable_check_wrap m-0"
                                name="bypassSalesRules"
                                checked={
                                  changeBookingBillableItemsData?.bypassSalesRules ||
                                  false
                                }
                                onChange={e => {
                                  setChangeBookingBillableItemsData(
                                    prevData => ({
                                      ...prevData,
                                      bypassSalesRules: e.target.checked,
                                    }),
                                  );
                                }}
                              />
                            </FormGroup>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan="9" className="text-end">
                        {checkZeroCondition > 0 ? (
                          <button
                            type="button"
                            className="btn_primary small"
                            disabled={isChangeQty ? false : true}
                            onClick={() => {
                              handleUpdate('update');
                              // navigate(`/edit-bookings/${bookingId}`);
                            }}
                          >
                            Update Order
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isChangeQty ? false : true}
                            className="btn_primary small"
                            onClick={() => {
                              handleUpdate('update');
                              // openModal();
                            }}
                          >
                            Order Items
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow className="full_row">
                      <TableCell colSpan="9" className="text-end">
                        NOTE: this will create a new invoice
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div className="table_main_Wrapper guest_top_table  mb-3">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>BIN #</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Current Item Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Line Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookingBillableItemsData?.availableProducts?.length > 0 &&
                      titleBillableBooking('Available Products')}
                    {bookingBillableItemsData?.availableProducts?.map(
                      (item, index) => {
                        return currentBodyBillableBooking(
                          item,
                          index,
                          bookingBillableItemsData?.availableProducts,
                          '',
                        );
                      },
                    )}
                    {bookingBillableItemsData?.exclusiveProducts?.map(
                      (item, index) => {
                        return currentBodyBillableBooking(
                          item,
                          index,
                          bookingBillableItemsData?.exclusiveProducts,
                          'Exclusive Products',
                        );
                      },
                    )}
                    {bookingBillableItemsData?.specificProducts?.map(
                      (item, index) => {
                        return currentBodyBillableBooking(
                          item,
                          index,
                          bookingBillableItemsData?.specificProducts,
                          'Specific Products',
                        );
                      },
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="full_row">
                      <TableCell colSpan="5" className="text-end">
                        <h3 className="m-0">Total: £{totalSum()}</h3>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan="5" className="text-end">
                        <button
                          type="button"
                          className="btn_primary small"
                          onClick={() => {
                            handleUpdate();
                          }}
                        >
                          Change Order
                        </button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      </div>
      <Dialog
        aria-labelledby="CancelBooking-title"
        open={showErrorMsg}
        className="delete_popup max_500"
      >
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="delete_popup_wrap py-3">
              <div>
                {errorMassage?.map((items, index) => {
                  return <p key={index}>{items}</p>;
                })}
              </div>
              <ul className="d-flex align-items-center justify-content-center">
                <li>
                  <Button
                    className="btn_primary mx-2 px-3 py-1"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Ok
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
