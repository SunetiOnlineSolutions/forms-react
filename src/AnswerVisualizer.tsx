import React from "react";
import Answer from "./classes/Answer";
import { Option, Options } from "./components/FillOut/Questiontypes/MultipleChoice";

interface Visualizer {
  visualize(): React.ReactNode;
}

abstract class AnswerVisualizer implements Visualizer {
  constructor(protected answer: Answer) { }

  abstract visualize(): React.ReactNode;
}

class SimpleVisualizer extends AnswerVisualizer {
  visualize(): React.ReactNode {
    return this.answer.value ?? '-';
  }
}

class FallbackVisualizer extends AnswerVisualizer {
  visualize(): React.ReactNode {
    if (this.answer.value == null) {
      return '-';
    }

    return <pre className="mb-0">{JSON.stringify(this.answer.value)}</pre>;
  }
}

class SignatureVisualizer extends AnswerVisualizer {
  visualize(): React.ReactNode {
    if (this.answer.value == null) {
      return '-';
    }

    return <img src={this.answer.value} alt="signature" />;
  }
}

class MultipleChoiceVisualizer extends AnswerVisualizer {
  visualize(): React.ReactNode {
    if (this.answer.value == null) {
      return '-';
    }

    const isMulti = Array.isArray(this.answer.value);

    if (isMulti) {
      return this.answer.getTypedValue<Options>().map(opt => opt.label).join(', ');
    } else {
      return this.answer.getTypedValue<Option>().label;
    }
  }
}

class ListVisualizer extends AnswerVisualizer {
  visualize(): React.ReactNode {
    if (this.answer.value == null) {
      return '-';
    }

    return (
      <ul className="mb-0 pl-3">
        {this.answer.value.map((value: string, index: number) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    );
  }
}

class AnswerVisualizerFactory {
  static create(answer: Answer): Visualizer {
    switch (answer.question.answerType) {
      case "FREE_TEXT":
      case "DATE":
      case "NUMERIC":
        return new SimpleVisualizer(answer);

      case "SIGNATURE":
        return new SignatureVisualizer(answer);

      case "MULTIPLE_CHOICE":
        return new MultipleChoiceVisualizer(answer);

      case "LIST":
        return new ListVisualizer(answer);

      default:
        return new FallbackVisualizer(answer);
    }
  }
}

export default AnswerVisualizerFactory;
