import React from 'react';
import ReactDOM from 'react-dom';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | string;
  size?: 'xs' | 'sm' | 'lg' | '' | string;
  disabled?: boolean;
  style?: object;
}

const Button: React.FunctionComponent<ButtonProps> = ({ children, color = 'primary', size = '', disabled = false, onClick, style = {} }) => {
  return (
    <button
      className={`btn btn-${color} ${size ? 'size-' + size : ''}`}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
};

export default Button;

const parent = document.getElementById('react-button')
  if (parent) {
  const color = parent.getAttribute('color') || '';
  const text = parent.getAttribute('text');
  const size = parent.getAttribute('size')|| '';
  ReactDOM.render(<Button color={color} children={<>{text}</>} size={size} />, parent);
  }
