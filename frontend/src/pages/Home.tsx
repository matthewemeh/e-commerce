import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { AxiosError, AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

import axios from '../axios';
import { updateProducts } from '../features/productSlice';
import { Category, GlobalState, Product } from '../interfaces';

import ProductPreview from '../components/ProductPreview';

const Home = () => {
  const categories: Category[] = [
    { name: 'technology', image: 'bg-[url(./assets/technology.png)]' },
    { name: 'phones', image: 'bg-[url(./assets/phones.png)]' },
    { name: 'laptops', image: 'bg-[url(./assets/laptops.png)]' },
  ];
  const dispatch = useDispatch();
  const products: Product[] | null = useSelector((state: GlobalState) => state.products);
  const lastestProducts: Product[] = products?.slice(0, 8) ?? [];

  useEffect(() => {
    axios
      .get('/products')
      .then((res: AxiosResponse) => {
        const products: Product[] = res.data;
        dispatch(updateProducts(products));
      })
      .catch((err: AxiosError) => console.log(err.message));
  }, []);

  return (
    <main className='text-center'>
      <img
        alt=''
        className='home-banner'
        src='https://res.cloudinary.com/learn-code-10/image/upload/v1653947013/yqajnhqf7usk56zkwqi5.png'
      />

      <section className='featured-products-container container mt-4'>
        <h2>Latest products</h2>
        <div className='flex justify-center flex-wrap'>
          {lastestProducts.map((product: Product) => (
            <ProductPreview key={product._id} {...product} />
          ))}
        </div>
      </section>

      <div>
        <Link to='/category/all' className='text-right block no-underline'>
          See more &gt;&gt;
        </Link>
      </div>

      {/* banner */}
      <section className='sale__banner--container mt-4'>
        <img
          alt=''
          className='max-w-[1200px] block mx-auto'
          src='https://res.cloudinary.com/learn-code-10/image/upload/v1654093280/xkia6f13xxlk5xvvb5ed.png'
        />
      </section>

      <section className='recent-products-container container mt-4'>
        <h2>Categories</h2>
        <Row>
          {categories.map(({ name, image }: Category) => (
            <LinkContainer key={name} to={`/category/${name}`}>
              <Col md={4}>
                <div
                  className={`categoty-tile relative gap-[10px] capitalize h-[250px] bg-cover bg-center !px-5 flex justify-center items-center text-white text-[30px] cursor-pointer duration-300 mt-[30px] hover:scale-105 after:content-[''] after:absolute after:bg-[rgba(0,0,0,0.5)] after:w-full after:h-full ${image}`}
                >
                  <p className='z-[1]'>{name}</p>
                </div>
              </Col>
            </LinkContainer>
          ))}
        </Row>
      </section>
    </main>
  );
};

export default Home;
