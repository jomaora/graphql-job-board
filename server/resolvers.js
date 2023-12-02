import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { getJob, getJobs, getJobsByCompanyId } from "./db/jobs.js"

export const resolvers = {
    Query: {
        jobs: async () => {
            const result = await getJobs()
            return result;
        },
        job: async (_root, args) => {
            const {id} = args;
            const job = await getJob(id);
            if (!job) {
                throw new GraphQLError(`No job found with id ${id}`, {
                    extensions: {
                        code: 'NOT_FOUND'
                    }
                })
            }
            return job;
        },
        company: async (_root, args) => {
            const {id} = args;
            const company = await getCompany(id);
            if (!company) {
                throw new GraphQLError(`No job company with id ${id}`, {
                    extensions: {
                        code: 'NOT_FOUND'
                    }
                })
            }
            return company;
        }
    },

    Job: {
        date: (job) => {   // getting the document to be used on the attribute resolver
            return job.createdAt.slice(0, 'yyyy-mm-dd'.length); 
        },
        company: async (job) => {
            const company = await getCompany(job.companyId)
            if (!company) {
                throw new GraphQLError(`No company foind with id ${job.companyId}`, {
                    extensions: {
                        code: 'NOT_FOUND'
                    }
                });
            }
            return company;
        }
    },

    Company: {
        jobs: (company) => {
            return getJobsByCompanyId(company.id);
        }
    }
}