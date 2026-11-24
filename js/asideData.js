import { imageValid } from "./posts.js";

function initial(name) {
  return (Array.from(name || "")[0] || "?").toUpperCase();
}

const urlBase = "https://ifsp.trojahn.uk/redesocial/";
const loggedUserId = Number(localStorage.getItem("loggedUserId"));

const siteDataDiv = document.querySelector("#siteData");

// Cabeçalho com o token, igual ao usado no posts.js
function authHeaders() {
    return { "Authorization": "Bearer " + localStorage.getItem("token") };
}

//Most liked posts card
async function showMostLikedPosts() {
    
    const mostLikedDiv = document.querySelector("#mostLikedDiv");

    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", "flame");

    const mostLikedTitle = document.createElement("h3");
    mostLikedTitle.classList = "mostLikedTitle";
    mostLikedTitle.textContent = "Posts em destaque";

    const mostLikedList = document.createElement("ol");
    mostLikedList.classList = "mostLikedList";

    const mostLikedHeader = document.createElement("div");
    mostLikedHeader.classList.add("mostLikedHeader");

    mostLikedHeader.append(icon, mostLikedTitle);

    mostLikedDiv.appendChild(mostLikedHeader);
    mostLikedDiv.appendChild(mostLikedList);

    lucide.createIcons();
   
    const postsList = await getMostLikedPost();

    if(postsList.length == 0) {
        const iconEmptyMessage = document.createElement("i");
        iconEmptyMessage.setAttribute("data-lucide", "message-circle");

        const emptyMessage = document.createElement("h4");
        emptyMessage.textContent = "Nenhum post em destaque ainda.";

        const emptyMessageSub = document.createElement("p");
        emptyMessageSub.textContent = "As publicações mais curtidas aparecerão aqui";
        
        iconEmptyMessage.classList.add("emptyIcon");
        emptyMessage.classList.add("emptyTitle");
        emptyMessageSub.classList.add("emptySub");

        mostLikedDiv.appendChild(iconEmptyMessage);
        mostLikedDiv.appendChild(emptyMessage);
        mostLikedDiv.appendChild(emptyMessageSub);

        lucide.createIcons();

    } else {
        let users = [];
        try {
            const usersResponse = await fetch(urlBase + "usuarios/", { headers: authHeaders() });

            if (usersResponse.ok) {
                users = await usersResponse.json();
            }
        } catch (error) {
            console.log(error);
        }

        for(const postMostLiked of postsList) {
            const author = users.find(user => user.id == postMostLiked.idUsuario);

            const objeto = {
                name: author ? author.nome : "Usuário",
                text: postMostLiked.texto,
                likes: postMostLiked.likes
            };

            const row = document.createElement("li");
            row.classList.add("mostLikedItem");

            const userName = document.createElement("span");
            userName.classList.add("mostLikedUser");
            userName.textContent = objeto.name;

            const postMessage = document.createElement("span");
            postMessage.classList.add("mostLikedMessage");
            postMessage.textContent = objeto.text;

            const likes = document.createElement("span");
            likes.classList.add("mostLikedLikes");
            likes.textContent = objeto.likes;

            row.append(userName, postMessage, likes);

            mostLikedList.appendChild(row);
        }
    }

}

async function getMostLikedPost() {
    try {
        const response = await fetch(urlBase + "posts/", { headers: authHeaders() });
        if(!response.ok) {
            throw new Error("Erro GET posts " + response.status);
        }

        const posts = await response.json();

        const likedPostsList = [];

        for (const post of posts) {
            if (post.likes && post.likes.length > 0) {
                likedPostsList.push({
                    idUsuario: post.usuario,
                    idPost: post.id,
                    texto: post.texto,
                    likes: post.likes.length
                });
            }
        }

        likedPostsList.sort(sorted);
        const mostLikedPosts = likedPostsList.slice(-3).reverse();
        return mostLikedPosts;

    } catch(error) {
        console.log(error);
        return [];
    }
}

function sorted(a,b) {
    return a.likes - b.likes;
}

showMostLikedPosts();

//people card
async function listRandomPeople() {
    const response = await fetch(urlBase + "usuarios/", { headers: authHeaders() });

    if(!response.ok) {
        throw new Error("Erro na requisição de usuários");
    }

    const users = await response.json();
    const randomPeopleList = users
        .filter(user => user.id != loggedUserId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    return randomPeopleList;
}

async function showPeopleCard() {
    const peopleCardDiv = document.createElement("usersDiv");
    peopleCardDiv.className = "peopleCard";

    const iconPeople = document.createElement("i");
    iconPeople.setAttribute("data-lucide", "flame");

    const peopleTitle = document.createElement("h3");
    peopleTitle.classList = "peopleTitle";
    peopleTitle.textContent = "Pessoas";

    const peopleList = document.createElement("ol");
    peopleList.classList = "peopleList";

    const peopleHeader = document.createElement("div");
    peopleHeader.classList.add("peopledHeader");

    peopleHeader.append(iconPeople, peopleTitle);

    peopleCardDiv.appendChild(peopleHeader);
    peopleCardDiv.appendChild(peopleList);

    const usersList = await listRandomPeople();

    if(usersList.length == 0) {
        const iconEmptyPeople = document.createElement("i");
        iconEmptyPeople.setAttribute("data-lucide", "user-round-x");
        iconEmptyPeople.classList.add("emptyIconPeople");

        const emptyMessagePeople = document.createElement("h4");
        emptyMessagePeople.textContent = "Nenhuma pessoa por aqui ainda";
        emptyMessagePeople.classList.add("emptyTitle");

        const emptyMessageSubPeople = document.createElement("p");
        emptyMessageSubPeople.textContent = "Quando novos usuários entrarem, eles aparecerão aqui";
        emptyMessageSubPeople.classList.add("emptySubPeople");

        peopleCardDiv.appendChild(iconEmptyPeople);
        peopleCardDiv.appendChild(emptyMessagePeople);
        peopleCardDiv.appendChild(emptyMessageSubPeople);

        lucide.createIcons();

    } else {
        for(const user of usersList) {
            const row = document.createElement("li");
            row.classList.add("peopleItem");

            const userName = document.createElement("span");
            userName.classList.add("userNamePeopleCard");
            userName.textContent = user.nome;

            const userPic = document.createElement("span");
            userPic.classList.add("userPicPeopleCard");

            if(imageValid(user.img)) {
                userPic.style.backgroundImage = "url('" + user.img + "')";
                userPic.style.backgroundSize = "cover";
                userPic.style.backgroundPosition = "center";
            } else {
                userPic.textContent = initial(user.nome);
            }

            row.append(userPic, userName);

            peopleCardDiv.appendChild(row);
        }
    }

    siteDataDiv.appendChild(peopleCardDiv);
    lucide.createIcons();
}

//Recent activity card
async function showRecentActivity() {
    const recentActDiv = document.querySelector("#recentActivitiesDiv");

    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", "message-circle");

    const recentActTitle = document.createElement("h3");
    recentActTitle.classList = "recentActTitle";
    recentActTitle.textContent = "Atividade recente";

    const recentActHeader = document.createElement("div");
    recentActHeader.classList.add("mostLikedHeader");

    recentActHeader.append(icon, recentActTitle);
    recentActDiv.appendChild(recentActHeader);

    const recentActList = document.createElement("ol");
    recentActList.classList.add("recentActList");

    recentActDiv.appendChild(recentActList);

    try {
        const responsePosts = await fetch(urlBase + "posts/", { headers: authHeaders() });

        if (!responsePosts.ok) {
            throw new Error("Erro ao buscar posts");
        }

        const posts = await responsePosts.json();

        const responseUsers = await fetch(urlBase + "usuarios/", { headers: authHeaders() });

        if (!responseUsers.ok) {
            throw new Error("Erro ao buscar usuários");
        }

        const users = await responseUsers.json();

        const myPosts = posts.filter(post => post.usuario == loggedUserId);

        const recentComments = [];

        for (const post of myPosts) {
            if (post.comentarios && post.comentarios.length > 0) {
                for (const comment of post.comentarios) {
                    recentComments.push({
                        comment: comment,
                        post: post
                    });
                }
            }
        }

        if (recentComments.length === 0) {
            const emptyIcon = document.createElement("i");
            emptyIcon.setAttribute("data-lucide", "message-circle");

            const emptyTitle = document.createElement("h4");
            emptyTitle.textContent = "Nenhuma atividade ainda";

            const emptySub = document.createElement("p");
            emptySub.textContent = "Os comentários nas suas publicações aparecerão aqui.";

            emptyIcon.classList.add("emptyIcon");
            emptyTitle.classList.add("emptyTitle");
            emptySub.classList.add("emptySub");

            recentActDiv.append(emptyIcon, emptyTitle, emptySub);

            lucide.createIcons();
            return;
        }

        //show most recent comments
        recentComments.reverse();

        const limitedComments = recentComments.slice(0, 3);

        for (const item of limitedComments) {
            const comment = item.comment;

            const row = document.createElement("li");
            row.classList.add("recentActItem");

            //user that comments
            const commentUserId = comment.usuario;
            const commentUser = users.find(user => user.id == commentUserId);

            const userName = document.createElement("strong");
            
            if (commentUser) {
                userName.textContent = commentUser.nome;
            } else {
                userName.textContent = "Usuário";
            }

            const description = document.createElement("p");
            description.append(userName, " comentou na sua publicação");

            const commentText = document.createElement("span");
            commentText.classList.add("recentActComment");
            commentText.textContent = comment.texto;

            row.append(description, commentText);
            recentActList.appendChild(row);
        }

    } catch (error) {
        console.log("Erro na atividade recente:", error);

        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Não foi possível carregar as atividades.";

        recentActDiv.appendChild(errorMessage);
    }

    lucide.createIcons();
}

showRecentActivity();
showPeopleCard();