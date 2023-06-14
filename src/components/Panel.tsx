import { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

interface PanelProps {
  title?: string;
  children?: React.ReactNode;
  buttons?: React.ReactNode;
}

const Panel: FunctionComponent<PanelProps> = ({ children, title = "", buttons }) => {
  return (
    <>
      <div className="panel-inverse panel" data-sortable="false">
        <div className="panel-heading">

          <div className="panel-controls">
            <div className="vertical-line"></div>

            <button className="btn btn-xs btn-icon btn-circle btn-default mr-1 ml-1" data-click="panel-expand">
              <i className="fa fa-expand"></i>
            </button>

            <button className="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse-suneti">
              <i className="fa fa-minus"></i>
            </button>
          </div>

          <div className="panel-heading-btn-group">
            {buttons}
          </div>

          <h4 className="panel-title">{title}</h4>
        </div>

        <div className="panel-body no-padding">
          {children}
        </div>

      </div>
    </>
  );
};
export default Panel;

const parent = document.getElementById('react-panel')
  if (parent) {
  const title = parent.getAttribute('title') || '';
  ReactDOM.render(<Panel title={title} buttons={<Button children={<>Ok</>} />} />, parent);
  }


