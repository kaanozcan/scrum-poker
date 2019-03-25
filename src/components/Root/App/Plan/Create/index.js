import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Input, Typography, Button } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

const CREATE_SPRINT = gql`
  mutation ($name: String!, $stories: [String]!) {
    createSprint (name: $name, stories: $stories) {
      name
    }
  }
`;

const SPRINTS = gql`
  {
    sprints {
      id
      name
    }
  }
`;

const onChangeHandler = (setValue) => ({ target: { value }}) => setValue(value);
const onSubmitHandler = (setMutationResult, mutate, variables) => (e) => {
  e.preventDefault()

  mutate({ variables })
    .then(() => setMutationResult({ success: true }))
    .catch((err) => setMutationResult({ errors: err.graphQLErrors }));
}

const Create = () => {
  const [name, setName] = useState("");
  const [stories, setStories] = useState("");
  const [mutationResult, setMutationResult] = useState({
    success: false,
    errors: []
  });

  if (mutationResult.success) {
    return (
      <Redirect to="/plan" />
    );
  }

  const formData = {
    name,
    stories: stories.split("\n").filter(str => str !== "")
  };

  return (
    <Mutation mutation={CREATE_SPRINT} refetchQueries={[{query: SPRINTS}]}>
      {(createSprint, { loading }) => {
        const error = mutationResult.errors.length ? <span>hata</span> : null;

        return (
          <div>
            <form onSubmit={onSubmitHandler(setMutationResult, createSprint, formData)}>
              <Input onChange={onChangeHandler(setName)} placeholder="session name" />

              <Title level={3}>Stories</Title>

              <TextArea onChange={onChangeHandler(setStories)} />
              <Button htmlType="submit">Send</Button>
            </form>
          </div>
        );
      }}
    </Mutation>
  );
};

export default Create;
