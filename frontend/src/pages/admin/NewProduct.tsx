import { useRef, useState } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';

import axios from '../../axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useCreateProductMutation } from '../../services/appApi';

import { showAlert } from '../../utils';
import { Result, ResultInfo } from '../../interfaces';

const NewProduct = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [images, setImages] = useState<ResultInfo[]>([]);
  const [imageToRemove, setImageToRemove] = useState<string | null>('');

  const navigate: NavigateFunction = useNavigate();
  const [createProduct, { isError, isLoading, isSuccess }] = useCreateProductMutation();

  const showWidget = (): void => {
    try {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.REACT_APP_CLOUD_NAME!,
          uploadPreset: process.env.REACT_APP_UPLOAD_PRESET!,
        },
        (error: any, result: Result) => {
          const { url, public_id } = result.info || {};
          if (!error && result.event === 'success') {
            setImages(prev => [...prev, { url, public_id }]);
          }
        }
      );

      widget.open();
    } catch (error) {
      console.log(error);
      showAlert({ msg: 'An error has occured. Please refresh your browser again' });
    }
  };

  const handleRemoveImage = (image: ResultInfo): void => {
    const { public_id } = image;
    setImageToRemove(public_id);

    axios
      .delete(`/images/${public_id}/`)
      .then((res: AxiosResponse) => {
        setImageToRemove(null);
        setImages(prev => prev.filter(image => image.public_id !== public_id));
      })
      .catch((err: AxiosError) => console.log(err.message));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const name: string = nameRef.current!.value;
    const price: string = priceRef.current!.value;
    const category: string = categoryRef.current!.value;
    const description: string = descriptionRef.current!.value;

    if (!category || images.length === 0) {
      return showAlert({ msg: 'Please fill out all the fields' });
    }

    createProduct({ name, description, price, category, images }).then(
      (res: { data: any } | { error: FetchBaseQueryError | SerializedError }) => {
        const productAdded: boolean = 'data' in res && res.data.length > 0;
        if (productAdded) {
          showAlert({ msg: 'Product added successfully' });
          setTimeout(() => navigate('/'), 2000);
        } else {
          showAlert({ msg: 'An error has occured' });
        }
      }
    );
  };

  return (
    <Container className='text-center'>
      <Row>
        <Col md={6} className='new-product__form--container'>
          <Form className='container' onSubmit={handleSubmit}>
            <h1 className='mt-4'>Create a product</h1>

            {isSuccess && <Alert variant='success'>Product created successfully</Alert>}
            {isError && <Alert variant='danger'>An error has occured</Alert>}

            <Form.Group className='mb-3'>
              <Form.Label>Product name</Form.Label>
              <Form.Control
                required
                autoFocus
                type='text'
                ref={nameRef}
                spellCheck='false'
                placeholder='Enter product name'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Product description</Form.Label>
              <Form.Control
                required
                type='text'
                as='textarea'
                ref={descriptionRef}
                className='h-[100px]'
                placeholder='Enter product description'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Price($)</Form.Label>
              <Form.Control
                required
                type='number'
                ref={priceRef}
                inputMode='decimal'
                placeholder='Enter product price ($)'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Category</Form.Label>
              <Form.Select ref={categoryRef} title='category' defaultValue=''>
                <option value='' disabled>
                  -- Select One --
                </option>
                <option value='technology'>technology</option>
                <option value='tablets'>tablets</option>
                <option value='phones'>phones</option>
                <option value='laptops'>laptops</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Button type='button' onClick={showWidget}>
                Upload Images
              </Button>

              <div className='images-preview-container grid grid-cols-[repeat(auto-fill,minmax(min(100px,100%),1fr))] gap-[10px] mt-10'>
                {images.map(
                  (image: ResultInfo) =>
                    imageToRemove !== image.public_id && (
                      <div
                        key={image.public_id}
                        className='image-preview w-[100px] inline-block relative'
                      >
                        <img
                          alt=''
                          src={image.url}
                          className='w-full h-[100px] object-cover rounded-[10px]'
                        />
                        <FaTimesCircle
                          onClick={() => handleRemoveImage(image)}
                          className='absolute -top-3 -left-3 text-[20px] cursor-pointer duration-300 hover:text-orange-600'
                        />
                      </div>
                    )
                )}
              </div>
            </Form.Group>

            <Form.Group>
              <Button type='submit' disabled={isLoading || isSuccess}>
                Create Product
              </Button>
            </Form.Group>

            <p>
              Don't have an account? <Link to='/signup'>Create account</Link>
            </p>
          </Form>
        </Col>
        <Col
          md={6}
          className='new-product__image--container h-screen bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1652773899966-583e9d2f2b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzR8fHRlY2h8ZW58MHwxfDB8d2hpdGV8&auto=format&fit=crop&w=800&q=60)] tablets:hidden'
        ></Col>
      </Row>
    </Container>
  );
};

export default NewProduct;
