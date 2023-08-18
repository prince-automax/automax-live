// import { CountdownCircleTimer } from 'react-countdown-circle-timer'
// import styles from './timer.module.css';


// // function MyTimer({duration}) {
// //     const timerProps = {
// //       isPlaying: true,
// //       size: 200,
// //       strokeWidth: 10,
// //       duration: duration,
// //       colors: [["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]
// //     };
  
// //     const formatTime = (time) => {
// //       const minutes = Math.floor(time / 60);
// //       const seconds = time % 60;
// //       return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
// //     };
  
// //     return (
// //       <div className="timer-wrapper">
// //         <CountdownCircleTimer {...timerProps} colors="url(#your-unique-id)">
// //           {({ remainingTime }) => formatTime(remainingTime)}
// //         </CountdownCircleTimer>
// //       </div>
// //     );
// //   }
  


// function MyTimer({ duration }) {
//   const timerProps = {
//     isPlaying: true,
//     size: "90vw",
//     strokeWidth: 20,
//     duration: duration,
//     colors: [["#0077FF", 1]],
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   return (
//     <div className="bg-gray-100 flex flex-col justify-center items-center py-16">
//       <div className="bg-white rounded-lg shadow-lg p-4">
//         <CountdownCircleTimer
//           {...timerProps}
//           className="mx-auto"
//           strokeWidth={0}
//         >
//           {({ remainingTime }) => (
//             <div className="flex flex-col items-center">
//               <span className="text-6xl font-bold">{formatTime(remainingTime)}</span>
//               <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Time Left</span>
//             </div>
//           )}
//         </CountdownCircleTimer>
//       </div>
//     </div>
//   );
// }

  
//   export default MyTimer