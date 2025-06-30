const { ApolloClient, gql, InMemoryCache, createHttpLink, concat, ApolloLink } = require("@apollo/client");
const { getAccessToken } = require("../auth");

const httpLink = new createHttpLink({
  uri: 'http://localhost:9000/graphql'
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();
  if (token) {
    operation.setContext({headers: {Authorization: `Bearer ${token}`}}); // rein à voir avec le context côté serveur des resolveurs glq
  }
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
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