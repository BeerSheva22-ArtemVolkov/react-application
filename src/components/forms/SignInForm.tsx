// TODO - form based on the Material UI template

import { Container, CssBaseline, Box, Typography, TextField, FormControlLabel, Checkbox, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputResult from "../../model/InputResult";
import UserData from "../../model/UserData";
import Alert from "../common/Alert";
import { useRef, useState } from "react";
import { StatusType } from "../../model/StatusType";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/slices/authSlice";

const defaultTheme = createTheme();

type Props = {
    submitFn: (email: string, password: string) => Promise<InputResult>
}

const SignInForm: React.FC<Props> = ({ submitFn }) => {

    const dispatch = useDispatch();
    const [message, setMessage] = useState<string>('');
    const status = useRef<StatusType>("success")

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email: string = data.get('email')!.toString();
        const password: string = data.get('password')!.toString();
        const res = await submitFn(email, password);
        
        if (res.status == "success") {
            dispatch(authActions.set(res.message))
        }
    };

    return (
        <ThemeProvider theme={defaultTheme} >
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        {message && <Alert status={status.current} message={message} />}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default SignInForm