import { apiClient } from './apiClient.js';

export const sendFeedback = async ({ type, fields }) => {
  return await apiClient.post('/api/feedback', {
    type,
    fields,
  });
};
