import React, { createContext, ReactNode, useEffect, useState } from "react";
import { StorageKeys } from "../common/StorageKeys";
import { authAPI } from "../services/authAPI";
import { Organization } from "../services/organizationsAPI";

export interface UserInfo {
    createdAt: Date;
    deletedAt?: Date;
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    organizationId?: number;
    role: "user" | "org_manager" | "org_staff" | "admin";
    updatedAt: Date;
    organization?: Organization;
    walletAddress?: string;
    isFirstLogin?: boolean;
    avatar?: string;
}

interface UserInfoContextType {
    userInfo: Partial<UserInfo>;
    getUserInfo: () => Promise<void>;
    setUserInfo: React.Dispatch<React.SetStateAction<Partial<UserInfo>>>;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
    const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});

    const getUserInfo = async () => {
        if (localStorage.getItem(StorageKeys.AUTH_TOKEN) === null) {
            return;
        }

        const storedUserInfo = localStorage.getItem(StorageKeys.USER_INFO);

        const res = await authAPI.callback();
        if (res && res?.data) {
            setUserInfo(res.data);
            localStorage.setItem(StorageKeys.USER_INFO, JSON.stringify(res.data));
        } else if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <UserInfoContext.Provider value={{ userInfo, getUserInfo, setUserInfo }}>
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUserInfo = () => {
    const context = React.useContext(UserInfoContext);
    if (!context) {
        throw new Error("useUserInfo must be used within a UserInfoProvider");
    }
    return context;
};