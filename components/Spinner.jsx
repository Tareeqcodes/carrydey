import { BeatLoader } from 'react-spinners';

const override = {
  display: 'block',
  margin: '200px auto',
  width: ' 100px'
};

const Spinner = ({ loading }) => {
  return (
    <BeatLoader
      color='#333'
      loading={loading}
      cssOverride={override}
      size={15}
    />
  );
};
export default Spinner;
