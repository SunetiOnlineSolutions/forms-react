/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { DataStore } from '../../../context/DataStore';
import { useQuestion, useQuestionEdit, useToggle } from '../../../hooks';
import Checkbox from '../../FormElements/Checkbox';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Identifier } from '../../../types';
import { QuestionOptions } from '../../../DataPersistence';
import { onEnter } from '../../../helpers';

interface CreatableOption {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string): CreatableOption => ({
  label,
  value: label,
});

const MultipleChoice: React.FunctionComponent = () => {
  const question = useQuestion();
  const [editQuestion] = useQuestionEdit(question);
  const { selectors } = React.useContext(DataStore);

  const options = selectors.valueLists().map(valueList => ({
    label: valueList.items.map(item => item.label).join(', '),
    value: valueList.id as number,
  }));

  const [inputValue, setInputValue] = React.useState<string>('');
  const [customValues, setCustomValues] = React.useState<CreatableOption[]>(question.options?.multipleChoice?.customValues?.map(createOption) ?? []);
  const [updatedValues, setUpdatedValues] = React.useState([] as CreatableOption[]);

  // Question parameters
  const [phrase, setPhrase] = React.useState<string>(question.phrase);
  const [using, setUsing] = React.useState<NonNullable<QuestionOptions['multipleChoice']>['using']>(question.options?.multipleChoice?.using ?? 'VALUE_LIST');
  const [valueListID, setValueListID] = React.useState<Identifier | undefined>(question.options?.multipleChoice?.valueListID);

  // Question validation
  const [required, toggleRequired] = useToggle(question.options?.validation?.required ?? false);
  const [allowMultipleAnswers, toggleAllowMultipleAnswers] = useToggle(question.options?.validation?.allowMultipleAnswers ?? false);

  React.useEffect(() => {
  const editedQuestion ={ phrase,
  options: {
    multipleChoice: {
      using,
      customValues: updatedValues.map(x => x.value),
      valueListID
    },
    validation: {
      required,
      allowMultipleAnswers,
    }
  }};
    editQuestion(editedQuestion);
  }, [phrase, using, valueListID, required, allowMultipleAnswers, customValues]);

  const onCreateOption = () => {
    console.log(inputValue)
    console.log(customValues)
    if (inputValue && !customValues.some(x => x.value === inputValue)) {
      setCustomValues([...customValues, createOption(inputValue)]);
      setUpdatedValues([... updatedValues, createOption(inputValue)])
      setInputValue('');
    }
  };

  const isRadioSelected = (option: NonNullable<QuestionOptions['multipleChoice']>['using']) => using === option;

  return <>
    <div className="d-flex justify-items-between flex-column">

      <div className="row">
        <div className="col-md-7 form-group mb-0">
          <label>Question</label>
          <input type="text" className="form-control mb-3" value={phrase} onChange={event => setPhrase(event.target.value)} />
        </div>
        <div className="col-md-7 form-group mb-0">
          <label>Multiple choice values</label>
          <div>
            <div className="radio radio-css radio-inline no-select" onClick={() => setUsing('VALUE_LIST')}>
              <input type="radio" readOnly checked={isRadioSelected('VALUE_LIST')} />
              <label>Use value list</label>
            </div>
            <div className="radio radio-css radio-inline no-select" onClick={() => setUsing('CUSTOM')}>
              <input type="radio" readOnly checked={isRadioSelected('CUSTOM')} />
              <label>Use custom values</label>
            </div>
            <div className="radio radio-css radio-inline no-select" onClick={() => setUsing('REFERENCE_DATA')}>
              <input type="radio" readOnly checked={isRadioSelected('REFERENCE_DATA')} />
              <label>Use reference data</label>
            </div>
          </div>
        </div>
        {isRadioSelected('VALUE_LIST') &&
          <div className="col-md-7 form-group mb-0 mt-3">
            <label>Select value list</label>
            <Select options={options} value={options.find(option => option.value === valueListID)} onChange={option => setValueListID(option?.value)} />
          </div>
        }
        {isRadioSelected('CUSTOM') &&
          <div className="col-md-7 form-group mb-0 mt-3">
            <label>Set custom values</label>
            <CreatableSelect
              components={{ DropdownIndicator: null }}
              inputValue={inputValue}
              isClearable
              isMulti
              menuIsOpen={false}
              value={customValues}
              onInputChange={(val) => setInputValue(val)}
              onKeyDown={onEnter(onCreateOption)}
              placeholder="Type something and press enter..."
            />
          </div>
        }
      </div>

      <h5 className="mt-3">Validation</h5>
      <div className="row">
        <div className="col-md-1">
          <Checkbox label="Required" checked={required} onChange={toggleRequired} />
        </div>
        <div className="col-md-2">
          <Checkbox label="Allow multiple answers" checked={allowMultipleAnswers} onChange={toggleAllowMultipleAnswers} />
        </div>
      </div>
    </div>
  </>;
};

export default MultipleChoice;
