import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

export default class BaseLayout extends Component{
  render(){
    return(
      <div className="main-view">
        <div className="navigation">
          <NavLink className="nav-link" activeClassName="selected" to='/'>Home</NavLink>
          <NavLink className="nav-link" activeClassName="selected" to='/admin'>Admin</NavLink>
        </div>
        <div className="main-content">
          {this.props.children}
        </div>
      </div>
    )
  }
}