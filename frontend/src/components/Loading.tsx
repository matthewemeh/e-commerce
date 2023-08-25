import { Spinner } from 'react-bootstrap';

const Loading = () => {
  return (
    <div className='loading-container min-h-screen flex items-center justify-center'>
      <Spinner animation='grow' />
    </div>
  );
};

export default Loading;
