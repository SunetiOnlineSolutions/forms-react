import React, { useEffect } from 'react';
import { DataStore } from '../../../context/DataStore';
import { useQuestion, useQuestionEdit, useToggle } from '../../../hooks';
import Checkbox from '../../FormElements/Checkbox';
import Select, { OnChangeValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Identifier } from '../../../types';
import { QuestionOptions } from '../../../DataPersistence';
import { onEnter } from '../../../helpers';
import UnsavedQuestionsContext from '../../../context/UnsavedQuestionsContext';
import TextField from '../../FormElements/TextField';

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
  const { removeQuestion } = React.useContext(UnsavedQuestionsContext);
  const [editQuestion] = useQuestionEdit(question);
  const { selectors } = React.useContext(DataStore);

  const options = selectors.valueLists().map(valueList => ({
    label: valueList.items.map(item => item.name).join(', '),
    value: valueList.id as number,
  }));

  const [inputValue, setInputValue] = React.useState<string>('');
  const [customValues, setCustomValues] = React.useState<CreatableOption[]>(question.options?.multipleChoice?.customValues?.map(createOption) ?? []);
  const [updatedValues, setUpdatedValues] = React.useState([] as CreatableOption[]);

  // Question parameters
  const [name, setName] = React.useState<string>(question.name);
  const [using, setUsing] = React.useState<NonNullable<QuestionOptions['multipleChoice']>['using']>(question.options?.multipleChoice?.using ?? 'VALUE_LIST');
  const [valueListID, setValueListID] = React.useState<Identifier | undefined>(question.options?.multipleChoice?.valueListID);

  // Question validation
  const [required, toggleRequired] = useToggle(question.options?.validation?.required ?? false);
  const [allowMultipleAnswers, toggleAllowMultipleAnswers] = useToggle(question.options?.validation?.allowMultipleAnswers ?? false);

  React.useEffect(() => {
  const editedQuestion ={ name,
  options: {
    multipleChoice: {
      using,
      customValues: customValues.map(x => x.value),
      valueListID
    },
    validation: {
      required,
      allowMultipleAnswers,
    }
  }};
    editQuestion(editedQuestion);
  }, [name, using, valueListID, required, allowMultipleAnswers, updatedValues]);



  const onCreatableChange = (value: OnChangeValue<CreatableOption, true>) => {
    setCustomValues(value.map(({ label }) => createOption(label)));
    setUpdatedValues(customValues)
  };


  const onCreateOption = () => {
    if (inputValue && !customValues.some(x => x.value === inputValue)) {
      setCustomValues([...customValues, createOption(inputValue)]);
      setUpdatedValues([... updatedValues, createOption(inputValue)])
      setInputValue('');
    }
  };

  const isRadioSelected = (option: NonNullable<QuestionOptions['multipleChoice']>['using']) => using === option;

  return <>
    <div className="form-group row">
      <label className="col-sm-1 col-form-label">Question</label>
      <div className="col-sm-10">
        <TextField placeholder="Question" value={name} onChange={setName} />
      </div>
    </div>
    <div className="form-group row">

      <label className="col-sm-1 col-form-label">Values</label>
      <div className="col-sm-4 ">
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
        <>
          <label className="col-sm-1 col-form-label">Select value list</label>
          <div className="col-sm-5">
            <Select options={options} value={options.find(option => option.value === valueListID)} onChange={option => setValueListID(option?.value)} />
          </div>
        </>
      }
      {isRadioSelected('CUSTOM') &&
        <>
          <label className="col-sm-1 col-form-label">Custom values</label>
          <div className="col-sm-5">
            <CreatableSelect
              components={{ DropdownIndicator: null }}
              inputValue={inputValue}
              isClearable
              isMulti
              menuIsOpen={false}
              value={customValues}
              onChange={onCreatableChange}
              onInputChange={(val) => setInputValue(val)}
              onKeyDown={onEnter(onCreateOption)}
              placeholder="Type something and press enter..."
            />
          </div>
        </>
      }
    </div>
    <div className="form-group row">
      <label className="col-sm-1 col-form-label">Validation</label>
      <div className="col-sm-4">
        <Checkbox label="Required" checked={required} onChange={toggleRequired} />
        <Checkbox label="Allow multiple answers" checked={allowMultipleAnswers} onChange={toggleAllowMultipleAnswers} />
      </div>
      <div className="col-sm-11">
        <button className="btn btn-xs btn-danger float-right" onClick={() => removeQuestion(question)}>
          <i className="fas fa-trash-alt pr-1"> </i> Delete question
        </button>
      </div>
    </div>

  </>;
};

export default MultipleChoice;
