import React from 'react';
import { DataStore } from '../context/DataStore';
import { Identifier } from '../types';
import DataTable, { TableColumn} from 'react-data-table-component';
import FormTemplate from '../classes/FormTemplate';

const Index= () => {

  const { selectors, actions } = React.useContext(DataStore);

  const columns: TableColumn<FormTemplate>[] = [
    {
      name: "ID",
      selector: (row: FormTemplate) => row.id
    },
    {
      name: "Name",
      selector: (row: FormTemplate) => row.name
    },
    {
      name: "Versions",
      selector: (row: FormTemplate) => row.versions.length
    },
    {
      name: "Actions",
      cell: (row: any) => {
        return (
          <div className="btn-group">
            <button className="btn btn-table bg-primary" onClick={() => { (window as any).ReactBridge_Index.show(row.id) }}>Show</button>
            <button className="btn btn-table bg-primary" onClick={() => { (window as any).ReactBridge_Index.edit(row.id) }}>Edit</button>
            <button className="btn btn-table bg-secondary" onClick={() => { (window as any).ReactBridge_Index.preview(row.id) }}>Preview</button>
            <button className="btn btn-table bg-primary" onClick={() => { (window as any).ReactBridge_Index.fillOut(row.id) }}>Fill out</button>
          </div>
        );
      }
    },
  ];

  React.useMemo(() => {
    (window as any).ReactBridge_Index = {
      show: (screenID: Identifier) => {
        const params = new URLSearchParams(window.location.search);
          params.set('type', 'show');
          params.append('screenID', screenID.toString());
          window.history.pushState(null, '', "?" + params.toString());
          document.location.reload();
       },
      edit: async (screenID: Identifier) => {
        const screen = selectors.templateByID(screenID);
        const latestVersion = screen.latestVersion();

        // If there is no latest version, we cannot navigate to the edit page of the form...
        if (latestVersion === undefined) {
          throw new Error('No latest version could be found when trying to navigate to the edit page.');
        }

        if (latestVersion?.versionStatusType === 'DRAFT') {
          // If the latest version is in draft, we can simply edit that version.

          const params = new URLSearchParams(window.location.search);
          params.set('type', 'builder');
          params.append('screenID', screenID.toString());
          window.history.pushState(null, '', "?" + params.toString());
          document.location.reload();
        } else {
          // If the latest version isn't draft it cannot be edited and we have to:
          //   1. Create a new version.
          //   2. Redirect to the edit page of the newly created version.
          await actions.versions.store({ version_status_type: 'DRAFT', form_template_id: latestVersion.formTemplate.id });

          const params = new URLSearchParams(window.location.search);
          params.set('type', 'builder');
          params.append('screenID', screenID.toString());
          window.history.pushState(null, '', "?" + params.toString());
          document.location.reload();
        }
      },
      preview: (screenID: Identifier) => {
        const params = new URLSearchParams(window.location.search);
          params.set('type', 'preview');
          params.append('screenID', screenID.toString());
          window.history.pushState(null, '', "?" + params.toString());
          document.location.reload();
      },
      fillOut: (screenID: Identifier) => {
        const params = new URLSearchParams(window.location.search);
          params.set('type', 'fillout');
          params.append('screenID', screenID.toString());
          window.history.pushState(null, '', "?" + params.toString());
          document.location.reload();
      }
    };
  }, [selectors]);

  return <>

    <DataTable
      title="Forms"
      columns={columns}
      data={selectors.templates()}
      pagination
    />

  </>;
}

export default Index;
