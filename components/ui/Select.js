import { Field, ErrorMessage } from 'formik';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Select(props) {


  return (
    <div
      className={
        props.inline
          ? 'sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5'
          : ''
      }>
      {props.label && (
        <label
          htmlFor={props.name}
          className={
            props.inline
              ? 'block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
              : 'text-sm font-medium text-gray-700'
          }>
          {props.label} {props.required && <span className="text-red-500 text-xs">*</span>}
        </label>
      )}
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <Field
          as="select"
          onChange={props.onChange}
          name={props.name}
          id={props.name}
          className={classNames(
            props.inline ? 'max-w-lg py-2' : '',
            'block w-full mt-1 sm:text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md',
            props.width
          )}>
          {props.options.map(option => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}          
        </Field>

        <div className="mt-2 text-xs text-red-600">
          <ErrorMessage name={props.name} />
        </div>
      </div>
    </div>
  );
}

Select.defaultProps = {
  inline: false,
  type: 'text',
  width: 'max-w-lg',
  required:false,
};