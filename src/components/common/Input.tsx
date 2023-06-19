import { useEffect, useRef, useState } from "react"
import InputResult from "../../model/InputResult"

type Props = {
    submitFn: (inputText: string) => InputResult
    placeholder: string
    buttonTitle?: string
    type?: string
}

const Input: React.FC<Props> = ({ submitFn, placeholder, buttonTitle, type }) => {

    const inputElementRef = useRef<HTMLInputElement>(null) // получаю ссылку на элемент
    const [disabled, setDisabled] = useState<boolean>(true)
    const [showMessage, setShowMessage] = useState<boolean>()
    const [status, setStatus] = useState<InputResult>()

    function onClickFn() {
        setStatus(submitFn(inputElementRef.current!.value));
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 1000)
    }

    function onChangeFn() {
        setDisabled(!inputElementRef.current?.value)
    }

    return (
        <>
            <div>
                <input
                    type={type || 'text'}
                    placeholder={placeholder}
                    ref={inputElementRef}
                    onChange={onChangeFn}
                />
                <button
                    onClick={onClickFn}
                    disabled={disabled}
                >{buttonTitle || 'GO'}</button>
            </div>
            {showMessage && <label style={{backgroundColor: status?.status == "error" ? "red" : status?.status == "warning" ? "yellow" : "green"}}>{status?.message}</label>}
        </>
    )
}

export default Input