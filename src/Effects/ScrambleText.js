import { useState, useEffect, useRef, useCallback } from "react"

//Inspired by: https://codepen.io/soulwire/pen/mErPAK

import "./ScrambleText.css"

function ScrambleText ({ oldText, newText, maxDuration, changeFrequency, randomChars, charClass }) {

    const chars = randomChars || '!<>-_\\/[]{}—=+*^?#________'
    const duration = maxDuration ? maxDuration/2 : 40
    const frequency = changeFrequency || 0.28   //Closer to 1 => more chance of symbol changing each frame
    const symbolClass = charClass || "dud"

    const queue = useRef([])
    const frame = useRef(0)
    const frameRequest = useRef(null)

    const [textOutput, setTextOutput] = useState(oldText)

    const randomChar = useCallback(() => {
        return chars[Math.floor(Math.random() * chars.length)]
    },[chars])

    const update = useCallback(() => {
        let output = []     //this frame string to show. It gets populated char by char each for loop pass. Each character is either: (from: old letter | char: random symbol | to: new letter).
        let complete = 0    //ammount of characters that have reached the end of their unique animation.
        
        for (let i = 0, n = queue.current.length; i < n; i++) {    //update each character

            let { from, to, start, end, char } = queue.current[i]  //char is the current showing random symbol during animation.

            if (frame.current >= end) {
                //This letter is done, show the final character and add it to the completed letters counter.
                complete++
                output.push(to)
            }
            else if (frame.current >= start) {
                //Start or continue the scramble animation in this caracter.
                if (!char || Math.random() < frequency) {    //if there's no char yet (first frame of animation) or "frequency" chance of changing the current one.
                    char = randomChar()
                    queue.current[i].char = char
                }

                output.push(<span className={symbolClass}>{char}</span>)    //add styling to the random symbol with "dud" class
            }
            else {
                //The animation hasn't even started yet. Show the old letter until we reach the random start frame for this character.
                output.push(from)
            }
        }

        //Update the text displayed with the new set of chars
        setTextOutput(output)

        if (complete < queue.current.length) {   //all characters have reached the final letter.
            //continue with the animation
            frameRequest.current = requestAnimationFrame(update)  //wait for the next animation frame and call update again (60 fps)
            frame.current++    //advance to the next frame
        }
    },[frequency, randomChar, symbolClass])

    useEffect(()=>{
        console.log("hola")
        queue.current = []  //{from/to: start/ending character | start/end: frame to start/end animation} An object for each character.
        
        const length = Math.max(oldText.length, newText.length) //The longer one to animate to or from it.
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ''   //if the old text is shorter, then I want to go from nothing to the new character.
            const to = newText[i] || ''     //if the new text is shorter, I want to go from a letter to nothing.
            const start = Math.floor(Math.random() * duration)        //from frame 0 to half max duration choose a random starting position so not every character starts animating at the same time.
            const end = start + Math.floor(Math.random() * duration)  //the animation may last anywhere between  0 and maxDuration frames
            
            queue.current.push({ from, to, start, end })
        }

        cancelAnimationFrame(frameRequest.current) //overwrite animation if I call a new one.
        frame.current = 0  //resetting the current animation frame
        update()   //start animation
    },[newText, oldText, duration, update])

    return (
        <span>{textOutput}</span>
    )
}

export default ScrambleText