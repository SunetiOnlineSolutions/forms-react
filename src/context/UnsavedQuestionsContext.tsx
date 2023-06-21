import React from 'react';
import { StoredQuestion } from '../DataPersistence';

export type UnsavedQuestionsContextParams = {
  questions: StoredQuestion[],
  setQuestions: (questions: StoredQuestion[]) => void,
  addQuestion: (question: StoredQuestion) => void,
  editQuestion: (question: StoredQuestion) => void,
  removeQuestion: (question: StoredQuestion) => void,
};

const UnsavedQuestionsContext = React.createContext<UnsavedQuestionsContextParams>({} as any);

export const UnsavedQuestionsProvider = ({ children }: any) => {
  const [questions, setQuestions] = React.useState<Array<StoredQuestion>>([]);

  const addQuestion = React.useCallback((question: StoredQuestion) => setQuestions([...questions, question]), [questions]);
  const editQuestion = React.useCallback((updated: StoredQuestion) => setQuestions(questions.map(original => original.id === updated.id ? updated : original)), [questions]);
  const removeQuestion = React.useCallback((toRemove: StoredQuestion) => setQuestions(questions.map(question => {
    if (question.sort_order > toRemove.sort_order) {
      question.sort_order--;
    }

    return question;
  }).filter(original => original.id !== toRemove.id)), [questions]);

  return (
    <UnsavedQuestionsContext.Provider value={{
      questions,
      setQuestions,
      addQuestion,
      editQuestion,
      removeQuestion,
    }}>
      {children}
    </UnsavedQuestionsContext.Provider>
  );
};

export default UnsavedQuestionsContext;
