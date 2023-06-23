import Question from "./classes/Question";
import { Option, Options } from "./components/FillOut/Questiontypes/MultipleChoice";
import { AnswerType, Nullable } from "./types";

interface ValidatorContract {
  isValid(value: unknown): true | string;
}

abstract class Validator implements ValidatorContract {
  constructor(protected question: Question) { }

  abstract isValid(value: unknown): true | string;

  protected isRequired(): boolean {
    return this.question?.options.validation?.required ?? false;
  }
}

class FreeTextValidator extends Validator {
  isValid(value: string): true | string {
    if (this.isRequired() && (!value || value.trim().length === 0)) {
      return "This field is required!";
    }

    return true;
  }
}

class NumericValidator extends Validator {
  isValid(value: any): true | string {
    if (this.isRequired() && isNaN(value)) {
      return "This field is required!";
    }

    if (this.question.options.validation?.min && value < this.question.options.validation.min) {
      return `The number must be larger or equal to ${this.question.options.validation.min}!`;
    }

    if (this.question.options.validation?.max && value > this.question.options.validation.max) {
      return `The number must be smaller or equal to ${this.question.options.validation.max}!`;
    }

    return true;
  }
}

class MultipleChoiceValidator extends Validator {
  isValid(value: Nullable<Option | Options>): true | string {
    if (this.isRequired() && this.isEmpty(value)) {
      return "This field is required!";
    }

    return true;
  }

  protected isEmpty(value: Nullable<Option | Options>) {
    if (!value) {
      return true;
    }

    if (this.isOption(value)) {
      return false;
    }

    return value.length === 0;
  }

  protected isOption(value: Nullable<Option | Options>): value is Option {
    return value != undefined
      && typeof value === "object"
      && !Array.isArray(value)
      && value.hasOwnProperty("value")
      && value.hasOwnProperty("label");
  }

  protected isOptions(value: Nullable<Option | Options>): value is Options {
    return Array.isArray(value)
      && value.every(this.isOption)
  }
}

class DateValidator extends Validator {
  isValid(value: any): true | string {
    if (this.isRequired() && !value) {
      return "This field is required!";
    }

    return true;
  }
}

class ListValidator extends Validator {
  isValid(value: string[]): true | string {
    if (this.isRequired() && (!value || value.length === 0)) {
      return "This field is required!";
    }

    return true;
  }
}

class SignatureValidator extends Validator {
  isValid(value: any): true | string {
    if (this.isRequired() && (!value || value.trim().length === 0)) {
      return "This field is required!";
    }

    return true;
  }
}

class AlwaysValidValidator extends Validator {
  isValid(_value: any): true | string {
    return true;
  }
}

class ValidatorFactory {
  static create(question: Question): Validator {
    switch (question.answerType) {
      case "FREE_TEXT": return new FreeTextValidator(question);
      case "NUMERIC": return new NumericValidator(question);
      case "MULTIPLE_CHOICE": return new MultipleChoiceValidator(question);
      case "DATE": return new DateValidator(question);
      case "LIST": return new ListValidator(question);
      case "SIGNATURE": return new SignatureValidator(question);
      case "INSTRUCTION": return new AlwaysValidValidator(question);

      default:
        throw new Error(`Unknown answer type: ${question.answerType}`);
    }
  }
}

export default ValidatorFactory;


export type ValidationOption = {
  name: string;
  icon: string;
  label: string;
  appliesTo: AnswerType[];
}


// TODO:
// Before (date)
// After (date)
// Between (date)
// Allow decimal values (numeric)
// Allow negative values (numeric)


// TODO:
// Use a single (functional or class based) solution for icons, validation function, name, icon, label and appliesTo

const allValidationRules: ValidationOption[] = [
  { name: 'required'   , icon: 'fal fa-asterisk'          , label: 'Answer required'             , appliesTo: ['FREE_TEXT', 'DATE', 'MULTIPLE_CHOICE', 'NUMERIC', 'SIGNATURE'] },
  { name: 'lessThan'   , icon: 'fal fa-less-than-equal'   , label: 'Less than'                   , appliesTo: ['NUMERIC'                                                     ] },
  { name: 'GreaterThan', icon: 'fal fa-greater-than-equal', label: 'Greater than'                , appliesTo: ['NUMERIC'                                                     ] },
  { name: 'between'    , icon: 'fal fa-value-absolute'    , label: 'Between'                     , appliesTo: ['NUMERIC'                                                     ] },
  { name: 'email'      , icon: 'fal fa-at'                , label: 'Must be an email address'    , appliesTo: ['FREE_TEXT'                                                   ] },
  { name: 'minLength'  , icon: 'fal fa-ruler'             , label: 'Minimum number of characters', appliesTo: ['FREE_TEXT'                                                   ] },
  { name: 'maxLength'  , icon: 'fal fa-ruler'             , label: 'Maximum number of characters', appliesTo: ['FREE_TEXT'                                                   ] },
];



export function availableValidators(answerType: AnswerType): ValidationOption[] {
  return allValidationRules.filter(rule => rule.appliesTo.includes(answerType));
}
