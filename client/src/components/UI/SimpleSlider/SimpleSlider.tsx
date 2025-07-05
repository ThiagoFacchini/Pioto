import React, { useState, useEffect } from 'react'

// @ts-ignore
import styles from './styles.module.css'
// @ts-ignore
import uiStyles from './../styles.module.css'

type SimpleSliderType = {
    min: number,
    max: number,
    value: number,
    isDisabled: boolean,
    onChange: ( value: number ) => void
}

export default function SimpleSlider( props: SimpleSliderType ) {
    const [ internalValue, setInternalValue ] = useState( props.value )

    useEffect( () => {
        setInternalValue( props.value )
    }, [ props.value ])
    

    const commitChange = () => {
        props.onChange( internalValue )
    }


    return (
        <input
            type="range"
            min={ props.min }
            max={ props.max }
            value={ internalValue }
            onChange={ ( e ) => setInternalValue( Number( e.target.value ) ) } 
            onMouseUp={ commitChange }
            onTouchEnd={ commitChange }
            className={ styles.slider }
            disabled={ props.isDisabled }
        />
    )
}