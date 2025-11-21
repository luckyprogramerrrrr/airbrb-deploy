import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import config from '../../backend.config.json';

const Register = ({ showMsg }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

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
      localStorage.setItem("email", email);
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
    />
  );
};

export default Register;
