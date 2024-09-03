import React, {Component} from "react";
import Placeholder from "./Placeholder/Placeholder";
import Div from "./Div/Div";

class ErrorBoundary extends Component {

    state = {
        error: null,
    };

    static getDerivedStateFromError(error: any) {
        return { error };
    }

    render() {
        const { error } = this.state as any;

        if (error) {
            //import("../eruda").then(({ default: eruda }) => {});
            console.error(error);

            return (
                <div style={{ textAlign: "center", marginTop: "15vh" }}>
                    <Div>
                        <Placeholder title="App crash, reload this page" />
                    </Div>
                </div>
            );
        }

        return (this.props as any).children;
    }
}

export default ErrorBoundary;