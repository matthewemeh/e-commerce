import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Alert, Col, Container, Row, Table } from 'react-bootstrap';

import CheckoutForm from '../components/CheckoutForm';
import { FaTimes, FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import {
  useRemoveFromCartMutation,
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
} from '../services/appApi';
import { showAlert } from '../utils';
import { Cart, GlobalState, Product, User } from '../interfaces';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const CartPage = () => {
  const user: User | null = useSelector((state: GlobalState) => state.user);
  const products: Product[] | null = useSelector((state: GlobalState) => state.products);
  const userCart: Cart = user?.cart ?? { totalPrice: 0, totalItems: 0 };

  const cartProducts: Product[] = useMemo(() => {
    /* filter products based on those whose ids are in the userCart(as keys) */
    return products?.filter(({ _id }) => _id in userCart) ?? [];
  }, [products, userCart]);
  const [increaseCart] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const [removeCart, { isLoading }] = useRemoveFromCartMutation();

  const handleDecrease = (product: Product) => {
    const quantity: number = user?.cart.totalItems ?? 0;

    if (quantity <= 0) {
      showAlert({ msg: 'Error' });
    } else if (user) {
      decreaseCart({ userID: user._id, productID: product._id, price: product.price });
    } else {
      showAlert({ msg: 'An error has occured' });
    }
  };

  const handleIncrease = (product: Product) => {
    if (user) {
      increaseCart({ userID: user._id, productID: product._id, price: product.price });
    } else {
      showAlert({ msg: 'An error has occured' });
    }
  };

  const handleRemove = (product: Product) => {
    if (user) {
      removeCart({ userID: user._id, productID: product._id, price: product.price });
    } else {
      showAlert({ msg: 'An error has occured' });
    }
  };

  return (
    <Container className='cart-container min-h-[95vh] text-center'>
      <Row>
        <Col>
          <h1 className='pt-2 h3'>Shopping Cart</h1>
          {cartProducts.length === 0 ? (
            <Alert variant='info'>Shopping cart is empty. Add products to your cart</Alert>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </Col>

        {cartProducts.length > 0 && (
          <Col md={5}>
            <>
              <Table responsive='sm' className='cart-table overflow-x-auto'>
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {cartProducts.map((product: Product) => (
                    <tr key={product._id}>
                      <td>&nbsp;</td>
                      <td>
                        {!isLoading && (
                          <FaTimes
                            onClick={() => handleRemove(product)}
                            className='mr-[10px] cursor-pointer'
                          />
                        )}
                        <img
                          alt=''
                          src={product.images[0].url}
                          className='w-[100px] h-[100px] object-cover'
                        />
                      </td>
                      <td>${product.price}</td>
                      <td>
                        <span className='quantity-indicator flex items-center justify-center'>
                          <FaMinusCircle
                            onClick={() => handleDecrease(product)}
                            className='cursor-pointer inline-block mr-[5px]'
                          />
                          <span>{user?.cart[product._id] ?? 0}</span>
                          <FaPlusCircle
                            onClick={e => handleIncrease(product)}
                            className='cursor-pointer inline-block ml-[5px]'
                          />
                        </span>
                      </td>
                      <td>${Number(product.price) * (user?.cart[product._id] ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <h3 className='h4 pt-4'>Total: ${user?.cart.totalPrice ?? 0}</h3>
              </div>
            </>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CartPage;
