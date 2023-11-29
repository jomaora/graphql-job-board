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
  const {job} = await client.request(query, {id});
  return job;
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
  const {company} = await client.request(query, {id});
  return company;
}