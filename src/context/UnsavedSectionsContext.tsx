import React from 'react';
import { StoredSection } from '../DataPersistence';

export type UnsavedSectionsContextParams = {
  sections: StoredSection[],
  setSections: (sections: StoredSection[]) => void,
  addSection: (section: StoredSection) => void,
  editSection: (section: StoredSection) => void,
  removeSection: (section: StoredSection) => void,
};

const UnsavedSectionsContext = React.createContext<UnsavedSectionsContextParams>({} as any);

export const UnsavedSectionsProvider = ({ children }: any) => {
  const [sections, setSections] = React.useState<Array<StoredSection>>([]);

  const addSection = React.useCallback((section: StoredSection) => setSections([...sections, section]), [sections]);
  const editSection = React.useCallback((updated: StoredSection) => setSections(sections.map(original => original.id === updated.id ? updated : original)), [sections]);
  const removeSection = React.useCallback((toRemove: StoredSection) => setSections(sections.map(section => {
    if (section.sort_order > toRemove.sort_order) {
      section.sort_order--;
    }

    return section;
  }).filter(original => original.id !== toRemove.id)), [sections]);

  return (
    <UnsavedSectionsContext.Provider value={{
      sections,
      setSections,
      addSection,
      editSection,
      removeSection,
    }}>
      {children}
    </UnsavedSectionsContext.Provider>
  );
};

export default UnsavedSectionsContext;
