import create from 'zustand';

const store = (set) => ({
    token: null,
    setToken: (token) => set(() => ({ token: token })),
    removeToken: () => set(() => ({ token: null })),
})

const useStore = create(store)

export default useStore; 
