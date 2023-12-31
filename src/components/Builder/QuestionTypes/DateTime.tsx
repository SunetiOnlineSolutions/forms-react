import React from 'react';
import { QuestionOptions } from '../../../DataPersistence';
import { useQuestion, useQuestionEdit, useToggle } from '../../../hooks';
import Checkbox from '../../FormElements/Checkbox';
import TextField from '../../FormElements/TextField';
import UnsavedQuestionsContext from '../../../context/UnsavedQuestionsContext';

const DateTime: React.FunctionComponent = () => {
  const question = useQuestion();
  const { removeQuestion } = React.useContext(UnsavedQuestionsContext);
  const [editQuestion] = useQuestionEdit(question);

  // Question parameters
  const [name, setName] = React.useState<string>(question.name);
  const [description, setDescription] = React.useState(question.description);
  const [type, setType] = React.useState<NonNullable<QuestionOptions['datetime']>['type']>(question.options?.datetime?.type ?? 'DATETIME');

  // Question validation
  const [required, toggleRequired] = useToggle(question.options?.validation?.required ?? false);

  const isRadioSelected = (option: NonNullable<QuestionOptions['datetime']>['type']) => type === option;

  React.useEffect(() => {
    editQuestion({
      name,
      description,
      options: {
        datetime: {
          type,
        },
        validation: {
          required,
        }
      }
    });
  }, [name, type, required, description]);

  return <>
    <div className="form-group row">
        <label className="col-sm-1 col-form-label">Question</label>
        <div className="col-sm-10 mr-2">
          <TextField placeholder="Question" value={name} onChange={setName} />
        </div>
        <label className="col-sm-1 col-form-label">Description</label>
        <div className="col-sm-10 mr-2">
          <TextField
            placeholder="Optionally your can add a description for your question"
            value={description} 
            onChange={setDescription} 
          />
        </div>
        <label className="col-sm-1 col-form-label">Type</label>
        <div className="col-sm-2">
          <div className="radio radio-css radio-inline no-select" onClick={() => setType('DATE')}>
            <input type="radio" readOnly checked={isRadioSelected('DATE')} />
            <label>Date</label>
          </div>
        </div>
        <div className="col-sm-2">
          <div className="radio radio-css radio-inline no-select" onClick={() => setType('TIME')}>
            <input type="radio" readOnly checked={isRadioSelected('TIME')} />
            <label>Time</label>
          </div>
        </div>
        <div className="col-sm-2">
          <div className="radio radio-css radio-inline no-select" onClick={() => setType('DATETIME')}>
            <input type="radio" readOnly checked={isRadioSelected('DATETIME')} />
            <label>Date + time</label>
          </div>
        </div>
      </div>
    <div className="form-group row">
      <label className="col-sm-1 col-form-label">Validation</label>
      <div className="col-sm-10">
        <Checkbox label="Required" checked={required} onChange={toggleRequired} />
      </div>
      <div className="col-sm-11">
        <button className="btn btn-xs btn-danger float-right" onClick={() => removeQuestion(question)}>
          <i className="fas fa-trash-alt pr-1"> </i> Delete question
        </button>
      </div>
    </div>
  </>;
};

export default DateTime;
