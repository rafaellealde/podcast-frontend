import React from 'react';
import './StyledButton.css';

interface StyledButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

const StyledButton: React.FC<StyledButtonProps> = ({ onClick, text = "Button", className }) => {
  return (
    <button className={`styled-button ${className || ''}`} onClick={onClick}>
      <span className="text">{text}</span>
      <span>{text}</span>
    </button>
  );
};

export default StyledButton;
