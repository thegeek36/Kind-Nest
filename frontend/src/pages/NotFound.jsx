import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <p className="text-lg text-gray-600 mt-4">Oops! The page you’re looking for doesn’t exist.</p>
        <Link
          to="/"
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
