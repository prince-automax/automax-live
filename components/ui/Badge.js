export default function Badge(props) {
    const colorsTable = {
        gray: 'bg-gray-100 text-gray-800',
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        blue: 'bg-blue-100 text-blue-800',
        indigo: 'bg-indigo-100 text-indigo-800',
        black: 'bg-gray-900 text-gray-100',
    };

    const colorMapper = color => colorsTable[color] || colorsTable['green'];
    return (
        <>
            <span
                className={` ${colorMapper(
                    props.color
                )} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  `}>
                {props.label}
            </span>
        </>
    );
}
