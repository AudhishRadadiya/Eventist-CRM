import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Routes from 'routes/index';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<Loader />}> */}
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>
      <Routes />
      {/* </Suspense> */}
    </BrowserRouter>
  );
}
