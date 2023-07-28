import React from 'react';
import { Without } from '../../helpers';
import ReactDOM from 'react-dom';

interface TextFieldProps {
  label?: React.ReactNode;
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  isValid?: boolean;
  validationMessage?: string;
  forceShowInvalid?: boolean;
  inputprops?: Without<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'placeholder' | 'value' | 'readOnly' | 'onChange' | 'className' | 'onBlur'>;
}

const HorizontalTextField: React.FunctionComponent<TextFieldProps> = ({ label, value, onChange, readOnly = false, placeholder, isValid = true, validationMessage = '', forceShowInvalid = false, inputprops }) => {

  const [hasBlurred, setHasBlurred] = React.useState<boolean>(false);
  const shouldShowInvalid = !isValid && (hasBlurred || forceShowInvalid);

  return <>
    <div className="d-flex align-items-end">
      {label && <label style={{ paddingRight: '0.5rem' }}>{label}</label>}
      <input
        type="text"
        style={{width: '14rem'}}
        className={"form-control" + (shouldShowInvalid ? ' is-invalid' : '')}
        placeholder={placeholder}
        value={value ?? ''}
        readOnly={readOnly}
        onChange={event => onChange(event.target.value)}
        onBlur={() => setHasBlurred(true)}
        {...inputprops}
      />
      {shouldShowInvalid && <div className="invalid-feedback ml-1">{validationMessage}</div>}
    </div>
  </>;
};

export default HorizontalTextField;

const parent = document.getElementById('react-textfield')
  if (parent) {
  ReactDOM.render(<HorizontalTextField onChange={() => {}} />, parent);
  }

