import { useState, useEffect, memo, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormControl, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { Button } from 'react-bootstrap';
import {
  getTotalGuest,
  updateEnquiries,
} from 'store/reducers/Enquiry/enquiries.slice';
import { useDispatch, useSelector } from 'react-redux';
import { numberRegexE } from 'utils/common';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';

export const InputField = memo(({ name, value, handleChange, label }) => {
  return (
    <li>
      <div className="d-flex align-items-center">
        <FormControl>
          <TextField
            type="number"
            variant="outlined"
            className="custom-input"
            name={name}
            onKeyDown={e => numberRegexE(e)}
            inputProps={{ min: 0, step: 'any' }}
            value={value}
            onChange={e => handleChange(name, e.target.value)}
            onBlur={e => {
              if (!e.target.value.trim()) handleChange(name, 0);
            }}
          />
        </FormControl>
        <span className="ms-1">{label}</span>
      </div>
    </li>
  );
});

const SpecialRequirement = () => {
  const { enquirieDetail, guestCount } = useSelector(
    ({ enquiries }) => enquiries,
  );
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEnable, setIsEnable] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [contentText, setContentText] = useState('');
  const [requirementData, setRequirementData] = useState({
    dairy_free: '',
    gluten_free: '',
    halal: '',
    nut_allergy: '',
    vegan: '',
    vegetarian: '',
    wheelchair_user: '',
  });

  useEffect(() => {
    if (Object.keys(enquirieDetail).length > 0) {
      if (enquirieDetail?.special_requirements) {
        setRequirementData({
          dairy_free: enquirieDetail?.special_requirements?.dairy_free,
          gluten_free: enquirieDetail?.special_requirements?.gluten_free,
          halal: enquirieDetail?.special_requirements?.halal,
          nut_allergy: enquirieDetail?.special_requirements?.nut_allergy,
          vegan: enquirieDetail?.special_requirements?.vegan,
          vegetarian: enquirieDetail?.special_requirements?.vegetarian,
          wheelchair_user:
            enquirieDetail?.special_requirements?.wheelchair_user,
        });
      }
    }
  }, [enquirieDetail]);

  useEffect(() => {
    dispatch(getTotalGuest(bookingId));
  }, []);

  const handleChange = (key, value) => {
    setRequirementData({
      ...requirementData,
      [key]: parseInt(value),
    });
  };

  const openDialoguePopUp = item => {
    setContentText(item);
    setOpenPopUp(true);
  };

  const closePopUp = () => setOpenPopUp(false);

  const handleConfirm = () => {
    setIsEnable(!isEnable);
    dispatch(
      updateEnquiries({
        _id: enquirieDetail?._id,
        is_guest_system: !enquirieDetail?.is_guest_system,
      }),
    );
    setOpenPopUp(false);
  };

  const renderDisableContent = useMemo(() => {
    if (enquirieDetail?.is_guest_system) {
      return (
        <p className="m-0">
          This booking currently has{' '}
          <span className="text_primary">{guestCount}</span> guests added - to
          disable the guest list for this booking
          <span
            to=""
            className="text_decoration ms-1"
            onClick={() => openDialoguePopUp('disable')}
          >
            click here
          </span>
        </p>
      );
    } else {
      return (
        <p>
          This booking currently has the guest system disabled - to re-enable
          the guest list for this booking
          <span
            to=""
            className="text_decoration ms-1"
            onClick={() => openDialoguePopUp()}
          >
            click here
          </span>
        </p>
      );
    }
  }, [enquirieDetail?.is_guest_system]);

  return (
    <>
      <div className="special_requirement">
        <div className="card_wrapper mb-4">
          <div className="card_header d-flex align-items-center justify-content-between py-2 px-3">
            <h4 className="m-0 py-1 text_white">Special Requirements</h4>
          </div>
          <div className="card_body">
            <ul>
              <li className="align-items-center">
                <label className="fw_500">Special Requirements:</label>
                <div className="right_content">
                  {enquirieDetail?.is_guest_system && (
                    <p>
                      This booking uses the Guest List system - please{' '}
                      <span
                        className="text_decoration"
                        onClick={() => {
                          navigate(
                            `/edit-bookings/guest-list/${enquirieDetail?._id}`,
                            {
                              state: {
                                confirmed_places:
                                  enquirieDetail?.booking_info
                                    ?.confirmed_places,
                                provisional_places:
                                  enquirieDetail?.booking_info
                                    ?.provisional_places,
                              },
                            },
                          );
                        }}
                      >
                        click here to update guests
                      </span>
                    </p>
                  )}

                  {!enquirieDetail?.is_guest_system && (
                    <>
                      <div className="d-flex align-items-center mb-3">
                        <p className="m-0">
                          {`Please enter total numbers against each requirements
                          type - other values will be converted to ${guestCount}`}
                        </p>
                        <Button
                          className="btn_border small mx-2"
                          onClick={() => {
                            dispatch(
                              updateEnquiries({
                                _id: enquirieDetail?._id,
                                special_requirements: requirementData,
                              }),
                            );
                          }}
                        >
                          Update
                        </Button>
                      </div>
                      <div className="special_requirment_list_wrap">
                        <ul>
                          <InputField
                            name="dairy_free"
                            value={requirementData.dairy_free}
                            label={'Dairy Free'}
                            handleChange={handleChange}
                          />
                          <InputField
                            name="gluten_free"
                            value={requirementData.gluten_free}
                            label={'Gluten Free'}
                            handleChange={handleChange}
                          />
                          <InputField
                            name="halal"
                            value={requirementData.halal}
                            label={'Halal'}
                            handleChange={handleChange}
                          />
                          <InputField
                            name="nut_allergy"
                            value={requirementData.nut_allergy}
                            label={'Nut Allergy'}
                            handleChange={handleChange}
                          />
                          <InputField
                            name="vegan"
                            value={requirementData.vegan}
                            label={'Vegan'}
                            handleChange={handleChange}
                          />
                          <InputField
                            name="vegetarian"
                            value={requirementData.vegetarian}
                            label={'Vegetarian'}
                            handleChange={handleChange}
                          />
                          <InputField
                            name="wheelchair_user"
                            value={requirementData.wheelchair_user}
                            label={'Wheelchair User'}
                            handleChange={handleChange}
                          />
                        </ul>
                      </div>
                    </>
                  )}
                  {renderDisableContent}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <BootstrapDialog
        aria-labelledby="CancelBooking-title"
        open={openPopUp}
        className="delete_popup"
      >
        <BootstrapDialogTitle
          id="CancelBooking-title"
          onClose={closePopUp}
        ></BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="delete_popup_wrap">
              <h2 className="mb-3">
                {contentText === 'disable' ? 'Disable' : 'Enable'} Guest System
              </h2>
              <p>
                Are you sure you want to {contentText ?? 'enable'} the guest
                system?
              </p>
              <ul className="d-flex align-items-center justify-content-center">
                <li>
                  <Button className="btn_border mx-2" onClick={closePopUp}>
                    Cancel
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn_primary mx-2"
                    onClick={() => {
                      handleConfirm();
                    }}
                  >
                    Ok
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default memo(SpecialRequirement);
