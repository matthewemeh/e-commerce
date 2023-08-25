import { Badge, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { ResultInfo } from '../interfaces';

interface Props {
  _id: string;
  name: string;
  category: string;
  images: ResultInfo[];
}

const SimilarProduct: React.FC<Props> = ({ _id, category, name, images }) => {
  return (
    <LinkContainer to={`/product/${_id}`} className='cursor-pointer w-52 m-[10px]'>
      <Card className='w-80 m-[10px]'>
        <Card.Img
          variant='top'
          src={images[0].url}
          className='product-preview-img h-[150px] object-cover'
        />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Badge bg='warning' text='dark' className='capitalize'>
            {category}
          </Badge>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
};

export default SimilarProduct;
