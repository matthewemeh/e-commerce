import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Col, Form, Row, Button } from 'react-bootstrap';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import axios from '../axios';
import { AxiosResponse } from 'axios';
import { StripeElements, Stripe } from '@stripe/stripe-js';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';

import { showAlert } from '../utils';
import { GlobalState, User } from '../interfaces';
import { useCreateOrderMutation } from '../services/appApi';

const CheckoutForm = () => {
  const stripe: Stripe | null = useStripe();
  const elements: StripeElements | null = useElements();
  const user: User | null = useSelector((state: GlobalState) => state.user);

  const navigate: NavigateFunction = useNavigate();
  const countryRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const [paying, setPaying] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [createOrder, { isLoading, isError, isSuccess }] = useCreateOrderMutation();

  const handlePay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements || !user || (user?.cart.totalItems ?? 0) <= 0) {
      return showAlert({ msg: 'An error has occured' });
    }

    setPaying(true);

    const { client_secret } = await axios
      .post('/create-payment', { amount: user?.cart.totalPrice })
      .then((res: AxiosResponse) => {
        const responseData: { client_secret: string } = res.data;
        return responseData;
      });

    const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });

    setPaying(false);

    if (paymentIntent) {
      const address: string = addressRef.current!.value;
      const country: string = countryRef.current!.value;

      createOrder({ userID: user._id, cart: user.cart, address, country }).then(res => {
        if (!isLoading && !isError) {
          setAlertMessage(`Payment ${paymentIntent.status}`);
          setTimeout(() => navigate('/orders'), 2000);
        }
      });
    }
  };

  return (
    <Col className='cart-payment-container'>
      <Form onSubmit={handlePay}>
        <Row>
          {alertMessage && <Alert>{alertMessage}</Alert>}

          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>First Name</Form.Label>
              <Form.Control disabled type='text' placeholder='John Doe' value={user?.name ?? ''} />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                disabled
                type='email'
                inputMode='email'
                value={user?.email ?? ''}
                placeholder='johndoe23@gmail.com'
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Address</Form.Label>
              <Form.Control required type='text' ref={addressRef} placeholder='Your Address' />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Country</Form.Label>
              <Form.Control required type='text' ref={countryRef} placeholder='Country' />
            </Form.Group>
          </Col>
        </Row>

        <label htmlFor='card-element'>Card</label>
        <CardElement id='card-element' />
        <Button
          type='submit'
          className='mt-3'
          disabled={(user?.cart.totalItems ?? 0) <= 0 || paying || isSuccess}
        >
          {paying ? 'Processing...' : 'Pay'}
        </Button>
      </Form>
    </Col>
  );
};

export default CheckoutForm;
