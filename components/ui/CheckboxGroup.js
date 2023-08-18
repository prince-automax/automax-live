import { Field, ErrorMessage } from 'formik';
export default function CheckboxGroup(props) {
  return (
    <fieldset>
      <div className="mt-4">
        <Field name={props.name}>
          {({ field }) => {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {props.options.map(option => {
                  return (
                    <label
                      key={option.value}
                      className="relative px-6 border border-gray-200 rounded flex items-start py-4 cursor-pointer">
                      <div className="min-w-0 flex-1 text-sm">
                        <div className="font-medium text-gray-700 select-none">
                          {option.label}
                        </div>
                      </div>
                      <div className="ml-3 flex items-center h-5">
                        <input
                          {...field}
                          type="checkbox"
                          id={option.value}
                          value={option.value}
                          checked={
                            field.value &&
                            field.value.includes(option.value.toString())
                          }
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                    </label>
                  );
                })}
              </div>
            );
          }}
        </Field>
        <div className="mt-2 text-xs text-red-600">
          <ErrorMessage name={props.name} />
        </div>
      </div>
    </fieldset>
  );
}

CheckboxGroup.defaultProps = {
  name: '',
  grid: false,
  options: [],
};
