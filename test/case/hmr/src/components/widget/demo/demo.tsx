import * as React from 'react'
import { DemoProps } from './types'
import { CircleBox } from './styled'

import './demo.scss'


interface IState {
  type: number
}

export class Demo extends React.Component<DemoProps, IState> {
  constructor (props: DemoProps) {
    super(props)
    this.state = {
      type: 0
    }
  }
  public componentDidMount () {
    let padding = 0
    const runner = () => {
      this.setState({
        type:  ++padding % 4
      })
    }
    setInterval(runner, 1000)
    runner()
  }
  public render () {
    return (
      <CircleBox>
        <img
          className={`demo-circlebox__img demo-circlebox__img--type${this.state.type}`}
          alt=''
          src={require('./images/logo.png')}
        />
        {/* step02 - 修改对应这个 */}
        <div className='page-index__tl'>{this.props.title}{this.state.type}</div>
      </CircleBox>
    )
  }
}
