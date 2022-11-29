import React from "react";

export type IProps = { foo: string };
export type IState = { count: number };
export class ClassicalComponent extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div style={{ border: '2px solid red' }}>
        <h1>Hello Classical React</h1>
        <pre>{JSON.stringify(this.props)}</pre>
        <p>foo: {this.props.foo}</p>
        <pre>{JSON.stringify(this.state)}</pre>
        <p>count: {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click
        </button>
      </div>
    );
  }
}

export type IClassicalComponent = ClassicalComponent;