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
            
        //     Packer.toBlob(lastMessageContent).then(blob => 
        //     {
        //         const url = URL.createObjectURL(blob);
        //         const a = document.createElement('a');
        //         a.href = url;
        //         a.download = 'Job Description.docx';
         
        //         document.body.appendChild(a);
        //         a.click();
        //         URL.revokeObjectURL(url);
        //    });
         

            const sections = lastMessageContent.split(/(?=#|\#\#|\n)/);        // Split content into sections based on "#" and "##"
            //const sections = lastMessageContent.split(/\n(?=#|\#\#)/); // Split content into sections based on "#" and "##"

            console.error(sections);
            let formattedText = '';





            sections.forEach((section) => {
                let formattedSection = section.trim(); // Remove leading and trailing whitespaces
        
                if (formattedSection.startsWith('# Job Description')) {
                    // Section is a main title
                    const title = formattedSection.substring(1).trim();
                    formattedSection = `<p style="font-size: 32px; text-align: center;"><b>${title}</b></p>`;
                    console.error(formattedSection);
                } else if (formattedSection.startsWith('#') && !formattedSection.startsWith('# Job Description')) {
                    // Section is a subtitle
                    const subtitle = formattedSection.substring(2).trim();
                    formattedSection = `<p style="font-size: 24px; text-align: left;"><b>${subtitle}</b></p>`;
                    console.error(formattedSection);
                } else {
                    // Section is body text
                    // loop
                    formattedSection = formattedSection.replace(/^\s*-\s*/gm, '<br>-').replace(/\n+/g, ''); // Replace "- " or " - " with "<br>-" and remove extra newlines
                    
                    console.error(formattedSection);
                    // let dashText = '';
                    // if(formattedSection.startsWith('- '))
                    // {
                    //     dashText += formattedSection;
                    // }

                    //formattedSection = `<p style="font-size: 12px; text-align: left;">${formattedSection}</p>`;
                    //formattedSection = formattedSection.replace(/(<br>|\n)/g, '<br style="line-height: 0.1;">'); // Reduce vertical space to 0.1 for empty lines
                    formattedSection = `<p style="font-size: 12px; text-align: left; margin: 0 !important; padding: 0 !important;">${formattedSection}</p>`;

                }
                formattedSection = formattedSection.replace(/\[doc\d+\]/g, '');
                formattedText += formattedSection + '\n';
            });
        
    
            //let formattedText = lastMessageContent;


        // lastMessageContent will be the original text.
        // Create an arrayList for each section. Each section will have a change in the font size.
        // variable to use for the substring; we will call it currentText
        /*
        String currentText = "";
        String mainTitle = "";
        if(lastMessageContent.includes("#"))
        {
            // Will include the first # till the next subheader.
            currentText = formattedText.substring(0,formattedText.indexOf("##")) //This will get us to the next section. Might need to revisit
            if(currentText.includes("##"))
            {
                mainTitle = substring(currentText.indexOf("#"))
                formattedText = `<div style="text-align: center; font-weight: bold; font-size: 24px;">${formattedText}</div>`;
            }
        }
        
        // We can 

        */

        // We will need a loop
        // first we can do this for the Main title:

            // For the main title:
            // if (formattedText.includes('#')) {
            //     // If the sentence contains one "#" sign, align center, bold, and font size 32
            //     formattedText = `<div style="text-align: center; font-weight: bold; font-size: 32px;">${formattedText}</div>`;
            // }

        //We can assume that there will be no more ## since the big title is done.
        // For the next #

        //formatContent(formattedText)



            // For the Subheader
            // if (formattedText.includes('##')) {
            //     // If the sentence contains two "##" signs, align left, bold, and font size 24
            //     formattedText = `<div style="text-align: left; font-weight: bold; font-size: 24px;">${formattedText}</div>`;
            // }
            //const cleanText = formattedText.replace(/#/g, '').replace('[doc1]', "").replace('[doc2]', "").replace('[doc3]', "").replace('[doc4]', "").replace('[doc5]', "");
            const cleanText = formattedText.replace(/#/g, '')
            //const cleanText = formattedText.replace(/#/g, '').replace(/\s*\[doc\d+\]\.$/, ''); // Remove '#' in the beginning and " [docX]." at the end of a sentence


            
            const htmlText = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Job Description</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                    </style>
                </head>
                <body>
                    ${cleanText}
                </body>
                </html>
            `;
            


            //const boldText = '<b>'+cleanText+'</b>'
        
            const blob = new Blob([htmlText], {type: 'application/msword' });

            // Create a URL for the Blob object
            const url = URL.createObjectURL(blob);
    
            // Create a temporary anchor element
            const a = document.createElement('a');
            a.href = url;
            // docx
            a.download = 'Job Description.doc'; // Set the filename for the downloaded file
            // a.download = 'Job Description.docx';
            // Append the anchor element to the document body
            document.body.appendChild(a);
    
            // Trigger a click event on the anchor element to start the download
            a.click();
    
            // Remove the anchor element from the document body
            document.body.removeChild(a);
    
            // Revoke the URL to release the resources
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };
    

    function formatContent(content: string): string {
        let sections: string[] = [];
        
        // Split the content by ## to separate sections
        const sectionContents = content.split('\n## ');
        
        // Process each section
        sectionContents.forEach((sectionContent, index) => {
            // Split each section into lines
            const lines = sectionContent.split('\n').filter(line => line.trim() !== '');
    
            // Process the first line separately (usually the header)
            if (index === 0) {
                sections.push(`<div style="font-size: 32px">${lines[0]}</div>`);
            } else {
                sections.push(`<div style="font-size: 24px">${lines[0]}</div>`);
            }
    
            // Process the remaining lines with smaller font size
            for (let i = 1; i < lines.length; i++) {
                sections.push(`<div style="font-size: 16px">${lines[i]}</div>`);
            }
        });
    
        // Combine sections into final formatted content
        return sections.join('');
    }
    
    
    

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
  