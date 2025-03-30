const ProgressBar = ({ progress, color = "teal" }) => {
    const colorClasses = {
      teal: "bg-teal-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500"
    };
  
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${colorClasses[color]}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };
  
  export default ProgressBar;