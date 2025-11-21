import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import config from '../../backend.config.json';
import { useNavigate } from 'react-router-dom';

const Login = ({ showMsg }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      localStorage.setItem("email", email);
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
    />
  );
};

export default Login;
