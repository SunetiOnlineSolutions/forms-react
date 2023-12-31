import React from 'react';
import UnsavedSectionsContext from '../../context/UnsavedSectionsContext';
import { useCurrentVersion } from '../../hooks';
import { DataStore } from '../../context/DataStore';
import UnsavedQuestionsContext from '../../context/UnsavedQuestionsContext';

const AddSection: React.FunctionComponent = () => {

  const version = useCurrentVersion();
  const { actions } = React.useContext(DataStore);
  const { sections, addSection } = React.useContext(UnsavedSectionsContext);
  const { setEditing } = React.useContext(UnsavedQuestionsContext);

  const hasAtLeastOneSection = !!version && version.sections.length > 0;

  const add = async () => {
    if (!version) {
      return;
    }
    setEditing(true);
    await actions.sections.store({
      form_template_version_id: version.id,
      name: 'Section ' + (sections.length + 1),
    }).then((res) => {
      addSection(res);
      setEditing(false)});
  };

  return <>
    <div style={{
      width: '100%',
      backgroundColor: 'whitesmoke',
      height: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderTop: '1px solid rgba(0, 0, 0, 0.125)',
    }}>

      {!hasAtLeastOneSection && <h4 className="mb-3">
        Click the button below to create your first section
      </h4>}
      <button className="btn btn-primary btn-lg" style={{ width: '132px' }} onClick={add}>
        <span className="fas fa-plus"></span>
        &nbsp;
        Section
      </button>

    </div>
  </>;
}

export default AddSection;
