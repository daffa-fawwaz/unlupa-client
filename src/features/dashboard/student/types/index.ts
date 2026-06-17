// TEACHER REQUEST PAYLOAD

export interface TeacherRequestPayload {
  message: string;
}

export interface TeacherRequestResponse {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}