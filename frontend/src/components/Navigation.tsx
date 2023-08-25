import { useSelector } from 'react-redux';
import { useMemo, useRef, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import { logout, resetNotifications } from '../features/userSlice';

import axios from '../axios';
import { AxiosError } from 'axios';
import { GlobalState, Notification, User } from '../interfaces';

import { FaBell } from 'react-icons/fa';
import { BsFillCartFill } from 'react-icons/bs';
import { showAlert } from '../utils';

const Navigation = () => {
  const user: User | null = useSelector((state: GlobalState) => state.user);
  const dispatch = useDispatch();

  const bellRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [bellPosition, setBellPosition] = useState<DOMRect | null>(null);

  const unreadNotifications: number = useMemo(() => {
    return (
      user?.notifications?.reduce((acc: number, current: Notification) => {
        if (current.status === 'unread') {
          return acc + 1;
        }
        return acc;
      }, 0) ?? 0
    );
  }, [user]);

  const handleToggleNotification = () => {
    if (!user) return;

    const position: DOMRect = bellRef.current!.getBoundingClientRect();
    setBellPosition(position);
    notificationRef.current!.style.display =
      notificationRef.current!.style.display === 'block' ? 'none' : 'block';
    dispatch(resetNotifications());

    if (unreadNotifications > 0) {
      axios.post(`/users/${user._id}/update-notifications`).catch((err: AxiosError) => {
        console.log(err.message);
        showAlert({ msg: 'An error has occured' });
      });
    }
  };

  const handleLogout = () => dispatch(logout());

  return (
    <Navbar expand='lg' className='bg-body-tertiary'>
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand>Ecommerce</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls='basic-navbar-nav' />

        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            {!user?.isAdmin && (
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <BsFillCartFill className='text-[28px]' />
                  {user && user.cart.totalItems > 0 && (
                    <span
                      id='cartcount'
                      className='badge badge-warning text-[10px] bg-red-600 text-white p-[2px] align-top -ml-2 !rounded-full -mt-[5px]'
                    >
                      {user?.cart.totalItems}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}

            {user ? (
              <>
                <Nav.Link className='relative' onClick={handleToggleNotification}>
                  <div
                    ref={bellRef}
                    data-count={unreadNotifications}
                    className='relative after:absolute after:-right-[0.75em] after:-top-[0.75em] after:content-[attr(data-count)] after:p-[0.5em] after:rounded-[10em] after:leading-[0.9em] after:text-white after:bg-red-600 after:text-center after:min-w-[2em] after:font-bold after:text-[0.4em]'
                  >
                    <FaBell className='text-[1.5em]' />
                  </div>
                </Nav.Link>

                <NavDropdown title={user.email} id='basic-nav-dropdown'>
                  {user.isAdmin ? (
                    <>
                      <LinkContainer to='/admin'>
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/new-product'>
                        <NavDropdown.Item>Create Product</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  ) : (
                    <>
                      <LinkContainer to='/cart'>
                        <NavDropdown.Item>Cart</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/orders'>
                        <NavDropdown.Item>My orders</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <Button
                    variant='danger'
                    onClick={handleLogout}
                    className='logout-btn mx-auto !block'
                  >
                    Logout
                  </Button>
                </NavDropdown>
              </>
            ) : (
              <LinkContainer to='/login'>
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* notifications */}
      <div
        style={{
          display: 'none',
          left: bellPosition?.left ?? 0,
          top: (bellPosition?.top ?? 0) + 30,
        }}
        ref={notificationRef}
        className='notifications-container text-center absolute p-5 w-[200px] z-[99] max-h-[200px] overflow-y-auto border border-gray-500 bg-white'
      >
        {user?.notifications.length === 0 && <p>No notification</p>}
        {user?.notifications.map(({ status, message, time }: Notification, index: number) => (
          <p key={index} className={status === 'unread' ? 'bg-red-300' : 'bg-blue-400'}>
            {message}
            <br />
            <span>{time.split('T')[0] + ' ' + time.split('T')[1]}</span>
          </p>
        ))}
      </div>
    </Navbar>
  );
};

export default Navigation;
