import { IBootstrapProps as IBootstrapStateProps, BootstrapView, IBootstrapDispatchProps } from './bootstrapView';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RootState } from '../../reducers';
import { BootstrapActions } from '../../reducers/bootstrapReducer';

const mapStateToProps = (state:RootState):IBootstrapStateProps => {
    return {
        fetching:state.bootstrap.fetching,
        success:state.bootstrap.success,
        error:state.bootstrap.error,
    }
}

const mapDispatchToProps = (dispatch: any): IBootstrapDispatchProps => bindActionCreators({
    initialize:BootstrapActions.request,
  }, dispatch);

  export const Bootstrap = connect(mapStateToProps, mapDispatchToProps)(BootstrapView);