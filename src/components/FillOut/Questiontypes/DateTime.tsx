import React from 'react';
import { useEffectOnce, useQuestion, useUnsavedAnswer } from '../../../hooks';
import DateTimePicker, { DateTimeType } from '../../FormElements/DateTimePicker';

const DateTime: React.FunctionComponent = () => {
  const question = useQuestion();
  const [value, setValue, isValid, validationMessage, registerCallback] = useUnsavedAnswer<string>(question.id);

  const [forceShowInvalid, setForceShowInvalid] = React.useState(false);

  useEffectOnce(() => registerCallback(() => setForceShowInvalid(true)));

  const type: DateTimeType = React.useMemo(() => {
    return question.options?.datetime?.type?.toLowerCase() as DateTimeType ?? 'datetime';
  }, [question.options?.datetime?.type]);

  return <>
    <div className="row">
      <div className="col-md-12">
        <DateTimePicker
          value={value}
          onChange={setValue}
          type={type}
          isValid={isValid}
          validationMessage={validationMessage}
          forceShowInvalid={forceShowInvalid}
        />
      </div>
    </div>
  </>;
}

export default DateTime;
