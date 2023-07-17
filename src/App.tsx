import { MouseEvent, useState } from 'react'

import clipboardIcon from './assets/clipboard.svg'
import './App.css'
import { formatNumberWithComma, includesValue } from './util';
import { CalcOp, addDot, addValue, percentage, switchSign } from './calc';

const BOARD = [
  ["ac", "±", "%", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", "", ".", "="],
]

const OPERATORS = ["/", "*", "-", "+"]; // 演算子一覧
type Value = string | null



function App() {
  const [value, setValue] = useState<Value>(null)
  const [sum, setSum] = useState<Value>(null)
  const [operator, setOperator] = useState<Value>(null)
  const [clickedOperator, setClickedOperator] = useState<Value>(null)
  const [temporaryValue, setTemporaryValue] = useState<Value>(null)
  const [clipped, setClipped] = useState(false)

  const copyToClipboard = async () => {
    const win = window as any
    await win.electron.clipboard.writeText(value || sum || "0", "clipboard")
    setClipped(true);
    setTimeout(() => { setClipped(false) }, 1500)
  };
  // クリックイベント
  const handleClick = (e: MouseEvent) => {
    const action = e.currentTarget.getAttribute('data-item');
    if (!action) {
      return
    }
    setClickedOperator(null)

    // 数字をクリック
    if (!isNaN(Number(action))) {
      setTemporaryValue(null)
      setValue(value => addValue(value, action));
      setClickedOperator(null)
      return;
    };

    // 演算子をクリック
    if (includesValue(OPERATORS, action)) {
      setValue(null)
      setOperator(action)
      setSum(CalcOp(action, sum, value))
      setTemporaryValue(temporaryValue => value || temporaryValue)
      setClickedOperator(action)
      return
    }

    // その他アクション
    ({
      "ac": () => {
        if ((value !== "0" && (value || (clickedOperator && clickedOperator !== "=")))) {
          setValue("0")
          return
        }
        setSum(null)
        setOperator(null)
      },
      "±": () => { setValue(switchSign(value || sum)) },
      "%": () => { setValue(percentage(value || sum)) },
      ".": () => { setValue(addDot(value || sum)) },
      "=": () => {
        setValue(null);
        setSum(CalcOp(operator || "=", sum, value || temporaryValue))
        setTemporaryValue(temporaryValue => value || temporaryValue)
        setClickedOperator(action)
      }
    })[action]!();

  }
  const mapTr = BOARD.map((row, index) => (
    <div className='tr' key={"calc_tr_" + index} >
      {row.map((td => (
        <span
          key={"calc_" + td}
          data-item={td}
          onClick={handleClick}
          className={td === "" ? "event_none" : td === clickedOperator ? "selected" : ""}>
          {td === "ac" && (value !== "0" && (value || (clickedOperator && clickedOperator !== "="))) && "c" || td}
        </span>
      )))}</div>
  ))
  return (
    <>
      <div className='calc'>
        <div className='copy'>
          {clipped && <div className='copied'>コピーしました</div>}
          <button onClick={copyToClipboard} > <img src={clipboardIcon} alt="" /> </button>
        </div>
        <div className='calc_display'>{formatNumberWithComma(value || sum || "0")} </div>
        {mapTr}
      </div>
    </>
  )
}

export default App
