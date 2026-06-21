import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type GeneralState = {
   categories: Category[];
}

type Category = {
    _id: string;
    name: string;
}

const initialState: GeneralState = {
    categories: [],
}

const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        setCategories(state, action: PayloadAction<Category[]>) {
            state.categories = action.payload;
        },
    },
})

export const { setCategories } = generalSlice.actions;
export default generalSlice.reducer;