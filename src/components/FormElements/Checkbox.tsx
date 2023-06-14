import React from 'react';

interface CheckBoxProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  isValid?: boolean;
  validationMessage?: string;
  forceShowInvalid?: boolean;
}

const Checkbox: React.FunctionComponent<CheckBoxProps> = ({ label, checked, onChange, isValid = true, validationMessage = '', forceShowInvalid = false }) => {
  const [hasBlurred, setHasBlurred] = React.useState<boolean>(false);
  const shouldShowInvalid = !isValid && (hasBlurred || forceShowInvalid);

  const handleOnChange = () => {
    onChange(!checked);

    setHasBlurred(true);
  };

  return (
    <div className={"checkbox checkbox-css no-select" + (shouldShowInvalid ? ' is-invalid' : '')} onClick={handleOnChange}>
      <input type="checkbox" checked={checked} readOnly />
      <label>{label}</label>
      {shouldShowInvalid && validationMessage && <div className="invalid-feedback d-block">{validationMessage}</div>}
    </div>
  );
}

export default Checkbox;
