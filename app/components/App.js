import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Test list</h1>
          {this.props.root.users.edges.map(edge => {
            return(
              <div key={edge.node.id}>
                <h2>Posts by {edge.node.firstName} {edge.node.lastName}...</h2>
                {edge.node.posts.edges.map(postEdge => {
                  return(
                    <ul key={postEdge.node.id}>
                      <li>Title: {postEdge.node.title}</li>
                      <li>Content: {postEdge.node.content}</li>
                    </ul>
                  );
                })}
              </div>
            );
          })}
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    root: () => Relay.QL`
      fragment on Root {
        users(first: 8) {
          edges {
            node {
              firstName,
              lastName,
              id
              posts(first: 10){
                edges {
                  node {
                    id,
                    title,
                    content
                  }
                }
              }
            }
          }
        }
      },
    `,
  },
});
