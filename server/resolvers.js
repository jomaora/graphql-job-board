import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { createJob, deleteJob, getJob, getJobs, getJobsByCompanyId, updateJob } from "./db/jobs.js"

const unauthorizedError = () => {
    throw new GraphQLError('Unauthorized', {
        extensions: {
            code: 'UNAUTHORIZED'
        }
    })
}

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

    Mutation: {
        createJob: async (_root, {input}, {user}) => {
            if (!user) {
                unauthorizedError();
            }

            const {title, description} = input;
            const job = await createJob({
                companyId: user.companyId,
                title,
                description
            });
            return job;
        },
        deleteJob: async (_root, {id}, {user}) => {
            if (!user) {
                unauthorizedError();
            }
            const job = await deleteJob(id, user.companyId);
            if (!job) {
                throw new GraphQLError(`Job not found with id ${id}`, {
                    extensions: {
                        code: 'NOT_FOUND'
                    }
                })
            }
            return job;
        },
        updateJob: async (_root, {input}, {user}) => {
            if (!user) {
                unauthorizedError();
            }
            const {id, title, description} = input;
            const job = await updateJob({id, title, description}, user.companyId);
            if (!job) {
                throw new GraphQLError(`Job not found with id ${id}`, {
                    extensions: {
                        code: 'NOT_FOUND'
                    }
                })
            }
            return job;
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