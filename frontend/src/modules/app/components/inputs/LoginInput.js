import React from "react";
import "../../styles/inputs/loginInput.css"

//use effect es 
const LoginInput = ({ name, placeholder, type, value, fn }) => {
    if (fn === undefined) {
        return (
            <>
                <div className="form__group field">
                    <input
                        name={name}
                        type={type} className="form__field"
                        placeholder={placeholder}
                        value={value}
                        required="" />
                    <label htmlFor="name" className="form__label">{placeholder}</label>
                </div>
            </>
        );

    } else
        return (
            <>
                <div className="form__group field">
                    <input
                        name={name}
                        type={type} className="form__field"
                        placeholder={placeholder}
                        value={value}
                        onChange={e => fn(e.target.value)}
                        required="" />
                    <label htmlFor="name" className="form__label">{placeholder}</label>
                </div>
            </>
        );
};

export default LoginInput;
