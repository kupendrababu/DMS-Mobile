import React, {Component} from 'react'
import {View, AsyncStorage, ActivityIndicator} from 'react-native'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import EmptyDocument from './shared/EmptyDocument.react'
import DocumentList from './shared/DocumentList.react'

import {fetchDocRequest, fetchUserDocRequest, refreshToken} from '../requests/userRequest'
import {isTokenExpired} from '../util/util'

class Home extends Component {
  constructor() {
    super()

    this.state = {tokens: {}, hasRequestUserDocuments: false, loading: true}
    this.documentListProps = this.documentListProps.bind(this)
  }

  async componentDidMount() {
    const tokens = await AsyncStorage.getItem('token')
    const tokensObject = JSON.parse(tokens)

    if (isTokenExpired(tokensObject.token))
      this.props.refreshToken(tokensObject)
    else if (this.props.document.documents < 1)
      this.props.fetchDocRequest(tokensObject.token)
    this.setState({tokens: tokensObject})
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.document.documents.length > 0 && nextProps.user.documents.length < 1 && !prevState.hasRequestUserDocuments) {
      nextProps.fetchUserDocRequest(prevState.tokens.token)
      return {hasRequestUserDocuments: true, loading: false}
    }
    return null
  }

  documentListProps() {
    const homeDocuments = this.props.document.documents.filter(document => document.access !== 'private')

    if (this.props.navigation.state.routeName === 'All')
      return homeDocuments
    else if (this.props.navigation.state.routeName !== 'All' && !this.props.user.documents.message)
      return this.props.user.documents
    else
      return []
  }

  render() {
    const {documents, documentLoading} = this.props.document
    const {routeName} = this.props.navigation.state

    if (this.state.loading || documentLoading || (routeName !== 'All' && this.props.user.loadingDocuments))
      return <ActivityIndicator size='large' color='blue' animating={documentLoading} />
    else if (!documentLoading && !documents.length)
      return <EmptyDocument screen={routeName} />
    else
      return (
        <DocumentList screen={routeName} documents={this.documentListProps()} />
      )
  }
}

const mapStateToProps = state => ({
  document: state.document,
  user: state.user
})

Home.propTypes = {
  document: PropTypes.shape({
    documentLoading: PropTypes.bool,
    documents: PropTypes.arrayOf(PropTypes.object)
  }),
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      routeName: PropTypes.string
    })
  }),
  user: PropTypes.shape({
    documents: PropTypes.arrayOf(PropTypes.object) || PropTypes.object,
    loadingDocuments: PropTypes.bool
  })
}

export default connect(
  mapStateToProps,
  {
    fetchDocRequest,
    fetchUserDocRequest,
    refreshToken
  }
  )(Home)
