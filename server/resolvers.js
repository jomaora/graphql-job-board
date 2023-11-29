import { getCompany } from "./db/companies.js";
import { getJob, getJobs } from "./db/jobs.js"

export const resolvers = {
    Query: {
        jobs: async () => {
            const result = await getJobs()
            return result;
        },
        job: (_root, args) => {
            const {id} = args;
            return getJob(id);
        },
        company: (_root, args) => {
            const {id} = args;
            return getCompany(id);
        }
    },

    Job: {
        date: (job) => {   // getting the document to be used on the attribute resolver
            return job.createdAt.slice(0, 'yyyy-mm-dd'.length); 
        },
        company: async (job) => {
            const company = await getCompany(job.companyId)
            return company;
        }
    }
}