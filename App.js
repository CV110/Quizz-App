import React from "react"
import data from "./data"
import Settings from "./Components/Settings"
import Quizz from "./Components/Quizz"
import {nanoid} from "nanoid"
export default function App(){
    
    const [isLoading, setIsLoading] = React.useState(false)
    const [isNoData, setIsNoData] = React.useState(false)
    const [isStart, setIsStart] = React.useState(true)
    const [answersChecked, setAnswersChecked] = React.useState(false)
    const [settings, setSettings] = React.useState(data)
    const [score, setScore] = React.useState(0)
    const [qa, setQa] = React.useState([])
    const [choice, setChoice] = React.useState({
        questions: 5,
        category: "",
        difficulty: "medium",
        type: ""
    })
    
    function markQuestions(id){
        let num
        setSettings(prevSett => {
            const q = prevSett.questions.map(el => {
            if(el.id === id){
                num = el.num
                return {...el, on: true}
            } else { return { ...el, on: false} }
            })  
            return {
                ...prevSett,
                questions: q
            }
        })
        setChoice(prevChoise => ({...prevChoise, questions: num}))
    }
    function markCategories(id){
        setSettings(prevSett => {
            const num = []
            const c = prevSett.categories.map(el => {
            if(el.id === id){
                for(let i=0; i< el.id.length; i++) {    
                    num.push(el.id[i])
                }
                const randomCategory = Math.floor(Math.random()*num.length)
                setChoice(prevChoise => ({...prevChoise, category: `${num[randomCategory]}`}))
                return {...el, on: true}
            } else { return { ...el, on: false} }
            })  
            return {
                ...prevSett,
                categories: c
            }
        })  
    }
    function markType(id){
        let type
        setSettings(prevSett => {
            const t = prevSett.type.map(el => {
            if(el.id === id){
                type = el.typ
                return {...el, on: true}
            } else { return { ...el, on: false} }
            })  
            return {
                ...prevSett,
                type: t
            }
        })
        setChoice(prevChoise => ({...prevChoise, type: type}))
    }
    function markDifficulty(id){
        let diff
        setSettings(prevSett => {
            const d = prevSett.difficulty.map(el => {
            if(el.id === id){
                diff = el.diff
                return {...el, on: true}
            } else { return { ...el, on: false} }
            })  
            return {
                ...prevSett,
                difficulty: d
            }
        })
        setChoice(prevChoise => ({...prevChoise, difficulty: diff}))
    }

    const queArray = settings.questions.map(cat => <Settings 
        category={cat.num} 
        key={cat.id} 
        marked={() => markQuestions(cat.id)}
        isM={cat.on}
    />)
    const catArray = settings.categories.map(cat => <Settings 
        category={cat.title} 
        key={cat.id[0]} 
        marked={()=>markCategories(cat.id)}
        isM={cat.on}
    />)
    const difArray = settings.difficulty.map(cat => <Settings
        category={cat.diff} 
        key={cat.id} 
        marked={()=>markDifficulty(cat.id)}
        isM={cat.on}
        
    />)
    const typArray = settings.type.map(cat => <Settings 
        category={cat.typ} 
        key={cat.id} 
        marked={()=>markType(cat.id)}
        isM={cat.on}
    />)

    React.useEffect(() => {
        setIsLoading(true)
        fetch(`https://opentdb.com/api.php?amount=${choice.questions}&category=${choice.category === "8" ? "" : choice.category}&difficulty=${choice.difficulty}&type=${choice.type === "All" ? "" : choice.type}`)
            .then(res => res.json())
            .then(data => {
                setQa(data.results.map(q => {
                    const wrongArr = q.incorrect_answers.map(el => ({
                        val: el,
                        status: false,
                        id: nanoid(),
                        isWrong: false
                }))
                    return {
                        question: q.question,
                        correct: q.correct_answer,
                        all: [{
                            val: q.correct_answer,
                            status: false,
                            id: nanoid(),
                            isWrong: false},
                            ...wrongArr
                            ].sort((a, b) => 0.5 - Math.random()),
                        id: nanoid()
            }}))
            setIsLoading(false)
            if(data.results.length === 0) {
                setIsNoData(true)
                setChoice({
                    questions: 5,
                    category: "",
                    difficulty: "medium",
                    type: ""
                })
            }
        })
    }, [isStart])

    const questionsComponents = qa.map(q => {
        const uidd = nanoid()
        return (<Quizz 
            question={q.question} 
            answers={q.all} 
            key={uidd} 
            correct={q.correct}
            id={q.id}
            solutions={answersChecked} 
            answerC={answerC}
            />
        )
    }) 
    
    function answerC(id, idContainer){
        if(!answersChecked){
           setQa(prev => prev.map(el=> {
            if(idContainer === el.id){
              const valArr = el.all.map(e => {
                if(e.id === id) {
                    return {...e, status: true, isWrong: true}
                } else {
                    return {...e, status: false, isWrong: false}
                } 
            })  
            return {...el, all: valArr}  
            } else { return el }
            })) 
        } 
    }
    
    function checkAnswers(){
        setScore(qa.length)
        setQa(prev => prev.map(el => {
            const ar = el.all.map(e => {
                if(el.correct === e.val) {
                    if(!e.status) {
                      setScore(prev => prev - 1)  
                    }
                    return {...e, status: true, isWrong: false}
                } else if(e.isWrong) {
                    return {...e, status: false, isWrong: true}
                } else {
                    return e
                }
            })
            return {...el, all: ar}
        }))
        setAnswersChecked(true)
    }
    return (
        <main>
            { isStart ?
                <div className="start-container">
                    <h1>Quizz Game</h1>
            
                    {/* Number of questions */}
                    <div className="categories">
                        <h4>Questions: </h4>
                        {queArray}
                    </div>
                    {/* Categories */}
                    <div className="categories">
                        <h4>Categories: </h4>
                        {catArray}
                    </div>
                    {/* Difficulty */}
                    <div className="categories">
                        <h4>Difficulty: </h4>
                        {difArray}
                    </div>
                    {/* Type of questions */}
                    <div className="categories">
                        <h4>Type: </h4>
                        {typArray}
                    </div>
                    <button onClick={() => setIsStart(!isStart)}>Start Quiz!</button>
                </div>
                : isLoading ? <div className="loading">
                <i className="fa-sharp fa-solid fa-spinner"></i>
                <p>Loading...</p>
                </div> : isNoData ? <div className="nodata">
                <h2>Oops!</h2>
                <p>There aren't enough questions for that Category/ Type/ Difficulty</p>
                <h3>Please try again.</h3>
                <button className="checkQuizz" onClick={() => {
                        setAnswersChecked(false)
                        setIsNoData(false)
                        setScore(0)
                        setIsStart(prev => !prev)}}>Play Again</button>
                </div> :
                <div className="quizz">
                    <div className="quizz-container">
                        {questionsComponents}
                    </div>
                    {answersChecked ? <div className="score-container">
                    <p>You scored {score}/{qa.length} questions.</p> 
                    <button className="checkQuizz" onClick={() => {
                        setAnswersChecked(false)
                        setIsNoData(false)
                        setScore(0)
                        setIsStart(prev => !prev)}}>Play Again</button>
                    </div>
                    : <button className="checkQuizz" onClick={checkAnswers}>Check Answers</button>
                    }
                </div>
            }
        </main>
    )
}