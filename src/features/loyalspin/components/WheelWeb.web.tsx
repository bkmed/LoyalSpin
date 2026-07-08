import React, { useEffect, useRef, useState } from 'react';
// @ts-expect-error - importing CSS for web build
import './WheelWeb.css';

type Choice = { label: string; probability: number };

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function WheelWeb() {
  const [choiceArray, setChoiceArray] = useState<Choice[]>([
    { label: 'Option 1', probability: 0 },
    { label: 'Option 2', probability: 0 },
  ]);
  const [lastOptionNumber, setLastOptionNumber] = useState(3);
  const [probMode, setProbMode] = useState<'equal' | 'custom'>('equal');
  const [errorText, setErrorText] = useState('');
  const [winner, setWinner] = useState('');

  const startRef = useRef<HTMLButtonElement | null>(null);
  const rotationRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const blinkingRef = useRef<HTMLDivElement | null>(null);

  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // update visuals on change
    // rotation children are rendered from state so no DOM manipulation here
    return () => window.clearTimeout(timeoutRef.current);
  }, [choiceArray]);

  const setEqualProbabilities = () => {
    const n = choiceArray.length;
    const base = Math.round(100 / n);
    const arr = choiceArray.map(c => ({ ...c, probability: base }));
    const sum = arr.reduce((s, a) => s + a.probability, 0);
    if (sum < 100) arr[n - 1].probability += 100 - sum;
    else if (sum > 100) arr[n - 1].probability -= sum - 100;
    setChoiceArray(arr);
  };

  const clearWheelSpin = () => {
    if (rotationRef.current) rotationRef.current.style.transform = '';
    if (startRef.current) startRef.current.classList.remove('start_color');
    if (wrapperRef.current) wrapperRef.current.classList.remove('spin_ann_class');
    if (startRef.current && startRef.current.textContent === 'RESET') startRef.current.textContent = 'START';
    window.clearTimeout(timeoutRef.current);
    if (setWinner) setWinner('');
  };

  const rotateTheWheel = (winningNumber: number) => {
    const n = choiceArray.length;
    const fieldDeg = 360 / n;
    const additionalMargin = getRandomInt(Math.floor((fieldDeg / 10) * 4), Math.floor(fieldDeg / 2) - 2);
    let margin = additionalMargin;
    if (getRandomInt(0, 1) === 0) margin *= -1;
    const rotateToWinner = 360 - winningNumber * fieldDeg + margin;

    if (startRef.current) startRef.current.textContent = 'RESET';
    if (startRef.current) startRef.current.classList.add('start_color');
    if (wrapperRef.current) wrapperRef.current.classList.add('spin_ann_class');
    if (blinkingRef.current) {
      blinkingRef.current.style.borderStyle = 'solid';
      blinkingRef.current.style.animationName = 'none';
    }

    if (rotationRef.current) rotationRef.current.style.transform = `rotate(${rotateToWinner}deg)`;

    timeoutRef.current = window.setTimeout(() => {
      setWinner(choiceArray[winningNumber].label);
      if (blinkingRef.current) {
        blinkingRef.current.style.removeProperty('border-style');
        blinkingRef.current.style.removeProperty('animation-name');
      }
      if (wrapperRef.current) wrapperRef.current.classList.remove('spin_ann_class');
    }, 10000);
  };

  const startWheelSpinProcess = () => {
    if (!startRef.current) return;
    if (startRef.current.textContent === 'START') {
      let winningNumber = 0;
      if (probMode === 'custom') {
        const sum = choiceArray.reduce((s, c) => s + c.probability, 0);
        if (sum === 100) {
          const drawNumber = getRandomInt(1, 100);
          let acc = 0;
          for (let i = 0; i < choiceArray.length; i++) {
            if (acc + choiceArray[i].probability >= drawNumber) {
              winningNumber = i;
              break;
            } else acc += choiceArray[i].probability;
          }
          setErrorText('');
          rotateTheWheel(winningNumber);
        } else {
          setErrorText(`Probabilities sum must be equal to 100, current sum: ${sum}`);
        }
      } else {
        winningNumber = getRandomInt(0, choiceArray.length - 1);
        rotateTheWheel(winningNumber);
      }
    } else {
      clearWheelSpin();
    }
  };

  const addRow = () => {
    if (choiceArray.length >= 20) return;
    setChoiceArray(prev => [...prev, { probability: 0, label: `Option ${lastOptionNumber}` }]);
    setLastOptionNumber(n => n + 1);
    clearWheelSpin();
  };

  const updateLabel = (index: number, label: string) => {
    setChoiceArray(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], label };
      return copy;
    });
    clearWheelSpin();
  };

  const updateProbability = (index: number, prob: number) => {
    setChoiceArray(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], probability: prob };
      return copy;
    });
    clearWheelSpin();
  };

  const removeRow = (index: number) => {
    setChoiceArray(prev => prev.filter((_, i) => i !== index));
    clearWheelSpin();
  };

  useEffect(() => {
    if (probMode === 'equal') setEqualProbabilities();
  }, [probMode]);

  return (
    <div className="container">
      <div className="main_window">
        <div id="rotation_wrapper" ref={wrapperRef}>
          <div id="blinking_border" ref={blinkingRef} className="border_blink_class">
            <div id="rotation" ref={rotationRef}>
              {choiceArray.map((c, i) => (
                <div
                  key={`wheel_text_${i}`}
                  className="wheel_text"
                  style={{ transform: `rotate(${(360 / choiceArray.length) * i}deg)` }}
                >
                  <div className="wheel_text_visible">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div id="arrow"></div>
        </div>

        <div className="controls">
          <div className="controls_wrapper">
            <select value={probMode} onChange={e => setProbMode(e.target.value as any)}>
              <option value="equal">Equal</option>
              <option value="custom">Custom</option>
            </select>

            <table id="select_table">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Probability</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {choiceArray.map((c, i) => (
                  <tr key={`row_${i}`}>
                    <td>
                      <input
                        type="text"
                        maxLength={27}
                        value={c.label}
                        onChange={e => updateLabel(i, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={c.probability}
                        className="custom_probability_input"
                        onChange={e => updateProbability(i, Math.max(0, Math.min(100, Math.floor(Number(e.target.value) || 0))))}
                        style={{ display: probMode === 'custom' ? 'initial' : 'none' }}
                      />
                    </td>
                    <td>
                      <button className="delete_button" onClick={() => removeRow(i)}>-</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div id="error" style={{ visibility: errorText ? 'visible' : 'hidden' }}>{errorText}</div>
            <div id="winner">{winner}</div>

            <div style={{ marginTop: 12 }}>
              <button id="add_row" onClick={addRow}>Add</button>
              <button id="start" ref={startRef} className="start" onClick={startWheelSpinProcess}>START</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
