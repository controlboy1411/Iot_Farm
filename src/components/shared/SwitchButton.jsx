import { useEffect, useState } from "react";
import Switch from "react-switch";

const SwitchButton = (props) => {
    const { status } = props
    const [checked, setChecked] = useState(false)

    const handleChange = (checked) => {
        setChecked(!checked)
    }

    useEffect(() => {
        setChecked(status === 'ON' ? true : false)
    }, [status])

    return (
        <label htmlFor="material-switch">
            <Switch
                checked={checked}
                onChange={handleChange}
                onColor="#9fd984"
                onHandleColor="#48872b"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={50}
                className="react-switch"
                id="material-switch"
            />
        </label>
    )
}

export default SwitchButton