import { OverlayView, OverlayViewF } from "@react-google-maps/api";
import React, { useContext } from "react";
import { CenterContext } from "../../../contexts/CenterContext";

interface CircleMarkerWithTextProps {
    position: google.maps.LatLngLiteral;
    text: string;
}

const CircleMarkerWithText: React.FC<CircleMarkerWithTextProps> = ({
    position,
    text,
}) => {
    const { updateZoom, updateCenter } = useContext(CenterContext);
    const number = parseInt(text);

    function handleClusterClick() {
        updateCenter(position);
        updateZoom(15);
    }

    const backgroundColor = number < 4 ? "blue" : "red";

    return (
        <>
            <OverlayViewF
                position={position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
                <div
                    onClick={handleClusterClick}
                    style={{
                        position: "absolute",
                        cursor: "pointer",
                        width: "45px",
                        height: "45px",
                        textAlign: "center",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <div
                        style={{
                            width: "45px",
                            height: "45px",
                            backgroundColor,
                            borderRadius: "100%",
                            opacity: 0.5,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "white",
                        }}
                    >
                        {text}
                    </div>
                </div>
            </OverlayViewF>
        </>
    );
};

export default CircleMarkerWithText;
