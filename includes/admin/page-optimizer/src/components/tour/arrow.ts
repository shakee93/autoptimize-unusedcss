
const opositeSide = {
    top: "bottom",
    bottom: "top",
    right: "left",
    left: "right",
    custom: 'custom'
};

export const doArrow = (position:  keyof typeof opositeSide, verticalAlign: any, horizontalAlign : keyof typeof opositeSide, isDark : boolean ) => {
    if (!position || position === "custom") {
        return {};
    }

    const width = 18;
    const height = 10;
    const color = isDark ? "rgb(43, 43, 43, 0.65)" : "rgb(255, 255, 255, .7)";
    const isVertical = position === "top" || position === "bottom";
    const spaceFromSide = 10;

    const obj = {
        [`--rtp-arrow-${
            isVertical ? opositeSide[horizontalAlign] : verticalAlign
        }`]: height + spaceFromSide + "px",
        [`--rtp-arrow-${opositeSide[position]}`]: -height + "px",
        [`--rtp-arrow-border-${isVertical ? "left" : "top"}`]: `${
            width / 2
        }px solid transparent`,
        [`--rtp-arrow-border-${isVertical ? "right" : "bottom"}`]: `${
            width / 2
        }px solid transparent`,
        [`--rtp-arrow-border-${position}`]: `${height}px solid ${color}`,
    };
    return obj;
}