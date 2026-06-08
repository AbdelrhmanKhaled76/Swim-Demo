import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ToasterType = "error" | "warning" | "success";

interface Initial {
  show: boolean;
  message: string;
  type: ToasterType;
}

const initialState: Initial = {
  show: false,
  message: "",
  type: "error",
};

const toasterSlice = createSlice({
  name: "toaster",
  initialState,
  reducers: {
    showToaster(
      state,
      action: PayloadAction<{ message: string; type: ToasterType }>,
    ) {
      state.show = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    closeToaster(state) {
      state.show = false;
    },
  },
});

export const { closeToaster, showToaster } = toasterSlice.actions;
export default toasterSlice.reducer;
