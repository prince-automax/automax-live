import TextInput from "./TextInput";
import TextInputWithChange from "./TextInputWithChange";
import Select from "./Select";
import CheckboxGroup from "./CheckboxGroup";
import DateTimeInput from "./DateTimeInput";
import TextArea from "./TextArea";

function FormField(props) {

  // console.log("PROPS",props);
  const { field, ...rest } = props;
  switch (field) {
    case "input":
      return <TextInput {...rest} />;
    case "inputWithChange":
      return <TextInputWithChange {...rest} />;
    case "textarea":
      return <TextArea {...rest} />;
    case "select":
      return <Select {...rest} />;
    case "checkboxGroup":
      return <CheckboxGroup {...rest} />;
    case "date":
      return <DateTimeInput {...rest} />;
    default:
      return null;
  }
}

export default FormField;
