import React from 'react';
import { useEffectOnce, useQuestion, useUnsavedAnswer } from '../../../hooks';
import NumericField from '../../FormElements/NumericField';

const Numeric: React.FunctionComponent = () => {
  const question = useQuestion();
  const [value, setValue, isValid, validationMessage, registerCallback] = useUnsavedAnswer<string>(question.id);

  const [forceShowInvalid, setForceShowInvalid] = React.useState(false);

  useEffectOnce(() => registerCallback(() => setForceShowInvalid(true)));

  return <>
    <div className="row">
      <div className="col-md-12">
        <NumericField
          placeholder="Enter a number"
          value={value}
          onChange={setValue}
          isValid={isValid}
          validationMessage={validationMessage}
          forceShowInvalid={forceShowInvalid}
        />
      </div>
    </div>
  </>;
}

export default Numeric;
