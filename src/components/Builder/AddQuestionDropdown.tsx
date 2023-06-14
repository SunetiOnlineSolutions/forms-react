import React from 'react';
import UnsavedQuestionsContext from '../../context/UnsavedQuestionsContext';
import { useSection } from '../../hooks';
import { AnswerType } from '../../types';

const AddQuestionDropdown: React.FunctionComponent = () => {

  const section = useSection();
  const { questions, addQuestion } = React.useContext(UnsavedQuestionsContext);

  const add = (type: AnswerType) => {
    addQuestion({
      section_id: section.id,
      answer_type: type,
      options: {},
      phrase: '',
      id: ('temp__' + Math.random()).replace('.', ''),
      sort_order: Math.max(...questions.filter(q => q.section_id === section.id).map(q => q.sort_order), 0) + 1,
    });
  };

  return (
    <div className="dropdown btn-group split-btn navbar-new-question">
      <button type="button" className="btn btn-primary" onClick={() => add('FREE_TEXT')}>
        <span className="fas fa-plus mr-2"></span>Question
      </button>
      <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="true">
        <span className="sr-only">Toggle Dropdown</span>
      </button>
      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="">
        <button className="dropdown-item" onClick={() => add('INSTRUCTION')}>
          <span className="fal fa-fw fa-lg fa-chalkboard-teacher text-primary m-r-5"></span>
          <span className="far fa-plus mr-1"></span>
          Instruction
        </button>
      </div>
    </div>
  );
};

export default AddQuestionDropdown;
