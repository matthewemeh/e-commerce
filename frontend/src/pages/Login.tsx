import { useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import { useLoginMutation } from '../services/appApi';

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [login, { error, isError, isLoading, isSuccess }] = useLoginMutation();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const email: string = emailRef.current!.value;
    const password: string = passwordRef.current!.value;

    login({ email, password });
  };

  return (
    <Container className='text-center'>
      <Row>
        <Col
          md={6}
          className='login__form--container flex flex-col items-center h-screen justify-center'
        >
          <Form className='container' onSubmit={handleLogin}>
            <h1>Login to your account</h1>

            {isError && error && (
              <Alert variant='danger'>{`${'status' in error ? error.data : ''}`}</Alert>
            )}

            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                required
                autoFocus
                type='email'
                ref={emailRef}
                inputMode='email'
                spellCheck='false'
                placeholder='Enter email'
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type='password'
                ref={passwordRef}
                placeholder='Enter password'
              />
            </Form.Group>

            <Form.Group>
              <Button type='submit' disabled={isLoading}>
                Login
              </Button>
            </Form.Group>

            <p>
              Don't have an account? <Link to='/signup'>Create account</Link>
            </p>
          </Form>
        </Col>

        <Col
          md={6}
          className='login__image--container bg-cover h-[90vh] bg-[url(https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGNvbW1lcmNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60)] tablets:hidden'
        />
      </Row>
    </Container>
  );
};

export default Login;
