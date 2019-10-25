import { Override, Data, motionValue } from "framer"

const data = Data({
    setSheetPosition: "",
    numSheetUpdate: 0,
    isScrollingHourlyForcast: false,
    isSearching: false,
    currentPage: 0,
})

export function TrackScroll(): Override {
    return {
        onScrollStart() {
            data.isScrollingHourlyForcast = true
        },
        onScrollEnd() {
            data.isScrollingHourlyForcast = false
        },
    }
}

export function Page(): Override {
    return {
        currentPage: data.currentPage,
        onChangePage(current, previous) {
            console.log(current, previous)
            data.currentPage = current
        },
    }
}

export function BottomSheet(props): Override {
    const { bottom, top } = props
    return {
        lockOnScroll: data.isScrollingHourlyForcast,
        setSheetPosition: data.setSheetPosition,
        numSheetUpdate: data.numSheetUpdate,
        // animate: { top: data.currentPage === 1 ? 173 : top },
    }
}

export function DataSheet(props): Override {
    const { bottom, top } = props
    const intViewportWidth = window.innerWidth
    return {
        width: intViewportWidth,
        animate: { top: data.currentPage === 1 ? 173 : top },
    }
}

export function SearchField(props): Override {
    return {
        // animate: {
        //     opacity: data.currentPage == 1 ? 1 : 0,
        //     x: data.currentPage == 1 ? 0 : 20,
        // },
        // transition: {
        //     delay: 0.1,
        //     ease: "easeInOut",
        // },
    }
}

export function Loading(): Override {
    return {}
}

export function GoToSearch(): Override {
    return {
        onTap() {
            data.currentPage = 1
        },
        animate: { scale: data.currentPage === 1 ? 0 : 1 },
    }
}

export function GoBack(): Override {
    return {
        animate: { scale: data.currentPage == 1 ? 1 : 0 },
        transition: {
            delay: 0.2,
        },
        onTap() {
            data.currentPage = 0
        },
    }
}
