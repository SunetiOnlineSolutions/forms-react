import React from 'react';
import { useSection } from '../../hooks';
import { AnswerType } from '../../types';
import { DataStore } from '../../context/DataStore';

const AddQuestionDropdown: React.FunctionComponent = () => {

  const section = useSection();
  const { actions } = React.useContext(DataStore);

  const add = (type: AnswerType) => {
    actions.questions.store({
      section_id: section.id,
      answer_type: type,
      options: {},
      name: 'question',
    })
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
        <button className="dropdown-item" onClick={() => add('FREE_TEXT')}>
          <span className="fal fa-fw fa-lg fa-font-case text-primary m-r-5"></span>
          Free text
        </button>
        <button className="dropdown-item" onClick={() => add('MULTIPLE_CHOICE')}>
          <span className="fal fa-fw fa-lg fa-ballot-check text-primary m-r-5"></span>
          Multiple choice
        </button>
        <button className="dropdown-item" onClick={() => add('NUMERIC')}>
          <span className="fal fa-fw fa-lg fa-dice text-primary m-r-5"></span>
          Numeric
        </button>
        <button className="dropdown-item" onClick={() => add('DATE')}>
          <span className="fal fa-fw fa-lg fa-calendar-day text-primary m-r-5"></span>
          Date
        </button>
        <button className="dropdown-item" onClick={() => add('LIST')}>
          <span className="fal fa-fw fa-lg fa-list-ol text-primary m-r-5"></span>
          List
        </button>
        <button className="dropdown-item" onClick={() => add('SIGNATURE')}>
          <span className="fal fa-fw fa-lg fa-signature text-primary m-r-5"></span>
          Signature
        </button>
        <button className="dropdown-item" onClick={() => add('INSTRUCTION')}>
          <span className="fal fa-fw fa-lg fa-chalkboard-teacher text-primary m-r-5"></span>
          Instruction
        </button>
      </div>
    </div>
  );
};

export default AddQuestionDropdown;
