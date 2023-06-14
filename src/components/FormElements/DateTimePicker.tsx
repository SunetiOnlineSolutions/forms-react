import React from 'react';

export type DateTimeType = 'date' | 'time' | 'datetime';

interface DateTimePickerProps {
  label?: string;
  type?: DateTimeType;
  value?: string;
  onChange: (value: string) => void;
  isValid?: boolean;
  validationMessage?: string;
  forceShowInvalid?: boolean;
}

const DateTimePicker: React.FunctionComponent<DateTimePickerProps> = ({ label, value = '', type = 'date', onChange, isValid = true, validationMessage = '', forceShowInvalid = false }) => {

  const [hasBlurred, setHasBlurred] = React.useState(false);
  const shouldShowInvalid = !isValid && (hasBlurred || forceShowInvalid);

  let inputType: 'date' | 'time' | 'datetime-local';

  if (type === 'datetime') {
    inputType = 'datetime-local';
  } else {
    inputType = type;
  }

  return <>
    <div className="form-group">
      {label && <label>{label}</label>}
      <input
        type={inputType}
        className={"form-control" + (shouldShowInvalid ? ' is-invalid' : '')}
        picker-type="date"
        value={value ?? ''}
        onChange={event => onChange(event.target.value)}
        onBlur={() => setHasBlurred(true)}
      />
      {shouldShowInvalid && <div className="invalid-feedback ml-1">{validationMessage}</div>}
    </div>
  </>;
};

export default DateTimePicker;
