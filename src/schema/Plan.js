import { PubSub, withFilter } from "graphql-subscriptions";

const pubsub = new PubSub();

let data = {
  sprints: []
};

let id = 0;

const schema = `
  type User {
    id: String
  }

  type Vote {
    value: String
    owner: User
  }

  type Story {
    id: String
    name: String
    votings: [Vote]
    finalVote: Vote
  }

  type Sprint {
    id: String
    name: String
    owner: User
    stories: [Story]
  }
`;

const queries = `
  user: User
  sprints: [Sprint]
  sprint(id: String!): Sprint
`;

const subscriptions = `
  sprintUpdated(id: String!): Sprint
`

const mutations = `
  createSprint(name: String!, stories: [String]!): Sprint
  vote (sprintId: String!, storyId: String!, value: String!): Vote
`;

const resolvers = {
  subscriptions: {
    sprintUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("sprintUpdated"),
        (payload, { id }) => {
          const hasItem =  payload && payload.sprintUpdated,
                result = hasItem && payload.id === id;

          return result;
        }
      )
    }
  },
  queries: {
    user: (parent, args, { request }) => ({ id: request.session.id }),
    sprints: () => data.sprints,
    sprint: (parent, { id }, { request }) => {
      return data.sprints.find(sprint => sprint.id === id);
    }
  },
  mutations: {
    createSprint: (parent, { name, stories }, { request }) => {

      const sprint = {
        id: (++id).toString(),
        name,
        stories: stories.map(story => ({
          id: (++id).toString(),
          name: story,
          votings: []
        })),
        owner: {
          id: request.session.id
        }
      };

      data.sprints.push(sprint);

      return sprint;
    },
    vote: (parent, { sprintId, storyId, value }, { request }) => {
      const vote = {
        id: storyId,
        value,
        owner: {
          id: request.session.id
        }
      };
      const sprint = data.sprints.find(sprint => sprint.id === sprintId);
      const isSprintOwner = sprint.owner.id === vote.owner.id;
      const story = sprint.stories.find(story => story.id === storyId);
      let originalVoteIndex = !isSprintOwner && story.votings
        .findIndex(({ owner }) => owner.id === vote.owner.id);

      if (isSprintOwner) {
        story.finalVote = vote;
      } else if (originalVoteIndex > -1) {
        story.votings[originalVoteIndex] = vote;
      } else {
        story.votings.push(vote);
      }

      pubsub.publish("sprintUpdated", {
        sprintUpdated: sprint,
        id: sprintId
      });

      return vote;
    }
  }
};

export default () => ({
  schema,
  queries,
  subscriptions,
  resolvers,
  mutations,
});
