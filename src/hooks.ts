import React, { useEffect } from 'react';
import ValidatorFactory from './AnswerValidators';
import FormTemplate from './classes/FormTemplate';
import FormTemplateVersion from './classes/FormTemplateVersion';
import CurrentQuestionContext, { CurrentQuestionContextType } from './context/CurrentQuestionContext';
import CurrentSectionContext, { CurrentSectionContextType } from './context/CurrentSectionContext';
import { DataStore } from './context/DataStore';
import UnsavedAnswersContext, { UnsavedAnswersContextParams } from './context/UnsavedAnswersContext';
import UnsavedQuestionsContext from './context/UnsavedQuestionsContext';
import UnsavedSectionsContext from './context/UnsavedSectionsContext';
import { StoredQuestion, StoredSection } from './DataPersistence';
import EntityNotFoundError from './errors/EntityNotFoundError';
import { areObjectsDeepEqual, deepMerge } from './helpers';
import { AnswerType, Identifier } from './types';
import { useDebouncedCallback } from 'use-debounce';


export const useToggle = (initialValue = false): [boolean, () => void, (newVal: boolean) => void] => {
  const [value, setValue] = React.useState(initialValue);

  const toggle = () => setValue(!value);

  const set = (newVal: boolean) => setValue(newVal);

  return [value, toggle, set];
};

export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const useEffectOnce = (effect: () => void) => React.useEffect(effect, []);

export const useArray = <T>(initialValue: T[] = []): [T[], (toAdd: T) => void, (index: number) => void, (index: number, toUpdate: T) => void] => {
  const [values, setValues] = React.useState<T[]>(initialValue);

  const add = (toAdd: T) => setValues([...values, toAdd]);

  const remove = (index: number) => setValues(values.filter((_, i) => i !== index));

  const update = (index: number, toUpdate: T) => setValues(values.map((value, i) => (i === index ? toUpdate : value)));

  return [values, add, remove, update];
};

export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: (e: MouseEvent) => void) => {
  const clickHandler = (event: MouseEvent) => {
    if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
      callback(event);
    }
  };

  useEffect(() => {
    document.addEventListener('click', clickHandler);

    return () => document.removeEventListener('click', clickHandler);
  }, [ref, callback]);
};

type RegisterCallback = (callback: () => void) => () => void;
type useUnsavedAnswerReturnType<AnswerType> = [AnswerType | undefined, (newValue: AnswerType) => void, boolean, string | undefined, RegisterCallback];

export const useUnsavedAnswer = <AnswerType>(questionID: Identifier): useUnsavedAnswerReturnType<AnswerType> => {

  const { unsavedAnswers, setUnsavedAnswer, registerBeforeSaveCallback } = React.useContext<UnsavedAnswersContextParams<AnswerType>>(UnsavedAnswersContext);
  const { selectors } = React.useContext(DataStore);

  const answerValue: AnswerType | undefined = unsavedAnswers.find(answer => answer.questionID === questionID)?.value;
  const setAnswer = (newValue: AnswerType) => setUnsavedAnswer(questionID, newValue);

  const [isValid, validationMessage] = React.useMemo(() => {

    const question = selectors.questionByID(questionID);

    const validator = ValidatorFactory.create(question);
    const result = validator.isValid(answerValue);
    const isValid: boolean = result === true;
    const validationMessage: string | undefined = isValid ? undefined : result as string;


    return [isValid, validationMessage];
  }, [questionID, answerValue]);

  return [answerValue, setAnswer, isValid, validationMessage, registerBeforeSaveCallback];
};

export const useQuestion = (): StoredQuestion => {
  const question = React.useContext<CurrentQuestionContextType>(CurrentQuestionContext);

  if (!question) {
    throw new Error('No question has been set!');
  }

  return question;
};

export const useFriendlyAnswerType = (type: AnswerType): string => {
  return React.useMemo(() => type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\b\w/g, l => l.toUpperCase()), [type]);
};

/**
 * Retrieve the current data input screen, based on the URL query params.
 */
export const useCurrentScreen = (): FormTemplate | undefined => {

  const { selectors } = React.useContext(DataStore);

  return React.useMemo(() => {
    if (!new URLSearchParams(window.location.search).has('screenID')) {
      return;
    }

    const screenID = parseInt(new URLSearchParams(window.location.search).get('screenID') as string, 10);

    try {
      return selectors.templateByID(screenID);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return;
      }

      throw error;
    }
  }, [window.location.search, selectors]);
};

/**
 * Retrieve the latest screen version, based on the current data input screen as retrieved from the URL query params.
 */
export const useCurrentVersion = (): FormTemplateVersion | undefined => {
  return useCurrentScreen()?.latestVersion();
};

export const useQuestionEdit = (original: StoredQuestion): [(updated: Partial<StoredQuestion>) => void, boolean, boolean] => {
  const { editQuestion } = React.useContext(UnsavedQuestionsContext);
  const [updated, setUpdated] = React.useState<StoredQuestion>(original);
  const [hasChanges, setHasChanges] = React.useState(false);
  const isPersisted = React.useMemo(() => typeof original.id === 'number', [original]);
  const { actions } = React.useContext(DataStore);


  const edit = (updated: Partial<StoredQuestion>) => {
    if (original.options.multipleChoice?.customValues) {
      original.options.multipleChoice.customValues = []
    }
    setUpdated(
      deepMerge(original, updated)
    );
  };

  const onQuestionChange = useDebouncedCallback(
    async () => {
      await actions.questions.update(updated).then(() => setEditing(false));
    }, 4000,
  );

  const {setEditing} = React.useContext(UnsavedQuestionsContext);

  React.useEffect(() => setHasChanges(areObjectsDeepEqual(original, updated)), [original, updated]);
  React.useEffect(() => { 
    editQuestion(updated);
    if (!hasChanges || !updated.name) {
      return;
    }
    setEditing(true);
    onQuestionChange();
  }, [updated]);

  return [edit, hasChanges, isPersisted];
};

export const useSection = (): StoredSection => {
  const section = React.useContext<CurrentSectionContextType>(CurrentSectionContext);

  if (!section) {
    throw new Error('No section has been set!');
  }

  return section;
};

export const useSectionEdit = (original: StoredSection): [(updated: StoredSection) => void, boolean, boolean] => {
  const { editSection } = React.useContext(UnsavedSectionsContext);

  const [updated, setUpdated] = React.useState<StoredSection>(original);
  const [hasChanges, setHasChanges] = React.useState(false);
  const isPersisted = React.useMemo(() => typeof original.id === 'number', [original]);

  React.useEffect(() => setHasChanges(areObjectsDeepEqual(original, updated)), [original, updated]);
  React.useEffect(() => editSection(updated), [updated]);

  return [setUpdated, hasChanges, isPersisted];
};
