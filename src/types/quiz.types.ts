import { QAState } from "src/components/QA/SingleSelect";

export interface QuizState {  
    isPointOpen?: boolean;  
    isDiscussOpen?: boolean;  
    selectedAnswers?: [];
    qaState: QAState;
} 