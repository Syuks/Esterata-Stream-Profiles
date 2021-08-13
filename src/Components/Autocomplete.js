import "./Autocomplete.css"

function Autocomplete ({value, onChange, suggestions, field, placeholder, itemTemplate}) {

    return (
        <div className="autocomplete">
            <input type="search" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
            <div className="dropdown">
                {suggestions.map((item, index) => {
                    return (
                        <button
                            key={index}
                            onMouseDown={() => onChange(item[field])}
                        >
                            {itemTemplate(item)}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Autocomplete