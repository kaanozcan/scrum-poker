import React from "react";
import { NavLink } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Table } from "antd";

const SPRINTS = gql`
  {
    sprints {
      id
      name
    }
  }
`;

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Operation',
  dataIndex: 'id',
  key: 'id',
  render: id => <NavLink to={`/plan/vote/${id}`}>Vote!</NavLink>
}]

const List = () => (
  <Query query={SPRINTS}>
    {({ loading, data }) => {

      return (
        <div>
          <NavLink to="/plan/create">Create New!</NavLink>
          <Table loading={loading} columns={columns} dataSource={data.sprints || []} />
        </div>
      );
    }}
  </Query>
);

export default List;
