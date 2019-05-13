import React from 'react';
import { connect } from 'react-redux';

import { 
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import { getMessages, sendMessage } from '../../store/actions/messenger';
import { CLEAR_MESSAGES } from '../../store/constants';
import { MessageCard } from './MessageCard';
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import Icon from 'react-native-vector-icons/Ionicons';

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        messages: state.messenger.messages,
        messagesLoaded: state.messenger.messagesLoaded
    };
}

const mapDispatchToProps = (dispatch) => {

    return {
        getMessages : (config) => dispatch(getMessages(config)),
        sendMessage: (config) => dispatch(sendMessage(config)),
        clearMessages : () => dispatch({ type : CLEAR_MESSAGES })
    };
}

class MessengerScreen extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            messageField: null,
            config: {
                sender: this.props.user.id,
                destination: this.props.target.id,
                isGroup: this.props.isGroup,
                pw: this.props.user.pw
            }
        }
    }

    componentDidMount() {
        this.props.getMessages(this.state.config);
    }

    componentDidUpdate() {

        /* Update the component every time new messages are fetched */
        if (!this.props.messagesLoaded) {
            this.state.messages = this.props.messages;
            /* Lock this loop */
            this.props.clearMessages();
        }
    }


    /* Input field handler */
    updateMessageField = (text) => {
        this.setState(prevState => {
            return {
                ...prevState,
                messageField: text
            }
        })
    }


    sendMessage = () => {

        /* Get configs for this chat session */
        const { config, messageField } = this.state;
        this.props.sendMessage({
            ...config,
            message: messageField
        });
        this.setState(prevState => {
            return {
                ...prevState,
                messageField: null
            }
        })
    }


    render() {
        
        let conversation;
        const { target, messages, user } = this.props;
		if (messages) {
			conversation = messages.map((message,i) => {

				/* Determine if chathead avatar should be displayed,
					based off consecutive messages  */
				let consecutiveMessage = false;
				if (i > 0) {
					if (messages[i-1].sender === messages[i].sender) {
						consecutiveMessage = true;
					}
				}

				let isSending = (message.sender === user.id);
				let targetPic = target.picture;
				
				/* Change target picture according to group chat */
				if (target.isGroup) {
					for (var j = 0; j < members.length; j++) {
						if (members[j].id === message.sender) {
							targetPic = members[j].picture;
						}
					}
				}

				return <MessageCard key = {i}
								userPic = { user.picture } 
								targetPic = { targetPic } 
								isSending = { isSending }
								consecutiveMessage = { consecutiveMessage } 
								message = { message.message } 
								fileCode = { message.filecode } />
			});
        }
        return (
            
            <View style = {styles.container}>
                <ScrollView 
                    ref = {ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                        this.scrollView.scrollToEnd({animated: true});
                    }}>
    
                    { conversation }
                </ScrollView>
                
                <View style = {styles.input}>
                    <DefaultInput style = {styles.messageInput} onChangeText = { (text) => { this.updateMessageField(text) }}/>
                    <TouchableOpacity onPress = {this.sendMessage}>
                        <Icon name = { 'md-send' } color = "#ADD8E6" size = {30}/>
                    </TouchableOpacity>
                   
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between'
    },
    conversation: {
        justifyContent: 'flex-start'
    },
    messageInput: {
        borderRadius: 5,
        backgroundColor: '#E9E9E9',
        width: '80%'
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 10,
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MessengerScreen);