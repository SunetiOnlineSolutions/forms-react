
import React from 'react';
import Section from '../components/FillOut/Section';
import UnsavedAnswersContext from '../context/UnsavedAnswersContext';
import { useCurrentVersion } from '../hooks';

const FillOut: React.FunctionComponent = () => {

  const { saveAnswers, unsavedAnswers } = React.useContext(UnsavedAnswersContext);

  const version = useCurrentVersion();

  const submit = React.useCallback(async () => {
    const saved = await saveAnswers(version, unsavedAnswers);

    if (saved === 'invalid_answer') {
      toastr.warning('Your answers have not been saved.', 'Check validation!');
      return;
    } else if (saved !== true) {
      toastr.error('Your answers have not been saved.', 'Error!');
      return;
    }

    toastr.success('Your answers have been saved.', 'Saved!');
  }, [version, unsavedAnswers]);

  if (!version) {
    return <></>;
  }

  return (
    <div className="forms-fillout mb-3">
      <header className="forms-fillout--header mt-2 mb-4 mx-4 text-black">
        <span className="forms-fillout--header--main">{version.formTemplate.name}</span>
        <br />
        <span className="forms-fillout--header--sub">
          <strong>Author:</strong> Niek van den Bos <strong>| Version:</strong> {version.version}</span>
      </header>

      <div className="forms-fillout--sections">
        {version.sections.sort((a, b) => a.sortOrder - b.sortOrder).map(section => <Section key={section.id} section={section} />)}
      </div>

      <div className="forms-fillout--footer d-flex justify-content-end align-items-center p-5 mr-2 mt-3 mb-2">
        <button className="btn btn-secondary mr-2">Discard</button>
        <button className="btn btn-primary" onClick={submit}>Save answers</button>
      </div>
    </div>
  );
}

export default FillOut;
