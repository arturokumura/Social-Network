const postsUrl = "https://ifsp.trojahn.uk/redesocial";

//-------HTML/CSS SELECTORS-------
const userPic = document.querySelector("#usernamePicture");
const headerUsername = document.querySelector("#headerUsername");
const logutButton = document.querySelector("#logoutButton");

const profileInfoAside = document.querySelector("#profileInfo");
const profileInfoDiv = document.querySelector("#profileInfoDiv");

const upperPostDiv = document.querySelector("#upperPostDiv");
const postsDiv = document.querySelector("#postsFetchDiv");


async function decodificarToken() {
    const tokenDados = localStorage.getItem("token").split(".")[1];
    tokenDados.replaceAll("-", "+").replaceAll("_", "/");
    const loggedUserID = await JSON.parse(atob(tokenDados)).data;
    const loggedUserEmail = await JSON.parse(atob(tokenDados)).sub;
    console.log(loggedUserID);
    localStorage.setItem("loggedUserId", loggedUserID);
    localStorage.setItem("loggedUserEmail", loggedUserEmail);
}

decodificarToken()
async function get_posts(){
    try{
        const token = localStorage.getItem("token");
        const response = await fetch(postsUrl + "/posts/", {
            headers: { "Authorization": "Bearer " + token }
        });

        if(!response.ok){
            throw new Error("Fetch error: " + response.status);
        }
        
        const postsData = await response.json();
        const usersData = await get_users();
        const myId = Number(localStorage.getItem("idUsuario"));
        const username = usersData.find(u => u && u.id === myId);

        if (username) {
            userPic.src = username.img;
            headerUsername.textContent = username.nome;
        }
        show_posts(postsData, usersData);
    }
    catch(e){
        console.log("Error fetching posts: " + e.message);
    }
}

async function get_users(){
    try{
        const token = localStorage.getItem("token");
        const response = await fetch(postsUrl + "/usuarios/", {
            headers: { "Authorization": "Bearer " + token }
        });

        if(!response.ok){
            throw new Error("Fetch error: " + response.status);
        }
        
        const data = await response.json();
        localStorage.setItem("idUsuario", data.id);
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

async function getlikes(idPost){

    //this one can directly make the POST fetch, just sending the logged user id to add
    //that like to that specific "post.likes".
    try {
        const token = localStorage.getItem("token")
        
        let op = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
        }
        const response = await fetch(postsUrl + "/posts/" + idPost + '/' + "likes", op);
        
        if(!response.ok) {
            throw new Error("Fetch error: " + response.status);
        }

        await response.json();
        console.log(response);
    } catch(e) {
        console.log(e.message);
    }
}

getlikes()

//Both function have to make an API fetch in POST method(i think lol)

async function comment(post, commentText){
    if(commentText.trim() != ""){
        console.log(commentText);
    }else{
        console.log("Você n comentou nada.");
    }

    const commentUser = {
        id: localStorage.getItem("loggedUserID"),
        texto: commentText
    }

    const op = {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token")},
        body: JSON.stringify()
    };

    try{''
        const response = await fetch(postsUrl + `/posts/${post.id}`, op);
    }catch(e){
        console.log(e);
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

        const postActions = document.createElement('div');
        postActions.className = 'post-actions';

        const likeBtn = createActionButton('icon-heart', post.likes.length);

        likeBtn.addEventListener('click', () => {
          like(post, post.likes.length);
        });

        postActions.appendChild(likeBtn);

        postContent.appendChild(postActions);

        //-------SETTING postDiv TO RECEIVE POSTS-------
        postHeader.appendChild(postUsernameIcon);
        postHeader.appendChild(postUsername);

        postContent.appendChild(postText);
        postContent.appendChild(postImage);

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

        const userCommentBox = document.createElement('form');

        const userInput = document.createElement('input');
        userInput.placeholder = "Comente algo...";
        userCommentBox.classList.add('comment-box');
        userInput.classList.add('comment-input');

        const submit_comment_button = document.createElement('button');
        submit_comment_button.className = 'submit-comment-button';
        const icon = document.createElement("span");
        icon.classList.add('icon');
        icon.classList.add('icon-send');
        submit_comment_button.appendChild(icon);

        userCommentBox.addEventListener("submit", (e)=> {
            e.preventDefault();
            comment(post, userInput.value);
        });

        userCommentBox.appendChild(userInput);
        userCommentBox.appendChild(submit_comment_button);
        postDiv.appendChild(userCommentBox);

        postsDiv.appendChild(postDiv);
    }
}

function createActionButton(iconClass, count){
    const input = document.createElement('button');
    input.className = 'action-btn';

    const icon = document.createElement("span");
    icon.classList.add('icon');
    icon.classList.add(`${iconClass}`);

    const number = document.createElement("span");
    number.classList.add('count');
    number.textContent = count;

    input.appendChild(icon);
    input.appendChild(number);

    return input;
}

get_posts();
console.log(localStorage.getItem("token"))
