export type oid = "A"|"B"|"C"|"D"|"E"

interface analysis {
    point: string | null,
    discuss: string | null,
    link: string[]
}

export interface A1 {
    _id: string;
    type: "A1";
    class: string;
    unit: string;
    tags: string[];
    question: string;
    options: {oid: oid, text: string}[];
    answer: oid;
    analysis: analysis;
    source: string;
}

export interface A2 {
    _id: string;
    type: "A2";
    class: string;
    unit: string;
    tags: string[];
    question: string;
    options: {oid: oid, text: string}[];
    answer: oid;
    analysis: analysis;
    source: string;
}
export interface A3 {
    _id: string;
    type: "A3";
    class: string;
    unit: string;
    tags: string[];
    mainQuestion: string;
    subQuizs: {
        subQuizId: number;
        question: string;
        options: {oid: oid, text: string}[];
        answer: oid
    }[]
    analysis: analysis;
    source: string;
}

export interface X {
    _id: string;
    type: "X";
    class: string;
    unit: string;
    tags: string[];
    question: string;
    options: {oid: oid, text: string}[];
    answer: oid[];
    analysis: analysis;
    source: string;
}

export interface B {
    _id: string;
    type: "B";
    class: string;
    unit: string;
    tags: string[];
    questions: {
        questionId: number;
        questionText: string;
        answer: oid
    }[];
    options: {oid: oid, text: string}[];
    analysis: analysis;
    source: string;
}

export type quizType = A1|A2|A3|B|X
export type quizTypeID = 'A1' | 'A2' | 'A3' | 'B' | 'X';  