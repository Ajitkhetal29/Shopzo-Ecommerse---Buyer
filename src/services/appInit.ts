import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { store } from "@/store";
import { setCategories } from "@/store/slices/generalSlice";


export const initializeApp = async () => {

    const state = store.getState();
    const jobs = [];


    if (state.general.categories.length === 0) {
        jobs.push(
            axios.get(API_ENDPOINTS.GET_CATEGORIES).then((res) => {
                if (res.data.success) {
                    store.dispatch(setCategories(res.data.categories));
                }
            })
        );
    }

    await Promise.allSettled(jobs);




}