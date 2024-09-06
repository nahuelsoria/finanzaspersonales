import React, { useState, useContext } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ThemeContext } from "../ThemeContext.js";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validatePassword = (password) => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!PASSWORD_REGEX.test(password)) {
    return "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.";
  }
  return null;
};

const PasswordRequirements = () => (
  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
    <p>La contraseña debe:</p>
    <ul className="list-disc list-inside">
      <li>Tener al menos 8 caracteres</li>
      <li>Incluir al menos una letra mayúscula</li>
      <li>Incluir al menos una letra minúscula</li>
      <li>Incluir al menos un número</li>
      <li>Incluir al menos un carácter especial (@$!%*?&)</li>
    </ul>
  </div>
);

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const { isDarkMode } = useContext(ThemeContext);

  const handleAuth = async () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      console.error("Error de validación:", passwordError);
      // Aquí puedes mostrar el error al usuario, por ejemplo:
      // setError(passwordError);
      return;
    }
  
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      // Aquí puedes manejar los errores específicos de Firebase
    }
  };

  return (
    <motion.div
    className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
    initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`w-full max-w-md shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
      <CardHeader>
      <CardTitle className={`text-2xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
      {isRegistering ? "Registrar" : "Iniciar Sesión"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            {isRegistering && <PasswordRequirements />}
            <Button
              onClick={handleAuth}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
            >
              {isRegistering ? "Registrar" : "Iniciar Sesión"}
            </Button>
            <Button
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md shadow-md hover:bg-gray-300 transition duration-300"
            >
              {isRegistering
                ? "¿Ya tienes cuenta? Inicia Sesión"
                : "¿No tienes cuenta? Regístrate"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Auth;