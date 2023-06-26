import React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useEffectOnce, useQuestion, useUnsavedAnswer } from '../../../hooks';

const Signature: React.FunctionComponent = () => {
  const question = useQuestion();
  const [_signature, setSignature, isValid, validationMessage, registerCallback] = useUnsavedAnswer(question.id);

  const [forceShowInvalid, setForceShowInvalid] = React.useState(false);

  useEffectOnce(() => registerCallback(() => setForceShowInvalid(true)));

  const style: React.CSSProperties = React.useMemo(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: '5px',
    border: (forceShowInvalid && !isValid) ? 'rgba(255, 0, 0, 0.5) 1px solid' : 'rgba(0, 0, 0, 0.125) 1px solid',
  }), [isValid, forceShowInvalid]);

  const ref: React.MutableRefObject<SignatureCanvas> = React.useRef() as React.MutableRefObject<SignatureCanvas>;

  const clear = () => {
    ref.current?.clear();
    setSignature('');
  };

  return <>
    <SignatureCanvas ref={ref} clearOnResize={false} canvasProps={{ style }} onEnd={() => setSignature(ref.current?.toDataURL())} />

    <div className="d-flex justify-content-between align-items-center">
      <span className="invalid-feedback d-block">{forceShowInvalid && !isValid && validationMessage}</span>
      <button className="btn btn-primary" onClick={clear}>Clear</button>
    </div>
  </>;
}

export default Signature;
