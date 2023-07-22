import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE} from "../constants/index"

const initialState = {
    users: [],
    usersLoaded: 0,
}

export const users  = (state = initialState, action) => {
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users,  action.user]
            }
        case USERS_POSTS_STATE_CHANGE:
            const updatedState= {
                ...state,
                usersLoaded: state.usersLoaded+1,
                //users: updatedUsers
                users: state.users.map((user) => {
                    if (user.uid === action.uid) {
                        console.log("User found with matching uid:", user.uid);
                    }    
                    return user.uid ===action.uid?
                        //user이 있을경우 이게 trigger되야함.
                        {...user, posts: action.posts} : user
                })
            };
            return updatedState;    
        default:
            return state;
    }
}
