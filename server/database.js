import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

const Db = new Sequelize(
  'aliemu',
  process.env.POSTGRES_ENV_POSTGRES_USER || 'postgres',
  process.env.POSTGRES_ENV_POSTGRES_PASSWORD || 'postgres',
  {
    dialect: 'postgres',
    host: 'postgres',
    port: 5432,
  }
);

// Wrapper for entire application

export const Root = Db.define('root', {
  name: Sequelize.STRING
});

export const User = Db.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

export const Post = Db.define('post', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Relationships
Root.hasMany(User);
User.belongsTo(Root);
User.hasMany(Post);
Post.belongsTo(User);

let userHolder = []

Db.sync({ force: true }).then(() => {
  return Root.create({ name: 'Root' })
})
.then(rootVar => {
  _.times(10, () => {
    userHolder.push(
      rootVar.createUser({
        firstName: Faker.name.firstName(),
        lastName: Faker.name.lastName(),
        email: Faker.internet.email()
      })
    );
  });
  return Promise.all(userHolder);
})
.then(users => {
  let posts = [];
  users.forEach(user => {
    posts.push(user.createPost({
      title: `Sample title by ${user.firstName}`,
      content: `This is a sample article.`
    }));
  });
  return Promise.all(posts);
});

// ^^HOLY PROMISES!!

export { Db };
