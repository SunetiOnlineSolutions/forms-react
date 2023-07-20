import React from 'react';
import Modal from './../Modal';
import TextField from './../FormElements/TextField';
import { useSection, useSectionEdit } from '../../hooks';
import UnsavedSectionsContext from '../../context/UnsavedSectionsContext';
import { DataStore } from '../../context/DataStore';

const SectionHamburgerMenu: React.FunctionComponent = () => {
  const section = useSection();
  const { sections } = React.useContext(UnsavedSectionsContext);
  const [editSection] = useSectionEdit(section);
  const { actions } = React.useContext(DataStore);


  const [isRenameModalOpen, setIsRenameModalOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(section.name);

  const renameSection = () => {
    editSection({
      ...section,
      name: newName,
    });

    setIsRenameModalOpen(false);
  };

  const duplicateSection = () => {
    const duplicateSection = {...section, id:('temp__' + Math.random()).replace('.', '')}
    const currentSectionIndex = sections.findIndex((sec) => sec.id === section.id)
    sections.splice(currentSectionIndex, 0, duplicateSection)
    editSection(section)
  }

  return (<>
    <div className="dropdown section--hamburger-menu">
      <button className="btn btn-light dropdown-toggle hide-dropdown-toggle" id={"section--hamburger-menu_" + section.id} data-toggle="dropdown" aria-expanded="false">
        <span className="far fa-lg fa-fw fa-ellipsis-v"></span>
      </button>
      <div className="dropdown-menu dropdown-menu-right" aria-labelledby={"section--hamburger-menu_" + section.id}>
        <button className="dropdown-item" onClick={() => setIsRenameModalOpen(true)}>
          <span className="text-primary fal fa-fw fa-lg fa-i-cursor m-r-5"></span>
          Rename section
        </button>
        <button className="dropdown-item"  onClick={() => duplicateSection()}>
          <span className="text-primary fal fa-fw fa-lg fa-copy m-r-5"></span>
          Duplicate section
        </button>
        <button className="dropdown-item" onClick={() => actions.sections.delete(section)}>
          <span className="text-danger fal fa-fw fa-lg fa-trash-alt m-r-5"></span>
          Delete section
        </button>
      </div>
    </div >
    <Modal title="Rename section" isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} onOkay={renameSection}>
      <TextField label="Section name" value={newName} onChange={newVal => setNewName(newVal)}></TextField>
    </Modal>
  </>);
};

export default SectionHamburgerMenu;
