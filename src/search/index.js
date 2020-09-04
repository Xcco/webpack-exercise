
import React from 'react';
import ReactDOM from 'react-dom';
import './search.less'
import pic from './images/window.png'
class Search extends React.Component {
    render() {
        debugger
        return <div className='search'>searchhhh
            <img src={pic}/>
        </div>
    }
}
ReactDOM.render(
    <Search />,
    document.getElementById('root')
)

const a=[1,2,3]
const b=[...a]
console.log(b)

console.log('search')