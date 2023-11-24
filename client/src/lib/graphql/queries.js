const { gql, GraphQLClient } = require("graphql-request");

const client = new GraphQLClient('http://localhost:9000/graphql');

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
  const {jobs} = await client.request(query); // returns already the data block of a gql response
  return jobs;
}