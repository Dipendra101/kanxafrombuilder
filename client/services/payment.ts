import { apiRequest } from './api';

export const paymentAPI = {
  initiateKhalti: async (bookingDetails: {
    bookingId: string;
    amount: number;
    productName: string;
  }) => {
    return apiRequest('/payment/khalti/initiate', {
      method: 'POST',
      body: JSON.stringify(bookingDetails),
    });
  },

  initiateEsewa: async (bookingDetails: {
    bookingId: string;
    amount: number;
  }) => {
    return apiRequest('/payment/esewa/initiate', {
      method: 'POST',
      body: JSON.stringify(bookingDetails),
    });
  },
};