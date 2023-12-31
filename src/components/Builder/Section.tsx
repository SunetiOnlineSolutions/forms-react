import React from 'react';
import SectionHamburgerMenu from './SectionHamburgerMenu';
import Question from './Question';
import AddQuestionDropdown from './AddQuestionDropdown';
import AnimateHeight from 'react-animate-height';
import { Droppable, Draggable, DraggableStateSnapshot, DraggableProvided } from '@react-forked/dnd';
import CurrentQuestionContext from '../../context/CurrentQuestionContext';
import UnsavedQuestionsContext from '../../context/UnsavedQuestionsContext';
import { useSection } from '../../hooks';

interface SectionProps {
  draggableProvided: DraggableProvided;
  draggableSnapshot: DraggableStateSnapshot;
}

const Section: React.FunctionComponent<SectionProps> = ({ draggableProvided, draggableSnapshot }) => {
  const section = useSection();
  const [isOpen, setIsOpen] = React.useState(true);
  const { questions } = React.useContext(UnsavedQuestionsContext);

  return (
    <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} className="section">
      <div className={"section--header mb-0 mt-0 d-flex justify-content-between align-items-center collapsed" + (draggableSnapshot.isDragging ? ' dragging' : '')} aria-expanded="false">
        <div className="d-flex">
          <span {...draggableProvided.dragHandleProps} className="drag-handle"></span>
          <div className="pointer-cursor d-flex align-items-center" onClick={() => setIsOpen(!isOpen)}>
            <i className={"mr-1 fa fa-fw " + (isOpen ? 'fa-chevron-down' : 'fa-chevron-right')}></i>
            <span className="title no-select">
              <strong>{section.name}</strong>
            </span>
          </div>
        </div>
        <div>
          <SectionHamburgerMenu />
        </div>
      </div>
      <AnimateHeight height={isOpen ? 'auto' : 0} duration={500}>

        <Droppable droppableId={'section__' + section.id} type="question">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {questions.filter(q => q.section_id == section.id).sort((a, b) => a.sort_order - b.sort_order).map(question => (
                <Draggable key={question.id} draggableId={'question__' + question.id} index={question.sort_order}>
                  {(provided, snapshot) => (
                    <CurrentQuestionContext.Provider value={question}>
                      <Question ref={provided.innerRef} dragHandleProps={provided.dragHandleProps || undefined} draggableProps={provided.draggableProps} isDragging={snapshot.isDragging} />
                    </CurrentQuestionContext.Provider>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}

              <div className="question pb-3 pt-3 pl-4">
                <AddQuestionDropdown />
              </div>

            </div>
          )}
        </Droppable>



      </AnimateHeight>
    </div>
  );
};

export default Section;
