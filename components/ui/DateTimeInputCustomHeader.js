import { Field, ErrorMessage } from 'formik';
import * as HIcons from '@heroicons/react/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DynamicHeroIcon = props => {
  const { ...icons } = HIcons;
  const TheIcon = icons[props.icon];

  return <TheIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />;
};
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DateTimeInput(props) {
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
          {props.label}
        </label>
      )}

      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div className="relative">
          {props.icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DynamicHeroIcon icon={props.icon} />
            </div>
          )}
          <Field name={props.name}>
            {({ form, field }) => {
              const { setFieldValue } = form;
              const { value } = field;
              const years = range(1990, getYear(new Date()) + 1, 1);
              const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              return (
                <DatePicker
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div
                      style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                        {"<"}
                      </button>
                      <select
                        value={getYear(date)}
                        onChange={({ target: { value } }) => changeYear(value)}
                      >
                        {years.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <select
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) =>
                          changeMonth(months.indexOf(value))
                        }
                      >
                        {months.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                        {">"}
                      </button>
                    </div>
                  )}


                  autoComplete="off"
                  id={props.name}
                  selected={value}
                  className={classNames(
                    props.inline ? 'max-w-lg py-2' : '',
                    props.icon ? 'pl-10' : '',
                    'block mt-1 w-full sm:text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md',
                    props.width
                  )}
                  onChange={val => setFieldValue(props.name, val)}
                  placeholderText={props.placeholder}
                  isClearable
                  {...props}
                />


              )
            }}
          </Field>
        </div>
        <div className="mt-2 text-xs text-red-600">
          <ErrorMessage name={props.name} />
        </div>
      </div>
    </div>
  );
}

DateTimeInput.defaultProps = {
  inline: false,
  type: 'text',
  placeholder: 'Select date',
  width: 'max-w-lg',
};
