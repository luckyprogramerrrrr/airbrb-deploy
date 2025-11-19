import { Box, Button, Typography } from '@mui/material';
import FormTextField from './FormTextField';
import Msgsnackbar from './Msgsnackbar';
import { Link } from 'react-router-dom';

const AuthForm = ({
  title,
  fields = [],
  onSubmit,

  snackbarOpen,
  snackbarMsg,
  snackbarSeverity,
  snackbarOnClose,
}) => {

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >

      <Typography variant="h5">{title}</Typography>

      {fields.map((field, index) => (
        <FormTextField
          key={index}
          label={field.label}
          type={field.type}
          value={field.value}
          onChange={field.onChange}
          onEnter={onSubmit}
        />
      ))}

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button fullWidth variant="contained" onClick={onSubmit}>
          {title}
        </Button>

        <Button fullWidth variant="outlined" component={Link} to="/">
          Cancel
        </Button>
      </Box>

      {/* Snackbar */}
      <Msgsnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        severity={snackbarSeverity}
        onClose={snackbarOnClose}
      />
    </Box>
  );
};

export default AuthForm;
