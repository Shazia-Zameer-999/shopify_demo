'use client';
import React, { useEffect, useRef } from "react";

/* NOTE: removed `figma:react` import and defineProperties usage so this file is web-safe */

const AnimatedText = ({
  text = "— Hi, i am Shazia Zameer",
  noRepeat = false,
  animate = true,
  circleSize = 166,
  wordSpacing = 0,
  letterSpacing = 1,
  animationSpeed = 10,
  backgroundColor = "#BAB9EF",
  fontWeight = 500
}) => {
  const circlePathRef = useRef(null);
  const textPathRef = useRef(null);
  const svgRef = useRef(null);
  const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  useEffect(() => {
    updateCirclePath();
  }, [circleSize]);

  useEffect(() => {
    updateText();
  }, [text, noRepeat, circleSize, wordSpacing, letterSpacing, fontWeight]);

  // Add the CSS for animations
  useEffect(() => {
    const styles = document.createElement("style");
    styles.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin {
        animation: spin ${animationSpeed}s linear infinite;
        transform-origin: center;
      }
    `;
    document.head.appendChild(styles);
    return () => {
      document.head.removeChild(styles);
    };
  }, [animationSpeed]);

  const updateCirclePath = () => {
    if (!circlePathRef.current) return;

    const center = 200;
    const radius = circleSize;
    circlePathRef.current.setAttribute(
      "d",
      `M${center},${center} m-${radius},0 a${radius},${radius} 0 1,0 ${radius * 2},0 a${radius},${radius} 0 1,0 -${radius * 2},0`,
    );
    updateText();
  };

  const getTextLength = (
    textContent,
    fontSize,
    letterSpacingValue,
  ) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    return (
      context.measureText(textContent).width +
      (textContent.length - 1) * letterSpacingValue
    );
  };

  const spaceOutWords = (
    inputText,
    circleLength,
    fontSize,
    wordSpacingValue,
    letterSpacingValue,
  ) => {
    const words = inputText.split(" ");
    let totalLength =
      getTextLength(inputText, fontSize, letterSpacingValue) +
      (words.length - 1) * wordSpacingValue;

    if (totalLength <= circleLength) {
      return inputText;
    }
    return null;
  };

  const repeatPhrase = (
    inputText,
    circleLength,
    fontSize,
    wordSpacingValue,
    letterSpacingValue,
  ) => {
    let phraseLength =
      getTextLength(inputText, fontSize, letterSpacingValue) +
      (inputText.split(" ").length - 1) * wordSpacingValue;
    let maxRepetitions = Math.floor(
      circleLength / phraseLength,
    );

    if (maxRepetitions >= 1) {
      let totalTextLength = phraseLength * maxRepetitions;
      let remainingSpace = circleLength - totalTextLength;
      let spaceBetweenPhrases = remainingSpace / maxRepetitions;

      let spaceCharWidth = getTextLength(
        " ",
        fontSize,
        letterSpacingValue,
      );
      let spacerLength = Math.round(
        spaceBetweenPhrases / spaceCharWidth,
      );
      let spacer = " ".repeat(spacerLength);

      return (inputText + spacer).repeat(maxRepetitions).trim();
    }
    return null;
  };

  const updateText = () => {
    if (!textPathRef.current || !circlePathRef.current) return;

    const inputText = text.trim();
    const circlePath = circlePathRef.current;

    // Calculate circle length even if getTotalLength is not available
    let circleLength;
    try {
      circleLength = circlePath.getTotalLength();
    } catch (e) {
      // Fallback to calculation
      circleLength = 2 * Math.PI * circleSize;
    }

    if (!circleLength || isNaN(circleLength)) {
      circleLength = 2 * Math.PI * circleSize;
    }

    let fontSize = 40;

    while (fontSize > 8) {
      let finalText = "";
      if (noRepeat) {
        finalText = spaceOutWords(
          inputText,
          circleLength,
          fontSize,
          wordSpacing,
          letterSpacing,
        );
      } else {
        finalText = repeatPhrase(
          inputText,
          circleLength,
          fontSize,
          wordSpacing,
          letterSpacing,
        );
      }

      if (finalText) {
        textPathRef.current.textContent = finalText;
        textPathRef.current.setAttribute("font-size", fontSize);
        textPathRef.current.setAttribute("font-family", fontFamily);
        textPathRef.current.setAttribute("font-weight", fontWeight);
        textPathRef.current.setAttribute(
          "word-spacing",
          `${wordSpacing}px`,
        );
        textPathRef.current.setAttribute(
          "letter-spacing",
          `${letterSpacing}px`,
        );
        return;
      }
      fontSize--;
    }
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center rounded-[32px]"
      style={{ backgroundColor }}
    >
      <div className="flex justify-center items-center p-6">
        <svg
          width={circleSize * 2}
          height={circleSize * 2}
          viewBox="0 0 400 400"
          id="mainSvg"
          ref={svgRef}
        >
          <g id="circleGroup" className={animate ? "spin" : ""}>
            <path
              id="circlePath"
              d="M200,200 m-150,0 a150,150 0 1,0 300,0 a150,150 0 1,0 -300,0"
              fill="none"
              ref={circlePathRef}
            />
            <text id="circleText">
              <textPath
                href="#circlePath"
                startOffset="0%"
                ref={textPathRef}
              ></textPath>
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

if (typeof defineProperties !== "undefined" && typeof defineProperties === "function") {
  defineProperties(AnimatedText, {
    text: { label: "Text", type: "string", defaultValue: "— Hi, welcome to Make" },
    noRepeat: { label: "No repeat", type: "boolean", defaultValue: false },
    animate: { label: "Animate", type: "boolean", defaultValue: true },
    circleSize: { label: "Circle size", type: "number", defaultValue: 166 },
    wordSpacing: { label: "Word spacing", type: "number", defaultValue: 0 },
    letterSpacing: { label: "Letter spacing", type: "number", defaultValue: 1 },
    animationSpeed: { label: "Animation speed", type: "number", defaultValue: 10, control: "slider", min: 0, max: 50, step: 0.2 },
    backgroundColor: { label: "Background color", type: "string", defaultValue: "#BAB9EF" },
    fontWeight: { label: "Font weight", type: "number", defaultValue: 500 }
  });
}

export default AnimatedText;