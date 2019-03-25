import React from "react";
import { NavLink } from "react-router-dom";
import { Layout, Menu } from "antd";

const { Header: Hdr } = Layout;

const Header = () => (
  <Hdr>
    <Menu mode="horizontal" theme="dark">
      <Menu.Item key="1">
        <NavLink to="/plan">Plan</NavLink>
      </Menu.Item>
    </Menu>
  </Hdr>
);

export default Header;
