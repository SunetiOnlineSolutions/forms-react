
import React from 'react';
import Section from '../components/FillOut/Section';
import { useCurrentVersion } from '../hooks';

const Preview: React.FunctionComponent = () => {


  const version = useCurrentVersion();

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
    </div>
  );
}

export default Preview;
