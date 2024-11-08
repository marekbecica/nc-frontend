function isTokenValid(token: string | null) {
    if (!token) return false;
    // Decode the token and check its expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000; // Current time in seconds
    return payload.exp > currentTime; // Check if the token is still valid
  }

export { isTokenValid }