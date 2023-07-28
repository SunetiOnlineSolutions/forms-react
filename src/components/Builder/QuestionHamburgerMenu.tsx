import React from 'react';
import { useQuestion } from '../../hooks';
import { DataStore } from '../../context/DataStore';
import UnsavedQuestionsContext from '../../context/UnsavedQuestionsContext';

const QuestionHamburgerMenu: React.FunctionComponent = () => {
  const question = useQuestion();
  const { setEditing } = React.useContext(UnsavedQuestionsContext);
  const { actions } = React.useContext(DataStore);

  const deleteQuestion = async () => {
    setEditing(true);
    await actions.questions.delete(question).then(() => setEditing(false));
  };

  return (
    <div className="dropdown question--hamburger-menu">

      <button className="btn btn-light dropdown-toggle hide-dropdown-toggle" id={"question--hamburger-menu_" + question.id} data-toggle="dropdown">
        <span className="far fa-lg fa-ellipsis-v"></span>
      </button>

      <div className="dropdown-menu dropdown-menu-right" aria-labelledby={"question--hamburger-menu_" + question.id}>

        <button className="dropdown-item">
          <span className="fal fa-fw fa-lg fa-tags text-primary m-r-5"></span>
          Tags
        </button>

        <button className="dropdown-item" onClick={() => deleteQuestion()}>
          <span className="fal fa-fw fa-lg fa-trash-alt text-danger m-r-5"></span>
          Delete question
        </button>
      </div>
    </div>
  );
};

export default QuestionHamburgerMenu;
