import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import config from '../../backend.config.json';

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showMsg = (msg, severity = 'info') => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const onClose = () => setSnackbarOpen(false);

  const handleRegister = async () => {
    if (!email || !name || !password || !confirm) {
      showMsg("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      showMsg("Passwords do not match", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:${config.BACKEND_PORT}/user/auth/register`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || "Registration failed", "error");
        return;
      }

      localStorage.setItem("token", data.token);

      showMsg("Registration successful!", "success");
      setTimeout(() => navigate("/"), 1000);

    } catch {
      showMsg("Network error", "error");
    }
  };

  return (
    <AuthForm
      title="Register"
      onSubmit={handleRegister}

      fields={[
        { label: "Email", value: email, onChange: setEmail },
        { label: "Name", value: name, onChange: setName },
        { label: "Password", type: "password", value: password, onChange: setPassword },
        { label: "Confirm Password", type: "password", value: confirm, onChange: setConfirm },
      ]}

      snackbarOpen={snackbarOpen}
      snackbarMsg={snackbarMsg}
      snackbarSeverity={snackbarSeverity}
      snackbarOnClose={onClose}
    />
  );
};

export default Register;
