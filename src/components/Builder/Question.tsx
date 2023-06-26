/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import AnswerTypePicker from './AnswerTypePicker';
import QuestionHamburgerMenu from './QuestionHamburgerMenu';
import DateTime from './QuestionTypes/DateTime';
import FreeText from './QuestionTypes/FreeText';
import Instruction from './QuestionTypes/Instruction';
import List from './QuestionTypes/List';
import MultipleChoice from './QuestionTypes/MultipleChoice';
import Signature from './QuestionTypes/Signature';
import Numeric from './QuestionTypes/Numeric';
import AnimateHeight from 'react-animate-height';
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from '@react-forked/dnd';
import { useQuestion } from '../../hooks';

interface QuestionProps {
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
  draggableProps: DraggableProvidedDraggableProps | undefined;
  isDragging: boolean;
}

const Question: React.ForwardRefRenderFunction<null, QuestionProps> = ({ dragHandleProps, draggableProps, isDragging }, ref) => {
  const question = useQuestion();
  const [isOpen, setIsOpen] = React.useState(typeof question.id !== 'number');
  const [isEditing, setIsEditing] = React.useState(false);
  const [phrase, setPhrase] = React.useState<string>(question.phrase);

  const handleTitleClick = () => {
    document.querySelectorAll('.input-editable').forEach((_question) => {

      setIsEditing(false);


    });
    if (question.answer_type !== 'INSTRUCTION') {
      setIsEditing(true);
    }
  };

  const handleTitleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    question.phrase = event.currentTarget.value;
    setPhrase(event.currentTarget.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };

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

  return (
    <div ref={ref} {...draggableProps} className={"row p-0 m-0 question" + (isDragging ? ' dragging' : '')}>
      <div className="col-lg-10 col-xs-12 order-sm-2 order-md-1 order-lg-1 order-xl-1 p-r-0 border-right">

        <div className="card-header question--header w-100 d-flex justify-content-between">

          <div className="d-flex align-items-center">
            <div>
              <span {...dragHandleProps} className="drag-handle"></span>
            </div>
            <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <i className={"mr-1 fa fa-fw " + (isOpen ? 'fa-chevron-down' : 'fa-chevron-right')}></i>
            </div>
            <div>

              {isEditing ? (
                <input
                  className="input-editable"
                  value={phrase}
                  style={{ width: '60vw', height: '35px', border: 'dotted 2px #2a72b5', borderRadius: '5px', padding: '5px 5px 5px 10px' }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleTitleBlur}
                  onInput={handleTitleChange}
                />
              ) : (
                <input
                  className="editable-input"
                  value={question.answer_type !== 'INSTRUCTION' ? question.phrase : 'Instruction'}
                  style={{ width: '60vw', height: '35px', border: 'none', borderRadius: '5px', padding: '5px 5px 5px 10px' }}
                  onClick={handleTitleClick}
                  readOnly
                />
              )}
            </div>
          </div>
          <QuestionHamburgerMenu />
        </div>

        <AnimateHeight height={isOpen ? 'auto' : 0} duration={500}>
          <div className="question--content">
            {renderQuestion()}
          </div>
        </AnimateHeight>
      </div>

      <div className="col-lg-2 col-xs-12 order-sm-1 order-md-2 order-lg-2 order-xl-2 col-right px-0">
        <AnswerTypePicker />
      </div>

    </div>
  );
};

export default React.forwardRef<null, QuestionProps>(Question);
