import { Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import axios from '../../axios';
import { AxiosError, AxiosResponse } from 'axios';

import { showAlert } from '../../utils';
import { User } from '../../interfaces';

import Loading from '../Loading';

const DashboardClients = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = () => {
    setLoading(true);

    axios
      .get('/users')
      .then((res: AxiosResponse) => {
        const responseData: User[] = res.data;
        setUsers(responseData);
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        setLoading(false);
        console.log(err.message);
        showAlert({ msg: 'An error has occured' });
      });
  };

  useEffect(fetchUsers, []);

  if (loading) {
    return <Loading />;
  }

  if (users.length === 0) {
    return <h2 className='py-2 text-center'>No users yet</h2>;
  }

  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Client ID</th>
          <th>Client Name</th>
          <th>Email</th>
        </tr>
      </thead>

      <tbody>
        {users.map(({ _id, name, email }: User) => (
          <tr key={_id}>
            <td>{_id}</td>
            <td>{name}</td>
            <td>{email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DashboardClients;
