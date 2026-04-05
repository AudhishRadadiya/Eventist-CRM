import * as React from 'react';
import ReactDOM from 'react-dom/client';
import 'sanitize.css/sanitize.css';
import { App } from 'app';
import { HelmetProvider } from 'react-helmet-async';
import Toast from 'Components/ToastNotification/index';
import './locales/i18n';
// import './Assets/css/Style.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Assets/scss/Style.scss';
import { configureAppStore } from 'store/configureStore';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
// import './Assets/scss/Home/Home.scss';

const store = configureAppStore();
const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  typography: {
    fontFamily: ['Figtree'].join(','),
    htmlFontSize: 22,
  },
});

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <Toast />
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </Provider>,
);
