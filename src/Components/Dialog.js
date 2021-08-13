import "./Dialog.css"

function Dialog ({ children, visible, header, footer, style }) {

    return (
        visible ?
        <div className="dialog-mask">
            <div className="dialog" style={style}>
                <div className="dialog-header">{header}</div>
                <div className="dialog-content">{children}</div>
                <div className="dialog-footer">{footer}</div>
            </div>
        </div> :
        null
    )
}

export default Dialog