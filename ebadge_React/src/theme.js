import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

export const TRANSITION_DURATION = 250;

const theme = createTheme({
    palette: {
        primary: {
            main: "#3949B5",
        },
        secondary: {
            main: "#FAC710",
        },
    },
    typography: {
        fontFamily: ["Barlow", "sans-serif"].join(","),
    },
    components: {
        MuiDialog: {
            defaultProps: {
                TransitionProps: {
                    duration: TRANSITION_DURATION,
                },
            },
        },
    },
});

export default function DefaultTheme({ children }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}