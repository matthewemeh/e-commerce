import axios from '../axios';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { AxiosError, AxiosResponse } from 'axios';
import { Product } from '../interfaces';

import Loading from '../components/Loading';
import ProductPreview from '../components/ProductPreview';

const CategoryPage = () => {
  const { category } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const searchedProducts: Product[] = useMemo(() => {
    return products.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, products]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/products/category/${category}`)
      .then((res: AxiosResponse) => {
        const products: Product[] = res.data;
        setProducts(products);
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        setLoading(false);
        console.log(err.message);
      });
  }, [category]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className='category-page-container text-center min-h-[90vh]'>
      <div
        className={`pt-3 ${category}-banner-container category-banner-container h-[200px] bg-[#182e39] flex justify-center items-center text-white`}
      >
        <h1 className='text-center capitalize'>{category}</h1>
      </div>

      <div className='filters-container flex justify-center py-4'>
        <input
          type='search'
          inputMode='search'
          placeholder='Search'
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      {searchedProducts.length === 0 ? (
        <h1>No products match your search</h1>
      ) : (
        <Container>
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <div className='flex justify-center items-center flex-wrap'>
                {searchedProducts.map((product: Product) => (
                  <ProductPreview key={product._id} {...product} />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </main>
  );
};

export default CategoryPage;
