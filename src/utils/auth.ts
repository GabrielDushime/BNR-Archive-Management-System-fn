
export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('token');
};


export const getRoleFromToken = (token: string): string => {
  try {
    console.log('Token:', token);
    const payload = token.split('.')[1];
    console.log('Payload:', payload);
    
    if (!payload) {
      throw new Error('Invalid token structure');
    }

    
    const decodedPayload = atob(payload.replace(/_/g, '/').replace(/-/g, '+'));
    console.log('Decoded Payload:', decodedPayload);
    
    const parsedPayload = JSON.parse(decodedPayload);
    return parsedPayload.role || '';
  } catch (error) {
    console.error('Error decoding token:', error);
    return '';
  }
};
