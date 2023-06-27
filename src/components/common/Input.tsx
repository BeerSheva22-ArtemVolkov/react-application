import { useEffect, useRef, useState } from "react"
import InputResult from "../../model/InputResult"
import Alert from "./Alert"
import { StatusType } from "../../model/StatusType"
import "./Input.css"
import { Button, TextField } from "@mui/material"

type Props = {
    submitFn: (inputText: string) => InputResult
    placeholder: string
    buttonTitle?: string
    type?: string
}

const Input: React.FC<Props> = ({ submitFn, placeholder, buttonTitle, type }) => {

    // const inputElementRef = useRef<HTMLInputElement>(null) // получаю ссылку на элемент
    const inputElementRef = useRef<any>(null)
    const [disabled, setDisabled] = useState<boolean>(true)
    const [message, setMessage] = useState<string>('');
    const status = useRef<StatusType>("success")

    function onClickFn(event: any) {
        const res = submitFn(inputElementRef.current!.value)
        status.current = res.status;
        if (res.status === "success"){
            inputElementRef.current!.value = ''
        }
        setMessage(res.message || '');
        setTimeout(() => setMessage(''), 5000)
    }

    function onChangeFn(event: any) {
        // console.log(event.target.nodeValue);
        inputElementRef.current = event.target as any
        setDisabled(!inputElementRef.current?.value)
        // setDisabled(!event.traget.value)
    }

    return (
        <>
            <div>
                <TextField
                    size="small"
                    type={type || 'text'}
                    placeholder={placeholder}
                    ref={inputElementRef}
                    onChange={onChangeFn}
                />
                <Button
                    onClick={onClickFn}
                    disabled={disabled}
                >{buttonTitle || 'GO'}</Button>
            </div>
            {message && <Alert status={status.current} message={message} />}
        </>
    )
}

export default Input