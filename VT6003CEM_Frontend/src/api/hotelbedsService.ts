import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.test.hotelbeds.com/hotel-api/1.0',
  headers: {
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(async (config) => {
  const { signature, timestamp } = await generateSignature();
  config.headers['Api-key'] = '9ee1b1cb51ef9c9d126b0d6e7293a44e';
  config.headers['X-Signature'] = signature;
  config.params = { ...config.params, ts: timestamp };
  return config;
});

const API_KEY = '9ee1b1cb51ef9c9d126b0d6e7293a44e';
const SECRET = 'c586e23ce3';

const generateSignature = async (): Promise<{signature: string, timestamp: string}> => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = `${API_KEY}${SECRET}${timestamp}`;
  
  const msgBuffer = new TextEncoder().encode(signatureString);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
    
  return {
    signature: hashHex,
    timestamp: timestamp.toString()
  };
};

export const hotelbedsService = {
  async checkStatus() {
    try {
      const response = await apiClient.get('/status');
      return response.data;
    } catch (error: any) {
      console.error('Error checking Hotelbeds API status:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      throw error;
    }
  },
};

export default hotelbedsService;
