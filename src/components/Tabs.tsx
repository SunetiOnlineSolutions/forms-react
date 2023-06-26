import React from 'react';

interface Props {
  children: React.ReactElement[];
}

const Tabs: React.FunctionComponent<Props> = ({ children }) => {

  const [activeTab, setActiveTab] = React.useState<number>(0);

  return <>
    <div className="bd bd-tabs">
      <ul className="nav nav-tabs" role="tablist">
        {children.map(child => child.props.label).map((title, index) => (
          <li key={index} className="nav-item">
            <a
              href={'#' + title}
              className={"nav-link no-select" + (activeTab === index ? " active" : "")}
              onClick={() => setActiveTab(index)}
              onDragStart={(event) => { event.preventDefault(); setActiveTab(index); }}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {children.map((child, index) => (
          <div key={index} className={"tab-pane fade" + (activeTab === index ? ' show active' : '')} role="tabpanel">
            {child}
          </div>
        ))}
      </div>
    </div>
  </>;
}

export default Tabs;
