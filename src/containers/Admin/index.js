import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as contactsAction from '../contactsActions';
import getRandomColor from '../../utils';

import Card from 'antd/lib/card';
import Badge from 'antd/lib/badge';
import Menu from 'antd/lib/menu';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import './styles.css';

const SubMenu = Menu.SubMenu;

class AdminPage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      current: '',
      contacts: [],
      avatarColor: '',
      defaultKey: ['']
    };

  }

  componentWillMount() {
    this.props.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      const unique = [...new Set(nextProps.users.map(obj => obj.name.substring(0,1).toUpperCase()))];
      const sorted = unique.sort((a, b) => a.localeCompare(b));
      const newUsers = [];
      sorted.forEach(obj1 => {
        let newObject = {};
        let arr = [];
        for (let obj2 of nextProps.users) {
          let firstLetter = obj2.name.substring(0,1).toUpperCase();
          if (obj1 === firstLetter) {
            arr.push(obj2);
          }
        }
        newObject[obj1] = arr;
        newUsers.push(newObject);
      });
      let color = getRandomColor();
      this.setState({ 
        contacts: newUsers,
        avatarColor: color
      });
    }
  }

  renderLoading() {
    const { fetching } = this.props;
    return (
      fetching &&
        <Spin tip="Loading..." size="large" />
    );
  }

  handleSubMenuClick(openKeys) {
    this.setState({
      defaultKey: openKeys
    });
  }

  render() {
    const { contacts, searchStr } = this.state;
    const totalContacts = this.props.users.length;
    const suffix = searchStr ? <Icon type="close" className="contact-search-icon" onClick={this.emitEmpty} /> : null;
    let subMenus = contacts.map((obj, i) => {
      let len = obj[Object.keys(obj)].length;
      return (
        <SubMenu key={Object.keys(obj)} title={<span>{Object.keys(obj)} <Badge count={`count: ${len}`} style={{ backgroundColor: '#108ee9' }} className="sub-count" /></span>}>
          {obj[Object.keys(obj)].map((contact, idx) => (
          <Menu.Item key={contact.id}>{contact.name}</Menu.Item>
          ))}
        </SubMenu>
      );
    });

    return (
      <div className="admin-page">
        <h1 className="pageTitle">vCards - Admin Page</h1>
        <div className={`flippable`}>
          <div className="list">
            <Card style={{ width: 300, height: 350, margin: "0 auto" }}
              bodyStyle={{ padding: "1px 0 0 0", overflowY: "auto", height: 300 }}
              title={<div>Total contacts: <Badge count={totalContacts} style={{ backgroundColor: '#108ee9' }} /></div>}
              >

              <Menu
                theme="light"
                style={{ width: "100%" }}
                defaultOpenKeys={this.state.defaultKey}
                openKeys={this.state.defaultKey}
                onOpenChange={this.handleSubMenuClick.bind(this)}
                selectedKeys={[this.state.current]}
                mode="inline"
              >
                {subMenus}
              </Menu>
              {this.renderLoading()}
            </Card>
          </div>

        </div>
      </div>
    );    
  }

}

const mapStateToProps = (state) => {
  return {
    users: state.contactsReducer.users,
    fetching: state.contactsReducer.fetching
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchData: contactsAction.fetchData
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);