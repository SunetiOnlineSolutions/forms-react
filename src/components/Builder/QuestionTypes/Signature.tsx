import React from 'react';
import { useQuestion, useQuestionEdit, useToggle } from '../../../hooks';
import Checkbox from '../../FormElements/Checkbox';
import TextField from '../../FormElements/TextField';

const Signature: React.FunctionComponent = () => {
  const question = useQuestion();
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
      <h5>Validation</h5>
      <div className="row">
        <div className="col-md-2">
          <Checkbox label="Required" checked={required} onChange={toggleRequired} />
        </div>
      </div>
    </div>
  </>;
};

export default Signature;
