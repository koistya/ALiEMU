/* @flow */
import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import Db from './database';

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'This represents a person',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve(person) {
        return person.id;
      }
    },
    firstName: {
      type: GraphQLString,
      resolve(person) {
        return person.firstName;
      }
    },
    lastName: {
      type: GraphQLString,
      resolve(person) {
        return person.lastName;
      }
    },
    email: {
      type: GraphQLString,
      resolve(person) {
        return person.email;
      }
    },
    posts: {
      type: new GraphQLList(Post),
      resolve(person) {
        return person.getPosts();
      }
    }
  })
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'This represents a post',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve(person) {
        return person.id;
      }
    },
    title: {
      type: GraphQLString,
      resolve(post) {
        return post.title;
      }
    },
    content: {
      type: GraphQLString,
      resolve(post) {
        return post.content;
      }
    },
    author: {
      type: Person,
      resolve(post) {
        return post.getPerson();
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is the root query',
  fields: () => ({
    people: {
      type: new GraphQLList(Person),
      args: {
        id: {
          type: GraphQLInt
        },
        email: {
          type: GraphQLString
        }
      },
      resolve(root, args) {
        return Db.models.person.findAll({ where: args });
      }
    },
    posts: {
      type: new GraphQLList(Post),
      resolve(root, args) {
        return Db.models.post.findAll({ where: args })
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to create stuff',
  fields: () => ({
    addPerson: {
      type: Person,
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        lastName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve(_, args) {
        return Db.models.person.create({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email.toLowerCase()
        });
      }
    }
  })
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
