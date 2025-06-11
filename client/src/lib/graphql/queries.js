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

export const getHJobs = async () => {
  const query = gql`
    query {
      jobs {
        id
        title
        company {
          name
        }
        date
      }
    }`;
  const {data}  = await apolloClient.query({query});
  return data.jobs;
}

export const getHJob = async (id) => {
  const query = gql`
    query getHJob($id: ID!){
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        date
        description
      }
    }`;
  const {data} = await apolloClient.query({query, variables: {id}});
  return data.job;
}

export const getCompany = async (id) => {
  const query = gql`
    query getCompany($id: ID!){
      company(id: $id) {
        id
        name
        description,
        jobs {
          id
          title
          date
        }
      }
    }`;
  const {data} = await apolloClient.query({query, variables: {id}});
  return data.company;
}