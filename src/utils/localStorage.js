export const setLocalStorage = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data))
}

export const getLocalStorage = (name) => {
    if (!name) return;
    const data = localStorage.getItem(name);

    if (!data) return;
    return JSON.parse(data);
}

export const deleteLocalStorage = (name) => {
    localStorage.removeItem(name)
}
