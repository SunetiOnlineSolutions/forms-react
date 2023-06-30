/* eslint-disable no-case-declarations */
import { DataStore, initialState } from ".";
import {
  StoredAnswer,
  StoredFormTemplate,
  StoredFormTemplateVersion,
  StoredInputDataset,
  StoredQuestion,
  StoredSection,
  StoredValueList,
  StoredValueListItem
} from "../../DataPersistence";
import { Action } from "./actions";

const updateElem = <Type>(array: Type[], predicate: (value: Type) => boolean, toUpdate: Type): Type[] => {
  const index = array.findIndex(predicate);

  return [
    ...array.slice(0, index),
    toUpdate,
    ...array.slice(index + 1)
  ];
}

const reducer = (state: DataStore, action: Action): DataStore => {
  switch (action.type) {
    case "RESET":
      return { ...initialState };


    // Data input templates
    case "LOAD_TEMPLATES":
      return { ...state, templates: [...action.payload] };

    case "STORE_TEMPLATE":
      return { ...state, templates: [...state.templates, action.payload] };

    case "UPDATE_TEMPLATE":
      return {
        ...state, templates: updateElem(
          state.templates,
          (template: StoredFormTemplate) => template.id === action.payload.id,
          action.payload
        )
      }

    case "DELETE_TEMPLATE":
      return { ...state, templates: state.templates.filter(template => template.id !== action.payload.id) };


    // Data input screen versions
    case "LOAD_VERSIONS":
      return { ...state, versions: [...action.payload] };

    case "STORE_VERSION":
      return { ...state, versions: [...state.versions, action.payload] };

    case "UPDATE_VERSION":
      return {
        ...state, versions: updateElem(
          state.versions,
          (version: StoredFormTemplateVersion) => version.id === action.payload.id,
          action.payload
        )
      }

    case "DELETE_VERSION":
      return { ...state, versions: state.versions.filter(version => version.id !== action.payload.id) };


    // Sections
    case "LOAD_SECTIONS":
      return { ...state, sections: [...action.payload] };

    case "STORE_SECTION":
      return { ...state, sections: [...state.sections, action.payload] };

    case "UPDATE_SECTION":
      return {
        ...state, sections: updateElem(
          state.sections,
          (section: StoredSection) => section.id === action.payload.id,
          action.payload
        )
      }

    case "BULK_UPDATE_SECTIONS":
      return { ...state, sections: [...action.payload] };

    case "REORDER_SECTION":
      const sections: StoredSection[] = [...state.sections];
      const sectionToEdit = sections.find(section => section.id === action.payload.id) as StoredSection;

      if (sectionToEdit.sort_order == action.payload.sort_order) {
        // Nothing has changed so we don't need to do anything here.
        return state;
      }

      if (action.payload.sort_order > sectionToEdit.sort_order) {
        // The particular section was moved down, so we need to move all the other sections up by 1.
        sections
          .filter(section => section.id != action.payload.id)
          .filter(section => section.sort_order > sectionToEdit.sort_order && section.sort_order <= action.payload.sort_order)
          .forEach(section => section.sort_order--);
      } else {
        // The particular section was moved up, so we need to move all the other sections down by 1.
        sections
          .filter(section => section.id != action.payload.id)
          .filter(section => section.sort_order < sectionToEdit.sort_order && section.sort_order >= action.payload.sort_order)
          .forEach(section => section.sort_order++);
      }

      return {
        ...state, sections: updateElem(sections, section => section.id === action.payload.id, action.payload)
      }

    case "DELETE_SECTION":
      return { ...state, sections: state.sections.filter(section => section.id !== action.payload.id) };


    // Questions
    case "LOAD_QUESTIONS":
      return { ...state, questions: [...action.payload] };

    case "STORE_QUESTION":
      return { ...state, questions: [...state.questions, action.payload] };

    case "UPDATE_QUESTION":
      return {
        ...state, questions: updateElem(
          state.questions,
          (question: StoredQuestion) => question.id === action.payload.id,
          action.payload
        )
      }

    case "BULK_UPDATE_QUESTIONS":
      return { ...state, questions: [...action.payload] };

    case "REORDER_QUESTION":
      const questions: StoredQuestion[] = [...state.questions];
      const questionToEdit = questions.find(question => question.id === action.payload.id) as StoredQuestion;

      if (questionToEdit.section_id == action.payload.section_id && questionToEdit.sort_order == action.payload.sort_order) {
        // Nothing has changed so we don't need to do anything here.
        return state;
      }

      if (action.payload.section_id != questionToEdit.section_id) {
        questions
          .filter(question => question.id != action.payload.id)
          .forEach(question => {
            if (question.section_id == questionToEdit.section_id && question.sort_order > questionToEdit.sort_order) {
              question.sort_order--;
            } else if (question.section_id == action.payload.section_id && question.sort_order >= questionToEdit.sort_order) {
              question.sort_order++;
            }
          });
      } else {
        if (action.payload.sort_order > questionToEdit.sort_order) {
          // The particular question was moved down, so we need to move all the other questions up by 1.
          questions
            .filter(question => question.id != action.payload.id)
            .filter(question => question.section_id == action.payload.section_id)
            .filter(question => question.sort_order > questionToEdit.sort_order && question.sort_order <= action.payload.sort_order)
            .forEach(question => {
              question.sort_order--;
            });
        } else {
          // The particular question was moved up, so we need to move all the other questions down by 1.
          questions
            .filter(question => question.id != action.payload.id)
            .filter(question => question.section_id == action.payload.section_id)
            .filter(question => question.sort_order < questionToEdit.sort_order && question.sort_order >= action.payload.sort_order)
            .forEach(question => {
              question.sort_order++;
            });
        }
      }

      return {
        ...state, questions: updateElem(questions, question => question.id === action.payload.id, action.payload)
      }

    case "DELETE_QUESTION":
      return { ...state, questions: state.questions.filter(question => question.id !== action.payload.id) };


    // Input data sets
    case "LOAD_INPUT_DATA_SETS":
      return { ...state, inputDataSets: [...action.payload] };

    case "STORE_INPUT_DATA_SET":
      return { ...state, inputDataSets: [...state.inputDataSets, action.payload] };

    case "UPDATE_INPUT_DATA_SET":
      return {
        ...state, inputDataSets: updateElem(
          state.inputDataSets,
          (inputDataSet: StoredInputDataset) => inputDataSet.id === action.payload.id,
          action.payload
        )
      }

    case "DELETE_INPUT_DATA_SET":
      return { ...state, inputDataSets: state.inputDataSets.filter(inputDataSet => inputDataSet.id !== action.payload.id) };


    // Answers
    case "LOAD_ANSWERS":
      return { ...state, answers: [...action.payload] };

    case "STORE_ANSWER":
      return { ...state, answers: [...state.answers, action.payload] };

    case "UPDATE_ANSWER":
      return {
        ...state, answers: updateElem(
          state.answers,
          (answer: StoredAnswer) => answer.id === action.payload.id,
          action.payload,
        )
      }

    case "DELETE_ANSWER":
      return { ...state, answers: state.answers.filter(answer => answer.id !== action.payload.id) };


    // Value lists
    case "LOAD_VALUE_LISTS":
      return { ...state, valueLists: [...action.payload] };

    case "STORE_VALUE_LIST":
      return { ...state, valueLists: [...state.valueLists, action.payload] };

    case "UPDATE_VALUE_LIST":
      return {
        ...state, valueLists: updateElem(
          state.valueLists,
          (list: StoredValueList) => list.id === action.payload.id,
          action.payload
        )
      }

    case "DELETE_VALUE_LIST":
      return { ...state, valueLists: state.valueLists.filter(item => item.id !== action.payload.id) };


    // Value list items
    case "LOAD_VALUE_LIST_ITEMS":
      return { ...state, valueListItems: [...action.payload] };

    case "STORE_VALUE_LIST_ITEM":
      return { ...state, valueListItems: [...state.valueListItems, action.payload] };

    case "UPDATE_VALUE_LIST_ITEM":
      return {
        ...state, valueListItems: updateElem(
          state.valueListItems,
          (item: StoredValueListItem) => item.id === action.payload.id,
          action.payload,
        )
      }

    case "DELETE_VALUE_LIST_ITEM":
      return { ...state, valueListItems: state.valueListItems.filter(item => item.id !== action.payload.id) };


    default:
      return state;
  }
}

export default reducer;
