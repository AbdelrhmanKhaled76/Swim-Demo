import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  token: storedToken ? storedToken : null,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials,
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      return rejectWithValue(errorMessage);
    }
  },
);

export const registerUser=createAsyncThunk(
  "auth/register",
  async(userData:any,{rejectWithValue})=>{
    try{
      const response=await axios.post("http://localhost:3000/api/auth/register",userData);
      return response.data;
    }
    catch(error:any){
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      }).addCase(registerUser.pending,(state)=>{
        state.isLoading=true;
        state.error=null;
      }).addCase(registerUser.fulfilled,(state,action:PayloadAction<{user:User;token:string}>)=>{
        state.isLoading=false;
        state.user=action.payload.user;
        state.token=action.payload.token;
        localStorage.setItem("token",action.payload.token);
      }).addCase(registerUser.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload as string;});
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
