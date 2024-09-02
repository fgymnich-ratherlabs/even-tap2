const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type User {
      id: ID!
      name: String!
      email: String!
      role: String!
      events: [Event!]!          
      applications: [Application!]!  
    }
  
    type Event {
      id: ID!
      name: String!
      description: String!
      location: String!
      date: String!
      maxCapacity: Int!
      organizer: User!
      applications: [Application!]!
      organizerId: Int!
    }
  
    type Application {
      id: ID!
      status: String!
      user: User!
      event: Event!
    }
  
    type Query {
      users: [User!]!
      user: User
      events: [Event!]!
      event(id: ID!): Event
    }
  
    type Mutation {
      signup(name: String!, email: String!, password: String!): String
      signin(email: String!, password: String!): String
      createEvent(name: String!, description: String!, location: String!, date: String!, maxCapacity: Int!): Event
      applyToEvent(eventId: ID!): Application
      manageApplication(applicationId: ID!, status: String!, version: Int!): Application!
    }
  `);

  module.exports = schema;