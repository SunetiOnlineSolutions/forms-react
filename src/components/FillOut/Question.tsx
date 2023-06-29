import React from 'react';
import DateTime from './Questiontypes/DateTime';
import FreeText from './Questiontypes/FreeText';
import MultipleChoice from './Questiontypes/MultipleChoice';
import Numeric from './Questiontypes/Numeric';
import List from './Questiontypes/List';
import Signature from './Questiontypes/Signature';
import Instruction from './Questiontypes/Instruction';
import { useQuestion } from '../../hooks';

const Question: React.FunctionComponent = () => {

  const question = useQuestion();

  const renderQuestion = () => {
    switch (question.answer_type) {
      case 'FREE_TEXT': return <FreeText />
      case 'MULTIPLE_CHOICE': return <MultipleChoice />
      case 'NUMERIC': return <Numeric />
      case 'DATE': return <DateTime />
      case 'LIST': return <List />
      case 'SIGNATURE': return <Signature />
      case 'INSTRUCTION': return <Instruction />

      default: return <div>No question type selected</div>
    }
  };

  return <>
    <div className="question mb-3">
      <h6 className="question--name">
        {question.name}
        {question.options?.validation?.required && <span className="text-danger">&nbsp;*</span>}
      </h6>
      {/* <sub>{question.friendlyAnswerType()}</sub> */}
      {renderQuestion()}
    </div>
  </>;
}

export default Question;
