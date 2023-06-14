import React from 'react';
import { useEffectOnce, useQuestion, useUnsavedAnswer } from '../../../hooks';
import TextField from '../../FormElements/TextField';

const FreeText: React.FunctionComponent = () => {
  const question = useQuestion();
  const [value, setValue, isValid, validationMessage, registerCallback] = useUnsavedAnswer<string>(question.id);

  const [forceShowInvalid, setForceShowInvalid] = React.useState(false);

  useEffectOnce(() => registerCallback(() => setForceShowInvalid(true)));

  return <>
    <div className="row mt-3">
      <div className="col-md-12">
        <TextField
          placeholder="Your answer..."
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

export default FreeText;
