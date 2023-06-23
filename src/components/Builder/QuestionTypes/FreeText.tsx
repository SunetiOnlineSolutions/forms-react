import React from 'react';
import { useQuestion, useToggle, useQuestionEdit } from '../../../hooks';
import TextField from '../../FormElements/TextField';
import Checkbox from '../../FormElements/Checkbox';
import UnsavedQuestionsContext from '../../../context/UnsavedQuestionsContext';

const FreeText: React.FunctionComponent = () => {

  const question = useQuestion();
  const { removeQuestion } = React.useContext(UnsavedQuestionsContext);
  const [editQuestion] = useQuestionEdit(question);
  const [phrase, setPhrase] = React.useState(question.phrase);
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
    <div className="d-flex justify-items-between flex-column" style={{background: 'lightGrey', padding: '10px', borderRadius: '5px', marginTop: '-10px'}}>

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

export default FreeText;
