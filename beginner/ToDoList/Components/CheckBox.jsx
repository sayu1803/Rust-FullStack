import React from "react";

const CheckBox = ({ checked, onChange }) => {
  return (
    <label className="checkbox-container">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkmark"></span>
      <style jsx>{`
        .checkbox-container {
          display: block;
          position: relative;
          padding-left: 35px;
          margin-bottom: 12px;
          cursor: pointer;
          font-size: 22px;
          user-select: none;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 25px;
          width: 25px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          transition: all 0.3s ease;
          border: 2px solid #800000;
        }

        .checkbox-container:hover input ~ .checkmark {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: #800000;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-container .checkmark:after {
          left: 7px;
          top: 3px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
        }
      `}</style>
    </label>
  );
};

export default CheckBox;

