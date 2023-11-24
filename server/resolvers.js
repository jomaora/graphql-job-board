import { getCompany } from "./db/companies.js";
import { getJobs } from "./db/jobs.js"

export const resolvers = {
    Query: {
        jobs: async () => {
            const result = await getJobs()
            return result;
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