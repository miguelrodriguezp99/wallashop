import { useNotificationsStore } from '../../../modules/app/store/notifications'; // Adjust the import path as needed
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

jest.mock('../../../backend/userService', () => ({
  getNotifications: jest.fn().mockResolvedValue([
    { id: 1, message: 'Notification 1' },
    { id: 2, message: 'Notification 2' },
  ]),
  deleteNotification: jest.fn().mockResolvedValue({}),
}));

const { getNotifications, deleteNotification } = require('../../../backend/userService');

describe('useNotificationsStore', () => {
    it('matches snapshot', () => {

        const ComponentWrapper = () => {
            const hookResult = useNotificationsStore();
            return null; 
        };

        const { result } = renderHook(() => ComponentWrapper());
        expect(result).toMatchSnapshot();
    });

    it('fetches notifications correctly', async () => {
        const { result } = renderHook(() => useNotificationsStore());

        expect(getNotifications).toHaveBeenCalledTimes(0);

        await act(async () => {
            await result.current.fetchNotifications('userId123');
        });

        expect(result.current.notificationsByUser).toMatchSnapshot();
        expect(getNotifications).toHaveBeenCalledWith('userId123', expect.any(Function), expect.any(Function));
    });

    it('deletes notification correctly', async () => {
        const ComponentWrapper = () => {
            const { result } = useNotificationsStore();
            return null;
        };

        await act(async () => {
          renderHook(() => ComponentWrapper());
        });
      });

  
});