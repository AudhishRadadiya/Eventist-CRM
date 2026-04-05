import React, { useEffect, useState } from 'react';
import Logo from '../../Assets/Img/logo-full.svg';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { Button } from 'react-bootstrap';
import { Formik, Form, ErrorMessage } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction, setLoginLoading } from 'store/reducers/User/auth.slice';
import Spinner from 'react-bootstrap/Spinner';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginLoading, isUserLogin } = useSelector(({ auth }) => auth);
  const initialValues = {
    email: '',
    password: '',
    isRemember: false,
  };

  useEffect(() => {
    if (isUserLogin) {
      navigate(
        location?.state?.prevRoute?.pathname
          ? location.state.prevRoute.pathname + location.state.prevRoute.search
          : '/',
        { replace: true, state: location.state?.prevRoute?.state },
      );
      dispatch(setLoginLoading(false));
    }
  }, [isUserLogin]);

  return (
    <div className="login_wrapper">
      <div className="login_inner">
        <div className="logo_wrap mb-4">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="login_box">
          <h1 className="mb-3">Login to account</h1>
          <p>Enter your credentials to access your account</p>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validate={values => {
              const errors = {};
              if (!values.email) {
                errors.email = 'Username is a required field';
              } else if (values.email.length < 2) {
                errors.email = 'Email must be at least 2 character';
              }
              if (!values.password) {
                errors.password = 'Password is a required field';
              } else if (values.password?.length < 1) {
                errors.password = 'Password must be at least 5 character';
              }
              return errors;
            }}
            onSubmit={async (values, { resetForm }) => {
              const obj = {
                username: values.email,
                password: values.password,
                keep_login: values.isRemember,
              };
              dispatch(loginAction(obj));
            }}
          >
            {({ handleSubmit, handleChange, setFieldValue, values }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="Username">Username</label>
                  <TextField
                    type="text"
                    id="Username"
                    variant="outlined"
                    placeholder="Enter your username"
                    value={values.email}
                    onChange={e => {
                      handleChange('email')(e.target.value);
                    }}
                  />
                  <span className="text_primary">
                    <ErrorMessage name="email" />
                  </span>
                </div>
                <div className="form-group">
                  <label htmlFor="Password">Password</label>
                  <TextField
                    type="password"
                    id="Password"
                    variant="outlined"
                    placeholder="Enter password"
                    value={values.password}
                    onChange={e => {
                      handleChange('password')(e.target.value);
                    }}
                  />
                  <span className="text_primary">
                    <ErrorMessage name="password" />
                  </span>
                </div>
                <div className="form-group">
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Keep me logged in*"
                      checked={values.isRemember}
                      onChange={e =>
                        setFieldValue('isRemember', e.target.checked)
                      }
                    />
                  </FormGroup>
                </div>
                <div className="note_wrap">
                  <p>
                    * By selecting "keep me logged in" the site will NOT
                    automatically log you out after 60 minutes of inactivity.
                  </p>
                  <h6>
                    Do not use this if other people have access to your
                    computer.
                  </h6>
                </div>
                <Button type="submit" className="btn_primary w-100">
                  Login
                  {loginLoading && <Spinner className="ms-2" size="sm" />}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
