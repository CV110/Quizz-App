import React from "react"

export default function Settings(props){
    const style={
        backgroundColor: props.isM ? "#59E391" : "white"
    }

    return (
        <div className="categories-container" style={style} onClick={props.marked} >
            <p>{props.category}</p>
        </div>
    )
}