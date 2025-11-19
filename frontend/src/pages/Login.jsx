import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import config from '../../backend.config.json';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showMsg = (msg, severity = 'info') => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const onClose = () => setSnackbarOpen(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showMsg("Please fill in both fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:${config.BACKEND_PORT}/user/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || "Login failed", "error");
        return;
      }

      showMsg("Login successful!", "success");
      localStorage.setItem("token", data.token);
      setTimeout(() => navigate("/"), 1000);

    } catch {
      showMsg("Network error", "error");
    }
  };

  return (
    <AuthForm
      title="Login"
      fields={[
        { label: "Email", value: email, onChange: setEmail },
        { label: "Password", type: "password", value: password, onChange: setPassword }
      ]}
      onSubmit={handleLogin}


      snackbarOpen={snackbarOpen}
      snackbarMsg={snackbarMsg}
      snackbarSeverity={snackbarSeverity}
      snackbarOnClose={onClose}
    />
  );
};

export default Login;
