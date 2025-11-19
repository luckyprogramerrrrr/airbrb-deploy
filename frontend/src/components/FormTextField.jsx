import { TextField } from '@mui/material';

const FormTextField = ({ label, type = "text", value, onChange, onEnter }) => {
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEnter();
      }}
    />
  );
};

export default FormTextField;
