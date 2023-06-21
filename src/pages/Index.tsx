/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react';
import DataInputScreen from '../classes/DataInputScreen';
import { DataStore } from '../context/DataStore';
import { Identifier } from '../types';

type RenderType = 'display' | 'sort' | 'filter' | 'type' | 'search';

const Index: React.FunctionComponent = () => {

  const { selectors, actions } = React.useContext(DataStore);

  React.useMemo(() => {
    (window as any).ReactBridge_Index = {
      show: (screenID: Identifier) => { },
      edit: async (screenID: Identifier) => {
        const screen = selectors.screenByID(screenID);
        const latestVersion = screen.latestVersion();

        // If there is no latest version, we cannot navigate to the edit page of the form...
        if (latestVersion === undefined) {
          throw new Error('No latest version could be found when trying to navigate to the edit page.');
        }

        if (latestVersion?.formVersionStatus === 'DRAFT') {
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
          await actions.versions.store({ form_version_status: 'DRAFT', data_input_screen_id: latestVersion.dataInputScreen.id });

          const params = new URLSearchParams(window.location.search);
          params.set('type', 'builder');
          params.append('screenID', screenID.toString());
          window.history.pushState(null, '', "?" + params.toString());
          document.location.reload();
        }
      },
      preview: (screenID: Identifier) => { },
      fillOut: (screenID: Identifier) => {
        const params = new URLSearchParams(window.location.search);
          params.set('type', 'fillout');
          params.append('screenID', screenID.toString());
          window.history.pushState(null, '', "?" + params.toString());
          document.location.reload();
      },
      delete: (screenID: Identifier) => { },
    };
  }, [selectors]);

  React.useEffect(() => {
    let datatable: any;

    if (selectors.screens().length) {
      datatable = $('#forms--index').DataTable({
        columnDefs: [{
          "defaultContent": "-",
          "targets": "_all"
        }],
        data: selectors.screens(),
        columns: [
          {
            width: '8%',
            render: (_: never, type: RenderType, screen: DataInputScreen) => screen.id
          },
          {
            render: (_: never, type: RenderType, screen: DataInputScreen) => screen.name
          },
          {
            width: '12%',
            render: (_: never, type: RenderType, screen: DataInputScreen) => screen.versions.length
          },
          {
            width: '16%',
            render: (_: never, type: RenderType, screen: DataInputScreen) => {
              return `
                <div class="btn-group">
                  <button class="btn btn-xs btn-primary" onclick="window.ReactBridge_Index.show(${screen.id})">Show</button>
                  <button class="btn btn-xs btn-primary" onclick="window.ReactBridge_Index.edit(${screen.id})">Edit</button>
                  <button class="btn btn-xs btn-secondary" onclick="window.ReactBridge_Index.preview(${screen.id})">Preview</button>
                  <button class="btn btn-xs btn-primary" onclick="window.ReactBridge_Index.fillOut(${screen.id})">Fill out</button>
                  <button class="btn btn-xs btn-danger" onclick="window.ReactBridge_Index.delete(${screen.id})">Delete</button>
                </div>
              `;
            }
          },
        ],
      });
    }

    return () => datatable?.destroy();
  }, [selectors]);

  return <>

    <table id="forms--index" className="table table-striped table-bordered dataTable no-footer dtr-inline">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Versions</th>
          <th>Actions</th>
        </tr>
      </thead>
    </table>

  </>;
}

export default Index;
