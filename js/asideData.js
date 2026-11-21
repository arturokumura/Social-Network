import { imageValid } from "./posts.js";

const urlBase = "https://ifsp.trojahn.uk/redesocial/";
const loggedUserId = Number(localStorage.getItem("loggedUserId"));

const siteDataDiv = document.querySelector("#siteData");

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
        const usersResponse = await fetch(urlBase + "usuarios/");

        if (usersResponse.ok) {
            users = await usersResponse.json();
        } else {
            users = [];
        }
        for(const postMostLiked of postsList) {
            const objeto = await getData(postMostLiked.idUsuario, postMostLiked.idPost, postMostLiked.likes, users);

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

async function getLikes(postId) {
    try {
        const response = await fetch(urlBase + "posts/" + postId + "/likes");
        if(!response.ok) {
            throw new Error("Erro GET likes" + response.status);
        
        }
        const likesData = await response.json();

        return likesData.length;

    } catch(error)  {
        console.log(error);
    }
}

async function getMostLikedPost() {
    try {
        const response = await fetch(urlBase + "posts/");
        if(!response.ok) {
            throw new Error("Erro GET posts " + response.status);
        }

        const posts = await response.json();

        const likedPostsList = [];

        for (const post of posts) {
            if (post.likes && post.likes.length > 0) {
                const totalLikes = await getLikes(post.id);
                const idPostValue = post.id;
                const idUsuarioValue = post.usuario;

                likedPostsList.push({idUsuario : idUsuarioValue, idPost: idPostValue, likes: totalLikes});
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

async function getData(idUser, idPost, likesCount, users) {
    let userName;
    for(const user of users) {
        if(user.id == idUser) {
            userName = user.nome;
            break;
        } 
    }

    const responsePost = await fetch(urlBase + "posts/" + idPost);
    
    if(!responsePost.ok) {
        throw new Error("Erro ao buscar dados dos posts " + responsePost.status);
    }

    const posts = await responsePost.json();

    const message = posts.texto;

    return {"name" : userName, "text": message, "likes": likesCount};
}

showMostLikedPosts();

listRandomPeople();
