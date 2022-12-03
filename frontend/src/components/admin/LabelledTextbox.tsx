import "../../style/labelledTextbox.css";

const LabelledTextbox = ({ label = "", value }) => {

    const padding = label ? "0px 10px 15px 10px" : "10px 10px 10px 10px";

    return (
        <fieldset className='labelledTextbox' style={{ padding }}>
            {label && <legend>{label}</legend>}
            <span>{value}</span>
        </fieldset>
    );
};

export default LabelledTextbox;