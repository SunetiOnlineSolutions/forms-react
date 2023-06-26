import React, { useEffect } from 'react';
import { DataStore } from './context/DataStore';
import Builder from './pages/Builder';
import './App.css';
import './Forms.css';
import Panel from './components/Panel';
import {useEffectOnce } from './hooks';
import FillOut from './pages/FillOut';
import { UnsavedAnswersProvider } from './context/UnsavedAnswersContext';
import Show from './pages/Show';
import { UnsavedQuestionsProvider } from './context/UnsavedQuestionsContext';
import { UnsavedSectionsProvider } from './context/UnsavedSectionsContext';

const App: React.FunctionComponent = () => {

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

  const handleMessage = (event:any) => {
      const data = event?.data?.payload;
      console.log(data?.message);
      console.log('Lukaa');
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

    case 'fillout':
      return (
        <UnsavedAnswersProvider>
          <div className="row justify-content-center">
            <div className="col-md-5">
              <Panel title="Form fill out">
                <FillOut />
              </Panel>
            </div>
          </div>
        </UnsavedAnswersProvider>
      );

    case 'show':
      return (
        <Panel title="Form show">
          <Show />
        </Panel>
      );

    default:
      throw new Error(`Unknown type: (${typeof type}) ${type}`);
  }
}

export default App;
