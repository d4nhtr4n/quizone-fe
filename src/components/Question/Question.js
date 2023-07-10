import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './Question.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faDiamond, faShield, faSquare } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);

const answearColors = ['#E21B3C', '#D89E00', '#26890C', '#1368CE'];

const answearIcons = [
  <FontAwesomeIcon className={cx('icon')} icon={faSquare} />,
  <FontAwesomeIcon className={cx('icon')} icon={faCircle} />,
  <FontAwesomeIcon className={cx('icon')} icon={faDiamond} />,
  <FontAwesomeIcon className={cx('icon')} icon={faShield} />,
];

const answerTemplate = ['A', 'B', 'C', 'D'];

const Question = ({ data, correct, type, index, changeData, changeAnswer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data);
  // const [selected, setSelected] = useState(false);

  const inputRef = useRef();

  const handleInputChange = (e) => {
    setText(e.target.value.replace(/\n/g, ''));
  };

  const handleInputBlur = (e) => {
    if (e.target.value.length > 0) {
      setIsEditing(false);
      const data = {
        option: e.target.value,
        index,
      };
      changeData(data);
    } else {
      inputRef.current.focus();
    }
  };

  const handleChangeSelected = () => {
    // setSelected(!selected);
    const data = {
      correct: !correct,
      index,
    };
    changeAnswer(data);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
      const { value } = inputRef.current;
      inputRef.current.setSelectionRange(value.length, value.length);
    }
  }, [isEditing]);

  useEffect(() => {
    setText(data);
  }, [data]);

  return (
    <div className={cx('wrapper')}>
      <div
        style={{ color: answearColors[index] }}
        className={cx('content')}
        // onClick={() => onClick(index)}
      >
        {answearIcons[index]}
        {isEditing ? (
          <textarea
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleInputChange}
            onBlur={(e) => handleInputBlur(e)}
          />
        ) : (
          <span
            className={cx('text')}
            onClick={() => {
              if (type == 'quiz') setIsEditing(true);
            }}
          >
            {text}
          </span>
        )}
        <span
          className={cx('checkbox', {
            // selected: selected,
            selected: correct,
          })}
          onClick={handleChangeSelected}
        ></span>
      </div>
    </div>
  );
};

export default Question;
