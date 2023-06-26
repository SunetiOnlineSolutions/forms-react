/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import Section from '../components/Builder/Section';
import { DataStore } from '../context/DataStore';
import { DragDropContext, DropResult, Droppable, Draggable } from '@react-forked/dnd'
import { useCurrentVersion } from '../hooks';
import AddSection from '../components/Builder/AddSection';
import TextField from '../components/FormElements/TextField';
import UnsavedQuestionsContext from '../context/UnsavedQuestionsContext';
import UnsavedSectionsContext from '../context/UnsavedSectionsContext';
import CurrentSectionContext from '../context/CurrentSectionContext';
import { Identifier } from '../types';
import { StoredQuestion, StoredSection } from '../DataPersistence';

const defaultFooterButtonStyle: React.CSSProperties = {
  cursor: 'pointer',
  float: 'right',
  font: '300 15px / 29px Open Sans, Helvetica, Arial, sans- serif',
  height: '31px',
  margin: '10px 0 0 5px',
  padding: '0 22px',
}

interface DropResultWithType extends DropResult {
  type: string
}

const Builder: React.FunctionComponent = () => {

  const { actions } = React.useContext(DataStore);
  const { setQuestions, questions } = React.useContext(UnsavedQuestionsContext);
  const { sections, setSections } = React.useContext(UnsavedSectionsContext);

  const version = useCurrentVersion();

  const [name, setName] = React.useState(version?.dataInputScreen?.name);

  // We have to set the name here again, because the name isn't present upon first loading the component.
  // The component isn't reloaded when the name changes, so we have to set it again.
  React.useEffect(() => setName(version?.dataInputScreen?.name), [version]);

  // We load the in-memory data store with the questions from the database.
  React.useEffect(() => {
    if (!version) {
      return;
    }

    setQuestions(version.sections.flatMap(section => section.questions).map(question => question.toStored()));
    setSections(version.sections.map(section => section.toStored()));
  }, [version]);

  React.useEffect(() => {
    if (!version || version.formVersionStatus === 'DRAFT') {
      return;
    }

    console.log('We should not edit this version but create a new one and edit thate one.');

     actions.versions.store({ form_version_status: 'DRAFT', data_input_screen_id: version.dataInputScreen.id });
  }, [version?.formVersionStatus]);

  const onDragEnd = (dropResult: DropResultWithType) => {
    if (dropResult.type === 'section') {
      onDropSection(dropResult);
    } else {
      onDropQuestion(dropResult);
    }
  }

  const onDropSection = (dropResult: DropResultWithType) => {
    if (!dropResult.destination) {
      return;
    }

    const sectionID: Identifier = dropResult.draggableId.replace('section__', '');

    const section = sections.find(section => section.id == sectionID) as StoredSection;

    if (section.sort_order === dropResult.destination.index) {
      return;
    }

    let reorderedSections: typeof sections;

    const originSortOrder = section.sort_order;
    const destinationSortOrder = dropResult.destination.index;

    if (dropResult.destination.index < section.sort_order) {
      // If re-ordering up: add one to the sort order of all items with a sort order greater than or equal to the destination sort order and less than the origin sort order
      reorderedSections = sections.map(section => {
        if (section.sort_order >= destinationSortOrder && section.sort_order < originSortOrder) {
          section.sort_order++;
        }

        return section;
      });
    } else {
      // If re-ordering down: remove one from the sort order of all items with a sort order greater than to the origin sort order and less than or equal to the destination sort order
      reorderedSections = sections.map(section => {
        if (section.sort_order > originSortOrder && section.sort_order <= destinationSortOrder) {
          section.sort_order--;
        }

        return section;
      });
    }

    reorderedSections = reorderedSections.map(section => section.id == sectionID ? { ...section, sort_order: destinationSortOrder } : section);

    setSections(reorderedSections);
  };

  const onDropQuestion = (dropResult: DropResultWithType) => {
    if (!dropResult.destination) {
      return;
    }

    const questionID: Identifier = dropResult.draggableId.replace('question__', '');

    const question = questions.find(question => question.id == questionID) as StoredQuestion;

    const originSection: Identifier = question.section_id;
    const destinationSection: Identifier = dropResult.destination.droppableId.replace('section__', '');
    const originSortOrder = question.sort_order;
    const destinationSortOrder = dropResult.destination.index;

    if (originSection === destinationSection && originSortOrder === destinationSortOrder) {
      console.log('NoOp');
      return;
    }

    let reorderedQuestions: typeof questions;

    if (originSection == destinationSection) {
      // If re-ordering within the same section:
      if (dropResult.destination.index < question.sort_order) {
        // If re-ordering up: add one to the sort order of all items with a sort order greater than or equal to the destination sort order and less than the origin sort order
        reorderedQuestions = questions.map(question => {
          if (question.sort_order >= destinationSortOrder && question.sort_order < originSortOrder) {
            question.sort_order++;
          }

          return question;
        });
      } else {
        // If re-ordering down: remove one from the sort order of all items with a sort order greater than to the origin sort order and less than or equal to the destination sort order
        reorderedQuestions = questions.map(question => {
          if (question.sort_order > originSortOrder && question.sort_order <= destinationSortOrder) {
            question.sort_order--;
          }

          return question;
        });
      }
    } else {
      // If re-parenting:

      // Within the origin section, remove one from the sort order of all items with a sort order greater than the origin sort order
      reorderedQuestions = questions.map(question => {
        if (question.section_id == originSection && question.sort_order > originSortOrder) {
          question.sort_order--;
        }

        return question;
      });


      // Within the destination section, add one to the sort order of all items with a sort order greater than or equal to the destination sort order
      reorderedQuestions = reorderedQuestions.map(question => {
        if (question.section_id == destinationSection && question.sort_order >= destinationSortOrder) {
          question.sort_order++;
        }

        return question;
      });
    }

    reorderedQuestions = reorderedQuestions.map(question => {
      if (question.id == questionID) {
        question.section_id = destinationSection;
        question.sort_order = destinationSortOrder;
      }

      return question;
    });

    setQuestions(reorderedQuestions);
  };

  const save = React.useCallback(async () => {
    if (!version) {
      return;
    }

   await actions.screens.update({ id: version?.dataInputScreen?.id , name: name as string });

   if (sections.length > 0) {
   await actions.sections.bulkUpdate(sections);
    }

   if (questions.length > 0) {
      await actions.questions.bulkUpdate(questions);
    }

    document.location.href = '/web-solution?type=index';
  }, [name, sections, questions]);

  const back = React.useCallback(() => window.history.back(), []);

  return (
    !version ? <></> :
      <div className="forms-builder">

        <div className="row mt-3 px-3">
          <div className="form-group col-md-3">
            <TextField label="Name" value={name} onChange={newVal => setName(newVal)}></TextField>
          </div>
          <div className="form-group col-md-2">
            <TextField label="Current version" value={'v' + version.dataInputScreen.versions.length.toString()} onChange={() => { }} readOnly />
          </div>
          <div className="form-group col-md-2">
            <TextField label="Total number of fillouts across all versions" value={version.dataInputScreen.versions.flatMap(version => version.inputDataSets).length.toString()} onChange={() => { }} readOnly />
          </div>
          <div className="form-group col-md-2">
            <TextField label="Form version status" value={version.formVersionStatus[0].toUpperCase()+version.formVersionStatus.substring(1).toLowerCase()} onChange={() => { }} readOnly />
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={'version__' + version.id} type="section">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {sections.sort((a, b) => a.sort_order - b.sort_order).map(section => (
                  <Draggable key={section.id} draggableId={'section__' + section.id} index={section.sort_order}>
                    {(provided, snapshot) => (
                      <CurrentSectionContext.Provider value={section}>
                        <Section key={section.id} draggableProvided={provided} draggableSnapshot={snapshot} />
                      </CurrentSectionContext.Provider>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

              </div>
            )}
          </Droppable>
        </DragDropContext>
        <AddSection></AddSection>
        <footer style={{ background: 'hsla(0, 0%, 97%, .9', padding: '7px 14px 15px', display: 'block', borderTop: '1px solid rgba(0, 0, 0, .1)' }}>
          <div className="row">
            <div className="col-lg-12">
              <button className="btn btn-primary" style={defaultFooterButtonStyle} onClick={save}>
                {version?.formVersionStatus === 'PUBLISHED' ? 'Save as new version' : 'Save'}
              </button>
              <button className="btn btn-secondary" style={defaultFooterButtonStyle} onClick={back}>Cancel</button>
            </div>
          </div>
        </footer>
      </div >
  );
};

export default Builder;
