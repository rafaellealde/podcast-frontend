import React from 'react';
import './StyledButton.css';

interface StyledButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
  disabled?: boolean; // Adicione esta linha
}

const StyledButton: React.FC<StyledButtonProps> = ({ 
  onClick, 
  text = "Button", 
  className,
  disabled = false // Valor padrão
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button 
      className={`styled-button ${className || ''} ${disabled ? 'disabled' : ''}`} 
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="text">{text}</span>
      <span>{text}</span>
    </button>
  );
};

export default StyledButton;