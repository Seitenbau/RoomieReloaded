import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import React from 'react';
import './toast.css'

const Toast = ({ message }: ToastProps) => {
    return (
        <>
            <div className={`notification bottom-left`}>
                <MessageBar messageBarType={MessageBarType.success}>
                    {message}
                </MessageBar>
            </div>
        </>
    );
}

type ToastProps = {
    message: string
  }

export default Toast;
