import PropType from 'prop-types';
import Image from '../Image/Image';
import './Card.scss';

function Card({ data, dataIndex }) {
  const { cover, name, job, feedback } = data[dataIndex];
  return (
    <div className="card-container">
      <Image src={cover} alt={`Feedback ${dataIndex}`} />
      <h4>{name}</h4>
      <h5>{job}</h5>
      <p>{feedback}</p>
    </div>
  );
}

Card.propType = {
  data: PropType.array,
  dataIndex: PropType.number,
};

export default Card;
