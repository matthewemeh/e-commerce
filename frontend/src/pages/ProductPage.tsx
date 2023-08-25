import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import 'react-alice-carousel/lib/alice-carousel.css';

import AliceCarousel, { Responsive } from 'react-alice-carousel';
import { Col, Container, Badge, Row, ButtonGroup, Form, Button } from 'react-bootstrap';

import Loading from '../components/Loading';
import SimilarProduct from '../components/SimilarProduct';

import axios from '../axios';
import { useAddToCartMutation } from '../services/appApi';

import { showAlert } from '../utils';
import { GlobalState, Product, ResultInfo, User } from '../interfaces';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const user: User | null = useSelector((state: GlobalState) => state.user);
  const [addToCart, { isSuccess }] = useAddToCartMutation();
  const responsive: Responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 }
  };

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>): void => {
    e.preventDefault();
  };

  const handleAddToCart = () => {
    if (user && product && id) {
      addToCart({
        productID: id,
        userID: user._id,
        price: product.price
      });
    } else {
      showAlert({ msg: 'An error has occured' });
    }
  };

  const images: JSX.Element[] = useMemo(() => {
    return (
      product?.images.map((image: ResultInfo) => (
        <img
          src={image.url}
          key={image.public_id}
          onDragStart={handleDragStart}
          className='product__carousel--image max-w-full object-cover max-h-[500px]'
        />
      )) ?? []
    );
  }, [product]);

  const similarProductsList: JSX.Element[] = useMemo(() => {
    return similarProducts.map((product: Product, index: number) => (
      <div key={index} className='item' data-value={index}>
        <SimilarProduct {...product} />
      </div>
    ));
  }, [similarProducts]);

  useEffect(() => {
    axios
      .get(`/products/${id}`)
      .then((res: AxiosResponse) => {
        const productsResponse: { product: Product; similarProducts: Product[] } = res.data;
        setProduct(productsResponse.product);
        setSimilarProducts(productsResponse.similarProducts);
      })
      .catch((err: AxiosError) => console.log(err.message));
  }, [id]);

  useEffect(() => {
    if (isSuccess) showAlert({ msg: `Added ${product?.name ?? ''} to your cart` });
  }, [isSuccess]);

  if (!product) {
    return <Loading />;
  }

  return (
    <Container className='pt-4 relative'>
      <Row>
        <Col lg={6}>
          <AliceCarousel mouseTracking items={images} controlsStrategy='alternate' />
        </Col>

        <Col lg={6} className='pt-4'>
          <h1>{product.name}</h1>
          <p>
            <Badge bg='primary' className='capitalize'>
              {product.category}
            </Badge>
          </p>
          <p className='product__price'>${product.price}</p>
          <p className='text-justify py-3'>
            <strong>Description: </strong>
            {product.description}
          </p>

          {user?.isAdmin ? (
            <LinkContainer to={`/product/${product._id}/edit`}>
              <Button size='lg'>Edit Product</Button>
            </LinkContainer>
          ) : (
            <ButtonGroup className='w-[90%]'>
              <Form.Select size='lg' className='!w-2/5 !rounded-none'>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
              </Form.Select>
              <Button size='lg' onClick={handleAddToCart}>
                Add to cart
              </Button>
            </ButtonGroup>
          )}
        </Col>
      </Row>

      <div className='my-4'>
        <h2>Similar Products</h2>
        <div className='flex justify-center items-center flex-wrap'>
          <AliceCarousel
            mouseTracking
            responsive={responsive}
            items={similarProductsList}
            controlsStrategy='alternate'
          />
        </div>
      </div>
    </Container>
  );
};

export default ProductPage;
