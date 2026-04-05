import React from 'react';
import { FormGroup, Checkbox, FormControlLabel } from '@mui/material';

import { updateProducts } from 'store/reducers/Admin/Events/Parties/parties.slice';
import { zeroRoundTo } from '../../../../../utils/common';
import { useNavigate } from 'react-router-dom';

export const EventProducts = ({
  dispatch,
  productData,
  eventId,
  products,
  setProducts,
}) => {
  const navigate = useNavigate();
  const handleProductsChange = (e, parentIndex, childIndex) => {
    const updatedProducts = [...products];
    const selected = e.target.checked;
    const updatedGroupData = [...updatedProducts[parentIndex].group_data];

    updatedGroupData[childIndex] = {
      ...updatedGroupData[childIndex],
      is_selected: selected,
    };

    updatedProducts[parentIndex] = {
      ...updatedProducts[parentIndex],
      group_data: updatedGroupData,
    };

    setProducts(updatedProducts);
  };

  const selectedIds = products
    .flatMap(category => category.group_data)
    .filter(item => item.is_selected)
    .map(item => item._id);

  return (
    <div className="event_product_wrap">
      <div className="card_wrapper mb-4">
        <div className="card_header py-2 px-3">
          <h4 className="m-0 py-1 text_white">Event Products</h4>
        </div>
        <div className="card_body admin_card_body">
          <div className="event_product_inner bg_gray_box p-2">
            {productData?.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <h6 className="fw_500">
                    {!!item?.product_category ? item?.product_category : '-'}
                  </h6>
                  <ul>
                    {item?.group_data?.map((element, i) => {
                      return (
                        <li key={element._id}>
                          <div className="form-group inline checkbox_wrap mb-0">
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                label={
                                  !!element?.internal_name
                                    ? element?.internal_name
                                    : '-'
                                }
                                checked={
                                  !!products[index]?.group_data[i]?.is_selected
                                    ? products[index]?.group_data[i]
                                        ?.is_selected
                                    : false
                                }
                                onChange={e =>
                                  handleProductsChange(e, index, i)
                                }
                              />
                            </FormGroup>
                          </div>
                          <span className="fw_400 text_small">
                            <span className="fw_500">
                              £
                              {!!element?.gross_price
                                ? element?.gross_price
                                : '00'}
                            </span>{' '}
                            £
                            {!!element?.excl_tax_value
                              ? zeroRoundTo(element?.excl_tax_value)
                              : '00'}{' '}
                            excl tax @
                            {!!element?.tax_rate ? element?.tax_rate : '00'}%
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </React.Fragment>
              );
            })}{' '}
          </div>
          <div className="card_footer admin_card_footer mb-2">
            <button
              type="submit"
              onClick={() => {
                if (eventId) {
                  dispatch(
                    updateProducts({
                      _id: eventId,
                      products: selectedIds,
                    }),
                  );
                } else navigate('/admin/events/parties');
              }}
              className="btn_primary small"
            >
              Update Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
