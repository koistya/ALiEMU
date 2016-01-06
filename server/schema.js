/* @flow */
import {
  GraphQLObjectType,
  GraphQLString,
  // GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay';

import { Db } from './database';

/* ***************************************************************
 *                         Interfaces                            *
 ****************************************************************/


const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    switch (type) {
    case 'Root':
      return Db.models.root.findAll();
    case 'User':
      return Db.models.user.findAll({ where: { id } });
    case 'Post':
      return Db.models.post.findAll({ where: { id } });
    default:
      return null;
    }
  },
  (obj) => {
    switch (obj[0].$modelOptions.name.singular) {
    case 'root':
      return RootType;
    case 'user':
      return UserType;
    case 'post':
      return PostType;
    default:
      return null;
    }
  }
)

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a user',
  fields: () => ({
    id: globalIdField('User'),
    firstName: {
      type: GraphQLString,
      description: 'The user\'s first name'
    },
    lastName: {
      type: GraphQLString,
      description: 'The user\'s last name'
    },
    email: {
      type: GraphQLString,
      description: 'The user\'s email'
    },
    posts: {
      type: postConnection,
      desctiption: 'A list of posts by the user',
      args: connectionArgs,
      resolve: async (user, args) => {
        let posts = await user.getPosts();
        return connectionFromArray(posts, args);
      },
    }
  }),
  interfaces: [nodeInterface],
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'This represents a post',
  fields: () => ({
    id: globalIdField('Post'),
    title: {
      type: GraphQLString,
      description: 'The post title',
    },
    content: {
      type: GraphQLString,
      description: 'The post content',
    },
    user: {
      type: UserType,
      desctiption: 'The author of the post',
      resolve: (post) => post.getUser(),
    },
  }),
  interfaces: [nodeInterface],
});

const RootType = new GraphQLObjectType({
  name: 'Root',
  description: 'Root Object',
  fields: () => ({
    id: globalIdField('Root'),
    users: {
      type: userConnection,
      description: 'All users within this application',
      args: connectionArgs,
      resolve: async (_, args) => {
        let users = await Db.models.user.findAll();
        return connectionFromArray(users, args);
      }
    },
    posts: {
      type: postConnection,
      description: 'All posts within this application',
      args: connectionArgs,
      resolve: async (_, args) => {
        let posts = await Db.models.post.findAll();
        return connectionFromArray(posts, args);
      }
    },
  }),
  interfaces: [nodeInterface],
});

/* ******************************************************************
 *                  Connection Definitions                          *
 *******************************************************************/

const { connectionType: postConnection } =
  connectionDefinitions({ name: 'Post', nodeType: PostType });

const { connectionType: userConnection } =
  connectionDefinitions({ name: 'User', nodeType: UserType });


/* ****************************************************************
 *                          Root Query                            *
 *****************************************************************/

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is the root query',
  fields: () => ({
    node: nodeField,
    root: {
      type: RootType,
      resolve: () => Db.models.root.findAll()
    }
  })
});

/* **********************************************************************
 *                          Root Mutation                               *
 ***********************************************************************/

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to create stuff',
  fields: () => ({
    addPerson: {
      type: UserType,
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
});



export const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
