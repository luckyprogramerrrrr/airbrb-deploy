import { Snackbar, Alert } from '@mui/material';

const Msgsnackbar = ({ open, message, severity = "info", onClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
    >
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Msgsnackbar;
