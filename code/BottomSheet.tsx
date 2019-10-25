import * as React from "react"
import {
    Frame,
    Scroll,
    Color,
    transform,
    addPropertyControls,
    ControlType,
    RenderTarget,
    Override,
    Data,
} from "framer"

const toleranceVelocity = 420

function BottomSheetWithoutChildren() {
    return (
        <Frame
            center
            size="100%"
            background={Color({ r: 136, g: 85, b: 255, a: 0.25 })}
        >
            <Frame
                center
                background={null}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h3
                    style={{
                        display: "block",
                        textAlign: "center",
                        color: "rgb(136,85,255)",
                        margin: 0,
                        padding: 0,
                        verticalAlign: "middle",
                    }}
                >
                    Connect to frame to <br />
                    render the content
                </h3>
            </Frame>
        </Frame>
    )
}

export function BottomSheet(props) {
    const { lockOnScroll } = props
    const useMiddleState = props.middleState
    const initPosName = useMiddleState ? props.initPosFull : props.initPos
    const initY = useMiddleState
        ? props[props.initPosFull]
        : props[props.initPos]
    const initDimOpacity = initPosName === "top" ? 1 : 0
    const marginBottom = props.bottom - props.top
    const marginMiddle = props.middle - props.top
    const dimInput = [0, useMiddleState ? marginMiddle : marginBottom]
    const dimOutput = [1, 0]

    const [pos, setPos] = React.useState(initY - props.top)
    const [posName, setPosName] = React.useState(initPosName)
    const [dimOpacity, setDimOpacity] = React.useState(initDimOpacity)
    const [numberUpdate, setNumberUpdate] = React.useState(0)

    React.useEffect(() => {
        let newStateName
        switch (pos) {
            case marginBottom:
                newStateName = "bottom"
                break
            case marginMiddle:
                newStateName = "middle"
                break
            case 0:
                newStateName = "top"
                break
            default:
                newStateName = "undefined"
        }
        if (posName !== newStateName) setPosName(newStateName)
    }, [pos])

    React.useEffect(() => {
        if (posName !== props.setSheetPositon && posName !== "undefined") {
            setPosName(props.setSheetPositon)
            switch (props.setSheetPositon) {
                case "bottom":
                    setPos(marginBottom)
                    break
                case "middle":
                    if (props.middleState) {
                        setPos(marginMiddle)
                    } else {
                        console.error(
                            "Middle state is not activate. Set is to ON on the component props."
                        )
                    }
                    break
                case "top":
                    setPos(0)
                    break
                default:
            }
        }
    }, [props.numSheetUpdate])

    function getNextPosState(info) {
        let newPos = 0
        const point = info.point.y
        const velocity = info.velocity.y
        const offset = info.offset.y
        const direction = velocity >= 0 || offset > 0 ? "down" : "up"

        if (useMiddleState) {
            if (0 < point && point < marginMiddle && direction === "down")
                newPos = marginMiddle
            else if (0 < point && point < marginMiddle && direction === "up")
                newPos = 0

            if (point > marginMiddle && direction === "down")
                newPos = marginBottom
            else if (point > marginMiddle && direction === "up")
                newPos = marginMiddle
            if (point === marginMiddle) newPos = marginMiddle
        } else {
            if (0 < point && point < marginBottom && direction === "down")
                newPos = marginBottom
            else if (0 < point && point < marginBottom && direction === "up")
                newPos = 0
        }

        if (point >= marginBottom && direction === "down") newPos = marginBottom

        return newPos
    }

    function onDragEnd(ev, info) {
        setPos(info.point.y) // Fix for slow dragEnds events where the sheet could freeze in the middle
        setPos(getNextPosState(info))
    }

    function onTapDim() {
        if (posName === "top" || pos === 0) {
            setPos(marginBottom)
        }
    }

    function onUpdate(latest) {
        const opacity = transform(latest.y, dimInput, dimOutput)
        setDimOpacity(opacity)
    }

    function onComplete() {}

    if (RenderTarget.current() === RenderTarget.canvas) {
        return (
            <Frame
                size="100%"
                background={initY === props.top ? props.dim : null}
                overflow="hidden"
            >
                {props.children.length > 0 ? (
                    <Frame size="100%" y={initY} background={null}>
                        {props.children}
                    </Frame>
                ) : (
                    <BottomSheetWithoutChildren />
                )}
            </Frame>
        )
    } else {
        return (
            <Frame size="100%" background={null} overflow="hidden">
                <Frame
                    size="100%"
                    onTap={onTapDim}
                    background={props.dim}
                    opacity={dimOpacity}
                    style={{
                        pointerEvents: dimOpacity === 1 ? "auto" : "none",
                    }}
                />
                <Frame
                    drag={!lockOnScroll ? "y" : false}
                    size="100%"
                    dragElastic={0.2}
                    background={null}
                    dragConstraints={{
                        top: 0,
                        bottom: props.bottom,
                    }}
                    top={props.top}
                    initial={{ y: pos }}
                    animate={{ y: pos }}
                    transition={{ duration: 0.3 }}
                    onDragEnd={onDragEnd}
                    onUpdate={onUpdate}
                    onAnimationComplete={onComplete}
                >
                    {props.scrollContent === true ? (
                        <Scroll
                            style={props.children[0].props.style}
                            background={null}
                            direction="vertical"
                            dragEnabled={false}
                            width={props.width}
                            height={props.height - props.top}
                        >
                            {props.children}
                        </Scroll>
                    ) : (
                        props.children
                    )}
                </Frame>
            </Frame>
        )
    }
}

BottomSheet.defaultProps = {
    lockOnScroll: false,
}

addPropertyControls(BottomSheet, {
    numSheetUpdate: {
        type: ControlType.Number,
        defaultValue: 0,
        hidden() {
            return true
        },
    },
    setSheetPositon: {
        type: ControlType.String,
        defaultValue: "",
        hidden() {
            return true
        },
    },
    children: {
        type: ControlType.ComponentInstance,
        title: "Content",
    },
    initPos: {
        type: ControlType.Enum,
        title: "Init Positon",
        defaultValue: "top",
        options: ["top", "bottom"],
        optionTitles: ["Top", "Bottom"],
        hidden(props) {
            return props.middleState === true
        },
    },
    initPosFull: {
        type: ControlType.Enum,
        title: "Init Positon",
        defaultValue: "top",
        options: ["top", "middle", "bottom"],
        optionTitles: ["Top", "Middle", "Bottom"],
        hidden(props) {
            return props.middleState === false
        },
    },
    middleState: {
        type: ControlType.Boolean,
        title: "Middle State",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    top: {
        type: ControlType.Number,
        title: "Top",
        defaultValue: 40,
        min: 0,
        unit: "px",
        step: 4,
        displayStepper: true,
    },
    middle: {
        type: ControlType.Number,
        title: "Middle",
        defaultValue: 360,
        min: 0,
        unit: "px",
        step: 4,
        displayStepper: true,
        hidden(props) {
            return props.middleState === false
        },
    },
    bottom: {
        type: ControlType.Number,
        title: "Bottom",
        defaultValue: 520,
        min: 0,
        unit: "px",
        step: 4,
        displayStepper: true,
    },
    dim: {
        type: ControlType.Color,
        title: "Dim Color",
        defaultValue: "hsla(0, 0%, 0%, 0.25)",
    },
    scrollContent: {
        type: ControlType.Boolean,
        title: "Use Scroll",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
})
