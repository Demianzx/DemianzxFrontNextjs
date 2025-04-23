import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface ModalState {
  modalType: string | null;
  modalProps: any;
}

interface UiState {
  notifications: NotificationState[];
  modal: ModalState;
  isLoading: boolean;
  isDarkMode: boolean;
  showSidebar: boolean;
}

const initialState: UiState = {
  notifications: [],
  modal: {
    modalType: null,
    modalProps: {}
  },
  isLoading: false,
  isDarkMode: true, // Default para nuestro blog de videojuegos
  showSidebar: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Gestión de notificaciones
    addNotification: (state, action: PayloadAction<Omit<NotificationState, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Gestión de modales
    showModal: (state, action: PayloadAction<ModalState>) => {
      state.modal = action.payload;
    },
    hideModal: (state) => {
      state.modal = {
        modalType: null,
        modalProps: {}
      };
    },

    // Estado de carga global
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Cambiar tema
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },

    // Toggle sidebar (para móviles)
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    }
  }
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  showModal,
  hideModal,
  setLoading,
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebar
} = uiSlice.actions;

export default uiSlice.reducer;