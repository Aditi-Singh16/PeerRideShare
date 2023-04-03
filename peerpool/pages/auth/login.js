import { useState } from 'react';
import style from "../../styles/login.module.css"
import Link from 'next/link';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');
    if (email === storedEmail && password === storedPassword) {
      alert('Login Successful');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
