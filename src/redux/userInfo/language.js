import { createSlice } from '@reduxjs/toolkit';

// Initial state for the slice
const initialState = {
  language: 'en'
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setEnglish(state) {
      state.language = 'en';
    },
    setTamil(state) {
      state.language = 'tn';
    },
    // Optionally, a generic setter:
    setLanguage(state, action) {
      state.language = action.payload;
    }
  }
});

// Export actions
export const { setEnglish, setTamil, setLanguage } = languageSlice.actions;

// Export reducer
export default languageSlice.reducer;
