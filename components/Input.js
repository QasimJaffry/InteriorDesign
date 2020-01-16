import React, { Component } from "react";
import { StyleSheet, TextInput } from "react-native";
class Input extends Component {

    handleValidation(value) {
        const { pattern } = this.props;
        if (!pattern) return true;
        // string pattern, one validation rule
        if (typeof pattern === 'string') {
        const condition = new RegExp(pattern, 'g');
        return condition.test(value);
        }
        // array patterns, multiple validation rules
        if (typeof pattern === 'object') {
        const conditions = pattern.map(rule => new RegExp(rule, 'g'));
        return conditions.map(condition => condition.test(value));
        }
    }
    onChange(value) {
        const { onChangeText, onValidation } = this.props;
        const isValid = this.handleValidation(value);
        onValidation && onValidation(isValid);
        onChangeText && onChangeText(value);
    }

    render() {
        const {
        pattern,
        onChangeText,
        children,
        style,
        ...props
        } = this.props;
        
    return (
        <TextInput
            style={style}
            onChangeText={value => this.onChange(value)}
            {...props}
        >
            {children}
        </TextInput>
        );
    }
}
export default Input;