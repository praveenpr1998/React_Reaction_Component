import React, { Component } from "react";
import "./ErrorBoundary.scss";
import { Result } from "antd";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id="ErrorBoundary">
          <div className="red-text">
            <Result
              status="error"
              title="Something went wrong."
              subTitle="Check your console for errors."
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
