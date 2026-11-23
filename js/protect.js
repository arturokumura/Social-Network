checkToken();

window.addEventListener("storage", (e) => {
    if (e.key === null || e.key === "token" || e.key === "loggedUserId") {
        location.reload();
    }
});

window.addEventListener("pageshow", () => {
    checkToken();
});