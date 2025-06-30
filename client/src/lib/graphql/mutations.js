const { ApolloClient, gql, InMemoryCache } = require("@apollo/client");
const { getAccessToken } = require("../auth");

const apolloClient = new ApolloClient({
  uri: 'http://localhost:9000/graphql',
  headers: () => {
    const token = getAccessToken();
    if (token) {
      return {Authorization: `Bearer ${token}`};
    }
    return {};
  },
  cache: new InMemoryCache(),
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
  const { data } = await apolloClient.mutation(mutation, {variables: {
    input: {
      title,
      description
    }
  }});

  return data.job;
};