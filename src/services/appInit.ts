import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { store } from "@/store";
import { setCategories } from "@/store/slices/generalSlice";
import { setBuyer } from "@/store/slices/authSlice";
import { setCartItems } from "@/store/slices/cartSlice";


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

    const loadCart = async (userId: string) => {
        const cartRes = await axios.get(`${API_ENDPOINTS.GET_CART}/${userId}`, {
            withCredentials: true,
        });
        store.dispatch(setCartItems(cartRes.data.data?.items || []));
    };

    if (state.auth.buyer?._id) {
        jobs.push(loadCart(state.auth.buyer._id));
    } else {
        jobs.push(
            axios
                .get(API_ENDPOINTS.CURRENT_USER, { withCredentials: true })
                .then(async (res) => {
                    if (res.data.success && res.data.user?._id) {
                        store.dispatch(setBuyer(res.data.user));
                        await loadCart(res.data.user._id);
                    }
                })
                .catch((error) => {
                    if (error.response?.status === 401) return;
                    throw error;
                })
        );
    }

    await Promise.allSettled(jobs);




}
