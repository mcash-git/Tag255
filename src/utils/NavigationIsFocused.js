import { connect } from 'react-redux';
import React, { Component } from 'react';

const withNavigationIsFocused = (WrappedContainer) => {

  return class extends Component {
    static navigationOptions = {
      ...WrappedContainer.navigationOptions
    };

    constructor(props) {
      super(props);
      this.state = {
        isFocused: false,
      }
    }

    _checkRoute = (props) => {
      const { navigation } = this.props
      if (navigation.state.routeName === props.currentRoute) {
        this.setState({isFocused: true});
      } else {
        this.setState({isFocused: false});
      }
    };

    componentDidMount() {
      // this._checkRoute(this.props);
      console.log(this.props.navigation.state.routeName)
      console.log(this.props.navigation)
      this.isFocusedSub = this.props.navigation.addListener(
        'didFocus',
        payload => {
          console.log('didFocus')
          console.log(payload)
          this.setState({ isFocused: true })
        }
      );
      this.isFocusedSub = this.props.navigation.addListener(
        'didBlur',
        payload => {
          console.log('didBlur')
          this.setState({isFocused: false})
        }
      );
    }

    componentWillReceiveProps(newProps) {
      // this._checkRoute(newProps);
    }

    render() {
      const { isFocused } = this.state
      return <WrappedContainer isFocused={ isFocused } {...this.props} />;
    }
  }
}

export default connectWithNavigationIsFocused = (mapStateToProps, mapDispatchToProps, navigator='routes') => {
  return (container) => (
    connect(
      state => {
        return {
          ...mapStateToProps(state),
          currentRoute: state[navigator].currentRoute
        }
      },
      mapDispatchToProps
    )(withNavigationIsFocused(container))
  )
}