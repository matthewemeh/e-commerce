import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';

import { GlobalState, Product, User } from '../../interfaces';
import { useDeleteProductMutation } from '../../services/appApi';

const DashboardProducts = () => {
  const user: User | null = useSelector((state: GlobalState) => state.user);
  const products: Product[] | null = useSelector((state: GlobalState) => state.products);

  const [deleteProduct, { isLoading, isSuccess }] = useDeleteProductMutation();

  const handleDeleteProduct = (id: string, userID: string) => {
    const confirmedDelete: boolean = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (confirmedDelete) {
      deleteProduct({ userID, productID: id });
    }
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th></th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Product Price</th>
        </tr>
      </thead>

      <tbody>
        {products?.map(({ _id, images, name, price }: Product) => (
          <tr key={_id}>
            <td>
              <img
                alt=''
                src={images[0].url}
                className='dashboard-product-preview w-[100px] h-[100px] object-cover'
              />
            </td>
            <td>{_id}</td>
            <td>{name}</td>
            <td>{price}</td>
            <td>
              <Button onClick={() => handleDeleteProduct(_id, user!._id)} disabled={isLoading}>
                Delete
              </Button>
              <Link to={`/product/${_id}/edit`} className='btn btn-warning'>
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default DashboardProducts;
