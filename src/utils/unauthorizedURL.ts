// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unauthorizedAPI = async (err: any) => {
    const errorMessage = (err as Error).message;
    const matchedCode = errorMessage.match(/\b\d{3}\b/);

    const errorCode = matchedCode ? parseInt(matchedCode[0]) : null;
    if (errorCode === 401) {
      window.location.href = '/login';
    }
};
