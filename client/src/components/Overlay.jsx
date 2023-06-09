import React from "react"
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
}

function Overlay({ handleConnect, loading }) {
    return loading ? (
        <div className="app__overlay app__overlay--light">
            <ClimbingBoxLoader loading={loading} color="#007bff" />
            <h2>Waiting for a Block to be Mined</h2>
        </div>
    ) : (
        <div className="app__overlay">
            <button onClick={handleConnect} id="connect-btn">
                Connect Your Wallet
            </button>
        </div>
    )
}

export default Overlay
