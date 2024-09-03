import React, { useContext } from 'react';
import { ThemeContext } from '../../ThemeContext.js';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button.jsx';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <Button onClick={toggleTheme} variant="outline" size="icon">
      {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
};

export default ThemeToggle;