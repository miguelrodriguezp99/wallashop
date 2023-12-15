import { create } from "zustand";
import { getNotifications, deleteNotification } from "../../../backend/userService";

export const useNotificationsStore = create((set, get) => ({
  notificationsByUser: [],

  fetchNotifications: async (userId) => {
    try {
      getNotifications(
        userId,
        (data) => {
          const notificationsWithId = data.map((notification) => ({
            ...notification,
            id: notification.id
          }));
          set({ notificationsByUser: notificationsWithId });
        },
        (errors) => {
          console.log(errors);
        },
      );
    } catch (error) {
      console.error(error);
    }
  },
  
  deleteNotification: async (userId, notificationId) => {
    try {
      deleteNotification(
        userId,
        notificationId,
        () => {
          console.log('Notificación eliminada con éxito');
          set((state) => ({
            notificationsByUser: state.notificationsByUser.filter(
              (notification) => notification.id !== notificationId
            ),
          }));
        },
        (errors) => {
          console.error('Error al eliminar la notificación:', errors);
        }
      );
    } catch (error) {
      console.error(error);
    }
  },

}));
