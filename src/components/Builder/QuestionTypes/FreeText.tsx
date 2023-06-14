import React from 'react';
import { useQuestion, useToggle, useQuestionEdit } from '../../../hooks';
import TextField from '../../FormElements/TextField';
import { availableValidators as getAvailableValidators, ValidationOption } from '../../../AnswerValidators';

const FreeText: React.FunctionComponent = () => {

  const question = useQuestion();
  const [editQuestion] = useQuestionEdit(question);
  const availableValidators = React.useMemo(() => getAvailableValidators('FREE_TEXT'), []);

  // Question parameters
  const [phrase, setPhrase] = React.useState(question.phrase);

  // Question validation
  const [required] = useToggle(question.options?.validation?.required ?? false);

  const [validationRules, setValidationRules] = React.useState<ValidationOption[]>([]);

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

      <h4>Question</h4>

      <div className="row mb-3">
        <div className="col-md-7">
          <TextField placeholder="What would you like to ask?" value={phrase} onChange={setPhrase} />
        </div>
      </div>

      <h4>Answer validation</h4>

      {validationRules.length !== 0 &&
        <table className="table table-bordered table-sm mb-4" style={{ width: '500px' }}>
          <tbody>
            {validationRules.map(({ icon, label }, index) => (
              <tr key={index}>
                <td className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className={"text-primary fa-lg fa-fw mr-1 " + icon}></i>
                    {label}
                  </div>
                  <i className="fas fa-times-circle text-danger fa-lg cursor-pointer" onClick={() => setValidationRules(validationRules.filter((x, i) => i !== index))}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }

      <div>
        <div className="dropdown btn-group split-btn">
          <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="true">
            <span className="fas fa-plus mr-2"></span>
            <span className="mr-2">Validation rule</span>
          </button>
          <div className="dropdown-menu dropdown-menu-right" aria-labelledby="">
            {availableValidators.map((rule, index) => (
              <button key={index} className="dropdown-item" onClick={() => setValidationRules([...validationRules, { ...rule }])}>
                <span className={"fal fa-fw fa-lg text-primary mr-1 " + rule.icon}></span>
                <span>{rule.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  </>;
};

export default FreeText;
