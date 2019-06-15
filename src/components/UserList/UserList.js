import React from 'react';
import { connect } from 'react-redux';

import { 
    ScrollView,
    StyleSheet
} from 'react-native';

import UserCard from './UserCard';

import { getList, setDisable } from '../../store/actions/messenger';
import { CLEAN_MESSAGES } from '../../store/constants';


const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        list: state.messenger.list,
        disabled: state.messenger.disabled
    };
}

const mapDispatchToProps = (dispatch) => {

    return {
        getList : (authData) => dispatch(getList(authData)),
        clearMessages: () => dispatch({ type : CLEAN_MESSAGES }),
        setDisable : () => dispatch(setDisable())
    };
}

class UserList extends React.Component {

    constructor(props) {
        super(props);
        const user = this.props.user;
        this.props.getList({
            id: user.id,
            pw: user.pw
        })

        
    }

    
    onSelectUser = (user) => {
        this.props.setDisable();
        this.props.clearMessages();
        this.props.onSelectUser(user);
    }


    render() {

        let userList = null;
        
        userList = this.props.list.map((user,i) => {
            return <UserCard key = {i}
                            onSelectUser = {this.onSelectUser}
                            user = { user }
                            disabled = { this.props.disabled }
                             />
        });

        
        return (
            <ScrollView style = {styles.container}>
                { userList }
            </ScrollView>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        height: '100%'
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(UserList);