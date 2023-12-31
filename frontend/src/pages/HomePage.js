import React from 'react';
import { Layout, Menu, Breadcrumb, Button, Typography } from 'antd';
import { FileExcelOutlined, PlusOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

class HomePage extends React.Component {

  render() {
    return (
      <Layout className="layout">
        <Header style={{ background: '#fff', padding: 0 }}>
          <Title style={{ margin: '14px 16px', textAlign: 'left' }} level={4}>CollabSheet</Title>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Accueil</Breadcrumb.Item>
            <Breadcrumb.Item>Liste des Feuilles</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Title level={3}>Vos Feuilles de Calcul</Title>
            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
              Créer une Nouvelle Feuille
            </Button>
            <Menu mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1" icon={<FileExcelOutlined />}>
                Feuille 1
              </Menu.Item>
              <Menu.Item key="2" icon={<FileExcelOutlined />}>
                Feuille 2
              </Menu.Item>
              {/* Plus d'items de menu ici */}
            </Menu>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          CollabSheet © {new Date().getFullYear()}
        </Footer>
      </Layout>
    );
  }
}

export default HomePage;
