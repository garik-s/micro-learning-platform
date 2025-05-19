export interface Answer {
  id: number;
  content: string;
  instructorId: number;
  question?: Question | null;
}

export interface Question {
  id: number;
  content: string;
  lessonId: number;
  studentId: number;
  answerId?: number | null;
  createdAt: Date;
  archived: boolean;
  answer?: Answer | null;
}
