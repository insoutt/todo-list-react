import { FC, useEffect, useState } from "react"
import './index.scss'

export interface InputProps {
  initialValue?: string
  placeholder?: string
  testid?: string
  width?: string
  type?: string
  onChange?(value: any): void
  errorMessage?: string
}

export const Input: FC<InputProps> = ({testid, initialValue = '', type = 'text', placeholder, width, onChange = () => { }, errorMessage }) => {

  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleOnChange = (event: any) => {
    const val = event.target.value
    setValue(val)
    onChange(val)
  }

  return (
    <div style={{ width }}>
      <input data-testid={testid} type={type} placeholder={placeholder} value={value} className='input' onChange={handleOnChange}/>
      {errorMessage && <small className="text-danger">
        {errorMessage}
      </small>}
    </div>
  )

}
