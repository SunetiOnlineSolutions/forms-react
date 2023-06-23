import React from "react";
import Answer from "./classes/Answer";
import Question from "./classes/Question";

interface Visualizer {
  visualize(): React.ReactNode;
}

abstract class ResultVisualizer implements Visualizer {
  constructor(protected question: Question, protected answers: Answer[]) { }

  abstract visualize(): React.ReactNode;
}

class FreeTextVisualizer extends ResultVisualizer {
  visualize(): React.ReactNode {
    return <div>{this.answers.map(answer => answer.value)}</div>;
  }
}

class FallbackVisualizer extends ResultVisualizer {
  visualize(): React.ReactNode {
    return <div>No visualization available</div>;
  }
}

class ResultVisualizerFactory {
  static create(question: Question, answers: Answer[]): Visualizer {

    switch (question.answerType) {
      case "FREE_TEXT":
        return new FreeTextVisualizer(question, answers);

      default:
        return new FallbackVisualizer(question, answers);

    }
  }
}

export default ResultVisualizerFactory;
