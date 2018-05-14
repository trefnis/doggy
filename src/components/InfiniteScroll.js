import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const offset = '2000';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 200px;
`;

class InfiniteScroll extends Component {
  endIndicatorRef = createRef();

  componentDidMount() {
    const observerOptions = {
      root: null,
      rootMargin: `${offset}px`,
      threshold: [0, 0.05, 0.1, 0.5, 0.9, 1],
    };

    this.observer = new window.IntersectionObserver(
      this.handleIntersection,
      observerOptions
    );

    this.observer.observe(this.endIndicatorRef.current);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  handleIntersection = ([entry]) => {
    if (entry.isIntersecting && !this.props.isLoading) {
      this.fetch();
    }
  };

  fetch() {
    this.props.fetch();
  }

  render() {
    return (
      <Fragment>
        {this.props.children}
        <LoaderContainer>
          {this.props.isLoading && <CircularProgress size={80} />}
        </LoaderContainer>
        <div ref={this.endIndicatorRef} style={{ height: '100px' }} />
      </Fragment>
    );
  }
}

InfiniteScroll.propTypes = {
  children: PropTypes.node.isRequired,
};

InfiniteScroll.defaultProps = {
  photos: [],
};

export default InfiniteScroll;
