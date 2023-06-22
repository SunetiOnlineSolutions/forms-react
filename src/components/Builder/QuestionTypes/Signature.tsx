import React from 'react';
import { useQuestion, useQuestionEdit, useToggle } from '../../../hooks';
import Checkbox from '../../FormElements/Checkbox';
import TextField from '../../FormElements/TextField';
import UnsavedQuestionsContext from '../../../context/UnsavedQuestionsContext';

const Signature: React.FunctionComponent = () => {
  const question = useQuestion();
  const { removeQuestion } = React.useContext(UnsavedQuestionsContext);
  const [editQuestion] = useQuestionEdit(question);


  const [phrase, setPhrase] = React.useState<string>(question.phrase);
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
    <div className="d-flex justify-items-between flex-column">

      <div className="row">
        <div className="col-md-7">
          <TextField label="Question" value={phrase} onChange={setPhrase} />
        </div>
      </div>
      <h6>Validation</h6>
      <div className="row">
        <div className="row col-md-10">
            <div>
              <Checkbox label="Required" checked={required} onChange={toggleRequired} />
            </div>
        </div>
        <div className="col-md-2">
            <button className="btn btn-xs btn-danger float-right" onClick={() => removeQuestion(question)}>
              <i className="fas fa-trash-alt pr-1"> </i> Delete question
            </button>
        </div>
      </div>
    </div>
  </>;
};

export default Signature;
