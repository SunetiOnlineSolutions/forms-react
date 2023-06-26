import React from 'react';
import { QuestionOptions } from '../../../DataPersistence';
import { useQuestion, useQuestionEdit, useToggle } from '../../../hooks';
import Checkbox from '../../FormElements/Checkbox';
import DateTimePicker from '../../FormElements/DateTimePicker';
import TextField from '../../FormElements/TextField';

const DateTime: React.FunctionComponent = () => {
  const question = useQuestion();
  const [editQuestion] = useQuestionEdit(question);

  // Question parameters
  const [phrase, setPhrase] = React.useState<string>(question.phrase);
  const [type, setType] = React.useState<NonNullable<QuestionOptions['datetime']>['type']>(question.options?.datetime?.type ?? 'DATETIME');

  // Question validation
  const [required, toggleRequired] = useToggle(question.options?.validation?.required ?? false);
  const [after, setAfter] = React.useState<string>(question.options?.validation?.after ?? '');
  const [before, setBefore] = React.useState<string>(question.options?.validation?.before ?? '');

  const isRadioSelected = (option: NonNullable<QuestionOptions['datetime']>['type']) => type === option;

  React.useEffect(() => {
    editQuestion({
      phrase,
      options: {
        datetime: {
          type,
        },
        validation: {
          required,
          after,
          before,
        }
      }
    });
  }, [phrase, type, required, after, before]);

  return <>
    <div className="d-flex justify-items-between flex-column">

      <div className="row">
        <div className="col-md-7">
          <TextField value={phrase} onChange={setPhrase} label="Question" />
        </div>
        <div className="col-md-7 form-group">
          <label>Date/time kind</label>
          <div>
            <div className="radio radio-css radio-inline no-select" onClick={() => setType('DATE')}>
              <input type="radio" readOnly checked={isRadioSelected('DATE')} />
              <label>Date</label>
            </div>
            <div className="radio radio-css radio-inline no-select" onClick={() => setType('TIME')}>
              <input type="radio" readOnly checked={isRadioSelected('TIME')} />
              <label>Time</label>
            </div>
            <div className="radio radio-css radio-inline no-select" onClick={() => setType('DATETIME')}>
              <input type="radio" readOnly checked={isRadioSelected('DATETIME')} />
              <label>Date + time</label>
            </div>
          </div>
        </div>
      </div>
      <h5>Validation</h5>
      <div className="row">
        <div className="col-md-2">
          <Checkbox label="Required" checked={required} onChange={toggleRequired} />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-2">
          <DateTimePicker label="After" value={after} onChange={setAfter} />
        </div>
        <div className="col-md-2">
          <DateTimePicker label="Before" value={before} onChange={setBefore} />
        </div>
      </div>
    </div>
  </>;
};

export default DateTime;
