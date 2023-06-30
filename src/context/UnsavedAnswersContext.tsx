import React from 'react';
import { DataStore } from './DataStore';
import ValidatorFactory from '../AnswerValidators';
import { Identifier } from '../types';
import FormTemplateVersion from '../classes/FormTemplateVersion';

export type UnsavedAnswer<T> = {
  questionID: Identifier;
  value: T;
}

export type UnsavedAnswersContextParams<T> = {
  unsavedAnswers: UnsavedAnswer<T>[];
  setUnsavedAnswers: (value: UnsavedAnswer<T>[]) => void;
  setUnsavedAnswer: (questionID: Identifier, answer: T) => void;
  saveAnswers: (version: FormTemplateVersion | undefined, unsavedAnswers: UnsavedAnswer<unknown>[]) => Promise<true | 'no_version' | 'false_callback' | 'invalid_answer'>;
  registerBeforeSaveCallback: (callback: () => boolean | void) => () => void;
};

const UnsavedAnswersContext = React.createContext<UnsavedAnswersContextParams<any>>({} as any);

export const UnsavedAnswersProvider = ({ children }: any) => {

  const { selectors, actions } = React.useContext(DataStore);

  const [unsavedAnswers, setUnsavedAnswers] = React.useState<UnsavedAnswer<unknown>[]>([]);
  const [beforeSaveCallbacks, setBeforeSaveCallbacks] = React.useState<(() => boolean | void)[]>([]);

  const setUnsavedAnswer = <T,>(questionID: Identifier, answer: T) => {

    const newUnsavedAnswers = [...unsavedAnswers];

    const unsavedAnswer = newUnsavedAnswers.find(unsavedAnswer => unsavedAnswer.questionID === questionID);

    if (unsavedAnswer) {
      unsavedAnswer.value = answer;
    } else {
      newUnsavedAnswers.push({ questionID, value: answer });
    }

    setUnsavedAnswers(newUnsavedAnswers);
  };

  // TODO: Either move this function outside the component body or make use of useCallback.
  const saveAnswers = async (version: FormTemplateVersion | undefined, unsavedAnswers: UnsavedAnswer<unknown>[]): Promise<true | 'no_version' | 'false_callback' | 'invalid_answer'> => {
    if (!version) {
      console.warn('No version found. Cannot save answers.', version);
      return 'no_version';
    }

    const doesAnyCallbackReturnFalse = beforeSaveCallbacks.map(callback => callback()).some(returnVal => returnVal === false);

    if (doesAnyCallbackReturnFalse) {
      console.warn('Saving aborted due to beforeSave callback returning false');
      return 'false_callback';
    }

    const areAllAnswersValid = unsavedAnswers.every(unsaved => {
      const question = selectors.questionByID(unsaved.questionID);
      const validator = ValidatorFactory.create(question);

      return validator.isValid(unsaved.value);
    })

    if (!areAllAnswersValid) {
      console.warn('Cannot save answers because some answers are invalid');
      return 'invalid_answer';
    }

  const form = await actions.forms.store({ form_template_version_id: version.id });
   await actions.answers.bulkStore(unsavedAnswers.map(unsaved => ({
  form_id: form.id,
     question_id: unsaved.questionID,
      value: unsaved.value,
 })));

  return true;
  };

  const registerBeforeSaveCallback = (callback: () => boolean | void) => {
    setBeforeSaveCallbacks(prev => [...prev, callback]);

    return () => {
      setBeforeSaveCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  };

  return (
    <UnsavedAnswersContext.Provider value={{
      unsavedAnswers,
      setUnsavedAnswers,
      setUnsavedAnswer,
      saveAnswers,
      registerBeforeSaveCallback,
    }}>
      {children}
    </UnsavedAnswersContext.Provider>
  );
};
export default UnsavedAnswersContext;
