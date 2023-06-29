import React from 'react';
import UnsavedSectionsContext from '../../context/UnsavedSectionsContext';
import { useCurrentVersion } from '../../hooks';

interface Props {

}

const AddSection: React.FunctionComponent<Props> = ({ }) => {

  const version = useCurrentVersion();
  const { sections, addSection } = React.useContext(UnsavedSectionsContext);

  const hasAtLeastOneSection = !!version && version.sections.length > 0;

  const add = () => {
    if (!version) {
      return;
    }

    addSection({
      id: ('temp__' + Math.random()).replace('.', ''),
      data_input_screen_version_id: version.id,
      name: 'Section ' + (sections.length + 1),
      sort_order: Math.max(...sections.map(s => s.sort_order), 0) + 1,
    });
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
