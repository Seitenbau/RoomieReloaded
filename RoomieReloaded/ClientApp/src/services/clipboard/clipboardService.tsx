
export function createClipboardService() : IClipboardService
{
    return new ClipboardService();
}

export interface IClipboardService
{
    copyTextToClipboard(text:string) : void;
}

export class ClipboardService implements IClipboardService
{
    public copyTextToClipboard = (text:string) : void =>
    {
        if (!navigator.clipboard) {
          this.fallbackCopyTextToClipboard(text);
          return;
        }

        navigator.clipboard.writeText(text).then(
            () => console.log('Async: Copying to clipboard was successful!'), 
            (err:any) => {
                console.warn('Async: Could not copy text. Calling fallback.', err);
                this.fallbackCopyTextToClipboard(text);
        });
    }

    private fallbackCopyTextToClipboard = (text:string) : void => 
    {        
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
  
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Unable to copy', err);
        }
    
        document.body.removeChild(textArea);
    }
}