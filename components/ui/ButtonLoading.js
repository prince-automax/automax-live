import * as HIcons from '@heroicons/react/outline';
import FeatherIcon from 'feather-icons-react';

const DynamicHeroIcon = props => {
    const { ...icons } = HIcons;
    const TheIcon = icons[props.icon];
    return <TheIcon {...props} />;
};

export default function Button(props) {

    
    
    const colorsTable = {
        white: 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300',
        indigo: 'text-white bg-indigo-600 hover:bg-indigo-700 border-transparent',
        green: 'text-white bg-green-600 hover:bg-green-700 border-transparent',
        red: 'text-white bg-red-600 hover:bg-red-700 border-transparent',
        purple: 'text-white bg-purple-600 hover:bg-purple-700 border-transparent',
        light: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border-transparent',
    };

    const colorMapper = color => colorsTable[color] || colorsTable['indigo'];

    return (
        <button
            type="button"
            className={` ${colorMapper(
                props.color
            )} inline-flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none ${props.btnclass
                }`}
            {...props}>

            {props.loading ?
                <>
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </>
                : <>
                    {props.icon && (
                        <DynamicHeroIcon icon={props.icon} className="-ml-1 mr-2 h-5 w-5" />
                    )}
                    {props.ficon && (
                        <FeatherIcon icon={props.ficon} className="-ml-1 mr-2 h-5 w-5" />
                    )}
                    {props.children}
                </>}
        </button>
    );
}

Button.defaultProps = {
    label: 'Submit',
    loading: false
};
