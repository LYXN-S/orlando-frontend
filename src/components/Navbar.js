import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/">Dashboard</Link></li>
      <li><Link to="/products">Products</Link></li>
      <li><Link to="/cart">Cart</Link></li>
      <li><Link to="/orders">Orders</Link></li>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
    </ul>
  </nav>
);

export default Navbar;
