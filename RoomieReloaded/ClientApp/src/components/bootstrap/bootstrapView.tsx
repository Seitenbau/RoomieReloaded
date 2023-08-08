import * as React from "react";
import { Action } from 'redux';
import {MessageBar, MessageBarType, Spinner} from "@fluentui/react";
import { IRequestState } from "../../actions/actions";

export interface IBootstrapProps extends React.HTMLAttributes<any>, IRequestState {
}

export interface IBootstrapDispatchProps{
    initialize:() => Action;
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

        if (success) {
            return fetching ? ( <Spinner/> ) : children;
        } else {
            if (error) {
                return fetching ? (<Spinner/>) : <MessageBar messageBarType={MessageBarType.error}>
                    There was an error retrieving the application data.
                </MessageBar>;
            } else {
                return fetching ? (<Spinner/>) : "Something went terribly wrong.";
            }
        }
    }
}