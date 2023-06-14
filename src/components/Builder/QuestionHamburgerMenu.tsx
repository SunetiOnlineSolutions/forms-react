import React from 'react';
import UnsavedQuestionsContext from '../../context/UnsavedQuestionsContext';
import { useQuestion } from '../../hooks';

const QuestionHamburgerMenu: React.FunctionComponent = () => {
  const question = useQuestion();
  const { removeQuestion } = React.useContext(UnsavedQuestionsContext);

  return (
    <div className="dropdown question--hamburger-menu">

      <button className="btn btn-light dropdown-toggle hide-dropdown-toggle" id={"question--hamburger-menu_" + question.id} data-toggle="dropdown">
        <span className="far fa-lg fa-ellipsis-v"></span>
      </button>

      <div className="dropdown-menu dropdown-menu-right" aria-labelledby={"question--hamburger-menu_" + question.id}>
        <button className="dropdown-item">
          <span className="fal fa-fw fa-lg fa-language text-primary m-r-5"></span>
          Translate
        </button>

        <button className="dropdown-item">
          <span className="fal fa-fw fa-lg fa-tags text-primary m-r-5"></span>
          Tags
        </button>

        <button className="dropdown-item" onClick={() => removeQuestion(question)}>
          <span className="fal fa-fw fa-lg fa-trash-alt text-danger m-r-5"></span>
          Delete question
        </button>
      </div>
    </div>
  );
};

export default QuestionHamburgerMenu;
