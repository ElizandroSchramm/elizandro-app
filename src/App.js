import './App.css';
import React, { Component } from "react";
import { render } from "react-dom";
import { Button, Layout, Space } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        url: "https://www.google.com.br/maps/search/" + position.coords.latitude + "," + position.coords.longitude
      });
    });
    
  }

  render() {
    return (
      <Space
    direction="vertical"
    style={{
      width: '100%',
      height: '100%',
    }}
    size={[0, 48]}
  >
    <Layout>
      <Header style={{textAlign: 'center',
                     color: '#fff',
                     height: 64,
                     paddingInline: 50,
                     lineHeight: '64px',
                     backgroundColor: '#7dbcea'}}>
          Elizandro José Schramm</Header>
      <Layout>
        {/* <Sider style={siderStyle}>Sider</Sider> */}
        <Content style={{textAlign: 'center',
                     color: '#fff',
                     height: 64,
                     paddingInline: 50,
                     lineHeight: '64px',
                     backgroundColor: '#7dbcea'}}>
            <Button href={this.state.url} target="_blank" loading={!this.state.url}>Sua localização</Button>
          </Content>
          <Content style={{textAlign: 'center',
                     color: '#fff',
                     height: 64,
                     paddingInline: 50,
                     lineHeight: '64px',
                     backgroundColor: '#7dbcea'}}>
            <Button href={"/sign.html"}>Widget Embedded</Button>
          </Content>
          <Content style={{textAlign: 'center',
                     color: '#fff',
                     height: 64,
                     paddingInline: 50,
                     lineHeight: '64px',
                     backgroundColor: '#7dbcea'}}>
            <Button href={"/tokenless.html"}>Widget Embedded Tokenless</Button>
          </Content>
      </Layout>
      {/* <Footer style={footerStyle}>Footer</Footer> */}
    </Layout>
  </Space>
    );
  }
}

export default App;
