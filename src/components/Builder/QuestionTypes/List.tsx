import React from 'react';
import { useQuestion, useQuestionEdit, useToggle } from '../../../hooks';
import Checkbox from '../../FormElements/Checkbox';
import TextField from '../../FormElements/TextField';
import UnsavedQuestionsContext from '../../../context/UnsavedQuestionsContext';

const List: React.FunctionComponent = () => {
  const question = useQuestion();
  const { removeQuestion } = React.useContext(UnsavedQuestionsContext);
  const [editQuestion] = useQuestionEdit(question);

  // Question parameters
  const [phrase, setPhrase] = React.useState<string>(question.phrase);

  // Question validation
  const [required, toggleRequired] = useToggle(question.options?.validation?.required ?? false);

  React.useEffect(() => {
    editQuestion({
      phrase,
      options: {
        validation: {
          required,
        }
      }
    });
  }, [phrase, required]);

  return <>
    <div className="form-group row">
      <label className="col-sm-1 col-form-label">Question</label>
      <div className="col-sm-7">
        <TextField placeholder="Question" value={phrase} onChange={setPhrase} />
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

export default List;
