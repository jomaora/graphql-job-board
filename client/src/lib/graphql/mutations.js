const { gql, GraphQLClient } = require("graphql-request");
const { getAccessToken } = require("../auth");

const client = new GraphQLClient('http://localhost:9000/graphql', {
  headers: () => {
    const token = getAccessToken();
    if (token) {
      return {Authorization: `Bearer ${token}`};
    }
    return {};
  }
});

export const createJob = async (title, description) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        title
        date
        description
        company {
          name
          description
        }
      }
    }
  `;
  const {job} = await client.request(mutation, {
    input: {
      title,
      description
    }
  });

  return job;
};