/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import Chart from 'react-google-charts';
import Answer from '../classes/Answer';
import InputDataSet from '../classes/InputDataSet';
import TextField from '../components/FormElements/TextField';
import Tabs from '../components/Tabs';
import Tab from '../components/Tab';
import { useCurrentVersion } from '../hooks';
import AnswerVisualizerFactory from '../AnswerVisualizer';

const Show: React.FunctionComponent = () => {

  const version = useCurrentVersion();

  const [index, setIndex] = React.useState<number>(0);

  const dataset: InputDataSet | undefined = React.useMemo(() => {
    if (version) {
      return version.inputDataSets[index];
    }
  }, [index, version]);

  const data = React.useMemo(() => {

    if (!dataset) {
      return [['Question', 'Answer']];
    }

    const question = dataset.formTemplateVersion.sections.flatMap(section => section.questions)[0];
    const options = question?.options.multipleChoice?.customValues ?? [];

    return [
      ['Question', 'Answer'],
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...options?.map(option => {
        return [option, version?.inputDataSets.flatMap(set => set.answers).filter(answer => answer.question.id === question.id && (answer.value as any).label === option).length];
      })
    ];
  }, [dataset]);

  if (!version) {
    return <></>;
  }

  return (<>
    <Tabs>
      <Tab label="Details">
        <div className="row mt-3">
          <div className="form-group col-md-3">
            <TextField label="Name" value={version.formTemplate.name} onChange={() => { }} readOnly />
          </div>
          <div className="form-group col-md-2">
            <TextField label="Number of versions" value={version.formTemplate.versions.length.toString()} onChange={() => { }} readOnly />
          </div>
          <div className="form-group col-md-2">
            <TextField label="Number of fillouts" value={version.inputDataSets.length.toString()} onChange={() => { }} readOnly />
          </div>
        </div>
      </Tab>

      <Tab label="Results">
        {version.sections.flatMap(section => section.questions).map((question, i) => (
          <div key={i}>
            <h6>{question.name}</h6>

            {question.answerType === 'MULTIPLE_CHOICE' &&
              <Chart
                width={'300px'}
                height={'300px'}
                loader={<div>Loading Chart</div>}
                chartType="PieChart"
                data={data}
                options={{ is3D: true }}
              />
            }
          </div>
        ))}
      </Tab>

      <Tab label="Fillouts">
        <div className="mt-3 d-flex justify-content-center align-items-center">
          <button className="btn btn-primary mr-3" disabled={typeof version.inputDataSets[index - 1] === 'undefined'} onClick={() => setIndex(index - 1)}>
            <span className="fas fa-chevron-left mr-2"></span>
            Previous
          </button>
          <span className="mr-3">
            <strong>Dataset: </strong>
            {(version.inputDataSets.length === 0 ? -1 : index) + 1}/{version.inputDataSets.length}
          </span>
          <button className="btn btn-primary" disabled={typeof version.inputDataSets[index + 1] === 'undefined'} onClick={() => setIndex(index + 1)}>
            Next
            <span className="fas fa-chevron-right ml-2"></span>
          </button>
        </div>

        <table className="table table-striped">

          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>

          <tbody>

            {dataset && dataset.answers.map((answer: Answer) => (
              <tr key={answer.id}>
                <td>{answer.question.name}</td>
                <td>
                  {AnswerVisualizerFactory.create(answer).visualize()}
                </td>
              </tr>
            ))}


          </tbody>

        </table>
      </Tab>
    </Tabs>
  </>);
}

export default Show;
