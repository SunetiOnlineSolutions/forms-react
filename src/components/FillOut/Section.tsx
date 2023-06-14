
import React from 'react';
import SectionClass from '../../classes/Section';
import CurrentQuestionContext from '../../context/CurrentQuestionContext';
import Question from './Question';

interface SectionProps {
  section: SectionClass;
}

const Section: React.FunctionComponent<SectionProps> = ({ section }) => {
  return <>
    <div className="section">
      <header className="section--legend mb-2">Section {section.sortOrder + 1}: {section.label}</header>
      <div className="section--content">
        {section.questions.map(question => (
          <CurrentQuestionContext.Provider key={question.id} value={question.toStored()}>
            <Question />
          </CurrentQuestionContext.Provider>
        ))}
      </div>
    </div>
  </>;
}

export default Section;



// Experiment:


export const Component: React.FC<{ count: number }> = ({ count }) => {

  const callback = React.useCallback(() => {

  }, []);

  React.useEffect(() => {



    return () => {
      console.log('Removing callback...');
    };
  });

  return <>{count}</>;
}
