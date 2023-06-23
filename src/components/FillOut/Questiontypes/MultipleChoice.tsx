import React from 'react';
import { DataStore } from '../../../context/DataStore';
import { useArray, useEffectOnce, useQuestion, useUnsavedAnswer } from '../../../hooks';
import { Identifier, Nullable } from '../../../types';
import Checkbox from '../../FormElements/Checkbox';

export type Option = { id: number, label: string };
export type Options = Option[];

const MultipleChoice: React.FunctionComponent = () => {

  const question = useQuestion();
  const { selectors, state } = React.useContext(DataStore);

  const multiSelect = question.options?.validation?.allowMultipleAnswers;

  const [selectedOptions, addSelectedOption, removeSelectedOption] = useArray<Option>([]);
  const [selectedOption, setSelectedOption] = React.useState<Nullable<Option>>();
  const [showInvalid, setShowInvalid] = React.useState(false);

  const [_value, setValue, isValid, validationMessage, registerCallback] = useUnsavedAnswer<Nullable<Option | Options>>(question.id);


  useEffectOnce(() => registerCallback(() => setShowInvalid(true)));

  React.useEffect(() => {
    if (multiSelect) {
      setValue(selectedOptions);
    } else {
      setValue(selectedOption as Nullable<Option>);
    }
  }, [multiSelect, selectedOption, selectedOptions, setValue]);

  const options = React.useMemo<Options>(() => {

    if (question.options.multipleChoice?.using === 'CUSTOM') {
      return question.options.multipleChoice?.customValues?.map((val, index) => ({ id: index, label: val })) as Options;
    }

    if (question.options.multipleChoice?.using === 'VALUE_LIST') {
      try {
        return selectors.getValueListByID(question.options.multipleChoice?.valueListID as Identifier)
          .items.map(item => ({ id: item.id as number, label: item.label }));
      } catch (error) {
        return [];
      }
    }

    // throw new Error('Not implemented');
    return [];

  }, [
    question.options.multipleChoice?.using,
    question.options.multipleChoice?.valueListID,
    question.options.multipleChoice?.customValues,
    state.valueLists,
    state.valueListItems,
  ]);

  const onClickCheckbox = (option: Option, value: boolean) => {
    if (value) {
      addSelectedOption(option);
    } else {
      removeSelectedOption(selectedOptions.indexOf(option));
    }

    setShowInvalid(true);
  };

  const onClickRadio = (option: Option) => {
    setSelectedOption(option)

    setShowInvalid(true);
  };


  return <>

    {multiSelect &&
      options.map(option => (
        <Checkbox
          key={option.id}
          label={option.label}
          checked={selectedOptions.includes(option)}
          onChange={(value) => onClickCheckbox(option, value)}
          isValid={isValid}
          forceShowInvalid={showInvalid}
        />
      ))
    }

    {!multiSelect &&
      options.map(option => (
        <div key={option.id} className={"radio radio-css no-select" + (showInvalid && !isValid ? ' is-invalid' : '')} onClick={() => onClickRadio(option)}>
          <input type="radio" readOnly checked={selectedOption === option} />
          <label>{option.label}</label>
        </div>
      ))
    }

    {showInvalid && !isValid && <span className="invalid-feedback d-block">{validationMessage}</span>}

  </>;
}

export default MultipleChoice;
