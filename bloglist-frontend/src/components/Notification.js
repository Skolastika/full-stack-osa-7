import React from 'react'
import { connect } from 'react-redux'
import { Segment } from 'semantic-ui-react'

class Notification extends React.Component {
  render() {
    if (this.props.notification === null) {
      return null
    }
    return (
      <Segment inverted color={ this.props.color }>
        <div className="notification">
          { this.props.notification }
        </div>
      </Segment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification.notification,
    color: state.notification.color
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification