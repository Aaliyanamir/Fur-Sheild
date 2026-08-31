import api from './api';

const chatService = {
  sendMessage: async (message, history = []) => {
    const res = await api.post('/chat', { message, history });
    return res.data;
  },
};

export default chatService;
