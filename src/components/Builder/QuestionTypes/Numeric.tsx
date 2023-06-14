import React from 'react';
import { useQuestion, useQuestionEdit, useToggle } from '../../../hooks';
import Checkbox from '../../FormElements/Checkbox';
import TextField from '../../FormElements/TextField';

const Numeric: React.FunctionComponent = () => {
  const question = useQuestion();
  const [editQuestion] = useQuestionEdit(question);

  // Question parameters
  const [phrase, setPhrase] = React.useState(question.phrase);

  // Quesiton validation
  const [required, toggleRequired] = useToggle(question.options?.validation?.required);
  const [min, setMin] = React.useState(question.options?.validation?.min ?? 0);
  const [max, setMax] = React.useState(question.options?.validation?.max ?? 0);
  const [allowDecimal, toggleAllowDecimal] = useToggle(question.options?.validation?.allowDecimal ?? false);
  const [allowNegative, toggleAllowNegative] = useToggle(question.options?.validation?.allowNegative ?? false);

  React.useEffect(() => {
    editQuestion({
      phrase,
      options: {
        validation: {
          required,
          min,
          max,
          allowDecimal,
          allowNegative,
        }
      }
    });
  }, [phrase, required, min, max, allowDecimal, allowNegative]);

  return <>
    <div className="d-flex justify-items-between flex-column">

      <div className="row">
        <div className="col-md-7">
          <TextField label="Question" value={phrase} onChange={setPhrase} />
        </div>
      </div>
      <h5>Validation</h5>
      <div className="row">
        <div className="col-md-1">
          <Checkbox label="Required" checked={required} onChange={toggleRequired} />
        </div>

        <div className="col-md-2">
          <Checkbox label="Allow decimal values" checked={allowDecimal} onChange={toggleAllowDecimal} />
        </div>

        <div className="col-md-2">
          <Checkbox label="Allow negative values" checked={allowNegative} onChange={toggleAllowNegative} />
        </div>

      </div>

      <div className="row mt-3">
        <div className="col-md-1">
          <label>Min</label>
          <input type="number" className="form-control mb-3" value={min} onChange={event => setMin(parseInt(event.target.value, 10))} />
        </div>

        <div className="col-md-1">
          <label>Max</label>
          <input type="number" className="form-control mb-3" value={max} onChange={event => setMax(parseInt(event.target.value, 10))} />
        </div>
      </div>
    </div>
  </>;
};

export default Numeric;
