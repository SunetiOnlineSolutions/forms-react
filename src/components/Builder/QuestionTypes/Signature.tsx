import React from 'react';
import { useQuestion, useQuestionEdit, useToggle } from '../../../hooks';
import Checkbox from '../../FormElements/Checkbox';
import TextField from '../../FormElements/TextField';
import UnsavedQuestionsContext from '../../../context/UnsavedQuestionsContext';

const Signature: React.FunctionComponent = () => {
  const question = useQuestion();
  const { removeQuestion } = React.useContext(UnsavedQuestionsContext);
  const [editQuestion] = useQuestionEdit(question);

  const [name, setName] = React.useState<string>(question.name);
  const [description, setDescription] = React.useState(question.description);
  const [required, toggleRequired] = useToggle(question.options?.validation?.required ?? false);

  React.useEffect(() => {
    editQuestion({
      name,
      description,
      options: {
        validation: {
          required,
        }
      }
    });
  }, [name, required, description]);


  return <>
    <div className="form-group row">
      <label className="col-sm-1 col-form-label">Question</label>
      <div className="col-sm-10">
        <TextField placeholder="What would you like to ask?" value={name} onChange={setName} />
      </div>
    </div>
    <div className="form-group row">
      <label className="col-sm-1 col-form-label">Description</label>
      <div className="col-sm-10">
        <TextField 
          placeholder="Optionally your can add a description for your question"
          value={description} 
          onChange={setDescription} 
        />
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

export default Signature;
