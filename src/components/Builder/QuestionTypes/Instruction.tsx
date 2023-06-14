import React from 'react';
import { useCKEditor } from 'ckeditor4-react';
import { useQuestion, useQuestionEdit } from '../../../hooks';

const Instruction: React.FunctionComponent = () => {
  const question = useQuestion();
  const [edit] = useQuestionEdit(question);
  const [element, setElement] = React.useState<HTMLElement | null>(null);

  useCKEditor({
    initContent: question.phrase,
    element,
    subscribeTo: ['change'],
    dispatchEvent: ({ payload }) => edit({ phrase: payload.editor.getData() }),
  });

  return <div ref={setElement}></div>;
};

export default Instruction;
