import React, { useEffect } from 'react';
import { DataStore } from './context/DataStore';
import Builder from './pages/Builder';
import './Forms.css';
import Panel from './components/Panel';
import { useCurrentVersion, useEffectOnce } from './hooks';
import FillOut from './pages/FillOut';
import { UnsavedAnswersProvider } from './context/UnsavedAnswersContext';
import Index from './pages/Index';
import Show from './pages/Show';
import Modal from './components/Modal';
import TextField from './components/FormElements/TextField';
import { UnsavedQuestionsProvider } from './context/UnsavedQuestionsContext';
import { UnsavedSectionsProvider } from './context/UnsavedSectionsContext';

const App: React.FunctionComponent = () => {

 const { actions } = React.useContext(DataStore);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newFormName, setNewFormName] = React.useState('');
    
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

  const createNewForm = async () => {
    setIsModalOpen(false);

    await actions.screens.store({ name: newFormName })
    .then(async (res) => {
     await actions.versions.store({ data_input_screen_id: res.id, form_version_status: 'DRAFT' });

     window.location.href = `/form-templates/edit?type=builder&screenID=${res.id}`;
    });

    
  }

  useEffectOnce(() => loadAll());

  const params = new URLSearchParams(window.location.search);

  if (!params.has('type')) {
    params.append('type', 'index');
    window.history.pushState(null, '', "?" + params.toString());
    document.location.reload();

    return <></>;
  }

  const type = params.get('type');

  const publish = React.useCallback(() => {
    if (!version) {
      alert('No version is set, cannot save.');
      return;
    }

  //  actions.versions.update({ ...version.toStored(), form_version_status: 'PUBLISHED' });
  }, [version]);

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
        <Panel title="Forms" buttons={
          <button className="btn btn-xs btn-primary" onClick={() => setIsModalOpen(true)}>
            <i className="fal fa-plus mr-2"></i>
            Form
          </button>
        }>
          <Modal title="Create a new form" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} buttons={
            <>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => createNewForm()}>Create new form</button>
            </>
          }>
            <div className="form-group">
              <TextField label="Name" value={newFormName} onChange={(value) => setNewFormName(value)}></TextField>
            </div>
          </Modal>
          <Index />
        </Panel>
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
