import React, { useEffect } from 'react';
import { DataStore } from './context/DataStore';
import Builder from './pages/Builder';
import './Forms.css';
import { useEffectOnce } from './hooks';
import FillOut from './pages/FillOut';
import { UnsavedAnswersProvider } from './context/UnsavedAnswersContext';
import Index from './pages/Index';
import Show from './pages/Show';
import { UnsavedQuestionsProvider } from './context/UnsavedQuestionsContext';
import { UnsavedSectionsProvider } from './context/UnsavedSectionsContext';
import Preview from './pages/Preview';

const AppCompiler: React.FunctionComponent = () => {

  const { actions } = React.useContext(DataStore);


  const loadAll = () => {
    actions.screens.load();
    actions.versions.load();
    actions.sections.load();
    actions.questions.load();
    actions.inputDataSets.load();
    actions.answers.load();
    actions.valueLists.load();
    actions.valueListItems.load();
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleMessage = (event: any) => {
    const data = event?.data?.payload;
    console.log(data?.message);
  };

  useEffectOnce(() => loadAll());

  const params = new URLSearchParams(window.location.search);

  if (!params.has('type')) {
    params.append('type', 'index');
    window.history.pushState(null, '', "?" + params.toString());
    document.location.reload();

    return <></>;
  }

  const type = params.get('type');

  switch (type) {
    case 'builder':
      return (
        <div>
          <UnsavedQuestionsProvider>
            <UnsavedSectionsProvider>
              <Builder />
            </UnsavedSectionsProvider>
          </UnsavedQuestionsProvider>
        </div>
      );

    case 'index':
      return (
          <Index />
      );

    case 'fillout':
      return (
        <UnsavedAnswersProvider>
          <FillOut />
        </UnsavedAnswersProvider>
      );

    case 'preview':
      return (
        <UnsavedAnswersProvider>
          <Preview />
        </UnsavedAnswersProvider>
      );

    case 'show':
      return (
        <Show />
      );

    default:
      throw new Error(`Unknown type: (${typeof type}) ${type}`);
  }
}

export default AppCompiler;
