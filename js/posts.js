const postsUrl = "https://ifsp.trojahn.uk/redesocial";

//-------HTML/CSS SELECTORS-------
const userPic = document.querySelector("#usernamePicture");
const headerUsername = document.querySelector("#headerUsername");
const logutButton = document.querySelector("#logoutButton");

const profileInfoAside = document.querySelector("#profileInfo");
const profileInfoDiv = document.querySelector("#profileInfoDiv");

const upperPostDiv = document.querySelector("#upperPostDiv");
const postsDiv = document.querySelector("#postsFetchDiv");


async function get_posts(){
    try{
        const response = await fetch(postsUrl + "/posts");

        if(!response.ok){
            throw new Error("Fetch error: " + response.status);
        }
        
        const postsData = await response.json();
        const usersData = await get_users();
        show_posts(postsData, usersData);
    }
    catch(e){
        console.log("Error fetching posts: " + e.message);
    }
}

async function get_users(userId){
    try{
        const response = await fetch(postsUrl + "/usuarios/" + userId);

        if(!response.ok){
            throw new Error("Fetch error: " + response.status);
        }
        
        const data = await response.json();
        return data;
    }
    catch(e){
        console.log("Error fetching posts: " + e.message);
    }
}

//-------CREATING HTML ELEMENTS FOR EACH POST-------
const postDiv = document.createElement("div");

const postHeader = document.createElement("div");
const postUsername = document.createElement("h3");
const postUsernameIcon = document.createElement("img");

const postContent = document.createElement("div");
const postText = document.createElement("p");
const postImage = document.createElement("img");
const postLikeCounter = document.createElement("p");
const LikeIcon = document.createElement("img");
const postCommentCounter = document.createElement("p");
const CommentIcon = document.createElement("img");

const postComment = document.createElement("div");
const postCommentUserIcon = document.createElement("img");
const postCommentContent = document.createElement("div");
const postCommentUsername = document.createElement("h4");
const postCommentText = document.createElement("p");

//-------SETTING postDiv TO RECEIVE POSTS-------
postHeader.appendChild(postUsernameIcon);
postHeader.appendChild(postUsername);

postContent.appendChild(postText);
postContent.appendChild(postImage);
postContent.appendChild(LikeIcon);
postContent.appendChild(postLikeCounter);
postContent.appendChild(CommentIcon);
postContent.appendChild(postCommentCounter);

postCommentContent.appendChild(postCommentUsername);
postCommentContent.appendChild(postCommentText);

postComment.appendChild(postCommentUserIcon);
postComment.appendChild(postCommentContent);

postDiv.appendChild(postHeader);
postDiv.appendChild(postContent);
postDiv.appendChild(postComment);

async function show_posts(posts){
    if(!posts){return};

    for(let post of posts){
        //-------CREATING HTML ELEMENTS FOR EACH POST-------
        const postDiv = document.createElement("div");

        const postHeader = document.createElement("div");
        const postUsername = document.createElement("h3");
        const postUsernameIcon = document.createElement("img");

        const postContent = document.createElement("div");
        const postText = document.createElement("p");
        const postImage = document.createElement("img");
        const postLikeCounter = document.createElement("p");
        const LikeIcon = document.createElement("img");
        const postCommentCounter = document.createElement("p");
        const CommentIcon = document.createElement("img");

        const postComment = document.createElement("div");
        const postCommentUserIcon = document.createElement("img");
        const postCommentContent = document.createElement("div");
        const postCommentUsername = document.createElement("h4");
        const postCommentText = document.createElement("p");

        //-------SETTING postDiv TO RECEIVE POSTS-------
        postHeader.appendChild(postUsernameIcon);
        postHeader.appendChild(postUsername);

        postContent.appendChild(postText);
        postContent.appendChild(postImage);
        postContent.appendChild(LikeIcon);
        postContent.appendChild(postLikeCounter);
        postContent.appendChild(CommentIcon);
        postContent.appendChild(postCommentCounter);

        postCommentContent.appendChild(postCommentUsername);
        postCommentContent.appendChild(postCommentText);

        postComment.appendChild(postCommentUserIcon);
        postComment.appendChild(postCommentContent);

        postDiv.appendChild(postHeader);
        postDiv.appendChild(postContent);
        postDiv.appendChild(postComment);

        const user = await get_users(post.usuario);

        postUsername.textContent = user.nome;
        postText.textContent = post.texto;
        postsDiv.appendChild(postDiv);
    }
}

get_posts();