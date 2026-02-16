import React from 'react';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return <p className="mt-4 text-red-400">{error}</p>;
};

export default ErrorMessage;

