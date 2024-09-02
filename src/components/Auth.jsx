import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
    }
  };

  return (
    <div>
      <h2>{isRegistering ? 'Registrar' : 'Iniciar Sesión'}</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button onClick={handleAuth}>
        {isRegistering ? 'Registrar' : 'Iniciar Sesión'}
      </button>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
};

export default Auth;