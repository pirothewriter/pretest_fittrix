export interface FittrixError extends Error {
  statusCode: number;
  message: string;
  name: string;
}
