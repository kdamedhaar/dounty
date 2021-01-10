import React from "react"
import Loader from "react-loader-spinner"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export default function Spinner({ text, top }) {
  return (
    <div style={{ paddingTop: top || 200 }}>
      <Loader type="BallTriangle" color="#f3f3f3" height={100} width={100} />
      <h3 style={{ color: "#f3f3f3" }}>{text ? text : "Loading ..."}</h3>
    </div>
  )
}
