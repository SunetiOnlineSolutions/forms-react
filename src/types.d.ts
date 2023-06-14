export type AnswerType = "FREE_TEXT" | "MULTIPLE_CHOICE" | "NUMERIC" | "DATE" | "LIST" | "SIGNATURE" | "INSTRUCTION";

export type FormVersionStatus = "DRAFT" | "PUBLISHED";

export type ObjectWithID = {
  id: string | number;
};

export type JSONSerializable = {
  [key: string]: string | string[] | number | number[] | boolean | boolean[] | Date | Date[] | undefined | undefined[]
};

export type Identifier = number | string;

export type Nullable<T> = T | null | undefined;

declare global {
  var toastr: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
  };

  var $: any;
}
