import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import jsdom from 'mocha-jsdom';
expect.extend(expectJSX);

class GreetingComponent extends React.Component {
  render() {
    return(
      <div>
        <h1>{this.props.greeting}</h1>
      </div>
    );
  }
}

class EventOnClick extends React.Component {

  constructor() {
    super();
    this.state = { status: 'Off' }
  }

  toggleSwitch() {
    switch (this.state.status) {
      case 'Off':
        return this.setState({ status: 'On' });
      case 'On':
        return this.setState({ status: 'Off' });
      default:
        throw (`Error in state: ${this.state.status}`);
    }
  }

  render() {
    return (
      <a href='#' onClick={this.toggleSwitch.bind(this)}>{this.state.status}</a>
    )
  }
}


describe('Example Test', () => {
  it('should pass automatically', () => {
    expect(true).toEqual(true);
  });
});

describe('Component Tests: GreetingComponent', () => {
  it('should render the greeting', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<GreetingComponent greeting='Hello world!' />);
    const actual = shallowRenderer.getRenderOutput();
    const expected = <h1>Hello world!</h1>;
    expect(actual).toIncludeJSX(expected);
  });
});

describe('Component Tests: EventOnClick', () => {

  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(<EventOnClick />);
  jsdom();
  let renderedComponent, eventOnClickComponent, DOMnode;

  before('Render DOM Node', () => {
    renderedComponent = TestUtils.renderIntoDocument(<EventOnClick />);
    eventOnClickComponent = TestUtils.findRenderedComponentWithType(renderedComponent, EventOnClick);
    DOMnode = ReactDOM.findDOMNode(renderedComponent);
  });

  it('should be a link', () => {
    const actual = shallowRenderer.getRenderOutput().type;
    const expected = 'a';
    expect(actual).toEqual(expected);
  });

  it('should initially be set to "off"', () => {
    expect(eventOnClickComponent.state.status).toEqual('Off');
  });

  it('should toggle to "on" after clicking', () => {
    TestUtils.Simulate.click(DOMnode);
    expect(eventOnClickComponent.state.status).toEqual('On');
  });

});
