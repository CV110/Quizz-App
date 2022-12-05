import React from "react"
import {nanoid} from "nanoid"
export default function Quizz(props){
    
    function decodeHtml(html) {
        let txt = document.createElement('textarea')
        txt.innerHTML = html
        return txt.value
    }

    const answersArray = props.answers.map(s => {
        let a = s.status ? "#59E391" : s.isWrong ? "#E64945" : "white"
        const style = {
            backgroundColor: a
        }
        const i = nanoid()
        return <p className="options" 
            key={i} 
            style={style} 
            onClick={() => props.answerC(s.id, props.id)}>{decodeHtml(s.val)}
            </p>
    })
    return (
        <div className="question-container">
            <h3>{decodeHtml(props.question)}</h3>
            <div className="options-container">
                {answersArray}
            </div>
        </div>
    )
}