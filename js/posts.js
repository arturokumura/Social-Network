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

async function get_users(){
    try{
        const response = await fetch(postsUrl + "/usuarios/");

        if(!response.ok){
            throw new Error("Fetch error: " + response.status);
        }
        
        const data = await response.json();
        const users_list = [];
        for(user of data){
            users_list[user.id-1] = user;
        }
        return users_list;
    }
    catch(e){
        console.log("Error fetching posts: " + e.message);
    }
}




function like(post, likeCounter){
    likeCounter.value = "❤️  " + (post.likes.length+1);
    //this one can directly make the POST fetch, just sending the logged user id to add
    //that like to that specific "post.likes".
}

//Both function have to make an API fetch in POST method(i think lol)

function comment(post){
    //actually, this one just opens an input:text for user to type a comment
    //and its submit has to call another function to fetch the API in POST method,
    //adding that comment of the logged user to that specific "post.comentarios".
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

async function show_posts(posts, users){
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

        const postLikeCounter = document.createElement("input");
        postLikeCounter.type = "button";
        postLikeCounter.addEventListener("click", () => {
            like(post, postLikeCounter)
        });

        const postCommentCounter = document.createElement("input");
        postCommentCounter.type = "button";
        postCommentCounter.addEventListener("click", () => {
            comment(post);
        })

        const LikeIcon = document.createElement("img");
        const CommentIcon = document.createElement("img");


        //-------SETTING postDiv TO RECEIVE POSTS-------
        postHeader.appendChild(postUsernameIcon);
        postHeader.appendChild(postUsername);

        postContent.appendChild(postText);
        postContent.appendChild(postImage);
        postContent.appendChild(LikeIcon);
        postContent.appendChild(postLikeCounter);
        postContent.appendChild(CommentIcon);
        postContent.appendChild(postCommentCounter);

        postComment.appendChild(postCommentUserIcon);
        
        postDiv.appendChild(postHeader);
        postDiv.appendChild(postContent);
        
        const user = users[post.usuario-1];
        
        if(user.img){
            postUsernameIcon.src = user.img;
        }else{
            postUsernameIcon.src = `../images/icone_perfil1.png`;
        }

        postUsername.textContent = user.nome;
        postText.textContent = post.texto;
        
        if (post.img) postImage.src = post.img;

        postLikeCounter.value = "🤍  " + (post.likes).length;
        postCommentCounter.value = "💬  " + (post.comentarios).length;

        for(let i=0; i<post.comentarios.length; i++){
            const postComment = document.createElement("div");
            const postCommentUserIcon = document.createElement("img");
            const postCommentContent = document.createElement("div");
            const postCommentUsername = document.createElement("h4");
            const postCommentText = document.createElement("p");

            if(users[post.comentarios[i].usuario-1].img){
                postCommentUserIcon.src = users[post.comentarios[i].usuario-1].img;
            }else{
                postCommentUserIcon.src = `../images/icone_perfil1.png`;
            }

            postCommentUsername.textContent = users[post.comentarios[i].usuario-1].nome;
            postCommentText.textContent = post.comentarios[i].texto;
            
            postCommentContent.appendChild(postCommentUserIcon);
            postCommentContent.appendChild(postCommentUsername);
            postCommentContent.appendChild(postCommentText);
            postComment.appendChild(postCommentContent);
            postDiv.appendChild(postComment);
        }

        postsDiv.appendChild(postDiv);
    }
}

get_posts();