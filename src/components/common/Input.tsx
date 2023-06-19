import { useEffect, useRef, useState } from "react"
import InputResult from "../../model/InputResult"
import Alert from "./Alert"
import { StatusType } from "../../model/StatusType"
import "./Input.css"

type Props = {
    submitFn: (inputText: string) => InputResult
    placeholder: string
    buttonTitle?: string
    type?: string
}

const Input: React.FC<Props> = ({ submitFn, placeholder, buttonTitle, type }) => {

    const inputElementRef = useRef<HTMLInputElement>(null) // получаю ссылку на элемент
    const [disabled, setDisabled] = useState<boolean>(true)
    const [message, setMessage] = useState<string>('');
    const status = useRef<StatusType>("success")

    function onClickFn() {
        const res = submitFn(inputElementRef.current!.value)
        status.current = res.status;
        if (res.status === "success"){
            inputElementRef.current!.value = ''
        }
        setMessage(res.message || '');
        setTimeout(() => setMessage(''), 1000)
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
                    className="app-class"
                    onClick={onClickFn}
                    disabled={disabled}
                >{buttonTitle || 'GO'}</button>
            </div>
            {message && <Alert status={status.current} message={message} />}
        </>
    )
}

export default Input