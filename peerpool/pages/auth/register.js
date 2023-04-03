import { useState } from 'react';
import style from "../../styles/register.module.css";
import Link from 'next/link';


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
    alert('Registration Successful');
  };

  return (
    <div>
      <form className={style.form} onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Register</button>
      </form>
      <div>
        <p>New member?<span>
        <Link className={style.button} href="/auth/login">login</Link></span></p>
      </div>
    </div>
  );
}
