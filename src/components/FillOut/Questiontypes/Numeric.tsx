import React from 'react';
import { useEffectOnce, useQuestion, useUnsavedAnswer } from '../../../hooks';

const Numeric: React.FunctionComponent = () => {
  const question = useQuestion();
  const [value, setValue, isValid, validationMessage, registerCallback] = useUnsavedAnswer<number>(question.id);
  const [showInvalid, setShowInvalid] = React.useState(false);

  useEffectOnce(() => registerCallback(() => setShowInvalid(true)));

  return <>
    <div className="row">
      <div className="col-md-12">
        <input type="number" className={"form-control" + (showInvalid && !isValid ? ' is-invalid' : '')} value={value} onChange={event => setValue(parseInt(event.target.value, 10))} />
        {showInvalid && <div className="invalid-feedback d-block ml-1">{validationMessage}</div>}
      </div>
    </div>
  </>;
}

export default Numeric;
