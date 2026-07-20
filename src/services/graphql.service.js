import { GraphqlRepository } from '@/repositories/graphql.repository';

export const GraphqlService = {
    getSchema: () => {
        return `
            type Client {
                id: ID!
                name: String!
                email: String!
                status: String!
            }

            type Task {
                id: ID!
                title: String!
                priority: String!
                status: String!
            }

            type Query {
                clients: [Client!]!
                tasks: [Task!]!
            }

            type Mutation {
                createClient(name: String!, email: String!): Client!
            }
        `.trim();
    },

    execute: async (query, variables = {}) => {
        return GraphqlRepository.executeRaw(query, variables);
    }
};

export default GraphqlService;
