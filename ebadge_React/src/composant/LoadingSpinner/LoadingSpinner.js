import React from "react";
import { Oval } from "react-loader-spinner";
//Proviens de https://loading.io/css/
class LoadingSpinner extends React.Component {
    render() {
        return (
            <Oval
                height={80}
                width={80}
                color="#3949B5"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor='#3949B5'
                strokeWidth={2}
                strokeWidthSecondary={2}

            />
        )
    }
}

export default LoadingSpinner;