import { FaEye } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Badge, Button, Table, Modal } from 'react-bootstrap';

import axios from '../../axios';
import { AxiosError, AxiosResponse } from 'axios';

import { showAlert } from '../../utils';
import { Cart, GlobalState, Order, Product } from '../../interfaces';

import Loading from '../Loading';

const DashboardOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ordersToShow, setOrdersToShow] = useState<Partial<Product>[]>([]);
  const products: Product[] | null = useSelector((state: GlobalState) => state.products);

  const handleCloseModal = () => setShowModal(false);

  const markShipped = (orderID: string, ownerID: string) => {
    axios
      .patch(`/orders/${orderID}/mark-shippped`, { ownerID })
      .then((res: AxiosResponse) => {
        const responseData: Order[] = res.data;
        setOrders(responseData);
      })
      .catch((err: AxiosError) => {
        console.log(err.message);
        showAlert({ msg: 'An error has occured' });
      });
  };

  const showOrder = (cart: Cart) => {
    let filteredProducts: Product[] = products?.filter(({ _id }: Product) => _id in cart) ?? [];
    const productsToShow: Partial<Product>[] = filteredProducts.map((product: Product) => {
      const productCopy: Partial<Product> = { ...product, totalItems: cart[product._id] };
      delete productCopy.description;

      return productCopy;
    });
    setShowModal(true);
    setOrdersToShow(productsToShow);
  };

  const fetchOrders = () => {
    setLoading(true);

    axios
      .get('/orders')
      .then((res: AxiosResponse) => {
        const responseData: Order[] = res.data;
        setLoading(false);
        setOrders(responseData);
      })
      .catch((err: AxiosError) => {
        setLoading(false);
        console.log(err.message);
        showAlert({ msg: 'An error has occured' });
      });
  };

  useEffect(fetchOrders, []);

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return <h1 className='text-center pt-4'>No orders yet</h1>;
  }

  return (
    <>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Items</th>
            <th>Order Total</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(
            ({ _id, date, status, totalPrice, owner, totalItems, address, products }: Order) => (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{owner.name}</td>
                <td>{totalItems}</td>
                <td>${totalPrice}</td>
                <td>{address}</td>
                <td>
                  {status === 'processing' ? (
                    <Button size='sm' onClick={() => markShipped(_id, owner._id)}>
                      Mark as shipped
                    </Button>
                  ) : (
                    <Badge text='white' bg='success'>
                      Shipped
                    </Badge>
                  )}
                </td>
                <td>
                  <span className='cursor-pointer' onClick={() => products && showOrder(products)}>
                    View order <FaEye className='inline' />
                  </span>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order details</Modal.Title>
        </Modal.Header>

        {ordersToShow.map((order: Partial<Product>) => (
          <div key={order._id} className='order-details__container flex justify-between px-3 py-2'>
            <img src={order.images![0].url} className='w-[100px] h-[100px] object-cover' alt='' />

            <p>
              <span>{order.totalItems} x</span> {order.name}
            </p>

            <p>Price: ${Number(order.price) * (order?.totalItems ?? 0)}</p>
          </div>
        ))}

        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DashboardOrders;
