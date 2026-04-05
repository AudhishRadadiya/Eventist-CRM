import { Button, Col, Row } from 'react-bootstrap';
import {
  FormGroup,
  TextField,
  FormControl,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { getContactListData } from 'store/reducers/Contact/contact.slice';
import Loader from 'Components/Common/Loader';
import useSortable from 'utils/useSortable';
import { updateBookingTransfer } from 'store/reducers/Booking/booking.slice';
import { getEnquiriesData } from 'store/reducers/Enquiry/enquiries.slice';
import { filterChangedFormFields } from 'utils/common';
import BootstrapDialogTitle, {
  BootstrapDialog,
} from 'Components/Common/BootstrapPopup/BootstrapPopup';

const SearchField = ({ label, value, onChange }) => (
  <div className="bg_gray_box px-3 py-2 mb-2">
    <Row className="g-2 align-items-center">
      <Col>
        <label className="text_small">{label}</label>
      </Col>
      <Col>
        <div className="search_with_icon">
          <FormGroup className="input_wrap">
            <FormControl fullWidth className="small_select">
              <TextField
                type="text"
                variant="outlined"
                className="input_wrap"
                placeholder="Results display as you type"
                value={value}
                onChange={onChange}
              />
            </FormControl>
          </FormGroup>
        </div>
      </Col>
    </Row>
  </div>
);

export default function TransferBookingToContact({
  transferBookingPopup,
  setTransferBookingPopup,
}) {
  const dispatch = useDispatch();
  const { activeContactList, contactListLoading } = useSelector(
    ({ contact }) => contact,
  );
  const { enquirieDetail } = useSelector(({ enquiries }) => enquiries);
  const { bookingId } = useParams();
  const groupData = activeContactList?.map(i => i?.group_data);
  const removeGroupData = groupData?.flat();

  const [searchQueries, setSearchQueries] = useState({
    businessOrPartyName: '',
    contactName: '',
    contactEmail: '',
    accountPostCode: '',
  });
  useEffect(() => {
    if (transferBookingPopup) dispatch(getContactListData());
  }, [transferBookingPopup]);

  const handleSearch = useCallback(() => {
    const payload = filterChangedFormFields({
      company_name: searchQueries.businessOrPartyName.trim(),
      contact_name: searchQueries.contactName.trim(),
      email_primary: searchQueries.contactEmail.trim(),
      post_code: searchQueries.accountPostCode.trim(),
    });
    dispatch(getContactListData(payload));
  }, [searchQueries]);

  const { itemsActive, requestSortActive } = useSortable(removeGroupData);

  return (
    <>
      <BootstrapDialog
        aria-labelledby="customized-dialog2-title"
        open={transferBookingPopup}
        className="medium_popup"
      >
        <BootstrapDialogTitle
          id="customized-dialog2-title"
          onClose={() => setTransferBookingPopup(false)}
        >
          {contactListLoading && <Loader />}
          Transfer Booking to Contact :
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="popup_content_wrap">
            <div className="add_new_wrap mb-3">
              <Link to="/contact/add-contact" className="btn_primary small">
                Add New Contact
              </Link>
            </div>
            <div className="contact_filter_wrap mb-3">
              {' '}
              <Row>
                <Col>
                  <SearchField
                    label="Account Name / Handle"
                    value={searchQueries.businessOrPartyName}
                    onChange={e =>
                      setSearchQueries({
                        ...searchQueries,
                        businessOrPartyName: e.target.value,
                      })
                    }
                  />
                  <SearchField
                    label="Contact Email"
                    value={searchQueries.contactEmail}
                    onChange={e =>
                      setSearchQueries({
                        ...searchQueries,
                        contactEmail: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col>
                  <SearchField
                    label="Contact Name"
                    value={searchQueries.contactName}
                    onChange={e =>
                      setSearchQueries({
                        ...searchQueries,
                        contactName: e.target.value,
                      })
                    }
                  />
                  <SearchField
                    label="Account Postcode"
                    value={searchQueries.accountPostCode}
                    onChange={e =>
                      setSearchQueries({
                        ...searchQueries,
                        accountPostCode: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
              <div className="text-end">
                <Button
                  className="btn_primary small ms-3"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
            <div className="table_main_Wrapper popup_custom_table">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <span onClick={() => requestSortActive('first_name')}>
                          Name
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          onClick={() => requestSortActive('email_primary')}
                        >
                          Email
                        </span>
                      </TableCell>
                      <TableCell>
                        <span onClick={() => requestSortActive('company_name')}>
                          Company Name
                        </span>
                      </TableCell>
                      <TableCell>Transfer</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemsActive?.map(transfer => {
                      return (
                        <TableRow>
                          <TableCell>
                            <Link
                              to={`/contact/edit-contact/${transfer._id}`}
                              className="text_decoration"
                            >
                              {transfer?.first_name + ' ' + transfer?.surname}
                            </Link>
                          </TableCell>
                          <TableCell>{transfer?.email_primary}</TableCell>
                          <TableCell>
                            <p className="w_200">{transfer?.company_name}</p>
                          </TableCell>
                          <TableCell>
                            <Button
                              className="btn_border small"
                              onClick={async () => {
                                await dispatch(
                                  updateBookingTransfer({
                                    _id: enquirieDetail?._id,
                                    bookingTransfer: {
                                      contact_id: transfer?._id,
                                    },
                                  }),
                                );
                                await dispatch(getEnquiriesData(bookingId));
                                setTransferBookingPopup(false);
                              }}
                            >
                              Transfer
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
