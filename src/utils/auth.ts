import { StorageKeys } from "../common/StorageKeys"

export const logout = () => {
    Object.values(StorageKeys).forEach((key) => {
        localStorage.removeItem(key)
    })
    sessionStorage.clear()
    window.location.href = '/login'
}