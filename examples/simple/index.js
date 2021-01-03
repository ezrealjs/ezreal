import React from 'react'
import ReactDom from 'react-dom'
import './index.scss'

export default function App() {
    return <div>
        Hello Ezreal App ~
    </div>
}

ReactDom.render(<App />, document.getElementById('app'))