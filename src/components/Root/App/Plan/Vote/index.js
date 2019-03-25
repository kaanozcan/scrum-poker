import React from "react";
import { NavLink } from "react-router-dom";
import { Query, Mutation, Subscription } from "react-apollo";
import gql from "graphql-tag";
import { Badge, Card, Button, Table } from "antd";
import deepmerge from "deepmerge";

const sizes = ["XS", "S", "M", "L"];

const SPRINT = gql`
  query ($id: String!) {
    user {
      id
    }
    sprint (id: $id) {
      id
      name
      stories {
        id
        name
        finalVote {
          value
        }
        votings {
          value
        }
      }
    }
  }
`;

const VOTE = gql`
  mutation ($sprintId: String!, $storyId: String!, $value: String!) {
    vote (sprintId: $sprintId, storyId: $storyId, value: $value) {
      value
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription ($id: String!) {
    sprintUpdated (id: $id) {
      id
      name
      stories {
        id
        name
        finalVote {
          value
        }
        votings {
          value
        }
      }
    }
  }
`;

const Vote = ({ match: { params } }) => {
  const variables = {
    id: params.id
  };

  //TODO: Abstract some stuff.
  return (
    <Query query={SPRINT} variables={variables}>
      {({ loading, data }) => (
        <Subscription subscription={SUBSCRIPTION} variables={variables}>
          {(update) => (
            <Mutation mutation={VOTE}>
              {(vote) => {
                const sprint = deepmerge(data.sprint || {}, update.sprintUpdated || {});
                const stories = sprint.stories || [];
                const columns = [{
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                }, {
                  title: "Scoring",
                  dataIndex: "votings",
                  key: "votings",
                  render: (votings, record) => sizes.map((size) => {
                    const count = votings.filter(({ value }) => value === size).length;

                    const clickHandler = (e) => vote({
                      variables: {
                        sprintId: params.id,
                        storyId: record.id,
                        value: size
                      }
                    });

                    return (
                      <Badge count={count}>
                        <Button onClick={clickHandler}>{size}</Button>
                      </Badge>
                    );
                  })
                }, {
                  title: "Final Vote",
                  dataIndex: "finalVote",
                  key: "finalVote",
                  render: (vote) => <span>{vote && vote.value}</span>
                }];

                return (
                  <div>
                    <Table loading={loading} dataSource={stories} columns={columns} />
                  </div>
                );
              }}
            </Mutation>
          )}
        </Subscription>
      )}
    </Query>
  );
}

export default Vote;
