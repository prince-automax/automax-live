export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    console.log(token)

    return token ? true : false;
};
