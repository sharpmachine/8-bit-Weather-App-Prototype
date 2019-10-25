import * as React from "react"
import { Frame, addPropertyControls, ControlType, Stack } from "framer"

// Open Preview: Command + P
// Learn more: https://framer.com/api

export function SearchField(props) {
    const [isSearching, setIsSearching] = React.useState(false)
    const { ...rest } = props

    console.log(props)

    function onTap() {
        setIsSearching(true)
        // hide back back
        // set isSearch to false once results come back
        // navigate back to data once results come back
    }

    return (
        <Stack {...rest} width="100%" gap={0} name="Fieldset">
            {!isSearching && (
                <Frame
                    width="100%"
                    background="transparent"
                    name="Search Field"
                >
                    <input style={fieldStyle} placeholder="Search for a city" />
                    <button style={buttonStyle} onClick={onTap}>
                        Start
                    </button>
                </Frame>
            )}
            {isSearching && (
                <Frame style={loadingMsgStyle} name="Button">
                    Loading…
                    <div style={{ fontSize: 16, paddingTop: 3 }}>
                        Do not turn off the power.
                    </div>
                </Frame>
            )}
        </Stack>
    )
}

SearchField.defaultProps = {
    height: 100,
    width: "100%",
}

const sharedStyles: React.CSSProperties = {
    fontFamily: "VTF MisterPixel",
    textAlign: "center",
    background: "transparent",
}

const fieldStyle: React.CSSProperties = {
    ...sharedStyles,
    width: "100%",
    height: 50,
    padding: 15,
    border: "3px solid black",
    fontSize: 16,
    outline: "none",
}

const buttonStyle: React.CSSProperties = {
    ...sharedStyles,
    width: "100%",
    height: 50,
    padding: 15,
    border: "none",
    fontSize: 24,
    color: "black",
}

const loadingMsgStyle: React.CSSProperties = {
    ...sharedStyles,
    width: "100%",
    height: 50,
    fontSize: 24,
    color: "black",
}

// addPropertyControls(SearchField, {
// })
