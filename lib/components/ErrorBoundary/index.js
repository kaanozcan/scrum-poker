import React, { Component } from "react";

const defaultState = {
  hasError: false,
  error: null,
  info: null
};

class ErrorBoundary extends Component {
  constructor (props, context) {
    super(props, context);

    this.state = defaultState;
  }

  componentWillReceiveProps () {
    this.setState({
      hasError: false
    });
  }

  componentDidCatch (error, info) {
    this.setState({
      hasError: true,
      error,
      info
    });

    console.log("Error Happened React tree:\n", error, info);
  }

  render () {
    if (this.state.hasError) {
      return (
        <div>
          <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
