import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const ErrorMessage = ({ isShown, close }) => (
  <Snackbar
    open={isShown}
    onClose={close}
    message={
      <span id="message-id">
        An error occured. Try refreshing or continuing later.
      </span>
    }
    action={
      close && (
        <IconButton color="inherit" onClick={close}>
          <CloseIcon />
        </IconButton>
      )
    }
  />
);

ErrorMessage.propTypes = {
  isShown: PropTypes.bool.isRequired,
  close: PropTypes.func,
};

export default ErrorMessage;
