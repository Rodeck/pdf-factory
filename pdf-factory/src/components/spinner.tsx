import { Stack } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

function Spin() {
  return (
    <Stack direction='horizontal'>
        <Spinner animation="border" role="status" className="col-md-5 mx-auto">
        <span className="visually-hidden">Loading...</span>
        </Spinner>
    </Stack>
  );
}

export default Spin;