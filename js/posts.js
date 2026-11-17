const postsUrl = "https://ifsp.trojahn.uk/redesocial";
checkToken();
localStorage.removeItem("img");

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
    const payload =  JSON.parse(atob(base64));

    localStorage.setItem("loggedUserId", payload.data);
    localStorage.setItem("loggedUserEmail", payload.sub);
}

decodificarToken();

function imageValid(link) {
    return typeof link === "string" && link.startsWith("http");
}

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

        let userPostsCounter = Number(localStorage.getItem("userPostsCount"));
        let userLikesCounter = Number(localStorage.getItem("userPostsLikesCount"));
    
        let profileStatsDiv = document.createElement("div");
        let postsCounter = document.createElement("div");
        let likesCounter = document.createElement("div");

        let postCounterStat = document.createElement("p");
        postCounterStat.textContent = userPostsCounter;
        let likeCounterStat = document.createElement("p");
        likeCounterStat.textContent = userLikesCounter;
        
        postCounterStat.classList.add("post-stats-number");
        likeCounterStat.classList.add("post-stats-number");
        
        let postCounterSubtitle = document.createElement("p");
        if(userPostsCounter == 1){postCounterSubtitle.textContent = "Publicação";}else{postCounterSubtitle.textContent = "Publicações";}
        let likeCounterSubtitle = document.createElement("p");
        if(userLikesCounter == 1){likeCounterSubtitle.textContent = "Curtida";}else{likeCounterSubtitle.textContent = "Curtidas";}

        postCounterSubtitle.classList.add("post-stats-subtitle");
        likeCounterSubtitle.classList.add("post-stats-subtitle");

        postsCounter.appendChild(postCounterStat);
        postsCounter.appendChild(postCounterSubtitle);

        likesCounter.appendChild(likeCounterStat);
        likesCounter.appendChild(likeCounterSubtitle);

        profileStatsDiv.appendChild(postsCounter);
        profileStatsDiv.appendChild(likesCounter);


        let startButton = document.createElement("button");
        startButton.classList.add("profile-actions-button");
        let homeIcon = document.createElement("span");
        let startText = document.createElement("span");
        startText.textContent = "Início";
        homeIcon.classList.add("icon");
        homeIcon.classList.add("icon-house");
        startButton.appendChild(homeIcon);
        startButton.appendChild(startText);

        let showLikesButton = document.createElement("button");
        showLikesButton.classList.add("profile-actions-button");
        let likeIcon = document.createElement("span");
        let likeText = document.createElement("span");
        likeText.textContent = "Curtidas";
        likeIcon.classList.add("icon");
        likeIcon.classList.add("icon-heart");
        showLikesButton.appendChild(likeIcon);
        showLikesButton.appendChild(likeText);

        let showUserCommentsButton = document.createElement("button");
        showUserCommentsButton.classList.add("profile-actions-button");
        let commentIcon = document.createElement("span");
        let commentText = document.createElement("span");
        commentText.textContent = "Comentários";
        commentIcon.classList.add("icon");
        commentIcon.classList.add("icon-comment");
        showUserCommentsButton.appendChild(commentIcon);
        showUserCommentsButton.appendChild(commentText);


        if(imageValid(user.img)){
            profileCardPic.style.backgroundImage = `url('${user.img}')`;
        }else{
            profileCardPic.textContent = user.nome[0].toUpperCase(); 
        }

        profileInfoDiv.appendChild(profileCardPic);
        profileInfoDiv.appendChild(profileCardName);
        profileInfoDiv.appendChild(profileCardEmail);
        profileInfoDiv.appendChild(profileStatsDiv);
        profileInfoDiv.appendChild(startButton);
        profileInfoDiv.appendChild(showLikesButton);
        profileInfoDiv.appendChild(showUserCommentsButton);
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

            if(imageValid(me.img)) {
                userPic.textContent = ""; 
    
                userPic.style.backgroundImage = "url('" + me.img + "')";
                userPic.style.backgroundSize = "cover";
                userPic.style.backgroundPosition = "center";

                publishPostPic.style.backgroundImage = "url('" + me.img + "')";
                publishPostPic.style.backgroundSize = "cover";
                publishPostPic.style.backgroundPosition = "center";

            } else {
                userPic.textContent = me.nome[0].toUpperCase();
                publishPostPic.textContent = me.nome[0].toUpperCase();
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

//Publish post
const publishPostButton = document.querySelector("#upperPostButton");
const publishPostPic = document.querySelector("#picturePic");
const postTextarea = document.querySelector("#message");
const addImageButton = document.querySelector("#addImageButton");
const imageUrlInput = document.querySelector("#imageUrl");

addImageButton.addEventListener("click", () => {
    imageUrlInput.hidden = !imageUrlInput.hidden;   
});

publishPostButton.addEventListener("click", async () => {
    try {
        const token = localStorage.getItem("token");
        
        if(postTextarea.value.trim() === "") {
            alert("Digite uma mensagem válida!");
            return;
        }
        const newPost = {
            texto: postTextarea.value,
        };

        const link = imageUrlInput.value.trim();

        if (imageValid(link)) {
            newPost.img = link;    
        }

        const op = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
            body: JSON.stringify(newPost),
        };

        publishPostButton.textContent = "Publicando...";

        const response = await fetch(postsUrl + "/posts/", op);
    
        if(!response.ok) {
            throw new Error("Erro ao publicar!" + response.status); 
        }

        postTextarea.value = "";

        imageUrlInput.value = "";
        imageUrlInput.hidden = true;
        
        await get_posts()

    } catch(error) {
        console.log(error.message);
    } finally {
        publishPostButton.textContent = "Publicar";
    }
})

async function edit_post(post, text, image){
    let editedPost = {
        texto: text,
        img: image 
    }

    const op = {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token")},
        body: JSON.stringify(editedPost)
    }
    try{
        let response = await fetch(postsUrl + `/posts/${post.id}`, op);

        if(!response.ok){
            throw new Error("Erro na edição do comentário.");
        }

        await response.json();
        await get_posts();
    }catch(e){
        console.log(e.message);
    }
    
}

function boxDeleteConfirm(deletePost) {
    const backgroundBox = document.createElement("div");
    const box = document.createElement("div");

    const iconWrap = document.createElement("div");
    const binPicDiv = document.createElement("span");

    const title = document.createElement("h3");
    const text = document.createElement("p");

    const buttons = document.createElement("div");
    const cancelButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    

    backgroundBox.className = "confirm-overlay";
    box.className = "confirm-box";
    iconWrap.className = "confirm-icon";
    binPicDiv.className = "icon icon-bin";
    buttons.className = "confirm-buttons";
    cancelButton.className = "confirm-cancel";
    deleteButton.className = "confirm-ok";

    title.textContent = "Excluir post?";
    text.textContent = "Essa ação não pode ser desfeita.";
    cancelButton.textContent = "Cancelar";
    deleteButton.textContent = "Excluir";
    cancelButton.type = "button";
    deleteButton.type = "button";


    iconWrap.appendChild(binPicDiv);       
    buttons.appendChild(cancelButton);     
    buttons.appendChild(deleteButton);

    box.appendChild(iconWrap);             
    box.appendChild(title);
    box.appendChild(text);
    box.appendChild(buttons);

    backgroundBox.appendChild(box);       

    document.body.appendChild(backgroundBox);

    cancelButton.addEventListener("click", () => {
        backgroundBox.remove(); 
    });

    deleteButton.addEventListener("click", () => {
        backgroundBox.remove();
        deletePost();
    });
}

async function delete_post(id) {
    if (!checkToken()) return;

    try {
        const op = {
            method: "DELETE",
            headers: {"Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token")}
        };

        const response = await fetch(postsUrl + "/posts/" + id, op);

        if(!response.ok) {
            throw new Error("Erro ao deletar post " + response.status)
        }

        await get_posts();

    } catch(error) {
        console.log(error.message);
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

async function comment(post, commentText){
    const commentUser = {
        id: localStorage.getItem("loggedUserId"),
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

function alreadyLiked(post) {
    const myId = Number(localStorage.getItem("loggedUserId"));

    for (let i = 0; i < post.likes.length; i++) {
        const like = post.likes[i];

         if (Number(like.usuario) === myId) {    
            return true;
        }
    }

    return false;
}

async function show_posts(posts, users){
    if(!posts){return};

    postsDiv.replaceChildren();
    
    let userPostsCount = 0;
    let userPostsLikesCount = 0;

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
        
        const user = users[post.usuario-1];
        
        if(imageValid(user.img)){
            postUsernameIcon.src = user.img;
        }else{
            postUsernameIcon.src = `../images/icone_perfil1.png`;
        }
        
        postUsername.textContent = user.nome;
        postText.textContent = post.texto;
        
        if(post.usuario == Number(localStorage.getItem("loggedUserId"))){

            userPostsCount += 1;
            userPostsLikesCount += post.likes.length;
            
            //Edit post
            let editPostButton = document.createElement("button");
            editPostButton.classList.add('icon');
            editPostButton.classList.add('icon-pencil');
            
            editPostButton.addEventListener("click", (e)=>{
                e.preventDefault();

                let saveEditButton = document.createElement("button");
                saveEditButton.type = "submit";
                saveEditButton.classList.add('icon');
                saveEditButton.classList.add('icon-save');

                let cancelEditButton = document.createElement("button");
                cancelEditButton.type = "button";
                cancelEditButton.classList.add('icon');
                cancelEditButton.classList.add('icon-cancel');

                let editPostInput = document.createElement("input");
                editPostInput.classList.add("edit-post-input");

                let editPostBox = document.createElement("form");
                
                let editPostImageInput = document.createElement("input");
                editPostImageInput.classList.add("edit-post-input");
                editPostImageInput.placeholder = "Digite o link da imagem aqui";
                
                if(post.img){editPostImageInput.value = post.img;}else{editPostImageInput.value = null}
                editPostInput.value = post.texto;
                
                postContent.removeChild(editPostButton);
                postContent.removeChild(postText);

                editPostBox.addEventListener("submit", (e)=>{
                    e.preventDefault();
                    edit_post(post, editPostInput.value, editPostImageInput.value);
                })

                eventListeners(editPostBox, editPostInput, saveEditButton);
                
                cancelEditButton.addEventListener("click", (e)=>{
                    e.preventDefault();
                    postContent.removeChild(editPostBox);
                    postContent.appendChild(editPostButton);
                    postContent.appendChild(postText);
                })
                
                editPostBox.appendChild(saveEditButton);
                editPostBox.appendChild(cancelEditButton);
                editPostBox.appendChild(editPostInput);
                editPostBox.appendChild(editPostImageInput);
                postContent.appendChild(editPostBox);
                
            })
            postContent.appendChild(editPostButton);


            //Delete post
            const deletePostButton = document.createElement("button");
            deletePostButton.type = "button";
            deletePostButton.className = "delete";
            deletePostButton.title = "Excluir post";

            const deleteIcon = document.createElement("span");
            deleteIcon.className = "icon icon-bin";
            deletePostButton.appendChild(deleteIcon);

            deletePostButton.addEventListener("click", (e) => {
                boxDeleteConfirm(() => {
                    delete_post(post.id);
                });
            });
            postHeader.appendChild(deletePostButton); 
        }
        
        postDiv.appendChild(postContent);

        if (imageValid(post.img)) postImage.src = post.img;

        for(let i=0; i<post.comentarios.length; i++){
            const postComment = document.createElement("div");
            const postCommentUserIcon = document.createElement("img");
            const postCommentContent = document.createElement("div");
            const postCommentUsername = document.createElement("h4");
            const postCommentText = document.createElement("p");
            if(imageValid(users[post.comentarios[i].usuario-1].img)){
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

                    let cancelEditButton = document.createElement("button");
                    cancelEditButton.type = "button";
                    cancelEditButton.classList.add('icon');
                    cancelEditButton.classList.add('icon-cancel');
                
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

                    editCommentBox.addEventListener("submit", (e)=>{
                        e.preventDefault();
                        edit_comment(post.comentarios[i], editInput, postCommentContent, editCommentBox);
                    })

                    eventListeners(editCommentBox, editInput, submit_edit_comment_button);
                    
                    cancelEditButton.addEventListener("click", (e)=>{
                        e.preventDefault();
                        postCommentContent.removeChild(editCommentBox);
                        postCommentContent.appendChild(postCommentText);
                    })

                    
                    editCommentBox.appendChild(cancelEditButton);
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

        if (alreadyLiked(post)) {
            likeIcon.className = "icon icon-heart-filled";
        }
        
        likeBtn.addEventListener('click', async () => {
            const liked = likeIcon.classList.contains("icon-heart-filled");

            const ok = await like(post.id);
            if(!ok) return;

            if(liked) {
                likeIcon.className = "icon icon-heart";
                likeCount.textContent = Number(likeCount.textContent) - 1;
            } else {
                likeIcon.className = "icon icon-heart-filled";
                likeCount.textContent = Number(likeCount.textContent) + 1;
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

    localStorage.setItem("userPostsCount", userPostsCount);
    localStorage.setItem("userPostsLikesCount", userPostsLikesCount);
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
