import * as React from "react";
import { Action } from 'redux';
import {MessageBar, MessageBarType, Spinner} from "office-ui-fabric-react";
import { IRequestState } from "../../actions/actions";

export interface IBootstrapProps extends React.HTMLAttributes<any>, IRequestState {
}

export interface IBootstrapDispatchProps{
    initialize:() => Action<any>;
}

export class BootstrapView extends React.Component<IBootstrapProps & IBootstrapDispatchProps>{

    public componentDidMount(){
        this.props.initialize();
    }

    public render() {
        const {
          children,
          success,
          fetching,
          error,
        } = this.props;
            
        return fetching ? (
            <Spinner />
        ) : success ? (
            children
        ) : error ? (
            <MessageBar messageBarType={MessageBarType.error}>
            There was an error retrieving the application data.
            </MessageBar>
        ) : (
            "Something went terribly wrong."
        );
    }
}