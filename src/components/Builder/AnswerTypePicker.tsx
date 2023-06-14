import React from 'react';
import { useFriendlyAnswerType, useQuestion, useQuestionEdit } from '../../hooks';
import { AnswerType } from '../../types';

const options = [
  { label: 'Free text', icon: 'fa-font-case' },
  { label: 'Multiple choice', icon: 'fa-ballot-check' },
  { label: 'Numeric', icon: 'fa-dice' },
  { label: 'Date', icon: 'fa-calendar-day' },
  { label: 'List', icon: 'fa-list-ol' },
  { label: 'Signature', icon: 'fa-signature' },
  { label: 'Instruction', icon: 'fa-chalkboard-teacher' },
]

const AnswerTypePicker: React.FunctionComponent = () => {

  const question = useQuestion();
  const [editQuestion] = useQuestionEdit(question);

  const friendlyType = useFriendlyAnswerType(question.answer_type);

  return (
    <div className="dropdown answer-type-picker d-flex justify-content-between align-items-center h-100">
      <div className="pl-2">
        <span className={"text-primary m-r-5 fal fa-lg fa-fw " + options.find(option => option.label === friendlyType)?.icon}></span>
        {friendlyType}
      </div>
      <div className="dropdown-toggle px-3 h-100 d-flex align-items-center cursor-pointer" data-bs-toggle="dropdown">
        <span className="sr-only">Toggle dropdown</span>
      </div>

      <div className="dropdown-menu dropdown-menu-right w-100">
        {options.map((option) => (
          <button key={option.label} className="dropdown-item" onClick={() => editQuestion({ ...question, answer_type: option.label.replace(' ', '_').toUpperCase() as AnswerType })}>
            <span className={"text-primary m-r-5 fal fa-fw " + option.icon}></span>
            {friendlyType === option.label ? <strong>{option.label}</strong> : option.label}
          </button>
        ))}
      </div>
    </div>

  );
};

export default AnswerTypePicker;
