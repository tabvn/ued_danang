import React from "react";
import PropTypes from "prop-types";
import { Alert } from "antd";

const ErrorMessage = ({ error }) => {
  return (
    <div className={"error-container"}>
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <Alert message={message} banner closable />
        ))}
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};

export default ErrorMessage;
