import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import Contoso from "../../assets/Contoso.svg";
import { CopyRegular } from "@fluentui/react-icons";
import { Dialog, Stack, TextField } from "@fluentui/react";
import { useContext, useEffect, useState } from "react";
import { HistoryButton, ShareButton } from "../../components/common/Button";
import { AppStateContext } from "../../state/AppProvider";
import { CosmosDBStatus } from "../../api";
import { historyRead } from "../../api";
import Packer from 'docx';
//import { fetchLastMessageContent } from "../../api";
//import { Conversation } "../../state/AppProvider";


const Layout = () => {
    const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
    const [copyClicked, setCopyClicked] = useState<boolean>(false);
    const [copyText, setCopyText] = useState<string>("Copy URL");
    const [shareLabel, setShareLabel] = useState<string | undefined>("Share");
    const [hideHistoryLabel, setHideHistoryLabel] = useState<string>("Hide chat history");
    const [showHistoryLabel, setShowHistoryLabel] = useState<string>("Show chat history");
    const appStateContext = useContext(AppStateContext)
    const ui = appStateContext?.state.frontendSettings?.ui;

    //const { state } = appStateContext || {}; // Destructure state from context or default to an empty object
    const contextValue = useContext(AppStateContext);

    // Check if contextValue is defined before accessing its properties
    if (!contextValue) {
        // Handle the case where contextValue is undefined
        return null; // Or render some fallback UI
    }

    const { state } = contextValue;

    // Now TypeScript should recognize state as having type AppState

    // Use state.currentChat here as needed
    const currentChat = state.currentChat;
    //const currentChat = appStateContext.
    const userId = state?.userId;
    const conversationId = state?.conversationId;
    
    if (conversationId) {
        console.log('conversationId found in application state:', conversationId);
    } else {
        console.log('conversationId not found in application state');
    }


    const handleShareClick = () => {
        setIsSharePanelOpen(true);
    };

    const handleSharePanelDismiss = () => {
        setIsSharePanelOpen(false);
        setCopyClicked(false);
        setCopyText("Copy URL");
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopyClicked(true);
    };

    const handleHistoryClick = () => {
        appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
    };

    const handleDownloadClick = async () => {
        try {
            // Retrieve the conversationId from the application state
            //const conversationId = state?.conversationId;
    
            // if (!conversationId) {
            //     console.error("Conversation ID not found.");
            //     return;
            // }
    
            // Fetch the last message content
            //const lastMessageContent = await fetchLastMessageContent(conversationId);
            //const lastMessageContent = Conversation.messages[Conversation.messages.length - 1];
            
            // if (!state || !state.currentChat) {
            //     return <div>There is no current chat.</div>;
            //   }
            
            //   const { messages } = state.currentChat;
            
            //   if (!messages || messages.length === 0) {
            //     return <div>There are no messages in the current chat.</div>;
            //   }
            
            //   const lastMessage = messages[messages.length - 1];
            // const lastMessageContent = lastMessage ? lastMessage.content : 'There is no last message found';
            // if (!lastMessageContent) {
            //     console.error("Last message content not found.");
            //     return;
            // }
    
            // // Create a Blob object containing the last message content
            // const blob = new Blob([lastMessageContent], { type: 'text/plain' });
    
            // // Create a URL for the Blob object
            // const url = URL.createObjectURL(blob);
    
            // // Create a temporary anchor element
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = 'last_message.txt'; // Set the filename for the downloaded file
    
            // // Append the anchor element to the document body
            // document.body.appendChild(a);
    
            // // Trigger a click event on the anchor element to start the download
            // a.click();
    
            // // Remove the anchor element from the document body
            // document.body.removeChild(a);
    
            // // Revoke the URL to release the resources
            // URL.revokeObjectURL(url);

            if (!state || !state.currentChat) {
                console.error("There is no current chat.");
                return;
            }
            
            const { messages } = state.currentChat;
            
            if (!messages || messages.length === 0) {
                console.error("There are no messages in the current chat.");
                return;
            }
            
            const lastMessage = messages[messages.length - 1];
            let lastMessageContent = lastMessage ? lastMessage.content : 'There is no last message found';
            
            if (!lastMessageContent) {
                console.error("Last message content not found.");
                return;
            }
    
            // Create a Blob object containing the last message content
            // type: 'application/octet-stream'
            //const blob = new Blob([lastMessageContent], { type: 'application/msword' });
            Packer.toBlob(lastMessageContent).then(blob => 
            {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Job Description.docx';
         
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
           });
         
         
            // const blob = new Blob([lastMessageContent], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            // // Create a URL for the Blob object
            // const url = URL.createObjectURL(blob);
    
            // // Create a temporary anchor element
            // const a = document.createElement('a');
            // a.href = url;
            // // docx
            // //a.download = 'Job Description.doc'; // Set the filename for the downloaded file
            // a.download = 'Job Description.docx';
            // Append the anchor element to the document body
            // document.body.appendChild(a);
    
            // Trigger a click event on the anchor element to start the download
            // a.click();
    
            // Remove the anchor element from the document body
            // document.body.removeChild(a);
    
            // Revoke the URL to release the resources
            // URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };
    

    
    

    useEffect(() => {
        if (copyClicked) {
            setCopyText("Copied URL");
        }
    }, [copyClicked]);

    useEffect(() => { }, [appStateContext?.state.isCosmosDBAvailable.status]);

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 480) {
            setShareLabel(undefined)
            setHideHistoryLabel("Hide history")
            setShowHistoryLabel("Show history")
          } else {
            setShareLabel("Share")
            setHideHistoryLabel("Hide chat history")
            setShowHistoryLabel("Show chat history")
          }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                    <Stack horizontal verticalAlign="center">
                        <img
                            src={ui?.logo ? ui.logo : Contoso}
                            className={styles.headerIcon}
                            aria-hidden="true"
                        />
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h1 className={styles.headerTitle}>{ui?.title}</h1>
                        </Link>
                    </Stack>
                    {ui?.show_share_button &&
                        <Stack horizontal tokens={{ childrenGap: 4 }}>
                            {(appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured) &&
                                <HistoryButton onClick={handleHistoryClick} text={appStateContext?.state?.isChatHistoryOpen ? hideHistoryLabel : showHistoryLabel} />
                            }
                            <ShareButton onClick={handleShareClick} text={shareLabel} />
                        </Stack>
                    }
                </Stack>
            </header>
            <Outlet />
            <Dialog
                onDismiss={handleSharePanelDismiss}
                hidden={!isSharePanelOpen}
                styles={{

                    main: [{
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                maxWidth: '600px',
                                background: "#FFFFFF",
                                boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                                borderRadius: "8px",
                                maxHeight: '200px',
                                minHeight: '100px',
                            }
                        }
                    }]
                }}
                dialogContentProps={{
                    title: "Share the web app",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: "8px" }}>
                    <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly />
                    <div
                        className={styles.copyButtonContainer}
                        role="button"
                        tabIndex={0}
                        aria-label="Copy"
                        onClick={handleCopyClick}
                        onKeyDown={e => e.key === "Enter" || e.key === " " ? handleCopyClick() : null}
                    >
                        <CopyRegular className={styles.copyButton} />
                        <span className={styles.copyButtonText}>{copyText}</span>
                    </div>
                    {/* Add the download button */}
                    <button onClick={handleDownloadClick}>Download</button>
                </Stack>
            </Dialog>
        </div>
    );
};

export default Layout;
