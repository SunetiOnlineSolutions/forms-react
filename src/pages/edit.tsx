import ReactDOM from 'react-dom';
import { UnsavedQuestionsProvider } from "../context/UnsavedQuestionsContext";
import { UnsavedSectionsProvider } from "../context/UnsavedSectionsContext";
import Builder from "./Builder";

const EditFormTemplate = () => {
  return (
    <div>
      <UnsavedQuestionsProvider>
         <UnsavedSectionsProvider>
           <Builder />
         </UnsavedSectionsProvider>
      </UnsavedQuestionsProvider>
    </div>
  );
}

export default EditFormTemplate;

const parent = document.getElementById('edit-form-template')
  if (parent) {
  ReactDOM.render(<EditFormTemplate />, parent);
  }
