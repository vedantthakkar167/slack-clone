import {atom,useAtom} from "jotai";

const modalState=atom(false);

export const usecreateChannelModal=()=>{
    return useAtom(modalState);
}