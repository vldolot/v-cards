import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as contactsAction from '../contactsActions';
import getRandomColor from '../../utils';

import Card from 'antd/lib/card';
import Input from 'antd/lib/input';
import AutoComplete from 'antd/lib/auto-complete';
import Menu from 'antd/lib/menu';
import Spin from 'antd/lib/spin';
import Button from 'antd/lib/button';
import Avatar from 'antd/lib/avatar';
import Icon from 'antd/lib/icon';
import './styles.css';


const SubMenu = Menu.SubMenu;
const Option = AutoComplete.Option;

function renderOption(item) {
  return (
    <Option key={item.id} text={item.name}>
      {item.name}
    </Option>
  );
}

function search(_value, _array) {
  for (var i=0; i < _array.length; i++) {
    if (_array[i].name === _value) {
      return _array[i];
    }
  }
}

class HomePage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      current: '',
      contacts: [],
      flipped: false,
      selectedContact: [],
      avatarColor: '',
      defaultKey: [''],
      searchDataSrc: [],
      searchStr: ''
    };

    this.handleContactClick = this.handleContactClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.onSelect = this.onSelect.bind(this);
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
        avatarColor: color,
        defaultKey: Object.keys(newUsers[0]),
        searchDataSrc: nextProps.users
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

  getSelectedContact(_id) {
    let selectedContact = [];
    if (_id) {
      for (let o of this.props.users) {
        if (o.id == _id) {
          selectedContact.push(o);
        }        
      }
    }
    return selectedContact;
  }

  handleContactClick(e) {
    let selectedContact = this.getSelectedContact(e.key);

    let color = getRandomColor();
    this.setState({
      current: e.key,
      flipped: true,
      selectedContact: selectedContact,
      avatarColor: color
    });
  }

  handleBackClick(e) {
    this.setState({
      flipped: !true
    });
  }

  searchContact(value) {
    let usersArr = this.state.searchDataSrc;
    let result = [];
    for (let o of usersArr) {
      let re = new RegExp(value, 'i');
      let name = o.name.toLowerCase();
      if (re.test(name)) {
        result.push(o);
      }
    }

    this.setState({
      searchDataSrc: result
    });
  }

  onSelect(value) {
    let selectedContact = this.getSelectedContact(value);
    let firstLetter = selectedContact[0].name.substring(0,1).toUpperCase();

    this.setState({
      defaultKey: [firstLetter],
      current: value,
      searchStr: value
    });
  }

  handleSubMenuClick(openKeys) {
    this.setState({
      defaultKey: openKeys
    });
  }

  getInitials(_name) {
    let names = _name.split(" ");
    let initials = "";
    names.forEach((n) => {
      initials += n.substring(0,1).toUpperCase();
    });
    return initials;
  }

  emitEmpty = () => {
    // this.userNameInput.focus();
    this.setState({ searchStr: '' });
  }

  render() {
    // let _default = (this.state.contacts.length > 0) ? Object.keys(this.state.contacts[0]) : [];
    const { flipped, contacts, searchStr } = this.state;
    const suffix = searchStr ? <Icon type="close" className="contact-search-icon" onClick={this.emitEmpty} /> : null;
    let subMenus = contacts.map((obj, i) => {
      return (
        <SubMenu key={Object.keys(obj)} title={<span>{Object.keys(obj)}</span>}>
          {obj[Object.keys(obj)].map((contact, idx) => (
          <Menu.Item key={contact.id}>{contact.name}</Menu.Item>
          ))}
        </SubMenu>
      );
    });

    return (
      <div className="home-page">
        <h1 className="pageTitle">vCards Demo</h1>
        <div className={`flippable ${(flipped) && "flipped"}`}>
          <div className="list">
            <Card style={{ width: 300, height: 350, margin: "0 auto" }}
              bodyStyle={{ padding: "1px 0 0 0", overflowY: "auto", height: 300 }}
              title={
                <div className="contact-search-wrapper">
                  <AutoComplete
                    className="contact-search"
                    style={{ width: '100%' }}
                    dataSource={this.state.searchDataSrc.map(renderOption)}
                    onSelect={this.onSelect}
                    onSearch={this.searchContact.bind(this)}
                    placeholder="input search text"
                    optionLabelProp="text"
                    value={searchStr}
                  >
                    <Input 
                      prefix={<Icon type="search" className="contact-search-icon" />} 
                      suffix={suffix}
                    />
                  </AutoComplete>
                </div>                
              }
              >

              <Menu
                theme="light"
                onClick={this.handleContactClick}
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
          <div className="vCard">
            <header>
              <Button shape="circle" size="small" type="primary" ghost icon="close" onClick={this.handleBackClick} />
            </header>
            {this.state.selectedContact.map((obj, idx) => (
            <main key={idx}>
              <Avatar style={{ backgroundColor: this.state.avatarColor }} shape="square">{this.getInitials(obj.name)}</Avatar>
              <div className="contact-details">
                <div className="contact-name">{obj.name}</div>
                <div className="contact-address">{`${obj.address.suite}, ${obj.address.street}, ${obj.address.city}  ${obj.address.zipcode}`}</div>
                <div className="contact-email"><Icon type="mail" /> <a href={`mailto:${obj.email}`}>{obj.email}</a></div>
                <div className="contact-phone"><Icon type="phone" /> {obj.phone}</div>
              </div>
            </main>
            ))}
            {this.state.selectedContact.map((obj, idx) => (
            <footer key={idx}>
              <Avatar size="large" icon="api" style={{ backgroundColor: 'darkolivegreen' }} />
              <div className="company-details">
                <div className="company-name">{obj.company.name}</div>
                <div className="company-catchPhrase">{obj.company.catchPhrase}</div>
                <div className="company-website"><Icon type="global" /> <a>{obj.website}</a></div>
              </div>
            </footer>
            ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);