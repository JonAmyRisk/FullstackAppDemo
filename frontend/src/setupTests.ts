;(global as any).__BASE_URL__ = 'http://localhost:3000'
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();