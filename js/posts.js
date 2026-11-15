const postsUrl = "https://ifsp.trojahn.uk/redesocial";
checkToken();

//-------HTML/CSS SELECTORS-------
const userPic = document.querySelector("#usernamePicture");
const headerUsername = document.querySelector("#headerUsername");
const logutButton = document.querySelector("#logoutButton");

const profileInfoAside = document.querySelector("#profileInfo");
const profileInfoDiv = document.querySelector("#profileInfoDiv");

const upperPostDiv = document.querySelector("#upperPostDiv");
const postsDiv = document.querySelector("#postsFetchDiv");


function decodificarToken() {
    const tokenDados = localStorage.getItem("token").split(".")[1];
    const base64 = tokenDados.replaceAll("-", "+").replaceAll("_", "/");
    const payload =  JSON.parse(atob(tokenDados));
    const loggedUserEmail = JSON.parse(atob(tokenDados)).sub;
    localStorage.setItem("loggedUserId", payload.data);
    localStorage.setItem("loggedUserEmail", payload.sub);
}

decodificarToken();

async function get_user_info(user){
    if(user){
        profileInfoDiv.replaceChildren(); 

        const profileCardPic = document.createElement("span");
        profileCardPic.className = "profile-card-pic";

        const profileCardName = document.createElement("p");
        profileCardName.className = "profile-card-name";
        profileCardName.textContent = user.nome;

        const profileCardEmail = document.createElement("p");
        profileCardEmail.className = "profile-card-email";
        profileCardEmail.textContent = localStorage.getItem("loggedUserEmail");
    

        if(user.img){
            profileCardPic.style.backgroundImage = `url('${user.img}')`;
        }else{
            profileCardPic.textContent = user.nome[0].toUpperCase(); //"../images/icone_perfil1.png";
        }

        profileInfoDiv.appendChild(profileCardPic);
        profileInfoDiv.appendChild(profileCardName);
        profileInfoDiv.appendChild(profileCardEmail);
    }
}

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

        const myId = Number(localStorage.getItem("loggedUserId"));
        const me = usersData.find(u => u && u.id === myId);

        if (me) {
            userPic.src = me.img;
            headerUsername.textContent = me.nome;

            if(me.img) {
                userPic.textContent = ""; 
    
                userPic.style.backgroundImage = "url('" + me.img + "')";
                userPic.style.backgroundSize = "cover";
                userPic.style.backgroundPosition = "center";
            } else {
                userPic.textContent = me.nome[0].toUpperCase();
            }   
        }

        get_user_info(me);
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

        const users_list = [];
        for(const user of data){
            users_list[user.id-1] = user;
        }
        return users_list;
    }
    catch(e){
        console.log("Error fetching posts: " + e.message);
    }
}

async function like(idPost){

    if (!checkToken()) return false; 
    
    try {
        const token = localStorage.getItem("token")
        
        let op = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
        }
        const response = await fetch(postsUrl + "/posts/" + idPost + '/' + "likes", op);
        
        console.log("Status do like:", response.status);

        if(!response.ok) {
            return false;
        }
    
        console.log("Curtiu: " + response.status);
        return true;
    } catch(error) {
        console.log(error.message);
        return false;
    }
}

//Both function have to make an API fetch in POST method(i think lol)

async function comment(post, commentText){
    const commentUser = {
        id: localStorage.getItem("loggedUserID"),
        texto: commentText
    }
    const op = {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(commentUser)
    };

    try{
        const response = await fetch(postsUrl + `/posts/${post.id}/comentarios`, op);
        if(!response.ok){
            throw new Error("Fetch error: " + response.status);
        }

        await get_posts();
    }catch(e){
        console.log(e);
    }
}

async function delete_comment(commentId){
    const op = {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token")}
    };

    try{
        const response = await fetch(postsUrl + `/comentarios/${commentId}`, op);
        if(!response.ok){
            throw new Error("Erro na remoção do comentário.");
        }

        await get_posts();
    }catch(e){
        console.log(e.message);
    }
}

async function edit_comment(comment, input, commentContent, commentBox){
    if(input.value.trim() == ""){
        input.classList.add('empty-input');
        throw new Error("Não há nada digitado.");
    }
    const newCommentUser = {
        texto: input.value
    }    
    const op = {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(newCommentUser)
    }

    try{
        let response = await fetch(postsUrl + `/comentarios/${comment.id}`, op);
        if(!response.ok){
            throw new Error("Erro na remoção do comentário.");
        }
        await get_posts();

    }catch(e){
        console.log(e.message);
    }finally{
        commentContent.removeChild(commentBox);
        let comment = document.createElement("p");
        comment.textContent = input.value;
        commentContent.appendChild(comment);
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

    postsDiv.replaceChildren();
    

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

        postActions.appendChild(likeBtn);

        postContent.appendChild(postActions);

        //-------SETTING postDiv TO RECEIVE POSTS-------
        postHeader.appendChild(postUsernameIcon);
        postHeader.appendChild(postUsername);

        postContent.appendChild(postText);
        postContent.appendChild(postImage);
        
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
            
            if(users[post.comentarios[i].usuario-1].id == Number(localStorage.getItem("loggedUserId"))){
                const commentDeleteButton = document.createElement("span");
                commentDeleteButton.classList.add("icon");
                commentDeleteButton.classList.add("icon-bin");
                commentDeleteButton.addEventListener("click", (e)=>{
                    e.preventDefault();
                    delete_comment(post.comentarios[i].id);
                })
                postCommentContent.appendChild(commentDeleteButton);
                
                const editCommentButton = document.createElement('span');
                editCommentButton.classList.add("icon");
                editCommentButton.classList.add("icon-pencil");

                editCommentButton.addEventListener("click", (e)=>{
                    let editCommentBox = document.createElement('form');

                    let comment = postCommentText.textContent;

                    if(postCommentText){
                        postCommentContent.removeChild(postCommentText);
                    }

                    const editInput = document.createElement("input");
                    editInput.value = comment;
                    editInput.classList.add('comment-input');

                    const submit_edit_comment_button = document.createElement('button');
                    submit_edit_comment_button.className = 'submit-edit_comment-button';
        
                    const icon_edit_submit_comment = document.createElement("span");
                    icon_edit_submit_comment.className = "icon icon-send";
                    submit_edit_comment_button.appendChild(icon_edit_submit_comment);

                    editCommentBox.addEventListener("submit", ()=>{
                        edit_comment(post.comentarios[i], editInput, postCommentContent, editCommentBox);
                    })

                    eventListeners(editCommentBox, editInput, submit_edit_comment_button);

                    editCommentBox.appendChild(editInput);
                    editCommentBox.appendChild(submit_edit_comment_button);
                    editInput.focus();
                    postCommentContent.appendChild(editCommentBox);
                    e.preventDefault();
                })                

                postCommentContent.appendChild(editCommentButton);
            }
            
            postComment.appendChild(postCommentContent);
            postDiv.appendChild(postComment);
        }
        
        let userCommentBox = document.createElement('form');
        
        let userInput = document.createElement('input');
        userInput.placeholder = "Comente algo...";
        userCommentBox.classList.add('comment-box');
        userInput.classList.add('comment-input');
        
        userInput.addEventListener("input", ()=>{
            if(userInput.value.trim() != ""){
                userInput.placeholder = "Comente algo...";
                userCommentBox.classList.remove("empty-input");
            }
        });
        
        userInput.addEventListener("blur", ()=>{
            userInput.placeholder = "Comente algo...";
            userCommentBox.classList.remove("empty-input");
        });
        
        const submit_comment_button = document.createElement('button');
        submit_comment_button.className = 'submit-comment-button';
        
        const icon_submit_comment = document.createElement("span");
        icon_submit_comment.className = "icon icon-send";
        submit_comment_button.appendChild(icon_submit_comment);

        const likeIcon = likeBtn.querySelector('.icon');
        const likeCount = likeBtn.querySelector('.count');
        
        likeBtn.addEventListener('click', async () => {
            if(likeIcon.classList.contains("icon-heart-filled")) {
                likeIcon.className ="icon icon-heart";
                likeCount.textContent = Number(likeCount.textContent) - 1;
            } else {
                const ok = await like(post.id);
                console.log("deuCerto:", ok);  
                if(ok) {
                    likeIcon.className = "icon icon-heart-filled";
                    likeCount.textContent = Number(likeCount.textContent) + 1;
                }
            }
        });

        userCommentBox.addEventListener("submit", async(e)=> {
            e.preventDefault();
            try{
                submit_comment_button.disabled = true;
                if(userInput.value.trim() != ""){
                    await comment(post, userInput.value);
                }else{
                    userInput.placeholder = "Digite algo para comentar";
                    userCommentBox.classList.add("empty-input");
                    return;
                }
                
            }catch(e){
                console.log(e.message);
            }finally{
                userInput.value = "";
                submit_comment_button.disabled = false;
            }
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

function eventListeners(commentBox, commentInput, submitButton){
    commentBox.addEventListener("submit", (e)=> {
            e.preventDefault();
            try{
                submitButton.disabled = true;
                if(commentInput.value.trim() == ""){
                    commentInput.placeholder = "Digite algo para comentar";
                    commentBox.classList.add("empty-input");
                    commentInput.focus();
                    return;
                }
            }catch(e){
                console.log(e.message);
            }finally{
                commentInput.value = "";
                submitButton.disabled = false;
            }
        });
    
    commentInput.addEventListener("input", (e)=>{
        e.preventDefault();
        if(commentInput.value.trim() == ""){
            commentInput.placeholder = "Digite algo para comentar";
            commentBox.classList.add("empty-input");
            return;
        }else{
            commentBox.classList.remove("empty-input");
        }
    })
    
    commentInput.addEventListener("blur", ()=>{
        commentInput.placeholder = "Digite algo para comentar";
        commentBox.classList.remove("empty-input");
    })
}

get_posts();