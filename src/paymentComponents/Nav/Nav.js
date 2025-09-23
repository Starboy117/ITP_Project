import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';

export default function Nav() {
  return (
    <header className="app-nav">
      <div className="nav-inner">
        <div className="brand">My App</div>
        <nav>
          <NavLink to="/payment" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Payment</NavLink>
          <NavLink to="/inquiry" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Inquiry</NavLink>
        </nav>
      </div>
    </header>
  );
}
