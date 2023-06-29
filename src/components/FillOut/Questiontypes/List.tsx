import React from 'react';
import { onEnter } from '../../../helpers';
import { useArray, useEffectOnce, useQuestion, useUnsavedAnswer } from '../../../hooks';

const List: React.FunctionComponent = () => {
  const question = useQuestion();
  const [, setAnswer, isValid, validationMessage, registerCallback] = useUnsavedAnswer<string[]>(question.id);
  const [values, add, remove, update] = useArray<string>();
  const [value, setValue] = React.useState('');
  const [showInvalid, setShowInvalid] = React.useState(false);

  const addValue = () => {
    if (!value) {
      return;
    }

    add(value);
    setValue('');
  }

  React.useEffect(() => setAnswer(values), [values]);

  useEffectOnce(() => registerCallback(() => setShowInvalid(true)));

  return <>
    <div className="forms-fillout--list row">
      <div className="col-md-12">
        <ul className="no-bullets mb-0">
          {values.map((item, index) => (
            <li key={index} className="mb-2">
              <div className="input-group">
                <input type="text" className={"form-control" + (showInvalid && !isValid ? ' is-invalid' : '')} value={item} onChange={event => update(index, event.target.value)} />
                <div className="input-group-append">
                  <button className="btn btn-outline-danger text-center">
                    <span className="mr-2 text-danger cursor-pointer m-0" onClick={() => remove(index)}>Remove</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
          <li>
            <div className="input-group">
              <input type="text" className={"form-control" + (showInvalid && !isValid ? ' is-invalid' : '')} value={value} onChange={event => setValue(event.target.value)} onKeyPress={onEnter(addValue)} />

              <div className="input-group-append">
                <button className={"btn" + (showInvalid && !isValid ? ' btn-outline-danger' : ' btn-outline-primary')} onClick={addValue}>Add</button>
              </div>
            </div>
          </li>
        </ul>
        {showInvalid && !isValid && <span className="invalid-feedback d-block">{validationMessage}</span>}
      </div>
    </div>
  </>;
}
1
export default List;
