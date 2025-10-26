import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockCompanyId = 'demo-company-123';
    onLogin(mockCompanyId);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">WiseTraining</h1>
        <p className="login-subtitle">Plataforma de Treinamentos Empresariais</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="empresa@exemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>

        <p className="register-link">
          Não tem conta? <a href="#register">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
