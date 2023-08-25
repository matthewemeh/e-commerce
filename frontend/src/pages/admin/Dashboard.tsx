import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';

import DashboardOrders from '../../components/admin/DashboardOrders';
import DashboardClients from '../../components/admin/DashboardClients';
import DashboardProducts from '../../components/admin/DashboardProducts';

const Dashboard = () => {
  return (
    <Container className='text-center'>
      <Tab.Container defaultActiveKey='products'>
        <Row>
          <Col md={3}>
            <Nav variant='pills' className='flex-column'>
              <Nav.Item>
                <Nav.Link eventKey='products'>Products</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey='orders'>Orders</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey='clients'>Clients</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey='products'>
                <DashboardProducts />
              </Tab.Pane>

              <Tab.Pane eventKey='orders'>
                <DashboardOrders />
              </Tab.Pane>

              <Tab.Pane eventKey='clients'>
                <DashboardClients />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Dashboard;
