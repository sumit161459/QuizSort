import React, { useState, useEffect } from 'react';
import './QuizGame.css';
import { Result } from 'antd';

const QuizGame = () => {
    const [bucket, setBucket] = useState([]);
    const [initialOptions, setInitialOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [sortedOptions, setSortedOptions] = useState([]);
    const [isCheckEnabled, setIsCheckEnabled] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const getRandomValues = () => {
        const array = [];

        for (let i = 0; i < 5; i++) {
            const randomNumber = Math.floor(Math.random() * 100 + 1);
            array[i] = { [i]: randomNumber };
        }
        return array;

    }

    const objectToArray = (obj) => {
        const array = [];
        for (const el of obj) {
            array.push(el[Object.keys(el)[0]]);;
        }
        return array;
    }

    const generateRandomValues = () => {
        setIsCheckEnabled(false);
        setIsCorrect(false);
        setShowResult(false);
        const randomValues = getRandomValues();
        setOptions(randomValues);
        setInitialOptions(randomValues);
        const randomArray = objectToArray(randomValues);
        setSortedOptions([...randomArray].sort((a, b) => a - b));
        setBucket(new Array(5));
    };

    useEffect(() => {
        generateRandomValues();
    }, []);



    const handleDragStart = (e, option) => {
        const data = JSON.stringify(option);
        e.dataTransfer.setData('application/json', data);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, index) => {
        const jsonData = e.dataTransfer.getData('application/json');
        const droppedOption = JSON.parse(jsonData);
        console.log(droppedOption)
        const newOptions = options.filter((option) => {
            console.log(option, droppedOption);
            return (Object.keys(option)[0] !== Object.keys(droppedOption)[0]);

        });
        console.log(newOptions)

        if (bucket[index]) {
            newOptions.push(bucket[index]);
        }

        const newBucket = [...bucket];
        newBucket[index] = droppedOption;

        setOptions(newOptions);
        setBucket(newBucket);
        setIsCheckEnabled(newOptions.length === 0);
    };

    const handleCheck = () => {
        setShowResult(true);
        const bucketArray = objectToArray(bucket);
        const isSortedCorrectly = JSON.stringify(sortedOptions) === JSON.stringify(bucketArray);
        setIsCorrect(isSortedCorrectly);
    };

    const handleReset = () => {
        generateRandomValues();
    };

    return (
        <div className="app">
            <h1>Arrange the values in ascending order</h1>
            {!showResult && <>


                <div className="buckets-container">
                    {initialOptions.map((_, index) => (
                        <div
                            key={index}
                            className="bucket"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            {sortedOptions[index] && <div className="dropped-option">{bucket[index] ? bucket[index][(Object.keys(bucket[index]))[0]] : null}</div>}
                        </div>
                    ))}
                </div>
                <div className="options-container">
                    {options.map((option, index) => {
                        console.log(option)
                        let propValue;
                        for (var propName in option) {
                            if (option.hasOwnProperty(propName)) {
                                propValue = option[propName];
                            }
                        }
                        return (
                            <div
                                key={index}
                                className="option"
                                draggable
                                onDragStart={(e) => handleDragStart(e, option)}
                            >
                                {propValue}

                            </div>
                        )
                    })}
                </div>
                <div>
                    <button className="check-button" onClick={handleCheck} disabled={!isCheckEnabled}>
                        Check Answer
                    </button>
                </div>
            </>
            }
            {showResult &&
                <div>

                    {isCorrect && <Result status="success" title="Successfully sorted"></Result>}
                    {!isCorrect && <Result status="error" title="Wrong Answer"></Result>}
                    <button className="reset-button" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            }
        </div>
    );
};

export default QuizGame;
