import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Badge, Container, Table } from 'react-bootstrap';

import axios from '../axios';
import { AxiosError, AxiosResponse } from 'axios';

import { showAlert } from '../utils';
import { GlobalState, Order, Product, User } from '../interfaces';

import Loading from '../components/Loading';

const OrderPage = () => {
  const user: User | null = useSelector((state: GlobalState) => state.user);
  const products: Product[] | null = useSelector((state: GlobalState) => state.products);

  const [show, setShow] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderToShow, setOrderToShow] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    axios
      .get(`/users/${user._id}/orders`)
      .then((res: AxiosResponse) => {
        const userOrders: Order[] = res.data;
        setLoading(false);
        setOrders(userOrders);
      })
      .catch((err: AxiosError) => {
        setLoading(false);
        console.log(err.message);
        showAlert({ msg: 'An error has occured' });
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return <h1 className='text-center pt-3'>No orders yet</h1>;
  }

  return (
    <Container>
      <h1 className='text-center'>Your orders</h1>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Date</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(({ _id, date, status, totalPrice }: Order) => (
            <tr key={_id}>
              <td>{_id}</td>
              <td>
                <Badge
                  text='white'
                  className='capitalize'
                  bg={`${status === 'processing' ? 'warning' : 'success'}`}
                >
                  {status}
                </Badge>
              </td>
              <td>{date}</td>
              <td>${totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
export default OrderPage;
