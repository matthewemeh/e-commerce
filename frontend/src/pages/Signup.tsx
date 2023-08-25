import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useSignupMutation } from '../services/appApi';

const Signup = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [signup, { error, isLoading, isError }] = useSignupMutation();

  const handleSignup = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const name: string = nameRef.current!.value;
    const email: string = emailRef.current!.value;
    const password: string = passwordRef.current!.value;

    signup({ name, email, password });
  };

  return (
    <Container className='text-center'>
      <Row>
        <Col
          md={6}
          className='signup__form--container flex flex-col items-center h-screen justify-center'
        >
          <Form className='container' onSubmit={handleSignup}>
            <h1>Create an account</h1>

            {isError && error && (
              <Alert variant='danger'>{`${'status' in error ? error.data : ''}`}</Alert>
            )}

            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                autoFocus
                type='text'
                ref={nameRef}
                spellCheck='false'
                placeholder='John Doe'
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                required
                type='email'
                ref={emailRef}
                inputMode='email'
                spellCheck='false'
                placeholder='johndoe23@example.com'
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control required type='password' ref={passwordRef} placeholder='********' />
            </Form.Group>

            <Form.Group className='mt-3'>
              <Button type='submit' disabled={isLoading}>
                Create Account
              </Button>
            </Form.Group>

            <p>
              Already have an account? <Link to='/login'>Login</Link>
            </p>
          </Form>
        </Col>

        <Col
          md={6}
          className='signup__image--container bg-cover h-[90vh] bg-[url(https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGNvbW1lcmNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60)] tablets:hidden'
        />
      </Row>
    </Container>
  );
};

export default Signup;
