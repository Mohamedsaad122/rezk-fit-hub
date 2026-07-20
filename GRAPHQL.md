# Enterprise GraphQL API Specification

Rezk Fit Hub exposes a unified GraphQL gateway under `/api/saas/graphql` to perform complex relational lookups.

## Schema structure

```graphql
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
```

## Example Query

To query clients and tasks in a single request:

```graphql
query GetGymData {
  clients {
    id
    name
  }
  tasks {
    id
    title
  }
}
```
